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
  const { type, target, location, product, quantity, price, size } = req.body;
  const now = new Date().toISOString();

  console.log("Request body:", req.body);

  try {
    await db.query("START TRANSACTION");

    let clientId = null;
    let branchId = null;
    let orderId = null;
    let orderDetailsId = null;
    let inventoryId = null;

    // Handle Client / Outlet Logic
    if (type === "Client") {
      const [clientResult] = await db.query("SELECT client_id FROM client WHERE name = ?", [target]);
      clientId = clientResult.length ? clientResult[0].client_id : 
        (await db.query("INSERT INTO client (name) VALUES (?)", [target]))[0].insertId;
    } 
    
    if (type === "Outlet") {
      const [branchResult] = await db.query("SELECT branch_id FROM branch WHERE location = ?", [target]);
      branchId = branchResult.length ? branchResult[0].branch_id : 
        (await db.query("INSERT INTO branch (location) VALUES (?)", [target]))[0].insertId;
    }

    if (!clientId && !branchId) throw new Error("Client or Branch must be provided");

    // Get product ID and quantity
    const [productResult] = await db.query(
      `SELECT * FROM Product_details WHERE product_name = ? AND size = ?`,
      [product, size]
    );

    if (!productResult.length) throw new Error("Product not found with the selected size.");

    let productId = productResult[0].product_id;
    let productQuantity = productResult[0].quantity;

    if (productQuantity < quantity) throw new Error("Not enough stock available.");

    // Fetch latest inventory entry
    const [inventoryResult] = await db.query(
      `SELECT i.inventory_id, bp.batch_id, bp.product_id, p.quantity 
       FROM inventory i
       JOIN batch_product bp ON i.batch_id = bp.inventory_id
       JOIN product p ON bp.product_id = p.product_id
       JOIN Product_details pd ON p.product_name = pd.product_id
       WHERE pd.product_name = ? AND pd.size = ?
       ORDER BY p.quantity DESC`,
      [product, size]
    );

    if (!inventoryResult.length) throw new Error("No inventory found for this product and size.");

    inventoryId = inventoryResult[0].inventory_id;
    let inventoryQuantity = inventoryResult[0].quantity;

    if (inventoryQuantity < quantity) throw new Error("Not enough stock available in inventory.");


    // Create Order Details
    const subtotal = quantity * price;
    const [addOrderDetails] = await db.query(
      "INSERT INTO order_details (inventory_id, quantity, price, subtotal) VALUES (?, ?, ?, ?)",
      [inventoryId, quantity,price, subtotal]
    );
    orderDetailsId = addOrderDetails.insertId;

    // Create Order
    const [addOrder] = await db.query(
      "INSERT INTO orders (order_details, date) VALUES (?, ?)",
      [orderDetailsId, now]
    );
    orderId = addOrder.insertId;

    // Create Delivery Record
    if (type === "Client") {
      await db.query(
        "INSERT INTO delivery (client_id, order_id, location, date) VALUES (?, ?, ?, ?)",
        [clientId, orderId, location, now]
      );
    } else {
      await db.query(
        "INSERT INTO delivery (order_id, date) VALUES (?, ?)",
        [orderId, now]
      );
      // Update branch inventory
      const [stockResult] = await db.query(
        "SELECT quantity FROM branch_inventory WHERE inventory_id = ? AND branch_id = ?",
        [inventoryId, branchId]
      );

      if (!stockResult.length){
        await db.query(
          "INSERT INTO branch_inventory (inventory_id, branch_id, quantity) VALUES (?, ?, ?)",
          [inventoryId, branchId, quantity]
        );
      } else {
        await db.query(
          "UPDATE branch_inventory SET quantity = ? WHERE inventory_id = ? AND branch_id = ?",
          [stockResult[0].quantity - quantity, inventoryId, branchId]
        );
      }
      
    }

    await db.query("COMMIT");
    res.status(201).json({ message: "Delivery process recorded successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error processing delivery:", error);
    res.status(500).json({ message: "Error processing delivery", error: error.message });
  }
});




//Process - Supply
app.post("/api/process-supply", async (req, res) => {
  const { supplier, item_name, quantity, price, unit } = req.body;
  const now = new Date().toISOString();

  console.log("Request body:", req.body);

  try {
    await db.query("START TRANSACTION");

    let supplierId = null;
    let itemTypeId = null;
    let itemId = null;
    let supplyId = null;

    // Check if supplier exists
    console.log("Checking supplier:", supplier);
    const [supplierResult] = await db.query("SELECT supplier_id FROM supplier WHERE name = ?", [supplier]);
    console.log("Supplier result:", supplierResult);

    if (supplierResult.length > 0) {
      supplierId = supplierResult[0].supplier_id;
      console.log("Supplier ID found:", supplierId);
    } else {
      const [addSupplier] = await db.query("INSERT INTO supplier (name) VALUES (?)", [supplier]);
      supplierId = addSupplier.insertId;
      console.log("New supplier ID:", supplierId);
    }

    // Check if item type exists
    console.log("Checking item type:", item_name);
    const [itemTypeResult] = await db.query("SELECT item_type_id FROM item_type WHERE item_name = ?", [item_name]);
    console.log("Item type result:", itemTypeResult);

    if (itemTypeResult.length > 0) {
      itemTypeId = itemTypeResult[0].item_type_id;
      console.log("Item type ID found:", itemTypeId);
    } else {
      const [addItemType] = await db.query("INSERT INTO item_type (item_name) VALUES (?)", [item_name]);
      itemTypeId = addItemType.insertId;
      console.log("New item type ID:", itemTypeId);
    }

    // Check if item exists
    console.log("Checking item:", itemTypeId);
    const [itemResult] = await db.query("SELECT item_id FROM item WHERE item_type = ?", [itemTypeId]);
    console.log("Item result:", itemResult);

    if (itemResult.length > 0) {
      itemId = itemResult[0].item_id;
      console.log("Item ID found:", itemId);
    } else {
      const [addItem] = await db.query("INSERT INTO item (item_type, quantity) VALUES (?, ?)", [itemTypeId, quantity]);
      itemId = addItem.insertId;
      console.log("New item ID:", itemId);
    }

    // Insert into supply table
    const [addSupply] = await db.query("INSERT INTO supply (supplier_id, date) VALUES (?, ?)", [supplierId, now]);
    supplyId = addSupply.insertId;
    console.log("New supply ID:", supplyId);

    // Insert into supply_details table
    await db.query("INSERT INTO supply_details (supply_id, item_id, unit, quantity, price) VALUES (?, ?, ?, ?, ?)", [supplyId, itemId, unit, quantity, price]);

    await db.query("COMMIT");
    res.status(201).json({ message: "Supply process recorded successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error processing supply:", error);
    res.status(500).json({ message: "Error processing supply", error: error.message });
  }
});

// Records Tab
app.get("/api/production-records", async (req, res) => {
  const { date } = req.query

  try {
    let query = `
      SELECT 
        b.batch_id, 
        b.vat_num, 
        bd.weight AS total_weight, 
        a.weight AS starting_weight, 
        af.weight AS final_weight, 
        DATE(b.date) as date
      FROM batch b
      JOIN batch_details bd ON b.batch_id = bd.batch_id
      JOIN antala a ON bd.batch_details_id = a.batch_details_id
      JOIN antala_final af ON a.antala_id = af.antala_id
    `
    const filterDate = []

    if (date){
      query += 'WHERE DATE(b.date) = ?'
      filterDate.push(date)
    }

    query += ` ORDER BY b.date`
    
    const [productionRecords] = await db.query(query, filterDate);

    res.json(productionRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/client-delivery-records", async (req, res) => {
  const { date } = req.query;

  try {
    let query = `
      SELECT 
      d.delivery_id, 
      c.name,  
      pd.product_name,
      pd.size,
      od.quantity,
      od.subtotal, 
      d.location,
      DATE(d.date) AS date
      FROM delivery d
      JOIN client c ON d.client_id = c.client_id
      JOIN orders o ON d.order_id = o.order_id
      JOIN order_details od ON o.order_details = od.order_details_id
      JOIN inventory i ON od.inventory_id = i.inventory_id
      JOIN batch_product bp ON i.batch_id = bp.batch_id
      JOIN product p ON bp.product_id = p.product_id
      JOIN Product_details pd ON p.product_name = pd.product_id 
    `;

    const filterDate = [];

    if (date) {
      query += " WHERE d.date = ?";
      filterDate.push(date);
    }

    query += " ORDER BY DATE(d.date)";

    const [deliveryRecords] = await db.query(query, filterDate);
    res.json(deliveryRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get("/api/supply-records", async (req, res) => {
  const { date } = req.query;

  try {
    let query = `
      SELECT 
        s.supply_id, 
        sp.name AS supplier_name, 
        it.item_name,
        sd.quantity, 
        sd.unit, 
        sd.price, 
        (sd.price * sd.quantity) AS subtotal,
        DATE(s.date) AS date
      FROM supply s
      JOIN supplier sp ON s.supplier_id = sp.supplier_id
      JOIN supply_details sd ON s.supply_id = sd.supply_id
      JOIN item i ON sd.item_id = i.item_id
      JOIN item_type it ON i.item_type = it.item_type_id
    `;

    const filterDate = [];

    if (date) {
      query += " WHERE DATE(s.date) = ?";
      filterDate.push(date);
    }

    query += " ORDER BY s.date";

    const [supplyRecords] = await db.query(query, filterDate);
    res.json(supplyRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/outlet-delivery-records", async (req, res) => {
  const { date } = req.query;

  try {
      let query = `
          SELECT 
              d.delivery_id, 
              b.location,  
              pd.product_name, 
              pd.size, 
              od.quantity,
              od.subtotal, 
              DATE(d.date) AS date
          FROM delivery d
          JOIN orders o ON d.order_id = o.order_id
          JOIN order_details od ON o.order_details = od.order_details_id
          JOIN inventory i ON od.inventory_id = i.inventory_id
          JOIN batch_product bp ON i.batch_id = bp.inventory_id
          JOIN product p ON bp.product_id = p.product_id  
          JOIN Product_details pd ON p.product_name = pd.product_id
          JOIN branch_inventory bi ON o.order_id = bi.inventory_id
          JOIN branch b ON b.branch_id = bi.branch_id
      `;

      const filterDate = [];

      if (date) {
          query += " WHERE d.date = ?";
          filterDate.push(date);
      }

      query += " ORDER BY DATE(d.date)";

      const [outletDeliveryRecords] = await db.query(query, filterDate);
      res.json(outletDeliveryRecords);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//Manage - Suppliers
app.get("/api/manage-get-suppliers", async (req,res) => {
  try{
    const [getSuppliers] = await db.query("SELECT * FROM supplier")
    res.status(200).json(getSuppliers)
  } catch (error) {
    console.error("Error retrieving suppliers:", error)
    res.status(500).json({message:"Internal server error", data:[]})
  }
})

app.get("/api/manage-search-suppliers", async(req, res) => {
  const { name } = req.query

  try{
    const [searchSupplier] = await db.query("SELECT * FROM supplier WHERE name = ?", [name])
    if (searchSupplier.length > 0){
      res.status(200).json(searchSupplier)
    } else {
      res.status(404).json({ message: "Supplier not found", data: []})
    }
  } catch (error) {
    console.error("Error searching supplier:", error)
    res.status(500).json({data: []})
  }
})

app.post("/api/manage-add-suppliers", async(req, res) => {
  const { name, contact, address } = req.body

  try{
    await db.query("START TRANSACTION")

    const [nameResult] = await db.query("SELECT * FROM supplier WHERE name = ?", [name])
    const exists = nameResult.length > 0

    if(exists){
      await db.query("ROLLBACK")
      return res.status(400).json({ message: "Supplier already exists!" })
    }

    await db.query("INSERT INTO supplier (name, contact, address) VALUES (?,?,?)", [name, contact, address])

    await db.query("COMMIT")

    res.status(201).json({ message: "Supplier added successfully!" })
  } catch (error) {
    console.error("Error adding supplier:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.put("/api/manage-edit-suppliers", async (req, res) => {
  console.log("Received Data:", req.body);
  const { supplier_id, name, contact, address } = req.body;

  if (!supplier_id || (!name && !contact && !address)) {
    return res.status(400).json({ message: "Supplier ID and at least one field to update are required" });
  }

  try {
    await db.query("START TRANSACTION");

    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (contact) {
      updateFields.push("contact = ?");
      updateValues.push(contact);
    }
    if (address) {
      updateFields.push("address = ?");
      updateValues.push(address);
    }

    if (updateFields.length === 0) {
      await db.query("ROLLBACK");
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    updateValues.push(supplier_id); // ID should always be the last value

    const updateQuery = `
      UPDATE supplier 
      SET ${updateFields.join(", ")} 
      WHERE supplier_id = ?
    `;

    const [updateResult] = await db.query(updateQuery, updateValues);

    if (updateResult.affectedRows === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Supplier not found or no changes made" });
    }

    await db.query("COMMIT");
    res.status(200).json({ message: "Supplier updated successfully" });

  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error updating supplier:", error);
    res.status(500).json({ message: "Error updating supplier", error: error.message });
  }
});



//Manage - Outlets
app.post("/api/manage-add-outlet", async (req, res) => {
  const { location } = req.body;

  try {
    await db.query("START TRANSACTION");

    const [locationResult] = await db.query("SELECT * FROM branch WHERE location = ?", [location]);
    const exists = locationResult.length > 0;

    if (exists) {
      await db.query("ROLLBACK");
      return res.status(400).json({ message: "Outlet already exists!" });
    }

    await db.query("INSERT INTO branch (location) VALUES (?)", [location]);

    await db.query("COMMIT");
    res.status(201).json({ message: "Outlet added successfully!" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error adding outlet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/manage-get-outlet", async (req, res) =>{
  try {
    const [getOutlets] = await db.query("SELECT * FROM branch")
    res.status(200).json(getOutlets)
  } catch (error) {
    console.error("Error no outlets!", error)
    res.status(500).json({data: []})
  }
})

app.get("/api/manage-search-outlet", async(req, res) => {
  const { location } = req.query

  try {
    const [searchOutlet] = await db.query("SELECT * FROM branch WHERE location = ?", [location])

    res.status(200).json(searchOutlet)
  } catch (error){
    console.error("Error, outlet not found! ", error)
    res.status(500).json({data: []})
  }
})
app.put("/api/manage-edit-outlet", async (req, res) => {
  const { branch_id, location } = req.body;

  if (!branch_id || !location) {
    return res.status(400).json({ message: "Outlet ID and location are required" });
  }

  try {
    await db.query("START TRANSACTION");

    const [updateResult] = await db.query(
      "UPDATE branch SET location = ? WHERE branch_id = ?",
      [location, branch_id]
    );

    if (updateResult.affectedRows === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Outlet not found or no changes made" });
    }

    await db.query("COMMIT");
    res.status(200).json({ message: "Outlet updated successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error updating outlet:", error);
    res.status(500).json({ message: "Error updating outlet", error: error.message });
  }
});

//Manage - Products

app.post("/api/manage-add-product", async(req, res) => {
  const { name, size, price } = req.body

  try{
    await db.query("START TRANSACTION")

    await db.query("INSERT INTO Product_details (product_name, size, price) VALUES (?,?,?)", [name,size,price])

    await db.query("COMMIT")
    
    return res.status(201).json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.get("/api/manage-get-product", async (req, res) =>{
  try {
    await db.query("START TRANSACTION")

    const [getProducts] = await db.query("SELECT * FROM Product_details")
    res.status(200).json(getProducts)
  } catch (error) {
    console.error("Error no products!", error)
    res.status(500).json({data: []})
  }
})

app.get("/api/manage-search-product", async(req, res) => {
  const { name } = req.query

  try {
    await db.query("START TRANSACTION")

    const [searchProduct] = await db.query("SELECT * FROM Product_details WHERE product_name = ?", [ name ])

    res.status(200).json(searchProduct)
  }
  catch (error){
    console.error("Error, product not found! ", error)
    res.status(500).json({data: []})
  }
})
app.put("/api/manage-edit-product", async (req, res) => {
  const { product_id, product_name, size, price } = req.body;
  console.log("received data:", req.body);
  if (!product_id || (!product_name && !size && !price)) {
    return res.status(400).json({ message: "Product ID and at least one field to update are required" });
  }

  try {
    await db.query("START TRANSACTION");

    let updateFields = [];
    let updateValues = [];

    if (product_name) {
      updateFields.push("product_name = ?");
      updateValues.push(product_name);
    }
    if (size) {
      updateFields.push("size = ?");
      updateValues.push(size);
    }
    if (price !== undefined) {
      updateFields.push("price = ?");
      updateValues.push(price);
    }

    if (updateFields.length === 0) {
      await db.query("ROLLBACK");
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    updateValues.push(product_id);

    const [updateResult] = await db.query(
      `UPDATE Product_details SET ${updateFields.join(", ")} WHERE product_id = ?`,
      updateValues
    );

    if (updateResult.affectedRows === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found or no changes made" });
    }

    await db.query("COMMIT");
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
});

//Manage - Items
app.post("/api/manage-add-item", async(req, res) => {
  const { item_name, item_type, unit, price } = req.body

  console.log("Received Data:", req.body);

  try{
    await db.query("START TRANSACTION")

    const [productResult] = await db.query("SELECT * FROM item_type WHERE item_name = ?", [item_name])
    const exists = productResult.length > 0

    if(exists){
      await db.query("ROLLBACK")
      return res.status(400).json({message: "Item already exists!"})
    }

    await db.query("INSERT INTO item_type (item_name, item_type, unit, price) VALUES (?, ?, ?, ?)", [item_name, item_type, unit, price])

    await db.query("COMMIT")
    return res.status(201).json({ success: true, message: "Item added successfully!" })
  }
  catch (error) {
    console.error("Error adding product:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.get("/api/manage-get-item", async (req, res) =>{
  try {
    await db.query("START TRANSACTION")

    const [getItems] = await db.query("SELECT * FROM item_type")
    res.status(200).json(getItems)
  } catch (error) {
    console.error("Error no items!", error)
    res.status(500).json({data: []})
  }
})

app.get("/api/manage-search-item", async(req, res) => {
  const { name } = req.query

  try

  {
    await db.query("START TRANSACTION")

    const [searchItem] = await db.query("SELECT * FROM item_type WHERE item_name = ?", [name])

    res.status(200).json(searchItem)
  } catch (error){
    console.error("Error, item not found! ", error)
    res.status(500).json({data: []})
  }
})

app.put("/api/manage-edit-item", async (req, res) => {
  const { item_type_id, item_name, item_type, unit, price } = req.body;

  if (!item_type_id || (!item_name && !item_type && !unit && !price)) {
    return res.status(400).json({ message: "Item ID and at least one field to update are required" });
  }

  try {
    await db.query("START TRANSACTION");

    let updateFields = [];
    let updateValues = [];

    if (item_name) {
      updateFields.push("item_name = ?");
      updateValues.push(item_name);
    }
    if (item_type) {
      updateFields.push("item_type = ?");
      updateValues.push(item_type);
    }
    if (unit) {
      updateFields.push("unit = ?");
      updateValues.push(unit);
    }
    if (price !== undefined) {
      updateFields.push("price = ?");
      updateValues.push(price);
    }

    if (updateFields.length === 0) {
      await db.query("ROLLBACK");
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    updateValues.push(item_type_id);

    const [updateResult] = await db.query(
      `UPDATE item_type SET ${updateFields.join(", ")} WHERE item_type_id = ?`,
      updateValues
    );

    if (updateResult.affectedRows === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Item not found or no changes made" });
    }

    await db.query("COMMIT");
    res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item", error: error.message });
  }
});

// Manage - Client

app.get("/api/manage-get-clients", async(req, res) => {
  try{
    const [getClients] = await db.query("SELECT * FROM client")

    res.status(200).json(getClients)
  } catch (error) {
    console.error("Error, retrieving clients", error)
    res.status(500),json({data: []})
  }
})

app.get("/api/manage-search-client", async(req, res) => {
  const { name } = req.query
  try{
    const [searchClient] = await db.query("SELECT * FROM client WHERE name = ?", [name])

    res.status(200).json(searchClient)
  } catch (error) {
    console.error("Error, client not found!", error)
    res.status(500).json({data: []})
  }
})

app.post("/api/manage-add-client", async (req, res) => {
  const { name, contact } = req.body

  try {
    await db.query("START TRANSACTION")

    const [nameResult] = await db.query("SELECT * FROM client WHERE name = ?", [name])
    const exists = nameResult.length > 0

    if (exists) {
      await db.query("ROLLBACK")
      return res.status(400).json({ message: "Client already exists!" })
    }

    await db.query("INSERT INTO client (name, contact) VALUES (?, ?)", [name, contact])

    await db.query("COMMIT")


    return res.status(201).json({ success: true, message: "Client added successfully!" })

  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error adding client:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
})

app.put("/api/manage-edit-client", async (req, res) => {
  console.log("Received Data:", req.body);
  const { client_id, name, contact } = req.body;

  if (!client_id || (!name && !contact)) {
    return res.status(400).json({ message: "Client ID and at least one field to update are required" });
  }

  try {
    await db.query("START TRANSACTION");

    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (contact) {
      updateFields.push("contact = ?");
      updateValues.push(contact);
    }

    if (updateFields.length === 0) {
      await db.query("ROLLBACK");
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    updateValues.push(client_id);

    // Corrected query construction
    const updateQuery = `UPDATE client SET ${updateFields.join(", ")} WHERE client_id = ?`;
    console.log("Executing Query:", updateQuery, updateValues);

    const [updateResult] = await db.query(updateQuery, updateValues);

    if (updateResult.affectedRows === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ message: "Client not found or no changes made" });
    }

    await db.query("COMMIT");
    res.status(200).json({ message: "Client updated successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Error updating client", error: error.message });
  }
});



//Inventory - Stalls Inventory
app.post("/api/add-stall-inventory", async (req, res) => {
  const { product_name, size, quantity } = req.body;
  const now = new Date().toISOString();

  console.log("Received request body:", req.body);

  if (!product_name || !size || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query("START TRANSACTION");

    // Check if product details exist
    const [productDetailsResult] = await db.query(
      "SELECT product_id FROM Product_details WHERE product_name = ? AND size = ?",
      [product_name, size]
    );

    let productDId;

    if (productDetailsResult.length > 0) {
      productDId = productDetailsResult[0].product_id;
    } else {
      // Insert into Product_details
      const [addProductDetails] = await db.query(
        "INSERT INTO Product_details (product_name, size) VALUES (?, ?)",
        [product_name, size]
      );
      productDId = addProductDetails.insertId;
      console.log(`Inserted new product details with ID: ${productId}`);
    }


    // Ensure `productId` is valid before proceeding
    if (!productDId) {
      return res.status(400).json({ message: "Failed to retrieve or insert product." });
    }

    const [addProduct] = await db.query("INSERT INTO product (product_name, quantity) VALUES (?,?)", [productDId, quantity])

    const productId = addProduct.insertId
    // Insert into inventory
    const [addInventory] = await db.query(
      `INSERT INTO inventory (product, date) VALUES (?, ?)`,
      [productId, now]
    );
    console.log(`Inserted into inventory with ID: ${addInventory.insertId}`);

    // Insert into product table using `productId`
    await db.query(
      `INSERT INTO product (product_name, quantity) VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [productId, quantity]
    );
    console.log(`Inserted/Updated product table with ID: ${productId}`);

    await db.query("COMMIT");
    res.status(201).json({ message: "Production inventory added successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error adding production inventory:", error);
    res.status(500).json({ message: "Error adding production inventory", error: error.message });
  }
});

app.post("/api/inventory-add-production-inventory", async (req, res) => {
  const { product_name, size, quantity, batch } = req.body; // Assuming batch number is provided
  const now = new Date().toISOString();

  console.log("Received request body:", req.body);

  if (!product_name || !size || !quantity || !batch) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.query("START TRANSACTION");

    // Check if product details exist
    const [productDetailsResult] = await db.query(
      "SELECT product_id FROM Product_details WHERE product_name = ? AND size = ?",
      [product_name, size]
    );

    let productDId;

    if (productDetailsResult.length > 0) {
      productDId = productDetailsResult[0].product_id;
    } else {
      // Insert into Product_details
      const [addProductDetails] = await db.query(
        "INSERT INTO Product_details (product_name, size) VALUES (?, ?)",
        [product_name, size]
      );

      productDId = addProductDetails.insertId;
      console.log(`Inserted new product details with ID: ${productDId}`);
    }

    if (!productDId) {
      return res.status(400).json({ message: "Failed to retrieve or insert product." });
    }

    // Ensure batch exists
    let batchId;
    const [batchExists] = await db.query("SELECT batch_id FROM batch WHERE batch_id = ?", [batch]);

    if (batchExists.length > 0) {
      batchId = batchExists[0].batch_id;
    } 

    // Insert product into `Product`
    let productId;
    const [productExists] = await db.query("SELECT product_id FROM product WHERE product_name = ?", [productDId]);

    if (productExists.length === 0) {
      const [newProduct] = await db.query(
        "INSERT INTO product (product_name, quantity) VALUES (?, ?)",
        [productDId, quantity]
      );
      productId = newProduct.insertId;
    } else {
      productId = productExists[0].product_id;
      await db.query(
        `UPDATE product 
         SET quantity = quantity + ? 
         WHERE product_name = ?`,
        [quantity, productDId]
      );
    }

    // Insert into `Batch_product` (linking batch_id and product_id)
    await db.query(
      "INSERT INTO batch_product (batch_id, product_id) VALUES (?, ?)",
      [batchId, productId]
    );
    await db.query("COMMIT");

    await db.query("START TRANSACTION");
    // Insert into `Inventory`
    await db.query(
      "INSERT INTO inventory (batch_id) VALUES (?)",
      [batchId]
    );

    await db.query("COMMIT");
    
    res.status(201).json({ message: "Production inventory added successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error adding production inventory:", error);
    res.status(500).json({ message: "Error adding production inventory", error: error.message });
  }
});



app.get("/api/inventory-view-production-inventory", async (req, res) => {
  try {
    const [getDetails] = await db.query(`
      SELECT                   
        pd.product_name,                    
        pd.size, 
        SUM(p.quantity) AS total
        FROM Product_details pd
        JOIN product p 
        ON pd.product_id = p.product_name
      GROUP BY pd.product_name, pd.size
    `);

    res.json(getDetails);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/inventory-view-supply-inventory", async (req, res) => {
  try {
    const [supplyRecords] = await db.query( `
      SELECT 
    s.supply_id,  
    it.item_name,
    SUM(sd.quantity) AS total
    FROM supply s
    JOIN supplier sp ON s.supplier_id = sp.supplier_id
    JOIN supply_details sd ON s.supply_id = sd.supply_id
    JOIN item i ON sd.item_id = i.item_id
    JOIN item_type it ON i.item_type = it.item_type_id
    GROUP BY it.item_name;`
  );
    res.json(supplyRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})


app.get("/api/inventory-stalls-inventory-search", async (req, res) => {
  const { location} = req.query;

 

  try {
    // Query to fetch product details based on location, product_name, and size
    const [productDetails] = await db.query(
      `SELECT 
         b.location AS Location,
         pd.product_name AS ProductName,
         pd.size AS ProductSize,
         bi.quantity AS Quantity
       FROM Product_details pd
       JOIN product p ON pd.product_id = p.product_name
       JOIN branch_product bp ON pd.product_id = bp.product_id
       JOIN branch_inventory bi ON bp.inventory_id = bi.inventory_id
       JOIN branch b ON bi.branch_id = b.branch_id
       WHERE b.location = ?`,
      [location]
    ); 

    res.json(productDetails);
  } catch (error) {
    console.error("Error searching stalls inventory:", error);
    res.status(500).json({ message: "Error searching stalls inventory", error: error.message });
  }
});
