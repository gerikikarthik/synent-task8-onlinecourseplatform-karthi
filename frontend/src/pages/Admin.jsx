import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Admin() {

  // ================= USERS =================

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ================= COURSES =================

  const [courses, setCourses] = useState([]);

  // ================= ADD COURSE STATES =================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");
  const [students, setStudents] = useState("");
  const [rating, setRating] = useState("");
  const [language, setLanguage] = useState("");
  const [certificate, setCertificate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [whatYouLearn, setWhatYouLearn] = useState("");
  const [courseContent, setCourseContent] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  // ================= FETCH USERS =================

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/auth/users"
      );

      setUsers(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH COURSES =================

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses"
      );

      setCourses(res.data);

    } catch (err) {
      console.log(err);
    }
  };
  const editCourse = (course) => {
  setEditingId(course._id);

  setTitle(course.title || "");
  setDescription(course.description || "");
  setPrice(course.price || "");
  setImage(course.image || "");
  setCategory(course.category || "");
  setInstructor(course.instructor || "");
  setDuration(course.duration || "");
  setStudents(course.students || "");
  setRating(course.rating || "");
  setLanguage(course.language || "");
  setCertificate(course.certificate || "");
  setVideoUrl(course.videoUrl || "");

  setWhatYouLearn(
    course.whatYouLearn ? course.whatYouLearn.join("\n") : ""
  );

  setCourseContent(
    course.courseContent ? course.courseContent.join("\n") : ""
  );
};

  // ================= ADD COURSE =================

  const addCourse = async () => {

    try {

      await axios.post(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses",
        {
          title,
          description,
          price,
          image,
          category,
          instructor,
          duration,
          students,
          rating,
          language,
          certificate,
          videoUrl,
          whatYouLearn: whatYouLearn.split("\n"),
          courseContent: courseContent.split("\n"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Course Added Successfully");

      fetchCourses();

      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategory("");
      setInstructor("");
      setDuration("");
      setStudents("");
      setRating("");
      setLanguage("");
      setCertificate("");
      setVideoUrl("");
      setWhatYouLearn("");
      setCourseContent("");

    }catch (err) {
  console.log(err.response);
  console.log(err.response?.data);

  alert(JSON.stringify(err.response?.data));
}
  };

  // ================= DELETE COURSE =================

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Course Deleted Successfully");

      fetchCourses();

    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  // ================= DELETE USER =================

  const deleteUser = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/auth/users/${id}`
      );

      alert("User Deleted Successfully");

      fetchUsers();

    } catch (err) {
      console.log(err);
    }
  };

  // ================= EXPORT EXCEL =================

  const exportExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(users);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Users"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob(
      [excelBuffer],
      {
        type: "application/octet-stream",
      }
    );

    saveAs(file, "RegisteredUsers.xlsx");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (<div style={{ padding: "30px" }}>

  <h1 style={{ marginBottom: "20px" }}>
    Admin Dashboard
  </h1>

  <hr />

  <h2>Add New Course</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2,1fr)",
      gap: "15px",
      marginBottom: "20px",
    }}
  >

    <input
      type="text"
      placeholder="Course Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />

    <input
      type="number"
      placeholder="Price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
    />

    <input
      type="text"
      placeholder="Image URL"
      value={image}
      onChange={(e) => setImage(e.target.value)}
    />

    <input
      type="text"
      placeholder="Category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    />

    <input
      type="text"
      placeholder="Instructor"
      value={instructor}
      onChange={(e) => setInstructor(e.target.value)}
    />

    <input
      type="text"
      placeholder="Duration"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
    />

    <input
      type="number"
      placeholder="Students"
      value={students}
      onChange={(e) => setStudents(e.target.value)}
    />

    <input
      type="number"
      placeholder="Rating"
      value={rating}
      onChange={(e) => setRating(e.target.value)}
    />

    <input
      type="text"
      placeholder="Language"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    />

    <input
      type="text"
      placeholder="Certificate (Yes/No)"
      value={certificate}
      onChange={(e) => setCertificate(e.target.value)}
    />

    <input
      type="text"
      placeholder="Video URL"
      value={videoUrl}
      onChange={(e) => setVideoUrl(e.target.value)}
    />

    <textarea
      rows="4"
      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />

    <textarea
      rows="5"
      placeholder="What You'll Learn (One item per line)"
      value={whatYouLearn}
      onChange={(e) => setWhatYouLearn(e.target.value)}
    />

    <textarea
      rows="5"
      placeholder="Course Content (One item per line)"
      value={courseContent}
      onChange={(e) => setCourseContent(e.target.value)}
    />

  </div>

  <button
    onClick={addCourse}
    style={{
      background: "green",
      color: "white",
      padding: "12px 30px",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      marginBottom: "40px",
    }}
  >
    Add Course
  </button>

  <hr />
  {/* ================= ALL COURSES ================= */}

<h2 style={{ marginBottom: "20px" }}>
  All Courses ({courses.length})
</h2>

<table
  border="1"
  cellPadding="10"
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "40px",
    textAlign: "center",
  }}
>
  <thead
    style={{
      background: "#0d6efd",
      color: "white",
    }}
  >
    <tr>
      <th>Image</th>
      <th>Title</th>
      <th>Category</th>
      <th>Instructor</th>
      <th>Price</th>
      <th>Rating</th>
      <th>Students</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {courses.map((course) => (
      <tr key={course._id}>

        <td>
          <img
            src={course.image}
            alt={course.title}
            width="90"
            height="60"
            style={{
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </td>

        <td>{course.title}</td>

        <td>{course.category}</td>

        <td>{course.instructor}</td>

        <td>₹ {course.price}</td>

        <td>⭐ {course.rating}</td>

        <td>{course.students}</td>

        
       <td>

  <button
    onClick={() => editCourse(course)}
    style={{
      background: "orange",
      color: "white",
      border: "none",
      padding: "8px 15px",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "10px",
    }}
  >
    Edit
  </button>

  <button
    onClick={() => deleteCourse(course._id)}
    style={{
      background: "red",
      color: "white",
      border: "none",
      padding: "8px 15px",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    Delete
  </button>

</td>

      </tr>
    ))}
  </tbody>
</table>

<hr />
{/* ================= USERS ================= */}

<h2>Registered Users ({filteredUsers.length})</h2>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>
  <input
    type="text"
    placeholder="Search User..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding: "10px",
      width: "300px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  />

  <button
    onClick={exportExcel}
    style={{
      background: "green",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
    }}
  >
    Export Excel
  </button>
</div>

<table
  border="1"
  cellPadding="10"
  style={{
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
  }}
>
  <thead
    style={{
      background: "#0d6efd",
      color: "white",
    }}
  >
    <tr>
      <th>S.No</th>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Date</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredUsers.map((user, index) => (
      <tr key={user._id}>
        <td>{index + 1}</td>

        <td>{user.name}</td>

        <td>{user.email}</td>

        <td>{user.role}</td>

        <td>
          {new Date(user.createdAt).toLocaleDateString()}
        </td>

        <td>
          <button
            onClick={() => deleteUser(user._id)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

</div>
);
}