const express = require("express");
const router = express.Router();
const User = require("../controllers/userController.js");
const auth = require("../middlewares/auth.js");

router.post("/signin", User.signin);
router.post("/user-signup", User.signup);

module.exports = router;
