const Enrollment = require("../models/Enrollment");

// ===============================
// ENROLL COURSE
// ===============================
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
      paymentStatus: "Paid",
      amount: 99,
    });

    res.status(201).json({
      success: true,
      message: "Course enrolled successfully",
      enrollment,
    });
  } catch (err) {
    console.error("Enrollment Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET MY COURSES
// ===============================
const getMyCourses = async (req, res) => {
  try {
    const courses = await Enrollment.find({
      user: req.user.id,
    }).populate("course");

    res.json({
      success: true,
      courses,
    });
  } catch (err) {
    console.error("Enrollment Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET ALL ENROLLMENTS (ADMIN)
// ===============================
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "title price");

    res.json({
      success: true,
      enrollments,
    });
  } catch (err) {
    console.error("Get All Enrollments Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  enrollCourse,
  getMyCourses,
  getAllEnrollments,
};