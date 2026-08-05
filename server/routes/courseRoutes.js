const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const Quiz = require("../models/Quiz");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const { generateQuiz } = require("../services/geminiService");



// ======================
// ➕ ADD COURSE + AUTO QUIZ
// ======================
router.post("/", protect, adminOnly, async (req, res) => {

  try {


    // 1. Create Course

    const course = await Course.create(req.body);



    // 2. Generate AI Quiz

    try {


      const aiQuiz = await generateQuiz(
        course.title
      );


      await Quiz.create({

        courseId: course._id,

        questions: aiQuiz.questions

      });



      console.log(
        "AI Quiz Created For:",
        course.title
      );


    }
    catch(error){


      console.log(
        "AI Quiz Generation Failed:",
        error.message
      );


    }




    res.status(201).json({

      success:true,

      message:
      "Course created successfully with AI Quiz",

      course

    });



  }
  catch(error){


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

});





// ======================
// 📚 GET ALL COURSES
// ======================
router.get("/", async (req,res)=>{


  try{


    const courses =
    await Course.find();


    res.json(courses);


  }
  catch(error){


    res.status(500).json({

      message:error.message

    });


  }


});





// ======================
// 🔍 GET SINGLE COURSE
// ======================
router.get("/:id", async(req,res)=>{


  try{


    const course =
    await Course.findById(
      req.params.id
    );


    if(!course){

      return res.status(404).json({

        message:"Course not found"

      });

    }


    res.json(course);


  }
  catch(error){


    res.status(500).json({

      message:error.message

    });


  }


});





// ======================
// ✏️ UPDATE COURSE
// ======================
router.put("/:id", protect, adminOnly, async(req,res)=>{


  try{


    const course =
    await Course.findByIdAndUpdate(

      req.params.id,

      req.body,

      {
        new:true
      }

    );


    res.json(course);


  }
  catch(error){


    res.status(500).json({

      message:error.message

    });


  }


});





// ======================
// 🗑 DELETE COURSE
// ======================
router.delete("/:id", protect, adminOnly, async(req,res)=>{


  try{


    await Course.findByIdAndDelete(
      req.params.id
    );


    // delete related quiz also

    await Quiz.deleteMany({

      courseId:req.params.id

    });



    res.json({

      success:true,

      message:
      "Course and Quiz deleted successfully"

    });


  }
  catch(error){


    res.status(500).json({

      message:error.message

    });


  }


});




module.exports = router;