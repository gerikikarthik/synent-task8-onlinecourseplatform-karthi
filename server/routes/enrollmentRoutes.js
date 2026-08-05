const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");


const {
  enrollCourse,
  getMyCourses,
  getAllEnrollments,
  updateProgress
} = require("../controllers/enrollmentController");



// Enroll Course
router.post(
  "/",
  authMiddleware,
  enrollCourse
);



// My Courses
router.get(
  "/mycourses",
  authMiddleware,
  getMyCourses
);



// All Enrollments
router.get(
  "/all",
  authMiddleware,
  getAllEnrollments
);



// Update Progress
router.put(
  "/progress/:courseId",
  authMiddleware,
  updateProgress
);



module.exports = router;