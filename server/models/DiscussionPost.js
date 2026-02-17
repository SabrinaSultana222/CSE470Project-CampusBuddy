const mongoose = require("mongoose");

const discussionPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["course", "club", "general"],
      default: "general",
    },
    courseCode: { type: String, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiscussionPost", discussionPostSchema);
