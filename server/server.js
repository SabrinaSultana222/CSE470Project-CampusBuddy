const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// WebSocket imports
const WebSocketServer = require("./websocketServer");
const discussionNotificationService = require("./services/discussionNotificationService");
const clubNotificationService = require("./services/clubNotificationService");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const clubPostRoutes = require("./routes/clubPostRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const assignmentsRoutes = require("./routes/assignments");
const gpaRoutes = require("./routes/gpa");
const lostFoundRoutes = require("./routes/lostfound");
const commentsRoutes = require("./routes/comments");
const profileRoutes = require("./routes/profile");
const usersRoutes = require("./routes/users");

dotenv.config();

const app = express();

// connect DB
connectDB();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/club-posts", clubPostRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/gpa", gpaRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", usersRoutes);
app.use("/api", discussionRoutes);

// DISCUSSION NOTIFICATION ROUTES
const discussionNotificationRoutes = require("./routes/discussionNotificationRoutes");
app.use("/api/discussion-notifications", discussionNotificationRoutes);

// ✅ CLUB NOTIFICATION ROUTES (NEW)
const clubNotificationRoutes = require("./routes/clubNotificationRoutes");
app.use("/api/club-notifications", clubNotificationRoutes);

app.get("/", (req, res) => {
  res.send("Campus Buddy API running");
});

const PORT = process.env.PORT || 5001;

// START WEBSOCKET
const wsServer = new WebSocketServer(5002);
wsServer.start();

// init websocket in services
discussionNotificationService.initWebSocket(wsServer);
clubNotificationService.initWebSocket(wsServer);

console.log("✅ WebSocket server started on port 5002");

// START HTTP SERVER
app.listen(PORT, () => {
  console.log(`🚀 HTTP Server running on port ${PORT}`);
  console.log(`🌐 WebSocket Server running on port 5002`);
});
