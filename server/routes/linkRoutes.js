const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  saveLink,
  getLinks,
  summarizeLink,
  deleteLink, // Included the deleteLink import
} = require("../controllers/linkController");

// Fetch all links for the user
router.get("/", auth, getLinks);

// Save a new link
router.post("/", auth, saveLink);

// Generate AI summary
router.put("/:id/summarize", auth, summarizeLink);

// Delete a specific link
router.delete("/:id", auth, deleteLink);

module.exports = router;
