import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    getCourse();
  }, []);

  const getCourse = async () => {
    try {
      const res = await axios.get(
        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses/${id}`
      );

      setCourse(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= ENROLL =================

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please Login First");
        return;
      }

      const res = await axios.post(
        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/auth/enroll/${course._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

    } catch (err) {
      alert(
        err.response?.data?.message || "Enrollment Failed"
      );
    }
  };

  if (!course) {
    return (
      <div className="text-center mt-5">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container my-5">

      <div className="row">

        {/* LEFT */}

        <div className="col-lg-8">

          <img
            src={course.image}
            alt={course.title}
            className="img-fluid rounded shadow"
          />

          <h1 className="mt-4">
            {course.title}
          </h1>

          <p className="text-muted fs-5">
            {course.description}
          </p>

          <hr />

          <h3>📖 About this Course</h3>

          <p>
            {course.description}
          </p>

          <hr />

          <h3>✅ What You'll Learn</h3>

          <ul className="list-group mb-4">

            {course.whatYouLearn &&
            course.whatYouLearn.length > 0 ? (

              course.whatYouLearn.map((item, index) => (

                <li
                  key={index}
                  className="list-group-item"
                >
                  ✅ {item}
                </li>

              ))

            ) : (

              <li className="list-group-item">
                No learning outcomes available.
              </li>

            )}

          </ul>

          <hr />

          <h3>📚 Course Content</h3>

          <ul className="list-group">

            {course.courseContent &&
            course.courseContent.length > 0 ? (

              course.courseContent.map((item, index) => (

                <li
                  key={index}
                  className="list-group-item"
                >
                  📖 {item}
                </li>

              ))

            ) : (

              <li className="list-group-item">
                No Course Content Available
              </li>

            )}

          </ul>

        </div>

        {/* RIGHT */}

        <div className="col-lg-4">

          <div className="card shadow-lg p-4 sticky-top">

            <h2 className="text-success">
              ₹ {course.price}
            </h2>

            <hr />

            <p>
              ⭐ <b>{course.rating}</b>
            </p>

            <p>
              👨‍🏫 <b>Instructor :</b>{" "}
              {course.instructor}
            </p>

            <p>
              ⏱ <b>Duration :</b>{" "}
              {course.duration}
            </p>

            <p>
              👨‍🎓 <b>Students :</b>{" "}
              {course.students}
            </p>

            <p>
              📂 <b>Category :</b>{" "}
              {course.category}
            </p>

            <p>
              🌐 <b>Language :</b>{" "}
              {course.language}
            </p>

            <p>
              🏆 <b>Certificate :</b>{" "}
              {course.certificate}
            </p>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleEnroll}
            >
              🎓 Enroll Now
            </button>

            {course.videoUrl && (
              <>
                <hr />

                <h5>🎥 Course Preview</h5>

                <div className="ratio ratio-16x9">

                  <iframe
                    src={course.videoUrl}
                    title="Course Preview"
                    allowFullScreen
                  ></iframe>

                </div>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}