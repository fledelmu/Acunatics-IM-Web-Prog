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
  const { type, target, location, order_items, date, quantity, price} = req.body;
  const now = new Date().toISOString();

  console.log("Request body:", req.body);

  try {
    await db.query("START TRANSACTION");

    let clientId = null;
    let orderId = null;

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
    }

    if (type === "Outlet") {
      console.log("Checking branch:", target);
      const [branchResult] = await db.query("SELECT branch_id FROM branch WHERE name = ?", [target]);
      console.log("Branch result:", branchResult);

      if (branchResult.length > 0) {
        branchId = branchResult[0].branch_id;
        console.log("Branch ID found:", branchId);
      } else {
        const [addBranch] = await db.query("INSERT INTO branch (name) VALUES (?)", [target]);
        branchId = addBranch.insertId;
        console.log("New branch ID:", branchId);
      }
    }

    if (!clientId) {
      console.error("Client ID is not provided");
      throw new Error("Client must be provided");
    }

    const [addOrder] = await db.query(
      `INSERT INTO orders (manager_id, date) VALUES (?, ?)`,
      [null, date] // Assuming manager_id is null for now
    );
    orderId = addOrder.insertId;
    console.log("New order ID:", orderId);

    const [addDelivery] = await db.query(
      `INSERT INTO delivery (client_id, order_id, location, date) VALUES (?, ?, ?, ?)`,
      [clientId, orderId, location, date]
    );
    const delivery_ref = addDelivery.insertId;
    console.log("New delivery ID:", delivery_ref);

    
    subtotal = quantity * price;
    const [addOrderDetails] = await db.query(

      `INSERT INTO order_details (order_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)`,
      [orderId, order_items, quantity, subtotal]
    );

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
//Manage - Suppliers
//Manage - Employees
//Manage - Outlets
//Manage - Products
//Manage - Items
