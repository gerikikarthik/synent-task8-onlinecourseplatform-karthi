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

    // Shuffle questions
    const shuffledQuestions = [...quiz.questions].sort(
      () => Math.random() - 0.5
    );

    return res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        courseId: quiz.courseId,
        questions: shuffledQuestions
      }
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ===============================
// CREATE OR UPDATE QUIZ
// POST /api/quiz/create
// ===============================
const createQuiz = async (req, res) => {

  try {

    const { courseId, questions } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    if (!questions || questions.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Minimum 3 questions required"
      });
    }

    // Check if quiz already exists
    const existingQuiz = await Quiz.findOne({ courseId });

    // Update existing quiz
    if (existingQuiz) {

      existingQuiz.questions = questions;

      await existingQuiz.save();

      return res.status(200).json({
        success: true,
        message: "Quiz updated successfully",
        quiz: existingQuiz
      });

    }

    // Create new quiz
    const quiz = await Quiz.create({
      courseId,
      questions
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
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

    quiz.questions.forEach((question) => {

      const questionId = String(question._id);

      const userAnswer = String(
        answers[questionId] || ""
      )
        .trim()
        .toLowerCase();

      const correctAnswer = String(
        question.answer || ""
      )
        .trim()
        .toLowerCase();

      console.log("===========================");
      console.log("Question :", question.question);
      console.log("Question ID :", questionId);
      console.log("User Answer :", userAnswer);
      console.log("Correct Answer :", correctAnswer);

      if (userAnswer === correctAnswer) {
        score++;
      }

    });

    const totalQuestions = quiz.questions.length;

    const percentage = Math.round(
      (score / totalQuestions) * 100
    );

    return res.status(200).json({
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

  } catch (error) {

    console.log("Submit Quiz Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ===============================
// EXPORTS
// ===============================
module.exports = {
  getQuizByCourse,
  createQuiz,
  submitQuiz
};