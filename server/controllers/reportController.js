const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const Course = require("../models/Course");
const User = require("../models/User");
const Certificate = require("../models/Certificate");


// =====================================================
// EXPORT EXCEL REPORT
// Includes:
// 1. Users Sheet
// 2. Courses Sheet
// 3. Certificates Sheet
// =====================================================

const exportExcelReport = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password");


    const courses = await Course.find();


    const certificates = await Certificate.find()
      .populate("userId", "name email")
      .populate("courseId", "title");


    const workbook = new ExcelJS.Workbook();



    // =================================================
    // USERS SHEET
    // =================================================

    const userSheet =
      workbook.addWorksheet("Users");


    userSheet.columns = [

      {
        header: "Name",
        key: "name",
        width: 30,
      },

      {
        header: "Email",
        key: "email",
        width: 35,
      },

      {
        header: "Role",
        key: "role",
        width: 20,
      },

      {
        header: "Joined Date",
        key: "joined",
        width: 25,
      },

    ];



    users.forEach((user)=>{

      userSheet.addRow({

        name:user.name,

        email:user.email,

        role:user.role || "User",

        joined:user.createdAt
          ? new Date(
              user.createdAt
            ).toLocaleDateString()
          : "",

      });

    });



    userSheet.getRow(1).font={
      bold:true,
      size:12,
    };




    // =================================================
    // COURSES SHEET
    // =================================================


    const courseSheet =
      workbook.addWorksheet("Courses");



    courseSheet.columns=[

      {
        header:"Course Name",
        key:"title",
        width:35,
      },

      {
        header:"Category",
        key:"category",
        width:20,
      },

      {
        header:"Instructor",
        key:"instructor",
        width:25,
      },

      {
        header:"Price",
        key:"price",
        width:15,
      },

      {
        header:"Students",
        key:"students",
        width:15,
      },

      {
        header:"Rating",
        key:"rating",
        width:15,
      },

    ];



    courses.forEach((course)=>{

      courseSheet.addRow({

        title:course.title,

        category:course.category,

        instructor:course.instructor,

        price:course.price,

        students:course.students || 0,

        rating:course.rating || 0,

      });

    });



    courseSheet.getRow(1).font={
      bold:true,
      size:12,
    };





    // =================================================
    // CERTIFICATES SHEET
    // =================================================


    const certificateSheet =
      workbook.addWorksheet("Certificates");



    certificateSheet.columns=[


      {
        header:"Certificate ID",
        key:"certificateId",
        width:30,
      },


      {
        header:"Student Name",
        key:"student",
        width:30,
      },


      {
        header:"Email",
        key:"email",
        width:35,
      },


      {
        header:"Course Name",
        key:"course",
        width:35,
      },


      {
        header:"Issue Date",
        key:"date",
        width:25,
      },


    ];




    certificates.forEach((cert)=>{


      certificateSheet.addRow({

        certificateId:
          cert.certificateId,


        student:
          cert.userId?.name || "",


        email:
          cert.userId?.email || "",


        course:
          cert.courseId?.title || "",


        date:
          cert.createdAt
          ? new Date(
              cert.createdAt
            ).toLocaleDateString()
          : "",

      });


    });



    certificateSheet.getRow(1).font={
      bold:true,
      size:12,
    };
// =====================================================
// COMPLETE EXCEL DOWNLOAD
// =====================================================

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );


    res.setHeader(
      "Content-Disposition",
      "attachment; filename=CourseHub_Report.xlsx"
    );


    await workbook.xlsx.write(res);

    res.end();



  } catch (err) {

    console.log(err);


    res.status(500).json({

      success:false,

      message:"Failed to Export Excel Report",

    });

  }

};




// =====================================================
// EXPORT PDF REPORT
// =====================================================

const exportPDFReport = async (req,res)=>{

  try{


    const users =
      await User.find()
      .select("-password");


    const courses =
      await Course.find();



    const doc = new PDFDocument({

      margin:40,

      size:"A4",

    });



    res.setHeader(
      "Content-Type",
      "application/pdf"
    );



    res.setHeader(
      "Content-Disposition",
      "attachment; filename=CourseHub_Report.pdf"
    );



    doc.pipe(res);



    // ===============================
    // TITLE
    // ===============================


    doc
    .fontSize(24)
    .fillColor("#0d6efd")
    .text(
      "CourseHub LMS Report",
      {
        align:"center"
      }
    );


    doc.moveDown();



    doc
    .fontSize(12)
    .fillColor("black")
    .text(
      `Generated Date : ${new Date().toLocaleString()}`
    );



    doc.moveDown(2);



    // ===============================
    // USERS
    // ===============================


    doc
    .fontSize(18)
    .fillColor("green")
    .text("Users Report");



    doc.moveDown();



    doc
    .fontSize(12)
    .fillColor("black")
    .text(
      `Total Users : ${users.length}`
    );



    doc.moveDown();



    users.forEach((user,index)=>{


      doc
      .fontSize(12)
      .text(
        `${index+1}. ${user.name}`
      );


      doc.text(
        `Email : ${user.email}`
      );


      doc.text(
        `Role : ${user.role || "User"}`
      );


      doc.moveDown();



    });




    // ===============================
    // COURSES
    // ===============================


    doc.addPage();



    doc
    .fontSize(18)
    .fillColor("green")
    .text(
      "Courses Report"
    );



    doc.moveDown();



    doc
    .fontSize(12)
    .fillColor("black")
    .text(
      `Total Courses : ${courses.length}`
    );



    let totalStudents=0;

    let totalRevenue=0;



    courses.forEach((course)=>{


      totalStudents +=
      course.students || 0;



      totalRevenue +=
      (course.students || 0) *
      (course.price || 0);


    });



    doc.text(
      `Total Students : ${totalStudents}`
    );


    doc.text(
      `Estimated Revenue : ₹${totalRevenue}`
    );



    doc.moveDown();



    courses.forEach((course,index)=>{


      doc
      .fontSize(12)
      .fillColor("#0d6efd")
      .text(
        `${index+1}. ${course.title}`
      );


      doc
      .fillColor("black")
      .text(
        `Category : ${course.category}`
      )
      .text(
        `Instructor : ${course.instructor}`
      )
      .text(
        `Price : ₹${course.price}`
      )
      .text(
        `Students : ${course.students || 0}`
      )
      .text(
        `Rating : ${course.rating || 0}`
      );


      doc.moveDown();


    });



    doc.end();



  }
  catch(err){


    console.log(err);


    res.status(500).json({

      success:false,

      message:"Failed to Export PDF Report",

    });


  }


};






// =====================================================
// ANALYTICS API
// =====================================================

const getAnalytics = async(req,res)=>{


  try{


    const totalUsers =
    await User.countDocuments();



    const totalCourses =
    await Course.countDocuments();



    const totalCertificates =
    await Certificate.countDocuments();



    const courses =
    await Course.find();



    let totalStudents=0;

    let totalRevenue=0;

    let averageRating=0;

    let popularCourse="N/A";

    let highestStudents=0;



    courses.forEach((course)=>{


      totalStudents +=
      course.students || 0;



      totalRevenue +=
      (course.students || 0)
      *
      (course.price || 0);



      averageRating +=
      course.rating || 0;



      if(
        (course.students || 0)
        >
        highestStudents
      ){

        highestStudents =
        course.students;


        popularCourse =
        course.title;

      }


    });



    if(courses.length>0){

      averageRating =
      (
        averageRating /
        courses.length
      )
      .toFixed(1);

    }



    res.json({

      success:true,


      analytics:{


        totalUsers,

        totalCourses,

        totalCertificates,

        totalStudents,

        totalRevenue,

        averageRating,

        popularCourse,


      }


    });



  }
  catch(err){


    console.log(err);


    res.status(500).json({

      success:false,

      message:"Analytics Failed",

    });


  }


};
// =====================================================
// EXPORT STUDENTS REPORT
// =====================================================

const exportStudentsReport = async (req,res)=>{

  try{

    const students =
      await User.find()
      .select("-password");


    res.status(200).json({

      success:true,

      totalStudents:
        students.length,

      students,

    });


  }
  catch(err){

    console.log(err);


    res.status(500).json({

      success:false,

      message:
      "Failed to Export Students Report",

    });

  }

};





// =====================================================
// EXPORT COURSES REPORT
// =====================================================

const exportCoursesReport = async(req,res)=>{

  try{


    const courses =
      await Course.find();



    res.status(200).json({

      success:true,

      totalCourses:
        courses.length,

      courses,

    });



  }
  catch(err){


    console.log(err);



    res.status(500).json({

      success:false,

      message:
      "Failed to Export Courses Report",

    });


  }


};






// =====================================================
// EXPORT CERTIFICATES REPORT
// =====================================================

const exportCertificatesReport = async(req,res)=>{


  try{


    const certificates =
      await Certificate.find()

      .populate(
        "userId",
        "name email"
      )

      .populate(
        "courseId",
        "title"
      );




    res.status(200).json({

      success:true,

      totalCertificates:
        certificates.length,


      certificates,

    });



  }
  catch(err){


    console.log(err);



    res.status(500).json({

      success:false,

      message:
      "Failed to Export Certificates Report",

    });


  }


};






// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================

module.exports = {


  exportExcelReport,


  exportPDFReport,


  getAnalytics,


  exportStudentsReport,


  exportCoursesReport,


  exportCertificatesReport,


};