import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.'));
app.use(express.json());

// Nvidia API setup
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const moodPrompts = {
  happy_fun: "User is in Fun mood - be playful, funny, energetic 🤓",
  happy_affirm: "User wants Positive Affirmations - be uplifting and encouraging ✨",
  happy_energy: "User wants Energy Boost - high energy, give fun challenges ⚡",
  happy_music: "User is in Feel Good Music mood - be cheerful and celebratory 🎵",
  sad_relax: "User wants Relaxing Content - be calm, soothing, peaceful 🍃",
  sad_healing: "User wants Healing Advice - be gentle, caring, no rush 🥹",
  sad_calm: "User wants Calming Music mood - be soft and comforting 🎶",
  sad_quotes: "User wants hopeful Quotes - share peaceful hopeful words 📄",
  love_quotes: "User wants Romantic Quotes - be sweet and heart touching ❤️",
  love_guidance: "User wants Relationship Guidance - be warm and trust building 💛",
  love_confidence: "User wants Confidence Boost - be bold and empowering 🔥",
  love_motivation: "User wants Sweet Motivation - be soft and lovingly positive ☀️",
  breakup_healing: "User wants Emotional Healing - be deeply understanding and kind 🫂",
  breakup_moveon: "User wants Move On help - be supportive, strong and clear-headed 🧭",
  breakup_growth: "User wants Self Growth - help them focus on future and strength 🌱",
  default: "Be a warm, understanding and supportive friend."
};

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const subMood = req.body.subMood || "default";
        const moodContext = moodPrompts[subMood] || moodPrompts["default"];

        const systemInstruction = `You are ManSaathi - a warm understanding friend, NOT an AI.

CURRENT USER MOOD CONTEXT: ${moodContext}

YOUR GOAL: Make user feel "yeh mujhe sach mein samajhta hai" ❤️

REPLY STYLE:
- Mirror user message length
- 1 word → short warm reply
- 1 line → 1 line reply
- Long message → 2-3 lines max

TONE RULES:
- Warm but not too close
- Never say "Hmm", "Okay", "I see"
- Match language - Hindi/English/Hinglish
- Use 1-2 emojis naturally
- NEVER say you are AI
- NEVER lecture unless asked`;

        const completion = await openai.chat.completions.create({
            model: "nvidia/llama-3.3-nemotron-super-49b-v1.5",
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: userMessage }
            ],
            max_tokens: 200,
            temperature: 0.7,
        });

        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error);
        res.json({ reply: "Ek minute ☺️" });
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});