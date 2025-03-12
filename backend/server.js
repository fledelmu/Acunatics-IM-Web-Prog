import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Test Endpoint
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Process Tab
// Process - Production
app.post("/api/process-production", async (req, res) =>{
  const {vat, total_weight, start_weight, end_weight} = req.body
  const now = new Date().toISOString();

  try{
    await db.query("START TRANSACTION")

    const [vatResult] = await db.query("SELECT vat_num FROM vat WHERE vat_name = ?", [vat]);

    let vatNum
    if (vatResult.length > 0) {
        vatNum = vatResult[0].vat_num
    } else {
        const [addVat] = await db.query("INSERT INTO vat (vat_name) VALUES (?)", [vat])
        vatNum = addVat.insertId; 
    }


    const[addBatch] = await db.query(`INSERT INTO batch (vat_num, date) VALUE (?,?)`, [vatNum, now])
    const batch_ref = addBatch.insertId

    const[addTotalWeight] = await db.query(`INSERT INTO batch_details (batch_id, weight) VALUES (?,?)`, [batch_ref, total_weight])
    const details_ref = addTotalWeight.insertId


    const[addStartWeight] = await db.query(`INSERT INTO antala (batch_details_id, weight) VALUES (?,?)`, [details_ref, start_weight])
    const antala_ref = addStartWeight.insertId

    const[addEndWeight] = await db.query(`INSERT INTO antala_final (antala_id, weight) VALUES (?, ?)`, [antala_ref, end_weight])

    await db.query("COMMIT")
    res.status(201).json({ message: "Production process recorded successfully" })
  } catch (error){
    res.status(500).json({ message: "Error inserting records", error: error.message })
  }
})

// Process - Delivery
app.post("/api/process-delivery", async (req, res) => {
  const { type, target, location, order_items, date, quantity, price } = req.body;
  const now = new Date().toISOString();

  console.log("Request body:", req.body);

  try {
    await db.query("START TRANSACTION");

    let clientId = null;
    let branchId = null;
    let orderId = null;
    let orderDetailsId = null;

    if (type === "Client") {
      console.log("Checking client:", target);
      const [clientResult] = await db.query("SELECT client_id FROM client WHERE name = ?", [target]);
      console.log("Client result:", clientResult);

      if (clientResult.length > 0) {
        clientId = clientResult[0].client_id;
        console.log("Client ID found:", clientId);
      } else {
        const [addClient] = await db.query("INSERT INTO client (name) VALUES (?)", [target]);
        clientId = addClient.insertId;
        console.log("New client ID:", clientId);
      }
    } else if (type === "Outlet") {
      console.log("Checking branch:", target);
      const [branchResult] = await db.query("SELECT branch_id FROM branch WHERE location = ?", [target]);
      console.log("Branch result:", branchResult);

      if (branchResult.length > 0) {
        branchId = branchResult[0].branch_id;
        console.log("Branch ID found:", branchId);
      } else {
        const [addBranch] = await db.query("INSERT INTO branch (location) VALUES (?)", [target]);
        branchId = addBranch.insertId;
        console.log("New branch ID:", branchId);
      }
    }

    if (!clientId && !branchId) {
      console.error("Client or Branch ID is not provided");
      throw new Error("Client or Branch must be provided");
    }

    // Ensure the inventory item exists
    const [inventoryResult] = await db.query("SELECT inventory_id FROM inventory WHERE inventory_id = ?", [order_items]);
    if (inventoryResult.length === 0) {
      throw new Error("Inventory item does not exist");
    }

    const subtotal = quantity * price;
    const [addOrderDetails] = await db.query(
      `INSERT INTO order_details (inventory_id, quantity, subtotal) VALUES (?, ?, ?)`,

      [order_items, quantity, subtotal]
    );
    orderDetailsId = addOrderDetails.insertId;
    console.log("New order details ID:", orderDetailsId);

    const [addOrder] = await db.query(
      `INSERT INTO orders (manager_id, date, order_details) VALUES (?, ?, ?)`,

      [null, date, orderDetailsId] // Assuming manager_id is null for now
    );
    orderId = addOrder.insertId;
    console.log("New order ID:", orderId);

    if (clientId) {
      const [addDelivery] = await db.query(
        `INSERT INTO delivery (client_id, order_id, location, date) VALUES (?, ?, ?, ?)`,

        [clientId, orderId, location, date]
      );
      const delivery_ref = addDelivery.insertId;
      console.log("New delivery ID:", delivery_ref);
    } else if (branchId) {
      const [addDelivery] = await db.query(
        `INSERT INTO delivery (branch_id, order_id, location, date) VALUES (?, ?, ?, ?)`,

        [branchId, orderId, location, date]
      );
      const delivery_ref = addDelivery.insertId;
      console.log("New delivery ID:", delivery_ref);
    }

    await db.query("COMMIT");
    res.status(201).json({ message: "Delivery process recorded successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error processing delivery:", error);
    res.status(500).json({ message: "Error processing delivery", error: error.message });
  }
});



// Records Tab
app.get("/api/production-records", async (req, res) => {

  try {
    const [productionRecords] = await db.query(` 
      SELECT 
        b.batch_id AS batch_id, 
        b.batch_id AS batch_id, 
        b.vat_num, 
        bd.weight AS total_weight, 
        a.weight AS starting_weight, 
        af.weight AS final_weight, 
        b.date
      FROM batch b
      JOIN batch_details bd ON b.batch_id = bd.batch_id
      JOIN antala a ON bd.batch_details_id = a.batch_details_id
      JOIN antala_final af ON a.antala_id = af.antala_id
      ORDER BY b.date
    `);
    
    res.json(productionRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/delivery-records", async (req, res) => {
  const { order = "ASC" } = req.query;
  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  try {
    const [deliveryRecords] = await db.query(`
      SELECT 
        d.delivery_id, 
        c.name AS client_name, 
        d.location, 
        d.date, 
        od.quantity, 
        od.subtotal
      FROM delivery d
      JOIN client c ON d.delivery_id = c.client_id
      JOIN order_details od ON d.delivery_id = od.order_id
      JOIN client c ON d.client_id = c.client_id
      JOIN order_details od ON d.id = od.delivery_id
      ORDER BY d.date ${sortOrder}
    `);
    res.json(deliveryRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/supply-records", async (req, res) => {
  const { order = "ASC" } = req.query;
  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  try {
    const [supplyRecords] = await db.query(`
      SELECT 
        s.supply_id, 
        sp.name AS supplier_name, 
        s.date, 
        sd.unit, 
        sd.quantity, 
        sd.price
      FROM supply s
      JOIN supplier sp ON s.supplier_id = sp.supplier_id
      JOIN supply_details sd ON s.supply_id = sd.supply_id
      ORDER BY s.date ${sortOrder}
    `);
    res.json(supplyRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


//Manage - Managers


app.post("/api/add-manager", async (req, res) => {
  const { name, contact } = req.body

  try{
    await db.query("START TRANSACTION")

    const [nameResult] = await db.query("SELECT name FROM manager WHERE name = ?", [name])
    const exists = nameResult.length > 0

    if (exists) {
      await db.query("ROLLBACK")
      return res.status(400).json({ message: "Manager already exists!" })
    }

    await db.query("INSERT INTO manager (name, contact) VALUES (?,?)", [name, contact])

    await db.query("COMMIT")

    res.status(201).json({ message: "Manager added successfully!" })
  } catch (error) {
    console.error("Error adding manager:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.get("/api/search-manager", async (req, res) => {
  const { name } = req.query

  try{
    const [searchName] = await db.query("SELECT name FROM manager WHERE name = ?", [name])

    if (searchName.length > 0){
      res.status(200).json(searchName)
    } else {
      res.status(404).json({ message: "Manager not found", data: []})
    }
  } catch (error) {
    console.error("Error searching manager:", error)
    res.status(500).json({data: []})
  }
})

app.get("/api/get-managers", async (req, res) => {

  try{
    const [getManagers] = await db.query("SELECT * FROM manager" )

    res.status(200).json(getManagers);
  } catch (error) {
    console.error("Error retrieving managers:", error)
    res.status(500).json({ message: "Internal server error", data: [] });
  }
})


//Manage - Suppliers
//Manage - Employees
//Manage - Outlets
//Manage - Products
//Manage - Items
//Inventory - Stalls Inventory
app.get("/api/inventory-stalls-inventory", async (req, res) => {
  const { location } = req.query;

  // Log the received location parameter
  console.log("Received location:", location);

  // Check if location is provided
  if (!location) {
    return res.status(400).json({ message: "Location is required" });
  }

  try {
    // Query to find branch ID based on location
    const [branchResult] = await db.query("SELECT branch_id FROM branch WHERE location = ?", [location]);
    if (branchResult.length === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const branchId = branchResult[0].branch_id;

    // Query to fetch inventory data for the found branch ID
    const [inventoryResult] = await db.query(`
      SELECT 
        bi.inventory_id, 
        bi.order_id, 
        bi.date, 
        bp.product_id, 
        bp.quantity, 
        bp.price 
      FROM branch_inventory bi
      JOIN branch_product bp ON bi.inventory_id = bp.inventory_id
      WHERE bi.branch_id = ?
    `, [branchId]);

    // Respond with the inventory data
    res.json(inventoryResult);
  } catch (error) {
    console.error("Error fetching stalls inventory:", error);
    res.status(500).json({ message: "Error fetching stalls inventory", error: error.message });
  }
});

//Inventory - add - production - invetory
app.post("/api/inventory-add-production-inventory", async (req, res) => {
  const { product_name, quantity, price, product_size } = req.body;
  const now = new Date().toISOString();

  console.log("Received request body:", req.body);

  if (!product_name || !quantity || !price || !product_size) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query("START TRANSACTION");

    // Check if product details exist
    const [productDetailsResult] = await db.query("SELECT product_id FROM Product_details WHERE product_name = ?", [product_name]);
    let productId;

    if (productDetailsResult.length > 0) {
      productId = productDetailsResult[0].product_id;
    } else {
      // Insert into Product_details
      const [addProductDetails] = await db.query("INSERT INTO Product_details (product_name) VALUES (?)", [product_name]);
      productId = addProductDetails.insertId;
    }

    // Insert into inventory
    const [addInventory] = await db.query(
      `INSERT INTO inventory (product, date) VALUES (?, ?)`,
      [productId, now]
    );
    const inventoryId = addInventory.insertId;

    // Corrected: Insert into product table using product_id for product_name
    await db.query(
      `INSERT INTO product (product_name, product_size, quantity, price) VALUES (?, ?, ?, ?)`,
      [productId, product_size, quantity, price]
    );

    await db.query("COMMIT");
    res.status(201).json({ message: "Production inventory added successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error adding production inventory:", error);
    res.status(500).json({ message: "Error adding production inventory", error: error.message });
  }
});