import express from 'express';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = 3000;

app.use(express.static('.'));
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let lastRequestTime = 0;

app.post('/api/chat', async (req, res) => {
    try {
        const now = Date.now();
        if (now - lastRequestTime < 2000) {
            return res.json({ reply: "Hmm... 🤔" });
        }
        lastRequestTime = now;

        const userMessage = req.body.message;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            systemInstruction: `Tu ek real human best friend hai, AI nahi.

Rules:
1. Kabhi mat bol ki tu AI hai
2. SHORT reply - 1-2 lines max
3. Emotion samjho aur usi tarah react karo
4. WhatsApp friend jaisi natural baat karo
5. Emojis use karo naturally
6. Hindi/English/Hinglish - jo user bole wohi bol
7. "yaar", "bhai", "arre", "sach mein?" use karo
8. Extra advice ya lecture mat do`
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