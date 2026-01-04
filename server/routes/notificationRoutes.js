const express = require("express");
const router = express.Router();

const {
  getNotifications,
  createNotification,
  deleteNotification,
  updateNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// GET all notifications (public for now, can add protect middleware)
router.get("/", getNotifications);

// CREATE a notification (faculty only - add protect middleware if needed)
router.post("/", createNotification);

// DELETE a notification (faculty only)
router.delete("/:id", deleteNotification);

// UPDATE a notification (faculty only)
router.put("/:id", updateNotification);

module.exports = router;
