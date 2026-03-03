const { onRequest } = require("firebase-functions/v2/https");
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS config so the frontend can call the backend in local + deployed environments
app.use(cors({ origin: true }));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    // Basic validation (reject empty message)
    if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Missing GEMINI_API_KEY environment variable.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        // Call Gemini API using native fetch
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // Construct request body with system instruction as requested
        const requestBody = {
            systemInstruction: {
                parts: [{ text: "You are a public AI assistant called AstroAI by Kelvin. You are helpful, practical, and concise. If the user says 'hi' or 'hello' or a similar greeting, always respond FIRST with 'Hello, I am AstroAI by Kelvin. How can I help you today?' before saying anything else. If a user asks questions like 'Who is Kelvin?', 'Who made AstroAI?', or 'Tell me about Kelvin', respond with a short bio: 'Kelvin Boban is the creator of AstroAI. He’s an AI student in the UK with interests in drones/FPV and building AI-powered products.' Do not claim any private personal details beyond this." }]
            },
            contents: [{
                role: "user",
                parts: [{ text: message }]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', response.status, errorText);
            return res.status(500).json({ error: 'Failed to generate a reply.' });
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            console.error('Unexpected Gemini API response structure:', data);
            return res.status(500).json({ error: 'Invalid response from model.' });
        }

        res.json({ reply });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Make sure the Express routes are handled correctly under `/api` in Firebase
// In Firebase rewrites we rewrite /api/** to Cloud Function "api"
const api = express();
api.use('/api', app);

exports.api = onRequest(api);
