import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      answer: "",
    },
  ]);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...questions];
    updated[index].answer = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
      },
    ]);
  };

  const saveQuiz = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/quiz",
        {
          courseId,
          questions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Quiz Created Successfully");
      navigate("/admin");

    } catch (err) {
      console.log(err);
      alert("Failed to create quiz");
    }
  };

  return (
    <div className="container py-5">

      <h2 className="mb-4 text-primary">
        Add Quiz
      </h2>

      {questions.map((q, index) => (

        <div
          key={index}
          className="card p-4 mb-4 shadow"
        >

          <h4>
            Question {index + 1}
          </h4>

          <input
            className="form-control mb-3"
            placeholder="Enter Question"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(index, e.target.value)
            }
          />

          {q.options.map((op, i) => (

            <input
              key={i}
              className="form-control mb-2"
              placeholder={`Option ${i + 1}`}
              value={op}
              onChange={(e) =>
                handleOptionChange(
                  index,
                  i,
                  e.target.value
                )
              }
            />

          ))}

          <input
            className="form-control"
            placeholder="Correct Answer"
            value={q.answer}
            onChange={(e) =>
              handleAnswerChange(index, e.target.value)
            }
          />

        </div>

      ))}

      <button
        className="btn btn-secondary me-3"
        onClick={addQuestion}
      >
        + Add Question
      </button>

      <button
        className="btn btn-success"
        onClick={saveQuiz}
      >
        Save Quiz
      </button>

    </div>
  );
}