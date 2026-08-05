const Enrollment = require("../models/Enrollment");


// ===============================
// ENROLL COURSE
// ===============================
const enrollCourse = async (req, res) => {

  try {

    const { courseId } = req.body;


    if (!courseId) {

      return res.status(400).json({

        success:false,

        message:"Course ID is required"

      });

    }



    const existingEnrollment = await Enrollment.findOne({

      user:req.user.id,

      course:courseId

    });



    if(existingEnrollment){

      return res.status(400).json({

        success:false,

        message:"You are already enrolled in this course"

      });

    }



    const enrollment = await Enrollment.create({

      user:req.user.id,

      course:courseId,

      paymentStatus:"Paid",

      amount:99,

      progress:0,

      completed:false

    });



    res.status(201).json({

      success:true,

      message:"Course enrolled successfully",

      enrollment

    });



  }
  catch(error){

    console.log(
      "Enroll Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};




// ===============================
// GET MY COURSES
// ===============================
const getMyCourses = async(req,res)=>{

  try{


    const courses = await Enrollment.find({

      user:req.user.id

    })
    .populate("course");



    res.json({

      success:true,

      courses

    });



  }
  catch(error){


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

};





// ===============================
// GET ALL ENROLLMENTS ADMIN
// ===============================
const getAllEnrollments = async(req,res)=>{


  try{


    const enrollments = await Enrollment.find()

    .populate("user","name email")

    .populate("course","title price");



    res.json({

      success:true,

      enrollments

    });



  }
  catch(error){


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

};






// ===============================
// UPDATE COURSE PROGRESS
// ===============================
const updateProgress = async(req,res)=>{

  try{


    const {courseId} = req.params;

    const {progress} = req.body;



    console.log(
      "USER ID:",
      req.user.id
    );


    console.log(
      "COURSE ID:",
      courseId
    );



    const enrollment = await Enrollment.findOne({

      user:req.user.id,

      course:courseId

    });



    if(!enrollment){


      return res.status(404).json({

        success:false,

        message:"Enrollment not found"

      });


    }



    enrollment.progress = progress;



    if(progress >= 100){

      enrollment.completed = true;

    }



    await enrollment.save();



    res.json({

      success:true,

      message:"Progress updated successfully",

      enrollment

    });



  }
  catch(error){


    console.log(
      "Progress Error:",
      error
    );


    res.status(500).json({

      success:false,

      message:error.message

    });


  }

};






module.exports = {

  enrollCourse,

  getMyCourses,

  getAllEnrollments,

  updateProgress

};