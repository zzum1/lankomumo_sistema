const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.use("/", (req, res, next) => {
  console.log(`Method: ${req.method}, URL: ${req.url} is coming!`);
  next();
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  waitForConnections: true,
}).promise();

app.post("/api/courses/register", async (req, res) => {
  const { vardas, pavarde, el_pastas,} = req.body;

  if (!vardas || !pavarde || !el_pastas) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const result = await pool.execute(
      "INSERT INTO users (vardas, pavarde, el_pastas) VALUES (?, ?, ?)",
      [vardas, pavarde, el_pastas]
    );
    console.log(result)
    res.status(200).json({ id: result.insertId });
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

