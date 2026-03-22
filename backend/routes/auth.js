const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Called after Firebase login — creates user in DB if first time
router.post('/login', authMiddleware, async (req, res) => {
  try {
    const { uid, name, email, picture } = req.user;
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({
        uid,
        name: name || 'Debater',
        email,
        photoURL: picture || ''
      });
    }
    res.json({ user, isNew: !user.onboardingDone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save onboarding preferences
router.post('/onboarding', authMiddleware, async (req, res) => {
  try {
    const { goal, preferredDifficulty, favoriteTopics } = req.body;
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { goal, preferredDifficulty, favoriteTopics, onboardingDone: true },
      { new: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
