import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { generateRoadmap } from "../services/aiService";
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
  // ===========================
  // GENERATE AI ROADMAP
  // ===========================

  const handleGenerate = async () => {

    try {

      setLoading(true);

      const res = await generateRoadmap({
        career,
        experience,
        dailyTime,
      });

      setRoadmap(res.roadmap);

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
const downloadRoadmap = () => {

  const input = document.getElementById("roadmap");

  html2canvas(input, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  }).then((canvas) => {

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

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

      position = heightLeft - imgHeight;

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

    pdf.save("AI-Career-Roadmap.pdf");

  });

};
  // ===========================
  // AUTO GENERATE ROADMAP
  // ===========================

  useEffect(() => {

    if (location.state?.career) {

      handleGenerate();

    }

  }, []);
  return (

    <div className="container mt-5">

      <h2 className="text-center mb-4">
        🤖 AI Career Roadmap
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerate();
        }}
        className="card shadow p-4"
      >

        <div className="mb-3">

          <label className="form-label">
            Career
          </label>

          <input
            type="text"
            className="form-control"
            value={career}
            readOnly
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Experience
          </label>

          <select
            className="form-select"
            value={experience}
            onChange={(e) =>
              setExperience(e.target.value)
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
        <div className="mb-3">

          <label className="form-label">
            Daily Study Time
          </label>

          <select
            className="form-select"
            value={dailyTime}
            onChange={(e) =>
              setDailyTime(e.target.value)
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

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          disabled={loading}
        >
          {loading
            ? "Generating AI Roadmap..."
            : "🤖 Generate AI Roadmap"}
        </button>

      </form>

      {roadmap && (

        <div id="roadmap" className="mt-5">

          <div className="card shadow mb-4">

            <div className="card-body text-center">

              <h2 className="text-primary">
                {roadmap.title}
              </h2>

              <h5>
                📅 Duration : {roadmap.duration}
              </h5>

            </div>

          </div>
          {roadmap.modules.map((module, index) => (

            <div
              key={index}
              className="card shadow mb-3 border-0"
            >

              <div className="card-body">

                <h4 className="text-success">
                  📘 {module.title}
                </h4>

                <p>
                  <strong>⏳ Duration:</strong>{" "}
                  {module.duration}
                </p>

                <h5 className="mt-3">
                  Topics Covered
                </h5>

                <ul className="list-group list-group-flush">

                  {module.topics.map((topic, i) => (

                    <li
                      key={i}
                      className="list-group-item"
                    >
                      ✅ {topic}
                    </li>

                  ))}

                </ul>

              </div>

            </div>

          ))}
          <div className="text-center mt-5 mb-5">

            <button
              className="btn btn-success btn-lg me-3"
              onClick={() => navigate("/my-courses")}
            >
              📚 Back to My Courses
            </button>
<button
  className="btn btn-primary btn-lg"
  onClick={downloadRoadmap}
>
  📄 Download AI Roadmap PDF
</button>                     </div>

        </div>

      )}
    </div>

  );

}

export default AIRoadmap;