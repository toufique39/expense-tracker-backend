
import "dotenv/config";

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = 5000;

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:10000",
    credentials: true,
  })
);


// Body parser
app.use(express.json());




// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API is running!",
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Expense Tracker API!",
  });
});


// Database health check
app.get("/api/health/db", async (req, res) => {
  try {
    const db = await connectDB();

    await db.command({ ping: 1 });
    res.status(200).json({
      success: true,
      message: "MongoDB connected successfully!",
      database: process.env.MONGODB_DB,
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});



async function startServer() {
  try {
    const db = await connectDB();

    await db.command({ ping: 1 });

    console.log("MongoDB Connected Successfully!");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
