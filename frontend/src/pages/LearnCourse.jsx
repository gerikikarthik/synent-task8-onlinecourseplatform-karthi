import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function LearnCourse() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    const res = await axios.get(
      `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses/${id}`
    );

    setCourse(res.data);
  };

  if (!course) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <div className="container py-5">

      <h2>{course.title}</h2>

      <p>{course.description}</p>

      <div className="ratio ratio-16x9 mb-4">
        <iframe
          src={course.videoUrl}
          title="Course Video"
          allowFullScreen
        ></iframe>
      </div>

      <h4>Course Content</h4>

      <ul className="list-group">
        {course.courseContent?.map((lesson, index) => (
          <li
            key={index}
            className="list-group-item"
          >
            📖 {lesson}
          </li>
        ))}
      </ul>

    </div>
  );
}