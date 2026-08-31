const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// ===============================
// Routes
// ===============================
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const aiRoutes = require("./routes/aiRoutes");
const progressRoutes = require("./routes/progressRoutes");
const reportRoutes = require("./routes/reportRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const cartRoutes = require("./routes/cartRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const quizRoutes = require("./routes/quizRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

const app = express();

// ===============================
// Database Connection
// ===============================
connectDB();

// ===============================
// CORS Configuration
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://synent-task8-onlinecourseplatform-karthi-0yhr.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no Origin
      // Example: Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      // Allow known frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked:", origin);

      // Reject unknown origins
      return callback(new Error("Not allowed by CORS"));
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,

    optionsSuccessStatus: 204,
  })
);

// ===============================
// Explicit Preflight
// ===============================


// ===============================
// JSON Middleware
// ===============================

app.use(express.json());

// ===============================
// Test Route
// ===============================

app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server Working",
  });
});

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/progress", progressRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/certificate", certificateRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/enroll", enrollmentRoutes);

app.use("/api/quiz", quizRoutes);

app.use("/api/newsletter", newsletterRoutes);

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
  });
});

// ===============================
// Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});