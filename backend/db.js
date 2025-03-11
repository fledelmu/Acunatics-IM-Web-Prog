import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: false,  
});

db.getConnection()
  .then(connection => {
    console.log("Database connection successful!");
    connection.release();
  })
  .catch(err => {
    console.error("Database connection failed:", err.message);
  });

export default db;
