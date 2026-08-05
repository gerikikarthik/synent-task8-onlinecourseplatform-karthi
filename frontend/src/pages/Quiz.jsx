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

      const quizQuestions =
        res.data.questions ||
        res.data.quiz?.questions ||
        [];

      const shuffledQuestions = [...quizQuestions].sort(
        () => Math.random() - 0.5
      );

      setQuestions(shuffledQuestions);

    } catch (error) {

      console.log(error);

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

    let score = 0;

    questions.forEach((q) => {

      const selectedAnswer =
        (answers[String(q._id)] || "")
          .trim()
          .toLowerCase();

      // Remove "Correct Answer:" if it exists
      const correctAnswer =
        (q.answer || "")
          .replace(/^correct answer\s*:\s*/i, "")
          .trim()
          .toLowerCase();

      console.log("Question:", q.question);
      console.log("Selected:", selectedAnswer);
      console.log("Correct:", correctAnswer);

      if (selectedAnswer === correctAnswer) {
        score++;
      }

    });

    const percentage = Math.round(
      (score / questions.length) * 100
    );

    console.log("Answers:", answers);
    console.log("Score:", score);
    console.log("Percentage:", percentage);

    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API}/quiz/submit`,
        {
          courseId: id,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Backend Result:", res.data);

    } catch (error) {

      console.log(
        "Submit Error:",
        error.response?.data
      );

    }

    if (percentage >= 70) {

      alert(
        `🎉 Congratulations!\n\nScore: ${percentage}%`
      );

      navigate(`/certificate/${id}`);

    } else {

      alert(
        `❌ You Failed!\n\nScore: ${percentage}%`
      );

      const retry = window.confirm(
        "Do you want to retry the quiz?"
      );

      if (retry) {

        const shuffled = [...questions].sort(
          () => Math.random() - 0.5
        );

        setQuestions(shuffled);
        setCurrentQuestion(0);
        setAnswers({});

      } else {

        navigate(`/learn/${id}`);

      }

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
