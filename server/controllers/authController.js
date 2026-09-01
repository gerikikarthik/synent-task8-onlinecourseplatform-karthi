const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Course = require("../models/Course");

// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cleanName = name?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const userExists = await User.findOne({
      email: cleanEmail,
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    console.log("✅ User registered:", user.email);

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
    });

  } catch (error) {
    console.error("❌ Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("=================================");
    console.log("LOGIN REQUEST");
    console.log("Email:", email);
    console.log("Password received:", !!password);
    console.log("=================================");

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      console.log("❌ User not found:", cleanEmail);

      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    console.log("✅ User found:", user.email);

    // Check password
    if (!user.password) {
      console.log("❌ User has no password hash");

      return res.status(400).json({
        success: false,
        message: "Invalid account. Please register again.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      console.log("❌ Password mismatch");

      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    console.log("✅ Password matched");

    // JWT secret check
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role || "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("✅ Login successful:", user.email);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });

  } catch (error) {
    console.error("❌ Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET USERS
// =====================================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json(users);

  } catch (error) {
    console.error("❌ Get Users Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });

  } catch (error) {
    console.error("❌ Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ENROLL COURSE
// =====================================================

const enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const course = await Course.findById(
      req.params.courseId
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }

    const alreadyEnrolled =
      user.enrolledCourses.some(
        (id) =>
          id.toString() ===
          course._id.toString()
      );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Already Enrolled",
      });
    }

    user.enrolledCourses.push(course._id);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Course Enrolled Successfully",
    });

  } catch (error) {
    console.error("❌ Enroll Course Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// MY COURSES
// =====================================================

const myCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("enrolledCourses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      courses: user.enrolledCourses || [],
    });

  } catch (error) {
    console.error("❌ My Courses Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  register,
  login,
  getUsers,
  deleteUser,
  enrollCourse,
  myCourses,
};