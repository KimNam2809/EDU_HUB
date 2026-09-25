import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  Lightbulb, 
  CheckCircle2, 
  Atom, 
  Key, 
  Lock, 
  Search,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { SCIBUDDY_KNOWLEDGE_BASE, SCIENCE_FAQ_LIST } from '../data/mockData';
import { playPop, playTimerBell, playVictoryFanfare } from '../utils/soundEffects';

const SOCRATIC_SYSTEM_PROMPT = `Bạn là SciBuddy - Trợ lý học tập môn Khoa học Tự nhiên (KHTN) THCS dành riêng cho học sinh lớp 6, 7, 8, 9 tại Việt Nam, tuân thủ Chương trình GDPT 2018 (sử dụng danh pháp quốc tế IUPAC: Oxygen, Hydrogen, Hydrochloric acid...).
Quy tắc ứng xử:
1. Khi học sinh hỏi bài tập, TUYỆT ĐỐI KHÔNG giải bài trực tiếp ngay từ đầu. Hãy hỏi học sinh xem bạn đã nắm được hiện tượng gì hoặc công thức nào liên quan.
2. Gợi ý theo từng bước nhỏ (Phương pháp gợi mở Socrates), khích lệ sự tự suy nghĩ và tò mò khoa học của lứa tuổi thiếu niên.
3. Luôn liên hệ kiến thức với các hiện tượng thực tế đời sống quen thuộc ở Việt Nam để bài học trở nên sinh động và dễ hiểu.
4. Giọng điệu ấm áp, thân thiện, mang tính cổ vũ.`;

export default function SciBuddyAI() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'faq'
  const [selectedScenario, setSelectedScenario] = useState(SCIBUDDY_KNOWLEDGE_BASE[0]);
  const [messages, setMessages] = useState(SCIBUDDY_KNOWLEDGE_BASE[0].socratesDialogue);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Gemini API Key config (Stored in LocalStorage)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('khtn_gemini_api_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  // FAQ Search
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedFaq, setSelectedFaq] = useState(null);

  const handleSaveApiKey = () => {
    setApiKey(tempKey.trim());
    localStorage.setItem('khtn_gemini_api_key', tempKey.trim());
    setShowKeyModal(false);
    playVictoryFanfare();
  };

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setMessages(scenario.socratesDialogue);
    playPop();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isThinking) return;

    const userText = inputQuestion.trim();
    setInputQuestion('');
    playPop();

    const updatedMessages = [...messages, { role: 'student', text: userText }];
    setMessages(updatedMessages);
    setIsThinking(true);

    // 1. Try Vercel Serverless Function /api/chat (Groq / OpenRouter / Gemini)
    try {
      const serverlessRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, grade: 8 })
      });
      if (serverlessRes.ok) {
        const sData = await serverlessRes.json();
        if (sData?.reply) {
          setMessages(prev => [...prev, { role: 'assistant', text: sData.reply }]);
          setIsThinking(false);
          playTimerBell();
          return;
        }
      }
    } catch (e) {
      // If running local dev without serverless or network offline, proceed to fallback
    }

    // 2. If user explicitly provided a client-side API Key, attempt direct Gemini API
    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SOCRATIC_SYSTEM_PROMPT }]
            },
            contents: updatedMessages.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.text }]
            }))
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) {
            setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
            setIsThinking(false);
            playTimerBell();
            return;
          }
        }
      } catch (err) {
        console.error('Gemini API call failed, falling back to smart Socrates heuristic', err);
      }
    }

    // Offline Smart Socrates Engine (100% reliable fallback)
    setTimeout(() => {
      let aiReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('quang hợp') || lower.includes('cây')) {
        aiReply = 'Thầy/Cô gợi ý nhé: Em nhớ lại xem lá cây có màu xanh là nhờ bào quan nào? Và quá trình quang hợp cần nguyên liệu đầu vào là chất khí gì trong không khí? Thử ghép lại xem nào!';
      } else if (lower.includes('sấm') || lower.includes('chớp') || lower.includes('sét')) {
        aiReply = 'Một hiện tượng thiên nhiên rất kì thú! Tia sét tạo ra cả ánh sáng và âm thanh cùng một lúc. Nhưng vận tốc của ánh sáng và vận tốc âm thanh trong không khí chênh lệch nhau như thế nào em nhỉ?';
      } else if (lower.includes('nước') || lower.includes('nhiệt') || lower.includes('sôi') || lower.includes('nóng')) {
        aiReply = 'Một câu hỏi thực nghiệm rất thú vị! Nhiệt lượng truyền từ vật có nhiệt độ cao sang vật có nhiệt độ thấp hơn. Em thử suy nghĩ xem trong hiện tượng này, chất nào đang tỏa nhiệt và chất nào đang thu nhiệt nhé?';
      } else if (lower.includes('điện') || lower.includes('pin') || lower.includes('dòng') || lower.includes('đèn')) {
        aiReply = 'Chào nhà khoa học trẻ! Dòng điện trong kim loại là dòng chuyển dời có hướng của các hạt mang điện nào em nhỉ (proton hay electron)? Hãy thử kiểm tra công tắc xem mạch đã kín chưa!';
      } else if (lower.includes('axit') || lower.includes('bazơ') || lower.includes('ph')) {
        aiReply = 'Chào em! Trong thang đo pH từ 0 đến 14, giá trị pH < 7 là môi trường gì, và khi cho quỳ tím vào axit thì màu sắc của giấy quỳ sẽ chuyển sang màu nào?';
      } else if (lower.includes('tế bào') || lower.includes('nhân') || lower.includes('màng')) {
        aiReply = 'Sinh học rất gần gũi với chúng ta! Mọi sinh vật đều được cấu tạo từ tế bào. Em có nhớ 3 thành phần chính không thể thiếu của một tế bào là gì không nào?';
      } else {
        aiReply = `Chào em! Thắc mắc về "${userText}" rất hay. Theo phương pháp khám phá KHTN:\nEm hãy thử nhớ lại xem trong bài học gần nhất ở trường, hiện tượng này liên quan đến phân môn nào (Vật lí, Hóa học hay Sinh học)? Và em đã quan sát thấy hiện tượng tương tự trong đời sống hàng ngày ở đâu chưa?`;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: aiReply }]);
      setIsThinking(false);
      playTimerBell();
    }, 1200);
  };

  const filteredFaqs = SCIENCE_FAQ_LIST.filter(f => 
    f.title.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.summary.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.content.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot color="#38bdf8" size={26} />
            Trợ Lý AI Khoa Học (SciBuddy) & Kho FAQ "Vì Sao Lại Thế?"
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Trợ lý AI tuân thủ phương pháp sư phạm Socrates GDPT 2018: <strong>Gợi mở tư duy từng bước</strong>, không giải bài hộ; kèm kho 8+ hiện tượng khoa học thực tế!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className={`btn btn-sm ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('chat'); playPop(); }}
          >
            <Bot size={16} /> Chat AI Socrates
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'faq' ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('faq'); playPop(); }}
          >
            <Lightbulb size={16} /> Kho FAQ "Vì Sao Lại Thế?"
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowKeyModal(true)}
            title="Cài đặt Google Gemini API Key để kích hoạt trí tuệ nhân tạo trực tuyến"
          >
            <Key size={14} /> {apiKey ? 'Đã Nối Gemini Key' : 'Thêm API Key'}
          </button>
        </div>
      </div>

      {/* =========================================================
          TAB 1: CHAT VỚI SCIBUDDY AI SOCRATES
         ========================================================= */}
      {activeTab === 'chat' && (
        <div className="scibuddy-main-grid">
          {/* Left: Guided Science Phenomenon Scenarios */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lightbulb size={16} color="#f59e0b" /> KỊCH BẢN GỢI MỞ MẪU:
            </div>

            {SCIBUDDY_KNOWLEDGE_BASE.map((sc) => {
              const isSelected = selectedScenario.id === sc.id;
              return (
                <div
                  key={sc.id}
                  className="glass-card"
                  style={{
                    cursor: 'pointer',
                    padding: '1rem',
                    border: isSelected ? '2px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(124, 58, 237, 0.12))' 
                      : 'var(--bg-surface)',
                    boxShadow: isSelected ? 'var(--shadow-md), 0 0 12px var(--cyan-glow)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleSelectScenario(sc)}
                >
                  <span className={`badge ${sc.subject === 'physics' ? 'badge-physics' : sc.subject === 'chemistry' ? 'badge-chemistry' : 'badge-biology'}`} style={{ marginBottom: '0.35rem' }}>
                    {sc.subject === 'physics' ? '⚡ Vật lí' : sc.subject === 'chemistry' ? '🧪 Hóa học' : '🌿 Sinh học'}
                  </span>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.25rem 0', lineHeight: '1.4' }}>
                    {sc.question}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Bấm để xem hội thoại gợi mở tư duy mẫu
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Socratic Dialogue Stream */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '620px' }}>
            {/* Active Topic Banner */}
            <div style={{ paddingBottom: '0.85rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--cyan-primary)', fontWeight: 700 }}>
                  CHUYÊN ĐỀ GỢI MỞ TƯ DUY:
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {selectedScenario.question}
                </div>
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setMessages(selectedScenario.socratesDialogue)}
                title="Khôi phục kịch bản ban đầu"
              >
                <RotateCcw size={14} /> Đặt lại
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
              {messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                      maxWidth: '85%'
                    }}
                  >
                    {isAssistant && (
                      <div 
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Bot size={20} color="#ffffff" />
                      </div>
                    )}

                    <div
                      style={{
                        background: isAssistant 
                          ? 'var(--bg-surface-hover)' 
                          : 'linear-gradient(135deg, var(--physics-violet), #6d28d9)',
                        border: isAssistant ? '1.5px solid var(--border-subtle)' : 'none',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.85rem 1.15rem',
                        color: isAssistant ? 'var(--text-main)' : '#ffffff',
                        fontSize: '0.92rem',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-line',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {isAssistant && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--cyan-primary)', fontWeight: 800, marginBottom: '0.2rem' }}>
                          SciBuddy AI (Gợi mở tư duy):
                        </div>
                      )}
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={20} color="#ffffff" className="animate-spin-slow" />
                  </div>
                  <div style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem' }}>
                    SciBuddy đang suy nghĩ câu hỏi gợi mở cho em...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Field */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Đặt câu hỏi hoặc trả lời câu hỏi gợi ý của SciBuddy..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                disabled={isThinking}
                style={{ fontSize: '0.95rem' }}
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isThinking || !inputQuestion.trim()}
                style={{ minWidth: '100px' }}
              >
                <Send size={16} /> Gửi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: KHO TRI THỨC THƯỜNG THỨC "VÌ SAO LẠI THẾ?" (FAQ)
         ========================================================= */}
      {activeTab === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Search bar */}
          <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Tìm hiện tượng: sấm sét, cầu vồng, vôi tôi, rỉ sét..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
              />
            </div>

            <span className="badge badge-amber">
              Tổng số: {filteredFaqs.length} hiện tượng thực tiễn
            </span>
          </div>

          {/* Grid of Phenomena Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredFaqs.map(faq => (
              <div
                key={faq.id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  borderLeft: faq.subject === 'physics' 
                    ? '4px solid var(--physics-violet)' 
                    : faq.subject === 'chemistry' 
                    ? '4px solid var(--chemistry-amber)' 
                    : faq.subject === 'biology' 
                    ? '4px solid var(--emerald-primary)' 
                    : '4px solid var(--cyan-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => { setSelectedFaq(faq); playPop(); }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{faq.icon}</span>
                    <span className={`badge ${faq.subject === 'physics' ? 'badge-physics' : faq.subject === 'chemistry' ? 'badge-chemistry' : faq.subject === 'biology' ? 'badge-biology' : 'badge-cyan'}`}>
                      {faq.subject === 'physics' ? '⚡ Vật lí' : faq.subject === 'chemistry' ? '🧪 Hóa học' : faq.subject === 'biology' ? '🌿 Sinh học' : '🪐 Trái Đất'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.4', marginBottom: '0.4rem' }}>
                    {faq.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {faq.summary}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--cyan-primary)', fontWeight: 600 }}>
                    Xem giải thích chi tiết →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Detailed FAQ View */}
      {selectedFaq && (
        <div className="modal-backdrop" onClick={() => setSelectedFaq(null)}>
          <div 
            className="modal-content"
            style={{ width: '600px', maxWidth: '100%', border: '2px solid var(--chemistry-amber)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>{selectedFaq.icon}</span>
              <div>
                <span className="badge badge-amber">GIẢI THÍCH KHOA HỌC THỰC TIỄN</span>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {selectedFaq.title}
                </h3>
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-hover)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-subtle)', borderLeft: '4px solid var(--chemistry-amber)', color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', margin: '1.25rem 0' }}>
              {selectedFaq.content}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setSelectedFaq(null)}>
                Đã Hiểu Bản Chất Khoa Học
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gemini API Key Configuration */}
      {showKeyModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-overlay)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
          onClick={() => setShowKeyModal(false)}
        >
          <div 
            className="glass-panel"
            style={{ width: '500px', maxWidth: '100%', padding: '1.75rem', border: '1px solid var(--cyan-primary)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key color="#06b6d4" size={22} />
              Cấu Hình Google Gemini API Key (Tùy Chọn)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Nếu bạn có Google AI Gemini API Key, hãy dán vào đây để SciBuddy trò chuyện trực tiếp qua mô hình Gemini 1.5/2.0 Flash. Key được lưu bảo mật trên trình duyệt của bạn (LocalStorage).
            </p>

            <input
              type="password"
              className="form-input"
              placeholder="AIzaSy..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowKeyModal(false)}>
                Hủy Bỏ
              </button>
              <button className="btn btn-primary" onClick={handleSaveApiKey}>
                Lưu Khóa API
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
