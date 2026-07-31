import { useEffect, useState } from "react";
import axios from "axios";

export default function Cart() {
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(res.data.cart);
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/cart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course Removed Successfully");
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const total = cart.reduce((sum, item) => {
    return sum + (item.course?.price || 0);
  }, 0);

  return (
    <div className="container py-5">
      <h2 className="mb-4">🛒 My Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-warning">
          Your cart is empty.
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item._id}
              className="card mb-3 shadow-sm"
            >
              <div className="row g-0">
                <div className="col-md-3">
                  <img
                    src={item.course?.image}
                    alt={item.course?.title}
                    className="img-fluid h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className="col-md-9">
                  <div className="card-body">
                    <h4>{item.course?.title}</h4>

                    <p>{item.course?.description}</p>

                    <h5 className="text-success">
                      ₹{item.course?.price}
                    </h5>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        removeFromCart(item._id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="card shadow p-4">
            <h3>Total : ₹{total}</h3>

            <button className="btn btn-success">
              💳 Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}