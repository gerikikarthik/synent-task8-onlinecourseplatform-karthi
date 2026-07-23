const express = require("express");
const router = express.Router();

const Certificate = require("../models/Certificate");
const User = require("../models/User");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

// Generate Certificate
router.post("/:courseId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Already Generated?
    const already = await Certificate.findOne({
      userId: user._id,
      courseId: course._id,
    });

    if (already) {
      return res.json(already);
    }

    // Generate Professional Certificate ID
    const year = new Date().getFullYear();

    const code = course.title
      .substring(0, 3)
      .toUpperCase();

    const random = Math.floor(1000 + Math.random() * 9000);

    const certificateId = `CH-${code}-${year}-${random}`;

    // Save Certificate
    const certificate = await Certificate.create({
      userId: user._id,
      courseId: course._id,
      studentName: user.name,
      courseName: course.title,
      certificateId,
    });

    res.status(201).json(certificate);

  } catch (err) {
    console.error("Certificate Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;