import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TrendingCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef(null);
  const autoScrollRef = useRef(null);

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
      console.error("Error fetching trending courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courses.length === 0) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (!sliderRef.current) return;

        const slider = sliderRef.current;

        slider.scrollBy({
          left: 320,
          behavior: "smooth",
        });

        if (
          slider.scrollLeft + slider.clientWidth >=
          slider.scrollWidth - 10
        ) {
          slider.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        }
      }, 3000);
    };

    startAutoScroll();

    return () => {
      clearInterval(autoScrollRef.current);
    };
  }, [courses]);

  const pauseAutoScroll = () => {
    clearInterval(autoScrollRef.current);
  };

  const resumeAutoScroll = () => {
    clearInterval(autoScrollRef.current);

    autoScrollRef.current = setInterval(() => {
      if (!sliderRef.current) return;

      const slider = sliderRef.current;

      slider.scrollBy({
        left: 320,
        behavior: "smooth",
      });

      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - 10
      ) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    }, 3000);
  };

  const moveLeft = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const moveRight = () => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <h4>Loading Trending Courses...</h4>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <section
      className="py-5"
      style={{
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
      }}
    >
      <div className="container">
        {/* Heading */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span
              className="badge bg-danger px-3 py-2"
              style={{
                fontSize: "14px",
                borderRadius: "20px",
              }}
            >
              🔥 TRENDING NOW
            </span>

            <h2
              className="fw-bold mt-3 mb-2"
              style={{
                fontSize: "36px",
              }}
            >
              Trending Courses
            </h2>

            <p className="text-muted mb-0">
              Explore the most popular courses learners are taking right now.
            </p>
          </div>

          <button
            className="btn btn-outline-primary d-none d-md-block"
            onClick={() => navigate("/courses")}
          >
            View All →
          </button>
        </div>

        {/* Slider Area */}
        <div
          style={{
            position: "relative",
          }}
          onMouseEnter={pauseAutoScroll}
          onMouseLeave={resumeAutoScroll}
        >
          {/* Left Arrow */}
          <button
            onClick={moveLeft}
            aria-label="Previous courses"
            style={{
              position: "absolute",
              left: "-18px",
              top: "45%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "none",
              background: "#ffffff",
              boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            ←
          </button>

          {/* Courses */}
          <div
            ref={sliderRef}
            style={{
              display: "flex",
              gap: "22px",
              overflowX: "auto",
              scrollBehavior: "smooth",
              padding: "15px 5px 25px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {courses.map((course) => {
              const price = Number(course.price) || 0;
              const discount = Number(course.discount) || 0;

              const finalPrice =
                discount > 0
                  ? price - (price * discount) / 100
                  : price;

              return (
                <div
                  key={course._id}
                  style={{
                    minWidth: "300px",
                    maxWidth: "300px",
                    flexShrink: 0,
                  }}
                >
                  <div
                    className="card border-0 h-100"
                    style={{
                      borderRadius: "18px",
                      overflow: "hidden",
                      boxShadow:
                        "0 8px 25px rgba(0,0,0,0.10)",
                      cursor: "pointer",
                      transition:
                        "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onClick={() =>
                      navigate(`/courses/${course._id}`)
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 15px 35px rgba(0,0,0,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(0,0,0,0.10)";
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <img
                        src={
                          course.image ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                        }
                        alt={course.title || "Course"}
                        style={{
                          width: "100%",
                          height: "190px",
                          objectFit: "cover",
                        }}
                      />

                      <span
                        className="badge bg-danger"
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          borderRadius: "20px",
                          padding: "8px 12px",
                        }}
                      >
                        🔥 Trending
                      </span>

                      {discount > 0 && (
                        <span
                          className="badge bg-success"
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            borderRadius: "20px",
                            padding: "8px 12px",
                          }}
                        >
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="card-body p-4">
                      <span className="badge bg-primary mb-2">
                        {course.category || "Development"}
                      </span>

                      <h5
                        className="fw-bold"
                        style={{
                          minHeight: "48px",
                        }}
                      >
                        {course.title || "Untitled Course"}
                      </h5>

                      <p
                        className="text-muted small"
                        style={{
                          minHeight: "42px",
                        }}
                      >
                        {(course.description || "").length > 65
                          ? course.description.substring(0, 65) + "..."
                          : course.description ||
                            "Learn this skill with CourseHub."}
                      </p>

                      <div className="small mb-2">
                        👨‍🏫{" "}
                        <strong>
                          {course.instructor || "CourseHub"}
                        </strong>
                      </div>

                      <div className="small mb-3">
                        ⭐ {course.rating ?? 4.5} &nbsp;|&nbsp; 👨‍🎓{" "}
                        {course.students ?? 0}
                      </div>

                      {discount > 0 ? (
                        <div>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                              marginRight: "10px",
                            }}
                          >
                            ₹{price}
                          </span>

                          <span className="text-success fw-bold fs-4">
                            ₹{Math.round(finalPrice)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-success fw-bold fs-4">
                          ₹{price}
                        </div>
                      )}

                      <button
                        className="btn btn-primary w-100 mt-3"
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
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={moveRight}
            aria-label="Next courses"
            style={{
              position: "absolute",
              right: "-18px",
              top: "45%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "none",
              background: "#ffffff",
              boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            →
          </button>
        </div>

        {/* Mobile View All */}
        <div className="text-center mt-3 d-md-none">
          <button
            className="btn btn-outline-primary px-4"
            onClick={() => navigate("/courses")}
          >
            View All Courses →
          </button>
        </div>
      </div>
    </section>
  );
}