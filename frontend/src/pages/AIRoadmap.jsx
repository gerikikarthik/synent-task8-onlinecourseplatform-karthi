import React, { useEffect, useState } from "react";
import { generateRoadmap } from "../services/aiService";

function AIRoadmap() {
  const [career, setCareer] = useState("");
  const [experience, setExperience] = useState("");
  const [dailyTime, setDailyTime] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const course = localStorage.getItem("selectedCourse");

    if (course) {
      setCareer(course);
    }
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await generateRoadmap({
        career,
        experience,
        dailyTime,
      });

      console.log("API Response:", res);

      setRoadmap(res.roadmap);
    } catch (err) {
      console.log(err);
      alert(JSON.stringify(err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        🤖 AI Career Roadmap
      </h2>

      <form onSubmit={handleGenerate} className="card p-4 shadow">

        <div className="mb-3">
          <label className="form-label">Career</label>
          <input
            type="text"
            className="form-control"
            placeholder="Career"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Experience</label>
          <select
            className="form-select"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          >
            <option value="">Select Experience</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Daily Study Time</label>
          <select
            className="form-select"
            value={dailyTime}
            onChange={(e) => setDailyTime(e.target.value)}
            required
          >
            <option value="">Select Time</option>
            <option>1 Hour</option>
            <option>2 Hours</option>
            <option>3 Hours</option>
            <option>4 Hours</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate AI Roadmap"}
        </button>

      </form>

      {roadmap && (
        <div className="mt-5">

          <div className="card shadow mb-4">
            <div className="card-body">
              <h3>{roadmap.title}</h3>
              <h5 className="text-success">
                Duration: {roadmap.duration}
              </h5>
            </div>
          </div>

          {roadmap.modules.map((module, index) => (
            <div key={index} className="card shadow mb-3">
              <div className="card-body">

                <h4>{module.name || module.title}</h4>

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

        </div>
      )}

    </div>
  );
}

export default AIRoadmap;