require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const sequelize = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

/* ───────────────── Global Middlewares ────────────────────── */

app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

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

/* ──────────────── Database Sync & Start ─────────────────── */

const startServer = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log("✅ MySQL database connected successfully.");

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log("✅ Database tables synced.");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error.message);
    process.exit(1);
  }
};

startServer();
