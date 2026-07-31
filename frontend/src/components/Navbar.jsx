import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // localStorage nundi user details read chestundi
  const user = JSON.parse(localStorage.getItem("user"));

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedCourse");

    alert("Logout Successful");

    navigate("/");

    // Navbar refresh avvadaniki
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">

        <Link className="navbar-brand fw-bold fs-3" to="/">
          🎓 CourseHub
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* Home Always */}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* Login/Register only when NOT logged in */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* After Login */}
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/courses">
                    Courses
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/my-courses">
                    My Courses
                  </Link>
                </li>
<li className="nav-item">
  <Link className="nav-link" to="/cart">
    🛒 Cart
  </Link>
</li>

                <li className="nav-item">
                  <Link className="nav-link" to="/ai-roadmap">
                    🤖 AI Roadmap
                  </Link>
                </li>

                {/* Admin only */}
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      Admin
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    className="btn btn-danger ms-2"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>

      </div>
    </nav>
  );
}