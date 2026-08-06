import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API =
  "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api";

export default function LearnCourse() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  const [currentLesson, setCurrentLesson] = useState(0);

  const [videoCompleted, setVideoCompleted] = useState(false);

  const [progressUpdated, setProgressUpdated] = useState(false);

  // Only one video for every course
  const lessons = [
    {
      title: "Course Video",
      description: "Watch the complete course video before taking the quiz."
    },
    {
      title: "Course Video",
      description: "Continue watching the course."
    },
    {
      title: "Course Video",
      description: "Finish the course to unlock the quiz."
    }
  ];

  useEffect(() => {

    fetchCourse();

  }, [id]);

  useEffect(() => {

    if (currentLesson === lessons.length - 1) {

      setVideoCompleted(true);

      if (!progressUpdated) {

        updateCourseProgress();

      }

    } else {

      setVideoCompleted(false);

    }

  }, [currentLesson]);

  const fetchCourse = async () => {

    try {

      const res = await axios.get(
        `${API}/courses/${id}`
      );

      setCourse(res.data);

    } catch (error) {

      console.log("Course Error", error);

    }

  };

  const updateCourseProgress = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.put(

        `${API}/enroll/progress/${id}`,

        {
          progress: 100
        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      setProgressUpdated(true);

    } catch (error) {

      console.log(
        "Progress Update Error",
        error.response?.data
      );

    }

  };

  if (!course) {

    return (
      <div className="container text-center mt-5">
        <h2>Loading...</h2>
      </div>
    );

  }
return (

  <div
    className="container-fluid py-5"
    style={{
      background: "linear-gradient(135deg,#eef4ff,#ffffff)",
      minHeight: "100vh"
    }}
  >

    <div className="container">

      <div className="text-center mb-5">

        <h1
          style={{
            color: "#0d6efd",
            fontWeight: "bold"
          }}
        >
          📘 {course.title}
        </h1>

        <p>
          Continue your learning journey and complete the course.
        </p>

      </div>

      <div
        className="card shadow-lg border-0"
        style={{
          borderRadius: "20px",
          overflow: "hidden"
        }}
      >

        <div className="ratio ratio-16x9">

          <iframe
            src={course.videoUrl || course.previewVideoUrl}
            title={course.title}
            allowFullScreen
          >
          </iframe>

        </div>

        <div className="card-body p-4">

          <h2 className="text-primary">
            Lesson {currentLesson + 1}
          </h2>

          <h4>
            {lessons[currentLesson].title}
          </h4>

          <p>
            {lessons[currentLesson].description}
          </p>

          <div className="mt-4">

            <h6>
              Course Progress
            </h6>

            <div className="progress">

              <div
                className="progress-bar bg-success"
                style={{
                  width: `${((currentLesson + 1) / lessons.length) * 100}%`
                }}
              >
              </div>

            </div>

            <small>
              {Math.round(((currentLesson + 1) / lessons.length) * 100)}% Completed
            </small>

          </div>

          <div className="d-flex justify-content-between mt-5">
  <button
    className="btn btn-secondary"
    disabled={currentLesson === 0}
    onClick={() => {
      setCurrentLesson(currentLesson - 1);
    }}
  >
    ⬅ Previous
  </button>

  {currentLesson < lessons.length - 1 ? (

    <button
      className="btn btn-primary"
      onClick={() => {
        setCurrentLesson(currentLesson + 1);
      }}
    >
      Next ➡
    </button>

  ) : (

    <div>

      {videoCompleted ? (

        <button
          className="btn btn-warning btn-lg"
          onClick={() => {
            navigate(`/quiz/${id}`);
          }}
        >
          📝 Take Quiz
        </button>

      ) : (

        <button
          disabled
          className="btn btn-warning btn-lg"
        >
          🔒 Quiz Locked
        </button>

      )}

    </div>

  )}

</div>

        </div>

      </div>

    </div>

  </div>

);

}