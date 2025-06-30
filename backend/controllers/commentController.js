const Comment = require('../models/Comment');

// Get comments by post ID
exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const randomAnimals = ['Beaver', 'Fox', 'Otter', 'Raccoon', 'Squirrel'];
    const randomAnimal = randomAnimals[Math.floor(Math.random() * randomAnimals.length)];
    const author = `Anonymous ${randomAnimal}`;

    const newComment = new Comment({
      post: req.params.postId,
      content: req.body.content,
      author: author
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create comment' });
  }
};
