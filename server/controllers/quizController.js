const Quiz = require("../models/Quiz");
const Course = require("../models/Course");

const { generateQuiz } = require("../services/geminiService");



// ===============================
// GET QUIZ BY COURSE
// ===============================
const getQuizByCourse = async(req,res)=>{

  try{

    const {courseId}=req.params;


    const quiz = await Quiz.findOne({
      courseId
    });


    if(!quiz){

      return res.status(404).json({

        success:false,

        message:"Quiz not found"

      });

    }


    res.json({

      success:true,

      questions:quiz.questions

    });


  }
  catch(error){

    res.status(500).json({

      message:error.message

    });

  }

};






// ===============================
// CREATE QUIZ MANUAL
// ===============================
const createQuiz = async(req,res)=>{

 try{


  const quiz = await Quiz.create(req.body);


  res.json({

    success:true,

    quiz

  });


 }
 catch(error){

  res.status(500).json({

    message:error.message

  });

 }

};






// ===============================
// AI QUIZ GENERATOR
// POST /api/quiz/generate/:courseId
// ===============================
const generateAIQuiz = async(req,res)=>{


 try{


   const {courseId}=req.params;



   // check existing quiz

   const existingQuiz = await Quiz.findOne({
    courseId
   });



   if(existingQuiz){

     return res.json({

       success:true,

       message:"Quiz already exists",

       quiz:existingQuiz

     });

   }





   const course = await Course.findById(courseId);



   if(!course){

     return res.status(404).json({

       success:false,

       message:"Course not found"

     });

   }






   const aiResponse = await generateQuiz(
      course.title
   );





   const quiz = await Quiz.create({

      courseId,

      questions:aiResponse.questions

   });





   res.json({

     success:true,

     message:"AI Quiz generated successfully",

     quiz

   });



 }
 catch(error){


   console.log(
    "AI QUIZ ERROR:",
    error
   );


   res.status(500).json({

     success:false,

     message:error.message

   });


 }


};






// ===============================
// SUBMIT QUIZ
// ===============================
const submitQuiz = async(req,res)=>{


 try{


  res.json({

    success:true,

    message:"Quiz submitted"

  });


 }
 catch(error){

  res.status(500).json({

    message:error.message

  });

 }

};






module.exports={

 createQuiz,

 getQuizByCourse,

 submitQuiz,

 generateAIQuiz

};