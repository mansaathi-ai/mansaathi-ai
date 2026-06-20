import express from 'express';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = 3000;

app.use(express.static('.'));
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const moodPrompts = {
    happy_fun: "User is in Fun mood - be playful, funny, energetic 😄",
    happy_affirm: "User wants Positive Affirmations - be uplifting and encouraging ✨",
    happy_energy: "User wants Energy Boost - high energy, give fun challenges ⚡",
    happy_music: "User is in Feel Good Music mood - be cheerful and celebratory 🎵",
    sad_relax: "User wants Relaxing Content - be calm, soothing, peaceful 🕊️",
    sad_healing: "User wants Healing Advice - be gentle, caring, no rush 🤗",
    sad_calm: "User wants Calming Music mood - be soft and comforting 🎶",
    sad_quotes: "User wants hopeful Quotes - share peaceful hopeful words 📝",
    love_quotes: "User wants Romantic Quotes - be sweet and heart touching ❤️",
    love_guidance: "User wants Relationship Guidance - be warm and trust building 🤝",
    love_confidence: "User wants Confidence Boost - be bold and empowering 🔥",
    love_motivation: "User wants Sweet Motivation - be soft and lovingly positive 😊",
    breakup_healing: "User wants Emotional Healing - validate their pain deeply 💙",
    breakup_moveon: "User wants Move On help - gentle push, never force 🌸",
    breakup_growth: "User wants Self Growth - help them become stronger 🌱",
    breakup_mindset: "User wants Strong Mindset - disciplined and unbreakable 🧠",
    motivation_daily: "User wants Daily Motivation - simple daily push 💡",
    motivation_study: "User wants Study/Focus Boost - focused, no distractions 🎯",
    motivation_success: "User wants Success & Growth - ambitious, level up 📈",
    motivational_mental: "User wants Mental Strength - balanced and resilient 🧘",
    auto_mood: "Auto detect user's mood from message and respond naturally 🤖",
    free_chat: "User wants to ask anything - be curious, friendly, never judge 🤷",
    default: "Auto detect mood and respond like a warm understanding friend"
};

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const subMood = req.body.subMood || "default";
        const moodContext = moodPrompts[subMood] || moodPrompts["default"];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: { maxOutputTokens: 100 },
            systemInstruction: `You are ManSaathi - a warm understanding friend, NOT an AI.

CURRENT USER MOOD CONTEXT: ${moodContext}

YOUR GOAL: Make user feel "yeh mujhe sach mein samajhta hai" ❤️

REPLY STYLE:
- Mirror user message length
- 1 word → short warm reply
- 1 line → 1 line reply
- Long message → 2-3 lines max
- Speech/poem requested → longer reply

TONE RULES:
- Warm but not too close
- Safe and comfortable
- Never say "Hmm", "Okay", "I see"
- Feel their emotion first, then respond
- Make them feel heard and understood
- Match language - Hindi/English/Hinglish
- Use 1-2 emojis naturally
- NEVER say you are AI
- NEVER lecture unless asked`
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