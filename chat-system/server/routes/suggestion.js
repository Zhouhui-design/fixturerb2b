const express = require('express');
const Suggestion = require('../models/Suggestion');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, username, content } = req.body;
    
    if (!content || content.trim().length < 10) {
      return res.status(400).json({ error: 'Suggestion must be at least 10 characters' });
    }
    
    const suggestion = new Suggestion({
      userId,
      username,
      content: content.trim()
    });
    
    await suggestion.save();
    
    res.status(201).json({ suggestion, message: 'Suggestion submitted successfully' });
  } catch (err) {
    console.error('Submit suggestion error:', err);
    res.status(500).json({ error: 'Failed to submit suggestion' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { limit = 50, status } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    const suggestions = await Suggestion.find(filter)
      .sort({ votes: -1, createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ suggestions });
  } catch (err) {
    console.error('Get suggestions error:', err);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

router.post('/:id/vote', async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id);
    
    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }
    
    suggestion.votes += 1;
    await suggestion.save();
    
    res.json({ suggestion, message: 'Vote recorded' });
  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

module.exports = router;
