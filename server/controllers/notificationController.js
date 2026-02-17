const Notification = require("../models/Notification");

// GET all notifications (auto-delete expired)
exports.getNotifications = async (req, res) => {
  try {
    const { courseId } = req.query;
    
    // Delete expired notifications
    await Notification.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    // Build query
    const query = { isActive: true };
    if (courseId) {
      query.courseId = courseId;
    }

    const notifications = await Notification.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// CREATE a new notification (faculty only)
exports.createNotification = async (req, res) => {
  try {
    const { title, message, courseId, courseName, priority, expiresAt, postedBy, postedByName } = req.body;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    // Get user from request (set by auth middleware) or from body
    const userId = req.user?._id || postedBy || null;
    const userName = req.user?.name || postedByName || "Faculty";

    // Validate user role if available
    if (req.user && req.user.role !== 'faculty' && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only faculty can create notifications" });
    }

    const notification = await Notification.create({
      title,
      message,
      courseId: courseId || null,
      courseName: courseName || null,
      postedBy: userId,
      postedByName: userName,
      priority: priority || 'medium',
      expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ message: "Failed to create notification", error: error.message });
  }
};

// DELETE a notification (faculty only)
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Check if user is the creator or admin
    if (req.user && notification.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You can only delete your own notifications" });
    }

    await Notification.findByIdAndDelete(id);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

// UPDATE a notification (faculty only)
exports.updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, courseId, courseName, priority, expiresAt, isActive } = req.body;
    
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Check if user is the creator
    if (req.user && notification.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own notifications" });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      {
        title: title || notification.title,
        message: message || notification.message,
        courseId: courseId !== undefined ? courseId : notification.courseId,
        courseName: courseName !== undefined ? courseName : notification.courseName,
        priority: priority || notification.priority,
        expiresAt: expiresAt || notification.expiresAt,
        isActive: isActive !== undefined ? isActive : notification.isActive,
      },
      { new: true }
    );

    res.json(updatedNotification);
  } catch (error) {
    console.error("Update notification error:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};
