const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const Course = require("../models/Course");
const User = require("../models/User");
const Certificate = require("../models/Certificate");

// =========================================
// EXPORT EXCEL REPORT
// =========================================

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
      { header: "Rating", key: "rating", width: 15 },
    ];

    courses.forEach((course) => {
      worksheet.addRow({
        title: course.title,
        category: course.category,
        instructor: course.instructor,
        price: course.price,
        students: course.students,
        rating: course.rating,
      });
    });

    worksheet.getRow(1).font = {
      bold: true,
      size: 12,
    };

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
      success: false,
      message: "Failed to Export Excel Report",
    });
  }
};
// =========================================
// EXPORT PDF REPORT
// =========================================

const exportPDFReport = async (req, res) => {
  try {
    const courses = await Course.find();

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");

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

    // Summary
    doc.fontSize(12).fillColor("black");
    doc.text(`Total Courses : ${courses.length}`);

    let totalStudents = 0;
    let totalRevenue = 0;

    courses.forEach((course) => {
      totalStudents += course.students || 0;
      totalRevenue += (course.students || 0) * (course.price || 0);
    });

    doc.text(`Total Students : ${totalStudents}`);
    doc.text(`Estimated Revenue : ₹${totalRevenue}`);

    doc.moveDown();

    // Course Details
    courses.forEach((course, index) => {
      doc
        .fontSize(13)
        .fillColor("#0d6efd")
        .text(`${index + 1}. ${course.title}`);

      doc.fillColor("black");
      doc.text(`Category   : ${course.category}`);
      doc.text(`Instructor : ${course.instructor}`);
      doc.text(`Price      : ₹${course.price}`);
      doc.text(`Students   : ${course.students}`);
      doc.text(`Rating     : ⭐ ${course.rating}`);

      doc.moveDown();
    });

    doc.end();

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to Export PDF Report",
    });
  }
};
// =========================================
// ANALYTICS API
// =========================================

const getAnalytics = async (req, res) => {
  try {

    const totalCourses = await Course.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCertificates = await Certificate.countDocuments();

    const courses = await Course.find();

    let totalStudents = 0;
    let totalRevenue = 0;
    let highestStudents = 0;
    let mostPopularCourse = "N/A";
    let averageRating = 0;

    courses.forEach((course) => {

      totalStudents += course.students || 0;

      totalRevenue += (course.students || 0) * (course.price || 0);

      averageRating += course.rating || 0;

      if ((course.students || 0) > highestStudents) {
        highestStudents = course.students;
        mostPopularCourse = course.title;
      }

    });

    if (courses.length > 0) {
      averageRating = (averageRating / courses.length).toFixed(1);
    }

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalCourses,
        totalCertificates,
        totalStudents,
        totalRevenue,
        averageRating,
        mostPopularCourse,
      },
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to Load Analytics",
    });

  }
};
// =========================================
// EXPORT STUDENTS REPORT
// =========================================

const exportStudentsReport = async (req, res) => {
  try {

    const students = await User.find().select("-password");

    res.status(200).json({
      success: true,
      totalStudents: students.length,
      students,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to Export Students Report",
    });

  }
};

// =========================================
// EXPORT COURSES REPORT
// =========================================

const exportCoursesReport = async (req, res) => {
  try {

    const courses = await Course.find();

    res.status(200).json({
      success: true,
      totalCourses: courses.length,
      courses,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to Export Courses Report",
    });

  }
};
// =========================================
// EXPORT CERTIFICATES REPORT
// =========================================

const exportCertificatesReport = async (req, res) => {
  try {

    const certificates = await Certificate.find()
      .populate("userId", "name email")
      .populate("courseId", "title");

    res.status(200).json({
      success: true,
      totalCertificates: certificates.length,
      certificates,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to Export Certificates Report",
    });

  }
};

// =========================================
// EXPORT ALL FUNCTIONS
// =========================================

module.exports = {
  exportExcelReport,
  exportPDFReport,
  getAnalytics,
  exportStudentsReport,
  exportCoursesReport,
  exportCertificatesReport,
};