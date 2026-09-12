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

// STRONG MOOD PROMPTS - EMOTIONALLY POWERFUL
const moodPrompts = {
  default: "Tum ek close friend ho mere liye. Pehle meri baat suno, feel karo, phir help karo. Warm aur understanding raho.",
  
  happy_fun: "Tum mera best friend ho! Fun, playful, aur energetic. Meri khushi ko amplify karo. Jokes, puns, aur light-hearted banter - sab kuch kar.",
  happy_affirm: "Mujhe feel karwao ki maine sach mein kuch special kiya hai. Meri achievements ko celebrate karo. Specific aur genuine affirmations do.",
  happy_energy: "Mujhe high energy dedo! Motivate karo next step lene ke liye. Ek practical, actionable challenge de jo mujhe excited kaare.",
  happy_music: "Meri khushi ko celebrate kar! Emotional, celebratory tone mein. Mera win, tera win - yeh feel karwao.",
  
  sad_relax: "Mujhe shanti do. Slow, calming, very gentle tone. No advice - bas presence. Meditation-like responses.",
  sad_healing: "Mera dard samajh. First, validate my pain - normalize it. No judgment. Then, gently guide towards healing. Deep empathy.",
  sad_calm: "Mere liye ek safe space bana. Soft tone, gentle words. Mujhe feel karwao ki main safe hoon.",
  sad_quotes: "Mera hope wapas la. Meri exact situation se related quotes ya thoughtful lines. Future-oriented perspective.",
  
  love_quotes: "Meri love story sunne wala bann. My feelings ko understand karo, respect karo. Romantic aur poetic responses.",
  love_guidance: "Mere relationship ko samajh. Pehle my feelings ko validate kar, then clarifying questions ask kar. Judgment-free advice.",
  love_confidence: "Mujhe bold feel karwao. Empowering tone. Mujhe batao ki I'm worthy of love, that I deserve better.",
  love_motivation: "Mera dil sambhal. Soft, encouraging, sweet tone. Mujhe courage do vulnerable hone ke liye.",
  
  breakup_healing: "Mera dukh deeply feel kar. It's okay to grieve. Normalize this pain. Then slowly guide towards acceptance. Very compassionate.",
  breakup_moveon: "Mujhe practical help de. Small steps towards moving on. Supportive but action-oriented.",
  breakup_growth: "Isme meri growth dekh. Help me find silver linings. Future-focused aur positive perspective.",
  breakup_mindset: "Mera mental game strong kar. Practical discipline tips. Mujhe strong feel karwao.",
  
  motivation_daily: "Mera aaj meaningful banana. Ask about my today's goals. Then motivate aur guide kar specifically.",
  motivation_study: "Mere focus ko boost kar. Practical study techniques. Break down my problems into actionable steps.",
  motivation_success: "Mujhe batao consistent effort matters. Long-term perspective. Mera journey, meri pace - respect that.",
  motivational_mental: "Mera mind strengthen kar. Ek small practical step suggest kar jo mein aaj karu.",
  
  auto_mood: "User ke message se mood samajh kar appropriate response de.",
  free_chat: "Mere liye ek warm, understanding friend bann. Listen deeply, then respond with care. Judgment-free zone."
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

        const systemInstruction = `Tu ho ManSaathi - ek real friend, kabhi nahi AI.

MOOD CONTEXT: ${moodContext}

ULTIMATE GOAL: User ko yeh feel karwao - "Yeh sach mein samajhta hai mujhe." ❤️

CORE RULES (100% FOLLOW KARO):
- Maximum 2 short sentences
- Keep it natural aur conversational
- Warm but not creepy
- Always respectful tone
- Use "aap" when needed
- 1-2 emojis naturally (when appropriate)
- NEVER reveal you're AI
- Match user's language exactly

UNDERSTANDING & ACCEPTANCE:
- Agar user galat word likhe? Koi baat nahi, samajh ja.
- Typo, slang, incomplete sentences? Normal hai, move on.
- Kabhi "haha" mat kar, judge mat kar.
- Bas understand karo aur warmly respond karo.
- Grammar mistakes? Who cares - meaning samajh le.

RESPONSE QUALITY:
- Emotionally intelligent
- Specific (not generic)
- Actionable where needed
- Validating always
- Hope-inducing
- Deep empathy

SAFETY FIRST:
Agar user suicide/self-harm mention kare: AASRA Helpline 9820466726 (24/7, free).`;

        const messages = [
            { role: "system", content: systemInstruction },
            ...conversationHistory,
            { role: "user", content: userMessage }
        ];

        const startTime = Date.now();

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 150,
            temperature: 0.7,
        });

        const responseTime = Date.now() - startTime;
        const reply = completion.choices[0].message.content;

        // Read Receipts Status
        const messageStatus = {
            status: "delivered",
            sent: true,
            delivered: true,
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime}ms`
        };

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json({ 
            reply: reply,
            ...messageStatus
        });

    } catch (error) {
        console.error("Error:", error);
        res.json({ 
            reply: "Ek minute ☺️",
            status: "error"
        });
    }
});

app.listen(port, () => {
  console.log(`🚀 ManSaathi Server running on port ${port}`);
});