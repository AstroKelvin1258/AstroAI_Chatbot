# AstroAI - Full-Stack Personal Chatbot

A minimal, beautiful, and robust AI chatbot powered by the Gemini API. Built with a React (Vite) frontend and an Express (Node.js) backend.

## Features
- **Frontend**: Clean, glassmorphic UI using React and Vanilla CSS. Features include auto-scroll, Enter-to-send, and a "Clear Chat" action.
- **Backend**: Secure Express API that communicates with Google's Gemini Models. It keeps your API keys secure.
- **Seamless Integrations**: Easy to run locally and deployable anywhere.

---

## 🚀 Running Locally

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended since it uses the native `fetch` API).

### 2. Backend Setup
1. Open a new terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. **Important**: Open `backend/.env` and add your Gemini API Key:
   ```
   GEMINI_API_KEY=your_real_api_key_here
   PORT=3001
   ```
5. Start the backend:
   ```bash
   npm start
   ```
   *The server will run on `http://localhost:3001`.*

### 3. Frontend Setup
1. Open a **second** terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173` (or another port outputted by Vite).*
   

---

## 🌍 Deployment Instructions

Since this is a full-stack application with a frontend and a backend, the recommended way to deploy is to use a modern hosting platform that handles both, or deploy them individually to services like Render, Vercel, or Heroku.

### Backend Deployment (Render, Heroku, Railways)
1. Set the build directory to `backend`, install with `npm install`, and start command to `node server.js` (or `npm start`).
2. **Environment Variables**: Add your `GEMINI_API_KEY` in the hosting provider's dashboard under environment variables/secrets. **Never commit your `.env` file or hardcode keys.**
3. Your backend will be hosted at a new URL (e.g., `https://astroai-backend.onrender.com`).

### Frontend Deployment (Vercel, Netlify)
1. Set the root directory to `frontend`.
2. The build command is `npm run build` and output directory is `dist`.
3. **Environment Variables**: Add `VITE_API_URL` to your hosting provider and set it to your deployed backend's `/api/chat` URL (e.g., `https://astroai-backend.onrender.com/api/chat`). This allows your frontend to securely query the hosted API.
