import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyCourses();
  }, []);

  const getMyCourses = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/auth/mycourses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourses(res.data.courses);
    } catch (err) {
      console.log(err.response);
      alert(JSON.stringify(err.response?.data));
    }
  };
return (
  <div
    className="container-fluid py-5"
    style={{
      background: "linear-gradient(135deg,#eef4ff,#ffffff)",
      minHeight: "100vh",
    }}
  >
    <div className="container">

      <div className="text-center mb-5">

        <h1
          style={{
            fontWeight: "bold",
            color: "#0d6efd",
          }}
        >
          📚 My Learning
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "18px",
          }}
        >
          Continue learning and complete your enrolled courses.
        </p>

      </div>

      <div className="row g-4">

        {courses.length === 0 ? (

          <div className="text-center mt-5">

            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
              alt=""
              width="170"
            />

            <h3 className="mt-4">
              No Enrolled Courses
            </h3>

            <p className="text-muted">
              Start learning by enrolling in a course.
            </p>

          </div>

        ) : (
          courses.map((course) => (
<div className="col-lg-4 col-md-6" key={course._id}>
  <div
    className="card h-100 border-0 shadow-lg"
    style={{
      borderRadius: "20px",
      overflow: "hidden",
      transition: "0.3s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.boxShadow =
        "0 15px 35px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0px)";
      e.currentTarget.style.boxShadow =
        "0 5px 15px rgba(0,0,0,0.1)";
    }}
  >
    <img
      src={course.image}
      alt={course.title}
      style={{
        height: "220px",
        width: "100%",
        objectFit: "cover",
      }}
    />

    <div className="card-body">

      <h4
        style={{
          fontWeight: "bold",
          color: "#0d6efd",
        }}
      >
        {course.title}
      </h4>

      <p
        style={{
          color: "#666",
          minHeight: "60px",
        }}
      >
        {course.description}
      </p>

      <p>
        <strong>👨‍🏫 Instructor:</strong>{" "}
        {course.instructor}
      </p>

      <p className="mb-3">
        ⭐ {course.rating || "4.8"} / 5
      </p>

      <div className="mb-2">
        <strong>Progress</strong>
      </div>

      <div
        className="progress"
        style={{
          height: "12px",
          borderRadius: "10px",
        }}
      >
        <div
          className="progress-bar bg-success"
          style={{
            width: "0%",
          }}
        >
        </div>
      </div>

      <small className="text-muted">
        0% Completed
      </small>

      <button
        className="btn btn-primary w-100 mt-4"
        style={{
          borderRadius: "12px",
          fontWeight: "bold",
        }}
        onClick={() => {
          localStorage.setItem(
            "selectedCourse",
            course.title
          );

          navigate(`/learn/${course._id}`);
        }}
      >
        ▶ Continue Learning
      </button>

    </div>
  </div>
</div>
          ))
        )}

      </div>
    </div>
  </div>
);
}