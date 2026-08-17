import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FeaturedCourses({ searchQuery = "" }) {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses"
      );

      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const query = searchQuery.trim().toLowerCase();

  const filteredCourses = query
    ? courses.filter((course) => {
        const title = String(course.title || "").toLowerCase();
        const description = String(
          course.description || ""
        ).toLowerCase();
        const category = String(
          course.category || ""
        ).toLowerCase();
        const instructor = String(
          course.instructor || ""
        ).toLowerCase();
        const language = String(
          course.language || ""
        ).toLowerCase();

        return (
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          instructor.includes(query) ||
          language.includes(query)
        );
      })
    : courses.slice(0, 6);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading Courses...</h3>
      </div>
    );
  }

  return (
    <section
      id="featured-courses"
      className="py-5"
      style={{
        background: "#f8f9fa",
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-danger fs-6 px-3 py-2">
            🔥 BEST SELLING COURSES
          </span>

          <h2
            className="fw-bold mt-3"
            style={{
              fontSize: "42px",
            }}
          >
            {query ? "🔎 Search Results" : "Featured Courses"}
          </h2>

          <p
            className="text-muted"
            style={{
              maxWidth: "650px",
              margin: "auto",
            }}
          >
            {query
              ? `Courses related to "${searchQuery}"`
              : "Learn the most in-demand skills with expert instructors and become job-ready faster."}
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-5">
            <div
              className="card border-0 shadow-sm mx-auto p-5"
              style={{
                maxWidth: "600px",
                borderRadius: "20px",
              }}
            >
              <div style={{ fontSize: "60px" }}>🔍</div>

              <h3 className="fw-bold mt-3">
                No Related Courses Found
              </h3>

              <p className="text-muted">
                We couldn't find any courses related to{" "}
                <strong>"{searchQuery}"</strong>.
              </p>

              <button
                className="btn btn-primary mt-3"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                🔎 Search Again
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredCourses.map((course) => {
              const price = Number(course.price) || 0;
              const discount = Number(course.discount) || 0;

              const finalPrice =
                discount > 0
                  ? price - (price * discount) / 100
                  : price;

              return (
                <div
                  className="col-lg-4 col-md-6 mb-4"
                  key={course._id}
                >
                  <div
                    className="card border-0 shadow-lg h-100"
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate(`/courses/${course._id}`)
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-10px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0px)";
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <img
                        src={course.image}
                        alt={course.title || "Course"}
                        className="card-img-top"
                        style={{
                          height: "220px",
                          objectFit: "cover",
                        }}
                      />

                      <span
                        className="badge bg-danger"
                        style={{
                          position: "absolute",
                          top: "15px",
                          left: "15px",
                          fontSize: "14px",
                        }}
                      >
                        🔥 Bestseller
                      </span>

                      {discount > 0 && (
                        <span
                          className="badge bg-success"
                          style={{
                            position: "absolute",
                            top: "15px",
                            right: "15px",
                            fontSize: "14px",
                          }}
                        >
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="card-body">
                      <span className="badge bg-primary mb-2">
                        {course.category || "Development"}
                      </span>

                      <h4
                        className="fw-bold"
                        style={{
                          minHeight: "60px",
                        }}
                      >
                        {course.title || "Untitled Course"}
                      </h4>

                      <p className="text-muted">
                        {(course.description || "").length > 90
                          ? course.description.substring(0, 90) + "..."
                          : course.description ||
                            "No description available."}
                      </p>

                      <p className="mb-1">
                        👨‍🏫{" "}
                        <strong>
                          {course.instructor || "CourseHub"}
                        </strong>
                      </p>

                      <p className="mb-3">
                        ⭐ {course.rating ?? 4.5} | 👨‍🎓{" "}
                        {course.students ?? 0} Students
                      </p>

                      {discount > 0 ? (
                        <div className="mb-3">
                          <h6
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                              marginBottom: "5px",
                            }}
                          >
                            ₹{price}
                          </h6>

                          <h3 className="text-success fw-bold">
                            ₹{Math.round(finalPrice)}
                          </h3>
                        </div>
                      ) : (
                        <h3 className="text-success fw-bold mb-3">
                          ₹{price}
                        </h3>
                      )}

                      <div className="d-grid">
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${course._id}`);
                          }}
                        >
                          📚 View Course
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-5">
          <button
            className="btn btn-outline-primary btn-lg px-5"
            onClick={() => navigate("/courses")}
          >
            🚀 View All Courses
          </button>
        </div>
      </div>
    </section>
  );
}