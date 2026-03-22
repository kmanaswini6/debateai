const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Debate = require('../models/Debate');

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const allowed = ['name', 'goal', 'preferredDifficulty', 'favoriteTopics'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findOneAndUpdate({ uid: req.user.uid }, updates, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get debate history (paginated)
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const filter = { userId: req.user.uid, status: 'completed' };
    if (req.query.result === 'win') filter['scores.winner'] = 'User';
    if (req.query.result === 'loss') filter['scores.winner'] = 'AI';
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.search) filter.topic = { $regex: req.query.search, $options: 'i' };

    const total = await Debate.countDocuments(filter);
    const debates = await Debate.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-messages');

    res.json({ debates, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a debate
router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    await Debate.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete all history
router.delete('/history', authMiddleware, async (req, res) => {
  try {
    await Debate.deleteMany({ userId: req.user.uid });
    await User.findOneAndUpdate({ uid: req.user.uid }, {
      totalDebates: 0, wins: 0, currentStreak: 0
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
