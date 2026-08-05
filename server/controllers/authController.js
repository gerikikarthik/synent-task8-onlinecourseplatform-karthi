const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Course = require("../models/Course");

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET USERS =================
const getUsers = async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ================= DELETE USER =================
const deleteUser = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= ENROLL COURSE =================
const enrollCourse = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }

    const alreadyEnrolled = user.enrolledCourses.find(
      (id) => id.toString() === course._id.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Already Enrolled",
      });
    }

    user.enrolledCourses.push(course._id);

    await user.save();

    res.json({
      success: true,
      message: "Course Enrolled Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= MY COURSES =================
const myCourses = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .populate("enrolledCourses");

    res.json({
      success: true,
      courses: user.enrolledCourses,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  register,
  login,
  getUsers,
  deleteUser,
  enrollCourse,
  myCourses,
};