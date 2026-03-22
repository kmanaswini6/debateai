const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const authMiddleware = require('../middleware/auth');
const Debate = require('../models/Debate');
const User = require('../models/User');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Build system prompt based on difficulty
function buildSystemPrompt(topic, side, difficulty) {
  const opponentSide = side === 'For' ? 'Against' : 'For';
  const diffInstructions = {
    Easy: 'Keep responses friendly and short (2-3 sentences). Use simple language. Be somewhat agreeable but still argue your side.',
    Medium: 'Give logical arguments with real-world examples (3-4 sentences). Be firm but fair.',
    Hard: 'Be ruthless. Use statistics, data, historical examples. Never concede. 4-6 sentences. Attack weak arguments directly.'
  };
  return `You are a debate opponent arguing ${opponentSide} the topic: "${topic}".
${diffInstructions[difficulty]}
RULES: Never agree with the user. Never say you are an AI. Stay in character always.
After your argument, on a NEW LINE write exactly: STRENGTH:[number] where number is 1-10 rating your own argument.`;
}

// Start a new debate
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { topic, side, difficulty, rounds } = req.body;
    const debate = await Debate.create({
      userId: req.user.uid,
      topic, side, difficulty, rounds,
      messages: [], status: 'ongoing'
    });
    res.json({ debateId: debate._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message and get AI response
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { debateId, message } = req.body;
    const debate = await Debate.findById(debateId);
    if (!debate || debate.userId !== req.user.uid) {
      return res.status(404).json({ error: 'Debate not found' });
    }

    // Save user message
    debate.messages.push({ role: 'user', content: message });

    // Build conversation history (sliding window: last 10 messages)
    const history = debate.messages.slice(-10).map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content
    }));

    // Call Groq
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: buildSystemPrompt(debate.topic, debate.side, debate.difficulty) },
        ...history
      ],
      max_tokens: 400
    });

    const rawResponse = completion.choices[0].message.content;

    // Parse strength from response
    const strengthMatch = rawResponse.match(/STRENGTH:(\d+)/);
    const strength = strengthMatch ? parseInt(strengthMatch[1]) : 7;
    const aiContent = rawResponse.replace(/STRENGTH:\d+/g, '').trim();

    // Save AI message
    debate.messages.push({ role: 'ai', content: aiContent, strength });
    await debate.save();

    res.json({ message: aiContent, strength, debateId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a hint
router.post('/hint', authMiddleware, async (req, res) => {
  try {
    const { debateId } = req.body;
    const debate = await Debate.findById(debateId);
    if (!debate) return res.status(404).json({ error: 'Debate not found' });

    const lastTwo = debate.messages.slice(-2).map(m => m.content).join('\n');
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{
        role: 'user',
        content: `Topic: "${debate.topic}". User is arguing ${debate.side}. Last exchange: ${lastTwo}. Give ONE specific counter-argument the user can make in 1-2 sentences. Start with: "Try arguing:"`
      }],
      max_tokens: 100
    });

    debate.hintsUsed += 1;
    await debate.save();
    res.json({ hint: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Finish debate and get scores
router.post('/finish', authMiddleware, async (req, res) => {
  try {
    const { debateId, duration } = req.body;
    const debate = await Debate.findById(debateId);
    if (!debate) return res.status(404).json({ error: 'Debate not found' });

    const transcript = debate.messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{
        role: 'user',
        content: `Analyze this debate transcript and return ONLY valid JSON (no markdown, no extra text):
Topic: "${debate.topic}". User argued: ${debate.side}.
Transcript:
${transcript}

Return this exact JSON:
{
  "user_score": <1-10>,
  "ai_score": <1-10>,
  "winner": "<User or AI>",
  "user_feedback": "<2-3 sentence overall feedback>",
  "user_strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "user_weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
  "best_argument": "<best line from user>",
  "worst_argument": "<weakest line from user>",
  "round_results": ["<User or AI>", "<User or AI>", "<User or AI>"]
}`
      }],
      max_tokens: 600
    });

    let scores;
    try {
      const clean = completion.choices[0].message.content.replace(/```json|```/g, '').trim();
      scores = JSON.parse(clean);
    } catch {
      scores = {
        user_score: 7, ai_score: 6, winner: 'User',
        user_feedback: 'Good debate overall.',
        user_strengths: ['Clear arguments', 'Good structure', 'Confident tone'],
        user_weaknesses: ['Could use more data', 'Some points were brief', 'Address counterpoints more'],
        best_argument: debate.messages.find(m => m.role === 'user')?.content || '',
        worst_argument: '',
        round_results: ['User', 'AI', 'User']
      };
    }

    // Save scores to debate
    debate.scores = {
      userScore: scores.user_score,
      aiScore: scores.ai_score,
      winner: scores.winner,
      userFeedback: scores.user_feedback,
      userStrengths: scores.user_strengths,
      userWeaknesses: scores.user_weaknesses,
      bestArgument: scores.best_argument,
      worstArgument: scores.worst_argument,
      roundResults: scores.round_results
    };
    debate.status = 'completed';
    debate.duration = duration || 0;
    await debate.save();

    // Update user stats
    const won = scores.winner === 'User';
    const user = await User.findOne({ uid: req.user.uid });
    user.totalDebates += 1;
    if (won) {
      user.wins += 1;
      user.currentStreak += 1;
      if (user.currentStreak > user.longestStreak) user.longestStreak = user.currentStreak;
    } else {
      user.currentStreak = 0;
    }
    // Check badges
    if (user.totalDebates === 1 && !user.badges.includes('First Debate')) user.badges.push('First Debate');
    if (user.currentStreak >= 3 && !user.badges.includes('On a Roll')) user.badges.push('On a Roll');
    if (user.totalDebates >= 10 && !user.badges.includes('Debate Master')) user.badges.push('Debate Master');
    if (scores.user_score === 10 && !user.badges.includes('Perfect 10')) user.badges.push('Perfect 10');
    if (debate.difficulty === 'Hard' && won && !user.badges.includes('Hard Mode Hero')) user.badges.push('Hard Mode Hero');
    await user.save();

    res.json({ scores: debate.scores, debateId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single debate
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    if (!debate || debate.userId !== req.user.uid) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ debate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
