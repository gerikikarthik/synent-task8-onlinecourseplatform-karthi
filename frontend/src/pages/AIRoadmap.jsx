import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function AIRoadmap() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState(null);

  const [career, setCareer] = useState("");
  const [experience, setExperience] = useState("Beginner");
  const [dailyTime, setDailyTime] = useState("2 hours");

  const [roadmap, setRoadmap] = useState(null);

  const [loadingCourse, setLoadingCourse] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // GET COURSE
  // =====================================================

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError("Course ID is missing.");
        setLoadingCourse(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/courses/${courseId}`
        );

        const data = response.data;

        const selectedCourse =
          data.course ||
          data.data ||
          data;

        setCourse(selectedCourse);

      } catch (err) {
        console.error("Course Fetch Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load course details."
        );
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // =====================================================
  // GENERATE ROADMAP
  // =====================================================

  const generateRoadmap = async () => {
    if (!career.trim()) {
      setError("Please enter your career goal.");
      return;
    }

    if (!course) {
      setError("Course information is not available.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setRoadmap(null);

      const courseTopics =
        course.topics ||
        course.lessons ||
        course.modules ||
        [];

      const topicNames = Array.isArray(courseTopics)
        ? courseTopics.map((item) => {
            if (typeof item === "string") {
              return item;
            }

            return (
              item.title ||
              item.name ||
              item.topic ||
              ""
            );
          }).filter(Boolean)
        : [];

      const response = await axios.post(
        `${API_URL}/api/ai/roadmap`,
        {
          career: career.trim(),
          experience,
          dailyTime,

          courseTitle:
            course.title ||
            course.name ||
            "Selected Course",

          courseDescription:
            course.description ||
            "",

          courseTopics: topicNames,
        }
      );

      if (response.data?.success) {
        setRoadmap(response.data.roadmap);
      } else {
        setError(
          response.data?.message ||
            "Failed to generate roadmap."
        );
      }

    } catch (err) {
      console.error(
        "Roadmap Generation Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to generate AI roadmap."
      );
    } finally {
      setGenerating(false);
    }
  };

  // =====================================================
  // TOPIC COMPLETE
  // =====================================================

  const handleTopicStart = (moduleIndex, topicIndex) => {
    console.log(
      "Starting topic:",
      moduleIndex,
      topicIndex
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingCourse) {
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

  if (error && !course) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/courses")}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="container py-5">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="text-center mb-5">

        <span className="badge bg-primary mb-3">
          AI CAREER ROADMAP
        </span>

        <h1 className="fw-bold">
          Build Your Personalized Learning Path
        </h1>

        <p className="text-muted">
          Your roadmap is generated using the selected
          course and your career goal.
        </p>

      </div>

      {/* ================================================= */}
      {/* COURSE CARD */}
      {/* ================================================= */}

      {course && (
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-body p-4">

            <h3 className="fw-bold">
              {course.title ||
                course.name ||
                "Selected Course"}
            </h3>

            <p className="text-muted mb-0">
              {course.description ||
                "Personalized roadmap for this course."}
            </p>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* ROADMAP INPUT */}
      {/* ================================================= */}

      {!roadmap && (
        <div className="card shadow border-0">

          <div className="card-body p-4 p-md-5">

            <h3 className="fw-bold mb-4">
              Tell us about your goal
            </h3>

            {/* Career */}

            <div className="mb-4">

              <label className="form-label fw-semibold">
                Career Goal
              </label>

              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Example: Full Stack Developer"
                value={career}
                onChange={(e) =>
                  setCareer(e.target.value)
                }
              />

            </div>

            {/* Experience */}

            <div className="mb-4">

              <label className="form-label fw-semibold">
                Experience Level
              </label>

              <select
                className="form-select form-select-lg"
                value={experience}
                onChange={(e) =>
                  setExperience(e.target.value)
                }
              >

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>

              </select>

            </div>

            {/* Daily Time */}

            <div className="mb-4">

              <label className="form-label fw-semibold">
                Daily Study Time
              </label>

              <select
                className="form-select form-select-lg"
                value={dailyTime}
                onChange={(e) =>
                  setDailyTime(e.target.value)
                }
              >

                <option value="1 hour">
                  1 Hour
                </option>

                <option value="2 hours">
                  2 Hours
                </option>

                <option value="3 hours">
                  3 Hours
                </option>

                <option value="4 hours">
                  4 Hours
                </option>

                <option value="5+ hours">
                  5+ Hours
                </option>

              </select>

            </div>

            {/* Error */}

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {/* Generate */}

            <button
              className="btn btn-primary btn-lg w-100"
              onClick={generateRoadmap}
              disabled={generating}
            >

              {generating ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                  />

                  Generating your roadmap...
                </>
              ) : (
                <>
                  ✨ Generate AI Roadmap
                </>
              )}

            </button>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* GENERATED ROADMAP */}
      {/* ================================================= */}

      {roadmap && (
        <div>

          {/* Roadmap Header */}

          <div className="card shadow border-0 mb-4">

            <div className="card-body p-4">

              <span className="badge bg-success mb-2">
                PERSONALIZED ROADMAP
              </span>

              <h2 className="fw-bold">
                {roadmap.title}
              </h2>

              <div className="row mt-4">

                <div className="col-md-4 mb-3">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted">
                      Career
                    </small>

                    <div className="fw-bold">
                      {roadmap.career ||
                        career}
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted">
                      Experience
                    </small>

                    <div className="fw-bold">
                      {roadmap.experience ||
                        experience}
                    </div>
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted">
                      Duration
                    </small>

                    <div className="fw-bold">
                      {roadmap.duration ||
                        "6 Months"}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* MODULES */}
          {/* ================================================= */}

          {roadmap.modules?.map(
            (module, moduleIndex) => (

              <div
                className="card shadow-sm border-0 mb-4"
                key={moduleIndex}
              >

                <div className="card-body p-4">

                  {/* Module Header */}

                  <div className="d-flex justify-content-between align-items-start mb-3">

                    <div>

                      <span className="badge bg-primary mb-2">
                        MODULE{" "}
                        {module.moduleNumber ||
                          moduleIndex + 1}
                      </span>

                      <h3 className="fw-bold mb-1">
                        {module.title}
                      </h3>

                      <p className="text-muted">
                        {module.description}
                      </p>

                    </div>

                    <span className="badge bg-light text-dark">
                      {module.duration}
                    </span>

                  </div>

                  {/* Topics */}

                  <div className="row">

                    {module.topics?.map(
                      (topic, topicIndex) => (

                        <div
                          className="col-md-6 mb-3"
                          key={topicIndex}
                        >

                          <div className="card h-100 border">

                            <div className="card-body">

                              <div className="d-flex gap-3">

                                <div
                                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{
                                    width: "42px",
                                    height: "42px",
                                  }}
                                >
                                  {topic.topicNumber ||
                                    topicIndex + 1}
                                </div>

                                <div>

                                  <h5 className="fw-bold">
                                    {topic.title}
                                  </h5>

                                  <p className="text-muted small">
                                    {topic.description}
                                  </p>

                                </div>

                              </div>

                              {/* Learning Items */}

                              <div className="mt-3">

                                {topic.video
                                  ?.required && (
                                  <div className="mb-2">
                                    🎥 Video
                                    <span className="text-muted ms-2">
                                      {
                                        topic.video
                                          .duration
                                      }
                                    </span>
                                  </div>
                                )}

                                {topic.notes
                                  ?.required && (
                                  <div className="mb-2">
                                    📝 Notes
                                  </div>
                                )}

                                {topic.quiz
                                  ?.required && (
                                  <div className="mb-2">
                                    🧠 Quiz
                                    <span className="text-muted ms-2">
                                      {
                                        topic.quiz
                                          .questionCount
                                      }{" "}
                                      questions
                                    </span>
                                  </div>
                                )}

                                {topic.coding
                                  ?.required && (
                                  <div className="mb-2">
                                    💻 Coding
                                    <span className="text-muted ms-2">
                                      {
                                        topic.coding
                                          .questionCount
                                      }{" "}
                                      questions
                                    </span>
                                  </div>
                                )}

                              </div>

                              <button
                                className="btn btn-outline-primary w-100 mt-3"
                                onClick={() =>
                                  handleTopicStart(
                                    moduleIndex,
                                    topicIndex
                                  )
                                }
                              >
                                Start Topic
                              </button>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                  {/* Project */}

                  {module.project && (
                    <div className="alert alert-info mt-3 mb-0">

                      <h5 className="fw-bold">
                        🚀 Module Project
                      </h5>

                      <strong>
                        {module.project.title}
                      </strong>

                      <p className="mb-0 mt-1">
                        {module.project.description}
                      </p>

                    </div>
                  )}

                </div>

              </div>

            )
          )}

          {/* ================================================= */}
          {/* BACK BUTTON */}
          {/* ================================================= */}

          <div className="text-center mt-4">

            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                navigate(
                  `/courses/${courseId}`
                )
              }
            >
              ← Back to Course
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default AIRoadmap;