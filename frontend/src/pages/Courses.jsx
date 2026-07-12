import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses(res.data);
    } catch (err) {
      console.log(err);
      alert("Please login first");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center fw-bold mb-5">📚 Explore Courses</h1>

      <div className="row">
        {courses.map((c) => (
          <div className="col-md-4 mb-4" key={c._id}>
            <div
              className="card shadow border-0 h-100"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => navigate(`/courses/${c._id}`)}
            >
              <img
                src={
                  c.image ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                }
                alt={c.title}
                style={{
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <div className="card-body">
                <span className="badge bg-primary mb-2">
                  {c.category || "Development"}
                </span>

                <h4 className="fw-bold text-dark">
                  {c.title}
                </h4>

                <p className="text-muted">
                  {c.description}
                </p>

                <h5 className="text-warning">
                  ⭐⭐⭐⭐⭐ {c.rating || 4.5}
                </h5>

                <h3 className="text-success">
                  ₹{c.price}
                </h3>

                <button className="btn btn-primary w-100 mt-3">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}