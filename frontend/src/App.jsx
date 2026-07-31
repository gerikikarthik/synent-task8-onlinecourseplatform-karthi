import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import Navbar from "./components/Navbar";
import AddCourse from "./pages/AddCourse";
import CourseDetails from "./pages/CourseDetails";
import Admin from "./pages/Admin";
import MyCourses from "./pages/MyCourses";
import LearnCourse from "./pages/LearnCourse";
import AIRoadmap from "./pages/AIRoadmap";
import Certificate from "./pages/Certificate";
import VerifyCertificate from "./pages/VerifyCertificate";
import ExploreCourses from "./pages/ExploreCourses";
import Cart from "./pages/Cart";
import { Toaster } from "sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/courses" element={<Courses />} />

        <Route path="/add-course" element={<AddCourse />} />

        <Route path="/courses/:id" element={<CourseDetails />} />

        <Route path="/admin" element={<Admin />} />
<Route path="/cart" element={<Cart />} />

        <Route path="/my-courses" element={<MyCourses />} />

        <Route path="/learn/:id" element={<LearnCourse />} />

        <Route path="/ai-roadmap" element={<AIRoadmap />} />
<Route path="/explore/:category" element={<ExploreCourses />} />
<Route
  path="/verify-certificate/:certificateId"
  element={<VerifyCertificate />}
/>
        <Route
          path="/certificate/:id"
          element={<Certificate />}
        />
      </Routes>

      <Toaster
        richColors
        position="top-right"
        expand={true}
        closeButton
      />
    </BrowserRouter>
  );
}