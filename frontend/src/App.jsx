import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Cart from "./pages/Cart";
import MyCourses from "./pages/MyCourses";
import LearnCourse from "./pages/LearnCourse";
import Quiz from "./pages/Quiz";
import Certificate from "./pages/Certificate";
import AIRoadmap from "./pages/AIRoadmap";
import AddCourse from "./pages/AddCourse";
import Admin from "./pages/Admin";
import AddQuiz from "./pages/AddQuiz";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />



        {/* ================= STUDENT ROUTES ================= */}

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mycourses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learn/:id"
          element={
            <ProtectedRoute>
              <LearnCourse />
            </ProtectedRoute>
          }
        />

        {/* ================= QUIZ ROUTE ================= */}

        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        {/* ================= CERTIFICATE ================= */}

        <Route
          path="/certificate/:id"
          element={
            <ProtectedRoute>
              <Certificate />
            </ProtectedRoute>
          }
        />

        {/* ================= AI ROADMAP ================= */}

        <Route
          path="/ai-roadmap"
          element={
            <ProtectedRoute>
              <AIRoadmap />
            </ProtectedRoute>
          }
        />



        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/add-course"
          element={
            <AdminRoute>
              <AddCourse />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/quiz/:courseId"
          element={
            <AdminRoute>
              <AddQuiz />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}