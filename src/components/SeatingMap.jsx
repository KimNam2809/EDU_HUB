import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Star, 
  Award, 
  Crosshair, 
  CheckCircle2, 
  Flame, 
  Plus, 
  Minus,
  MessageSquare
} from 'lucide-react';
import { playLaserScan, playVictoryFanfare, playPop } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export default function SeatingMap({ currentClass, onUpdateStudent }) {
  const [isScanning, setIsScanning] = useState(false);
  const [highlightedStudentId, setHighlightedStudentId] = useState(null);
  const [activeStudentModal, setActiveStudentModal] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [swapSourceStudent, setSwapSourceStudent] = useState(null);

  const students = currentClass?.students || [];

  // Group students by row and col for classroom layout (4 rows x 4 cols)
  const rows = [1, 2, 3, 4];
  const cols = [1, 2, 3, 4];

  const getStudentAt = (row, col) => {
    return students.find(s => s.desk?.row === row && s.desk?.col === col);
  };

  // Swap seats between two students or move to empty desk
  const handleSeatClick = (row, col, student) => {
    if (swapSourceStudent) {
      if (student && student.id === swapSourceStudent.id) {
        setSwapSourceStudent(null);
        return;
      }

      if (student) {
        // Swap desks of two students
        const targetDesk = { ...student.desk };
        const sourceDesk = { ...swapSourceStudent.desk };
        onUpdateStudent(swapSourceStudent.id, { desk: targetDesk });
        onUpdateStudent(student.id, { desk: sourceDesk });
      } else {
        // Move source student to empty desk
        onUpdateStudent(swapSourceStudent.id, { desk: { row, col } });
      }

      setSwapSourceStudent(null);
      playVictoryFanfare();
      return;
    }

    if (student) {
      setActiveStudentModal(student);
      playPop();
    }
  };

  // High-tech laser sweep to randomly pick a student desk
  const handleRandomLaserScan = () => {
    if (isScanning || students.length === 0) return;
    setIsScanning(true);
    setHighlightedStudentId(null);
    setSwapSourceStudent(null);
    playPop();

    let scanCount = 0;
    const maxScans = 25;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * students.length);
      setHighlightedStudentId(students[randomIdx].id);
      playLaserScan();
      scanCount++;

      if (scanCount >= maxScans) {
        clearInterval(interval);
        setIsScanning(false);
        const finalStudent = students[randomIdx];
        setHighlightedStudentId(finalStudent.id);
        playVictoryFanfare();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 }
        });
      }
    }, 120);
  };

  const handleAdjustStar = (studentId, delta) => {
    const student = students.find(s => s.id === studentId);
    if (!student || !onUpdateStudent) return;
    const newStars = Math.max(0, (student.stars || 0) + delta);
    const newAnswers = delta > 0 ? (student.answersCount || 0) + 1 : (student.answersCount || 0);
    onUpdateStudent(studentId, { stars: newStars, answersCount: newAnswers });
    playPop();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Classroom Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users color="#8b5cf6" size={24} />
            Sơ Đồ Lớp Học Tương Tác ({currentClass?.name})
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Bấm trực tiếp vào bàn để cộng sao thi đua, đổi chỗ ngồi hoặc bấm <strong>Quét Chọn Bàn Ngẫu Nhiên</strong> bằng hiệu ứng laser!
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${swapSourceStudent ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => {
              if (swapSourceStudent) {
                setSwapSourceStudent(null);
              } else {
                alert('Chế độ Đổi Chỗ Ngồi: Hãy bấm vào một học sinh, sau đó bấm vào vị trí bàn mới hoặc học sinh khác để hoán đổi chỗ ngồi!');
              }
              playPop();
            }}
          >
            🔄 {swapSourceStudent ? `Đang chọn: ${swapSourceStudent.name} (Bấm đích đến)` : 'Đổi Chỗ Ngồi'}
          </button>

          <button
            className="btn btn-physics btn-lg"
            onClick={handleRandomLaserScan}
            disabled={isScanning || students.length === 0}
          >
            <Crosshair size={20} className={isScanning ? 'animate-spin-slow' : ''} />
            {isScanning ? 'ĐANG QUÉT BÀN...' : 'QUÉT CHỌN BÀN NGẪU NHIÊN'}
          </button>
        </div>
      </div>

      {/* Team Filter Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Xem theo Tổ:</span>
        {['all', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'].map((t) => (
          <button
            key={t}
            className={`btn btn-sm ${selectedTeam === t ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setSelectedTeam(t); playPop(); }}
          >
            {t === 'all' ? 'Tất Cả Tổ' : t}
          </button>
        ))}
        {swapSourceStudent && (
          <span className="badge badge-amber animate-pulse-glow" style={{ marginLeft: 'auto' }}>
            ⚠️ Hãy bấm vào bàn muốn đổi chỗ với bạn <strong>{swapSourceStudent.name}</strong>
          </span>
        )}
      </div>

      {/* Blackboard & Teacher Podium representation */}
      <div 
        style={{ 
          background: 'linear-gradient(180deg, #1e293b, #0f172a)', 
          border: '2px solid rgba(6, 182, 212, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.5rem',
          textAlign: 'center',
          color: '#ffffff',
          fontWeight: 700,
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}
      >
        <span>👨‍🏫 BÀN GIÁO VIÊN & BẢNG TỪ KHTN 🧪</span>
      </div>

      {/* Seating Grid (4 rows x 4 columns) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem',
          position: 'relative'
        }}
      >
        {rows.map((row) => (
          <React.Fragment key={`row-${row}`}>
            {cols.map((col) => {
              const student = getStudentAt(row, col);
              const isSelected = highlightedStudentId === student?.id;
              const isSwapSource = swapSourceStudent?.id === student?.id;
              const isTeamMatch = selectedTeam === 'all' || student?.team === selectedTeam;

              return (
                <div
                  key={`desk-${row}-${col}`}
                  className="glass-card"
                  style={{
                    padding: '1rem',
                    minHeight: '130px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: student || swapSourceStudent ? 'pointer' : 'default',
                    border: isSwapSource 
                      ? '2px dashed #f59e0b'
                      : isSelected 
                      ? '2px solid #38bdf8' 
                      : '1px solid var(--border-subtle)',
                    background: isSwapSource
                      ? 'rgba(245, 158, 11, 0.2)'
                      : isSelected 
                      ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(124, 58, 237, 0.15))' 
                      : 'var(--bg-surface)',
                    opacity: isTeamMatch ? 1 : 0.35,
                    transform: isSelected || isSwapSource ? 'scale(1.04)' : 'none',
                    boxShadow: isSelected ? '0 0 25px rgba(2, 132, 199, 0.4)' : isSwapSource ? '0 0 20px rgba(245, 158, 11, 0.5)' : 'none',
                    transition: 'all 0.25s ease'
                  }}
                  onClick={() => handleSeatClick(row, col, student)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                      Dãy {col} - Bàn {row}
                    </span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {student?.team && (
                        <span className="badge badge-sm" style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.68rem', padding: '1px 5px' }}>
                          {student.team}
                        </span>
                      )}
                      {student && (
                        <span className="badge badge-pill badge-chemistry" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Star size={12} fill="currentColor" /> {student.stars || 0}
                        </span>
                      )}
                    </div>
                  </div>

                  {student ? (
                    <div>
                      <div style={{ 
                        fontSize: '1.05rem', 
                        fontWeight: 700, 
                        color: isSelected ? 'var(--cyan-primary)' : isSwapSource ? '#d97706' : 'var(--text-main)',
                        margin: '0.4rem 0 0.2rem'
                      }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Đã phát biểu: <strong>{student.answersCount || 0} lần</strong>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic', margin: 'auto 0' }}>
                      {swapSourceStudent ? '👉 Bấm để chuyển vào đây' : 'Bàn trống'}
                    </div>
                  )}

                  {student && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem', marginTop: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.2rem 0.5rem', height: '24px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdjustStar(student.id, -1);
                        }}
                        title="Trừ 1 sao"
                      >
                        <Minus size={12} />
                      </button>
                      <button
                        className="btn btn-amber btn-sm"
                        style={{ padding: '0.2rem 0.5rem', height: '24px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdjustStar(student.id, 1);
                        }}
                        title="Cộng 1 sao phát biểu tốt"
                      >
                        <Plus size={12} /> ⭐
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Quick Student Detail Modal */}
      {activeStudentModal && (
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
          onClick={() => setActiveStudentModal(null)}
        >
          <div 
            className="glass-panel"
            style={{ width: '420px', maxWidth: '100%', padding: '1.75rem', border: '1px solid var(--cyan-primary)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem' }}>{activeStudentModal.name}</h3>
                <span className="badge badge-cyan">
                  Dãy {activeStudentModal.desk.col} - Bàn {activeStudentModal.desk.row} ({currentClass?.name})
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star fill="currentColor" size={20} /> {activeStudentModal.stars || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sao tích lũy</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.25rem 0' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-amber" 
                  style={{ flex: 1 }}
                  onClick={() => handleAdjustStar(activeStudentModal.id, 1)}
                >
                  <Plus size={16} /> +1 Sao Phát Biểu
                </button>
                <button 
                  className="btn btn-emerald" 
                  style={{ flex: 1 }}
                  onClick={() => handleAdjustStar(activeStudentModal.id, 2)}
                >
                  <Award size={16} /> +2 Sao Xuất Sắc
                </button>
              </div>

              <button 
                className="btn btn-danger btn-sm"
                onClick={() => handleAdjustStar(activeStudentModal.id, -1)}
              >
                <Minus size={14} /> Trừ 1 Sao (Mất trật tự / Quên bài tập)
              </button>
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ width: '100%' }}
              onClick={() => setActiveStudentModal(null)}
            >
              Đóng Cửa Sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
