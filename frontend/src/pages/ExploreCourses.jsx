import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function ExploreCourses() {

    const { category } = useParams();

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchCourses();

    }, [category]);

    const fetchCourses = async () => {

        try {

            const res = await axios.get(
                "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses"
            );

            const filtered = res.data.filter(
                (course) => course.category === category
            );

            setCourses(filtered);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };
    if (loading) {

        return (
            <div className="container text-center mt-5">
                <h2>Loading Courses...</h2>
            </div>
        );

    }

    return (

        <div className="container py-5">

            <h2 className="text-center mb-5 fw-bold">

                {category}

            </h2>

            <div className="row">

                {courses.length === 0 && (

                    <h4 className="text-center">

                        No Courses Found

                    </h4>

                )}
                {courses.map((course) => (

                    <div
                        className="col-lg-4 mb-4"
                        key={course._id}
                    >

                        <div className="card shadow h-100">

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

                                <h4>

                                    {course.title}

                                </h4>

                                <p className="text-muted">

                                    {course.description}

                                </p>

                                <p>

                                    ⭐ {course.rating || 0}

                                </p>

                                <p>

                                    👨‍🎓 {course.students || 0}

                                </p>
                                <h4 className="text-success">

                                    ₹{course.price}

                                </h4>

                                <Link
                                    to={`/course/${course._id}`}
                                >

                                    <button
                                        className="btn btn-primary w-100"
                                    >

                                        Explore Course

                                    </button>

                                </Link>

                            </div>

                        </div>

                    </div>

                ))}
            </div>

        </div>

    );

}