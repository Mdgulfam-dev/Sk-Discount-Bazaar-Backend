// routes/cart.routes.js
const router = require("express").Router();
const { addToCart, getCart } = require("../controllers/cartController");
const auth = require("../middlewares/auth");

router.post("/add", auth, addToCart);
router.get("/", auth, getCart);

module.exports = router;
