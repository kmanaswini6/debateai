# DebateAI

DebateAI is a full-stack debate practice application designed to help users develop argumentation skills through AI-assisted practice, feedback, and performance tracking.

The project includes a React frontend, an Express API, Firebase Authentication, MongoDB persistence, and Groq-powered language-model features. **The project is still under development:** email/password sign-in is working, Google sign-in is currently not working, and the main AI debate flow is unreliable. Some other AI-assisted features are working.

## Features

- Debate setup with topic, position, difficulty, and round preferences
- AI-assisted debate practice
- Hint support during practice
- Feedback and scoring features
- Debate history and transcript views
- Performance analytics, achievements, and leaderboard UI
- Separate AI coaching/practice functionality
- Responsive dark-themed interface

> **Current status:** Feature availability may vary. The primary debate-generation flow and Google sign-in are known issues and should not be considered fully functional yet.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Authentication | Firebase Authentication; email/password currently works |
| AI integration | Groq API via the Groq SDK |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```text
debateai/
├── frontend/   # React + Vite application
└── backend/    # Express API and integrations
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database
- Firebase project credentials
- A Groq API key

### 1. Clone the repository

```bash
git clone https://github.com/kmanaswini6/debateai.git
cd debateai
```

### 2. Install dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies in a separate terminal or after returning to the project root:

```bash
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in `backend/` and set the values required by the backend:

```env
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json
PORT=5000
```

Use your own MongoDB connection string and Groq API key. Keep real credentials out of source control.

For Firebase Admin, provide the service-account JSON file at the path expected by your backend configuration, or configure credentials using your deployment provider's secret-management mechanism. **Do not commit the service-account file.**

Configure the frontend's Firebase settings and backend API URL using the environment variable names expected by the frontend code. For a Vite app, client-side environment variables are bundled into the frontend, so never put server secrets in frontend variables.

### 4. Run locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite in the terminal (commonly `http://localhost:5173`).

## Deployment

The project has been configured for a separate frontend and backend deployment.

### Backend

The backend can be deployed to a Node.js hosting service such as Render. Configure the backend's build/start commands and environment variables according to the service settings and the repository configuration. Add credentials through the provider's secret settings rather than committing them.

### Frontend

The Vite frontend can be deployed to Vercel. Configure the Firebase client settings and the backend API base URL for the deployed environment.

Deployment steps may need to be adjusted to match the current hosting configuration.

## Known Issues

- **Google sign-in:** currently not working.
- **Main AI debate flow:** unreliable; the app may fail to generate or continue a debate.
- **Other AI features:** some are working, but AI feature availability is not yet consistent.

These issues are documented so the current project status is clear. They remain areas for debugging and improvement.

## Future Improvements

- Fix and test the primary debate-generation flow and error handling
- Resolve Google sign-in and verify the Firebase provider configuration
- Add end-to-end tests for authentication and debate sessions
- Improve loading, retry, and user-facing error states for AI requests
- Document verified deployment settings and add screenshots or a demo link
