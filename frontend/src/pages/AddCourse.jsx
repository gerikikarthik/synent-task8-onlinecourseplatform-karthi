import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddCourse() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");

  const [image, setImage] = useState("");

  const [category, setCategory] = useState("Development");
  const [instructor, setInstructor] = useState("CourseHub");
  const [duration, setDuration] = useState("");

  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [notesUrl, setNotesUrl] = useState("");

  const [whatYouLearn, setWhatYouLearn] = useState("");

  const [courseContent, setCourseContent] = useState("");

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const finalPrice =
        price - (price * discount) / 100;

      await axios.post(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/courses",
        {
          title,
          description,
          price,
          discount,
          finalPrice,
          image,
          category,
          instructor,
          duration,
          previewVideoUrl,
          videoUrl,
          notesUrl,
          whatYouLearn: whatYouLearn
            .split(",")
            .map((item) => item.trim()),
          courseContent: courseContent
            .split(",")
            .map((item) => item.trim()),
        }
      );

      alert("✅ Course Added Successfully");

      navigate("/admin");

    } catch (err) {ok


      console.log(err);

      alert(
        err.response?.data?.message ||
        "Failed to Add Course"
      );

    } finally {

      setLoading(false);

    }

  };
  return (

    <div className="container py-5">

      <div className="card shadow-lg p-4">

        <h2 className="text-center mb-4">
          ➕ Add New Course
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Course Title */}

          <div className="mb-3">

            <label className="form-label">
              Course Title
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

          </div>

          {/* Description */}

          <div className="mb-3">

            <label className="form-label">
              Description
            </label>

            <textarea
              className="form-control"
              rows="4"
              placeholder="Enter Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

          </div>

          {/* Price */}

          <div className="mb-3">

            <label className="form-label">
              Price (₹)
            </label>

            <input
              type="number"
              className="form-control"
              placeholder="Enter Course Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

          </div>

          {/* Discount */}

          <div className="mb-3">

            <label className="form-label">
              Discount
            </label>

            <select
              className="form-select"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            >

              <option value="0">
                No Discount
              </option>

              <option value="25">
                25% OFF
              </option>

              <option value="50">
                50% OFF
              </option>

              <option value="75">
                75% OFF
              </option>

            </select>

          </div>
          {/* Image URL */}

          <div className="mb-3">

            <label className="form-label">
              Course Image URL
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />

          </div>

          {/* Category */}

          <div className="mb-3">

            <label className="form-label">
              Category
            </label>

            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >

              <option>Development</option>
              <option>Web Development</option>
              <option>App Development</option>
              <option>AI & Machine Learning</option>
              <option>Data Science</option>
              <option>Cyber Security</option>
              <option>Cloud Computing</option>
              <option>UI/UX Design</option>

            </select>

          </div>

          {/* Instructor */}

          <div className="mb-3">

            <label className="form-label">
              Instructor
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Instructor Name"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
            />

          </div>

          {/* Duration */}

          <div className="mb-3">

            <label className="form-label">
              Course Duration
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Example: 12 Hours"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

          </div>

          {/* Free Preview Video */}

          <div className="mb-3">

            <label className="form-label">
              Free Preview Video URL
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="https://youtube.com/..."
              value={previewVideoUrl}
              onChange={(e) =>
                setPreviewVideoUrl(e.target.value)
              }
            />

          </div>
          {/* Premium Video URL */}

          <div className="mb-3">

            <label className="form-label">
              Premium Course Video URL
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="https://youtube.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />

          </div>

          {/* Notes PDF URL */}

          <div className="mb-3">

            <label className="form-label">
              Notes PDF URL
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="https://example.com/notes.pdf"
              value={notesUrl}
              onChange={(e) => setNotesUrl(e.target.value)}
            />

          </div>

          {/* What You'll Learn */}

          <div className="mb-3">

            <label className="form-label">
              What You'll Learn
            </label>

            <textarea
              className="form-control"
              rows="4"
              placeholder="HTML, CSS, JavaScript, React, Node.js"
              value={whatYouLearn}
              onChange={(e) =>
                setWhatYouLearn(e.target.value)
              }
            />

            <small className="text-muted">
              Separate each topic using commas (,)
            </small>

          </div>

          {/* Course Content */}

          <div className="mb-3">

            <label className="form-label">
              Course Content
            </label>

            <textarea
              className="form-control"
              rows="5"
              placeholder="Introduction, HTML Basics, CSS Basics, JavaScript, React..."
              value={courseContent}
              onChange={(e) =>
                setCourseContent(e.target.value)
              }
            />

            <small className="text-muted">
              Separate each module using commas (,)
            </small>

          </div>
          <div className="d-grid mt-4">

            <button
              type="submit"
              className="btn btn-success btn-lg"
              disabled={loading}
            >
              {loading
                ? "Adding Course..."
                : "➕ Add Course"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default AddCourse;