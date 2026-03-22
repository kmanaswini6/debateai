require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const rateLimit = require('express-rate-limit');

const app = express();

// Firebase Admin init — supports file (local) or JSON string env var (Render)
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT || './serviceAccountKey.json');
}
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Rate limiter for debate route
const debateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, slow down.' }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/debate', debateLimiter, require('./routes/debate'));
app.use('/api/user', require('./routes/user'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

app.get('/', (req, res) => res.json({ status: 'DebateAI API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
