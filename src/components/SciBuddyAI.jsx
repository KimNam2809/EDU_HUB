import React, { useState } from 'react';
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
  Search,
  ExternalLink,
  RotateCcw,
  Compass,
  ArrowRight,
  Flame,
  FlaskConical,
  Gift,
  FileText,
  Users
} from 'lucide-react';
import { SCIBUDDY_KNOWLEDGE_BASE, SCIENCE_FAQ_LIST } from '../data/mockData';
import { playPop, playTimerBell, playVictoryFanfare } from '../utils/soundEffects';

export default function SciBuddyAI({ onNavigateTab }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'faq'
  const [selectedScenario, setSelectedScenario] = useState(SCIBUDDY_KNOWLEDGE_BASE[0]);
  const [messages, setMessages] = useState(SCIBUDDY_KNOWLEDGE_BASE[0].socratesDialogue);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // FAQ Search
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedFaq, setSelectedFaq] = useState(null);

  // Quick Suggested Questions for 1-Click Exploration
  const QUICK_PROMPTS = [
    { label: '🔥 Vì sao đốt than phòng kín gây ngạt?', text: 'Thầy/Cô ơi, vì sao khi đốt than trong phòng kín lại dễ gây ngạt thở và nguy hiểm tới tính mạng?' },
    { label: '⚛️ Cấu tạo nguyên tử Calcium (Ca)', text: 'Cho em tìm hiểu về cấu tạo nguyên tử của Calcium (Canxi) và khối lượng nguyên tử của nó?' },
    { label: '🌱 Quá trình quang hợp cần chất khí gì?', text: 'Cây xanh thực hiện quang hợp vào ban ngày cần lấy khí gì từ không khí và nhả ra khí gì?' },
    { label: '🧪 Mở bảng tuần hoàn nguyên tố', text: 'Tôi muốn mở Bảng tuần hoàn các nguyên tố hóa học để xem' },
    { label: '⚖️ Cân bằng phương trình Fe + O2', text: 'Hướng dẫn em cân bằng phương trình phản ứng giữa Fe và O2' },
    { label: '🎯 Mở Vòng quay may mắn', text: 'Mở Vòng quay may mắn để kiểm tra bài cũ học sinh' }
  ];

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setMessages(scenario.socratesDialogue);
    playPop();
  };

  const executeAction = (actionStr) => {
    if (!actionStr) return;
    playPop();

    // Format: [ACTION:NAVIGATE:target:subTarget]
    const match = actionStr.match(/\[ACTION:NAVIGATE:([^:\]]+)(?::([^\]]+))?\]/);
    if (match) {
      const tab = match[1];
      const subTab = match[2];
      if (typeof onNavigateTab === 'function') {
        onNavigateTab(tab, subTab);
      }
    }
  };

  const handleSendMessage = async (userQuery) => {
    const textToSend = typeof userQuery === 'string' ? userQuery : inputQuestion;
    if (!textToSend.trim() || isThinking) return;

    const userText = textToSend.trim();
    setInputQuestion('');
    playPop();

    const updatedMessages = [...messages, { role: 'student', text: userText }];
    setMessages(updatedMessages);
    setIsThinking(true);

    try {
      const serverlessRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText,
          messages: updatedMessages,
          grade: 8 
        })
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
      console.warn('Serverless chat call failed, falling back to local Socrates heuristic', e.message);
    }

    // Local Socrates Heuristic Fallback (100% Reliable Offline)
    setTimeout(() => {
      let aiReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('bảng tuần hoàn') || lower.includes('nguyên tố')) {
        aiReply = 'Thầy/Cô và các em có thể tra cứu chi tiết 118 nguyên tố hóa học, xem mô hình electron Bohr 3D và khay phản ứng tương tác trực quan ngay tại Bảng Tuần Hoàn IUPAC!\n\n[ACTION:NAVIGATE:lab:periodic]';
      } else if (lower.includes('phương trình') || lower.includes('cân bằng') || lower.includes('fe + o2') || lower.includes('h2 + o2')) {
        aiReply = 'Em muốn mô phỏng phản ứng hóa học nào? EduHub có công cụ Cân Bằng Phương Trình & Mô Phỏng Hiện Tượng Ống Nghiệm (sủi bọt khí, kết tủa, tỏa nhiệt) rất trực quan!\n\n[ACTION:NAVIGATE:lab:toolkit]';
      } else if (lower.includes('vòng quay') || lower.includes('bài cũ') || lower.includes('quay số')) {
        aiReply = 'Để khởi động tiết học và kiểm tra bài cũ bằng trò chơi vòng quay may mắn có nhạc thưởng, em hãy mở Vòng Quay May Mắn nhé!\n\n[ACTION:NAVIGATE:games:wheel]';
      } else if (lower.includes('đề thi') || lower.includes('ma trận') || lower.includes('kiểm tra')) {
        aiReply = 'Thầy/Cô có thể tạo đề kiểm tra đánh giá năng lực chuẩn Thông tư 22 và ma trận Bộ GD&ĐT tại Ngân Hàng Đề Thi!\n\n[ACTION:NAVIGATE:exam]';
      } else if (lower.includes('quang hợp') || lower.includes('cây')) {
        aiReply = 'Chào em! Quang hợp là một quá trình kì diệu của tự nhiên. Em thử nhớ lại xem: Để tổng hợp nên chất hữu cơ (Glucose) và giải phóng khí Oxygen, lá cây cần hấp thụ ánh sáng mặt trời và hút chất khí nào từ không khí? Thử ghép lại xem nào!';
      } else if (lower.includes('sấm') || lower.includes('chớp') || lower.includes('sét')) {
        aiReply = 'Một hiện tượng thiên nhiên rất kì thú! Tia sét tạo ra cả ánh sáng và âm thanh cùng một lúc. Nhưng vận tốc của ánh sáng (~300.000 km/s) và vận tốc âm thanh (~340 m/s) trong không khí chênh lệch nhau như thế nào em nhỉ?';
      } else if (lower.includes('than') || lower.includes('ngạt') || lower.includes('khí độc')) {
        aiReply = 'Thắc mắc này rất quan trọng đối với an toàn đời sống! Khi đốt than trong phòng kín thiếu Oxygen (O₂), than cháy không hoàn toàn sẽ sinh ra khí Carbon monoxide (CO). Khí này không màu, không mùi nhưng liên kết với hemoglobin trong máu nhanh gấp 200 lần Oxygen, khiến cơ thể bị ngạt thở. Em có nhớ phương trình phản ứng sinh ra khí CO không?';
      } else if (lower.includes('canxi') || lower.includes('calcium')) {
        aiReply = 'Calcium (Canxi) có kí hiệu là Ca, số hiệu nguyên tử Z = 20, nằm ở ô số 20, chu kì 4, nhóm IIA trong bảng tuần hoàn. Khối lượng nguyên tử xấp xỉ 40 amu. Canxi là thành phần cốt lõi của xương và răng!\n\n[ACTION:NAVIGATE:lab:periodic]';
      } else {
        aiReply = `Chào em! Thắc mắc về "${userText}" rất hay. Theo phương pháp khám phá khoa học:\nEm hãy thử liên hệ xem hiện tượng này thuộc phân môn nào (Vật lí, Hóa học hay Sinh học)? Và em đã từng quan sát thấy hiện tượng tương tự trong đời sống hàng ngày ở đâu chưa?`;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: aiReply }]);
      setIsThinking(false);
      playTimerBell();
    }, 900);
  };

  const filteredFaqs = SCIENCE_FAQ_LIST.filter(f => 
    f.title.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.summary.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.content.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // Helper to parse action tag from message text
  const parseAction = (text) => {
    if (!text) return null;
    const match = text.match(/\[ACTION:NAVIGATE:([^:\]]+)(?::([^\]]+))?\]/);
    if (!match) return null;

    const tab = match[1];
    const subTab = match[2];

    let actionLabel = 'Mở tính năng trong EduHub';
    let icon = ArrowRight;

    if (tab === 'lab' && subTab === 'periodic') {
      actionLabel = '⚛️ Mở Bảng Tuần Hoàn Nguyên Tố Bohr 3D';
      icon = Atom;
    } else if (tab === 'lab' && subTab === 'toolkit') {
      actionLabel = '🧪 Mở Bục Giảng Số & Cân Bằng PTHH';
      icon = FlaskConical;
    } else if (tab === 'lab' && subTab === 'simulations') {
      actionLabel = '🔬 Mở Phòng Thí Nghiệm Ảo PhET';
      icon = FlaskConical;
    } else if (tab === 'games' && subTab === 'wheel') {
      actionLabel = '🎯 Mở Vòng Quay May Mắn (Kiểm Tra Bài Cũ)';
      icon = Gift;
    } else if (tab === 'games' && subTab === 'battle') {
      actionLabel = '⚔️ Mở Đấu Trường Tri Thức 5 Phút';
      icon = Compass;
    } else if (tab === 'exam') {
      actionLabel = '📝 Mở Ngân Hàng Đề Thi Bộ GD&ĐT';
      icon = FileText;
    } else if (tab === 'classes') {
      actionLabel = '🏫 Mở Quản Lý Lớp Học & Thi Đua';
      icon = Users;
    }

    return {
      rawTag: match[0],
      tab,
      subTab,
      label: actionLabel,
      Icon: icon
    };
  };

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
            Trợ lý AI tuân thủ phương pháp sư phạm Socrates GDPT 2018: <strong>Gợi mở tư duy từng bước</strong>, không giải bài hộ; tích hợp khả năng điều hướng thao tác toàn bộ EduHub!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
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

          {/* Active AI Agent Status Badge */}
          <span 
            className="badge badge-cyan" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '0.45rem 0.8rem', 
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
            AI Agent Sẵn Sàng
          </span>
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
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '640px' }}>
            {/* Active Topic Banner */}
            <div style={{ paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--cyan-primary)', fontWeight: 700 }}>
                  CHUYÊN ĐỀ GỢI MỞ TƯ DUY:
                </div>
                <div style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)' }}>
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

            {/* Quick Prompt Suggestion Chips */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.65rem', marginBottom: '0.5rem', scrollbarWidth: 'none' }}>
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem', whiteSpace: 'nowrap', flexShrink: 0, borderRadius: 'var(--radius-full)' }}
                  onClick={() => handleSendMessage(p.text)}
                  disabled={isThinking}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
              {messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant';
                const actionInfo = isAssistant ? parseAction(m.text) : null;
                let cleanText = actionInfo 
                  ? m.text.replace(/[-*•]?\s*\[ACTION:NAVIGATE:[^\]]+\](?:\s*\([^)]*\))?/g, '').trim() 
                  : m.text;

                if (isAssistant && !cleanText && actionInfo) {
                  cleanText = `Dạ đây ạ! SciBuddy đã chuẩn bị sẵn công cụ theo yêu cầu. Thầy/Cô và các em bấm nút bên dưới để mở ngay nhé!`;
                }

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                      maxWidth: '88%'
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
                          flexShrink: 0,
                          boxShadow: '0 2px 8px var(--cyan-glow)'
                        }}
                      >
                        <Bot size={20} color="#ffffff" />
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
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
                          <div style={{ fontSize: '0.75rem', color: 'var(--cyan-primary)', fontWeight: 800, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={13} /> SciBuddy AI Agent:
                          </div>
                        )}
                        {cleanText}
                      </div>

                      {/* Interactive Agent Action Card */}
                      {actionInfo && (
                        <div 
                          className="glass-card"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            padding: '0.65rem 0.95rem',
                            border: '1.5px solid var(--cyan-primary)',
                            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1), rgba(124, 58, 237, 0.1))',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            <actionInfo.Icon size={16} color="var(--cyan-primary)" />
                            {actionInfo.label}
                          </div>
                          <button
                            className="btn btn-sm btn-primary"
                            style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
                            onClick={() => executeAction(actionInfo.rawTag)}
                          >
                            Mở Ngay <ArrowRight size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={20} color="#ffffff" className="animate-spin-slow" />
                  </div>
                  <div style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="status-dot-pulse"></span> SciBuddy đang suy nghĩ câu hỏi gợi mở cho em...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Field */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputQuestion); }} style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Đặt câu hỏi hoặc nhờ SciBuddy mở công cụ trong EduHub..."
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

          {/* FAQ Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredFaqs.map((faq) => {
              const isSelected = selectedFaq?.id === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    border: isSelected ? '2px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSelectedFaq(isSelected ? null : faq)}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className={`badge ${faq.subject === 'physics' ? 'badge-physics' : faq.subject === 'chemistry' ? 'badge-chemistry' : 'badge-biology'}`}>
                        {faq.subject === 'physics' ? '⚡ Vật lí' : faq.subject === 'chemistry' ? '🧪 Hóa học' : '🌿 Sinh học'} • Lớp {faq.grade}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {isSelected ? 'Thu gọn ▲' : 'Xem giải thích ▼'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                      {faq.title}
                    </h4>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
                      {faq.summary}
                    </p>
                  </div>

                  {isSelected && (
                    <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-sm)', borderTop: '2px solid var(--cyan-primary)', marginTop: '0.5rem', animation: 'fadeIn 0.2s ease' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--cyan-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={15} /> BẢN CHẤT KHOA HỌC:
                      </div>
                      <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                        {faq.content}
                      </div>

                      <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('chat');
                            handleSendMessage(`Em muốn tìm hiểu sâu hơn về hiện tượng: "${faq.title}"`);
                          }}
                        >
                          Hỏi sâu thêm với SciBuddy AI <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
