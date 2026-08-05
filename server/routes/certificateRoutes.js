const express = require("express");
const router = express.Router();

const Certificate = require("../models/Certificate");
const User = require("../models/User");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

// ======================================
// GENERATE CERTIFICATE
// POST /api/certificate/:courseId
// ======================================
router.post("/:courseId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const already = await Certificate.findOne({
      userId: user._id,
      courseId: course._id,
    });

    if (already) {
      return res.json({
        success: true,
        certificate: already,
      });
    }

    const year = new Date().getFullYear();
    const code = course.title.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);

    const certificateId = `CH-${code}-${year}-${random}`;

    const certificate = await Certificate.create({
      userId: user._id,
      courseId: course._id,
      studentName: user.name,
      courseName: course.title,
      certificateId,
    });

    res.status(201).json({
      success: true,
      certificate,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ======================================
// GET ALL CERTIFICATES (ADMIN)
// GET /api/certificate/all
// ======================================
router.get("/all", protect, async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("userId", "name email")
      .populate("courseId", "title");

    res.json({
      success: true,
      certificates,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;