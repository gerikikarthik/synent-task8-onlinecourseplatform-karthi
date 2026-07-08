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
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/learn/:id" element={<LearnCourse />} />
      </Routes>
    </BrowserRouter>
  );
}