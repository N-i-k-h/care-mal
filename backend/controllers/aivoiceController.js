const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // Optional: only if using MongoDB
const aiRoutes = require("./routes/airoutes"); // Optional general AI route
const aiVoiceRoutes = require("./routes/aivoiceRoutes"); // For voice assistant

dotenv.config();

// Optional: Connect to MongoDB if you're using it
connectDB();

const app = express();

// CORS: allow frontend to access backend
app.use(cors({ origin: process.env.FRONTEND_URL }));

// JSON body parser with large limit for audio/image data
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/ai", aiRoutes); // Optional general AI
app.use("/api/voice", aiVoiceRoutes); // AI Voice Assistant route

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
