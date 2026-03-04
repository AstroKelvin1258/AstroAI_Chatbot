const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS config so the frontend can call the backend
app.use(cors({ origin: true }));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array cannot be empty.' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error('Missing GROQ_API_KEY environment variable.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        const MODEL = 'llama-3.1-8b-instant'; // Switch to 'llama-3.3-70b-versatile' occasionally if desired

        // Map frontend messages to Groq API format
        const formattedMessages = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        }));

        // Add system instruction as the first message
        formattedMessages.unshift({
            role: 'system',
            content: 'You are AstroAI, an advanced AI chatbot created and developed by Kelvin Boban. Be friendly, practical, and interactive. Answer the user’s question directly. Only greet at the start of a new chat. If a user asks who created you or asks about Kelvin, provide this exact accurate bio: "Kelvin Boban is the creator and lead developer of AstroAI. He is an extremely talented Artificial Intelligence student based in the UK. He has a passion for building complex, modern AI-powered applications, full-stack website development, and has a strong interest in Drone/FPV technology."'
        });

        const requestBody = {
            model: MODEL,
            messages: formattedMessages
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error:', response.status, errorText);

            let groqErrorMsg = 'Failed to generate a reply.';
            try {
                const errObj = JSON.parse(errorText);
                if (errObj.error && errObj.error.message) {
                    groqErrorMsg = errObj.error.message;
                }
            } catch (e) { }

            return res.status(500).json({ error: `Groq API Error ${response.status}: ${groqErrorMsg}` });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;

        if (!reply) {
            console.error('Unexpected Groq API response structure:', data);
            return res.status(500).json({ error: 'Invalid response from model.' });
        }

        res.json({ reply });
    } catch (error) {
        console.error('Error calling Groq API:', error);
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
});

// Export the Express API so Vercel can wrap it as a Serverless Function
module.exports = app;

// Start the local server if running directly (e.g., node api/index.js)
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Backend listening on port ${PORT} for local development`);
    });
}
