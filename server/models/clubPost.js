// server/models/clubPost.js
const mongoose = require("mongoose");

const clubPostSchema = new mongoose.Schema(
  {
    // Which user (student + club admin) created this post
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Club name text for now; later you can link to a Club model
    clubName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Title of the event/announcement
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    // Detailed description
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Optional event-style fields
    eventDate: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    // Type of post
    category: {
      type: String,
      enum: ["event", "announcement"],
      default: "event",
    },

    // Moderation status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Add indexes for better search performance
clubPostSchema.index({ title: 'text', description: 'text', clubName: 'text', location: 'text' });
clubPostSchema.index({ status: 1, createdAt: -1 });
clubPostSchema.index({ category: 1, status: 1 });
clubPostSchema.index({ clubName: 1, status: 1 });
clubPostSchema.index({ eventDate: -1 });

const ClubPost = mongoose.model("ClubPost", clubPostSchema);

module.exports = ClubPost;
