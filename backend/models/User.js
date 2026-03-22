const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  photoURL: { type: String, default: '' },
  goal: { type: String, default: 'Fun' },
  preferredDifficulty: { type: String, default: 'Medium' },
  favoriteTopics: { type: [String], default: [] },
  totalDebates: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  onboardingDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
