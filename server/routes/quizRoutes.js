const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createQuiz,
  getQuizByCourse,
  submitQuiz,
  generateAIQuiz,
} = require("../controllers/quizController");



// =======================
// Test Route
// GET /api/quiz/test
// =======================
router.get("/test", (req, res) => {

  res.json({
    success: true,
    message: "Quiz route working"
  });

});




// =======================
// Debug Route
// GET /api/quiz/check/:courseId
// =======================




// =======================
// AI Generate Quiz
// POST /api/quiz/generate/:courseId
// =======================
router.post(
  "/generate/:courseId",
  authMiddleware,
  generateAIQuiz
);




// =======================
// Create Quiz (Admin)
// POST /api/quiz
// =======================
router.post(
  "/",
  authMiddleware,
  createQuiz
);




// =======================
// Submit Quiz
// POST /api/quiz/submit
// =======================
router.post(
  "/submit",
  authMiddleware,
  submitQuiz
);




// =======================
// Get Quiz By Course
// GET /api/quiz/:courseId
// =======================
router.get(
  "/:courseId",
  authMiddleware,
  getQuizByCourse
);



module.exports = router;