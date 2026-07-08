export default function Features() {
  return (
    <section style={{ padding: "60px 20px", background: "#fff" }}>
      <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
        Why Choose Us?
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h3>📚 1000+ Courses</h3>
          <p>Learn from top instructors.</p>
        </div>

        <div>
          <h3>👨‍🏫 Expert Teachers</h3>
          <p>Industry experienced mentors.</p>
        </div>

        <div>
          <h3>🎓 Lifetime Access</h3>
          <p>Access your courses forever.</p>
        </div>

        <div>
          <h3>📱 Learn Anywhere</h3>
          <p>Mobile & Desktop friendly.</p>
        </div>
      </div>
    </section>
  );
}