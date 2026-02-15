const express = require("express");
const router = express.Router();
const adminUser = require("../controllers/adminUserController.js");
const auth = require("../middlewares/auth.js");

router.post("/admin/signin", adminUser.signin);

module.exports = router;
