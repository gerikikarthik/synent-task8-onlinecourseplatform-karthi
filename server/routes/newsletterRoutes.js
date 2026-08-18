const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");

// ===============================
// SUBSCRIBE TO NEWSLETTER
// POST /api/newsletter/subscribe
// ===============================
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const existingEmail = await Newsletter.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        message: "Email already subscribed",
      });
    }

    const subscriber = new Newsletter({
      email,
    });

    await subscriber.save();

    res.status(201).json({
      message: "Successfully subscribed to newsletter!",
    });
  } catch (error) {
    console.error("Newsletter Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// GET NEWSLETTER SUBSCRIBERS
// GET /api/newsletter/subscribers
// ===============================
router.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await Newsletter.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      subscribers,
    });
  } catch (error) {
    console.error(
      "Fetch Newsletter Subscribers Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch newsletter subscribers",
    });
  }
});

module.exports = router;