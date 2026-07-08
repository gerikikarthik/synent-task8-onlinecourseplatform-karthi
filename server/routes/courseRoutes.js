const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// ======================
// ➕ ADD COURSE (ADMIN ONLY)
// ======================
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json(course);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// 📚 GET ALL COURSES (PUBLIC)
// ======================
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// 🔍 GET SINGLE COURSE (PUBLIC)
// ======================
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// ✏️ UPDATE COURSE (ADMIN ONLY)
// ======================
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(course);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// ======================
// 🗑 DELETE COURSE (ADMIN ONLY)
// ======================
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;