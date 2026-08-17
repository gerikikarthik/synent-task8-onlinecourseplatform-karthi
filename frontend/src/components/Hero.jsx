import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Hero({ searchQuery, setSearchQuery }) {
  const [courses, setCourses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    const filtered = courses
      .filter((course) => {
        const title = course.title?.toLowerCase() || "";
        const description = course.description?.toLowerCase() || "";
        const category = course.category?.toLowerCase() || "";
        const instructor = course.instructor?.toLowerCase() || "";
        const language = course.language?.toLowerCase() || "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          instructor.includes(query) ||
          language.includes(query)
        );
      })
      .slice(0, 6);

    setSuggestions(filtered);
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses"
      );

      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Error fetching courses:", error);
    }
  };

  const handleCourseSelect = (course) => {
    setSearchQuery(course.title);

    window.location.href = `/courses/${course._id}`;
  };

  return (
    <section className="bg-primary text-white text-center py-5">
      <div className="container">
        <h1 className="display-4 fw-bold">
          Learn New Skills Anytime, Anywhere
        </h1>

        <p className="lead mt-3">
          1000+ Professional Courses | Expert Instructors
        </p>

        <div
          className="mt-4 position-relative mx-auto"
          style={{
            width: "50%",
          }}
        >
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search Courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {suggestions.length > 0 && (
            <div
              className="position-absolute bg-white text-dark shadow-lg rounded"
              style={{
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                marginTop: "5px",
                overflow: "hidden",
                textAlign: "left",
              }}
            >
              {suggestions.map((course) => (
                <div
                  key={course._id}
                  className="p-3 border-bottom"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleCourseSelect(course)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  <div className="fw-bold">
                    {course.title}
                  </div>

                  <small className="text-muted">
                    {course.category || "Course"}
                  </small>
                </div>
              ))}
            </div>
          )}

          {searchQuery.trim() && suggestions.length === 0 && (
            <div
              className="position-absolute bg-white text-dark shadow-lg rounded p-3"
              style={{
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                marginTop: "5px",
                textAlign: "left",
              }}
            >
              No related courses found.
            </div>
          )}
        </div>

        <button
          className="btn btn-warning btn-lg mt-4"
          onClick={() => {
            const coursesSection = document.getElementById(
              "featured-courses"
            );

            if (coursesSection) {
              coursesSection.scrollIntoView({
                behavior: "smooth",
              });
            }
          }}
        >
          Explore Courses
        </button>
      </div>
    </section>
  );
}