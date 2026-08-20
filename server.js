require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const pool = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

/* ───────────────── Global Middlewares ────────────────────── */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ─────────────────────── Routes ─────────────────────────── */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GaavConnect API is running 🚀",
  });
});

app.use("/api/auth", authRoutes);

/* ───────────────── Global Error Handler ─────────────────── */

app.use(errorHandler);

/* ──────────────── Database Connection & Start ───────────── */

const startServer = async () => {
  try {
    // Test MySQL connection
    const connection = await pool.getConnection();

    console.log("✅ MySQL database connected successfully.");

    connection.release();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Unable to start server:", error.message);
    process.exit(1);
  }
};

startServer();