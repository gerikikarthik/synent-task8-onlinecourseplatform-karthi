import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourse();
  }, [id]);

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
  // ENROLL COURSE
  // ===============================
const handleEnroll = async () => {
  if (!token) {
    alert("Please Login First");
    navigate("/login");
    return;
  }

  try {
    await axios.post(
      "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/enroll",
      {
        courseId: course._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("✅ Successfully Enrolled");
    navigate("/mycourses");

  } catch (err) {
    console.log(err);

    alert(
      err.response?.data?.message ||
      "Enrollment Failed"
    );
  }
};
const handleAddToCart = async () => {
  if (!token) {
    alert("Please Login First");
    navigate("/login");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/cart",
      {
        courseId: course._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

    navigate("/cart");  

  } catch (err) {
    console.log(err);

    alert(
      err.response?.data?.message || err.message
    );
  }
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
  // DISCOUNT PRICE
  // ===============================

  const finalPrice =
    course.discount > 0
      ? course.price - (course.price * course.discount) / 100
      : course.price;

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        {/* ==========================
              COURSE HEADER
        ========================== */}

        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="card shadow border-0">
              <div className="row g-0">
                <div className="col-lg-5">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="img-fluid rounded-start"
                    style={{
                      width: "100%",
                      height: "350px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div className="col-lg-7">
                  <div className="card-body p-4">
                    <span className="badge bg-primary mb-3">
                      {course.category}
                    </span>

                    <h2 className="fw-bold">{course.title}</h2>

                    <p className="text-muted mt-3">
                      {course.description}
                    </p>
                    <div className="row mt-4">
                      <div className="col-md-6 mb-3">
                        <h6>👨‍🏫 Instructor</h6>
                        <strong>{course.instructor}</strong>
                      </div>

                      <div className="col-md-6 mb-3">
                        <h6>⏱ Duration</h6>
                        <strong>{course.duration}</strong>
                      </div>

                      <div className="col-md-6 mb-3">
                        <h6>🌐 Language</h6>
                        <strong>{course.language}</strong>
                      </div>

                      <div className="col-md-6 mb-3">
                        <h6>🎓 Certificate</h6>
                        <strong>{course.certificate}</strong>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="badge bg-success me-2">
                        ⭐ {course.rating || 0}
                      </span>

                      <span className="badge bg-dark">
                        👨‍🎓 {course.students || 0} Students
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================
              MAIN CONTENT
        ========================== */}

        <div className="row">
          {/* LEFT SIDE */}

          <div className="col-lg-8">

            {/* ==========================
                  COURSE CURRICULUM
            ========================== */}

            <div className="card shadow border-0 mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  📚 Course Curriculum
                </h4>
              </div>

              <div className="card-body">
                <ul className="list-group">
                  {course.curriculum &&
                  course.curriculum.length > 0 ? (
                    course.curriculum.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item"
                      >
                        📖 {item}
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">
                      Curriculum will be updated soon.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* ==========================
                  WHAT YOU'LL LEARN
            ========================== */}

            <div className="card shadow border-0 mb-4">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">
                  🎯 What You'll Learn
                </h4>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <ul>
                      <li>✅ Build Real World Projects</li>
                      <li>✅ Industry Level Skills</li>
                      <li>✅ Hands-on Coding Practice</li>
                      <li>✅ Problem Solving Techniques</li>
                    </ul>
                  </div>

                  <div className="col-md-6">
                    <ul>
                      <li>✅ Interview Preparation</li>
                      <li>✅ Best Coding Practices</li>
                      <li>✅ Certificate of Completion</li>
                      <li>✅ Career Guidance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* ==========================
                  COURSE REQUIREMENTS
            ========================== */}

            <div className="card shadow border-0 mb-4">
              <div className="card-header bg-warning">
                <h4 className="mb-0">
                  📌 Requirements
                </h4>
              </div>

              <div className="card-body">
                <ul>
                  <li>Basic Computer Knowledge</li>
                  <li>No Prior Experience Required</li>
                  <li>Internet Connection</li>
                  <li>Laptop or Desktop Recommended</li>
                  <li>Learning Mindset 😊</li>
                </ul>
              </div>
            </div>

            {/* ==========================
                  INSTRUCTOR
            ========================== */}

            <div className="card shadow border-0 mb-4">
              <div className="card-header bg-dark text-white">
                <h4 className="mb-0">
                  👨‍🏫 Instructor
                </h4>
              </div>

              <div className="card-body">
                <h5>{course.instructor}</h5>

                <p className="text-muted">
                  Experienced industry professional with real-world project
                  experience. Learn practical skills, build projects, and
                  become job-ready through structured lessons and expert
                  guidance.
                </p>
              </div>
            </div>
          </div>

          {/* ==========================
                RIGHT SIDEBAR
          ========================== */}

          <div className="col-lg-4">
            {/* ==========================
                  PRICE CARD
            ========================== */}

            <div className="card shadow-lg border-0 sticky-top">
              <img
                src={course.image}
                alt={course.title}
                className="card-img-top"
                style={{
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <div className="card-body">
                {/* PRICE */}

                {course.discount > 0 ? (
                  <>
                    <h5
                      className="text-muted"
                      style={{
                        textDecoration: "line-through",
                      }}
                    >
                      ₹{course.price}
                    </h5>

                    <h2 className="text-success fw-bold">
                      ₹{finalPrice}
                    </h2>

                    <span className="badge bg-danger">
                      🔥 {course.discount}% OFF
                    </span>
                  </>
                ) : (
                  <h2 className="text-success fw-bold">
                    ₹{course.price}
                  </h2>
                )}

                <hr />

                <p>
                  👨‍🏫 <b>Instructor:</b> {course.instructor}
                </p>

                <p>
                  ⏱ <b>Duration:</b> {course.duration}
                </p>

                <p>
                  👨‍🎓 <b>Students:</b> {course.students || 0}
                </p>

                <p>
                  ⭐ <b>Rating:</b> {course.rating || 0}
                </p>

                <p>
                  🌐 <b>Language:</b> {course.language}
                </p>

                <hr />
                {/* BUY BUTTON */}

                <button
                  className="btn btn-success w-100 mb-2"
                  onClick={handleEnroll}
                >
                  💳 Buy Premium Course
                </button>

                {/* WISHLIST */}

                <button
                  className="btn btn-outline-primary w-100 mb-2"
                >
                  ❤️ Add to Wishlist
                </button>

                {/* CART */}
<button
  className="btn btn-warning w-100 mb-3"
  onClick={handleAddToCart}
>
  🛒 Add to Cart
</button>
               
                {/* FREE PREVIEW */}

                {course.previewVideoUrl && (
                  <>
                    <hr />

                    <h5 className="mb-3">
                      ▶ Free Preview
                    </h5>

                    <div className="ratio ratio-16x9">
                      <iframe
                        src={course.previewVideoUrl}
                        title="Course Preview"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </>
                )}

                <hr />

                {/* PREMIUM FEATURES */}

                <div className="alert alert-warning">
                  <h5>🔒 Premium Includes</h5>

                  <ul className="mb-0">
                    <li>🎥 Full HD Videos</li>
                    <li>📄 Downloadable Resources</li>
                    <li>🤖 AI Career Roadmap</li>
                    <li>🎓 Course Certificate</li>
                    <li>💬 Lifetime Support</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ==========================
                  MONEY BACK GUARANTEE
            ========================== */}

            <div className="card mt-4 shadow border-0">
              <div className="card-body text-center">
                <h5 className="fw-bold">
                  🛡 30-Day Money Back Guarantee
                </h5>

                <p className="text-muted mb-0">
                  Not satisfied? Get a full refund within 30 days.
                </p>
              </div>
            </div>

            {/* ==========================
                  COURSE FEATURES
            ========================== */}

            <div className="card mt-4 shadow border-0">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  📦 This Course Includes
                </h5>
              </div>

              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    🎥 On-demand Video Lessons
                  </li>

                  <li className="list-group-item">
                    📄 Downloadable Resources
                  </li>

                  <li className="list-group-item">
                    📱 Mobile & Desktop Access
                  </li>
                  <li className="list-group-item">
                    ♾ Lifetime Access
                  </li>

                  <li className="list-group-item">
                    🎓 Certificate of Completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* END RIGHT SIDEBAR */}
        </div>
        {/* END MAIN ROW */}
      </div>
      {/* END CONTAINER */}
    </div>
  );
}