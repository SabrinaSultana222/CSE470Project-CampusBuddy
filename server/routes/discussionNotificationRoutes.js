const express = require('express');
const router = express.Router();
const discussionNotificationService = require('../services/discussionNotificationService');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/my-notifications', async (req, res) => {
  try {
    const notifications = await discussionNotificationService.getUserNotifications(
      req.user._id, 
      { deleted: false } // ✅ Pass filter
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

router.get('/unread-count', async (req, res) => {
  try {
    const count = await discussionNotificationService.getUnreadCount(
      req.user._id, 
      { deleted: false } // ✅ Pass filter
    );
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch unread count' });
  }
});


router.patch('/:id/read', async (req, res) => {
  try {
    await discussionNotificationService.markAsRead(req.user._id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: 'Failed to mark as read' });
  }
});

module.exports = router;
