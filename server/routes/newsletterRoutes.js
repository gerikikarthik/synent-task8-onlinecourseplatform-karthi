const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");

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

module.exports = router;