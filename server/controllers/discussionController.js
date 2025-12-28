const DiscussionPost = require("../models/DiscussionPost");
const DiscussionComment = require("../models/DiscussionComment");

// POST /api/discussions
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
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: "Failed to create post" });
  }
};

// GET /api/discussions
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

// GET /api/discussions/:id
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

// POST /api/discussions/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { content, parent } = req.body;
    const comment = await DiscussionComment.create({
      post: req.params.id,
      author: req.user._id,
      content,
      parent: parent || null,
    });

    const populated = await comment.populate("author", "name role bracuId");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: "Failed to add comment" });
  }
};
