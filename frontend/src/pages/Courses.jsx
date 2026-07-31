import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Courses() {

  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {

    try {

      const res = await axios.get(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses"
      );

      setCourses(res.data);

    } catch (err) {

      console.error(err);

      alert("Failed to load courses");

    }

  };

  return (

    <div className="container py-5">

      <h1 className="text-center mb-5">
        📚 Explore Courses
      </h1>

      <div className="row">

        {courses.map((course) => {

          const finalPrice =
            course.discount > 0
              ? course.price -
                (course.price * course.discount) / 100
              : course.price;

          return (

            <div
              className="col-md-4 mb-4"
              key={course._id}
            >

              <div
                className="card shadow h-100"
                style={{
                  cursor: "pointer",
                  borderRadius: "15px",
                }}
                onClick={() =>
                  navigate(`/courses/${course._id}`)
                }
              >

                <img
                  src={course.image}
                  className="card-img-top"
                  alt={course.title}
                  style={{
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">

                  <span className="badge bg-primary mb-2">
                    {course.category}
                  </span>

                  <h4 className="card-title">
                    {course.title}
                  </h4>

                  <p className="text-muted">
                    {course.description}
                  </p>

                  <p>
                    👨‍🏫 {course.instructor}
                  </p>

                  <p>
                    ⭐ {course.rating}
                  </p>

                  {course.discount > 0 ? (

                    <>

                      <h6
                        style={{
                          textDecoration:
                            "line-through",
                          color: "#777",
                          marginBottom: "4px",
                        }}
                      >
                        ₹{course.price}
                      </h6>

                      <h3 className="text-success">
                        ₹{finalPrice}
                      </h3>

                      <span className="badge bg-danger mb-3">
                        🔥 {course.discount}% OFF
                      </span>

                    </>

                  ) : (

                    <h3 className="text-success">
                      ₹{course.price}
                    </h3>

                  )}

                  <button className="btn btn-primary w-100 mt-3">
                    View Details
                  </button>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}