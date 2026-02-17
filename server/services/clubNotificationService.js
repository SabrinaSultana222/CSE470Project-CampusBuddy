// server/services/clubNotificationService.js
const ClubNotification = require("../models/clubNotification");

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
  link = ""
) => {
  // Deduplicate + exclude sender
  const uniqueRecipients = [...new Set(recipientIds.map((id) => id.toString()))]
    .filter((id) => id !== senderId.toString());

  for (const recipientId of uniqueRecipients) {
    const notification = await ClubNotification.create({
      type,
      postId,
      senderId,
      recipientId,
      message,
      link,
    });

    const payload = {
      type: "club_notification",
      data: {
        id: notification._id,
        type: notification.type,
        postId: notification.postId,
        senderId: notification.senderId,
        recipientId: notification.recipientId,
        message: notification.message,
        link: notification.link,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      },
    };

    // Send only to this user
    if (wsServer) {
      await wsServer.sendToUser(recipientId, payload);
    }
  }
};

const markAsRead = async (userId, notificationId) => {
  return await ClubNotification.findOneAndUpdate(
    { _id: notificationId, recipientId: userId, deleted: false },
    { isRead: true },
    { new: true }
  );
};

const getUserNotifications = async (userId, filter = {}) => {
  const defaultFilter = { recipientId: userId, deleted: false };
  const finalFilter = { ...defaultFilter, ...filter };

  return await ClubNotification.find(finalFilter)
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("senderId", "name")
    .populate("postId", "title clubName status");
};

const getUnreadCount = async (userId, filter = {}) => {
  const defaultFilter = { recipientId: userId, isRead: false, deleted: false };
  const finalFilter = { ...defaultFilter, ...filter };

  return await ClubNotification.countDocuments(finalFilter);
};

module.exports = {
  initWebSocket,
  createAndEmitNotifications,
  markAsRead,
  getUserNotifications,
  getUnreadCount,
};
