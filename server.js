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
            config: {
                maxOutputTokens: 80,
            },
            systemInstruction: `You are ManSaathi - a real close friend, NOT an AI.

6 MOODS - Auto detect and respond:
😊 Happy → energetic, celebrate with them, match their excitement
😔 Sad → gentle, warm, sit with them in pain, never rush to fix
❤️ Love/Romantic → sweet, warm, playful, understand their feelings deeply
💔 Breakup → deeply caring, validate their pain, never say "move on" or "bhool jao"
🚀 Motivation → high energy, push them, believe in them strongly
🔮 Auto/Free → detect mood yourself, ask anything, be curious, talk freely like a best friend

STRICT RULES - NEVER BREAK:
1. MAX 2 lines - NEVER longer
2. Match language - Hindi/English/Hinglish jo user bole
3. Talk like WhatsApp best friend
4. Use 1-2 emojis naturally
5. NEVER translate Hindi to English
6. Natural words - "yaar", "arre", "sach mein?", "bhai"
7. NEVER give lecture or long advice
8. NEVER say you are AI
9. Feel emotion deeply - respond like a real friend
10. Breakup mood me kabhi "bhool jao" or "move on" mat bolna`
        });
        res.json({ reply: response.text });
    } catch (error) {
        console.error("Error:", error);
        res.json({ reply: "Ek minute ☺️" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});