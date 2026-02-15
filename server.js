

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // <-- add this
dotenv.config();

const connectDB = require("./config/db");
const UserRoute = require("./routes/UserRoute");
const adminUserRoute = require("./routes/adminUserRoute");
const itemRoute = require("./routes/itemRoute");
const cartRoute = require("./routes/cartRoutes")
const app = express();
const port = process.env.PORT;




// Connect to DB
connectDB();

// Body parser
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS middleware for all routes, including preflight
app.use(
  cors({
    origin: "*", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle OPTIONS requests manually for all routes to avoid 403
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use("/api", UserRoute);
app.use("/api", adminUserRoute);
app.use("/api", itemRoute);
app.use("/api/cart", cartRoute);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
