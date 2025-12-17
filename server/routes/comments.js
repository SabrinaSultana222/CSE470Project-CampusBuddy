const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');

// Get all comments for a post
router.get('/:postId', commentController.getComments);

// Create a new comment (requires auth)
router.post('/:postId', auth, commentController.createComment);

// Update a comment (requires auth, only owner)
router.put('/:commentId', auth, commentController.updateComment);

// Delete a comment (requires auth, only owner or post owner)
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;
