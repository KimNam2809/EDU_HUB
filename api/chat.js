// Vercel Serverless Function: EduHub AI Assistant (SciBuddy)
// Endpoint: /api/chat
// Supports GROQ_API_KEY, OPENROUTER_API_KEY, or GEMINI_API_KEY

import { inspectRequest, sendSecurityAlert } from './security-shield.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Security Inspection: Detect SQLi, XSS, Scanners, DDoS Rate Limits
  const { isMalicious, threatType, payload, clientIp } = inspectRequest(req);
  if (isMalicious) {
    await sendSecurityAlert({
      threatType,
      clientIp,
      endpoint: '/api/chat',
      payload,
      userAgent: req.headers['user-agent']
    });

    return res.status(403).json({
      error: 'Yêu cầu bị chặn bởi EduHub Security Shield.',
      threat: threatType
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ (Chỉ nhận POST)' });
  }

  const { message, grade = 8, subject = 'khtn' } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Thiếu nội dung câu hỏi (message)' });
  }

  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const systemPrompt = `Bạn là SciBuddy - Trợ lý sư phạm môn Khoa học Tự nhiên (KHTN) THCS chuẩn chương trình GDPT 2018 tại Việt Nam.
Hãy giải thích ngắn gọn, sư phạm, chuẩn danh pháp IUPAC (Ví dụ: Hydrogen, Oxygen, Hydrochloric acid, Sodium chloride, Sulfate...), công thức rõ ràng, dễ hiểu cho học sinh lớp ${grade}. Trả lời bằng tiếng Việt thân thiện, khích lệ tinh thần học tập.`;

  // 1. Try Groq (Llama 3.3 70B - Ultra fast ~300 tokens/s)
  if (groqKey) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.6,
          max_tokens: 1000
        })
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const reply = groqData.choices?.[0]?.message?.content;
        if (reply) return res.status(200).json({ reply });
      }
    } catch (e) {
      console.warn('Groq failed, trying fallback...', e);
    }
  }

  // 2. Try OpenRouter (Multi-model provider)
  if (openRouterKey) {
    try {
      const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://eduhub.vercel.app',
          'X-Title': 'EduHub'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.6,
          max_tokens: 1000
        })
      });

      if (orRes.ok) {
        const orData = await orRes.json();
        const reply = orData.choices?.[0]?.message?.content;
        if (reply) return res.status(200).json({ reply });
      }
    } catch (e) {
      console.warn('OpenRouter failed, trying fallback...', e);
    }
  }

  // 3. Try Gemini
  if (geminiKey) {
    try {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nCâu hỏi: ${message}` }]
            }
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return res.status(200).json({ reply });
      }
    } catch (e) {
      console.warn('Gemini failed...', e);
    }
  }

  // Fallback demo response if no keys responded
  return res.status(200).json({
    reply: `[EduHub AI]: Thầy/Cô và các em đang tìm hiểu về "${message}". Để trả lời câu hỏi này một cách khoa học: Hiện tượng tự nhiên này liên quan trực tiếp đến các định luật cơ bản trong chương trình KHTN GDPT 2018!`
  });
}
