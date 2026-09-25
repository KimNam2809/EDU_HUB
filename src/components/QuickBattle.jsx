import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Sparkles, 
  Timer, 
  Trophy, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playVictoryFanfare, playBuzzer, playPop, playWheelTick } from '../utils/soundEffects';

export default function QuickBattle({ currentClass, questionBank, onAddStar }) {
  const students = currentClass?.students || [];
  const [playerA, setPlayerA] = useState(students[0]?.name || 'Học sinh 1');
  const [playerB, setPlayerB] = useState(students[1]?.name || 'Học sinh 2');

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isBattleRunning, setIsBattleRunning] = useState(false);
  const [battleFinished, setBattleFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAwardedStars, setHasAwardedStars] = useState(false);

  // Sync player names if class changes
  useEffect(() => {
    if (students.length >= 2) {
      setPlayerA(students[0].name);
      setPlayerB(students[1].name);
    }
  }, [currentClass]);

  const questions = questionBank || [];
  const currentQ = questions[currentQIndex % questions.length];

  // Timer countdown effect
  useEffect(() => {
    let timerId = null;
    if (isBattleRunning && timeLeft > 0 && !battleFinished) {
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 4) playWheelTick();
          if (prev <= 1) {
            playBuzzer();
            handleNextQuestion();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isBattleRunning, timeLeft, battleFinished]);

  const handleStartBattle = () => {
    setScoreA(0);
    setScoreB(0);
    setCurrentQIndex(0);
    setTimeLeft(15);
    setBattleFinished(false);
    setHasAwardedStars(false);
    setIsBattleRunning(true);
    playPop();
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 >= 5) {
      // 5 questions finished
      setIsBattleRunning(false);
      setBattleFinished(true);
      playVictoryFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(15);
      setSelectedAnswer(null);
    }
  };

  const handlePlayerPoint = (player) => {
    if (player === 'A') setScoreA(prev => prev + 1);
    if (player === 'B') setScoreB(prev => prev + 1);
    playPop();
    handleNextQuestion();
  };

  const pickRandomTwoStudents = () => {
    if (students.length < 2) return;
    const shuffled = [...students].sort(() => 0.5 - Math.random());
    setPlayerA(shuffled[0].name);
    setPlayerB(shuffled[1].name);
    playPop();
  };

  const handleAwardStars = () => {
    if (!onAddStar || hasAwardedStars) return;
    if (scoreA > scoreB) {
      onAddStar(playerA, 2);
    } else if (scoreB > scoreA) {
      onAddStar(playerB, 2);
    } else {
      onAddStar(playerA, 1);
      onAddStar(playerB, 1);
    }
    setHasAwardedStars(true);
    playVictoryFanfare();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Swords color="#ec4899" size={24} />
            Đấu Trường Tri Thức 5 Phút (Quick Blitz Battle)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Hai học sinh cùng lên bảng thi đấu đối kháng phản xạ nhanh trong 5 câu hỏi!
          </p>
        </div>

        <button className="btn btn-secondary" onClick={pickRandomTwoStudents} disabled={isBattleRunning}>
          <Users size={16} /> Chọn Ngẫu Nhiên 2 Bạn
        </button>
      </div>

      {/* Duel Arena Header: Player A vs Player B */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
        {/* Player A Card */}
        <div 
          className="glass-card" 
          style={{ 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(2, 132, 199, 0.2))',
            border: '2px solid var(--cyan-primary)' 
          }}
        >
          <span className="badge badge-cyan" style={{ marginBottom: '0.4rem' }}>ĐẤU THỦ A</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{playerA}</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--cyan-primary)', marginTop: '0.5rem' }}>
            {scoreA} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>điểm</span>
          </div>
          {isBattleRunning && (
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem' }} onClick={() => handlePlayerPoint('A')}>
              +1 Điểm Đúng (A)
            </button>
          )}
        </div>

        {/* VS / Timer Center */}
        <div style={{ textAlign: 'center', padding: '0 1rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ec4899', letterSpacing: '0.05em' }}>
            VS
          </div>
          {isBattleRunning && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                border: '3px solid #f59e0b', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: timeLeft <= 5 ? '#f43f5e' : '#f59e0b',
                margin: '0 auto',
                background: 'var(--bg-surface)'
              }}>
                {timeLeft}s
              </div>
            </div>
          )}
        </div>

        {/* Player B Card */}
        <div 
          className="glass-card" 
          style={{ 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.2))',
            border: '2px solid var(--physics-violet)' 
          }}
        >
          <span className="badge badge-physics" style={{ marginBottom: '0.4rem' }}>ĐẤU THỦ B</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{playerB}</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#8b5cf6', marginTop: '0.5rem' }}>
            {scoreB} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>điểm</span>
          </div>
          {isBattleRunning && (
            <button className="btn btn-physics" style={{ width: '100%', marginTop: '0.75rem' }} onClick={() => handlePlayerPoint('B')}>
              +1 Điểm Đúng (B)
            </button>
          )}
        </div>
      </div>

      {/* Main Question Display Area */}
      {!isBattleRunning && !battleFinished ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Swords size={60} color="#ec4899" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Sẵn Sàng Cho Trận Đấu 5 Phút?</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Hệ thống sẽ đưa ra 5 câu hỏi nhanh ngẫu nhiên môn KHTN. Mỗi câu có 15 giây đếm ngược.
          </p>
          <button className="btn btn-primary btn-lg" onClick={handleStartBattle}>
            BẮT ĐẦU TRẬN ĐẤU NGAY
          </button>
        </div>
      ) : battleFinished ? (
        <div className="glass-panel animate-pulse-glow" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <Trophy size={64} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>KẾT THÚC TRẬN ĐẤU!</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cyan-primary)', margin: '1rem 0' }}>
            {scoreA > scoreB ? `🏆 CHIẾN THẮNG: ${playerA} (+2 Sao)` : scoreB > scoreA ? `🏆 CHIẾN THẮNG: ${playerB} (+2 Sao)` : '🤝 KẾT QUẢ HÒA! (+1 Sao cho cả 2 bạn)'}
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '1.5rem 0', flexWrap: 'wrap' }}>
            {onAddStar && (
              <button 
                className="btn btn-amber btn-lg" 
                onClick={handleAwardStars}
                disabled={hasAwardedStars}
              >
                <CheckCircle size={18} /> {hasAwardedStars ? 'Đã Ghi Điểm Vào Sổ Lớp ⭐' : '⭐ Trao Sao & Ghi Điểm Vào Sổ Lớp'}
              </button>
            )}
            <button className="btn btn-primary btn-lg" onClick={handleStartBattle}>
              <RotateCcw size={18} /> Chơi Lại Trận Mới
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span className="badge badge-amber">CÂU HỎI {currentQIndex + 1} / 5</span>
            <span className="badge badge-cyan">{currentQ?.subject?.toUpperCase()} - {currentQ?.topic}</span>
          </div>

          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', lineHeight: '1.5', margin: '1rem 0' }}>
            {currentQ?.question}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginTop: '1rem' }}>
            {currentQ?.options?.map((opt, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  border: idx === currentQ.correctAnswer ? '1.5px solid rgba(16, 185, 129, 0.7)' : '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-hover)',
                  color: 'var(--text-main)'
                }}
              >
                <strong style={{ color: 'var(--cyan-primary)', marginRight: '0.5rem' }}>
                  {String.fromCharCode(65 + idx)}.
                </strong>
                {opt}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button className="btn btn-secondary" onClick={handleNextQuestion}>
              Bỏ Qua / Câu Tiếp Theo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
