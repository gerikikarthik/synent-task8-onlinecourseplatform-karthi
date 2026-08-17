import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API =
  "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api";

export default function LearnCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);

  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const lastSavedProgressRef = useRef(0);

  useEffect(() => {
    fetchCourse();

    return () => {
      stopProgressTracking();

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.log("Player cleanup error:", error);
        }
      }
    };
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/courses/${id}`);

      setCourse(res.data);
    } catch (error) {
      console.log(
        "Course Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) {
      return null;
    }

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.replace("/", "");
      }

      if (
        parsedUrl.hostname.includes("youtube.com") ||
        parsedUrl.hostname.includes("youtube-nocookie.com")
      ) {
        const videoId = parsedUrl.searchParams.get("v");

        if (videoId) {
          return videoId;
        }

        if (parsedUrl.pathname.startsWith("/embed/")) {
          return parsedUrl.pathname
            .replace("/embed/", "")
            .split("/")[0];
        }

        if (parsedUrl.pathname.startsWith("/shorts/")) {
          return parsedUrl.pathname
            .replace("/shorts/", "")
            .split("/")[0];
        }
      }
    } catch (error) {
      console.log("Invalid YouTube URL:", error);
    }

    return null;
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const startProgressTracking = () => {
    stopProgressTracking();

    progressIntervalRef.current = setInterval(() => {
      const player = playerRef.current;

      if (!player) {
        return;
      }

      try {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();

        if (
          typeof currentTime !== "number" ||
          typeof duration !== "number" ||
          duration <= 0
        ) {
          return;
        }

        const calculatedProgress = Math.round(
          (currentTime / duration) * 100
        );

        const progress = Math.max(
          0,
          Math.min(100, calculatedProgress)
        );

        setVideoProgress(progress);

        if (progress >= 100) {
          setVideoProgress(100);
          setVideoCompleted(true);

          stopProgressTracking();

          saveProgress(100);

          return;
        }

        /*
         * Save progress every 5%.
         */
        if (
          progress >=
          lastSavedProgressRef.current + 5
        ) {
          lastSavedProgressRef.current = progress;

          saveProgress(progress);
        }
      } catch (error) {
        console.log(
          "Progress calculation error:",
          error
        );
      }
    }, 1000);
  };

  const createYouTubePlayer = () => {
    if (
      !window.YT ||
      !window.YT.Player
    ) {
      return;
    }

    const videoUrl =
      course?.videoUrl ||
      course?.previewVideoUrl ||
      "";

    const videoId =
      getYouTubeVideoId(videoUrl);

    if (!videoId) {
      console.log(
        "YouTube video ID not found."
      );
      return;
    }

    const playerContainer =
      document.getElementById(
        "youtube-player"
      );

    if (!playerContainer) {
      return;
    }

    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (error) {
        console.log(
          "Previous player cleanup error:",
          error
        );
      }

      playerRef.current = null;
    }

    playerRef.current =
      new window.YT.Player(
        "youtube-player",
        {
          videoId: videoId,

          width: "100%",

          height: "100%",

          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },

          events: {
            onReady: () => {
              console.log(
                "YouTube player ready."
              );
            },

            onStateChange: (event) => {
              if (
                !window.YT ||
                !window.YT.PlayerState
              ) {
                return;
              }

              if (
                event.data ===
                window.YT.PlayerState.PLAYING
              ) {
                console.log(
                  "YouTube video playing."
                );

                startProgressTracking();
              }

              if (
                event.data ===
                window.YT.PlayerState.PAUSED
              ) {
                console.log(
                  "YouTube video paused."
                );

                stopProgressTracking();

                saveCurrentYouTubeProgress();
              }

              if (
                event.data ===
                window.YT.PlayerState.ENDED
              ) {
                console.log(
                  "YouTube video completed."
                );

                stopProgressTracking();

                setVideoProgress(100);

                setVideoCompleted(true);

                lastSavedProgressRef.current = 100;

                saveProgress(100);
              }
            },

            onError: (event) => {
              console.log(
                "YouTube Player Error:",
                event.data
              );
            },
          },
        }
      );
  };

  const loadYouTubeAPI = () => {
    if (
      window.YT &&
      window.YT.Player
    ) {
      createYouTubePlayer();
      return;
    }

    const existingScript =
      document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

    if (!existingScript) {
      const script =
        document.createElement("script");

      script.src =
        "https://www.youtube.com/iframe_api";

      script.async = true;

      document.body.appendChild(script);
    }

    const oldCallback =
      window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady =
      () => {
        if (oldCallback) {
          oldCallback();
        }

        createYouTubePlayer();
      };
  };

  useEffect(() => {
    if (!course) {
      return;
    }

    const videoUrl =
      course.videoUrl ||
      course.previewVideoUrl ||
      "";

    const youtubeVideoId =
      getYouTubeVideoId(videoUrl);

    if (youtubeVideoId) {
      const timer = setTimeout(() => {
        loadYouTubeAPI();
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [course]);

  const saveCurrentYouTubeProgress = () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    try {
      const currentTime =
        player.getCurrentTime();

      const duration =
        player.getDuration();

      if (!duration || duration <= 0) {
        return;
      }

      const progress = Math.round(
        (currentTime / duration) * 100
      );

      const safeProgress = Math.max(
        0,
        Math.min(100, progress)
      );

      setVideoProgress(safeProgress);

      if (safeProgress >= 100) {
        setVideoCompleted(true);
      }

      saveProgress(safeProgress);
    } catch (error) {
      console.log(
        "Save current progress error:",
        error
      );
    }
  };

  const saveProgress = async (progress) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      console.log(
        "No login token found."
      );

      return;
    }

    try {
      setSavingProgress(true);

      await axios.put(
        `${API}/enroll/progress/${id}`,
        {
          progress: Math.round(
            Math.min(
              100,
              Math.max(0, progress)
            )
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        `Progress saved: ${Math.round(
          progress
        )}%`
      );
    } catch (error) {
      console.log(
        "Progress Update Error:",
        error.response?.data ||
          error.message
      );
    } finally {
      setSavingProgress(false);
    }
  };

  const handleTakeQuiz = () => {
    if (videoProgress >= 100) {
      navigate(`/quiz/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Loading Course...</h2>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container text-center mt-5">
        <h2>Course Not Found</h2>

        <button
          className="btn btn-primary mt-3"
          onClick={() =>
            navigate("/courses")
          }
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const videoUrl =
    course.videoUrl ||
    course.previewVideoUrl ||
    "";

  const youtubeVideoId =
    getYouTubeVideoId(videoUrl);

  return (
    <div
      className="container-fluid py-5"
      style={{
        background:
          "linear-gradient(135deg,#eef4ff,#ffffff)",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <h1
            style={{
              color: "#0d6efd",
              fontWeight: "bold",
            }}
          >
            📘 {course.title}
          </h1>

          <p>
            Continue your learning journey
            and complete the course.
          </p>
        </div>

        <div
          className="card shadow-lg border-0"
          style={{
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <div
            className="ratio ratio-16x9"
            style={{
              background: "#000",
            }}
          >
            {youtubeVideoId ? (
              <div
                id="youtube-player"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : videoUrl ? (
              <video
                controls
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#000",
                }}
                onTimeUpdate={(event) => {
                  const video =
                    event.currentTarget;

                  if (
                    !video.duration ||
                    video.duration <= 0
                  ) {
                    return;
                  }

                  const progress =
                    Math.round(
                      (video.currentTime /
                        video.duration) *
                        100
                    );

                  const safeProgress =
                    Math.max(
                      0,
                      Math.min(
                        100,
                        progress
                      )
                    );

                  setVideoProgress(
                    safeProgress
                  );

                  if (
                    safeProgress >= 100
                  ) {
                    setVideoCompleted(
                      true
                    );

                    saveProgress(100);
                  }
                }}
                onEnded={() => {
                  setVideoProgress(100);

                  setVideoCompleted(
                    true
                  );

                  saveProgress(100);
                }}
              >
                <source
                  src={videoUrl}
                  type="video/mp4"
                />

                Your browser does not
                support video playback.
              </video>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  color: "#fff",
                }}
              >
                <h4>
                  Course video is not
                  available.
                </h4>
              </div>
            )}
          </div>

          <div className="card-body p-4">
            <h2 className="text-primary">
              Course Video
            </h2>

            <p>
              Watch the complete course
              video before taking the quiz.
            </p>

            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">
                  Course Progress
                </h6>

                <strong
                  className={
                    videoProgress >= 100
                      ? "text-success"
                      : "text-primary"
                  }
                  style={{
                    fontSize: "18px",
                  }}
                >
                  {videoProgress}%
                </strong>
              </div>

              <div
                className="progress"
                style={{
                  height: "22px",
                  borderRadius: "15px",
                }}
              >
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{
                    width: `${videoProgress}%`,
                    transition:
                      "width 0.4s ease",
                  }}
                  aria-valuenow={
                    videoProgress
                  }
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {videoProgress >= 10
                    ? `${videoProgress}%`
                    : ""}
                </div>
              </div>

              <div className="mt-2">
                {videoProgress >= 100 ? (
                  <small className="text-success fw-bold">
                    ✅ Course Video
                    Completed
                  </small>
                ) : (
                  <small className="text-muted">
                    Watch the video to
                    complete the course.
                  </small>
                )}
              </div>

              {savingProgress && (
                <small className="text-primary d-block mt-2">
                  Saving progress...
                </small>
              )}
            </div>

            <div className="d-flex justify-content-between mt-5">
              <button
                className="btn btn-secondary btn-lg"
                onClick={() =>
                  navigate(
                    `/courses/${id}`
                  )
                }
              >
                ⬅ Back to Course
              </button>

              {videoCompleted ||
              videoProgress >= 100 ? (
                <button
                  className="btn btn-warning btn-lg"
                  onClick={
                    handleTakeQuiz
                  }
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
          </div>
        </div>
      </div>
    </div>
  );
}