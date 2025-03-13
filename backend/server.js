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
  const { type, target, location, product, date, quantity, price } = req.body;
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

app.put("/api/manage-edit-outlet", async (req, res) => {
  const { id, location } = req.body;

  if (!id || !location) {
    return res.status(400).json({ message: "Outlet ID and location are required" });
  }

  try {
    await db.query("START TRANSACTION");

    const [updateResult] = await db.query(
      "UPDATE branch SET location = ? WHERE branch_id = ?",
      [location, id]
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
  const { id, name, size, price } = req.body;

  if (!id || (!name && !size && !price)) {
    return res.status(400).json({ message: "Product ID and at least one field to update are required" });
  }

  try {
    await db.query("START TRANSACTION");

    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("product_name = ?");
      updateValues.push(name);
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

    updateValues.push(id);

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

app.put("/api/manage-edit-product", async (req, res) => {
  const { id, name, size, price } = req.body;

  if (!id || (!name && !size && !price)) {
    return res.status(400).json({ message: "Product ID and at least one field to update are required" });
  }

  try {
    await db.query("START TRANSACTION");

    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("product_name = ?");
      updateValues.push(name);
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

    updateValues.push(id);

    const [updateResult] = await db.query(
      "UPDATE Product_details SET ${updateFields.join(", ")} WHERE product_id = ?",
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
  const { name, type, unit, price } = req.body

  console.log("Received Data:", req.body);

  try{
    await db.query("START TRANSACTION")

    const [productResult] = await db.query("SELECT * FROM item_type WHERE item_name = ?", [name])
    const exists = productResult.length > 0

    if(exists){
      await db.query("ROLLBACK")
      return res.status(400).json({message: "Item already exists!"})
    }

    await db.query("INSERT INTO item_type (item_name, item_type, unit, price) VALUES (?, ?, ?, ?)", [name, type, unit, price])

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
  const { id, name, type, unit, price } = req.body;

  if (!id || (!name && !type && !unit && !price)) {
    return res.status(400).json({ message: "Item ID and at least one field to update are required" });
  }

  try {
    await db.query("START TRANSACTION");

    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("item_name = ?");
      updateValues.push(name);
    }
    if (type) {
      updateFields.push("item_type = ?");
      updateValues.push(type);
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

    updateValues.push(id);

    const [updateResult] = await db.query(
      `UPDATE item_type SET ${updateFields.join(", ")} WHERE item_id = ?`,
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

app.put("/api/manage-edit-item", async (req, res) => {
  const { id, name, type, unit, price } = req.body;

  if (!id || (!name && !type && !unit && !price)) {
    return res.status(400).json({ message: "Item ID and at least one field to update are required" });
  }

  try {
    await db.query("START TRANSACTION");

    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("item_name = ?");
      updateValues.push(name);
    }
    if (type) {
      updateFields.push("item_type = ?");
      updateValues.push(type);
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

    updateValues.push(id);

    const [updateResult] = await db.query(
      "UPDATE item_type SET ${updateFields.join(", ")} WHERE item_id = ?",
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
})

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
  const { id, name, contact } = req.body;

  if (!id || (!name && !contact)) {
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

    updateValues.push(id);

    const [updateResult] = await db.query(
      "UPDATE client SET ${updateFields.join(", ")} WHERE client_id = ?",
      updateValues
    );

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
app.get("/api/inventory-stalls-inventory-search", async (req, res) => {
  const { location } = req.query;
  console.log("Received location:", location);

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
    `);

    // Respond with the inventory data
    res.json(inventoryResult);
  } catch (error) {
    console.error("Error fetching stalls inventory:", error);
    res.status(500).json({ message: "Error fetching stalls inventory", error: error.message });
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




app.get("/api/inventory-view-production-inventory", async (req, res) =>{
  try{
    const [getDetails] = await db.query(`
      SELECT                   
      pd.product_name,                    
      pd.size, 
      SUM(p.quantity) AS total
      FROM Product_details pd
      JOIN product p 
      ON pd.product_id = p.product_name
      GROUP BY pd.size
    `)
    res.json(getDetails)
  } catch (error) {
    console.error("Error fetching inventory:", error)
    res.status(500).json({ error: error.message })
  }
})