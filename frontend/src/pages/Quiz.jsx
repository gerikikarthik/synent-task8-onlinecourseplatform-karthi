import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API =
  "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api";

export default function Quiz() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    loadQuiz();
  }, [id]);

  // ==========================
  // LOAD QUIZ
  // ==========================
  const loadQuiz = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/quiz/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let quizQuestions = [];

      if (res.data.quiz) {
        quizQuestions = res.data.quiz.questions;
      } else if (res.data.questions) {
        quizQuestions = res.data.questions;
      }

      // Shuffle only once
      const shuffled = [...quizQuestions].sort(
        () => Math.random() - 0.5
      );

      setQuestions(shuffled);

    } catch (error) {

      console.log("LOAD QUIZ ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Quiz not available"
      );

    } finally {

      setLoading(false);

    }

  };
  // ==========================
  // SELECT ANSWER
  // ==========================
  const selectAnswer = (questionId, option) => {

    setAnswers((prev) => ({
      ...prev,
      [String(questionId)]: option,
    }));

  };

  // ==========================
  // SUBMIT QUIZ
  // ==========================
  const submitQuiz = async () => {

    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions.");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API}/quiz/submit`,
        {
          courseId: id,
          answers: answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Backend Result:", res.data);

      const result = res.data;

      if (result.passed) {

        alert(
          `🎉 Congratulations!\n\nCorrect Answers: ${result.correctAnswers}/${result.totalQuestions}\nScore: ${result.percentage}%`
        );

        navigate(`/certificate/${id}`);

      } else {

        alert(
          `❌ You Failed!\n\nCorrect Answers: ${result.correctAnswers}/${result.totalQuestions}\nScore: ${result.percentage}%`
        );

        const retry = window.confirm(
          "Do you want to retry the quiz?"
        );

        if (retry) {

          setCurrentQuestion(0);
          setAnswers({});

          // Shuffle questions again
          setQuestions((prev) => [...prev].sort(() => Math.random() - 0.5));

        } else {

          navigate(`/learn/${id}`);

        }

      }

    } catch (error) {

      console.log("SUBMIT ERROR:", error.response?.data);

      alert(
        error.response?.data?.message ||
        "Quiz submit failed"
      );

    }

  };
  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Loading Quiz...</h2>
      </div>
    );
  }

  // ==========================
  // NO QUIZ
  // ==========================
  if (questions.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h2>No Quiz Found</h2>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "#f8f9fa",
      }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-8">

          <div className="card shadow border-0">
            <div className="card-body p-5">

              <h2 className="text-center text-primary mb-4">
                📝 Course Quiz
              </h2>

              <h5>
                Question {currentQuestion + 1} / {questions.length}
              </h5>

              <div className="progress mb-4">
                <div
                  className="progress-bar"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>

              <h4 className="mb-4">
                {question.question}
              </h4>

              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="card p-3 mb-3"
                  style={{
                    cursor: "pointer",
                    border:
                      answers[String(question._id)] === option
                        ? "2px solid #0d6efd"
                        : "1px solid #ddd",
                  }}
                  onClick={() =>
                    selectAnswer(
                      String(question._id),
                      option
                    )
                  }
                >
                  <input
                    type="radio"
                    checked={
                      answers[String(question._id)] === option
                    }
                    readOnly
                  />{" "}
                  {option}
                </div>
              ))}

              <div className="d-flex justify-content-between mt-4">

                <button
                  className="btn btn-secondary"
                  disabled={currentQuestion === 0}
                  onClick={() =>
                    setCurrentQuestion(currentQuestion - 1)
                  }
                >
                  ⬅ Previous
                </button>

                {currentQuestion < questions.length - 1 ? (

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      setCurrentQuestion(currentQuestion + 1)
                    }
                  >
                    Next ➡
                  </button>

                ) : (

                  <button
                    className="btn btn-success"
                    onClick={submitQuiz}
                  >
                    Submit Quiz ✅
                  </button>

                )}

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );

}