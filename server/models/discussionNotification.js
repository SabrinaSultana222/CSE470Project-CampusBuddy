const mongoose = require('mongoose');

const discussionNotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['post', 'comment'],
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscussionPost',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 255
  },
  link: {
    type: String,
    maxlength: 500
  },
  isRead: {
    type: Boolean,
    default: false
  },
  deleted: { // ✅ ADD THIS LINE ONLY
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DiscussionNotification', discussionNotificationSchema);
