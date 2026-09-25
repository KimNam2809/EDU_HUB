import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  UserCheck, 
  Trash2, 
  Sparkles, 
  Star, 
  Trophy, 
  History, 
  HelpCircle,
  Award
} from 'lucide-react';
import { playWheelTick, playVictoryFanfare, playPop } from '../utils/soundEffects';

const SEGMENT_COLORS = [
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#f97316', // Orange
  '#6366f1'  // Indigo
];

export default function LuckyWheel({ currentClass, onAddStar, questionBank }) {
  const canvasRef = useRef(null);
  const [wheelMode, setWheelMode] = useState('name'); // 'name', 'number', 'team'
  const [candidates, setCandidates] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);
  const [autoRemoveWinner, setAutoRemoveWinner] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // Animation refs
  const currentAngleRef = useRef(0);
  const spinVelocityRef = useRef(0);
  const animationFrameRef = useRef(null);
  const lastSegmentIndexRef = useRef(-1);

  // Generate candidates based on mode
  const populateCandidates = (mode, cls = currentClass) => {
    if (mode === 'name') {
      return cls?.students ? cls.students.map(s => s.name) : [];
    } else if (mode === 'number') {
      const count = cls?.students?.length || 36;
      return Array.from({ length: count }, (_, i) => `Số ${i + 1}`);
    } else if (mode === 'team') {
      return ['Tổ 1 (Nhóm 1)', 'Tổ 2 (Nhóm 2)', 'Tổ 3 (Nhóm 3)', 'Tổ 4 (Nhóm 4)'];
    }
    return [];
  };

  // Sync candidates when class changes or mode changes
  useEffect(() => {
    setCandidates(populateCandidates(wheelMode, currentClass));
    setWinner(null);
  }, [currentClass, wheelMode]);

  const handleSwitchMode = (mode) => {
    setWheelMode(mode);
    setCandidates(populateCandidates(mode, currentClass));
    setWinner(null);
    playPop();
  };

  // Keyboard shortcut: Spacebar to spin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isSpinning && candidates.length > 0 && !winner) {
        e.preventDefault();
        startSpin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, candidates, winner]);

  // Draw wheel on canvas
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 25;

    ctx.clearRect(0, 0, width, height);

    const totalSegments = candidates.length;
    if (totalSegments === 0) {
      // Empty state
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 16px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Chưa có học sinh trong danh sách', centerX, centerY);
      return;
    }

    const anglePerSegment = (2 * Math.PI) / totalSegments;

    // Draw wheel segments
    for (let i = 0; i < totalSegments; i++) {
      const startAngle = currentAngleRef.current + i * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#0a0e17';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw student text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.font = totalSegments > 24 ? '600 11px Outfit' : totalSegments > 15 ? '600 13px Outfit' : '700 15px Outfit';
      ctx.fillText(candidates[i], radius - 20, 0);
      ctx.restore();
    }

    // Draw outer glowing ring & rim LED dots
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Draw center hub (metallic science core)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 38, 0, 2 * Math.PI);
    const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 38);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.7, '#0f172a');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Outfit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('KHTN', centerX, centerY);
  };

  useEffect(() => {
    drawWheel();
  }, [candidates]);

  // Start spinning
  const startSpin = () => {
    if (isSpinning || candidates.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    setSelectedQuestion(null);
    playPop();

    // Random initial high velocity + random duration
    const minSpins = 5;
    const maxSpins = 8;
    const randomFullTurns = (minSpins + Math.random() * (maxSpins - minSpins)) * 2 * Math.PI;
    const randomOffset = Math.random() * 2 * Math.PI;
    const targetAngle = currentAngleRef.current + randomFullTurns + randomOffset;
    
    const startTime = performance.now();
    const duration = 5500 + Math.random() * 1500; // 5.5 to 7.0 seconds
    const initialAngle = currentAngleRef.current;

    // Cubic-ease-out function
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      currentAngleRef.current = initialAngle + (targetAngle - initialAngle) * easedProgress;

      // Calculate which segment the pointer is currently at (Pointer is fixed on the right at angle 0)
      const normalizedAngle = (2 * Math.PI - (currentAngleRef.current % (2 * Math.PI))) % (2 * Math.PI);
      const segmentAngle = (2 * Math.PI) / candidates.length;
      const currentSegmentIndex = Math.floor(normalizedAngle / segmentAngle) % candidates.length;

      // Play tick sound whenever pointer crosses into a new segment
      if (currentSegmentIndex !== lastSegmentIndexRef.current) {
        lastSegmentIndexRef.current = currentSegmentIndex;
        playWheelTick();
      }

      drawWheel();

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        setIsSpinning(false);
        const winningStudent = candidates[currentSegmentIndex];
        setWinner(winningStudent);
        setHistory(prev => [{ name: winningStudent, time: new Date().toLocaleTimeString('vi-VN') }, ...prev]);

        // Victory sound and confetti
        playVictoryFanfare();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        // Automatically assign a random question for review
        if (questionBank && questionBank.length > 0) {
          const randomQ = questionBank[Math.floor(Math.random() * questionBank.length)];
          setSelectedQuestion(randomQ);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleRewardStar = (count = 1) => {
    if (winner && onAddStar) {
      onAddStar(winner, count);
      playPop();
    }
  };

  const handleRemoveWinner = () => {
    if (winner) {
      setCandidates(prev => prev.filter(c => c !== winner));
      setWinner(null);
      playPop();
    }
  };

  const handleResetList = () => {
    setCandidates(populateCandidates(wheelMode, currentClass));
    setWinner(null);
    playPop();
  };

  return (
    <div className="lucky-wheel-grid">
      {/* Left: Canvas Wheel Container */}
      <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles color="#06b6d4" size={22} />
              Vòng Quay May Mắn (Kiểm Tra Bài Cũ)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Nhấn <strong>Phím Space</strong> hoặc nút <strong>QUAY SỐ</strong> để chọn ngẫu nhiên học sinh lên bảng!
            </p>
          </div>
          <span className="badge badge-cyan">
            Còn lại: {candidates.length} {wheelMode === 'team' ? 'tổ' : 'mục'}
          </span>
        </div>

        {/* Wheel Mode Selector Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', width: '100%', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${wheelMode === 'name' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleSwitchMode('name')}
            disabled={isSpinning}
          >
            👤 Theo Tên Học Sinh
          </button>
          <button
            className={`btn btn-sm ${wheelMode === 'number' ? 'btn-physics' : 'btn-secondary'}`}
            onClick={() => handleSwitchMode('number')}
            disabled={isSpinning}
          >
            🔢 Theo Số Thứ Tự (STT)
          </button>
          <button
            className={`btn btn-sm ${wheelMode === 'team' ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => handleSwitchMode('team')}
            disabled={isSpinning}
          >
            👥 Theo Tổ / Nhóm (Tổ 1 - 4)
          </button>
        </div>

        {/* Wheel & Pointer wrapper */}
        <div style={{ position: 'relative', width: '460px', height: '460px', maxWidth: '100%', margin: '0.5rem 0' }}>
          <canvas 
            ref={canvasRef} 
            width={460} 
            height={460} 
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
          {/* Fixed Right Pointer Indicator */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              right: '-14px',
              transform: 'translateY(-50%)',
              width: '0',
              height: '0',
              borderTop: '16px solid transparent',
              borderBottom: '16px solid transparent',
              borderRight: '30px solid #f43f5e',
              filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.8))',
              zIndex: 10
            }}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={startSpin}
            disabled={isSpinning || candidates.length === 0}
            style={{ minWidth: '180px', fontWeight: 800, fontSize: '1.15rem' }}
          >
            <Play size={20} fill="currentColor" />
            {isSpinning ? 'ĐANG QUAY...' : 'QUAY SỐ (SPACE)'}
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleResetList}
            disabled={isSpinning}
            title="Khôi phục danh sách đầy đủ cả lớp"
          >
            <RotateCcw size={16} />
            Làm Mới Danh Sách
          </button>
        </div>

        {/* Winner Announcement Card */}
        {winner && (
          <div 
            className="glass-card animate-pulse-glow"
            style={{ 
              marginTop: '1.5rem', 
              width: '100%', 
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(124, 58, 237, 0.15))',
              border: '2px solid var(--cyan-primary)',
              textAlign: 'center',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#d97706', fontWeight: 800, fontSize: '0.95rem' }}>
              <Trophy size={20} />
              CHÚC MỪNG HỌC SINH ĐƯỢC CHỌN!
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.5rem 0', letterSpacing: '-0.02em' }}>
              {winner}
            </div>

            {selectedQuestion && (
              <div style={{ 
                background: 'var(--bg-surface)', 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                margin: '0.75rem 0',
                border: '1.5px solid var(--border-subtle)',
                borderLeft: '4px solid var(--chemistry-amber)',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--chemistry-amber)', fontWeight: 700, marginBottom: '0.2rem' }}>
                  🎯 CÂU HỎI BÀI CŨ GỢI Ý ({selectedQuestion.subject.toUpperCase()} - {selectedQuestion.level}):
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {selectedQuestion.question}
                </div>
              </div>
            )}

            {/* Quick Reward Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button 
                className="btn btn-amber btn-sm"
                onClick={() => handleRewardStar(1)}
              >
                <Star size={16} fill="currentColor" />
                Cộng 1 Sao ⭐
              </button>
              <button 
                className="btn btn-amber btn-sm"
                onClick={() => handleRewardStar(2)}
              >
                <Award size={16} />
                Trả Lời Giỏi (+2 Sao)
              </button>
              <button 
                className="btn btn-danger btn-sm"
                onClick={handleRemoveWinner}
                title="Loại học sinh này khỏi vòng quay các lượt tiếp theo để không trùng"
              >
                <UserCheck size={16} />
                Loại Khỏi Vòng Quay
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: History & Candidate Quick Toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Call History Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <History size={18} color="var(--physics-light)" />
              Lịch Sử Gọi Bài Cũ Hôm Nay
            </h3>
            <span className="badge badge-physics">{history.length} lượt</span>
          </div>

          {history.length === 0 ? (
            <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '1.5rem 0', fontSize: '0.88rem' }}>
              Chưa có lượt quay nào trong tiết học này.
            </div>
          ) : (
            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {history.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.85rem',
                    background: 'var(--bg-surface-hover)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    #{history.length - idx}. {item.name}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Candidate List Viewer */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Danh Sách Học Sinh Trong Vòng Quay
            </h3>
            <span className="badge badge-emerald">{candidates.length} bạn</span>
          </div>

          <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {candidates.map((name, idx) => (
              <span 
                key={idx}
                className="badge badge-cyan"
                style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem' }}
              >
                {name}
                <Trash2 
                  size={12} 
                  style={{ marginLeft: '4px', cursor: 'pointer', opacity: 0.7 }}
                  onClick={() => {
                    setCandidates(prev => prev.filter(c => c !== name));
                    playPop();
                  }}
                  title="Xoá bạn này khỏi vòng quay"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
