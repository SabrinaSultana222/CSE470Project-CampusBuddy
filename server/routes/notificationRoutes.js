const express = require("express");
const router = express.Router();

const {
  getNotifications,
  createNotification,
} = require("../controllers/notificationController");

// GET all notifications
router.get("/", getNotifications);

// CREATE a notification
router.post("/", createNotification);

module.exports = router;
