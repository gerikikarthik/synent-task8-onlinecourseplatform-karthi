const express = require("express");
const router = express.Router();

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

// Complete Course
router.post("/complete/:courseId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Already completed check
    if (!user.completedCourses.includes(req.params.courseId)) {
      user.completedCourses.push(req.params.courseId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Course completed successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;