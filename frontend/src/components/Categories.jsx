import { useNavigate } from "react-router-dom";

export default function Categories() {

  const navigate = useNavigate();

  const categories = [

    {
      title: "Web Development",
      icon: "💻",
      color: "#0d6efd",
      courses: "120+ Courses",
    },

    {
      title: "AI & Machine Learning",
      icon: "🤖",
      color: "#6610f2",
      courses: "80+ Courses",
    },

    {
      title: "App Development",
      icon: "📱",
      color: "#198754",
      courses: "70+ Courses",
    },

    {
      title: "Data Science",
      icon: "📊",
      color: "#fd7e14",
      courses: "60+ Courses",
    },

    {
      title: "Cyber Security",
      icon: "🔒",
      color: "#dc3545",
      courses: "55+ Courses",
    },

    {
      title: "Cloud Computing",
      icon: "☁️",
      color: "#20c997",
      courses: "45+ Courses",
    },

  ];

  return (

    <section
      className="py-5"
      style={{
        background: "#ffffff",
      }}
    >

      <div className="container">

        <div className="text-center mb-5">

          <span className="badge bg-primary fs-6 px-3 py-2">
            📂 EXPLORE CATEGORIES
          </span>

          <h2
            className="fw-bold mt-3"
            style={{
              fontSize: "42px",
            }}
          >
            Learn By Category
          </h2>

          <p
            className="text-muted"
            style={{
              maxWidth: "650px",
              margin: "auto",
            }}
          >
            Choose your favourite technology and start
            building your career with industry-ready
            courses.
          </p>

        </div>

        <div className="row">

          {categories.map((category, index) => (

            <div
              className="col-lg-4 col-md-6 mb-4"
              key={index}
            >

              <div
                className="card border-0 shadow h-100 text-center"
                style={{
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onClick={() => navigate("/courses")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0px)";
                }}
              >

                <div className="card-body p-4">

                  <div
                    style={{
                      fontSize: "60px",
                    }}
                  >
                    {category.icon}
                  </div>

                  <h4
                    className="fw-bold mt-3"
                    style={{
                      color: category.color,
                    }}
                  >
                    {category.title}
                  </h4>

                  <p className="text-muted">
                    {category.courses}
                  </p>

                  <button
                    className="btn btn-outline-primary"
                  >
                    Explore
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}