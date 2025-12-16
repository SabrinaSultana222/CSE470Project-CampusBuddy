const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const clubPostRoutes = require("./routes/clubPostRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();

const app = express();

// connect DB
connectDB();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS (must be before routes)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ROUTES (ALL before listen)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/club-posts", clubPostRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

// health check
app.get("/", (req, res) => {
  res.send("Campus Buddy API running");
});

const PORT = process.env.PORT || 5000;

// start server (ALWAYS LAST)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
