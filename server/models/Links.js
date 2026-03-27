const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, default: "Untitled Link" },
  description: { type: String },
  imageUrl: { type: String },
  aiSummary: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Link", LinkSchema);
