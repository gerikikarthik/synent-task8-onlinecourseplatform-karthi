import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LearnCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);

  // Temporary Lessons
  const lessons = [
    {
      title: "Introduction",
      video: "https://www.youtube.com/embed/dGcsHMXbSOA",
      description:
        "Welcome to the course. In this lesson you will understand what you are going to learn.",
    },
    {
      title: "Getting Started",
      video: "https://www.youtube.com/embed/Ke90Tje7VS0",
      description:
        "Learn the basics and setup required before starting the project.",
    },
    {
      title: "Final Project",
      video: "https://www.youtube.com/embed/w7ejDZ8SWv8",
      description:
        "Build a complete project and complete your learning journey.",
    },
  ];

  useEffect(() => {
    fetchCourse();
  }, []);

  // Temporary unlock when user reaches last lesson
  useEffect(() => {
    if (currentLesson === lessons.length - 1) {
      setVideoCompleted(true);
    } else {
      setVideoCompleted(false);
    }
  }, [currentLesson]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses/${id}`
      );

      setCourse(res.data);
    } catch (err) {
      console.log(err);
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
        minHeight: "100vh",
      }}
    >
      <div className="container">

        {/* Header */}

        <div className="text-center mb-5">

          <h1
            style={{
              color: "#0d6efd",
              fontWeight: "bold",
            }}
          >
            📘 {course.title}
          </h1>

          <p
            style={{
              color: "#666",
              fontSize: "18px",
            }}
          >
            Continue your learning journey and complete the course.
          </p>

        </div>

        <div
          className="card shadow-lg border-0"
          style={{
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >

          {/* Video */}

          <div className="ratio ratio-16x9">

            <iframe
              src={lessons[currentLesson].video}
              title="Course Video"
              allowFullScreen
            ></iframe>

          </div>

          <div className="card-body p-4">

            <h2
              style={{
                color: "#0d6efd",
                fontWeight: "bold",
              }}
            >
              Lesson {currentLesson + 1}
            </h2>

            <h4 className="mt-3">
              {lessons[currentLesson].title}
            </h4>

            <p
              className="mt-3"
              style={{
                fontSize: "17px",
                lineHeight: "30px",
              }}
            >
              {lessons[currentLesson].description}
            </p>

            {/* Progress */}

            <div className="mt-4">

              <h6>Course Progress</h6>

              <div
                className="progress"
                style={{
                  height: "12px",
                  borderRadius: "10px",
                }}
              >
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${
                      ((currentLesson + 1) / lessons.length) * 100
                    }%`,
                  }}
                ></div>
              </div>

              <small className="text-muted">
                {Math.round(
                  ((currentLesson + 1) / lessons.length) * 100
                )}
                % Completed
              </small>

            </div>
            {/* Navigation Buttons */}

            <div className="d-flex justify-content-between align-items-center mt-5">

              <button
                className="btn btn-outline-secondary px-4"
                disabled={currentLesson === 0}
                onClick={() => setCurrentLesson(currentLesson - 1)}
              >
                ⬅ Previous
              </button>

              {currentLesson < lessons.length - 1 ? (

                <button
                  className="btn btn-primary px-4"
                  onClick={() => setCurrentLesson(currentLesson + 1)}
                >
                  Next ➡
                </button>

              ) : (

                <div className="text-end">

                  {videoCompleted ? (

                    <>
                      <p
                        className="text-success fw-bold mb-2"
                        style={{ fontSize: "16px" }}
                      >
                        ✅ Course Completed Successfully
                      </p>

                      <button
                        className="btn btn-warning btn-lg px-4"
                        onClick={() => navigate(`/quiz/${course._id}`)}
                      >
                        📝 Take Quiz
                      </button>
                    </>

                  ) : (

                    <>
                      <p
                        className="text-danger fw-bold mb-2"
                        style={{ fontSize: "16px" }}
                      >
                        ▶ Complete the video to unlock the Quiz
                      </p>

                      <button
                        className="btn btn-warning btn-lg px-4"
                        disabled
                      >
                        🔒 Take Quiz
                      </button>
                    </>

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