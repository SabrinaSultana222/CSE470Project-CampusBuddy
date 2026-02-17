const DiscussionPost = require("../models/DiscussionPost");
const DiscussionComment = require("../models/DiscussionComment");
const discussionNotificationService = require('../services/discussionNotificationService');
const User = require('../models/user');

// POST /api/discussions - PERFECTLY SIMPLE
exports.createPost = async (req, res) => {
  try {
    const { title, body, category, courseCode } = req.body;
    const post = await DiscussionPost.create({
      title,
      body,
      category,
      courseCode,
      author: req.user._id,
    });

    // 🔥 SIMPLE: ONE notification PER OTHER USER
    const sender = await User.findById(req.user._id).select('name');
    const senderName = sender ? sender.name : 'Someone';
    
    // Get ALL other users
    const allUsers = await User.find({ _id: { $ne: req.user._id } }).select('_id');
    const recipientIds = allUsers.map(user => user._id);

    const message = `${senderName} created a new discussion: "${title}"`;
    const link = `/discussions/${post._id}`;

    console.log(`📤 Sending 1 notification to each of ${recipientIds.length} users`);

    if (recipientIds.length > 0) {
      await discussionNotificationService.createAndEmitNotifications(
        'post',
        post._id,
        req.user._id,
        recipientIds,
        message,
        link
      );
    }

    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(400).json({ message: "Failed to create post" });
  }
};

// Keep other functions UNCHANGED...
exports.getPosts = async (req, res) => {
  try {
    const { category, courseCode } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (courseCode) filter.courseCode = courseCode;

    const posts = await DiscussionPost.find(filter)
      .sort({ updatedAt: -1 })
      .populate("author", "name role bracuId");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load posts" });
  }
};

exports.getPostWithComments = async (req, res) => {
  try {
    const post = await DiscussionPost.findById(req.params.id).populate(
      "author",
      "name role bracuId"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await DiscussionComment.find({ post: post._id })
      .sort({ createdAt: 1 })
      .populate("author", "name role bracuId");

    res.json({ post, comments });
  } catch (err) {
    res.status(500).json({ message: "Failed to load discussion" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content, parent } = req.body;
    const comment = await DiscussionComment.create({
      post: req.params.id,
      author: req.user._id,
      content,
      parent: parent || null,
    });

    const populated = await DiscussionComment.findById(comment._id)
      .populate("author", "name role bracuId");

    const post = await DiscussionPost.findById(req.params.id).populate('author');
    if (post) {
      const sender = await User.findById(req.user._id).select('name');
      const senderName = sender ? sender.name : 'Someone';
      
      const recipients = [post.author._id];
      const otherComments = await DiscussionComment.find({ 
        post: post._id, 
        author: { $ne: req.user._id }
      }).select('author');
      
      recipients.push(...otherComments.map(c => c.author));

      const uniqueRecipients = [...new Set(recipients.map(r => r._id || r.toString()))]
        .filter(id => id !== req.user._id.toString())
        .map(id => id);

      const message = `${senderName} commented on "${post.title.substring(0, 30)}..."`;
      const link = `/discussions/${post._id}`;

      if (uniqueRecipients.length > 0) {
        await discussionNotificationService.createAndEmitNotifications(
          'comment',
          post._id,
          req.user._id,
          uniqueRecipients,
          message,
          link
        );
      }
    }

    res.status(201).json(populated);
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(400).json({ message: "Failed to add comment" });
  }
};
