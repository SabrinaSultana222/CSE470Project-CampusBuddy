const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
