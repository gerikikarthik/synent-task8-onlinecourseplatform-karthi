import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  generateRoadmap,
  generateCodingQuestions,
} from "../services/aiService";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function AIRoadmap() {
  const navigate = useNavigate();
  const location = useLocation();

  const [career, setCareer] = useState(
    location.state?.career || ""
  );

  const [experience, setExperience] = useState(
    location.state?.experience || "Beginner"
  );

  const [dailyTime, setDailyTime] = useState(
    location.state?.dailyTime || "2 Hours"
  );

  const [roadmap, setRoadmap] = useState(null);

  const [loading, setLoading] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState(null);

  // =====================================================
  // CODING STATES
  // =====================================================

  const [codingQuestions, setCodingQuestions] = useState([]);

  const [codingLoading, setCodingLoading] = useState(false);

  // =====================================================
  // COMPLETED TOPICS
  // =====================================================

  const [completedTopics, setCompletedTopics] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          "aiRoadmapCompletedTopics"
        );

        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    });

  // =====================================================
  // QUIZ STATES
  // =====================================================

  const [quizTopic, setQuizTopic] = useState(null);

  const [quizAnswers, setQuizAnswers] = useState({});

  const [quizSubmitted, setQuizSubmitted] =
    useState(false);

  const [quizScore, setQuizScore] = useState(0);

  // =====================================================
  // GENERATE AI ROADMAP
  // =====================================================

  const handleGenerate = async () => {
    if (!career.trim()) {
      alert("Please select a career first.");
      return;
    }

    try {
      setLoading(true);

      const res = await generateRoadmap({
        career,
        experience,
        dailyTime,
      });

      setRoadmap(res.roadmap);

      setSelectedTopic(null);

      setCodingQuestions([]);

      setQuizTopic(null);

      setQuizAnswers({});

      setQuizSubmitted(false);

      setQuizScore(0);
    } catch (err) {
      console.log(err);
      console.log(err.response);

      alert(
        JSON.stringify(
          err.response?.data || err.message
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const downloadRoadmap = () => {
    const input =
      document.getElementById("roadmap");

    if (!input) {
      return;
    }

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imgData =
        canvas.toDataURL("image/png");

      const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
      );

      const pageWidth = 210;
      const pageHeight = 297;

      const imgWidth = pageWidth;

      const imgHeight =
        (canvas.height * imgWidth) /
        canvas.width;

      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position =
          heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
      }

      pdf.save(
        "AI-Career-Roadmap.pdf"
      );
    });
  };

  // =====================================================
  // AUTO GENERATE
  // =====================================================

  useEffect(() => {
    if (location.state?.career) {
      handleGenerate();
    }
  }, []);

  // =====================================================
  // SAVE COMPLETED TOPICS
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      "aiRoadmapCompletedTopics",
      JSON.stringify(completedTopics)
    );
  }, [completedTopics]);

  // =====================================================
  // TOPIC KEY
  // =====================================================

  const getTopicKey = (topic) => {
    return `${career}-${topic}`
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // =====================================================
  // MARK TOPIC COMPLETE
  // =====================================================

  const markTopicComplete = (topic) => {
    const key = getTopicKey(topic);

    if (!completedTopics.includes(key)) {
      setCompletedTopics([
        ...completedTopics,
        key,
      ]);
    }
  };

  // =====================================================
  // CHECK TOPIC COMPLETE
  // =====================================================

  const isTopicCompleted = (topic) => {
    return completedTopics.includes(
      getTopicKey(topic)
    );
  };

  // =====================================================
  // YOUTUBE SEARCH
  // =====================================================

  const openVideo = (topic) => {
    const searchQuery =
      encodeURIComponent(
        `${topic} tutorial for beginners`
      );

    window.open(
      `https://www.youtube.com/results?search_query=${searchQuery}`,
      "_blank"
    );

    markTopicComplete(topic);
  };

  // =====================================================
  // INTERVIEW QUESTIONS
  // =====================================================

  const getInterviewQuestions = (
    topic
  ) => {
    return [
      `What is ${topic} and why is it important?`,
      `Explain the main concepts of ${topic}.`,
      `What are the advantages of using ${topic}?`,
      `What are the common challenges when working with ${topic}?`,
      `Give a real-world example of ${topic}.`,
    ];
  };

  // =====================================================
  // GENERATE CODING QUESTIONS
  // =====================================================

  const loadCodingQuestions = async (
    topic
  ) => {
    if (!topic) {
      return;
    }

    try {
      setCodingLoading(true);

      setCodingQuestions([]);

      const res =
        await generateCodingQuestions(
          topic,
          career
        );

      console.log(
        "CODING QUESTIONS RESPONSE:",
        res
      );

      const questions =
        res.data?.questions || [];

      setCodingQuestions(questions);
    } catch (error) {
      console.error(
        "Coding Questions Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to generate coding questions"
      );
    } finally {
      setCodingLoading(false);
    }
  };

  // =====================================================
  // OPEN CODING PRACTICE PAGE
  // =====================================================

  const openCodingPractice = (
    question
  ) => {
    navigate("/coding-practice", {
      state: {
        question,
        topic: selectedTopic,
        career,
      },
    });
  };

  // =====================================================
  // QUIZ QUESTIONS
  // =====================================================

  const getQuizQuestions = (
    topic
  ) => {
    return [
      {
        question: `What is the primary purpose of ${topic}?`,
        options: [
          "To solve programming and development problems",
          "Only for designing images",
          "Only for playing games",
          "None of the above",
        ],
        answer: 0,
      },

      {
        question: `Which approach is best when learning ${topic}?`,
        options: [
          "Only watching videos",
          "Learn concepts and practice",
          "Avoid practice",
          "Memorize everything",
        ],
        answer: 1,
      },

      {
        question: `Which is important for becoming good at ${topic}?`,
        options: [
          "Practice",
          "Avoid coding",
          "Skip fundamentals",
          "None",
        ],
        answer: 0,
      },

      {
        question: `How should you prepare ${topic} for interviews?`,
        options: [
          "Only read definitions",
          "Practice concepts and problems",
          "Never practice",
          "Skip examples",
        ],
        answer: 1,
      },

      {
        question: `What helps most with ${topic}?`,
        options: [
          "Consistent practice",
          "Avoiding projects",
          "Skipping questions",
          "None",
        ],
        answer: 0,
      },
    ];
  };

  // =====================================================
  // START QUIZ
  // =====================================================

  const startQuiz = (topic) => {
    setQuizTopic(topic);

    setQuizAnswers({});

    setQuizSubmitted(false);

    setQuizScore(0);
  };

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  const selectAnswer = (
    questionIndex,
    answerIndex
  ) => {
    if (quizSubmitted) {
      return;
    }

    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]:
        answerIndex,
    });
  };

  // =====================================================
  // SUBMIT QUIZ
  // =====================================================

  const submitQuiz = () => {
    if (!quizTopic) {
      return;
    }

    const questions =
      getQuizQuestions(quizTopic);

    let score = 0;

    questions.forEach(
      (question, index) => {
        if (
          quizAnswers[index] ===
          question.answer
        ) {
          score++;
        }
      }
    );

    setQuizScore(score);

    setQuizSubmitted(true);

    if (score >= 3) {
      markTopicComplete(quizTopic);
    }
  };

  // =====================================================
  // CALCULATE TOTAL TOPICS
  // =====================================================

  const getTotalTopics = () => {
    if (!roadmap?.modules) {
      return 0;
    }

    return roadmap.modules.reduce(
      (total, module) => {
        return (
          total +
          (module.topics?.length || 0)
        );
      },
      0
    );
  };

  // =====================================================
  // CALCULATE COMPLETED TOPICS
  // =====================================================

  const getCompletedTopicCount = () => {
    if (!roadmap?.modules) {
      return 0;
    }

    let count = 0;

    roadmap.modules.forEach(
      (module) => {
        module.topics?.forEach(
          (topic) => {
            if (
              isTopicCompleted(topic)
            ) {
              count++;
            }
          }
        );
      }
    );

    return count;
  };

  const totalTopics =
    getTotalTopics();

  const completedTopicCount =
    getCompletedTopicCount();

  const overallProgress =
    totalTopics > 0
      ? Math.round(
          (completedTopicCount /
            totalTopics) *
            100
        )
      : 0;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="container-fluid py-5"
      style={{
        background:
          "linear-gradient(135deg,#f4f7ff,#ffffff)",
        minHeight: "100vh",
      }}
    >
      <div className="container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-5">

          <div
            style={{
              fontSize: "55px",
            }}
          >
            🤖
          </div>

          <h1
            className="fw-bold"
            style={{
              color: "#0d6efd",
            }}
          >
            AI Career Roadmap
          </h1>

          <p className="text-muted">
            Your personalized AI-powered
            learning journey
          </p>

        </div>

        {/* =================================================
            GENERATOR
        ================================================= */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="card border-0 shadow-lg p-4 mb-5"
          style={{
            borderRadius: "20px",
          }}
        >

          <div className="row">

            {/* CAREER */}

            <div className="col-md-4 mb-3">

              <label className="form-label fw-bold">
                Career
              </label>

              <input
                type="text"
                className="form-control form-control-lg"
                value={career}
                readOnly
                placeholder="Select career"
              />

            </div>

            {/* EXPERIENCE */}

            <div className="col-md-4 mb-3">

              <label className="form-label fw-bold">
                Experience
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

                <option value="Beginner">
                  🟢 Beginner
                </option>

                <option value="Intermediate">
                  🟡 Intermediate
                </option>

                <option value="Advanced">
                  🔴 Advanced
                </option>

              </select>

            </div>

            {/* DAILY TIME */}

            <div className="col-md-4 mb-3">

              <label className="form-label fw-bold">
                Daily Study Time
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

                <option value="1 Hour">
                  1 Hour / Day
                </option>

                <option value="2 Hours">
                  2 Hours / Day
                </option>

                <option value="3 Hours">
                  3 Hours / Day
                </option>

                <option value="4 Hours">
                  4 Hours / Day
                </option>

                <option value="5 Hours">
                  5 Hours / Day
                </option>

                <option value="6 Hours">
                  6 Hours / Day
                </option>

              </select>

            </div>

          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
            disabled={loading}
          >
            {loading
              ? "🤖 Generating AI Roadmap..."
              : "🚀 Generate AI Roadmap"}
          </button>

        </form>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="text-center my-5">

            <div
              className="spinner-border text-primary"
              style={{
                width: "3rem",
                height: "3rem",
              }}
            ></div>

            <h5 className="mt-3">
              AI is building your
              personalized roadmap...
            </h5>

          </div>
        )}

        {/* =================================================
            ROADMAP
        ================================================= */}

        {roadmap && !loading && (

          <div id="roadmap">

            {/* =================================================
                ROADMAP HEADER
            ================================================= */}

            <div
              className="card border-0 shadow-lg mb-4"
              style={{
                borderRadius: "20px",
              }}
            >

              <div className="card-body text-center p-5">

                <span className="badge bg-primary fs-6 px-3 py-2">
                  🤖 AI GENERATED
                </span>

                <h2 className="text-primary fw-bold mt-3">
                  {roadmap.title}
                </h2>

                <h5 className="text-muted">
                  📅 Duration:{" "}
                  {roadmap.duration}
                </h5>

                {/* PROGRESS */}

                <div className="mt-4 text-start">

                  <div className="d-flex justify-content-between">

                    <strong>
                      Learning Progress
                    </strong>

                    <strong className="text-success">
                      {overallProgress}%
                    </strong>

                  </div>

                  <div
                    className="progress mt-2"
                    style={{
                      height: "18px",
                      borderRadius: "15px",
                    }}
                  >

                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${overallProgress}%`,
                      }}
                    ></div>

                  </div>

                  <small className="text-muted">
                    {completedTopicCount} of{" "}
                    {totalTopics} topics
                    completed
                  </small>

                </div>

              </div>

            </div>

            {/* =================================================
                MODULES
            ================================================= */}

            {roadmap.modules?.map(
              (module, index) => (

                <div
                  key={index}
                  className="card border-0 shadow mb-4"
                  style={{
                    borderRadius: "18px",
                  }}
                >

                  <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                      <h4 className="text-success fw-bold mb-0">

                        📘 Module{" "}
                        {index + 1}:{" "}
                        {module.title}

                      </h4>

                      <span className="badge bg-light text-dark">

                        ⏳{" "}
                        {module.duration}

                      </span>

                    </div>

                    <h5 className="mb-3">
                      Topics
                    </h5>

                    <div className="row">

                      {module.topics?.map(
                        (topic, i) => (

                          <div
                            className="col-md-6 mb-3"
                            key={i}
                          >

                            <div
                              className="card h-100 border"
                              style={{
                                borderRadius:
                                  "15px",
                                cursor:
                                  "pointer",
                              }}
                              onClick={() => {
                                setSelectedTopic(
                                  topic
                                );

                                setCodingQuestions(
                                  []
                                );
                              }}
                            >

                              <div className="card-body">

                                <div className="d-flex justify-content-between">

                                  <h5 className="fw-bold">

                                    {isTopicCompleted(
                                      topic
                                    )
                                      ? "✅"
                                      : "📚"}{" "}

                                    {topic}

                                  </h5>

                                  <span className="badge bg-primary">
                                    Learn
                                  </span>

                                </div>

                                <p className="text-muted mb-0">
                                  Video • Interview
                                  • Coding • Quiz
                                </p>

                              </div>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>

              )
            )}

            {/* =================================================
                TOPIC LEARNING PANEL
            ================================================= */}

            {selectedTopic && (

              <div
                className="card border-0 shadow-lg mb-5"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >

                {/* TOPIC HEADER */}

                <div className="card-header bg-primary text-white p-4">

                  <div className="d-flex justify-content-between align-items-center">

                    <h3 className="mb-0">
                      📚 {selectedTopic}
                    </h3>

                    <button
                      className="btn btn-light"
                      onClick={() => {
                        setSelectedTopic(null);
                        setCodingQuestions([]);
                      }}
                    >
                      ✕ Close
                    </button>

                  </div>

                </div>

                <div className="card-body p-4">

                  {/* =================================================
                      RESOURCE CARDS
                  ================================================= */}

                  <div className="row">

                    {/* VIDEO */}

                    <div className="col-lg-3 col-md-6 mb-4">

                      <div className="card h-100 shadow-sm border-0">

                        <div className="card-body text-center">

                          <div
                            style={{
                              fontSize: "45px",
                            }}
                          >
                            📺
                          </div>

                          <h5 className="fw-bold mt-2">
                            Learn Video
                          </h5>

                          <p className="text-muted">
                            Watch a tutorial
                            related to{" "}
                            {selectedTopic}.
                          </p>

                          <button
                            className="btn btn-danger w-100"
                            onClick={() =>
                              openVideo(
                                selectedTopic
                              )
                            }
                          >
                            ▶ Watch Video
                          </button>

                        </div>

                      </div>

                    </div>

                    {/* INTERVIEW */}

                    <div className="col-lg-3 col-md-6 mb-4">

                      <div className="card h-100 shadow-sm border-0">

                        <div className="card-body text-center">

                          <div
                            style={{
                              fontSize: "45px",
                            }}
                          >
                            📝
                          </div>

                          <h5 className="fw-bold mt-2">
                            Interview Questions
                          </h5>

                          <p className="text-muted">
                            Prepare important
                            interview questions.
                          </p>

                          <button
                            className="btn btn-warning w-100"
                            onClick={() =>
                              document
                                .getElementById(
                                  "interview-section"
                                )
                                ?.scrollIntoView({
                                  behavior:
                                    "smooth",
                                })
                            }
                          >
                            View Questions
                          </button>

                        </div>

                      </div>

                    </div>

                    {/* CODING */}

                    <div className="col-lg-3 col-md-6 mb-4">

                      <div className="card h-100 shadow-sm border-0">

                        <div className="card-body text-center">

                          <div
                            style={{
                              fontSize: "45px",
                            }}
                          >
                            💻
                          </div>

                          <h5 className="fw-bold mt-2">
                            Coding Practice
                          </h5>

                          <p className="text-muted">
                            AI-generated problems
                            related to{" "}
                            {selectedTopic}.
                          </p>

                          <button
                            className="btn btn-dark w-100"
                            disabled={
                              codingLoading
                            }
                            onClick={async () => {
                              await loadCodingQuestions(
                                selectedTopic
                              );

                              setTimeout(() => {
                                document
                                  .getElementById(
                                    "coding-section"
                                  )
                                  ?.scrollIntoView({
                                    behavior:
                                      "smooth",
                                  });
                              }, 300);
                            }}
                          >
                            {codingLoading
                              ? "🤖 Generating..."
                              : "💻 Start Coding"}
                          </button>

                        </div>

                      </div>

                    </div>

                    {/* QUIZ */}

                    <div className="col-lg-3 col-md-6 mb-4">

                      <div className="card h-100 shadow-sm border-0">

                        <div className="card-body text-center">

                          <div
                            style={{
                              fontSize: "45px",
                            }}
                          >
                            🧪
                          </div>

                          <h5 className="fw-bold mt-2">
                            Practice Quiz
                          </h5>

                          <p className="text-muted">
                            Test your knowledge.
                          </p>

                          <button
                            className="btn btn-success w-100"
                            onClick={() =>
                              startQuiz(
                                selectedTopic
                              )
                            }
                          >
                            Start Quiz
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      INTERVIEW QUESTIONS
                  ================================================= */}

                  <div
                    id="interview-section"
                    className="mt-4"
                  >

                    <h4 className="fw-bold text-warning">
                      📝 Interview Questions
                    </h4>

                    {getInterviewQuestions(
                      selectedTopic
                    ).map(
                      (
                        question,
                        index
                      ) => (

                        <div
                          className="card border-0 shadow-sm mb-2"
                          key={index}
                        >

                          <div className="card-body">

                            <strong>
                              Q{index + 1}.
                            </strong>{" "}

                            {question}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                  {/* =================================================
                      CODING QUESTIONS
                  ================================================= */}

                  <div
                    id="coding-section"
                    className="mt-5"
                  >

                    <div className="d-flex justify-content-between align-items-center mb-3">

                      <h4 className="fw-bold text-dark mb-0">
                        💻 Coding Practice
                      </h4>

                      {codingQuestions.length > 0 && (
                        <span className="badge bg-success">
                          {codingQuestions.length} Problems
                        </span>
                      )}

                    </div>

                    {/* INITIAL MESSAGE */}

                    {!codingLoading &&
                      codingQuestions.length ===
                        0 && (

                        <div className="alert alert-secondary">

                          <strong>
                            💡 Ready to practice?
                          </strong>

                          <p className="mb-0 mt-1">
                            Click{" "}
                            <strong>
                              Start Coding
                            </strong>{" "}
                            above to generate
                            coding problems
                            specifically for{" "}
                            <strong>
                              {selectedTopic}
                            </strong>.
                          </p>

                        </div>

                      )}

                    {/* LOADING */}

                    {codingLoading && (

                      <div className="text-center py-5">

                        <div
                          className="spinner-border text-dark"
                          style={{
                            width: "3rem",
                            height: "3rem",
                          }}
                        ></div>

                        <h5 className="mt-3">
                          🤖 AI is creating
                          coding problems...
                        </h5>

                        <p className="text-muted">
                          Creating LeetCode-style
                          questions for{" "}
                          {selectedTopic}
                        </p>

                      </div>

                    )}

                    {/* QUESTIONS */}

                    {!codingLoading &&
                      codingQuestions.length >
                        0 && (

                        <div>

                          {codingQuestions.map(
                            (
                              question,
                              index
                            ) => (

                              <div
                                className="card border-0 shadow-sm mb-3"
                                key={
                                  question.id ||
                                  index
                                }
                              >

                                <div className="card-body">

                                  <div className="d-flex justify-content-between align-items-start">

                                    <div>

                                      <h5 className="fw-bold mb-2">

                                        Problem{" "}
                                        {index + 1}:{" "}
                                        {question.title}

                                      </h5>

                                      <span
                                        className={
                                          question.difficulty ===
                                          "Medium"
                                            ? "badge bg-warning text-dark"
                                            : "badge bg-success"
                                        }
                                      >
                                        {question.difficulty ||
                                          "Easy"}
                                      </span>

                                    </div>

                                    <button
                                      className="btn btn-dark"
                                      onClick={() =>
                                        openCodingPractice(
                                          question
                                        )
                                      }
                                    >
                                      💻 Practice
                                    </button>

                                  </div>

                                  <p className="text-muted mt-3 mb-0">

                                    {question.description}

                                  </p>

                                  {question.examples?.[0] && (

                                    <div className="bg-light rounded p-3 mt-3">

                                      <strong>
                                        Example:
                                      </strong>

                                      <div className="mt-2">

                                        <div>
                                          <strong>
                                            Input:
                                          </strong>{" "}
                                          <code>
                                            {
                                              question
                                                .examples[0]
                                                .input
                                            }
                                          </code>
                                        </div>

                                        <div>
                                          <strong>
                                            Output:
                                          </strong>{" "}
                                          <code>
                                            {
                                              question
                                                .examples[0]
                                                .output
                                            }
                                          </code>
                                        </div>

                                      </div>

                                    </div>

                                  )}

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      )}

                  </div>

                  {/* =================================================
                      QUIZ
                  ================================================= */}

                  {quizTopic ===
                    selectedTopic && (

                    <div className="mt-5">

                      <h4 className="fw-bold text-success">
                        🧪{" "}
                        {selectedTopic}{" "}
                        Practice Quiz
                      </h4>

                      {getQuizQuestions(
                        selectedTopic
                      ).map(
                        (
                          question,
                          index
                        ) => (

                          <div
                            className="card border-0 shadow-sm mb-3"
                            key={index}
                          >

                            <div className="card-body">

                              <h6 className="fw-bold">

                                Q{index + 1}.{" "}
                                {
                                  question.question
                                }

                              </h6>

                              {question.options.map(
                                (
                                  option,
                                  optionIndex
                                ) => (

                                  <div
                                    className="form-check mb-2"
                                    key={
                                      optionIndex
                                    }
                                  >

                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name={`question-${index}`}
                                      checked={
                                        quizAnswers[
                                          index
                                        ] ===
                                        optionIndex
                                      }
                                      disabled={
                                        quizSubmitted
                                      }
                                      onChange={() =>
                                        selectAnswer(
                                          index,
                                          optionIndex
                                        )
                                      }
                                    />

                                    <label className="form-check-label">
                                      {option}
                                    </label>

                                  </div>

                                )
                              )}

                              {quizSubmitted && (

                                <div
                                  className={
                                    quizAnswers[
                                      index
                                    ] ===
                                    question.answer
                                      ? "text-success"
                                      : "text-danger"
                                  }
                                >

                                  {quizAnswers[
                                    index
                                  ] ===
                                  question.answer
                                    ? "✅ Correct"
                                    : `❌ Correct answer: ${
                                        question
                                          .options[
                                          question.answer
                                        ]
                                      }`}

                                </div>

                              )}

                            </div>

                          </div>

                        )
                      )}

                      {!quizSubmitted ? (

                        <button
                          className="btn btn-success btn-lg"
                          onClick={
                            submitQuiz
                          }
                        >
                          Submit Quiz
                        </button>

                      ) : (

                        <div className="alert alert-info mt-3">

                          <h4>
                            🎯 Your Score:{" "}
                            {quizScore}/5
                          </h4>

                          {quizScore >= 3 ? (

                            <p className="text-success fw-bold mb-0">
                              🎉 Great job! Topic
                              completed.
                            </p>

                          ) : (

                            <p className="mb-0">
                              Keep practicing
                              and try again.
                            </p>

                          )}

                        </div>

                      )}

                    </div>

                  )}

                  {/* =================================================
                      COMPLETE TOPIC
                  ================================================= */}

                  <div className="text-center mt-5">

                    {isTopicCompleted(
                      selectedTopic
                    ) ? (

                      <div className="alert alert-success">

                        ✅ You have completed{" "}

                        <strong>
                          {selectedTopic}
                        </strong>

                      </div>

                    ) : (

                      <button
                        className="btn btn-outline-success btn-lg"
                        onClick={() =>
                          markTopicComplete(
                            selectedTopic
                          )
                        }
                      >
                        ✅ Mark Topic as
                        Completed
                      </button>

                    )}

                  </div>

                </div>

              </div>

            )}

            {/* =================================================
                BOTTOM BUTTONS
            ================================================= */}

            <div className="text-center mt-5 mb-5">

              <button
                className="btn btn-success btn-lg me-3 mb-2"
                onClick={() =>
                  navigate("/mycourses")
                }
              >
                📚 Back to My Courses
              </button>

              <button
                className="btn btn-primary btn-lg mb-2"
                onClick={
                  downloadRoadmap
                }
              >
                📄 Download AI Roadmap PDF
              </button>

            </div>

          </div>

        )}

      </div>
    </div>
  );
}

export default AIRoadmap;