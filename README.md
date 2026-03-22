# DebateAI 🎤

> Built a full-stack AI debate coaching platform — React frontend with 12 pages, Node.js/Express backend, Firebase Auth, MongoDB database, and Groq LLM API integration. Features include multi-round AI debates with real-time scoring, user authentication, debate history with full transcripts, performance analytics dashboard, achievement badges, and leaderboard. Deployed on Vercel and Render.

## Tech Stack
- **Frontend**: React + Vite + React Router
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Auth**: Firebase Authentication (Google + Email)
- **AI**: Groq API (llama3-8b-8192)
- **Deploy**: Vercel (frontend) + Render (backend)

---

## Setup Instructions

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/debateai.git
cd debateai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend

```bash
cd backend
```

Create `.env` file:
```
MONGODB_URI=mongodb+srv://manaswini679:YOUR_PASSWORD@cluster0.okb3cnt.mongodb.net/debateai?retryWrites=true&w=majority&appName=Cluster0
GROQ_API_KEY=your_groq_api_key_here
FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json
PORT=5000
```

Copy your Firebase service account JSON file into `backend/` and rename it to `serviceAccountKey.json`.

### 3. Configure Frontend

```bash
cd frontend
```

Create `.env` file (already created with your Firebase config).

### 4. Run locally

Terminal 1 (backend):
```bash
cd backend
npm run dev
```

Terminal 2 (frontend):
```bash
cd frontend
npm run dev
```

Open http://localhost:5173

---

## Deploy

### Backend → Render
1. Push to GitHub
2. Go to render.com → New Web Service → connect your repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from `.env`
7. Upload `serviceAccountKey.json` as a secret file

### Frontend → Vercel
1. Go to vercel.com → New Project → import repo
2. Root directory: `frontend`
3. Add environment variables from `.env`
4. Change `VITE_API_URL` to your Render backend URL

---

## Features
- Google + Email/Password authentication
- 4-step debate setup (topic, side, difficulty, rounds)
- Real-time AI debates powered by Groq (llama3-8b-8192)
- Hint system (3 hints per debate)
- AI scoring and detailed feedback after every debate
- Achievement badges system
- Debate history with search and filters
- Global leaderboard
- Practice mode with AI coach
- Fully responsive dark UI
