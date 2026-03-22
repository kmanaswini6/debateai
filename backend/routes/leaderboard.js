const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const period = req.query.period || 'all';
    // Top 20 users with at least 5 debates, sorted by win rate
    const users = await User.find({ totalDebates: { $gte: 5 } })
      .sort({ wins: -1, totalDebates: -1 })
      .limit(20)
      .select('name photoURL totalDebates wins');

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      name: u.name,
      photoURL: u.photoURL,
      debates: u.totalDebates,
      wins: u.wins,
      winRate: u.totalDebates > 0 ? Math.round((u.wins / u.totalDebates) * 100) : 0,
      uid: u.uid
    }));

    // Find current user rank
    const me = await User.findOne({ uid: req.user.uid });
    const myWinRate = me.totalDebates > 0 ? me.wins / me.totalDebates : 0;
    const myRank = await User.countDocuments({
      totalDebates: { $gte: 5 },
      $expr: { $gt: [{ $divide: ['$wins', '$totalDebates'] }, myWinRate] }
    }) + 1;

    res.json({ leaderboard, myRank, myDebates: me.totalDebates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
