import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import FeaturedCourses from "../components/FeaturedCourses";
import Categories from "../components/Categories";
import Features from "../components/Features";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import Stats from "../components/Stats";
import Companies from "../components/Companies";
import Newsletter from "../components/Newsletter";
import TrendingCourses from "../components/TrendingCourses";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const [showNewsletterPopup, setShowNewsletterPopup] =
    useState(false);

  const [email, setEmail] = useState("");

  const [newsletterMessage, setNewsletterMessage] =
    useState("");

  const [newsletterLoading, setNewsletterLoading] =
    useState(false);

  // ==========================
  // SHOW NEWSLETTER POPUP
  // ==========================

  useEffect(() => {
    const dismissedUntil =
      localStorage.getItem(
        "newsletterPopupDismissed"
      );

    const currentTime = new Date().getTime();

    if (
      !dismissedUntil ||
      currentTime > Number(dismissedUntil)
    ) {
      const timer = setTimeout(() => {
        setShowNewsletterPopup(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  // ==========================
  // MAYBE LATER
  // ==========================

  const handleMaybeLater = () => {
    const sevenDays =
      7 * 24 * 60 * 60 * 1000;

    const dismissedUntil =
      new Date().getTime() + sevenDays;

    localStorage.setItem(
      "newsletterPopupDismissed",
      dismissedUntil.toString()
    );

    setShowNewsletterPopup(false);
  };

  // ==========================
  // SUBSCRIBE
  // ==========================

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setNewsletterMessage(
        "Please enter your email."
      );
      return;
    }

    try {
      setNewsletterLoading(true);
      setNewsletterMessage("");

      const response = await fetch(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/newsletter/subscribe",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Something went wrong."
        );
      }

      setNewsletterMessage(
        `🎉 ${data.message}`
      );

      setEmail("");

      // Close popup after successful subscription
      setTimeout(() => {
        setShowNewsletterPopup(false);
      }, 1500);

    } catch (error) {
      setNewsletterMessage(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >

      {/* ========================== */}
      {/* MAIN HOME PAGE */}
      {/* ========================== */}

      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Categories />

      <TrendingCourses />

      <FeaturedCourses
        searchQuery={searchQuery}
      />

      <Features />

      <Companies />

      <FAQ />

      <Stats />

      <Newsletter />

      <Footer />

      {/* ========================== */}
      {/* NEWSLETTER POPUP */}
      {/* ========================== */}

      {showNewsletterPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0, 0, 0, 0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "430px",
              background: "white",
              borderRadius: "24px",
              padding: "35px 30px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.25)",
              textAlign: "center",
              position: "relative",
            }}
          >

            {/* CLOSE BUTTON */}

            <button
              onClick={handleMaybeLater}
              style={{
                position: "absolute",
                top: "12px",
                right: "15px",
                border: "none",
                background: "transparent",
                fontSize: "24px",
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              ×
            </button>

            {/* ICON */}

            <div
              style={{
                fontSize: "50px",
                marginBottom: "10px",
              }}
            >
              📩
            </div>

            {/* TITLE */}

            <h2
              style={{
                fontWeight: "800",
                color: "#1e293b",
                marginBottom: "12px",
              }}
            >
              Stay Updated!
            </h2>

            {/* DESCRIPTION */}

            <p
              style={{
                color: "#64748b",
                lineHeight: "1.6",
                marginBottom: "25px",
              }}
            >
              Get new course updates,
              special offers, AI roadmaps
              and career tips directly
              to your inbox.
            </p>

            {/* FORM */}

            <form
              onSubmit={handleSubscribe}
            >

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "12px",
                  outline: "none",
                  fontSize: "16px",
                  marginBottom: "12px",
                }}
              />

              <button
                type="submit"
                disabled={newsletterLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg,#2563eb,#7c3aed)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: newsletterLoading
                    ? "not-allowed"
                    : "pointer",
                  opacity:
                    newsletterLoading
                      ? 0.7
                      : 1,
                }}
              >
                {newsletterLoading
                  ? "Subscribing..."
                  : "Subscribe"}
              </button>

            </form>

            {/* MESSAGE */}

            {newsletterMessage && (
              <p
                style={{
                  marginTop: "15px",
                  marginBottom: 0,
                  fontWeight: "600",
                  color:
                    newsletterMessage.includes(
                      "🎉"
                    )
                      ? "#16a34a"
                      : "#dc2626",
                }}
              >
                {newsletterMessage}
              </p>
            )}

            {/* MAYBE LATER */}

            <button
              onClick={handleMaybeLater}
              style={{
                marginTop: "18px",
                border: "none",
                background: "transparent",
                color: "#64748b",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Maybe Later
            </button>

          </div>

        </div>
      )}

    </div>
  );
}