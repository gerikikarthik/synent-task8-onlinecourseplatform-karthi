import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import YouTube from "react-youtube";

export default function LearnCourse() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);

  // Video complete ayinda leda
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
        `http://localhost:5000/api/courses/${id}`
      );

      setCourse(res.data);

    } catch (err) {

      console.log(err);

    }

    setLoading(false);

  };

  // ==========================
  // GET YOUTUBE VIDEO ID
  // ==========================

  const getVideoId = (url) => {

    if (!url) return "";

    if (url.includes("embed/")) {
      return url.split("embed/")[1].split("?")[0];
    }

    if (url.includes("watch?v=")) {
      return url.split("watch?v=")[1].split("&")[0];
    }

    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1].split("?")[0];
    }

    return "";

  };

  // ==========================
  // VIDEO END EVENT
  // ==========================

  const onPlayerStateChange = (event) => {

    // 0 = Video Ended
    if (event.data === 0) {

      setVideoCompleted(true);

      alert("🎉 Video Completed Successfully!");

    }

  };

  // ==========================
  // COMPLETE COURSE
  // ==========================

  const completeCourse = async () => {

    if (!videoCompleted) {

      alert("⚠ Please watch the complete video first.");

      return;

    }

    try {

      const token = localStorage.getItem("token");

      await axios.post(

        `http://localhost:5000/api/progress/${id}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      alert("🎉 Course Completed!");

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

        <p className="text-muted">
          {course.description}
        </p>

        {course.videoUrl && (

          <div className="text-center my-4">

            <YouTube
              videoId={getVideoId(course.videoUrl)}

              opts={{
                width: "850",
                height: "480",

                playerVars: {
                  autoplay: 0,
                  controls: 1,
                  rel: 0,
                  modestbranding: 1,
                },
              }}

              onStateChange={onPlayerStateChange}

            />

          </div>

        )}

        <div className="alert alert-info mt-3">

          📺 Please watch the complete video.

          <br />

          ✅ After the video ends, the checkbox will be selected automatically.

        </div>
        {/* Video Completion Status */}

        <div className="form-check my-4">

          <input
            className="form-check-input"
            type="checkbox"
            checked={videoCompleted}
            readOnly
          />

          <label
            className="form-check-label ms-2"
          >
            {videoCompleted
              ? "✅ Video Completed Successfully"
              : "⏳ Please watch the full video"}
          </label>

        </div>

        {!videoCompleted && (

          <div className="alert alert-warning">

            ⚠ You must watch the complete video before completing the course.

          </div>

        )}

        {videoCompleted && (

          <div className="alert alert-success">

            🎉 Great! You can now complete the course.

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
