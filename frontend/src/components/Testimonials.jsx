export default function Testimonials() {

  const reviews = [

    {
      name: "Rahul Kumar",
      role: "Frontend Developer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      review:
        "This platform completely changed my learning experience. The AI Roadmap guided me step by step.",
    },

    {
      name: "Priya Sharma",
      role: "Full Stack Developer",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      review:
        "The premium courses, quizzes and certificate helped me prepare for interviews confidently.",
    },

    {
      name: "Arjun Reddy",
      role: "Software Engineer",
      image: "https://randomuser.me/api/portraits/men/51.jpg",
      review:
        "Excellent instructors and structured learning path. Highly recommended for beginners.",
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

          <span className="badge bg-warning text-dark px-3 py-2 fs-6">
            ⭐ TESTIMONIALS
          </span>

          <h2 className="fw-bold mt-3">
            What Our Students Say
          </h2>

          <p
            className="text-muted"
            style={{
              maxWidth: "650px",
              margin: "auto",
            }}
          >
            Thousands of learners have transformed their careers with our
            courses.
          </p>

        </div>

        <div className="row">

          {reviews.map((review, index) => (

            <div
              className="col-lg-4 col-md-6 mb-4"
              key={index}
            >

              <div
                className="card border-0 shadow h-100"
                style={{
                  borderRadius: "20px",
                }}
              >

                <div className="card-body text-center p-4">

                  <img
                    src={review.image}
                    alt={review.name}
                    className="rounded-circle mb-3"
                    width="90"
                    height="90"
                  />

                  <h5 className="fw-bold">
                    {review.name}
                  </h5>

                  <p className="text-primary">
                    {review.role}
                  </p>

                  <p className="text-muted">
                    "{review.review}"
                  </p>

                  <h5 className="text-warning">
                    ⭐⭐⭐⭐⭐
                  </h5>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}