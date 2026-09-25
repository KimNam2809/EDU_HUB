import React, { useState, useRef, useEffect } from 'react';
import { 
  FlaskConical, 
  Maximize2, 
  ExternalLink, 
  BookOpen, 
  Sparkles, 
  CheckCircle2,
  Atom,
  Zap,
  Leaf,
  Globe2,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Plus,
  Trash2,
  Edit3,
  X,
  HelpCircle,
  FileText
} from 'lucide-react';
import { SCIENCE_SIMULATIONS, INTERACTIVE_3D_MODELS } from '../data/mockData';
import { playPop, playVictoryFanfare, playTimerBell } from '../utils/soundEffects';

// Interactive Canvas 3D Model Renderer
function Canvas3DViewer({ modelType }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Background stars / depth
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, width, height);

      // --- MODEL 1: DNA DOUBLE HELIX ---
      if (modelType === 'dna') {
        const nodes = 24;
        const helixRadius = 75;
        const totalHeight = 360;
        const startY = cy - totalHeight / 2;
        const stepY = totalHeight / nodes;

        for (let i = 0; i < nodes; i++) {
          const y = startY + i * stepY;
          const theta = time * 0.03 * speed + (i * Math.PI) / 6;

          // Strand 1 (3D projection)
          const x1 = cx + helixRadius * Math.cos(theta);
          const z1 = helixRadius * Math.sin(theta);
          const scale1 = (z1 + 140) / 140;

          // Strand 2 (Opposite)
          const x2 = cx + helixRadius * Math.cos(theta + Math.PI);
          const z2 = helixRadius * Math.sin(theta + Math.PI);
          const scale2 = (z2 + 140) / 140;

          // Base pair rungs (A-T: Red-Green, G-C: Amber-Blue)
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          const isAT = i % 2 === 0;
          ctx.strokeStyle = isAT ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.7)';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Strand 1 node
          ctx.beginPath();
          ctx.arc(x1, y, 6 * scale1, 0, 2 * Math.PI);
          ctx.fillStyle = '#06b6d4';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Strand 2 node
          ctx.beginPath();
          ctx.arc(x2, y, 6 * scale2, 0, 2 * Math.PI);
          ctx.fillStyle = '#8b5cf6';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Legend overlay
        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 13px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Mạch 1 (Đường - Phốt phát): Xanh Cyan', 20, 30);
        ctx.fillText('Mạch 2 (Đường - Phốt phát): Tím Violet', 20, 50);
        ctx.fillText('Liên kết Hidro bổ sung: A - T (Đỏ) | G - C (Xanh lá)', 20, 70);
      }

      // --- MODEL 2: EARTH - SUN ORBIT & DAY/NIGHT ---
      else if (modelType === 'earth') {
        // Sun at center
        const sunRadius = 38;
        const sunGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 60);
        sunGlow.addColorStop(0, '#fef08a');
        sunGlow.addColorStop(0.4, '#f59e0b');
        sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.beginPath();
        ctx.arc(cx, cy, 60, 0, 2 * Math.PI);
        ctx.fillStyle = sunGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, sunRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Outfit';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MẶT TRỜI', cx, cy);

        // Earth Orbit Ellipse
        const orbitRx = 230;
        const orbitRy = 110;
        ctx.beginPath();
        ctx.ellipse(cx, cy, orbitRx, orbitRy, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Earth position
        const earthAngle = time * 0.015 * speed;
        const ex = cx + orbitRx * Math.cos(earthAngle);
        const ey = cy + orbitRy * Math.sin(earthAngle);
        const earthRadius = 18;

        // Earth sphere
        ctx.beginPath();
        ctx.arc(ex, ey, earthRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#0284c7';
        ctx.fill();

        // Day vs Night hemisphere shading (Day faces sun)
        const angleToSun = Math.atan2(cy - ey, cx - ex);
        ctx.beginPath();
        ctx.arc(ex, ey, earthRadius, angleToSun - Math.PI / 2, angleToSun + Math.PI / 2);
        ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
        ctx.fill();

        // Tilted rotational axis (23.5 degrees)
        const axisLen = 30;
        const tilt = 0.41; // ~23.5 deg in rad
        ctx.beginPath();
        ctx.moveTo(ex - axisLen * Math.sin(tilt), ey - axisLen * Math.cos(tilt));
        ctx.lineTo(ex + axisLen * Math.sin(tilt), ey + axisLen * Math.cos(tilt));
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Outfit';
        ctx.fillText('Trái Đất (Nghiêng 23.5°)', ex, ey + 28);

        // Labels
        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 13px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Trục nghiêng 23.5° sinh ra 4 Mùa (Xuân, Hạ, Thu, Đông)', 20, 30);
        ctx.fillText('Nửa hướng về Mặt Trời là Ngày • Nửa đối diện là Đêm', 20, 50);
      }

      // --- MODEL 3: HUMAN HEART & CIRCULATORY SYSTEM ---
      else if (modelType === 'heart') {
        const beatScale = 1 + 0.08 * Math.sin(time * 0.1 * speed);
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(beatScale, beatScale);

        // Heart silhouette shape
        ctx.beginPath();
        ctx.moveTo(0, 35);
        ctx.bezierCurveTo(-70, -35, -75, -95, 0, -115);
        ctx.bezierCurveTo(75, -95, 70, -35, 0, 35);
        ctx.fillStyle = 'rgba(225, 29, 72, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Septum dividing right and left heart
        ctx.beginPath();
        ctx.moveTo(0, -110);
        ctx.lineTo(0, 30);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Left heart chambers (oxygenated blood - bright red)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('Tâm Nhĩ Trái', 35, -70);
        ctx.fillText('Tâm Thất Trái', 35, -20);

        // Right heart chambers (deoxygenated blood - deep blue)
        ctx.fillText('Tâm Nhĩ Phải', -35, -70);
        ctx.fillText('Tâm Thất Phải', -35, -20);

        ctx.restore();

        // Blood flow arrows and pulses
        const pulseY = cy + 60 * Math.sin(time * 0.1 * speed);
        ctx.beginPath();
        ctx.arc(cx + 100, pulseY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#ef4444';
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 13px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Máu giàu O₂ (Đỏ tươi): Vòng tuần hoàn lớn đi nuôi toàn cơ thể', 20, 30);
        ctx.fillText('Máu nghèo O₂, giàu CO₂ (Đỏ thẫm/Xanh): Lên phổi trao đổi khí', 20, 50);
        ctx.fillText(`Nhịp tim mô phỏng: ${(75 * speed).toFixed(0)} nhịp/phút`, 20, 70);
      }

      if (isPlaying) {
        time += 1;
      }
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [modelType, isPlaying, speed]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <div style={{ position: 'relative', width: '100%', height: '480px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
        <canvas
          ref={canvasRef}
          width={760}
          height={480}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Control bar for 3D model */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-hover)', border: '1.5px solid var(--border-subtle)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className={`btn btn-sm ${isPlaying ? 'btn-danger' : 'btn-emerald'}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Tạm Dừng' : 'Tiếp Tục'}
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tốc độ mô phỏng:</span>
          {[0.5, 1, 2].map(s => (
            <button
              key={s}
              className={`btn btn-sm ${speed === s ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSpeed(s)}
            >
              {s}x
            </button>
          ))}
        </div>

        <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={14} /> Canvas 3D Engine Tương Tác
        </span>
      </div>
    </div>
  );
}

export default function SimulationsLab() {
  const [labMode, setLabMode] = useState('phet'); // 'phet' | '3d'
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selected3DModel, setSelected3DModel] = useState(INTERACTIVE_3D_MODELS[0]);

  // Persistent Custom Simulations from Teacher
  const [customSims, setCustomSims] = useState(() => {
    try {
      const saved = localStorage.getItem('khtn_custom_simulations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const allSims = [...SCIENCE_SIMULATIONS, ...customSims];
  const [selectedSim, setSelectedSim] = useState(allSims[0]);

  // Modals state
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showAddSimModal, setShowAddSimModal] = useState(false);

  // New simulation form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('physics');
  const [newGrade, setNewGrade] = useState('Lớp 8');
  const [newEmbedUrl, setNewEmbedUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newHighlights, setNewHighlights] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newTools, setNewTools] = useState('');
  const [newSteps, setNewSteps] = useState('');
  const [newResult, setNewResult] = useState('');
  const [newWhy, setNewWhy] = useState('');

  const filteredSims = allSims.filter(sim => {
    return selectedSubject === 'all' || sim.subject === selectedSubject;
  });

  const handleAddCustomSim = (e) => {
    e.preventDefault();
    if (!newTitle || !newEmbedUrl) return;

    const stepsArray = newSteps
      ? newSteps.split('\n').filter(s => s.trim().length > 0)
      : ['Bước 1: Bật mô phỏng và quan sát hiện tượng.'];

    const newSim = {
      id: 'custom-sim-' + Date.now(),
      title: newTitle,
      subject: newSubject,
      grade: newGrade,
      embedUrl: newEmbedUrl,
      description: newDescription || 'Thí nghiệm ảo do giáo viên bổ sung.',
      highlights: newHighlights ? newHighlights.split(',').map(h => h.trim()) : ['Tương tác trực quan', 'Chuẩn GDPT 2018'],
      isCustom: true,
      tutorial: {
        target: newTarget || 'Mục tiêu bài học theo phân phối chương trình GDPT 2018.',
        tools: newTools || 'Bộ thí nghiệm ảo trực quan.',
        steps: stepsArray,
        result: newResult || 'Quan sát được hiện tượng khoa học rõ nét.',
        why: newWhy || 'Giải thích bản chất vật lý / hóa học / sinh học của hiện tượng.',
        phetDoc: 'Thí nghiệm bổ sung cho giáo án điện tử.'
      }
    };

    const updated = [newSim, ...customSims];
    setCustomSims(updated);
    localStorage.setItem('khtn_custom_simulations', JSON.stringify(updated));
    setSelectedSim(newSim);
    setShowAddSimModal(false);

    // Reset form
    setNewTitle('');
    setNewEmbedUrl('');
    setNewDescription('');
    setNewHighlights('');
    setNewTarget('');
    setNewTools('');
    setNewSteps('');
    setNewResult('');
    setNewWhy('');
    playVictoryFanfare();
  };

  const handleDeleteCustomSim = (id) => {
    if (window.confirm('Thầy/cô có chắc muốn xóa bài thí nghiệm này?')) {
      const updated = customSims.filter(s => s.id !== id);
      setCustomSims(updated);
      localStorage.setItem('khtn_custom_simulations', JSON.stringify(updated));
      setSelectedSim(SCIENCE_SIMULATIONS[0]);
      playPop();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FlaskConical color="#10b981" size={24} />
            Phòng Thí Nghiệm Ảo & Mô Hình Khoa Học 3D KHTN
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Kho mô phỏng tương tác HTML5 PhET đã Việt hóa và các mô hình không gian 3D trực quan (ADN, Trái Đất, Tim người) phục vụ tiết dạy sinh động!
          </p>
        </div>

        {/* Mode Switcher: PhET vs 3D Models */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${labMode === 'phet' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setLabMode('phet'); playPop(); }}
          >
            <FlaskConical size={16} /> Thí Nghiệm Ảo PhET (Lý - Hóa - Sinh)
          </button>
          <button
            className={`btn btn-sm ${labMode === '3d' ? 'btn-physics' : 'btn-secondary'}`}
            onClick={() => { setLabMode('3d'); playPop(); }}
          >
            <Layers size={16} /> Mô Hình Khoa Học 3D
          </button>
        </div>
      </div>

      {/* =========================================================
          MODE 1: PHET INTERACTIVE SIMULATIONS
         ========================================================= */}
      {labMode === 'phet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Subject Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Phân môn:</span>
            <button 
              className={`btn btn-sm ${selectedSubject === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setSelectedSubject('all'); playPop(); }}
            >
              Tất Cả ({SCIENCE_SIMULATIONS.length})
            </button>
            <button 
              className={`btn btn-sm ${selectedSubject === 'physics' ? 'btn-physics' : 'btn-secondary'}`}
              onClick={() => { setSelectedSubject('physics'); playPop(); }}
            >
              <Zap size={14} /> Vật Lí
            </button>
            <button 
              className={`btn btn-sm ${selectedSubject === 'chemistry' ? 'btn-amber' : 'btn-secondary'}`}
              onClick={() => { setSelectedSubject('chemistry'); playPop(); }}
            >
              <FlaskConical size={14} /> Hóa Học
            </button>
            <button 
              className={`btn btn-sm ${selectedSubject === 'biology' ? 'btn-emerald' : 'btn-secondary'}`}
              onClick={() => { setSelectedSubject('biology'); playPop(); }}
            >
              <Leaf size={14} /> Sinh Học
            </button>
            <button 
              className={`btn btn-sm ${selectedSubject === 'earth' ? 'btn-cyan' : 'btn-secondary'}`}
              onClick={() => { setSelectedSubject('earth'); playPop(); }}
            >
              <Globe2 size={14} /> Trái Đất & Bầu Trời
            </button>
          </div>

          {/* Main Lab Screen & Side List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
            {/* Left: Simulation Selector List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '680px', overflowY: 'auto', paddingRight: '0.3rem' }}>
              {filteredSims.map((sim) => {
                const isSelected = selectedSim.id === sim.id;
                return (
                  <div
                    key={sim.id}
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
                    onClick={() => {
                      setSelectedSim(sim);
                      playPop();
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className={`badge ${sim.subject === 'physics' ? 'badge-physics' : sim.subject === 'chemistry' ? 'badge-chemistry' : sim.subject === 'biology' ? 'badge-biology' : 'badge-cyan'}`}>
                        {sim.subject === 'physics' ? '⚡ Vật lí' : sim.subject === 'chemistry' ? '🧪 Hóa học' : sim.subject === 'biology' ? '🌿 Sinh học' : '🪐 Trái Đất'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sim.grade}</span>
                    </div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.25rem 0' }}>
                      {sim.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      {sim.description.length > 70 ? sim.description.substring(0, 70) + '...' : sim.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Embedded Interactive Simulation Player */}
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{selectedSim.title}</h3>
                    {selectedSim.isCustom && <span className="badge badge-amber">Tùy Chỉnh Của Giáo Viên</span>}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{selectedSim.description}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-amber btn-sm"
                    onClick={() => {
                      setShowTutorialModal(true);
                      playPop();
                    }}
                    title="Xem chi tiết các bước tiến hành, kết quả và bản chất khoa học"
                  >
                    <BookOpen size={15} /> 📖 Xem Tutorial Hướng Dẫn
                  </button>

                  <button 
                    className="btn btn-emerald btn-sm"
                    onClick={() => {
                      setShowAddSimModal(true);
                      playPop();
                    }}
                    title="Thêm một bài thí nghiệm ảo mới vào kho"
                  >
                    <Plus size={15} /> + Thêm Thí Nghiệm
                  </button>

                  {selectedSim.isCustom && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#f43f5e' }}
                      onClick={() => handleDeleteCustomSim(selectedSim.id)}
                      title="Xóa bài thí nghiệm này"
                    >
                      <Trash2 size={15} /> Xóa
                    </button>
                  )}

                  <a 
                    href={selectedSim.embedUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    title="Mở toàn màn hình trong tab mới để chiếu TV lớp học"
                  >
                    <ExternalLink size={14} /> Mở Tab Mới Chiếu Lớp
                  </a>
                </div>
              </div>

              {/* Iframe Viewport */}
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '560px', 
                  borderRadius: 'var(--radius-md)', 
                  overflow: 'hidden',
                  background: '#000000',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
                }}
              >
                <iframe
                  src={selectedSim.embedUrl}
                  title={selectedSim.title}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  allowFullScreen
                />
              </div>

              {/* Quick Tutorial Callout Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-hover)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} color="#f59e0b" />
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Chưa rõ các bước thao tác hoặc cần chuẩn bị bài giảng KHTN?
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Xem quy trình thực hành chi tiết, kết quả quan sát và lý giải tại sao hiện tượng xảy ra.
                    </div>
                  </div>
                </div>
                <button 
                  className="btn btn-amber btn-sm"
                  onClick={() => { setShowTutorialModal(true); playPop(); }}
                >
                  <BookOpen size={16} /> Mở Hướng Dẫn Tutorial 📖
                </button>
              </div>

              {/* Teacher Guided Points / Highlights */}
              <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--cyan-primary)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookOpen size={16} /> GỢI Ý HOẠT ĐỘNG KHÁM PHÁ CHO GIÁO VIÊN KHI LÊN LỚP:
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {selectedSim.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODE 2: INTERACTIVE 3D SCIENTIFIC MODELS
         ========================================================= */}
      {labMode === '3d' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Model Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              CHỌN MÔ HÌNH 3D:
            </div>
            {INTERACTIVE_3D_MODELS.map(m => {
              const isSelected = selected3DModel.id === m.id;
              return (
                <div
                  key={m.id}
                  className="glass-card"
                  style={{
                    cursor: 'pointer',
                    padding: '1rem',
                    border: isSelected ? '2px solid var(--physics-violet)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface)'
                  }}
                  onClick={() => { setSelected3DModel(m); playPop(); }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className={`badge ${m.subject === 'biology' ? 'badge-biology' : 'badge-cyan'}`}>
                      {m.subject === 'biology' ? '🌿 Sinh học' : '🪐 Trái Đất'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.grade}</span>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.25rem 0' }}>
                    {m.title}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {m.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right 3D Canvas Screen */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                {selected3DModel.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {selected3DModel.description}
              </p>
            </div>

            <Canvas3DViewer modelType={selected3DModel.type} />
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: TUTORIAL HƯỚNG DẪN THAO TÁC CHI TIẾT
         ========================================================= */}
      {showTutorialModal && selectedSim.tutorial && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-overlay)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem'
          }}
          onClick={() => setShowTutorialModal(false)}
        >
          <div 
            className="glass-panel"
            style={{ width: '740px', maxWidth: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className={`badge ${selectedSim.subject === 'physics' ? 'badge-physics' : selectedSim.subject === 'chemistry' ? 'badge-chemistry' : selectedSim.subject === 'biology' ? 'badge-biology' : 'badge-cyan'}`}>
                    {selectedSim.subject === 'physics' ? '⚡ Vật lí' : selectedSim.subject === 'chemistry' ? '🧪 Hóa học' : selectedSim.subject === 'biology' ? '🌿 Sinh học' : '🪐 Trái Đất'}
                  </span>
                  <span className="badge badge-amber">{selectedSim.grade}</span>
                </div>
                <h3 style={{ fontSize: '1.45rem', color: 'var(--text-main)' }}>
                  📖 Hướng Dẫn Thao Tác: {selectedSim.title}
                </h3>
              </div>

              <button 
                className="btn btn-secondary btn-icon"
                style={{ width: '32px', height: '32px' }}
                onClick={() => setShowTutorialModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* 1. Mục tiêu bài học */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                🎯 1. Mục Tiêu Bài Học & Năng Lực (Chuẩn GDPT 2018):
              </div>
              <p style={{ background: 'var(--bg-surface-hover)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {selectedSim.tutorial.target}
              </p>
            </div>

            {/* 2. Dụng cụ & Thiết bị ảo */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                🧪 2. Dụng Cụ, Thiết Bị Ảo & Mẫu Vật Cần Chuẩn Bị:
              </div>
              <p style={{ background: 'var(--bg-surface-hover)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {selectedSim.tutorial.tools}
              </p>
            </div>

            {/* 3. Quy trình thao tác từng bước */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                📋 3. Quy Trình Thao Tác Chi Tiết Trên Mô Phỏng:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedSim.tutorial.steps.map((st, sIdx) => (
                  <div 
                    key={sIdx}
                    style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      background: 'var(--bg-surface)', 
                      padding: '0.85rem 1rem', 
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border-subtle)',
                      alignItems: 'flex-start'
                    }}
                  >
                    <span 
                      style={{ 
                        background: '#d97706', 
                        color: '#ffffff', 
                        fontWeight: 800, 
                        fontSize: '0.85rem', 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {sIdx + 1}
                    </span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                      {st}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Kết quả quan sát được */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                🔬 4. Kết Quả Quan Sát Được (Hiện Tượng Trực Quan):
              </div>
              <div style={{ background: 'rgba(5, 150, 105, 0.1)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #059669', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {selectedSim.tutorial.result}
              </div>
            </div>

            {/* 5. Bản chất khoa học (Tại sao lại xảy ra?) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#e11d48', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                💡 5. Bản Chất Khoa Học (Lý Do Xảy Ra Hiện Tượng - "Vì Sao Lại Thế?"):
              </div>
              <div style={{ background: 'rgba(225, 29, 72, 0.08)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #e11d48', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {selectedSim.tutorial.why}
              </div>
            </div>

            {/* PhET Reference Note */}
            {selectedSim.tutorial.phetDoc && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                ℹ️ Lưu ý bục giảng: {selectedSim.tutorial.phetDoc}
              </div>
            )}

            {/* Close / Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                className="btn btn-primary"
                onClick={() => setShowTutorialModal(false)}
              >
                <CheckCircle2 size={16} /> Đã Nắm Rõ - Bắt Đầu Thực Hành Ngay!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: THÊM THÍ NGHIỆM / MÔ PHỎNG MỚI (CRUD)
         ========================================================= */}
      {showAddSimModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-overlay)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem'
          }}
          onClick={() => setShowAddSimModal(false)}
        >
          <div 
            className="glass-panel"
            style={{ width: '640px', maxWidth: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} color="#10b981" /> Thêm Bài Thí Nghiệm / Mô Phỏng Ảo Mới
              </h3>
              <button 
                className="btn btn-secondary btn-icon"
                style={{ width: '32px', height: '32px' }}
                onClick={() => setShowAddSimModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddCustomSim} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Tiêu đề bài thí nghiệm: *
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="VD: Định luật Bảo toàn Khối lượng trong phản ứng BaCl2 + Na2SO4..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Phân môn KHTN:
                  </label>
                  <select 
                    className="form-select"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  >
                    <option value="physics">Vật lí</option>
                    <option value="chemistry">Hóa học</option>
                    <option value="biology">Sinh học</option>
                    <option value="earth">Trái Đất & Bầu Trời</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Khối lớp:
                  </label>
                  <select 
                    className="form-select"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                  >
                    <option value="Lớp 6">Lớp 6</option>
                    <option value="Lớp 7">Lớp 7</option>
                    <option value="Lớp 8">Lớp 8</option>
                    <option value="Lớp 9">Lớp 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Đường dẫn nhúng Iframe (HTML5 PhET / YouTube Embed URL): *
                </label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://phet.colorado.edu/sims/html/... hoặc https://www.youtube.com/embed/..."
                  value={newEmbedUrl}
                  onChange={(e) => setNewEmbedUrl(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Mô tả ngắn bài thí nghiệm:
                </label>
                <textarea 
                  className="form-textarea"
                  style={{ minHeight: '60px' }}
                  placeholder="Mô tả tóm tắt nội dung để giáo viên và học sinh dễ nắm bắt..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Mục tiêu chuẩn kiến thức & kỹ năng (GDPT 2018):
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="VD: Chứng minh tổng khối lượng các chất trước và sau phản ứng không đổi..."
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Các bước tiến hành (Mỗi bước 1 dòng):
                </label>
                <textarea 
                  className="form-textarea"
                  placeholder="Bước 1: Chuẩn bị 2 ống nghiệm chứa BaCl2 và Na2SO4...&#10;Bước 2: Cân khối lượng hệ trước khi đổ lẫn...&#10;Bước 3: Trộn 2 dung dịch và cân lại khối lượng..."
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Hiện tượng thu được:
                  </label>
                  <textarea 
                    className="form-textarea"
                    placeholder="Xuất hiện kết tủa trắng BaSO4..."
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Lý giải bản chất khoa học:
                  </label>
                  <textarea 
                    className="form-textarea"
                    placeholder="Số nguyên tử của mỗi nguyên tố được bảo toàn..."
                    value={newWhy}
                    onChange={(e) => setNewWhy(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddSimModal(false)}
                >
                  Hủy Bỏ
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  <CheckCircle2 size={16} /> Lưu Thí Nghiệm Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
