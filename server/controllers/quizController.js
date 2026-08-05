const Quiz = require("../models/Quiz");

// ===============================
// GET QUIZ BY COURSE
// GET /api/quiz/:courseId
// ===============================
const getQuizByCourse = async (req, res) => {

  try {

    const { courseId } = req.params;

    const quiz = await Quiz.findOne({ courseId });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Shuffle questions every time
    const questions = [...quiz.questions].sort(
      () => Math.random() - 0.5
    );

    res.json({
      success: true,
      questions
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ===============================
// CREATE QUIZ
// POST /api/quiz
// ===============================
const createQuiz = async (req, res) => {

  try {

    const { courseId, questions } = req.body;

    if (!courseId || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CourseId and Questions are required"
      });
    }

    const existingQuiz = await Quiz.findOne({ courseId });

    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        message: "Quiz already exists for this course"
      });
    }

    const quiz = await Quiz.create({
      courseId,
      questions
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
// ===============================
// SUBMIT QUIZ
// POST /api/quiz/submit
// ===============================
const submitQuiz = async (req, res) => {

  try {

    const { courseId, answers } = req.body;

    if (!courseId || !answers) {

      return res.status(400).json({
        success: false,
        message: "CourseId and answers are required"
      });

    }

    const quiz = await Quiz.findOne({ courseId });

    if (!quiz) {

      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });

    }

    let score = 0;

    quiz.questions.forEach((q) => {

      const userAnswer =
        (answers[q._id] || "")
          .trim()
          .toLowerCase();

      const correctAnswer =
        (q.answer || "")
          .trim()
          .toLowerCase();

      console.log("----------------------------");
      console.log("Question :", q.question);
      console.log("User     :", userAnswer);
      console.log("Correct  :", correctAnswer);

      if (userAnswer === correctAnswer) {
        score++;
      }

    });

    const totalQuestions = quiz.questions.length;

    const percentage = Math.round(
      (score / totalQuestions) * 100
    );

    res.status(200).json({

      success: true,

      totalQuestions,

      correctAnswers: score,

      percentage,

      passed: percentage >= 70,

      message:
        percentage >= 70
          ? "Quiz Passed"
          : "Quiz Failed"

    });

  }
  catch (error) {

    console.log("Submit Quiz Error:", error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
module.exports = {
  createQuiz,
  getQuizByCourse,
  submitQuiz
};