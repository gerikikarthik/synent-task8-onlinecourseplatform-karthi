const express = require("express");
const router = express.Router();

const {
  createRoadmap,
  createCodingQuestions,
} = require("../controllers/aiController");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "AI Route Working",
  });
});

// Roadmap Route
router.post(
  "/roadmap",
  createRoadmap
);

// Coding Questions Route
router.post(
  "/coding-questions",
  createCodingQuestions
);

module.exports = router;