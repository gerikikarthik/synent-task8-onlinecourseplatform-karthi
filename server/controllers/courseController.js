const Course = require("../models/Course");
const Quiz = require("../models/Quiz");
const { generateQuiz } = require("../services/geminiService");



// ===============================
// CREATE COURSE + AUTO AI QUIZ
// ===============================

const createCourse = async(req,res)=>{

    try{


        // Create Course

        const course = await Course.create(
            req.body
        );



        // Generate AI Quiz Automatically

        try{


            const aiQuiz = await generateQuiz(
                course.title
            );



            await Quiz.create({

                courseId: course._id,

                questions: aiQuiz.questions

            });



            console.log(
                "AI Quiz Created"
            );


        }
        catch(error){


            console.log(
                "AI Quiz Error:",
                error.message
            );


        }




        res.status(201).json({

            success:true,

            message:
            "Course created successfully",

            course

        });



    }
    catch(error){


        console.log(
            "Course Create Error:",
            error.message
        );


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};





// ===============================
// GET ALL COURSES
// ===============================

const getCourses = async(req,res)=>{


    try{


        const courses =
        await Course.find();



        res.json({

            success:true,

            courses

        });


    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};





// ===============================
// GET SINGLE COURSE
// ===============================

const getCourseById = async(req,res)=>{


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

};





// ===============================
// DELETE COURSE
// ===============================

const deleteCourse = async(req,res)=>{


    try{


        await Course.findByIdAndDelete(
            req.params.id
        );


        await Quiz.deleteMany({

            courseId:req.params.id

        });



        res.json({

            success:true,

            message:"Course deleted"

        });



    }
    catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};





module.exports = {

    createCourse,

    getCourses,

    getCourseById,

    deleteCourse

};