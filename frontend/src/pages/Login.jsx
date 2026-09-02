import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

    const res = await axios.post(
  
  "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/auth/login",
  {
    email: email.trim(),
    password,
  }
);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      toast.success(
        res.data?.message || "Login Successful! 🎉"
      );

      setTimeout(() => {
        navigate("/courses");
      }, 700);
    } catch (err) {
      console.log("Login Error:", err);
      console.log("Server Response:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0d6efd 0%, #6f42c1 50%, #f8f9fa 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 15px",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1050px",
        }}
      >
        <div
          className="row g-0 shadow-lg overflow-hidden"
          style={{
            borderRadius: "25px",
            background: "#fff",
          }}
        >
          {/* LEFT SIDE */}
          <div
            className="col-lg-5 d-none d-lg-flex"
            style={{
              background:
                "linear-gradient(135deg, #0d6efd, #6f42c1)",
              color: "#fff",
              padding: "50px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "55px",
                  marginBottom: "20px",
                }}
              >
                🎓
              </div>

              <h1
                className="fw-bold"
                style={{
                  fontSize: "42px",
                }}
              >
                Welcome Back!
              </h1>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.7",
                  opacity: 0.9,
                }}
              >
                Continue your learning journey
                with CourseHub. Login and start
                learning today.
              </p>

              <div className="mt-4">
                <div className="d-flex align-items-center mb-3">
                  <span
                    className="me-3"
                    style={{
                      fontSize: "24px",
                    }}
                  >
                    📚
                  </span>

                  <span>
                    Access your enrolled courses
                  </span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <span
                    className="me-3"
                    style={{
                      fontSize: "24px",
                    }}
                  >
                    📈
                  </span>

                  <span>
                    Track your learning progress
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  <span
                    className="me-3"
                    style={{
                      fontSize: "24px",
                    }}
                  >
                    🏆
                  </span>

                  <span>
                    Earn certificates
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            className="col-lg-7"
            style={{
              padding: "50px",
            }}
          >
            <div className="text-center mb-4">
              <div
                className="d-lg-none"
                style={{
                  fontSize: "45px",
                }}
              >
                🎓
              </div>

              <h2
                className="fw-bold mb-2"
                style={{
                  color: "#0d6efd",
                }}
              >
                Welcome Back
              </h2>

              <p className="text-muted">
                Login to continue learning.
              </p>
            </div>

            <form onSubmit={loginUser}>
              {/* EMAIL */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Email Address
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light">
                    📧
                  </span>

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Password
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light">
                    🔒
                  </span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* REMEMBER / SECURITY */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                  />

                  <label
                    className="form-check-label text-muted"
                    htmlFor="remember"
                  >
                    Remember me
                  </label>
                </div>

                <span
                  className="text-primary fw-semibold"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    toast.info(
                      "Please contact support to reset your password."
                    )
                  }
                >
                  Forgot Password?
                </span>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
                style={{
                  borderRadius: "12px",
                  padding: "12px",
                  fontWeight: "600",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Logging In...
                  </>
                ) : (
                  "🔐 Login"
                )}
              </button>
            </form>

            {/* REGISTER */}
            <div className="text-center mt-4">
              <span className="text-muted">
                Don't have an account?{" "}
              </span>

              <button
                className="btn btn-link fw-bold text-decoration-none"
                onClick={() =>
                  navigate("/register")
                }
              >
                Create Account
              </button>
            </div>

            <div className="text-center mt-3">
              <small className="text-muted">
                🔐 Your login information is securely
                protected.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}