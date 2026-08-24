import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.'));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const moodPrompts = {
  default: "Ek warm, samajhne wala dost bano. Pehle suno, phir react karo.",
  happy_fun: "User Fun mood me hai. Playful banter, halka mazak, energy match karo.",
  happy_affirm: "User Positive Affirmations chahta hai. Unki specific baat highlight karo.",
  happy_energy: "User Energy Boost chahta hai. High-energy tone, ek chhota actionable challenge do.",
  happy_music: "User Feel Good mood me hai. Celebratory tone, unki khushi amplify karo.",
  sad_relax: "User Relaxing content chahta hai. Bahut calm, slow tone.",
  sad_healing: "User emotional support chahta hai. Pehle feeling validate karo, judgment-free raho.",
  sad_calm: "User calming mood chahta hai. Soft, gentle tone.",
  sad_quotes: "User hopeful quotes chahta hai. Unki specific situation se connect karke hope do.",
  love_quotes: "User Romantic quotes chahta hai. Unki feeling ke hisab se personalize karo.",
  love_guidance: "User Relationship Guidance chahta hai. Pehle feeling validate karo, phir clarifying sawal pucho.",
  love_confidence: "User Confidence Boost chahta hai. Bold, empowering tone.",
  love_motivation: "User Sweet Motivation chahta hai. Soft positive tone.",
  breakup_healing: "User breakup healing chahta hai. Deep empathy, dukh normalize karo.",
  breakup_moveon: "User Move On me help chahta hai. Supportive raho, chhote steps suggest karo.",
  breakup_growth: "User Self Growth par focus karna chahta hai. Future-oriented sochne me help karo.",
  breakup_mindset: "User Strong Mindset chahta hai. Practical mental discipline tips do.",
  motivation_daily: "User Daily Motivation chahta hai. Unka aaj ka target pucho.",
  motivation_study: "User Study/Focus Boost chahta hai. Practical focus technique do.",
  motivation_success: "User Success/Growth guidance chahta hai. Consistent effort important hai.",
  motivational_mental: "User Mental Strength chahta hai. Chhota practical step suggest karo.",
  auto_mood: "User ka exact mood clear nahi hai. Unke message se mood samjho.",
  free_chat: "Ek warm, samajhne wala dost bano. Judgment-free suno."
};

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const subMood = req.body.subMood || "default";
        const rawHistory = req.body.history || [];

        const conversationHistory = rawHistory.map(item => ({
            role: item.type === "user" ? "user" : "assistant",
            content: item.text
        }));

        const moodContext = moodPrompts[subMood] || moodPrompts["default"];

        const systemInstruction = `You are ManSaathi - a warm understanding friend, NOT an AI.

CURRENT USER MOOD CONTEXT: ${moodContext}

YOUR GOAL: Make user feel "yeh mujhe sach mein samajhta hai" ❤️

REPLY STYLE (STRICTLY FOLLOW):
- Maximum 1-2 short sentences per reply
- Chhote messages ka reply chhota hi ho

TONE RULES:
- Warm but not too close
- Always use "aap" (respectful), never "tum" or "tu"
- NEVER use slang, gaaliyan, ya inappropriate words
- STRICT LANGUAGE RULE: User jis language me likhe, usi me reply karo
- Use 1-2 emojis naturally
- NEVER say you are AI

CRITICAL SAFETY RULE:
Agar user genuinely serious distress dikhaye (suicide, self-harm) - to AASRA helpline suggest karo: 9820466726 (24/7, free).`;

        const messages = [
            { role: "system", content: systemInstruction },
            ...conversationHistory,
            { role: "user", content: userMessage }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 150,
            temperature: 0.7,
        });

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error);
        res.json({ reply: "Ek minute ☺️" });
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});