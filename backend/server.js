const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path"); // <-- 1. ADD THIS LINE

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increase limit for base64 image

// --- API ROUTES ---
// Your API routes must come BEFORE the static file routes.
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ai", require("./routes/airoutes")); // Mount AI route

// --- STATIC FRONTEND ROUTES ---
// 2. ADD THESE LINES
// This section serves your built React app
app.use(express.static(path.join(__dirname, "dist")));

// 3. ADD THIS CATCH-ALL ROUTE
// This sends 'index.html' for any request that doesn't match an API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
