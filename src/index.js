
import "dotenv/config";

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import { requireAuth } from "./middleware/auth.middleware.js";

const app = express();
const PORT = 5000;

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:10000",
    credentials: true,
  })
);

// Better Auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));


// Body parser
app.use(express.json());


// Protected user profile route
app.get("/api/protected/me", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated user information",
    user: req.user,
  });
});


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
