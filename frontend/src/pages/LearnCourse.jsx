import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function LearnCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH COURSE
  // =====================================================

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/courses/${id}`
        );

        const data = response.data;

        const selectedCourse =
          data.course ||
          data.data ||
          data;

        setCourse(selectedCourse);

      } catch (err) {
        console.error("Course Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load course."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // =====================================================
  // GET VIDEO
  // =====================================================

  const getVideoUrl = () => {
    if (!course) return "";

    // Direct course video
    if (course.videoUrl) {
      return course.videoUrl;
    }

    // Lessons
    const lessons =
      course.lessons ||
      course.videos ||
      [];

    if (Array.isArray(lessons) && lessons.length > 0) {
      const firstLesson = lessons[0];

      if (typeof firstLesson === "string") {
        return firstLesson;
      }

      return (
        firstLesson.videoUrl ||
        firstLesson.video ||
        firstLesson.url ||
        ""
      );
    }

    return "";
  };

  // =====================================================
  // YOUTUBE URL CONVERTER
  // =====================================================

  const getEmbedUrl = (url) => {
    if (!url) return "";

    // Already embed URL
    if (url.includes("/embed/")) {
      return url;
    }

    // youtube.com/watch?v=
    if (url.includes("youtube.com/watch?v=")) {
      const videoId =
        url.split("v=")[1]?.split("&")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    // youtu.be/
    if (url.includes("youtu.be/")) {
      const videoId =
        url.split("youtu.be/")[1]?.split("?")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  // =====================================================
  // VIDEO COMPLETE
  // =====================================================

  const completeVideo = () => {
    setVideoCompleted(true);

    localStorage.setItem(
      `course_${id}_video_completed`,
      "true"
    );
  };

  // =====================================================
  // RESTORE VIDEO PROGRESS
  // =====================================================

  useEffect(() => {
    const completed = localStorage.getItem(
      `course_${id}_video_completed`
    );

    if (completed === "true") {
      setVideoCompleted(true);
    }
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border"
          role="status"
        />

        <h5 className="mt-3">
          Loading course...
        </h5>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !course) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger">
          {error || "Course not found"}
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/mycourses")}
        >
          ← Back to My Courses
        </button>

      </div>
    );
  }

  const videoUrl = getVideoUrl();
  const embedUrl = getEmbedUrl(videoUrl);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="container py-5">

      {/* ================================================= */}
      {/* COURSE HEADER */}
      {/* ================================================= */}

      <div className="mb-4">

        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate("/mycourses")}
        >
          ← Back to My Courses
        </button>

        <h1 className="fw-bold">
          {course.title ||
            course.name ||
            "Course"}
        </h1>

        <p className="text-muted">
          {course.description ||
            "Continue your learning journey."}
        </p>

      </div>

      {/* ================================================= */}
      {/* FIRST 1-MINUTE VIDEO */}
      {/* ================================================= */}

      <div className="card shadow border-0 mb-4">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>
              <span className="badge bg-primary mb-2">
                STEP 1
              </span>

              <h3 className="fw-bold mb-1">
                🎥 Course Introduction
              </h3>

              <p className="text-muted mb-0">
                Watch the short introduction before
                starting your AI learning roadmap.
              </p>
            </div>

            <span className="badge bg-light text-dark">
              ⏱️ 1 Minute
            </span>

          </div>

          {/* VIDEO */}

          {embedUrl ? (
            <div
              className="ratio ratio-16x9 rounded overflow-hidden"
              style={{
                background: "#000",
              }}
            >

              <iframe
                src={embedUrl}
                title="Course Introduction Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

            </div>
          ) : (
            <div className="alert alert-warning">
              No course video is available yet.
            </div>
          )}

          {/* COMPLETE BUTTON */}

          <div className="mt-4">

            {!videoCompleted ? (
              <>
                <div className="alert alert-info">
                  👆 Watch the course video and then
                  mark it as completed.
                </div>

                <button
                  className="btn btn-success btn-lg w-100"
                  onClick={completeVideo}
                >
                  ✅ Mark Video as Completed
                </button>
              </>
            ) : (
              <div className="alert alert-success mb-0">
                ✅ Video completed successfully!
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* AI ROADMAP */}
      {/* ================================================= */}

      <div className="card shadow border-0">

        <div className="card-body p-4">

          <span className="badge bg-primary mb-2">
            STEP 2
          </span>

          <h3 className="fw-bold">
            ✨ Personalized AI Roadmap
          </h3>

          <p className="text-muted">
            Complete the introduction video to unlock
            your personalized roadmap based on this
            course and your career goal.
          </p>

          {!videoCompleted ? (
            <button
              className="btn btn-secondary btn-lg w-100"
              disabled
            >
              🔒 Complete Video to Unlock AI Roadmap
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg w-100"
              onClick={() =>
                navigate(
                  `/ai-roadmap?courseId=${id}`
                )
              }
            >
              🚀 Start AI Roadmap
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default LearnCourse;