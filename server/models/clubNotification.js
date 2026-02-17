// server/models/clubNotification.js
const mongoose = require("mongoose");

const clubNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["club_post_submitted", "club_post_approved", "club_post_rejected"],
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClubPost",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 255,
    },
    link: {
      type: String,
      maxlength: 500,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClubNotification", clubNotificationSchema);
