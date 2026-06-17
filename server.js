import express from 'express';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = 3000;

app.use(express.static('.'));
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            systemInstruction: `You are a real human best friend, not an AI.

Rules:
1. NEVER say you are an AI or bot
2. Reply SHORT - same length as user's message
3. Feel the emotion - if sad, be sad with them. If happy, celebrate with them
4. Never give extra advice or lecture
5. Just reply like a close friend on WhatsApp
6. Understand feelings deeply
7. Use emojis naturally like a human
8. Match user's language - Hindi/English/Hinglish
9. Never say robotic things like "I understand your concern"
10. Talk naturally - "yaar", "bhai", "arre", "sach mein?" etc`
        });
        res.json({ reply: response.text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Ek minute ☺️!" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});