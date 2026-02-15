// // const express = require("express");
// // const router = express.Router();
// // const { createItem, listItems } = require("../controllers/itemController");
// // const multer = require("multer");

// // // Multer config
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, "uploads/"),
// //   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// // });
// // const upload = multer({ storage });

// // router.post("/upload", upload.single("image"), createItem);


// // router.get("/list", listItems);

// // module.exports = router;



// const express = require("express");
// const router = express.Router();
// const { createItem, listItems } = require("../controllers/itemController");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// // Ensure uploads folder exists
// const uploadDir = path.join(__dirname, "..", "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// const sanitize = require("sanitize-filename");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const safeName = sanitize(file.originalname.replace(/\s+/g, "-"));
//     cb(null, Date.now() + "-" + safeName);
//   },
// });

// // Multer config
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => cb(null, uploadDir),
// //   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// // });
// const upload = multer({ storage });

// // Routes
// router.post("/upload", upload.single("image"), createItem);
// router.put("/:id", upload.array("images", 10), updateItem);
// router.get("/list", listItems);

// module.exports = router;



const express = require("express");
const router = express.Router();
// // const { createItem, listItems, updateItem } = require("../controllers/itemController");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

const {
  createItem,
  updateItem,
  listItems,
  deleteItem,
} = require("../controllers/itemController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sanitize = require("sanitize-filename");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safeName = sanitize(file.originalname.replace(/\s+/g, "-"));
    cb(null, Date.now() + "-" + safeName);
  },
});

// OPTIONAL: add file filter
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ================= ROUTES ================= */

// ✅ CREATE PRODUCT (dynamic variants)
router.post("/upload", upload.any(), createItem);

// ✅ UPDATE PRODUCT (dynamic variants)
router.put("/:id", upload.any(), updateItem);

// ✅ LIST PRODUCTS
router.get("/list", listItems);

// routes/itemRoutes.js
router.delete("/:id", deleteItem);


module.exports = router;
