// controllers/cart.controller.js
const Cart = require("../models/cartModel");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware
    const { productId, variantId, price, qty = 1 } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, variantId, quantity: qty, price }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (i) =>
          i.productId.toString() === productId &&
          i.variantId.toString() === variantId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty;
      } else {
        cart.items.push({ productId, variantId, quantity: qty, price });
      }
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate(
    "items.productId",
  );
  res.json(cart || { items: [] });
};
