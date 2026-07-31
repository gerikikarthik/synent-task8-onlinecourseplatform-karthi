const Cart = require("../models/Cart");

// Add Course to Cart
const addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;

    const existing = await Cart.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Course already added to cart",
      });
    }

    const cart = await Cart.create({
      user: req.user.id,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      message: "Course added to cart",
      cart,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get User Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.user.id,
    }).populate("course");

    res.json({
      success: true,
      cart,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Remove Course
const removeFromCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Removed from cart",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};