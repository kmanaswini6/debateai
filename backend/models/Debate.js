const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'ai'] },
  content: { type: String },
  strength: { type: Number, default: null },
  timestamp: { type: Date, default: Date.now }
});

const debateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  side: { type: String, enum: ['For', 'Against'], default: 'For' },
  rounds: { type: Number, default: 5 },
  messages: [messageSchema],
  scores: {
    userScore: Number,
    aiScore: Number,
    winner: String,
    userFeedback: String,
    userStrengths: [String],
    userWeaknesses: [String],
    bestArgument: String,
    worstArgument: String,
    roundResults: [String]
  },
  hintsUsed: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  status: { type: String, enum: ['ongoing', 'completed', 'forfeited'], default: 'ongoing' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Debate', debateSchema);
