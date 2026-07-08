export default function Hero() {
  return (
    <section className="bg-primary text-white text-center py-5">
      <div className="container">
        <h1 className="display-4 fw-bold">
          Learn New Skills Anytime, Anywhere
        </h1>

        <p className="lead mt-3">
          1000+ Professional Courses | Expert Instructors
        </p>

        <div className="mt-4">
          <input
            type="text"
            className="form-control w-50 mx-auto"
            placeholder="Search Courses..."
          />
        </div>

        <button className="btn btn-warning btn-lg mt-4">
          Explore Courses
        </button>
      </div>
    </section>
  );
}