const express = require("express");
const router = express.Router();

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

router.post("/complete/:courseId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyCompleted = user.completedCourses.some(
      (course) => course.toString() === req.params.courseId
    );

    if (!alreadyCompleted) {
      user.completedCourses.push(req.params.courseId);
      await user.save();
    }

    res.json({
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