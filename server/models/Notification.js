const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      trim: true,
    },
    courseName: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Made optional since we may not always have user context
    },
    postedByName: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ postedBy: 1 });
notificationSchema.index({ courseId: 1 });
notificationSchema.index({ isActive: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
