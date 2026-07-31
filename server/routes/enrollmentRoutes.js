const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  enrollCourse,
  getMyCourses,
} = require("../controllers/enrollmentController");

// ===============================
// ENROLL IN COURSE
// POST /api/enroll
// ===============================
router.post(
  "/",
  authMiddleware,
  enrollCourse
);

// ===============================
// GET MY ENROLLED COURSES
// GET /api/enroll/mycourses
// ===============================
router.get(
  "/mycourses",
  authMiddleware,
  getMyCourses
);

module.exports = router;