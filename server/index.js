const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://second-brain-beryl-delta.vercel.app/", // Aapka Vercel ka exact link
    methods: ["GET", "POST", "PUT", "DELETE"],
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
