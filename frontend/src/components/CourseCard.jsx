export default function CourseCard({ course }) {
  return (
    <div
      className="card shadow border-0 h-100"
      style={{
        borderRadius: "15px",
        overflow: "hidden",
        transition: "0.3s",
      }}
    >
      <img
        src={
          course.image
            ? course.image
            : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
        }
        alt={course.title}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
        }}
      />

      <div className="card-body">

        <span className="badge bg-primary mb-2">
          {course.category || "Development"}
        </span>

        <h3
          style={{
            color: "#222",
            fontWeight: "700",
          }}
        >
          {course.title}
        </h3>

        <p style={{ color: "#666" }}>
          {course.description}
        </p>

        <p style={{ color: "#f39c12", fontSize: "18px" }}>
          ⭐⭐⭐⭐⭐ {course.rating || 4.5}
        </p>

        <h3 style={{ color: "green" }}>
          ₹{course.price}
        </h3>

        <button className="btn btn-primary w-100 mt-3">
          View Details
        </button>

      </div>
    </div>
  );
}