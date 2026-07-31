import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0f172a",
        color: "white",
        padding: "70px 0 20px",
      }}
    >
      <div className="container">

        <div className="row">

          {/* Company */}

          <div className="col-lg-4 mb-4">

            <h2
              className="fw-bold"
              style={{
                color: "#38bdf8",
              }}
            >
              CourseHub
            </h2>

            <p className="mt-3 text-light">

              Learn from industry experts with AI-powered
              roadmaps, quizzes, certificates and premium
              learning experiences.

            </p>

            <div className="mt-4">

              <span className="badge bg-primary me-2">
                25K+ Students
              </span>

              <span className="badge bg-success me-2">
                500+ Courses
              </span>

              <span className="badge bg-warning text-dark">
                AI Powered
              </span>

            </div>

          </div>

          {/* Quick Links */}

          <div className="col-lg-2 col-md-6 mb-4">

            <h5>Quick Links</h5>

            <ul className="list-unstyled mt-3">

              <li className="mb-2">
                <Link
                  to="/"
                  className="text-decoration-none text-light"
                >
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/courses"
                  className="text-decoration-none text-light"
                >
                  Courses
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/login"
                  className="text-decoration-none text-light"
                >
                  Login
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/register"
                  className="text-decoration-none text-light"
                >
                  Register
                </Link>
              </li>

            </ul>

          </div>

          {/* Features */}

          <div className="col-lg-3 col-md-6 mb-4">

            <h5>Features</h5>

            <ul className="list-unstyled mt-3">

              <li className="mb-2">
                🤖 AI Career Roadmap
              </li>

              <li className="mb-2">
                🎓 Certificates
              </li>

              <li className="mb-2">
                📄 Notes PDF
              </li>

              <li className="mb-2">
                📝 Quiz & Assignments
              </li>

              <li className="mb-2">
                💼 Job Ready Courses
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div className="col-lg-3 mb-4">

            <h5>Contact</h5>

            <p className="mt-3">
              📧 support@coursehub.com
            </p>

            <p>
              📞 +91 8125130488
            </p>

            <p>
              📍 Hyderabad, India
            </p>

            <div className="mt-4">

              <button className="btn btn-primary me-2">
                Facebook
              </button>

              <button className="btn btn-danger me-2">
                YouTube
              </button>

              <button className="btn btn-info">
                LinkedIn
              </button>

            </div>

          </div>

        </div>

        <hr
          style={{
            borderColor: "#334155",
          }}
        />

        <div className="text-center">

          <p className="mb-0">

            © 2026 CourseHub.
            All Rights Reserved.

          </p>

        </div>

      </div>
    </footer>
  );
}