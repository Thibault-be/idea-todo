const mariadb = require("mariadb");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});

app.use(express.json());

app.get("/", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const data = await connection.query(`SELECT * FROM brilliant_minds.ideas`);
    res.json(data);
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.end();
  }
});

app.get("/create.html", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const data = await connection.query(`SELECT * FROM brilliant_minds.ideas`);
    console.log(data);
    res.json(data);
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.end();
  }
});

app.post("/create", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { title, description } = req.body;

    // Insert the new idea into the database
    await connection.query(
      `INSERT INTO brilliant_minds.ideas (title, description) VALUES (?, ?)`,
      [title, description]
    );

    res.json({ success: true, message: "Idea logged successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to log the idea." });
    throw err;
  } finally {
    if (connection) connection.end();
  }
});

app.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    //delete the idea id from the database
    await connection.query(`DELETE FROM brilliant_minds.ideas WHERE id = ?`, [
      req.params.id,
    ]);
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) connection.release();
  }
});

app.patch("/:id", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { title, description } = req.body;

    //update title and description in the database
    await connection.query(
      `UPDATE brilliant_minds.ideas SET title = ?, description = ? WHERE id = ?`,
      [title, description, req.params.id]
    );
  } catch (err) {
    console.log(err);
  } finally {
    if (connection) connection.release();
  }
});
