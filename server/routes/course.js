const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware"); // ✅ IMPORTANT

// ======================
// ➕ CREATE COURSE (ADMIN ONLY optional)
// ======================
router.get("/", async (req, res) => {
  try {
    const { title, description, price, videoUrl } = req.body;

    const course = await Course.create({
      title,
      description,
      price,
      videoUrl,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// 📚 GET ALL COURSES
// ======================
router.get("/", protect, async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// 🔍 GET SINGLE COURSE
// ======================
router.get("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// ✏️ UPDATE COURSE (ADMIN ONLY)
// ======================
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, price, videoUrl } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (price !== undefined) course.price = price;
    if (videoUrl !== undefined) course.videoUrl = videoUrl;

    const updatedCourse = await course.save();

    res.json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// 🗑 DELETE COURSE (ADMIN ONLY - SAFE OPTION)
// ======================
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;