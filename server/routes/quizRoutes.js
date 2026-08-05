
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");


const {
  createQuiz,
  getQuizByCourse,
  submitQuiz,
  generateAIQuiz
} = require("../controllers/quizController");



// TEST
router.get("/test",(req,res)=>{

    res.json({
        success:true,
        message:"Quiz route working"
    });

});




// AI GENERATE QUIZ

router.post(
    "/generate/:courseId",
    authMiddleware,
    generateAIQuiz
);




// CREATE QUIZ

router.post(
    "/",
    authMiddleware,
    createQuiz
);




// SUBMIT QUIZ

router.post(
    "/submit",
    authMiddleware,
    submitQuiz
);




// GET QUIZ

router.get(
    "/:courseId",
    authMiddleware,
    getQuizByCourse
);



module.exports = router;