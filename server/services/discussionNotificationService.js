const DiscussionNotification = require('../models/DiscussionNotification'); // Mongoose
const WebSocketServer = require('../websocketServer');

let wsServer;

const initWebSocket = (server) => {
  wsServer = server;
};

const createAndEmitNotifications = async (
  type,
  postId,
  senderId,
  recipientIds,
  message,
  link = ''
) => {
  // 1️⃣ Deduplicate + exclude sender
  const uniqueRecipients = [...new Set(recipientIds.map(id => id.toString()))]
    .filter(id => id !== senderId.toString());

  // 2️⃣ Create + send ONE notification per user
  for (const recipientId of uniqueRecipients) {
    const notification = await DiscussionNotification.create({
      type,
      postId,
      senderId,
      recipientId,
      message,
      link
    });

    const payload = {
      type: 'discussion_notification',
      data: {
        id: notification._id,
        type: notification.type,
        postId: notification.postId,
        senderId: notification.senderId,
        recipientId: notification.recipientId,
        message: notification.message,
        link: notification.link,
        isRead: notification.isRead,
        createdAt: notification.createdAt
      }
    };

    // 🔥 SEND ONLY TO THIS USER
    await wsServer.sendToUser(recipientId, payload);
  }
};

const markAsRead = async (userId, notificationId) => {
  // ✅ FIXED: Also exclude deleted notifications
  return await DiscussionNotification.findOneAndUpdate(
    { 
      _id: notificationId, 
      recipientId: userId,
      deleted: false  // ✅ Only mark non-deleted as read
    },
    { isRead: true },
    { new: true }
  );
};

const getUserNotifications = async (userId, filter = {}) => {
  // ✅ FIXED: Default filter excludes deleted notifications
  const defaultFilter = { 
    recipientId: userId, 
    deleted: false 
  };
  const finalFilter = { ...defaultFilter, ...filter };
  
  return await DiscussionNotification.find(finalFilter)
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('senderId', 'name')
    .populate('postId', 'title'); // ✅ Bonus: populate post title
};

const getUnreadCount = async (userId, filter = {}) => {
  // ✅ FIXED: Default filter excludes deleted notifications
  const defaultFilter = { 
    recipientId: userId, 
    isRead: false,
    deleted: false 
  };
  const finalFilter = { ...defaultFilter, ...filter };
  
  return await DiscussionNotification.countDocuments(finalFilter);
};

module.exports = {
  initWebSocket,
  createAndEmitNotifications,
  markAsRead,
  getUserNotifications,
  getUnreadCount
};
