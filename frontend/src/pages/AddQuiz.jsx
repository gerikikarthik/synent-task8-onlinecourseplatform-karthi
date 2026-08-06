import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API =
  "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api";

export default function AddQuiz() {

  const { courseId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      answer: ""
    }
  ]);

  // ==========================
  // QUESTION CHANGE
  // ==========================
  const handleQuestionChange = (index, value) => {

    const updated = [...questions];

    updated[index].question = value;

    setQuestions(updated);

  };

  // ==========================
  // OPTION CHANGE
  // ==========================
  const handleOptionChange = (
    qIndex,
    oIndex,
    value
  ) => {

    const updated = [...questions];

    updated[qIndex].options[oIndex] = value;

    // If selected answer changed, update it
    if (updated[qIndex].answer === "") {
      updated[qIndex].answer = "";
    }

    setQuestions(updated);

  };

  // ==========================
  // CORRECT ANSWER CHANGE
  // ==========================
  const handleAnswerChange = (
    qIndex,
    optionIndex
  ) => {

    const updated = [...questions];

    // Save actual option text, NOT "Option 1"
    updated[qIndex].answer =
      updated[qIndex].options[optionIndex];

    setQuestions(updated);

  };

  // ==========================
  // ADD QUESTION
  // ==========================
  const addQuestion = () => {

    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        answer: ""
      }
    ]);

  };

  // ==========================
  // SAVE QUIZ
  // ==========================
  const saveQuiz = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      for (let q of questions) {

        if (!q.question.trim()) {
          return alert("Enter all questions");
        }

        if (q.options.some(op => !op.trim())) {
          return alert("Fill all options");
        }

        if (!q.answer.trim()) {
          return alert("Select correct answer");
        }

      }

      const response = await axios.post(

        `${API}/quiz/create`,

        {

          courseId,

          questions

        },

        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      );

      console.log(response.data);

      alert("Quiz Created Successfully");

      navigate("/admin");

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Failed to create quiz"

      );

    }

  };
  // ==========================
  // UI
  // ==========================
  return (

    <div className="container py-5">

      <h2 className="text-primary mb-4">
        📝 Add Quiz
      </h2>

      {
        questions.map((q, index) => (

          <div
            key={index}
            className="card shadow p-4 mb-4"
          >

            <h4 className="mb-3">
              Question {index + 1}
            </h4>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter Question"
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(
                  index,
                  e.target.value
                )
              }
            />

            {
              q.options.map((option, oIndex) => (

                <input
                  key={oIndex}
                  type="text"
                  className="form-control mb-2"
                  placeholder={`Option ${oIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      oIndex,
                      e.target.value
                    )
                  }
                />

              ))
            }

            <label className="mt-3 fw-bold">
              Select Correct Answer
            </label>

            <select
              className="form-select mt-2"
              value={
                q.options.findIndex(
                  (op) => op === q.answer
                )
              }
              onChange={(e) =>
                handleAnswerChange(
                  index,
                  Number(e.target.value)
                )
              }
            >
              <option value="">Choose Correct Answer</option>

              {
                q.options.map((option, i) => (

                  <option
                    key={i}
                    value={i}
                  >
                    Option {i + 1} : {option || `Option ${i + 1}`}
                  </option>

                ))
              }

            </select>

          </div>

        ))
      }

      <div className="d-flex gap-3">

        <button
          className="btn btn-secondary"
          onClick={addQuestion}
        >
          ➕ Add Question
        </button>

        <button
          className="btn btn-success"
          onClick={saveQuiz}
        >
          ✅ Save Quiz
        </button>

      </div>

    </div>

  );

}