const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./src/config/db");
const siswaRoutes = require("./src/routes/siswaRoutes");
const masterdataRoutes = require("./src/routes/masterdataRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/siswa", siswaRoutes);
app.use("/api/masterdata", masterdataRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend Data Siswa aktif 🚀" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

app.listen(PORT, async () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  await testConnection();
});