import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  RotateCcw, 
  Star, 
  HelpCircle, 
  Trophy, 
  Smile, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPop, playVictoryFanfare, playTimerBell } from '../utils/soundEffects';

const INITIAL_BOXES = [
  {
    id: 1,
    title: 'Hộp Quà Số 1',
    color: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    type: 'question',
    subject: 'Vật lí',
    content: 'Đơn vị đo lực trong hệ SI là gì? Để đo độ lớn của lực trong phòng thí nghiệm KHTN ta dùng dụng cụ nào?',
    reward: '+1 Sao ⭐',
    badge: '⚡ Vật lí'
  },
  {
    id: 2,
    title: 'Hộp Quà Số 2',
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    type: 'lucky',
    subject: 'May mắn',
    content: '🎉 CHÚC MỪNG EM! Chiếc thẻ may mắn: Miễn kiểm tra bài cũ hôm nay và nhận ngay 1 tràng pháo tay rực rỡ từ cả lớp!',
    reward: '+1 Sao May Mắn ⭐',
    badge: '🎁 Quà Tặng'
  },
  {
    id: 3,
    title: 'Hộp Quà Số 3',
    color: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    type: 'question',
    subject: 'Hóa học',
    content: 'Theo danh pháp quốc tế IUPAC, chất có công thức NaCl tên là gì và có ứng dụng gì trong bữa ăn hàng ngày?',
    reward: '+2 Sao ⭐⭐',
    badge: '🧪 Hóa học'
  },
  {
    id: 4,
    title: 'Hộp Quà Số 4',
    color: 'linear-gradient(135deg, #10b981, #047857)',
    type: 'question',
    subject: 'Sinh học',
    content: 'Kể tên 3 thành phần cấu tạo cơ bản của mọi tế bào sinh vật (nhân sơ hoặc nhân thực)?',
    reward: '+1 Sao ⭐',
    badge: '🌿 Sinh học'
  },
  {
    id: 5,
    title: 'Hộp Quà Số 5',
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
    type: 'challenge',
    subject: 'Thử thách',
    content: '🔥 THỬ THÁCH X2 SAO: Em có 20 giây để kể tên 5 nguyên tố hóa học có trong cơ thể người!',
    reward: '+3 Sao ⭐⭐⭐',
    badge: '🔥 Nhân Đôi'
  },
  {
    id: 6,
    title: 'Hộp Quà Số 6',
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    type: 'partner',
    subject: 'Đồng đội',
    content: '🤝 TRỢ GIÚP ĐỒNG ĐỘI: Em được quyền chọn 1 bạn thân cùng bàn lên bảng hỗ trợ trả lời câu hỏi KHTN bất kỳ!',
    reward: 'Cả 2 cùng nhận Sao ⭐',
    badge: '🤝 Đồng Đội'
  }
];

export default function MysteryBoxes({ currentClass, onAddStar }) {
  const students = currentClass?.students || [];
  const [boxes, setBoxes] = useState(INITIAL_BOXES);
  const [openedBoxIds, setOpenedBoxIds] = useState([]);
  const [activeBoxModal, setActiveBoxModal] = useState(null);
  const [selectedStudentForReward, setSelectedStudentForReward] = useState('');
  const [rewardAwarded, setRewardAwarded] = useState(false);

  const handleOpenBox = (box) => {
    if (openedBoxIds.includes(box.id)) {
      setActiveBoxModal(box);
      return;
    }

    setOpenedBoxIds(prev => [...prev, box.id]);
    setActiveBoxModal(box);
    playPop();

    if (box.type === 'lucky' || box.type === 'challenge') {
      playVictoryFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      playTimerBell();
    }
  };

  const handleReset = () => {
    setOpenedBoxIds([]);
    setActiveBoxModal(null);
    playPop();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gift color="#f59e0b" size={24} />
            Hộp Quà Bí Ẩn (Mystery Boxes - Khởi Động Vui Nhộn)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Học sinh được gọi lên bảng tự chọn 1 hộp quà chứa câu hỏi hoặc món quà miễn kiểm tra bất ngờ!
          </p>
        </div>

        <button className="btn btn-secondary" onClick={handleReset}>
          <RotateCcw size={16} /> Đóng Lại Tất Cả Hộp Quà
        </button>
      </div>

      {/* Grid of 6 Mystery Boxes */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {boxes.map((box) => {
          const isOpened = openedBoxIds.includes(box.id);

          return (
            <div
              key={box.id}
              className="glass-card"
              style={{
                background: isOpened 
                  ? 'var(--bg-surface-elevated)' 
                  : box.color,
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                transform: isOpened ? 'none' : 'scale(1)',
                border: isOpened ? '1.5px solid var(--border-subtle)' : 'none',
                boxShadow: isOpened ? 'none' : '0 10px 25px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onClick={() => handleOpenBox(box)}
            >
              {!isOpened ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="animate-float" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))' }}>
                    <Gift size={64} color="#ffffff" />
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                    {box.title}
                  </div>
                  <span className="badge badge-pill" style={{ background: 'rgba(0, 0, 0, 0.3)', color: '#ffffff' }}>
                    Chạm để mở quà 🎁
                  </span>
                </div>
              ) : (
                <div style={{ padding: '1rem', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="badge badge-cyan">{box.badge}</span>
                    <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>{box.reward}</span>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.5rem 0' }}>
                    {box.title} (Đã Mở)
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {box.content.length > 80 ? box.content.substring(0, 80) + '...' : box.content}
                  </p>
                  <button 
                    className="btn btn-outline-cyan btn-sm" 
                    style={{ marginTop: '0.75rem', width: '100%' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBoxModal(box);
                    }}
                  >
                    Xem Chi Tiết Câu Hỏi
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Detailed Box Content */}
      {activeBoxModal && (
        <div 
          className="modal-backdrop"
          onClick={() => setActiveBoxModal(null)}
        >
          <div 
            className="modal-content animate-pulse-glow"
            style={{ 
              width: '520px', 
              maxWidth: '95vw', 
              padding: '2rem', 
              border: '2px solid var(--cyan-primary)',
              textAlign: 'center' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge badge-amber" style={{ fontSize: '0.9rem', padding: '0.35rem 0.85rem' }}>
                {activeBoxModal.badge}
              </span>
            </div>

            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              {activeBoxModal.title}
            </h3>

            <div 
              style={{
                background: 'var(--bg-surface-hover)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '1.1rem',
                color: 'var(--text-main)',
                lineHeight: '1.6',
                borderLeft: '4px solid var(--cyan-primary)',
                borderTop: '1px solid var(--border-subtle)',
                borderRight: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                textAlign: 'left',
                margin: '1.25rem 0'
              }}
            >
              {activeBoxModal.content}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.1rem', color: '#f59e0b', fontWeight: 700, margin: '1rem 0' }}>
              <Star fill="currentColor" size={22} /> Phần Thưởng: {activeBoxModal.reward}
            </div>

            {/* Teacher Award Star Section */}
            {onAddStar && students.length > 0 && (
              <div style={{ 
                background: 'var(--bg-surface)', 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-subtle)',
                textAlign: 'left'
              }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  ⭐ Tuyên Dương & Cộng Sao Trực Tiếp Vào Sổ Lớp:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    className="input-control"
                    style={{ flex: 1, padding: '0.5rem' }}
                    value={selectedStudentForReward || students[0]?.name || ''}
                    onChange={(e) => setSelectedStudentForReward(e.target.value)}
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.team || 'Chưa chia tổ'} - Hiện có: {s.stars || 0} ⭐)
                      </option>
                    ))}
                  </select>
                  <button 
                    className="btn btn-amber btn-sm"
                    disabled={rewardAwarded}
                    onClick={() => {
                      const targetName = selectedStudentForReward || students[0]?.name;
                      const starsToAdd = activeBoxModal.reward.includes('3') ? 3 : activeBoxModal.reward.includes('2') ? 2 : 1;
                      if (targetName && onAddStar) {
                        onAddStar(targetName, starsToAdd);
                        setRewardAwarded(true);
                        playVictoryFanfare();
                        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
                      }
                    }}
                  >
                    <CheckCircle2 size={16} /> {rewardAwarded ? 'Đã Tặng Sao!' : '+ Tặng Sao'}
                  </button>
                </div>
                {rewardAwarded && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={14} /> Đã cộng sao thành công vào hồ sơ học sinh!
                  </div>
                )}
              </div>
            )}

            <button 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', marginTop: '0.5rem' }}
              onClick={() => {
                setActiveBoxModal(null);
                setRewardAwarded(false);
              }}
            >
              Đóng Hộp Quà
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
