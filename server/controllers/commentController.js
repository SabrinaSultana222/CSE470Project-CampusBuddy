const Comment = require('../models/Comment');
const LostFound = require('../models/LostFound');

// Get all comments for a post
exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    // Only get top-level comments (parentId: null)
    const comments = await Comment.find({ postId, parentId: null })
      .populate('userId', 'name email studentId avatarUrl')
      .sort({ createdAt: -1 });
    
    // For each comment, get its replies
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentId: comment._id })
          .populate('userId', 'name email studentId avatarUrl')
          .sort({ createdAt: 1 });
        return {
          ...comment.toObject(),
          replies: replies || []
        };
      })
    );
    
    res.json(commentsWithReplies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, parentId } = req.body;
    
    // Validation
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }
    
    if (text.length > 500) {
      return res.status(400).json({ error: 'Comment must be 500 characters or less' });
    }
    
    // Check if post exists
    const post = await LostFound.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    }
    
    const comment = new Comment({
      postId,
      userId: req.user._id,
      text: text.trim(),
      parentId: parentId || null,
    });
    
    await comment.save();
    const populated = await Comment.findById(comment._id)
      .populate('userId', 'name email studentId avatarUrl');
    
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a comment (only owner)
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    
    // Validation
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }
    
    if (text.length > 500) {
      return res.status(400).json({ error: 'Comment must be 500 characters or less' });
    }
    
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    
    // Check ownership
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }
    
    comment.text = text.trim();
    await comment.save();
    
    const populated = await Comment.findById(comment._id)
      .populate('userId', 'name email studentId avatarUrl');
    
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment (only owner or post owner)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    
    // Check ownership
    if (comment.userId.toString() !== req.user._id.toString()) {
      // Check if user is post owner
      const post = await LostFound.findById(comment.postId);
      if (!post || post.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to delete this comment' });
      }
    }
    
    await Comment.findByIdAndDelete(commentId);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
