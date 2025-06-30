const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Get all comments for a specific post
router.get('/:postId', commentController.getCommentsByPost);

// Create a comment for a specific post
router.post('/:postId', commentController.addComment);

module.exports = router;
