const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

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
// CORS
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://synent-task8-onlinecourseplatform-karthi-0yhr.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS Origin:", origin);
      return callback(null, false);
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
  })
);

// ===============================
// Body Parser
// ===============================

app.use(express.json());

// ===============================
// TEST ROUTE
// ===============================

app.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT");

  res.status(200).json({
    success: true,
    message: "Server Working",
  });
});

// ===============================
// API ROUTES
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
// DATABASE
// ===============================

connectDB();

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/test`);
  console.log("=================================");
});