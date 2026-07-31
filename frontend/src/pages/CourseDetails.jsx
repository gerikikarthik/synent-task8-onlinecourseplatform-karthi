import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, []);

  // ===============================
  // FETCH COURSE
  // ===============================

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses/${id}`
      );

      setCourse(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ADD TO CART
  // ===============================
const handleAddToCart = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/cart",
      {
        courseId: course._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("✅ Course added to cart successfully.");

    // Automatically open Cart page
    navigate("/cart");

  } catch (err) {
    console.log(err);

    alert(
      err.response?.data?.message ||
      "Unable to add course to cart."
    );
  }
};
   // ===============================
  // ENROLL NOW
  // ===============================

  const handleEnroll = () => {
    navigate("/cart");
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Loading Course...</h2>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container text-center mt-5">
        <h2>Course Not Found</h2>
      </div>
    );
  }
  // ===============================
  // COURSE DETAILS UI
  // ===============================

  return (
    <div
      className="container py-5"
      style={{
        background: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div
            className="card shadow-lg border-0"
            style={{
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <div className="row g-0">
              {/* Course Image */}

              <div className="col-md-5">
                <img
                  src={course.image}
                  alt={course.title}
                  className="img-fluid"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    minHeight: "500px",
                  }}
                />
              </div>

              {/* Course Details */}

              <div className="col-md-7">
                <div className="p-5">

                  <span className="badge bg-primary mb-3 fs-6">
                    Premium Course
                  </span>

                  <h2
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {course.title}
                  </h2>

                  <p
                    className="text-muted mt-3"
                    style={{
                      lineHeight: "30px",
                    }}
                  >
                    {course.description}
                  </p>

                  <div
                    style={{
                      fontSize: "18px",
                      color: "#ffc107",
                      marginTop: "15px",
                    }}
                  >
                    ⭐⭐⭐⭐⭐
                    <span
                      style={{
                        color: "#555",
                        marginLeft: "10px",
                      }}
                    >
                      4.9 (250 Reviews)
                    </span>
                  </div>

                  {/* Price */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginTop: "25px",
                      marginBottom: "25px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "40px",
                        color: "#198754",
                        fontWeight: "bold",
                      }}
                    >
                      ₹99
                    </span>

                    <span
                      style={{
                        fontSize: "24px",
                        textDecoration: "line-through",
                        color: "#888",
                      }}
                    >
                      ₹999
                    </span>

                    <span
                      className="badge bg-danger fs-6"
                    >
                      90% OFF
                    </span>
                  </div>

                  <hr />

                  <h5>📚 What You'll Learn</h5>

                  <ul
                    style={{
                      lineHeight: "35px",
                      marginTop: "15px",
                    }}
                  >
                    <li>Complete practical training</li>
                    <li>Industry level projects</li>
                    <li>Certificate of Completion</li>
                    <li>AI Career Roadmap</li>
                    <li>Lifetime access</li>
                  </ul>
                  <div
                    className="d-flex gap-3 mt-5 flex-wrap"
                  >
                    <button
                      className="btn btn-success btn-lg"
                      onClick={handleAddToCart}
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      className="btn btn-warning btn-lg"
                      onClick={handleEnroll}
                    >
                      ⚡ Enroll Now
                    </button>

                    <button
                      className="btn btn-outline-primary btn-lg"
                      onClick={() => navigate("/courses")}
                    >
                      ← Back to Courses
                    </button>
                  </div>

                  <div
                    className="alert alert-success mt-4"
                  >
                    <strong>🎁 This Course Includes:</strong>

                    <ul className="mt-3 mb-0">
                      <li>✔ HD Video Lectures</li>
                      <li>✔ Downloadable Resources</li>
                      <li>✔ Lifetime Access</li>
                      <li>✔ Certificate of Completion</li>
                      <li>✔ AI Career Roadmap</li>
                      <li>✔ Project Files</li>
                      <li>✔ Mobile & Desktop Access</li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}