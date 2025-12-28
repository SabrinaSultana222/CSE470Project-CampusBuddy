const mongoose = require("mongoose");

const discussionCommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscussionPost",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true, trim: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscussionComment",
      default: null, // null = top-level; set for replies
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiscussionComment", discussionCommentSchema);
