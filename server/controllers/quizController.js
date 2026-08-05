const Quiz = require("../models/Quiz");
const Course = require("../models/Course");

const { generateQuiz } = require("../services/geminiService");


// =================================
// Create Quiz (Admin)
// =================================

exports.createQuiz = async (req, res) => {

  try {

    const { courseId, questions } = req.body;


    const quiz = new Quiz({

      courseId,

      questions,

    });


    await quiz.save();


    res.status(201).json({

      success: true,

      message: "Quiz created successfully",

      quiz,

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};




// =================================
// AI Generate Quiz
// =================================

exports.generateAIQuiz = async (req, res) => {

  try {


    const { courseId } = req.params;



    const course = await Course.findById(courseId);



    if (!course) {

      return res.status(404).json({

        success: false,

        message: "Course not found",

      });

    }



    const aiQuiz = await generateQuiz(
      course.title
    );



    const quiz = new Quiz({

      courseId: courseId,

      questions: aiQuiz.questions,

    });



    await quiz.save();



    res.json({

      success: true,

      message: "AI Quiz Generated Successfully",

      quiz,

    });



  } catch (error) {


    console.log("AI Quiz Error:", error.message);



    res.status(500).json({

      success: false,

      message: error.message,

    });


  }

};




// =================================
// Get Quiz by Course ID
// =================================

exports.getQuizByCourse = async (req, res) => {

  try {


    const quiz = await Quiz.findOne({

      courseId: req.params.courseId,

    });



    if (!quiz) {

      return res.status(404).json({

        success: false,

        message: "Quiz not found",

      });

    }



    res.json({

      success: true,

      quiz,

    });



  } catch (error) {


    res.status(500).json({

      success: false,

      message: error.message,

    });


  }

};




// =================================
// Submit Quiz
// =================================

exports.submitQuiz = async (req, res) => {

  try {


    const { courseId, answers } = req.body;



    const quiz = await Quiz.findOne({

      courseId,

    });



    if (!quiz) {

      return res.status(404).json({

        success: false,

        message: "Quiz not found",

      });

    }



    let score = 0;



    quiz.questions.forEach((q) => {


      if (

        answers[q._id] === q.answer

      ) {

        score++;

      }


    });



    const percentage = Math.round(

      (score / quiz.questions.length) * 100

    );



    res.json({

      success: true,

      score,

      total: quiz.questions.length,

      percentage,

      passed: percentage >= 70,

    });



  } catch (error) {


    res.status(500).json({

      success: false,

      message: error.message,

    });


  }

};