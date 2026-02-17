// server/routes/clubNotificationRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const clubNotificationService = require("../services/clubNotificationService");

router.use(protect);

router.get("/my-notifications", async (req, res) => {
  try {
    const notifications = await clubNotificationService.getUserNotifications(
      req.user._id,
      { deleted: false }
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch club notifications" });
  }
});

router.get("/unread-count", async (req, res) => {
  try {
    const count = await clubNotificationService.getUnreadCount(req.user._id, {
      deleted: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    await clubNotificationService.markAsRead(req.user._id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: "Failed to mark as read" });
  }
});

module.exports = router;
