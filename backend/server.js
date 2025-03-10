import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/records", async (req, res) => {
  try {
    const [productionRecords] = await db.query("SELECT * FROM production");
    const [deliveryRecords] = await db.query("SELECT * FROM delivery");
    const [supplyRecords] = await db.query("SELECT * FROM supply");

    res.json({
      production: productionRecords,
      delivery: deliveryRecords,
      supply: supplyRecords
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Backend is running!");
});





