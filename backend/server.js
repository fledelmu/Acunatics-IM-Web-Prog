import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//test ra ni if mag kuha siya sa cloud na database
app.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM sales"); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



