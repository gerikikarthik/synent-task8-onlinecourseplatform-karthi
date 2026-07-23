import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LearnCourse() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [videoCompleted, setVideoCompleted] = useState(false);

  useEffect(() => {
    getCourse();
  }, []);

  // ==========================
  // GET COURSE
  // ==========================

  const getCourse = async () => {

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

  // ==========================
  // COMPLETE COURSE
  // ==========================

  const completeCourse = async () => {

    if (!videoCompleted) {

      alert("⚠ Please watch the video and tick the checkbox.");

      return;

    }

    try {

      const token = localStorage.getItem("token");

      await axios.post(

        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/progress/complete/${id}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      alert("🎉 Course Completed Successfully!");

      navigate(`/certificate/${id}`);

    } catch (err) {

      console.log(err.response?.data || err.message);

      alert("Failed to complete course");

    }

  };

  if (loading) {

    return (

      <div className="container mt-5 text-center">

        <h2>Loading...</h2>

      </div>

    );

  }
  return (

    <div
      className="container py-5"
      style={{ maxWidth: "1000px" }}
    >

      <div className="card shadow-lg p-4 rounded-4">

        <h2 className="text-center text-primary mb-4">
          🎓 Learn Course
        </h2>

        <h3 className="fw-bold">
          {course.title}
        </h3>

        <p
          className="text-muted mb-4"
          style={{
            fontSize: "17px",
          }}
        >
          {course.description}
        </p>

        {/* Course Video */}

        {course.videoUrl && (

          <div className="text-center mb-4">

            <iframe
              width="850"
              height="480"
              src={course.videoUrl}
              title="Course Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                borderRadius: "12px",
                maxWidth: "100%",
              }}
            ></iframe>

          </div>

        )}

        <div className="alert alert-info">

          📺 Please watch the complete course video.

          <br />

          ✅ After watching the video, tick the checkbox below to continue.

        </div>
        {/* Video Completion Checkbox */}

        <div className="form-check my-4">

          <input
            className="form-check-input"
            type="checkbox"
            id="videoCompleted"
            checked={videoCompleted}
            onChange={(e) =>
              setVideoCompleted(e.target.checked)
            }
          />

          <label
            className="form-check-label ms-2"
            htmlFor="videoCompleted"
          >
            I have completed watching this course video.
          </label>

        </div>

        {!videoCompleted && (

          <div className="alert alert-warning">

            ⚠ Please watch the course video completely and tick the checkbox before clicking
            <strong> Complete Course</strong>.

          </div>

        )}

        <button
          className={`btn btn-lg w-100 ${
            videoCompleted
              ? "btn-success"
              : "btn-secondary"
          }`}
          disabled={!videoCompleted}
          onClick={completeCourse}
        >
          ✅ COMPLETE COURSE
        </button>
      </div>

    </div>

  );

}