import { useState } from "react";
import axios from "axios";

const API_URL =
  "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        `${API_URL}/newsletter/subscribe`,
        { email }
      );

      setMessage(`🎉 ${response.data.message}`);
      setEmail("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-5"
      style={{
        background: "linear-gradient(135deg,#2563eb,#7c3aed)",
        color: "white",
      }}
    >
      <div className="container text-center">
        <h2 className="fw-bold mb-3">
          📩 Subscribe To Our Newsletter
        </h2>

        <p className="mb-4">
          Get AI Roadmaps, New Courses,
          Discounts and Career Tips directly
          to your inbox.
        </p>

        <div className="row justify-content-center">
          <div className="col-lg-6">
            <form
              onSubmit={handleSubscribe}
              className="input-group input-group-lg"
            >
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="btn btn-warning fw-bold"
                disabled={loading}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            {message && (
              <p className="mt-3 fw-bold">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}