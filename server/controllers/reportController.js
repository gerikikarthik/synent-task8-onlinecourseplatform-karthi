const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const Course = require("../models/Course");

// ===============================
// EXPORT EXCEL REPORT
// ===============================

const exportExcelReport = async (req, res) => {

  try {

    const courses = await Course.find();

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Courses Report");

    worksheet.columns = [

      { header: "Title", key: "title", width: 30 },

      { header: "Category", key: "category", width: 20 },

      { header: "Instructor", key: "instructor", width: 25 },

      { header: "Price", key: "price", width: 15 },

      { header: "Students", key: "students", width: 15 },

      { header: "Rating", key: "rating", width: 15 }

    ];

    courses.forEach((course) => {

      worksheet.addRow({

        title: course.title,

        category: course.category,

        instructor: course.instructor,

        price: course.price,

        students: course.students,

        rating: course.rating

      });

    });

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

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      message: "Failed to Export Excel"

    });

  }

};

// ===============================
// EXPORT PDF REPORT
// ===============================

const exportPDFReport = async (req, res) => {

  try {

    const courses = await Course.find();

    const doc = new PDFDocument({

      margin: 40,

      size: "A4",

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

    // Title

    doc
      .fontSize(24)
      .fillColor("#0d6efd")
      .text("CourseHub LMS Report", {

        align: "center",

      });

    doc.moveDown();

    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Generated On : ${new Date().toLocaleString()}`);

    doc.moveDown();

    doc
      .fontSize(18)
      .fillColor("green")
      .text("Courses Report");

    doc.moveDown();

    courses.forEach((course, index) => {

      doc
        .fontSize(12)
        .fillColor("black")
        .text(`${index + 1}. ${course.title}`);

      doc.text(`Category : ${course.category}`);

      doc.text(`Instructor : ${course.instructor}`);

      doc.text(`Price : ₹${course.price}`);

      doc.text(`Students : ${course.students}`);

      doc.text(`Rating : ⭐ ${course.rating}`);

      doc.moveDown();

    });

    doc.end();

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      message: "Failed to Export PDF"

    });

  }

};

// ===============================
// EXPORTS
// ===============================

module.exports = {

  exportExcelReport,

  exportPDFReport

};