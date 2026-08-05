import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API =
  "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api";

export default function Admin() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ==========================
  // Dashboard States
  // ==========================

  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState([]);

  const [users, setUsers] = useState([]);

  const [enrollments, setEnrollments] = useState([]);

  const [certificates, setCertificates] = useState([]);

  const [reports, setReports] = useState([]);

  // ==========================
  // Course Form
  // ==========================

  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");

  const [image, setImage] = useState("");

  const [category, setCategory] = useState("");

  const [instructor, setInstructor] = useState("");

  const [duration, setDuration] = useState("");

  const [language, setLanguage] = useState("");

  const [certificate, setCertificate] = useState("Yes");

  const [videoUrl, setVideoUrl] = useState("");

  const [previewVideoUrl, setPreviewVideoUrl] =
    useState("");

  const [notesUrl, setNotesUrl] = useState("");

  const [discount, setDiscount] = useState(0);

  const [isPremium, setIsPremium] =
    useState(true);

  const [quizEnabled, setQuizEnabled] =
    useState(true);

  const [whatYouLearn, setWhatYouLearn] =
    useState("");

  const [courseContent, setCourseContent] =
    useState("");

  // ==========================
  // Search
  // ==========================

  const [search, setSearch] = useState("");

  // ==========================
  // Dashboard Counts
  // ==========================

  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalCertificates: 0,
    revenue: 0,
  });

  // ==========================
  // Load Dashboard
  // ==========================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================
  // Dashboard API
  // ==========================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        courseRes,
        userRes,
        enrollRes,
        certificateRes,
      ] = await Promise.all([

        axios.get(`${API}/courses`),

        axios.get(`${API}/auth/users`, {
          headers,
        }),

        axios.get(`${API}/enroll/all`, {
          headers,
        }),

        axios.get(
          `${API}/certificate/all`,
          {
            headers,
          }
        ),
      ]);

      setCourses(courseRes.data);

      setUsers(userRes.data);

      setEnrollments(
        enrollRes.data.enrollments || []
      );

      setCertificates(
        certificateRes.data.certificates || []
      );

      const revenue =
        (enrollRes.data.enrollments || []).reduce(
          (sum, item) =>
            sum + (item.amount || 0),
          0
        );

      setDashboard({
        totalUsers: userRes.data.length,
        totalCourses: courseRes.data.length,
        totalEnrollments:
          enrollRes.data.enrollments.length,
        totalCertificates:
          certificateRes.data.certificates.length,
        revenue,
      });

    } catch (err) {
      console.log(err);
      alert("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // PART 2 CONTINUES...
  // =====================================
  // ==========================
  // RESET FORM
  // ==========================

  const resetForm = () => {
    setEditingId(null);

    setTitle("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory("");
    setInstructor("");
    setDuration("");
    setLanguage("");
    setCertificate("Yes");
    setVideoUrl("");
    setPreviewVideoUrl("");
    setNotesUrl("");
    setDiscount(0);
    setIsPremium(true);
    setQuizEnabled(true);

    setWhatYouLearn("");
    setCourseContent("");
  };

  // ==========================
  // ADD COURSE
  // ==========================

  const addCourse = async (e) => {
    e.preventDefault();

    try {

      if (
        !title ||
        !description ||
        !price ||
        !image
      ) {
        return alert(
          "Please fill all required fields."
        );
      }

      const body = {

        title,

        description,

        price: Number(price),

        image,

        category,

        instructor,

        duration,

        language,

        certificate,

        videoUrl,

        previewVideoUrl,

        notesUrl,

        discount: Number(discount),

        isPremium,

        quizEnabled,

        whatYouLearn: whatYouLearn
          .split("\n")
          .filter((x) => x.trim() !== ""),

        courseContent: courseContent
          .split("\n")
          .filter((x) => x.trim() !== ""),
      };

      await axios.post(

        `${API}/courses`,

        body,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course Added Successfully");

      resetForm();

      loadDashboard();

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Unable to add course."
      );
    }
  };

  // ==========================
  // UPDATE COURSE
  // ==========================

  const updateCourse = async (e) => {

    e.preventDefault();

    try {

      const body = {

        title,

        description,

        price: Number(price),

        image,

        category,

        instructor,

        duration,

        language,

        certificate,

        videoUrl,

        previewVideoUrl,

        notesUrl,

        discount: Number(discount),

        isPremium,

        quizEnabled,

        whatYouLearn: whatYouLearn
          .split("\n")
          .filter((x) => x.trim() !== ""),

        courseContent: courseContent
          .split("\n")
          .filter((x) => x.trim() !== ""),
      };

      await axios.put(

        `${API}/courses/${editingId}`,

        body,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course Updated Successfully");

      resetForm();

      loadDashboard();

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Update Failed"
      );
    }
  };

  // ==========================
  // DELETE COURSE
  // ==========================

  const deleteCourse = async (id) => {

    const ok = window.confirm(
      "Delete this course?"
    );

    if (!ok) return;

    try {

      await axios.delete(

        `${API}/courses/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course Deleted");

      loadDashboard();

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Delete Failed"
      );
    }
  };

  // ==========================
  // EDIT COURSE
  // ==========================

  const editCourse = (course) => {

    setEditingId(course._id);

    setTitle(course.title || "");

    setDescription(course.description || "");

    setPrice(course.price || "");

    setImage(course.image || "");

    setCategory(course.category || "");

    setInstructor(course.instructor || "");

    setDuration(course.duration || "");

    setLanguage(course.language || "");

    setCertificate(
      course.certificate || "Yes"
    );

    setVideoUrl(course.videoUrl || "");

    setPreviewVideoUrl(
      course.previewVideoUrl || ""
    );

    setNotesUrl(course.notesUrl || "");

    setDiscount(course.discount || 0);

    setIsPremium(
      course.isPremium ?? true
    );

    setQuizEnabled(
      course.quizEnabled ?? true
    );

    setWhatYouLearn(
      (course.whatYouLearn || []).join("\n")
    );

    setCourseContent(
      (course.courseContent || []).join("\n")
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================
  // FILTER COURSES
  // ==========================

  const filteredCourses =
    courses.filter((course) =>
      course.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  // ==========================================
  // PART 3 CONTINUES...
  // ==========================================
  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  // ==========================
  // UI START
  // ==========================

  return (
    <div
      className="container-fluid"
      style={{
        background: "#f4f7fc",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      {/* ========================== */}
      {/* HEADER */}
      {/* ========================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2
            style={{
              fontWeight: "bold",
              color: "#0d6efd",
            }}
          >
            🎓 Admin Dashboard
          </h2>

          <p className="text-muted">
            Manage Courses, Students, Quiz &
            Certificates
          </p>

        </div>

        <button
          className="btn btn-danger"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>

      </div>

      {/* ========================== */}
      {/* DASHBOARD CARDS */}
      {/* ========================== */}

      <div className="row g-4 mb-5">

        <div className="col-lg-2 col-md-4">

          <div
            className="card border-0 shadow"
            style={{
              borderRadius: "20px",
            }}
          >
            <div className="card-body text-center">

              <h1>👨‍🎓</h1>

              <h2>
                {dashboard.totalUsers}
              </h2>

              <p>Total Users</p>

            </div>
          </div>

        </div>

        <div className="col-lg-2 col-md-4">

          <div
            className="card border-0 shadow"
            style={{
              borderRadius: "20px",
            }}
          >
            <div className="card-body text-center">

              <h1>📚</h1>

              <h2>
                {dashboard.totalCourses}
              </h2>

              <p>Courses</p>

            </div>
          </div>

        </div>

        <div className="col-lg-2 col-md-4">

          <div
            className="card border-0 shadow"
            style={{
              borderRadius: "20px",
            }}
          >
            <div className="card-body text-center">

              <h1>✅</h1>

              <h2>
                {dashboard.totalEnrollments}
              </h2>

              <p>Enrollments</p>

            </div>
          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div
            className="card border-0 shadow"
            style={{
              borderRadius: "20px",
            }}
          >
            <div className="card-body text-center">

              <h1>🏆</h1>

              <h2>
                {dashboard.totalCertificates}
              </h2>

              <p>Certificates</p>

            </div>
          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div
            className="card border-0 shadow"
            style={{
              borderRadius: "20px",
              background:
                "linear-gradient(90deg,#0d6efd,#4f8dfd)",
              color: "white",
            }}
          >
            <div className="card-body text-center">

              <h1>💰</h1>

              <h2>
                ₹{dashboard.revenue}
              </h2>

              <p>Total Revenue</p>

            </div>
          </div>

        </div>

      </div>

      {/* ========================== */}
      {/* SEARCH */}
      {/* ========================== */}

      <div className="card border-0 shadow mb-4">

        <div className="card-body">

          <div className="row">

            <div className="col-md-8">

              <input
                type="text"
                className="form-control"
                placeholder="Search Course..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="col-md-4">

              <button
                className="btn btn-primary w-100"
                onClick={loadDashboard}
              >
                Refresh Dashboard
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================
          PART 3B STARTS HERE
      ========================== */}
      {/* ========================== */}
      {/* ADD / EDIT COURSE FORM */}
      {/* ========================== */}

      <div className="card border-0 shadow-lg mb-5">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            {editingId ? "✏ Edit Course" : "➕ Add New Course"}
          </h4>
        </div>

        <div className="card-body">

          <form
            onSubmit={
              editingId
                ? updateCourse
                : addCourse
            }
          >

            <div className="row">

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Course Title
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Instructor
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={instructor}
                  onChange={(e) =>
                    setInstructor(e.target.value)
                  }
                />

              </div>

              <div className="col-12 mb-3">

                <label className="form-label">
                  Description
                </label>

                <textarea
                  rows="4"
                  className="form-control"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />

              </div>

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                />

              </div>

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Category
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                />

              </div>

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Duration
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Language
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Discount %
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(e.target.value)
                  }
                />

              </div>

              <div className="col-12 mb-3">

                <label className="form-label">
                  Course Image URL
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={image}
                  onChange={(e) =>
                    setImage(e.target.value)
                  }
                />

              </div>

              <div className="col-12 mb-3">

                <label className="form-label">
                  Main Video URL
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={videoUrl}
                  onChange={(e) =>
                    setVideoUrl(e.target.value)
                  }
                />

              </div>

              <div className="col-12 mb-3">

                <label className="form-label">
                  Preview Video URL
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={previewVideoUrl}
                  onChange={(e) =>
                    setPreviewVideoUrl(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="col-12 mb-3">

                <label className="form-label">
                  Notes PDF URL
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={notesUrl}
                  onChange={(e) =>
                    setNotesUrl(e.target.value)
                  }
                />

              </div>
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  What You'll Learn
                </label>

                <textarea
                  rows="8"
                  className="form-control"
                  placeholder="One point per line"
                  value={whatYouLearn}
                  onChange={(e) =>
                    setWhatYouLearn(e.target.value)
                  }
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Course Content
                </label>

                <textarea
                  rows="8"
                  className="form-control"
                  placeholder="One topic per line"
                  value={courseContent}
                  onChange={(e) =>
                    setCourseContent(e.target.value)
                  }
                />

              </div>

              <div className="col-md-4 mb-4">

                <label className="form-label">
                  Certificate
                </label>

                <select
                  className="form-select"
                  value={certificate}
                  onChange={(e) =>
                    setCertificate(e.target.value)
                  }
                >
                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>

              <div className="col-md-4 mb-4 d-flex align-items-center">

                <div className="form-check form-switch mt-4">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) =>
                      setIsPremium(
                        e.target.checked
                      )
                    }
                  />

                  <label className="form-check-label ms-2">
                    Premium Course
                  </label>

                </div>

              </div>

              <div className="col-md-4 mb-4 d-flex align-items-center">

                <div className="form-check form-switch mt-4">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={quizEnabled}
                    onChange={(e) =>
                      setQuizEnabled(
                        e.target.checked
                      )
                    }
                  />

                  <label className="form-check-label ms-2">
                    Quiz Enabled
                  </label>

                </div>

              </div>

            </div>

            <hr />

            <div className="d-flex gap-3">

              <button
                type="submit"
                className="btn btn-success btn-lg"
              >
                {editingId
                  ? "✅ Update Course"
                  : "➕ Add Course"}
              </button>

              {editingId && (

                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>

      </div>

      {/* ==========================
          PART 4 STARTS HERE
          ========================== */}
      {/* ========================== */}
      {/* MANAGE COURSES */}
      {/* ========================== */}

      <div className="card border-0 shadow-lg">

        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">

          <h4 className="mb-0">
            📚 Manage Courses
          </h4>

          <span className="badge bg-warning text-dark fs-6">
            {filteredCourses.length} Courses
          </span>

        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-primary">

                <tr>

                  <th>Image</th>

                  <th>Course</th>

                  <th>Instructor</th>

                  <th>Category</th>

                  <th>Price</th>

                  <th>Students</th>

                  <th>Rating</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredCourses.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="text-center py-5"
                    >
                      No Courses Found
                    </td>

                  </tr>

                ) : (

                  filteredCourses.map((course) => (

                    <tr key={course._id}>

                      <td>

                        <img
                          src={course.image}
                          alt={course.title}
                          style={{
                            width: "90px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />

                      </td>

                      <td>

                        <h6 className="fw-bold mb-1">
                          {course.title}
                        </h6>

                        <small className="text-muted">
                          {course.duration}
                        </small>

                      </td>

                      <td>

                        {course.instructor}

                      </td>

                      <td>

                        <span className="badge bg-info">

                          {course.category}

                        </span>

                      </td>

                      <td>

                        ₹{course.price}

                      </td>

                      <td>

                        {course.students || 0}

                      </td>

                      <td>

                        ⭐ {course.rating || 0}

                      </td>

                      <td>

                        <div className="d-flex flex-wrap gap-2">

                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              editCourse(course)
                            }
                          >
                            ✏ Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              deleteCourse(course._id)
                            }
                          >
                            🗑 Delete
                          </button>

                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() =>
                              navigate(
                                `/admin/quiz/${course._id}`
                              )
                            }
                          >
                            📝 Add Quiz
                          </button>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              navigate(
                                `/admin/students/${course._id}`
                              )
                            }
                          >
                            👨‍🎓 Students
                          </button>

                          <button
                            className="btn btn-sm btn-info text-white"
                            onClick={() =>
                              navigate(
                                `/admin/progress/${course._id}`
                              )
                            }
                          >
                            📊 Progress
                          </button>

                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() =>
                              navigate(
                                `/admin/certificates/${course._id}`
                              )
                            }
                          >
                            🎓 Certificates
                          </button>

                          <button
                            className="btn btn-sm btn-dark"
                            onClick={() =>
                              navigate(
                                `/admin/quiz-ai/${course._id}`
                              )
                            }
                          >
                            🤖 AI Quiz
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ==========================
          PART 4C STARTS HERE
      ========================== */}
      {/* ========================== */}
      {/* REPORT CENTER */}
      {/* ========================== */}

      <div className="card shadow-lg border-0 mt-5">

        <div className="card-header bg-success text-white">

          <h4 className="mb-0">
            📄 Report Center
          </h4>

        </div>

        <div className="card-body">

          <div className="row g-3">

            <div className="col-md-3">

             <button
  className="btn btn-outline-success w-100"
  onClick={() =>
    window.open(
      `${API}/reports/excel`,
      "_blank"
    )
  }
>
  📊 Export Excel
</button>
            </div>

            <div className="col-md-3">

             <button
  className="btn btn-outline-danger w-100"
  onClick={() =>
    window.open(
      `${API}/reports/pdf`,
      "_blank"
    )
  }
>
  📕 Export PDF
</button>
            </div>

            <div className="col-md-3">

              <button
  className="btn btn-outline-primary w-100"
  onClick={async () => {
    try {
      const res = await axios.get(
        `${API}/reports/analytics`
      );

      alert(
        `Revenue : ₹${res.data.analytics.totalRevenue}`
      );

    } catch (err) {
      alert("Unable to load analytics");
    }
  }}
>
  💰 Revenue Report
</button>
            </div>

            <div className="col-md-3">
<button
  className="btn btn-outline-dark w-100"
  onClick={async () => {
    try {
      const res = await axios.get(
        `${API}/reports/courses`
      );

      alert(
        `Total Courses : ${res.data.totalCourses}`
      );

    } catch (err) {
      alert("Unable to load report");
    }
  }}
>
  📈 Activity Logs
</button>
             
            </div>

          </div>

        </div>

      </div>

      {/* ========================== */}
      {/* ANALYTICS */}
      {/* ========================== */}

      <div className="card shadow-lg border-0 mt-5">

        <div className="card-header bg-info text-white">

          <h4 className="mb-0">
            📈 Analytics
          </h4>

        </div>

        <div className="card-body">

          <div className="row text-center">

            <div className="col-md-3">

              <h2 className="text-primary">
                {dashboard.totalUsers}
              </h2>

              <p>Total Users</p>

            </div>

            <div className="col-md-3">

              <h2 className="text-success">
                {dashboard.totalCourses}
              </h2>

              <p>Total Courses</p>

            </div>

            <div className="col-md-3">

              <h2 className="text-warning">
                {dashboard.totalEnrollments}
              </h2>

              <p>Total Enrollments</p>

            </div>

            <div className="col-md-3">

              <h2 className="text-danger">
                ₹{dashboard.revenue}
              </h2>

              <p>Total Revenue</p>

            </div>

          </div>

          <hr />

          <div className="alert alert-info">

            <strong>Coming Soon 🚀</strong>

            <ul className="mt-3 mb-0">

              <li>📊 Revenue Charts</li>

              <li>📈 Monthly Enrollments Graph</li>

              <li>👨‍🎓 Active Students</li>

              <li>🏆 Top Selling Courses</li>

              <li>🤖 AI Insights</li>

            </ul>

          </div>

        </div>

      </div>

    </div>

  );

}