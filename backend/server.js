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


app.get("/api/production-records", async (req, res) => {
  const { order = "ASC" } = req.query; 
  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC"; 

  try {
    const [productionRecords] = await db.query(`
      SELECT 
        b.id AS batch_id, 
        b.vat_num, 
        bd.weight AS total_weight, 
        a.weight AS starting_weight, 
        af.weight AS final_weight, 
        b.date
      FROM batch b
      JOIN batch_details bd ON b.id = bd.batch_id
      JOIN antala a ON b.id = a.batch_id
      JOIN antala_final af ON b.id = af.batch_id
      ORDER BY b.date ${sortOrder}
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
        d.client_id, 
        c.name AS client_name, 
        d.location, 
        d.date, 
        od.quantity, 
        od.subtotal
      FROM delivery d
      JOIN client c ON d.client_id = c.id
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
        s.id, 
        sp.name AS supplier_name, 
        s.date, 
        sd.unit, 
        sd.quantity, 
        sd.price
      FROM supply s
      JOIN suppliers sp ON s.supplier_id = sp.id
      JOIN supply_details sd ON s.id = sd.supply_id
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
