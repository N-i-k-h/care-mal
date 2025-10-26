const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increase limit for base64 image

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ai", require("./routes/airoutes")); // Mount AI route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
