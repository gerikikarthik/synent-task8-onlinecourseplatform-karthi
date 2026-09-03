
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

// =====================================================
// COURSEHUB BACKEND API
// =====================================================

const API_URL =
  "https://synent-task8-onlinecourseplatform-karthi.onrender.com";

// =====================================================
// AI ROADMAP
// =====================================================

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
  // CAREER FROM COURSE TITLE
  // =====================================================

  const getCareerFromCourseTitle = (title) => {
    const value = String(title || "").toLowerCase();

    if (
      value.includes("java") &&
      value.includes("full stack")
    ) {
      return "Java Full Stack Developer";
    }

    if (
      value.includes("python") &&
      value.includes("full stack")
    ) {
      return "Python Full Stack Developer";
    }

    if (
      value.includes("mern") ||
      value.includes("mean") ||
      (
        value.includes("javascript") &&
        value.includes("full stack")
      )
    ) {
      return "Full Stack Developer";
    }

    if (value.includes("react")) {
      return "React Developer";
    }

    if (value.includes("frontend")) {
      return "Frontend Developer";
    }

    if (value.includes("backend")) {
      return "Backend Developer";
    }

    if (value.includes("python")) {
      return "Python Developer";
    }

    if (value.includes("java")) {
      return "Java Developer";
    }

    if (value.includes("data science")) {
      return "Data Scientist";
    }

    if (value.includes("machine learning")) {
      return "Machine Learning Engineer";
    }

    if (value.includes("ai")) {
      return "AI Engineer";
    }

    if (value.includes("web development")) {
      return "Web Developer";
    }

    return title || "Software Developer";
  };

  // =====================================================
  // GET COURSE TOPICS
  // =====================================================

  const getCourseTopics = (selectedCourse = course) => {
    if (!selectedCourse) {
      return [];
    }

    const sources = [
      selectedCourse.courseContent,
      selectedCourse.topics,
      selectedCourse.lessons,
      selectedCourse.modules,
      selectedCourse.whatYouLearn,
      selectedCourse.curriculum,
    ];

    let source = [];

    for (const item of sources) {
      if (
        Array.isArray(item) &&
        item.length > 0
      ) {
        source = item;
        break;
      }
    }

    const result = [];

    const addItem = (item) => {
      if (!item) {
        return;
      }

      if (typeof item === "string") {
        const value = item.trim();

        if (value) {
          result.push(value);
        }

        return;
      }

      if (typeof item !== "object") {
        return;
      }

      const title =
        item.title ||
        item.name ||
        item.topic ||
        item.lessonTitle ||
        "";

      if (title) {
        result.push(String(title).trim());
      }

      if (Array.isArray(item.topics)) {
        item.topics.forEach(addItem);
      }

      if (Array.isArray(item.lessons)) {
        item.lessons.forEach(addItem);
      }
    };

    source.forEach(addItem);

    return [
      ...new Set(result),
    ]
      .filter(Boolean)
      .slice(0, 40);
  };

  // =====================================================
  // LOAD COURSE
  // =====================================================

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError(
          "Course ID is missing. Please open AI Roadmap from your enrolled course."
        );

        setLoadingCourse(false);
        return;
      }

      try {
        setLoadingCourse(true);
        setError("");

        const courseUrl =
          `${API_URL}/api/courses/${courseId}`;

        console.log(
          "Fetching AIRoadmap course:",
          courseUrl
        );

        const response = await axios.get(
          courseUrl,
          {
            timeout: 30000,
          }
        );

        const data = response.data;

        console.log(
          "AIRoadmap Course API Response:",
          data
        );

        const selectedCourse =
          data?.course ||
          data?.data ||
          data;

        if (!selectedCourse) {
          throw new Error(
            "Course not found."
          );
        }

        setCourse(selectedCourse);

        const automaticCareer =
          selectedCourse.career ||
          selectedCourse.careerGoal ||
          selectedCourse.jobRole ||
          getCareerFromCourseTitle(
            selectedCourse.title ||
            selectedCourse.name ||
            ""
          );

        setCareer(automaticCareer);

        console.log(
          "Selected Course:",
          selectedCourse
        );

        console.log(
          "Automatic Career:",
          automaticCareer
        );

      } catch (err) {
        console.error(
          "Course Fetch Error:",
          err
        );

        if (err.response) {
          setError(
            err.response.data?.message ||
            "Unable to load course details."
          );
        } else if (
          err.code === "ECONNABORTED"
        ) {
          setError(
            "Course request timed out. Please try again."
          );
        } else {
          setError(
            "Unable to connect to CourseHub server."
          );
        }

      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // =====================================================
  // LOAD SAVED ROADMAP
  // =====================================================

  useEffect(() => {
    if (!courseId) {
      return;
    }

    try {
      const saved =
        localStorage.getItem(
          `roadmap_${courseId}`
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          setRoadmap(parsed);

          if (parsed.career) {
            setCareer(parsed.career);
          }
        }
      }

    } catch (err) {
      console.error(
        "Saved roadmap error:",
        err
      );

      localStorage.removeItem(
        `roadmap_${courseId}`
      );
    }
  }, [courseId]);

  // =====================================================
  // GENERATE ROADMAP
  // =====================================================

  const generateRoadmap = async () => {
    if (!course) {
      setError(
        "Course information is not available."
      );
      return;
    }

    if (!career.trim()) {
      setError(
        "Career information could not be determined."
      );
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setRoadmap(null);

      const topicNames =
        getCourseTopics(course);

      const courseTitle =
        course.title ||
        course.name ||
        "Selected Course";

      const courseDescription =
        course.description || "";

      const roadmapUrl =
        `${API_URL}/api/ai/roadmap`;

      console.log(
        "Generating roadmap..."
      );

      console.log({
        career,
        experience,
        dailyTime,
        courseTitle,
        courseDescription,
        courseTopics: topicNames,
      });

      console.log(
        "Roadmap API:",
        roadmapUrl
      );

      const response =
        await axios.post(
          roadmapUrl,
          {
            career: career.trim(),
            experience,
            dailyTime,
            courseTitle,
            courseDescription,
            courseTopics: topicNames,
          },
          {
            timeout: 300000,
          }
        );

      console.log(
        "Roadmap API Response:",
        response.data
      );

      let generated =
        response.data?.roadmap;

      if (
        typeof generated === "string"
      ) {
        try {
          generated =
            JSON.parse(generated);
        } catch (parseError) {
          console.error(
            "Roadmap JSON Parse Error:",
            parseError
          );

          throw new Error(
            "AI returned invalid JSON."
          );
        }
      }

      if (
        !generated ||
        typeof generated !== "object"
      ) {
        throw new Error(
          "AI returned an invalid roadmap."
        );
      }

      // Add missing display fields
      const finalRoadmap = {
        ...generated,

        career:
          generated.career ||
          career,

        experience:
          generated.experience ||
          experience,

        dailyTime:
          generated.dailyTime ||
          dailyTime,

        course:
          generated.course ||
          courseTitle,

        modules:
          Array.isArray(
            generated.modules
          )
            ? generated.modules
            : [],
      };

      setRoadmap(finalRoadmap);

      localStorage.setItem(
        `roadmap_${courseId}`,
        JSON.stringify(finalRoadmap)
      );

      console.log(
        "AI Roadmap Generated:",
        finalRoadmap
      );

    } catch (err) {
      console.error(
        "Roadmap Generation Error:",
        err
      );

      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "";

      const message =
        `${serverMessage} ${err.message}`
          .toLowerCase();

      if (
        message.includes("413") ||
        message.includes("tokens") ||
        message.includes(
          "request too large"
        ) ||
        message.includes(
          "rate_limit_exceeded"
        )
      ) {
        setError(
          "AI request is too large. Please reduce the course topics or update the backend roadmap generation."
        );
      } else if (
        err.code === "ECONNABORTED"
      ) {
        setError(
          "AI roadmap generation timed out. Please try again."
        );
      } else if (!err.response) {
        setError(
          "Unable to connect to AI server. Please check your Render backend."
        );
      } else {
        setError(
          serverMessage ||
          err.message ||
          "Unable to generate AI roadmap."
        );
      }

    } finally {
      setGenerating(false);
    }
  };

  // =====================================================
  // VIDEO URL
  // =====================================================

  const getVideoUrl = (topic) => {
    const searchText =
      topic?.videoTopic ||
      topic?.title ||
      (
        typeof topic === "string"
          ? topic
          : "programming tutorial"
      );

    return (
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(
        `${searchText} tutorial`
      )
    );
  };

  // =====================================================
  // LIVE CLASS URL
  // =====================================================

  const getLiveUrl = (topic) => {
    const searchText =
      topic?.title ||
      topic?.videoTopic ||
      (
        typeof topic === "string"
          ? topic
          : "programming"
      );

    return (
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(
        `${searchText} live class`
      )
    );
  };

  // =====================================================
  // INTERVIEW QUESTIONS
  // =====================================================

  const getInterviewQuestions = (
    topic
  ) => {
    const title =
      typeof topic === "string"
        ? topic
        : topic?.title ||
          "this topic";

    return [
      `What is ${title} and why is it important?`,
      `Explain the main concepts of ${title} with an example.`,
      `What are the advantages and limitations of ${title}?`,
      `How would you use ${title} in a real-world project?`,
      `What common mistakes should developers avoid when using ${title}?`,
    ];
  };

  // =====================================================
  // TOPIC COMPLETE
  // =====================================================

  const handleTopicComplete = (
    moduleIndex,
    topicIndex
  ) => {
    if (
      !roadmap?.modules
    ) {
      return;
    }

    const updated = {
      ...roadmap,

      modules:
        roadmap.modules.map(
          (module, mIndex) => {
            if (
              mIndex !== moduleIndex
            ) {
              return module;
            }

            return {
              ...module,

              topics:
                Array.isArray(
                  module.topics
                )
                  ? module.topics.map(
                      (
                        topic,
                        tIndex
                      ) => {
                        if (
                          tIndex !==
                          topicIndex
                        ) {
                          return topic;
                        }

                        if (
                          typeof topic ===
                          "string"
                        ) {
                          return {
                            title: topic,
                            completed:
                              true,
                          };
                        }

                        return {
                          ...topic,
                          completed:
                            true,
                        };
                      }
                    )
                  : [],
            };
          }
        ),
    };

    setRoadmap(updated);

    localStorage.setItem(
      `roadmap_${courseId}`,
      JSON.stringify(updated)
    );
  };

  // =====================================================
  // PROGRESS
  // =====================================================

  const getProgress = () => {
    if (
      !roadmap?.modules
    ) {
      return {
        total: 0,
        completed: 0,
        percentage: 0,
      };
    }

    let total = 0;
    let completed = 0;

    roadmap.modules.forEach(
      (module) => {
        if (
          Array.isArray(
            module.topics
          )
        ) {
          module.topics.forEach(
            (topic) => {
              total++;

              if (
                typeof topic ===
                  "object" &&
                topic.completed === true
              ) {
                completed++;
              }
            }
          );
        }
      }
    );

    return {
      total,
      completed,
      percentage:
        total > 0
          ? Math.round(
              (completed /
                total) *
                100
            )
          : 0,
    };
  };

  // =====================================================
  // ROADMAP COMPLETE
  // =====================================================

  const isRoadmapCompleted = () => {
    const modules =
      roadmap?.modules;

    if (
      !Array.isArray(modules) ||
      modules.length === 0
    ) {
      return false;
    }

    const topics =
      modules.flatMap(
        (module) =>
          Array.isArray(
            module.topics
          )
            ? module.topics
            : []
      );

    return (
      topics.length > 0 &&
      topics.every(
        (topic) =>
          typeof topic ===
            "object" &&
          topic.completed === true
      )
    );
  };

  // =====================================================
  // RESET ROADMAP
  // =====================================================

  const resetRoadmap = () => {
    const confirmed =
      window.confirm(
        "Generate a new roadmap? Current roadmap progress will be removed."
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      `roadmap_${courseId}`
    );

    setRoadmap(null);
    setError("");
  };

  // =====================================================
  // START TOPIC
  // =====================================================

  const handleStartTopic = (
    moduleIndex,
    topicIndex,
    topic
  ) => {
    localStorage.setItem(
      `roadmap_${courseId}_topic`,
      JSON.stringify({
        courseId,
        moduleIndex,
        topicIndex,
        topic,
      })
    );

    console.log(
      "Topic Started:",
      topic
    );
  };

  // =====================================================
  // TOPIC HELPER
  // =====================================================

  const getTopicTitle = (
    topic,
    topicIndex
  ) => {
    if (
      typeof topic === "string"
    ) {
      return topic;
    }

    return (
      topic?.title ||
      topic?.name ||
      topic?.topic ||
      `Topic ${topicIndex + 1}`
    );
  };

  const getTopicDescription = (
    topic
  ) => {
    if (
      typeof topic === "string"
    ) {
      return "Learn this topic as part of your career roadmap.";
    }

    return (
      topic?.description ||
      "Learn this topic and practice it with interview and coding questions."
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingCourse) {
    return (
      <div className="container py-5 text-center">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <h5 className="mt-3">
          Loading your enrolled course...
        </h5>

        <p className="text-muted">
          Preparing your AI career roadmap.
        </p>

      </div>
    );
  }

  // =====================================================
  // COURSE ERROR
  // =====================================================

  if (
    error &&
    !course
  ) {
    return (
      <div className="container py-5">

        <div className="alert alert-danger">

          <h5 className="fw-bold">
            Unable to load course
          </h5>

          <p className="mb-0">
            {error}
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(
              "/mycourses"
            )
          }
        >
          ← Back to My Courses
        </button>

      </div>
    );
  }

  const progress =
    getProgress();

  const courseTopics =
    getCourseTopics(course);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="container py-5">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="text-center mb-5">

        <span className="badge bg-primary px-3 py-2 mb-3">
          ✨ AI CAREER ROADMAP
        </span>

        <h1 className="fw-bold">
          Personalized Learning Path
        </h1>

        <p className="text-muted">
          Complete your enrolled course through an
          AI-powered career roadmap.
        </p>

      </div>

      {/* ================================================= */}
      {/* COURSE CARD */}
      {/* ================================================= */}

      {course && (
        <div className="card shadow border-0 mb-4">

          <div className="card-body p-4">

            <div className="d-flex align-items-center gap-3 flex-wrap">

              {course.image && (
                <img
                  src={course.image}
                  alt="Course"
                  style={{
                    width: "120px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              )}

              <div>

                <span className="badge bg-success mb-2">
                  🎓 ENROLLED COURSE
                </span>

                <h3 className="fw-bold">
                  {course.title ||
                    course.name ||
                    "Course"}
                </h3>

                <p className="text-muted mb-0">
                  {course.description ||
                    "Continue your learning journey."}
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* GENERATE ROADMAP */}
      {/* ================================================= */}

      {!roadmap && (
        <div className="card shadow border-0">

          <div className="card-body p-4 p-md-5">

            <h3 className="fw-bold">
              Personalize Your Roadmap
            </h3>

            <p className="text-muted">
              Your enrolled course and career are
              automatically selected.
            </p>

            {/* COURSE */}

            <div className="alert alert-info">

              <strong>
                🎓 Selected Course
              </strong>

              <div className="mt-1">
                {course?.title ||
                  course?.name}
              </div>

            </div>

            {/* CAREER */}

            <div className="mb-4">

              <label className="form-label fw-bold">
                🎯 Career Goal
              </label>

              <input
                className="form-control form-control-lg"
                value={career}
                readOnly
              />

            </div>

            {/* EXPERIENCE */}

            <div className="mb-4">

              <label className="form-label fw-bold">
                📊 Experience Level
              </label>

              <select
                className="form-select form-select-lg"
                value={experience}
                onChange={(e) =>
                  setExperience(
                    e.target.value
                  )
                }
              >

                <option>
                  Beginner
                </option>

                <option>
                  Intermediate
                </option>

                <option>
                  Advanced
                </option>

              </select>

            </div>

            {/* DAILY TIME */}

            <div className="mb-4">

              <label className="form-label fw-bold">
                ⏱️ Daily Study Time
              </label>

              <select
                className="form-select form-select-lg"
                value={dailyTime}
                onChange={(e) =>
                  setDailyTime(
                    e.target.value
                  )
                }
              >

                <option>
                  1 hour
                </option>

                <option>
                  2 hours
                </option>

                <option>
                  3 hours
                </option>

                <option>
                  4 hours
                </option>

                <option>
                  5+ hours
                </option>

              </select>

            </div>

            {/* COURSE TOPICS */}

            <div className="card bg-light border-0 mb-4">

              <div className="card-body">

                <h5 className="fw-bold">
                  📚 Complete Course Topics
                </h5>

                <p className="text-muted small">
                  The AI roadmap will use the topics
                  available in your enrolled course.
                </p>

                {courseTopics.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">

                    {courseTopics.map(
                      (
                        topic,
                        index
                      ) => (
                        <span
                          key={index}
                          className="badge bg-white text-dark border p-2"
                        >
                          {index + 1}.{" "}
                          {topic}
                        </span>
                      )
                    )}

                  </div>
                ) : (
                  <div className="alert alert-warning mb-0">
                    No course topics were found.
                    The AI will generate a roadmap
                    based on the course title and description.
                  </div>
                )}

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="alert alert-danger">

                <strong>
                  AI Roadmap Error
                </strong>

                <div className="mt-1">
                  {error}
                </div>

              </div>
            )}

            {/* GENERATE */}

            <button
              className="btn btn-primary btn-lg w-100"
              onClick={
                generateRoadmap
              }
              disabled={
                generating ||
                !course ||
                !career.trim()
              }
            >

              {generating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />

                  AI is generating your
                  complete course roadmap...
                </>
              ) : (
                <>
                  ✨ Generate Complete AI Roadmap
                </>
              )}

            </button>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* ROADMAP */}
      {/* ================================================= */}

      {roadmap && (
        <div>

          {/* ROADMAP HEADER */}

          <div className="card shadow border-0 mb-4">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">

                <div>

                  <span className="badge bg-success mb-2">
                    ✅ AI ROADMAP READY
                  </span>

                  <h2 className="fw-bold">
                    {roadmap.title ||
                      "Your Learning Roadmap"}
                  </h2>

                  <p className="text-muted">
                    {roadmap.course ||
                      course?.title}
                  </p>

                </div>

                <button
                  className="btn btn-outline-primary"
                  onClick={
                    resetRoadmap
                  }
                >
                  🔄 New Roadmap
                </button>

              </div>

              {/* ROADMAP DETAILS */}

              <div className="row mt-4">

                <div className="col-md-3 mb-3">

                  <div className="p-3 bg-light rounded h-100">

                    <small>
                      🎯 Career
                    </small>

                    <div className="fw-bold mt-1">
                      {roadmap.career ||
                        career}
                    </div>

                  </div>

                </div>

                <div className="col-md-3 mb-3">

                  <div className="p-3 bg-light rounded h-100">

                    <small>
                      📊 Experience
                    </small>

                    <div className="fw-bold mt-1">
                      {roadmap.experience ||
                        experience}
                    </div>

                  </div>

                </div>

                <div className="col-md-3 mb-3">

                  <div className="p-3 bg-light rounded h-100">

                    <small>
                      ⏱️ Daily Time
                    </small>

                    <div className="fw-bold mt-1">
                      {roadmap.dailyTime ||
                        dailyTime}
                    </div>

                  </div>

                </div>

                <div className="col-md-3 mb-3">

                  <div className="p-3 bg-light rounded h-100">

                    <small>
                      📅 Duration
                    </small>

                    <div className="fw-bold mt-1">
                      {roadmap.duration ||
                        "Based on your learning pace"}
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* PROGRESS */}
          {/* ================================================= */}

          <div className="card shadow-sm border-0 mb-4">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between">

                <strong>
                  📈 Course Progress
                </strong>

                <strong>
                  {progress.percentage}%
                </strong>

              </div>

              <div
                className="progress mt-2"
                style={{
                  height: "14px",
                }}
              >

                <div
                  className="progress-bar"
                  style={{
                    width:
                      `${progress.percentage}%`,
                  }}
                />

              </div>

              <small className="text-muted">
                {progress.completed} of{" "}
                {progress.total} topics completed
              </small>

            </div>

          </div>

          {/* ================================================= */}
          {/* COURSE COMPLETE */}
          {/* ================================================= */}

          {isRoadmapCompleted() && (
            <div className="alert alert-success shadow-sm">

              <h3 className="fw-bold">
                🎉 Complete Course Finished!
              </h3>

              <p>
                You completed every topic in
                your AI learning roadmap.
              </p>

              <button
                className="btn btn-success"
                onClick={() =>
                  navigate(
                    `/certificate/${courseId}`
                  )
                }
              >
                🏆 View Certificate
              </button>

            </div>
          )}

          {/* ================================================= */}
          {/* MODULES */}
          {/* ================================================= */}

          {Array.isArray(
            roadmap.modules
          ) &&
            roadmap.modules.map(
              (
                module,
                moduleIndex
              ) => (

                <div
                  className="card shadow-sm border-0 mb-4"
                  key={moduleIndex}
                >

                  <div className="card-body p-4">

                    {/* MODULE HEADER */}

                    <span className="badge bg-primary mb-2">
                      MODULE{" "}
                      {module.moduleNumber ||
                        moduleIndex + 1}
                    </span>

                    <div className="d-flex justify-content-between flex-wrap gap-3">

                      <div>

                        <h3 className="fw-bold">
                          {module.title ||
                            `Module ${moduleIndex + 1}`}
                        </h3>

                        <p className="text-muted">
                          {module.description ||
                            "Learn the important concepts in this module."}
                        </p>

                      </div>

                      {module.duration && (
                        <span className="badge bg-light text-dark h-100">
                          ⏱️{" "}
                          {module.duration}
                        </span>
                      )}

                    </div>

                    {/* TOPICS */}

                    <div className="row mt-3">

                      {Array.isArray(
                        module.topics
                      ) &&
                        module.topics.map(
                          (
                            topic,
                            topicIndex
                          ) => {

                            const completed =
                              typeof topic ===
                                "object" &&
                              topic.completed ===
                                true;

                            const title =
                              getTopicTitle(
                                topic,
                                topicIndex
                              );

                            const description =
                              getTopicDescription(
                                topic
                              );

                            const quiz =
                              typeof topic ===
                                "object" &&
                              Array.isArray(
                                topic.quiz
                              )
                                ? topic.quiz
                                : [];

                            const codingQuestions =
                              typeof topic ===
                                "object" &&
                              Array.isArray(
                                topic.codingQuestions
                              )
                                ? topic.codingQuestions
                                : [];

                            const notes =
                              typeof topic ===
                                "object" &&
                              Array.isArray(
                                topic.notes
                              )
                                ? topic.notes
                                : [];

                            const videoTopic =
                              typeof topic ===
                                "object"
                                ? topic.videoTopic ||
                                  title
                                : title;

                            const interviewQuestions =
                              getInterviewQuestions(
                                topic
                              );

                            return (
                              <div
                                className="col-lg-6 mb-4"
                                key={
                                  topicIndex
                                }
                              >

                                <div
                                  className={`card h-100 shadow-sm ${
                                    completed
                                      ? "border-success"
                                      : ""
                                  }`}
                                >

                                  <div className="card-body">

                                    {/* TOPIC TITLE */}

                                    <div className="d-flex gap-3">

                                      <div
                                        className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                                          completed
                                            ? "bg-success text-white"
                                            : "bg-primary text-white"
                                        }`}
                                        style={{
                                          width: "45px",
                                          height: "45px",
                                        }}
                                      >
                                        {completed
                                          ? "✓"
                                          : topic?.topicNumber ||
                                            topicIndex +
                                              1}
                                      </div>

                                      <div>

                                        <h5 className="fw-bold">
                                          {title}
                                        </h5>

                                        <p className="text-muted small mb-0">
                                          {description}
                                        </p>

                                      </div>

                                    </div>

                                    {/* VIDEO */}

                                    <div className="p-3 bg-light rounded mt-3">

                                      <h6 className="fw-bold">
                                        🎥 Video Lesson
                                      </h6>

                                      <p className="small text-muted">
                                        {videoTopic}
                                      </p>

                                      <a
                                        href={getVideoUrl(
                                          topic
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-danger btn-sm me-2"
                                      >
                                        ▶ Watch Video
                                      </a>

                                      <a
                                        href={getLiveUrl(
                                          topic
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-danger btn-sm"
                                      >
                                        🔴 Live Class
                                      </a>

                                    </div>

                                    {/* NOTES */}

                                    <div className="p-3 bg-light rounded mt-2">

                                      <h6 className="fw-bold">
                                        📝 Learning Notes
                                      </h6>

                                      {notes.length >
                                      0 ? (
                                        <ul className="small mb-0">

                                          {notes.map(
                                            (
                                              note,
                                              index
                                            ) => (
                                              <li
                                                key={
                                                  index
                                                }
                                              >
                                                {note}
                                              </li>
                                            )
                                          )}

                                        </ul>
                                      ) : (
                                        <p className="small text-muted mb-0">
                                          No notes available.
                                        </p>
                                      )}

                                    </div>

                                    {/* QUIZ */}

                                    <div className="p-3 bg-light rounded mt-2">

                                      <div className="d-flex justify-content-between">

                                        <h6 className="fw-bold">
                                          🧠 Topic Quiz
                                        </h6>

                                        <span className="badge bg-warning text-dark">
                                          {
                                            quiz.length
                                          }
                                        </span>

                                      </div>

                                      {quiz.length >
                                      0 ? (
                                        quiz.map(
                                          (
                                            question,
                                            index
                                          ) => (
                                            <div
                                              key={
                                                index
                                              }
                                              className="border rounded p-2 mt-2 bg-white"
                                            >

                                              <strong>
                                                Q
                                                {index +
                                                  1}
                                                .{" "}
                                                {
                                                  question.question
                                                }
                                              </strong>

                                              {Array.isArray(
                                                question.options
                                              ) && (
                                                <div className="mt-2">

                                                  {question.options.map(
                                                    (
                                                      option,
                                                      optionIndex
                                                    ) => (
                                                      <div
                                                        key={
                                                          optionIndex
                                                        }
                                                        className="small"
                                                      >
                                                        {String.fromCharCode(
                                                          65 +
                                                            optionIndex
                                                        )}
                                                        .{" "}
                                                        {
                                                          option
                                                        }
                                                      </div>
                                                    )
                                                  )}

                                                </div>
                                              )}

                                            </div>
                                          )
                                        )
                                      ) : (
                                        <p className="small text-muted mb-0 mt-2">
                                          Quiz will be
                                          generated for
                                          this topic.
                                        </p>
                                      )}

                                    </div>

                                    {/* CODING */}

                                    {(
                                      typeof topic ===
                                        "object" &&
                                      (
                                        topic.isCoding ===
                                          true ||
                                        codingQuestions.length >
                                          0
                                      )
                                    ) && (
                                      <div className="p-3 bg-dark text-white rounded mt-2">

                                        <div className="d-flex justify-content-between">

                                          <h6 className="fw-bold">
                                            💻 Coding Practice
                                          </h6>

                                          <span className="badge bg-light text-dark">
                                            {
                                              codingQuestions.length
                                            }{" "}
                                            Questions
                                          </span>

                                        </div>

                                        {codingQuestions.length >
                                        0 ? (
                                          codingQuestions.map(
                                            (
                                              item,
                                              index
                                            ) => (
                                              <div
                                                key={
                                                  index
                                                }
                                                className="bg-white text-dark rounded p-2 mt-2"
                                              >

                                                <strong>
                                                  Coding Q
                                                  {index +
                                                    1}
                                                </strong>

                                                <p className="small mb-0 mt-1">
                                                  {
                                                    item.question
                                                  }
                                                </p>

                                                {item.description && (
                                                  <p className="small mt-2 mb-1">
                                                    {
                                                      item.description
                                                    }
                                                  </p>
                                                )}

                                                {item.answer && (
                                                  <details className="mt-2">

                                                    <summary>
                                                      View Solution
                                                    </summary>

                                                    <pre
                                                      className="small mt-2"
                                                      style={{
                                                        whiteSpace:
                                                          "pre-wrap",
                                                      }}
                                                    >
                                                      {
                                                        item.answer
                                                      }
                                                    </pre>

                                                  </details>
                                                )}

                                              </div>
                                            )
                                          )
                                        ) : (
                                          <p className="small mb-0 mt-2">
                                            Coding practice
                                            will be available
                                            for this topic.
                                          </p>
                                        )}

                                      </div>
                                    )}

                                    {/* INTERVIEW */}

                                    <div className="p-3 bg-light rounded mt-2">

                                      <h6 className="fw-bold">
                                        🎤 Interview Questions
                                      </h6>

                                      {interviewQuestions.map(
                                        (
                                          question,
                                          index
                                        ) => (
                                          <div
                                            key={
                                              index
                                            }
                                            className="small border-bottom py-2"
                                          >

                                            <strong>
                                              Q
                                              {index +
                                                1}
                                              .
                                            </strong>{" "}
                                            {
                                              question
                                            }

                                          </div>
                                        )
                                      )}

                                    </div>

                                    {/* START TOPIC */}

                                    {!completed && (
                                      <button
                                        className="btn btn-primary w-100 mt-3"
                                        onClick={() =>
                                          handleStartTopic(
                                            moduleIndex,
                                            topicIndex,
                                            topic
                                          )
                                        }
                                      >
                                        🚀 Start Topic
                                      </button>
                                    )}

                                    {/* COMPLETE */}

                                    {!completed ? (
                                      <button
                                        className="btn btn-success w-100 mt-2"
                                        onClick={() =>
                                          handleTopicComplete(
                                            moduleIndex,
                                            topicIndex
                                          )
                                        }
                                      >
                                        ✓ Mark Topic Completed
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-success w-100 mt-3"
                                        disabled
                                      >
                                        ✅ Topic Completed
                                      </button>
                                    )}

                                  </div>

                                </div>

                              </div>
                            );
                          }
                        )}

                    </div>

                    {/* MODULE PROJECT */}

                    {module.project && (
                      <div className="alert alert-info mt-3">

                        <h5 className="fw-bold">
                          🚀 Module Project
                        </h5>

                        {module.project.title && (
                          <h6 className="fw-bold">
                            {
                              module.project.title
                            }
                          </h6>
                        )}

                        {module.project.description && (
                          <p className="mb-0">
                            {
                              module.project.description
                            }
                          </p>
                        )}

                      </div>
                    )}

                  </div>

                </div>
              )
            )}

          {/* NO MODULES */}

          {(
            !Array.isArray(
              roadmap.modules
            ) ||
            roadmap.modules.length ===
              0
          ) && (
            <div className="alert alert-warning">

              <h5 className="fw-bold">
                ⚠️ No roadmap modules found
              </h5>

              <p className="mb-0">
                The AI response did not contain
                any learning modules. Please
                generate a new roadmap.
              </p>

            </div>
          )}

          {/* BACK */}

          <div className="text-center mt-4">

            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                navigate(
                  `/learn/${courseId}`
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
