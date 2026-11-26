
import "dotenv/config";

import express from "express";
import cors from "cors";

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



// Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
