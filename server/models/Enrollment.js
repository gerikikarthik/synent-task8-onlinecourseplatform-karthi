const mongoose = require("mongoose");


const enrollmentSchema = new mongoose.Schema(

{
  
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },


  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true
  },


  paymentStatus:{
    type:String,
    default:"Paid"
  },


  amount:{
    type:Number,
    default:99
  },


  progress:{
    type:Number,
    default:0
  },


  completed:{
    type:Boolean,
    default:false
  },


  enrolledAt:{
    type:Date,
    default:Date.now
  }


},

{
 timestamps:true
}


);


// one user one course only once

enrollmentSchema.index(
 {
  user:1,
  course:1
 },
 {
  unique:true
 }
);


module.exports = mongoose.model(
 "Enrollment",
 enrollmentSchema
);