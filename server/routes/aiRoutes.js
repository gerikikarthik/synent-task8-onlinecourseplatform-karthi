const express = require("express");
const router = express.Router();

const { createRoadmap } = require("../controllers/aiController");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "AI Route Working",
  });
});

// Roadmap Route
router.post("/roadmap", createRoadmap);

module.exports = router;