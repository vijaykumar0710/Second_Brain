const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    // FIX: End se slash (/) hata diya hai! ✅
    origin: "https://second-brain-beryl-delta.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // OPTIONS bhi add kar diya safety ke liye
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/links", require("./routes/linkRoutes"));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🧠 Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });
