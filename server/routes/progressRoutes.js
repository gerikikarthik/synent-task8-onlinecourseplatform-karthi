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
        success: false,
        message: "User not found",
      });
    }

    const courseId = req.params.courseId;

    if (!user.completedCourses) {
      user.completedCourses = [];
    }

    const exists = user.completedCourses.find(
      (id) => id.toString() === courseId
    );

    if (!exists) {
      user.completedCourses.push(courseId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Course completed successfully",
      completedCourses: user.completedCourses,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

module.exports = router;