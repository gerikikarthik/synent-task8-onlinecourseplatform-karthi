const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema({

  question: {
    type: String,
    required: true,
    trim: true
  },


  options: {
    type: [String],
    required: true
  },


  answer: {
    type: String,
    required: true,
    trim: true
  }

});



const quizSchema = new mongoose.Schema(

{

  courseId: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "Course",

    required: true,

    unique: true

  },


  questions: [

    questionSchema

  ]

},

{

 timestamps:true

}

);



module.exports = mongoose.model(
 "Quiz",
 quizSchema
);