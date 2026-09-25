import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle, 
  Send, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Plus,
  Pin,
  MessageCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { playPop, playVictoryFanfare } from '../utils/soundEffects';

const INITIAL_QUESTIONS = [
  {
    id: 1,
    grade: 8,
    chapter: 'Chương I: Động học & Quán tính',
    subject: 'physics',
    title: 'Tại sao khi ta phanh gấp xe đạp thì người lại có xu hướng chúi về phía trước?',
    author: 'Nguyễn Minh Anh',
    realName: 'Nguyễn Minh Anh',
    isAnonymous: false,
    upvotes: 8,
    time: 'Hôm qua lúc 19:30',
    teacherAnswer: 'Chào Minh Anh, đây là do QUÁN TÍNH của vật! Khi xe dừng lại đột ngột, phần dưới cơ thể tiếp xúc với yên xe dừng lại theo, nhưng phần trên cơ thể vẫn tiếp tục chuyển động về phía trước theo vận tốc cũ do quán tính.',
    isPinned: true
  },
  {
    id: 2,
    grade: 8,
    chapter: 'Chương II: Phản ứng hóa học & Vôi tôi',
    subject: 'chemistry',
    title: 'Thầy ơi, nước vôi trong để ngoài không khí lâu ngày có lớp váng trắng mỏng trên mặt là chất gì ạ?',
    author: 'Trần Đức Hải',
    realName: 'Trần Đức Hải',
    isAnonymous: false,
    upvotes: 6,
    time: '2 ngày trước',
    teacherAnswer: 'Câu hỏi thực tế rất hay! Khí Carbon dioxide (CO₂) trong không khí phản ứng với dung dịch nước vôi trong Ca(OH)₂ tạo thành kết tủa canxi cacbonat (CaCO₃) không tan, chính là lớp váng trắng mỏng đó em: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O.',
    isPinned: false
  },
  {
    id: 3,
    grade: 8,
    chapter: 'Chương VII: Cơ thể người & Tuần hoàn',
    subject: 'biology',
    title: 'Tại sao khi chạy nhanh một quãng đường dài thì nhịp tim và nhịp thở của chúng ta lại tăng lên dồn dập?',
    author: 'Học sinh ẩn danh',
    realName: 'Lê Thùy Dương',
    isAnonymous: true,
    upvotes: 11,
    time: '3 ngày trước',
    teacherAnswer: 'Khi chạy nhanh, các cơ bắp hoạt động mạnh đòi hỏi rất nhiều năng lượng. Quá trình tạo năng lượng cần nhiều Oxygen (O₂) và thải ra nhiều CO₂. Do đó, tim phải đập nhanh hơn để bơm máu mang oxy đến cơ bắp và phổi phải thở dồn dập để trao đổi khí kịp thời!',
    isPinned: true
  },
  {
    id: 4,
    grade: 7,
    chapter: 'Chương III: Tốc độ chuyển động',
    subject: 'physics',
    title: 'Thầy cô cho em hỏi: Thiết bị "bắn tốc độ" của các chú Cảnh sát giao thông hoạt động dựa trên nguyên lý nào ạ?',
    author: 'Học sinh ẩn danh',
    realName: 'Vũ Bảo Long',
    isAnonymous: true,
    upvotes: 5,
    time: '1 giờ trước',
    teacherAnswer: null,
    isPinned: false
  }
];

export default function QABoard({ currentClass }) {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [showAskModal, setShowAskModal] = useState(false);

  // Teacher Reply State
  const [replyingQId, setReplyingQId] = useState(null);
  const [replyInputText, setReplyInputText] = useState('');

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('physics');
  const [newGrade, setNewGrade] = useState(currentClass?.grade || 8);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const filteredQuestions = questions.filter(q => {
    const matchSub = filterSubject === 'all' || q.subject === filterSubject;
    const matchGrade = filterGrade === 'all' || q.grade === Number(filterGrade);
    return matchSub && matchGrade;
  });

  const handleUpvote = (id) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, upvotes: q.upvotes + 1 };
      }
      return q;
    }));
    playPop();
  };

  const handleTogglePin = (id) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, isPinned: !q.isPinned };
      }
      return q;
    }));
    playPop();
  };

  const handleSubmitReply = (qId) => {
    if (!replyInputText.trim()) return;

    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return { ...q, teacherAnswer: replyInputText.trim() };
      }
      return q;
    }));

    setReplyingQId(null);
    setReplyInputText('');
    playVictoryFanfare();
  };

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const studentName = currentClass?.students[0]?.name || 'Học sinh lớp';
    const newQ = {
      id: Date.now(),
      grade: Number(newGrade),
      chapter: `Khối ${newGrade} - KHTN 2018`,
      subject: newSubject,
      title: newTitle,
      author: isAnonymous ? 'Học sinh ẩn danh' : studentName,
      realName: studentName,
      isAnonymous: isAnonymous,
      upvotes: 1,
      time: 'Vừa xong',
      teacherAnswer: null,
      isPinned: false
    };

    setQuestions([newQ, ...questions]);
    setNewTitle('');
    setShowAskModal(false);
    playPop();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle color="#06b6d4" size={24} />
            Diễn Đàn Hỏi Đáp KHTN Sau Giờ Học ({currentClass?.name})
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Học sinh đặt câu hỏi thắc mắc bài tập về nhà; Giáo viên phản hồi trực tiếp, ghim lời giải chuẩn và bảo vệ quyền ẩn danh!
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAskModal(true)}>
          <Plus size={16} /> Đặt Câu Hỏi Mới
        </button>
      </div>

      {/* Filter Tabs: Grade & Subject */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Grade Filter */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Khối:</span>
          {['all', 6, 7, 8, 9].map((g) => (
            <button
              key={g}
              className={`btn btn-sm ${filterGrade.toString() === g.toString() ? 'btn-cyan' : 'btn-secondary'}`}
              onClick={() => { setFilterGrade(g); playPop(); }}
            >
              {g === 'all' ? 'Tất Cả Khối' : `Lớp ${g}`}
            </button>
          ))}
        </div>

        {/* Subject Filter */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Môn:</span>
          <button
            className={`btn btn-sm ${filterSubject === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setFilterSubject('all'); playPop(); }}
          >
            Tất Cả ({questions.length})
          </button>
          <button
            className={`btn btn-sm ${filterSubject === 'physics' ? 'btn-physics' : 'btn-secondary'}`}
            onClick={() => { setFilterSubject('physics'); playPop(); }}
          >
            ⚡ Vật Lí
          </button>
          <button
            className={`btn btn-sm ${filterSubject === 'chemistry' ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => { setFilterSubject('chemistry'); playPop(); }}
          >
            🧪 Hóa Học
          </button>
          <button
            className={`btn btn-sm ${filterSubject === 'biology' ? 'btn-emerald' : 'btn-secondary'}`}
            onClick={() => { setFilterSubject('biology'); playPop(); }}
          >
            🌿 Sinh Học
          </button>
        </div>
      </div>

      {/* Questions Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredQuestions.map((q) => (
          <div 
            key={q.id}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderLeft: q.isPinned ? '5px solid #f59e0b' : '1px solid var(--border-subtle)',
              position: 'relative'
            }}
          >
            {/* Top metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span className={`badge ${q.subject === 'physics' ? 'badge-physics' : q.subject === 'chemistry' ? 'badge-chemistry' : 'badge-biology'}`}>
                  {q.subject === 'physics' ? '⚡ Vật lí' : q.subject === 'chemistry' ? '🧪 Hóa học' : '🌿 Sinh học'}
                </span>
                <span className="badge" style={{ background: 'var(--border-subtle)', color: 'var(--text-main)', fontSize: '0.75rem' }}>
                  KHTN Lớp {q.grade}
                </span>
                {q.isPinned && (
                  <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Pin size={12} /> Ghim Hay Nhất
                  </span>
                )}
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Hỏi bởi <strong>{q.author}</strong>
                  {q.isAnonymous && (
                    <span style={{ color: 'var(--cyan-light)', marginLeft: '6px', fontSize: '0.75rem' }}>
                      (Chỉ GV thấy: {q.realName})
                    </span>
                  )} • {q.time}
                </span>
              </div>

              {/* Action Buttons: Pin & Upvote */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  className={`btn btn-sm ${q.isPinned ? 'btn-amber' : 'btn-secondary'}`}
                  onClick={() => handleTogglePin(q.id)}
                  title={q.isPinned ? 'Bỏ ghim câu hỏi này' : 'Ghim câu hỏi lên đầu'}
                >
                  <Pin size={13} /> {q.isPinned ? 'Đã Ghim' : 'Ghim'}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleUpvote(q.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <ThumbsUp size={14} color="#06b6d4" />
                  <span>{q.upvotes}</span> Thích
                </button>
              </div>
            </div>

            {/* Question Title */}
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.85rem', lineHeight: '1.5' }}>
              {q.title}
            </h3>

            {/* Teacher Answer Box */}
            {q.teacherAnswer ? (
              <div 
                style={{
                  background: 'var(--bg-surface-hover)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  borderLeft: '4px solid #10b981',
                  marginTop: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                    <ShieldCheck size={16} /> GIÁO VIÊN ĐÃ PHẢN HỒI:
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', height: '24px', padding: '0 6px' }}
                    onClick={() => {
                      setReplyingQId(q.id);
                      setReplyInputText(q.teacherAnswer);
                    }}
                  >
                    Chỉnh sửa
                  </button>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                  {q.teacherAnswer}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  ⏳ Đang chờ Giáo viên phản hồi...
                </span>
                <button
                  className="btn btn-emerald btn-sm"
                  onClick={() => {
                    setReplyingQId(q.id);
                    setReplyInputText('');
                  }}
                >
                  <MessageCircle size={14} /> Thầy/Cô Trả Lời Câu Này
                </button>
              </div>
            )}

            {/* Inline Teacher Reply Form */}
            {replyingQId === q.id && (
              <div style={{ marginTop: '1rem', background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--emerald-primary)' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--emerald-light)', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                  Nhập Lời Giải & Phản Hồi Sư Phạm Cho Học Sinh:
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Nhập hướng dẫn giải, phân tích hiện tượng tự nhiên..."
                  value={replyInputText}
                  onChange={(e) => setReplyInputText(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.6rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setReplyingQId(null)}>
                    Hủy Bỏ
                  </button>
                  <button className="btn btn-emerald btn-sm" onClick={() => handleSubmitReply(q.id)}>
                    <Send size={14} /> Gửi Phản Hồi
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div 
          className="modal-backdrop"
          onClick={() => setShowAskModal(false)}
        >
          <div 
            className="modal-content"
            style={{ width: '560px', maxWidth: '95vw', padding: '1.75rem', border: '1px solid var(--cyan-primary)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Gửi Câu Hỏi Cho Thầy/Cô</h3>
            <form onSubmit={handleCreateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Khối Lớp:
                  </label>
                  <select
                    className="form-select"
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value))}
                  >
                    <option value={6}>KHTN Lớp 6</option>
                    <option value={7}>KHTN Lớp 7</option>
                    <option value={8}>KHTN Lớp 8</option>
                    <option value={9}>KHTN Lớp 9</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Phân môn Khoa học:
                  </label>
                  <select 
                    className="form-select"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  >
                    <option value="physics">⚡ Vật Lí (Cơ, Nhiệt, Điện, Quang)</option>
                    <option value="chemistry">🧪 Hóa Học (Chất, Phản ứng, Nguyên tử)</option>
                    <option value="biology">🌿 Sinh Học (Tế bào, Cơ thể, Sinh thái)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Nội dung câu hỏi thắc mắc:
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Ví dụ: Thầy ơi cho em hỏi vì sao khi chạm tay vào nước đá lại cảm thấy lạnh buốt ạ?..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="anonCheck" style={{ fontSize: '0.88rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  Hỏi ẩn danh (bạn cùng lớp sẽ không nhìn thấy tên em, nhưng giáo viên vẫn nắm được danh tính)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAskModal(false)}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Gửi Câu Hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
