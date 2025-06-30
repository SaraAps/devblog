const Tag = require('../models/Tag');

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

exports.createTag = async (req, res) => {
  try {
    const newTag = new Tag(req.body);
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create tag' });
  }
};
