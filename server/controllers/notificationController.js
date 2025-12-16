const Notification = require("../models/Notification");

// GET all notifications (auto-delete expired)
exports.getNotifications = async (req, res) => {
  try {
    // delete expired notifications
    await Notification.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    const notifications = await Notification.find().sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// CREATE a new notification
exports.createNotification = async (req, res) => {
  try {
    const { text, expiresAt } = req.body;

    if (!text || !expiresAt) {
      return res
        .status(400)
        .json({ message: "Text and expiry date are required" });
    }

    const notification = await Notification.create({
      text,
      expiresAt,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to create notification" });
  }
};
