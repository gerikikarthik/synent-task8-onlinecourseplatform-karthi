const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


const {
  createQuiz,
  getQuizByCourse,
  submitQuiz
} = require("../controllers/quizController");



// ===============================
// TEST ROUTE
// GET /api/quiz/test
// ===============================
router.get(
  "/test",
  (req,res)=>{

    res.json({

      success:true,

      message:"Quiz route working"

    });

  }
);





// ===============================
// CREATE QUIZ (ADMIN)
// POST /api/quiz/create
// ===============================
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  createQuiz
);





// ===============================
// GET QUIZ BY COURSE
// GET /api/quiz/:courseId
// ===============================
router.get(
  "/:courseId",
  authMiddleware,
  getQuizByCourse
);





// ===============================
// SUBMIT QUIZ
// POST /api/quiz/submit
// ===============================
router.post(
  "/submit",
  authMiddleware,
  submitQuiz
);




module.exports = router;