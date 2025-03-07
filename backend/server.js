import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = process.env.DB_PORT;

app.use(cors());
app.use(express.json());

// Test route to fetch data
app.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM tbl_pet"); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



