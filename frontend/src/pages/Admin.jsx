import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {

  // ===============================
  // STATES
  // ===============================

  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  // Form States

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");

  const [language, setLanguage] = useState("");
  const [certificate, setCertificate] = useState("");

  const [videoUrl, setVideoUrl] = useState("");

  // Edit Course

  const [editingId, setEditingId] = useState(null);

  // Token

  const token = localStorage.getItem("token");

  // ===============================
  // PAGE LOAD
  // ===============================

  useEffect(() => {

    fetchCourses();

    fetchUsers();

  }, []);

  // ===============================
  // FETCH COURSES
  // ===============================

  const fetchCourses = async () => {

    try {

      const res = await axios.get(

        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses"

      );

      setCourses(res.data);

    }

    catch (err) {

      console.log(err);

    }

  };

  // ===============================
  // FETCH USERS
  // ===============================

  const fetchUsers = async () => {

    try {

      const res = await axios.get(

        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/auth/users",

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      setUsers(res.data);

    }

    catch (err) {

      console.log(err);

    }

    finally {

      setLoading(false);

    }

  };

  // Loading Screen

  if (loading) {

    return (

      <div className="text-center mt-5">

        <h2>Loading Dashboard...</h2>

      </div>

    );

  }
  // ===============================
  // ADD COURSE
  // ===============================

  const addCourse = async () => {

    if (!title || !description || !price) {

      alert("Please fill all required fields");

      return;

    }

    try {

      const newCourse = {

        title,
        description,
        price,
        image,
        category,
        instructor,
        duration,
        language,
        certificate,
        videoUrl,

      };

      await axios.post(

        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses",

        newCourse,

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      alert("✅ Course Added Successfully");

      fetchCourses();

      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategory("");
      setInstructor("");
      setDuration("");
      setLanguage("");
      setCertificate("");
      setVideoUrl("");

    }

    catch (err) {

      console.log(err);

      alert(

        err.response?.data?.message ||

        "Course Add Failed"

      );

    }

  };

  // ===============================
  // EDIT COURSE
  // ===============================

  const editCourse = (course) => {

    setEditingId(course._id);

    setTitle(course.title);

    setDescription(course.description);

    setPrice(course.price);

    setImage(course.image);

    setCategory(course.category);

    setInstructor(course.instructor);

    setDuration(course.duration);

    setLanguage(course.language);

    setCertificate(course.certificate);

    setVideoUrl(course.videoUrl);

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };

  // ===============================
  // UPDATE COURSE
  // ===============================

  const updateCourse = async () => {

    if (!editingId) return;

    try {

      const updatedCourse = {

        title,
        description,
        price,
        image,
        category,
        instructor,
        duration,
        language,
        certificate,
        videoUrl,

      };

      await axios.put(

        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses/${editingId}`,

        updatedCourse,

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      alert("✅ Course Updated Successfully");

      fetchCourses();

      setEditingId(null);

      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategory("");
      setInstructor("");
      setDuration("");
      setLanguage("");
      setCertificate("");
      setVideoUrl("");

    }

    catch (err) {

      console.log(err);

      alert(

        err.response?.data?.message ||

        "Update Failed"

      );

    }

  };

  // ===============================
  // DELETE COURSE
  // ===============================

  const deleteCourse = async (id) => {

    const confirmDelete = window.confirm(

      "Are you sure you want to delete this course?"

    );

    if (!confirmDelete) return;

    try {

      await axios.delete(

        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses/${id}`,

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      alert("✅ Course Deleted Successfully");

      fetchCourses();

    }

    catch (err) {

      console.log(err);

      alert(

        err.response?.data?.message ||

        "Delete Failed"

      );

    }

  };

  // ===============================
  // DOWNLOAD EXCEL REPORT
  // ===============================

  const downloadExcelReport = async () => {

    try {

      const response = await axios.get(

        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/reports/excel",

        {

          responseType: "blob",

        }

      );

      const url = window.URL.createObjectURL(

        new Blob([response.data])

      );

      const link = document.createElement("a");

      link.href = url;

      link.download = "CourseHub_Report.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

    }

    catch (err) {

      console.log(err);

      alert("Failed to Download Excel Report");

    }

  };

  // ===============================
  // DOWNLOAD PDF REPORT
  // ===============================

  const downloadPDFReport = async () => {

    try {

      const response = await axios.get(

        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/reports/pdf",

        {

          responseType: "blob",

        }

      );

      const url = window.URL.createObjectURL(

        new Blob([response.data])

      );

      const link = document.createElement("a");

      link.href = url;

      link.download = "CourseHub_Report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

    }

    catch (err) {

      console.log(err);

      alert("Failed to Download PDF Report");

    }

  };
  // ===============================
  // RETURN
  // ===============================

  return (

    <div
      className="container-fluid"
      style={{
        background: "#f4f7fb",
        minHeight: "100vh",
        padding: "30px",
      }}
    >

      {/* ===============================
          HEADER
      =============================== */}

      <div className="d-flex justify-content-between align-items-center mb-5">

        <div>

          <h1 className="fw-bold">
            📊 Admin Dashboard
          </h1>

          <p className="text-muted">
            Welcome Back Admin 👋
          </p>

        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={() =>
            window.scrollTo({
              top: 350,
              behavior: "smooth",
            })
          }
        >
          ➕ Add Course
        </button>

      </div>

      {/* ===============================
          DASHBOARD CARDS
      =============================== */}

      <div className="row mb-5">

        <div className="col-lg-3 col-md-6 mb-4">

          <div className="card shadow border-0 h-100">

            <div className="card-body">

              <h6 className="text-muted">
                👨‍🎓 Total Users
              </h6>

              <h2 className="fw-bold text-primary">

                {users.length}

              </h2>

            </div>

          </div>

        </div>

        <div className="col-lg-3 col-md-6 mb-4">

          <div className="card shadow border-0 h-100">

            <div className="card-body">

              <h6 className="text-muted">
                📚 Total Courses
              </h6>

              <h2 className="fw-bold text-success">

                {courses.length}

              </h2>

            </div>

          </div>

        </div>

        <div className="col-lg-3 col-md-6 mb-4">

          <div className="card shadow border-0 h-100">

            <div className="card-body">

              <h6 className="text-muted">
                🏆 Certificates
              </h6>

              <h2 className="fw-bold text-warning">

                128

              </h2>

            </div>

          </div>

        </div>

        <div className="col-lg-3 col-md-6 mb-4">

          <div className="card shadow border-0 h-100">

            <div className="card-body">

              <h6 className="text-muted">
                💰 Revenue
              </h6>

              <h2 className="fw-bold text-danger">

                ₹50,000

              </h2>

            </div>

          </div>

        </div>

      </div>
<div className="card shadow border-0 mb-5">

  <div className="card-header bg-primary text-white">

    <h3 className="mb-0">
      ➕ Add New Course
    </h3>

  </div>

  <div className="card-body">

    <div className="row">

      {/* Course Title */}

      <div className="col-md-6 mb-3">

        <label className="form-label fw-bold">
          Course Title
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Enter Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

      </div>

      {/* Price */}

      <div className="col-md-6 mb-3">

        <label className="form-label fw-bold">
          Price
        </label>

        <input
          type="number"
          className="form-control"
          placeholder="Enter Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

      </div>

      {/* Description */}

      <div className="col-md-12 mb-3">

        <label className="form-label fw-bold">
          Description
        </label>

        <textarea
          rows="4"
          className="form-control"
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

      </div>

      {/* Image */}

      <div className="col-md-6 mb-3">

        <label className="form-label fw-bold">
          Image URL
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="https://..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

      </div>

      {/* Category */}

      <div className="col-md-6 mb-3">

        <label className="form-label fw-bold">
          Category
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Web Development"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

      </div>

      {/* Instructor */}

      <div className="col-md-6 mb-3">

        <label className="form-label fw-bold">
          Instructor
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Instructor Name"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
        />

      </div>

      {/* Duration */}

      <div className="col-md-6 mb-3">

        <label className="form-label fw-bold">
          Duration
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="10 Hours"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

      </div>
      {/* Language */}

      <div className="col-md-6 mb-3">

        <label className="form-label fw-bold">
          Language
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="English"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />

      </div>

      {/* Certificate */}

      <div className="col-md-6 mb-3">

        <label className="form-label fw-bold">
          Certificate
        </label>

        <select
          className="form-select"
          value={certificate}
          onChange={(e) => setCertificate(e.target.value)}
        >

          <option value="">
            Select
          </option>

          <option value="Yes">
            Yes
          </option>

          <option value="No">
            No
          </option>

        </select>

      </div>

      {/* Preview Video */}

      <div className="col-md-12 mb-4">

        <label className="form-label fw-bold">
          Preview Video URL
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="https://youtube.com/..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

      </div>

      {/* Save / Update Button */}

      <div className="col-md-12">

        {

          editingId ? (

            <button
              className="btn btn-warning btn-lg"
              onClick={updateCourse}
            >

              ✏ Update Course

            </button>

          ) : (

            <button
              className="btn btn-success btn-lg"
              onClick={addCourse}
            >

              💾 Save Course

            </button>

          )

        }

      </div>

    </div>

  </div>

</div>
<div className="card shadow border-0 mb-5">

  <div className="card-header bg-dark text-white">

    <h3 className="mb-0">

      📚 Manage Courses

    </h3>

  </div>

  <div className="card-body">

    <div className="table-responsive">

      <table className="table table-hover table-bordered align-middle">

        <thead className="table-primary">

          <tr>

            <th>#</th>

            <th>Image</th>

            <th>Title</th>

            <th>Category</th>

            <th>Instructor</th>

            <th>Price</th>

            <th>Students</th>

            <th>Rating</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            courses.length === 0 ?

            (

              <tr>

                <td
                  colSpan="9"
                  className="text-center"
                >

                  No Courses Found

                </td>

              </tr>

            )

            :

            (

              courses.map((course, index) => (

                <tr key={course._id}>

                  <td>

                    {index + 1}

                  </td>

                  <td>

                    <img

                      src={course.image}

                      alt={course.title}

                      width="90"

                      height="60"

                      style={{

                        objectFit: "cover",

                        borderRadius: "10px"

                      }}

                    />

                  </td>

                  <td>

                    <strong>

                      {course.title}

                    </strong>

                  </td>

                  <td>

                    {course.category}

                  </td>

                  <td>

                    {course.instructor}

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

                    <button

                      className="btn btn-warning btn-sm me-2"

                      onClick={() => editCourse(course)}

                    >

                      ✏ Edit

                    </button>

                    <button

                      className="btn btn-danger btn-sm"

                      onClick={() => deleteCourse(course._id)}

                    >

                      🗑 Delete

                    </button>

                  </td>

                </tr>

              ))

            )

          }

        </tbody>

      </table>

    </div>

  </div>

</div>
<div className="card shadow border-0 mb-5">

  <div className="card-header bg-success text-white">

    <h3 className="mb-0">

      📊 Report Center

    </h3>

  </div>

  <div className="card-body">

    <p className="text-muted mb-4">

      Download Professional Reports of your LMS Platform.

    </p>

    <div className="row">

      {/* Excel */}

      <div className="col-lg-4 col-md-6 mb-4">

        <div className="card border-primary shadow-sm h-100">

          <div className="card-body text-center">

            <h1>📥</h1>

            <h5>Excel Report</h5>

            <p className="text-muted">

              Export all course data into Excel.

            </p>

            <button

              className="btn btn-primary w-100"

              onClick={downloadExcelReport}

            >

              Download Excel

            </button>

          </div>

        </div>

      </div>

      {/* PDF */}

      <div className="col-lg-4 col-md-6 mb-4">

        <div className="card border-danger shadow-sm h-100">

          <div className="card-body text-center">

            <h1>📄</h1>

            <h5>PDF Report</h5>

            <p className="text-muted">

              Generate printable PDF Report.

            </p>

            <button

              className="btn btn-danger w-100"

              onClick={downloadPDFReport}

            >

              Download PDF

            </button>

          </div>

        </div>

      </div>

      {/* Analytics */}

      <div className="col-lg-4 col-md-6 mb-4">

        <div className="card border-success shadow-sm h-100">

          <div className="card-body text-center">

            <h1>📈</h1>

            <h5>Analytics</h5>

            <p className="text-muted">

              Revenue, Students & Courses Summary.

            </p>

            <button

              className="btn btn-success w-100"

            >

              View Analytics

            </button>

          </div>

        </div>

      </div>

      {/* Students */}

      <div className="col-lg-4 col-md-6 mb-4">

        <div className="card border-warning shadow-sm h-100">

          <div className="card-body text-center">

            <h1>👨‍🎓</h1>

            <h5>Students Report</h5>

            <p className="text-muted">

              Export all registered students.

            </p>

            <button

              className="btn btn-warning w-100"

            >

              Export Students

            </button>

          </div>

        </div>

      </div>

      {/* Courses */}

      <div className="col-lg-4 col-md-6 mb-4">

        <div className="card border-info shadow-sm h-100">

          <div className="card-body text-center">

            <h1>📚</h1>

            <h5>Courses Report</h5>

            <p className="text-muted">

              Export all available courses.

            </p>

            <button

              className="btn btn-info w-100"

            >

              Export Courses

            </button>

          </div>

        </div>

      </div>

      {/* Certificates */}

      <div className="col-lg-4 col-md-6 mb-4">

        <div className="card border-secondary shadow-sm h-100">

          <div className="card-body text-center">

            <h1>🏆</h1>

            <h5>Certificates Report</h5>

            <p className="text-muted">

              Export issued certificates.

            </p>

            <button

              className="btn btn-secondary w-100"

            >

              Export Certificates

            </button>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>

</div>

  );

}

{/* ===============================
      REPORT CENTER STARTS HERE
=============================== */}

{/* ===============================
    MANAGE COURSES STARTS HERE
=============================== */}

      {/* ===============================
          ADD COURSE SECTION STARTS HERE
      =============================== */}
  // ===== PART 3 STARTS HERE =====

  // ===== PART 2 STARTS HERE =====