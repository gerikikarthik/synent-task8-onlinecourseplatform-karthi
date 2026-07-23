import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateRoadmap } from "../services/aiService";

function AIRoadmap() {
  const navigate = useNavigate();

  const [career, setCareer] = useState("");
  const [experience, setExperience] = useState("");
  const [dailyTime, setDailyTime] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await generateRoadmap({
        career,
        experience,
        dailyTime,
      });

      setRoadmap(res.roadmap);
      setLoading(false);
    } catch (err) {
      setLoading(false);

      console.log(err);
      console.log(err.response);

      alert(JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        🤖 AI Career Roadmap
      </h2>

      <form onSubmit={handleGenerate} className="card shadow p-4">

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Career (Example: Java Full Stack)"
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          required
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Daily Study Time"
          value={dailyTime}
          onChange={(e) => setDailyTime(e.target.value)}
          required
        />

        <button className="btn btn-primary">
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>

      </form>

      {roadmap && (
        <div className="mt-5">

          <div className="card shadow mb-4">
            <div className="card-body">
              <h3>{roadmap.title}</h3>
              <h5>Duration: {roadmap.duration}</h5>
            </div>
          </div>

          {roadmap.modules.map((module, index) => (
            <div key={index} className="card shadow mb-3">
              <div className="card-body">

                <h4>{module.title}</h4>

                <p>
                  <strong>Duration:</strong> {module.duration}
                </p>

                <ul>
                  {module.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>

              </div>
            </div>
          ))}

          <div className="text-center mt-4">

            <button
              className="btn btn-success btn-lg"
              onClick={() => {
                const courseId = localStorage.getItem("courseId");

                navigate(`/certificate/${courseId}`);
              }}
            >
              🎓 Get Certificate
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default AIRoadmap;