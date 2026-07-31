import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FeaturedCourses() {

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchFeaturedCourses();

  }, []);

  const fetchFeaturedCourses = async () => {

    try {

      const res = await axios.get(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses"
      );

      // Show only first 6 courses on Home page
      setCourses(res.data.slice(0, 6));

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="container py-5 text-center">

        <h3>Loading Courses...</h3>

      </div>

    );

  }

  return (

    <section
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
            Featured Courses
          </h2>

          <p
            className="text-muted"
            style={{
              maxWidth: "650px",
              margin: "auto",
            }}
          >
            Learn the most in-demand skills with expert
            instructors and become job-ready faster.
          </p>

        </div>

        <div className="row">
          {courses.map((course) => {

            const finalPrice =
              course.discount > 0
                ? course.price -
                  (course.price * course.discount) / 100
                : course.price;

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
                      alt={course.title}
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

                    {course.discount > 0 && (

                      <span
                        className="badge bg-success"
                        style={{
                          position: "absolute",
                          top: "15px",
                          right: "15px",
                          fontSize: "14px",
                        }}
                      >
                        {course.discount}% OFF
                      </span>

                    )}

                  </div>

                  <div className="card-body">
                    <span className="badge bg-primary mb-2">
                      {course.category}
                    </span>

                    <h4
                      className="fw-bold"
                      style={{
                        minHeight: "60px",
                      }}
                    >
                      {course.title}
                    </h4>

                    <p className="text-muted">
                      {course.description.length > 90
                        ? course.description.substring(0, 90) + "..."
                        : course.description}
                    </p>

                    <p className="mb-1">
                      👨‍🏫 <strong>{course.instructor}</strong>
                    </p>

                    <p className="mb-3">
                      ⭐ {course.rating} | 👨‍🎓 {course.students} Students
                    </p>

                    {course.discount > 0 ? (

                      <div className="mb-3">

                        <h6
                          style={{
                            textDecoration: "line-through",
                            color: "#888",
                            marginBottom: "5px",
                          }}
                        >
                          ₹{course.price}
                        </h6>

                        <h3
                          className="text-success fw-bold"
                        >
                          ₹{finalPrice}
                        </h3>

                      </div>

                    ) : (

                      <h3 className="text-success fw-bold mb-3">
                        ₹{course.price}
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