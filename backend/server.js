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
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array cannot be empty.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Missing GEMINI_API_KEY environment variable.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        // Call Gemini API using native fetch
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // Map frontend messages to Gemini API format
        const formattedContents = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Construct request body with system instruction as requested
        const requestBody = {
            systemInstruction: {
                parts: [{ text: "You are AstroAI by Kelvin. Be friendly, practical, and interactive. Answer the user’s question directly. Only greet at the start of a new chat." }]
            },
            contents: formattedContents
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
exports.api = onRequest(app);

// Start the local server if running directly (e.g., node server.js)
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Backend listening on port ${PORT} for local development`);
    });
}
