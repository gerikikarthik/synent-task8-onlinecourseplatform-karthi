import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) {
      return {
        text: "",
        width: "0%",
        className: "",
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        text: "Weak Password",
        width: "35%",
        className: "bg-danger",
      };
    }

    if (score <= 4) {
      return {
        text: "Medium Password",
        width: "70%",
        className: "bg-warning",
      };
    }

    return {
      text: "Strong Password",
      width: "100%",
      className: "bg-success",
    };
  };

  const passwordStrength = getPasswordStrength();

  const registerUser = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      );

      toast.success(
        res.data?.message || "Registration Successful"
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.log("Registration Error:", err);

      toast.error(
        err.response?.data?.message ||
          "Registration failed. Please try again."
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
                Join CourseHub
              </h1>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.7",
                  opacity: 0.9,
                }}
              >
                Start learning new skills, explore
                professional courses, and build your
                future with CourseHub.
              </p>

              <div className="mt-4">
                <div className="d-flex align-items-center mb-3">
                  <span
                    className="me-3"
                    style={{
                      fontSize: "24px",
                    }}
                  >
                    ✅
                  </span>

                  <span>
                    Learn from expert instructors
                  </span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <span
                    className="me-3"
                    style={{
                      fontSize: "24px",
                    }}
                  >
                    🚀
                  </span>

                  <span>
                    Build job-ready skills
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
              padding: "45px",
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
                Create Your Account
              </h2>

              <p className="text-muted">
                Register now and start your learning
                journey.
              </p>
            </div>

            <form onSubmit={registerUser}>
              {/* NAME */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Full Name
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light">
                    👤
                  </span>

                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="mb-3">
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
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-2">
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
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

              {/* PASSWORD STRENGTH */}
              {password && (
                <div className="mb-3">
                  <div
                    className="progress"
                    style={{
                      height: "6px",
                    }}
                  >
                    <div
                      className={`progress-bar ${passwordStrength.className}`}
                      style={{
                        width:
                          passwordStrength.width,
                      }}
                    ></div>
                  </div>

                  <small
                    className={
                      passwordStrength.className.replace(
                        "bg-",
                        "text-"
                      )
                    }
                  >
                    {passwordStrength.text}
                  </small>
                </div>
              )}

              {/* CONFIRM PASSWORD */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Confirm Password
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light">
                    🔐
                  </span>

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    className="form-control form-control-lg"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "🙈"
                      : "👁️"}
                  </button>
                </div>

                {confirmPassword && (
                  <small
                    className={
                      password === confirmPassword
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {password ===
                    confirmPassword
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </small>
                )}
              </div>

              {/* TERMS */}
              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  required
                />

                <label
                  className="form-check-label text-muted"
                  htmlFor="terms"
                >
                  I agree to the Terms & Conditions
                  and Privacy Policy.
                </label>
              </div>

              {/* REGISTER BUTTON */}
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
                    Creating Account...
                  </>
                ) : (
                  "🚀 Create Account"
                )}
              </button>
            </form>

            {/* LOGIN */}
            <div className="text-center mt-4">
              <span className="text-muted">
                Already have an account?{" "}
              </span>

              <button
                className="btn btn-link fw-bold text-decoration-none"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>

            <div className="text-center mt-3">
              <small className="text-muted">
                🔐 Your account information is
                securely protected.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}