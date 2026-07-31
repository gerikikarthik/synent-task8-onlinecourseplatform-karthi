export default function Newsletter() {

  return (

    <section
      className="py-5"
      style={{
        background:
          "linear-gradient(135deg,#2563eb,#7c3aed)",
        color: "white",
      }}
    >

      <div className="container text-center">

        <h2
          className="fw-bold mb-3"
        >
          📩 Subscribe To Our Newsletter
        </h2>

        <p
          className="mb-4"
        >
          Get AI Roadmaps, New Courses,
          Discounts and Career Tips directly
          to your inbox.
        </p>

        <div
          className="row justify-content-center"
        >

          <div className="col-lg-6">

            <div
              className="input-group input-group-lg"
            >

              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
              />

              <button
                className="btn btn-warning fw-bold"
              >
                Subscribe
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}