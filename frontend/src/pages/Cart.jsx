import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart();
  }, []);

  // ===========================
  // FETCH CART
  // ===========================

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(res.data.cart);
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Unable to fetch cart."
      );
    }
  };

  // ===========================
  // REMOVE FROM CART
  // ===========================
  const removeFromCart = async (id) => {
    try {
      await axios.delete(
        `https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/cart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Course Removed Successfully");

      fetchCart();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Unable to remove course."
      );
    }
  };

  // ===========================
  // BUY PREMIUM
  // ===========================

  const handleBuyNow = async () => {
    try {
      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      await axios.post(
        "https://synent-task8-onlinecourseplatform-karthi.onrender.com/api/enroll",
        {
          courseId: cart[0].course._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("🎉 Payment Successful!\nCourse Enrolled Successfully.");

      navigate("/mycourses");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Enrollment Failed."
      );
    }
  };

  // ===========================
  // TOTAL PRICE
  // ===========================

  const total = cart.reduce((sum, item) => {
    return sum + (item.course?.price || 0);
  }, 0);

  // ===========================
  // UI
  // ===========================

  return (
<div
  className="container py-5"
  style={{ minHeight: "100vh" }}
>
  <h2
    className="text-center mb-5"
    style={{
      fontWeight: "bold",
      color: "#0d6efd",
    }}
  >
    🛒 My Cart
  </h2>

  {cart.length === 0 ? (
    <div className="alert alert-warning text-center">
      <h4>Your Cart is Empty</h4>
      <p>Add a course to continue learning.</p>

      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/courses")}
      >
        Browse Courses
      </button>
    </div>
  ) : (
    <>
      {cart.map((item) => (
        <div
          key={item._id}
          className="card shadow-lg mb-4 border-0"
          style={{
            borderRadius: "18px",
          }}
        >
          <div className="row g-0">

            <div className="col-md-3">
              <img
                src={item.course?.image}
                alt={item.course?.title}
                className="img-fluid h-100"
                style={{
                  objectFit: "cover",
                  borderTopLeftRadius: "18px",
                  borderBottomLeftRadius: "18px",
                }}
              />
            </div>

            <div className="col-md-9">
              <div className="card-body">

                <h3
                  style={{
                    color: "#0d6efd",
                    fontWeight: "bold",
                  }}
                >
                  {item.course?.title}
                </h3>

                <p>{item.course?.description}</p>

                <h5 className="text-success">
                  ₹{item.course?.price}
                </h5>

                <button
                  className="btn btn-danger mt-2"
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                >
                  🗑 Remove
                </button>

              </div>
            </div>

          </div>
        </div>
      ))}

      <div
        className="card shadow-lg p-4 border-0"
        style={{
          borderRadius: "20px",
        }}
      >
        <h2 className="mb-3">
          Total : ₹{total}
        </h2>

        <p
          className="text-muted"
          style={{ fontSize: "17px" }}
        >
          Premium Certificate Fee
        </p>

        <button
          className="btn btn-success btn-lg mt-3"
          onClick={handleBuyNow}
        >
          💳 Buy Premium (₹99)
        </button>
      </div>
    </>
  )}
    </div>
  );
}