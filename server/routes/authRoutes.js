const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
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
      message: "Registration Successful",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
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
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= GET USERS =================
router.get("/users", async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= DELETE USER =================
router.delete("/users/:id", async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= ENROLL COURSE =================
router.post("/enroll/:courseId", protect, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Initialize if missing
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
});    await user.save();

    res.json({
      message: "Course Enrolled Successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= MY COURSES =================
router.get("/mycourses", protect, async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .populate("enrolledCourses");

    res.json(user.enrolledCourses);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;