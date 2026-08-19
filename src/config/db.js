const mysql = require("mysql2/promise");
require("dotenv").config();

// Pool connection -> lebih efisien daripada single connection
// karena bisa handle banyak request bersamaan tanpa bikin koneksi baru terus-menerus
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db_data_siswa",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test koneksi saat server start
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Berhasil terkoneksi ke database MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ Gagal konek ke database:", error.message);
  }
}

module.exports = { pool, testConnection };