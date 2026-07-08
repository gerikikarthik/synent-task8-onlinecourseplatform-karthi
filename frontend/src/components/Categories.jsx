const categories = [
  "Java",
  "Python",
  "React",
  "MERN",
  "AI",
  "Data Science",
  "Spring Boot",
  "JavaScript",
];

export default function Categories() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "15px",
        padding: "30px",
      }}
    >
      {categories.map((item) => (
        <button
          key={item}
          style={{
            padding: "12px 25px",
            borderRadius: "25px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}