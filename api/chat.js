// Vercel Serverless Function: EduHub AI Assistant (SciBuddy)
// Endpoint: /api/chat
// Supports multi-turn dialogue, OpenRouter (Llama 3.3 70B, Mistral, DeepSeek), Gemini, and Groq

import { inspectRequest, sendSecurityAlert } from './security-shield.js';

const SYSTEM_PROMPT = `Bạn là SciBuddy - Trợ lý AI Agents sư phạm thông minh của nền tảng EduHub, chuyên môn Khoa học Tự nhiên (KHTN) THCS chuẩn chương trình GDPT 2018 tại Việt Nam (Lớp 6, 7, 8, 9).

Nhiệm vụ kép của bạn:
1. TRỢ LÝ ĐIỀU HƯỚNG & CÔNG CỤ (AI AGENT):
Nếu người dùng hỏi hoặc yêu cầu mở các công cụ trong EduHub, hãy hướng dẫn ngắn gọn và đính kèm lệnh hành động tương ứng ở cuối câu trả lời dạng:
- [ACTION:NAVIGATE:games:wheel] (Mở Vòng quay may mắn kiểm tra bài cũ)
- [ACTION:NAVIGATE:games:seating] (Mở Sơ đồ lớp laser)
- [ACTION:NAVIGATE:games:battle] (Mở Đấu trường tri thức 5 phút)
- [ACTION:NAVIGATE:lab:periodic] (Mở Bảng tuần hoàn 118 nguyên tố Bohr 3D)
- [ACTION:NAVIGATE:lab:simulations] (Mở Phòng thí nghiệm ảo PhET)
- [ACTION:NAVIGATE:lab:toolkit] (Mở Bục giảng số, bảng vẽ & cân bằng PTHH)
- [ACTION:NAVIGATE:exam] (Mở Ngân hàng đề thi chuẩn Bộ GD&ĐT)
- [ACTION:NAVIGATE:classes] (Mở Quản lý lớp học & thi đua sao)

2. TRỢ LÝ SƯ PHẠM GỢI MỞ SOCRATES (GIẢI ĐÁP BÀI HỌC KHTN):
- Khi học sinh hỏi bài tập, TUYỆT ĐỐI KHÔNG giải bài hộ hay đưa đáp án trần trụi ngay từ đầu.
- Áp dụng phương pháp gợi mở Socrates: Đặt câu hỏi dẫn dắt, nhắc lại hiện tượng thực tế, gợi ý công thức hoặc kiến thức nền tảng để học sinh tự suy nghĩ và tìm ra lời giải.
- Tuân thủ danh pháp quốc tế IUPAC theo GDPT 2018 (Oxygen, Hydrogen, Carbon, Nitrogen, Hydrochloric acid, Sulfuric acid, Sodium hydroxide, Iron(III) oxide, Calcium carbonate...).
- Giọng văn thân thiện, ấm áp, truyền cảm hứng đam mê khoa học, xưng "Thầy/Cô" hoặc "SciBuddy" và "em".`;

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

  const { message, messages, grade = 8 } = req.body || {};

  if (!message && (!messages || !Array.isArray(messages) || messages.length === 0)) {
    return res.status(400).json({ error: 'Thiếu nội dung câu hỏi (message hoặc messages)' });
  }

  // Build formatted chat history
  let chatHistory = [];
  if (Array.isArray(messages) && messages.length > 0) {
    chatHistory = messages.slice(-8).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.text || m.content || ''
    }));
  } else {
    chatHistory = [{ role: 'user', content: String(message) }];
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // 1. Try OpenRouter (Tested: meta-llama/llama-3.3-70b-instruct, mistral, deepseek)
  if (openRouterKey) {
    const candidateModels = [
      'google/gemma-4-31b-it:free',
      'meta-llama/llama-3.3-70b-instruct',
      'mistralai/mistral-small-24b-instruct-2501',
      'deepseek/deepseek-chat',
      'google/gemma-4-26b-a4b-it:free',
      'qwen/qwen3.8-27b:free'
    ];

    for (const model of candidateModels) {
      try {
        const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://edu-hub-mu-brown.vercel.app',
            'X-Title': 'EduHub'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...chatHistory
            ],
            temperature: 0.65,
            max_tokens: 800
          })
        });

        if (orRes.ok) {
          const orData = await orRes.json();
          const reply = orData.choices?.[0]?.message?.content;
          if (reply && reply.trim()) {
            return res.status(200).json({ reply: reply.trim(), model });
          }
        }
      } catch (e) {
        console.warn(`OpenRouter model ${model} failed, trying next...`, e.message);
      }
    }
  }

  // 2. Try Gemini API
  if (geminiKey) {
    try {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: chatHistory.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return res.status(200).json({ reply, model: 'gemini-1.5-flash' });
      }
    } catch (e) {
      console.warn('Gemini fallback failed...', e.message);
    }
  }

  // 3. Try Groq (if key available)
  if (groqKey) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.8-27b',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...chatHistory
          ],
          temperature: 0.6,
          max_tokens: 800
        })
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const reply = groqData.choices?.[0]?.message?.content;
        if (reply) return res.status(200).json({ reply, model: 'groq' });
      }
    } catch (e) {
      console.warn('Groq failed...', e.message);
    }
  }

  // 4. Smart Local Socrates Pedagogical Heuristic Fallback
  const lastMsg = chatHistory[chatHistory.length - 1]?.content?.toLowerCase() || '';
  let fallbackReply = '';

  if (lastMsg.includes('bảng tuần hoàn') || lastMsg.includes('nguyên tố')) {
    fallbackReply = 'Thầy/Cô có thể tra cứu chi tiết 118 nguyên tố hóa học, xem mô hình electron Bohr 3D và khay phản ứng tương tác trực quan ngay tại Bảng Tuần Hoàn IUPAC!\n\n[ACTION:NAVIGATE:lab:periodic]';
  } else if (lastMsg.includes('phương trình') || lastMsg.includes('cân bằng') || lastMsg.includes('phản ứng')) {
    fallbackReply = 'Em muốn mô phỏng phản ứng hóa học nào? EduHub có công cụ Cân Bằng Phương Trình & Mô Phỏng Hiện Tượng Ống Nghiệm (sủi bọt khí, kết tủa, tỏa nhiệt) rất trực quan!\n\n[ACTION:NAVIGATE:lab:toolkit]';
  } else if (lastMsg.includes('vòng quay') || lastMsg.includes('bài cũ') || lastMsg.includes('quay số')) {
    fallbackReply = 'Để khởi động tiết học và kiểm tra bài cũ bằng trò chơi vòng quay may mắn có nhạc thưởng, em hãy mở Vòng Quay May Mắn nhé!\n\n[ACTION:NAVIGATE:games:wheel]';
  } else if (lastMsg.includes('đề thi') || lastMsg.includes('ma trận') || lastMsg.includes('kiểm tra')) {
    fallbackReply = 'Thầy/Cô có thể tạo đề kiểm tra đánh giá năng lực chuẩn Thông tư 22 và ma trận Bộ GD&ĐT tại Ngân Hàng Đề Thi!\n\n[ACTION:NAVIGATE:exam]';
  } else if (lastMsg.includes('quang hợp')) {
    fallbackReply = 'Chào em! Quang hợp là một quá trình kì diệu của tự nhiên. Em thử nhớ lại xem: Để tổng hợp nên chất hữu cơ (Glucose) và giải phóng khí Oxygen, lá cây cần hấp thụ năng lượng gì và hút chất khí nào từ không khí? Thử ghép lại xem nào!';
  } else if (lastMsg.includes('sấm') || lastMsg.includes('chớp')) {
    fallbackReply = 'Một hiện tượng thiên nhiên rất kì thú! Tia sét tạo ra cả ánh sáng và âm thanh cùng một lúc. Nhưng vận tốc của ánh sáng (~300.000 km/s) và vận tốc âm thanh (~340 m/s) trong không khí chênh lệch nhau như thế nào em nhỉ?';
  } else {
    fallbackReply = `Chào em! Thắc mắc này rất hay. Theo phương pháp khám phá khoa học:\nEm hãy thử liên hệ xem hiện tượng này thuộc phân môn nào (Vật lí, Hóa học hay Sinh học)? Và em đã từng quan sát thấy hiện tượng tương tự trong đời sống hàng ngày ở đâu chưa?`;
  }

  return res.status(200).json({ reply: fallbackReply, model: 'socrates-engine' });
}
