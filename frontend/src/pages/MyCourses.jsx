import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyCourses();
  }, []);

 const getMyCourses = async () => {
  const token = localStorage.getItem("token");
  console.log("TOKEN =", token);

  try {
    const res = await axios.get(
      "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/auth/mycourses",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCourses(res.data);

  } catch (err) {
    console.log(err.response);
    alert(JSON.stringify(err.response?.data));
  }
};

  return (
    <div className="container py-5">
      <h2 className="mb-4">🎓 My Courses</h2>

      <div className="row">
        {courses.length === 0 ? (
          <h4>No Enrolled Courses</h4>
        ) : (
          courses.map((course) => (
            <div className="col-md-4 mb-4" key={course._id}>
              <div className="card shadow h-100">

                <img
                  src={course.image}
                  className="card-img-top"
                  alt={course.title}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">

                  <h5>{course.title}</h5>

                  <p>{course.description}</p>

                  <p>
                    <strong>Instructor:</strong>{" "}
                    {course.instructor}
                  </p>

                  <p>
                    ⭐ {course.rating}
                  </p>

   <button
  className="btn btn-success w-100"
  onClick={() => navigate(`/learn/${course._id}`)}
>
  ▶ Continue Learning
</button>

                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}