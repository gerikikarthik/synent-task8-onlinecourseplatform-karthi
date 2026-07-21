import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LearnCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [videoCompleted, setVideoCompleted] = useState(false);

  useEffect(() => {
    getCourse();
  }, []);

  const getCourse = async () => {
    try {
      const res = await axios.get(
        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses/${id}`
      );

      console.log(res.data);
      setCourse(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="container py-5"
      style={{ maxWidth: "1000px" }}
    >
      <div className="card shadow p-4">

        <h2 className="text-center text-primary mb-4">
          🎓 Learn Course
        </h2>

        <h3>{course.title}</h3>

        <p>{course.description}</p>

        {/* YouTube Video */}
        {course.videoUrl && (
          <div className="text-center my-4">
            <iframe
              width="850"
              height="480"
              src={course.videoUrl}
              title="Course Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

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
            className="form-check-label"
            htmlFor="videoCompleted"
          >
            I have completed watching this course video.
          </label>
        </div>

        {!videoCompleted && (
          <div className="alert alert-warning">
            ⚠ Please watch the video and tick the checkbox to enable
            the Complete Course button.
          </div>
        )}

        <button
          className={`btn ${
            videoCompleted
              ? "btn-success"
              : "btn-secondary"
          } w-100`}
          disabled={!videoCompleted}
          onClick={() => {
            localStorage.setItem(
              "selectedCourse",
              course.title
            );

            alert("🎉 Course Completed Successfully!");

            navigate("/ai-roadmap");
          }}
        >
          ✅ COMPLETE COURSE
        </button>

      </div>
    </div>
  );
}