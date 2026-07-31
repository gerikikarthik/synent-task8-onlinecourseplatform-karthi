export default function Features() {

  const features = [

    {
      icon: "🤖",
      title: "AI Career Roadmap",
      description:
        "Generate a personalized AI roadmap based on your enrolled course.",
      color: "#0d6efd",
    },

    {
      icon: "🎓",
      title: "Verified Certificate",
      description:
        "Receive a certificate after completing the course successfully.",
      color: "#198754",
    },

    {
      icon: "📚",
      title: "Premium Courses",
      description:
        "Learn from industry experts with structured premium content.",
      color: "#fd7e14",
    },

    {
      icon: "📝",
      title: "Quizzes & Assignments",
      description:
        "Practice every module with quizzes and assignments.",
      color: "#dc3545",
    },

    {
      icon: "📄",
      title: "Download Notes",
      description:
        "Download PDF notes and revise anytime, even offline.",
      color: "#6f42c1",
    },

    {
      icon: "💼",
      title: "Job Ready Skills",
      description:
        "Master real-world skills through projects and practical learning.",
      color: "#20c997",
    },

  ];

  return (

    <section
      className="py-5"
      style={{
        background: "#f8f9fa",
      }}
    >

      <div className="container">

        <div className="text-center mb-5">

          <span className="badge bg-success px-3 py-2 fs-6">
            ⭐ WHY CHOOSE US
          </span>

          <h2
            className="fw-bold mt-3"
            style={{
              fontSize: "42px",
            }}
          >
            Everything You Need To Become Job Ready
          </h2>

          <p
            className="text-muted"
            style={{
              maxWidth: "700px",
              margin: "auto",
            }}
          >
            Learn from experts, generate AI roadmaps,
            download notes, complete quizzes,
            earn certificates and build your dream career.
          </p>

        </div>

        <div className="row">

          {features.map((item, index) => (

            <div
              className="col-lg-4 col-md-6 mb-4"
              key={index}
            >

              <div
                className="card border-0 shadow h-100"
                style={{
                  borderRadius: "20px",
                  transition: "0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-10px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0px)";
                }}
              >

                <div className="card-body text-center p-4">

                  <div
                    style={{
                      fontSize: "60px",
                    }}
                  >
                    {item.icon}
                  </div>

                  <h4
                    className="fw-bold mt-3"
                    style={{
                      color: item.color,
                    }}
                  >
                    {item.title}
                  </h4>

                  <p className="text-muted mt-3">
                    {item.description}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

        <div className="row text-center mt-5">

          <div className="col-md-3 mb-4">

            <h1 className="text-primary fw-bold">
              25K+
            </h1>

            <h5>Students</h5>

          </div>

          <div className="col-md-3 mb-4">

            <h1 className="text-success fw-bold">
              500+
            </h1>

            <h5>Courses</h5>

          </div>

          <div className="col-md-3 mb-4">

            <h1 className="text-danger fw-bold">
              10K+
            </h1>

            <h5>Certificates</h5>

          </div>

          <div className="col-md-3 mb-4">

            <h1 className="text-warning fw-bold">
              98%
            </h1>

            <h5>Student Satisfaction</h5>

          </div>

        </div>

      </div>

    </section>

  );

}