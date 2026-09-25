import React, { useState, useRef, useEffect } from 'react';
import { 
  Atom, 
  Search, 
  Filter, 
  Sparkles, 
  Info, 
  X,
  ExternalLink,
  FlaskConical,
  Layers,
  HelpCircle,
  Plus,
  Trash2,
  Edit3,
  Check,
  Flame,
  AlertTriangle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { PERIODIC_ELEMENTS, SOLUBILITY_DATA, ELEMENT_INTERACTIONS } from '../data/mockData';
import { playPop, playVictoryFanfare, playTimerBell } from '../utils/soundEffects';
import ChemicalEquation from './ChemicalEquation';

const CATEGORY_MAP = {
  'all': { label: 'Tất Cả', color: '#06b6d4' },
  'nonmetal': { label: 'Phi Kim', color: '#38bdf8' },
  'noble-gas': { label: 'Khí Hiếm', color: '#a855f7' },
  'alkali-metal': { label: 'Kim Loại Kiềm', color: '#ef4444' },
  'alkaline-earth': { label: 'Kim Loại Kiềm Thổ', color: '#f97316' },
  'metalloid': { label: 'Á Kim', color: '#10b981' },
  'halogen': { label: 'Halogen', color: '#eab308' },
  'transition': { label: 'Kim Loại Chuyển Tiếp', color: '#6366f1' },
  'post-transition': { label: 'Kim Loại Sau Chuyển Tiếp', color: '#06b6d4' }
};

// Interactive Canvas Atomic Bohr Model
function AtomicBohrModel({ element }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let angle = 0;

    const electrons = element.electrons || [element.number];
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw nucleus glow
      const nucleusRadius = 20;
      const grad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, nucleusRadius + 10);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(0.6, '#ef4444');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius + 10, 0, 2 * Math.PI);
      ctx.fillStyle = grad;
      ctx.fill();

      // Nucleus core
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`+${element.number}`, centerX, centerY);

      // Draw electron shells (orbits)
      const baseRadius = 36;
      const shellGap = 20;

      electrons.forEach((eCount, shellIdx) => {
        const r = baseRadius + shellIdx * shellGap;

        // Orbit ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Orbiting electrons
        const speed = (shellIdx % 2 === 0 ? 1 : -1) * (0.018 / (shellIdx + 1));
        const currentShellAngle = angle * speed * 40;

        for (let i = 0; i < eCount; i++) {
          const eAngle = currentShellAngle + (i * 2 * Math.PI) / eCount;
          const ex = centerX + r * Math.cos(eAngle);
          const ey = centerY + r * Math.sin(eAngle);

          // Electron glow
          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(ex, ey, 2.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      });

      angle += 0.05;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [element]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas 
        ref={canvasRef} 
        width={220} 
        height={220} 
        style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)' }}
      />
      <div style={{ fontSize: '0.75rem', color: 'var(--cyan-light)', marginTop: '0.4rem', fontWeight: 600 }}>
        Mô hình động Bohr: {element.electrons?.join(' • ')} electron
      </div>
    </div>
  );
}

// Particle Canvas Animation for Element Reaction Sandbox
function ReactionCanvas({ elements, hasReaction }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const width = canvas.width;
    const height = canvas.height;

    // Element color mapping for spheres
    const ELEMENT_COLORS = {
      'H': '#f8fafc',
      'C': '#475569',
      'O': '#ef4444',
      'N': '#3b82f6',
      'Na': '#a855f7',
      'Cl': '#22c55e',
      'Fe': '#ea580c',
      'Cu': '#b45309',
      'Mg': '#10b981',
      'Ca': '#f59e0b',
      'K': '#8b5cf6',
      'S': '#eab308'
    };

    // Initialize particles
    const particles = elements.map((sym, idx) => {
      const angle = (idx / Math.max(elements.length, 1)) * 2 * Math.PI;
      const radius = 60;
      return {
        sym,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 18,
        color: ELEMENT_COLORS[sym] || '#0284c7'
      };
    });

    let sparkAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw reaction glow aura in center if reaction occurs
      if (hasReaction && elements.length >= 2) {
        sparkAngle += 0.05;
        const grad = ctx.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, 95);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
        grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.25)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 95, 0, Math.PI * 2);
        ctx.fill();

        // Connecting chemical bond laser lines
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // Update and draw atom spheres
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on borders
        if (p.x < p.radius || p.x > width - p.radius) p.vx *= -1;
        if (p.y < p.radius || p.y > height - p.radius) p.vy *= -1;

        // Draw atom 3D sphere gradient
        const atomGrad = ctx.createRadialGradient(
          p.x - p.radius * 0.3,
          p.y - p.radius * 0.3,
          p.radius * 0.1,
          p.x,
          p.y,
          p.radius
        );
        atomGrad.addColorStop(0, '#ffffff');
        atomGrad.addColorStop(0.4, p.color);
        atomGrad.addColorStop(1, '#0f172a');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = atomGrad;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Symbol label
        ctx.fillStyle = p.sym === 'H' ? '#0f172a' : '#ffffff';
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.sym, p.x, p.y);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [elements, hasReaction]);

  return (
    <canvas 
      ref={canvasRef} 
      width={280} 
      height={220} 
      style={{ 
        width: '100%', 
        maxWidth: '280px', 
        height: '220px', 
        borderRadius: 'var(--radius-md)', 
        background: 'rgba(15, 23, 42, 0.95)', 
        border: hasReaction ? '2px solid #f59e0b' : '1px solid var(--border-subtle)',
        boxShadow: hasReaction ? '0 0 20px rgba(245, 158, 11, 0.3)' : 'none'
      }} 
    />
  );
}

// Multi-Element Interaction Sandbox Component (2 - 10 Elements)
function ElementInteractionSandbox({ 
  selectedElements, 
  onToggleElement, 
  onClear, 
  onSetElements 
}) {
  const [customInteractions, setCustomInteractions] = useState(() => {
    try {
      const saved = localStorage.getItem('khtn_custom_element_interactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newElementsInput, setNewElementsInput] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newType, setNewType] = useState('Liên kết ion');
  const [newCondition, setNewCondition] = useState('');
  const [newPhenomenon, setNewPhenomenon] = useState('');

  // Combine built-in + teacher custom interactions
  const allInteractions = [...ELEMENT_INTERACTIONS, ...customInteractions];

  // Presets of classic school combinations
  const PRESETS = [
    { label: '💧 Nước (H + O)', elements: ['H', 'O'] },
    { label: '🧂 Muối Ăn (Na + Cl)', elements: ['Na', 'Cl'] },
    { label: '🌋 Sắt Cháy (Fe + O)', elements: ['Fe', 'O'] },
    { label: '🌿 Sinh Giới (C + H + O)', elements: ['C', 'H', 'O'] },
    { label: '🧱 Đá Vôi (Ca + C + O)', elements: ['Ca', 'C', 'O'] },
    { label: '💥 Natri + Nước (Na + H + O)', elements: ['Na', 'H', 'O'] },
    { label: '💨 Phân Đạm (N + H)', elements: ['N', 'H'] },
    { label: '🌟 Magie Cháy (Mg + O)', elements: ['Mg', 'O'] },
    { label: '🌧️ Mưa Axit (S + O)', elements: ['S', 'O'] },
    { label: '💜 Kali Nổ Tím (K + H + O)', elements: ['K', 'H', 'O'] },
    { label: '⛓️ Đồng + Lưu Huỳnh (Cu + S)', elements: ['Cu', 'S'] }
  ];

  // Match reactions where reaction elements are subset of selectedElements
  const matchingReactions = selectedElements.length >= 2 
    ? allInteractions.filter(rx => 
        rx.elements.every(el => selectedElements.includes(el))
      )
    : [];

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!newElementsInput || !newFormula || !newProduct) return;

    const parsedElements = newElementsInput
      .split(',')
      .map(s => s.trim().charAt(0).toUpperCase() + s.trim().slice(1))
      .filter(Boolean);

    const newRx = {
      id: 'custom-' + Date.now(),
      elements: parsedElements,
      title: newTitle || `${parsedElements.join(' + ')} (Tùy Chỉnh)`,
      equations: [
        {
          formula: newFormula,
          productName: newProduct,
          type: newType,
          condition: newCondition || 'Nhiệt độ phòng',
          phenomenon: newPhenomenon || 'Có hiện tượng phản ứng hóa học xảy ra.',
          dangerLevel: 'medium',
          significance: 'Phản ứng do giáo viên bổ sung vào bài giảng số KHTN.'
        }
      ],
      isCustom: true
    };

    const updated = [newRx, ...customInteractions];
    setCustomInteractions(updated);
    localStorage.setItem('khtn_custom_element_interactions', JSON.stringify(updated));
    setShowAddModal(false);
    setNewElementsInput('');
    setNewTitle('');
    setNewFormula('');
    setNewProduct('');
    setNewCondition('');
    setNewPhenomenon('');
    playVictoryFanfare();
  };

  const handleDeleteCustom = (id) => {
    if (window.confirm('Thầy/cô có chắc chắn muốn xóa phản ứng tùy chỉnh này?')) {
      const updated = customInteractions.filter(r => r.id !== id);
      setCustomInteractions(updated);
      localStorage.setItem('khtn_custom_element_interactions', JSON.stringify(updated));
      playPop();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Controller Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Sparkles size={20} color="#7c3aed" />
              Khay Phản Ứng Đa Nguyên Tố (Multi-Element Interaction Sandbox)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Chọn từ <strong>2 đến 10 nguyên tố</strong> bất kỳ trong bảng để khám phá các phản ứng hóa học, cơ chế liên kết electron và hiện tượng mô phỏng thực tế!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-emerald btn-sm"
              onClick={() => {
                setShowAddModal(true);
                playPop();
              }}
            >
              <Plus size={16} /> + Thêm Phản Ứng Tùy Chỉnh
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onClear();
                playPop();
              }}
              disabled={selectedElements.length === 0}
            >
              <Trash2 size={16} /> Xóa Sạch Khay
            </button>
          </div>
        </div>

        {/* Preset Combos Quick Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            ⚡ Tổ Hợp Kinh Điển Thường Gặp Trong SGK:
          </div>
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {PRESETS.map((p, idx) => {
              const isSelected = p.elements.every(e => selectedElements.includes(e)) && p.elements.length === selectedElements.length;
              return (
                <button
                  key={idx}
                  className={`btn btn-sm ${isSelected ? 'btn-physics' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                  onClick={() => {
                    onSetElements(p.elements);
                    playPop();
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Elements Tray */}
        <div style={{ 
          background: 'var(--bg-surface-hover)', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)',
          border: '2px dashed var(--border-subtle)',
          minHeight: '75px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', marginRight: '0.25rem' }}>
            Khay phản ứng ({selectedElements.length}/10):
          </span>

          {selectedElements.length === 0 ? (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
              Chưa chọn nguyên tố nào. Nhấp vào các nguyên tố bên dưới hoặc chọn tổ hợp kinh điển để bắt đầu!
            </span>
          ) : (
            selectedElements.map((sym) => {
              const elInfo = PERIODIC_ELEMENTS.find(e => e.symbol === sym);
              return (
                <div 
                  key={sym}
                  className="animate-pulse-glow"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1.5px solid var(--cyan-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.4rem 0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 8px var(--cyan-glow)'
                  }}
                >
                  <strong style={{ fontSize: '1.1rem', color: '#0284c7' }}>{sym}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{elInfo?.nameEn || sym}</span>
                  <button
                    onClick={() => {
                      onToggleElement(sym);
                      playPop();
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#f43f5e' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Element Selector Grid (24 Elements) */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            👇 Bấm vào nguyên tố để thêm/bớt khỏi khay (Tối đa 10 nguyên tố):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {PERIODIC_ELEMENTS.map((el) => {
              const isSelected = selectedElements.includes(el.symbol);
              return (
                <button
                  key={el.number}
                  className="btn"
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: isSelected ? 'var(--cyan-primary)' : 'var(--bg-surface)',
                    color: isSelected ? '#ffffff' : 'var(--text-main)',
                    border: isSelected ? '1.5px solid #0369a1' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: isSelected ? '0 0 10px var(--cyan-glow)' : 'none'
                  }}
                  onClick={() => {
                    onToggleElement(el.symbol);
                    playPop();
                  }}
                >
                  <span style={{ color: isSelected ? '#ffffff' : '#0284c7', marginRight: '3px' }}>{el.number}.</span>
                  {el.symbol} ({el.nameEn})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Reaction Analysis Display */}
      {selectedElements.length < 2 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <FlaskConical size={54} color="#7c3aed" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>Chọn ít nhất 2 nguyên tố để kích hoạt phân tích tương tác</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto' }}>
            Khi có từ 2 đến 10 nguyên tố trong khay, hệ thống sẽ tự động quét cơ sở dữ liệu hóa học để hiển thị các hợp chất tạo thành, phương trình phản ứng và mô phỏng hiện tượng thực tế!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.25rem', alignItems: 'start' }}>
          {/* Left: Interactive Particle Animation Canvas */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1rem', color: '#f59e0b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={16} /> Mô Phỏng Tương Tác Nguyên Tử
            </h4>

            <ReactionCanvas 
              elements={selectedElements} 
              hasReaction={matchingReactions.length > 0} 
            />

            <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {matchingReactions.length > 0 ? (
                <span style={{ color: '#10b981', fontWeight: 600 }}>
                  ⚡ Đã phát hiện {matchingReactions.length} phản ứng hóa học khả dĩ!
                </span>
              ) : (
                <span style={{ color: '#f59e0b' }}>
                  Các nguyên tử đang tương tác va chạm cơ học.
                </span>
              )}
            </div>
          </div>

          {/* Right: Detailed Matching Reactions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {matchingReactions.length > 0 ? (
              matchingReactions.map((rx) => (
                <div 
                  key={rx.id} 
                  className="glass-card" 
                  style={{ 
                    borderLeft: '5px solid #7c3aed', 
                    padding: '1.5rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                        {rx.title}
                      </h4>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-physics">
                          Nguyên tố: {rx.elements.join(', ')}
                        </span>
                        {rx.isCustom && (
                          <span className="badge badge-amber">Giáo viên biên soạn</span>
                        )}
                      </div>
                    </div>

                    {rx.isCustom && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#f43f5e' }}
                        onClick={() => handleDeleteCustom(rx.id)}
                        title="Xóa phản ứng này"
                      >
                        <Trash2 size={15} /> Xóa
                      </button>
                    )}
                  </div>

                  {/* List of Equations under this Reaction Group */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {rx.equations.map((eq, eqIdx) => (
                      <div 
                        key={eqIdx}
                        style={{ 
                          background: 'var(--bg-surface)', 
                          padding: '1.1rem', 
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0284c7' }}>
                            {eq.productName}
                          </span>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <span className="badge badge-cyan">{eq.type}</span>
                            <span 
                              className="badge" 
                              style={{ 
                                background: eq.dangerLevel === 'critical' ? 'rgba(239, 68, 68, 0.2)' : eq.dangerLevel === 'high' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                color: eq.dangerLevel === 'critical' ? '#ef4444' : eq.dangerLevel === 'high' ? '#f59e0b' : '#10b981'
                              }}
                            >
                              {eq.dangerLevel === 'critical' ? '⚠️ Rất nguy hiểm' : eq.dangerLevel === 'high' ? '⚡ Tỏa nhiệt mạnh' : '✅ An toàn'}
                            </span>
                          </div>
                        </div>

                        {/* Chemical Formula */}
                        <div style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: 700, 
                          color: 'var(--text-main)', 
                          background: 'var(--bg-surface-hover)', 
                          padding: '0.75rem 1rem', 
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--border-subtle)',
                          borderLeft: '4px solid #f59e0b',
                          marginBottom: '0.75rem',
                          overflowX: 'auto',
                          overflowY: 'hidden'
                        }}>
                          <ChemicalEquation formula={eq.formula} />
                        </div>

                        {/* Condition */}
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          <strong style={{ color: 'var(--text-main)' }}>Điều kiện phản ứng: </strong>
                          {eq.condition}
                        </div>

                        {/* Phenomenon */}
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', background: 'var(--bg-surface-hover)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                          <strong style={{ color: '#e11d48' }}>🔥 Hiện tượng quan sát: </strong>
                          {eq.phenomenon}
                        </div>

                        {/* Significance */}
                        {eq.significance && (
                          <div style={{ fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ShieldCheck size={14} /> <strong>Ứng dụng & Ý nghĩa:</strong> {eq.significance}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              /* Scientific Fallback Analysis when no preset reaction matches */
              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} color="#f59e0b" />
                  Phân Tích Quy Luật Tương Tác Khoa Học Cho Tổ Hợp Này
                </h4>

                <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.92rem', marginBottom: '1rem' }}>
                  Hiện tại trong chương trình KHTN THCS tiêu chuẩn, các nguyên tố <strong>{selectedElements.join(', ')}</strong> chưa có phản ứng hóa học thông dụng tạo hợp chất trực tiếp, hoặc đây là các nguyên tố có đặc tính riêng:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  {selectedElements.some(s => ['He', 'Ne', 'Ar'].includes(s)) && (
                    <div style={{ background: 'var(--bg-surface-hover)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                      🛡️ <strong>Nhóm Khí Hiếm (He, Ne, Ar):</strong> Có lớp vỏ electron ngoài cùng bão hòa bền vững (2 hoặc 8 electron) theo quy tắc Octet, do đó ở điều kiện thường rất trơ và không tham gia liên kết hóa học.
                    </div>
                  )}

                  {selectedElements.every(s => ['Cu', 'Ag', 'Au'].includes(s)) && (
                    <div style={{ background: 'var(--bg-surface-hover)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                      💎 <strong>Kim loại quý:</strong> Rất bền vững, không phản ứng hóa học với nhau mà chỉ có thể nấu chảy tạo <em>hợp kim</em> đồng mỹ nghệ hoặc trang sức vàng bạc.
                    </div>
                  )}

                  <div style={{ background: 'var(--bg-surface-hover)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                    💡 <strong>Thầy/cô có bài giảng riêng về tổ hợp này?</strong> Hãy bấm nút <em>"+ Thêm Phản Ứng Tùy Chỉnh"</em> ở góc trên để bổ sung phương trình và hiện tượng cho học sinh ngay trong tiết học!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Add Custom Interaction */}
      {showAddModal && (
        <div 
          className="modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="modal-content"
            style={{ width: '560px', maxWidth: '95vw', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} color="#10b981" /> Thêm Phản Ứng Tương Tác Mới
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCustom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Ký hiệu các nguyên tố tham gia (cách nhau bởi dấu phẩy, VD: Al, O): *
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="VD: Al, O hoặc Zn, S..."
                  value={newElementsInput}
                  onChange={(e) => setNewElementsInput(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Tên tiêu đề phản ứng:
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="VD: Nhôm cháy trong khí Oxy tạo màng oxit..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Phương trình hóa học (Formula): *
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="VD: 4Al + 3O2 -> 2Al2O3"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Tên sản phẩm tạo thành: *
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="VD: Aluminium oxide"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Loại liên kết hóa học:
                  </label>
                  <select 
                    className="form-select"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  >
                    <option value="Liên kết ion">Liên kết ion</option>
                    <option value="Liên kết cộng hóa trị">Liên kết cộng hóa trị</option>
                    <option value="Phản ứng oxi hóa - khử">Phản ứng oxi hóa - khử</option>
                    <option value="Phản ứng thế">Phản ứng thế</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Điều kiện phản ứng:
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="VD: Nhiệt độ cao khoảng 500°C hoặc đốt đèn cồn..."
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Hiện tượng quan sát thực tế (thay đổi màu, sủi bọt, kết tủa...):
                </label>
                <textarea 
                  className="form-textarea" 
                  placeholder="VD: Bột nhôm cháy sáng chói lòa, tỏa nhiều nhiệt và sinh ra chất rắn màu trắng..."
                  value={newPhenomenon}
                  onChange={(e) => setNewPhenomenon(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy Bỏ
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  <Check size={16} /> Lưu Phản Ứng Vào Bộ Nhớ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PeriodicTable() {
  const [activeSubView, setActiveSubView] = useState('elements'); // 'elements' | 'reactions' | 'solubility'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeElement, setActiveElement] = useState(null);

  // Multi-Element Sandbox Tray State (2 to 10 elements)
  const [selectedSandboxElements, setSelectedSandboxElements] = useState(['H', 'O']);

  const handleToggleSandboxElement = (sym) => {
    setSelectedSandboxElements(prev => {
      if (prev.includes(sym)) {
        return prev.filter(s => s !== sym);
      } else {
        if (prev.length >= 10) {
          alert('Khay phản ứng chứa tối đa 10 nguyên tố cùng lúc!');
          return prev;
        }
        return [...prev, sym];
      }
    });
  };

  const handleClearSandbox = () => {
    setSelectedSandboxElements([]);
  };

  const handleSetSandbox = (elements) => {
    setSelectedSandboxElements(elements);
  };

  const handleAddToSandbox = (sym) => {
    setSelectedSandboxElements(prev => {
      if (!prev.includes(sym)) {
        if (prev.length >= 10) return prev;
        return [...prev, sym];
      }
      return prev;
    });
  };

  // Solubility Chart Selected Cell State
  const [selectedSolubilityCell, setSelectedSolubilityCell] = useState(null);

  const filteredElements = PERIODIC_ELEMENTS.filter(el => {
    const matchesSearch = 
      el.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.nameOld.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.number.toString().includes(searchQuery);

    const matchesCategory = selectedCategory === 'all' || el.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Control Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Atom color="#0284c7" size={24} />
            Bảng Tuần Hoàn & Bảng Tính Tan IUPAC (GDPT 2018)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Chuẩn hóa danh pháp quốc tế tiếng Anh theo SGK KHTN mới. Xem mô hình electron quay động, khay tương tác đa nguyên tố và tra cứu tính tan!
          </p>
        </div>

        {/* View Switcher: Periodic Table vs Multi-Element Sandbox vs Solubility Chart */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeSubView === 'elements' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveSubView('elements'); playPop(); }}
          >
            <Atom size={16} /> Bảng Tuần Hoàn IUPAC
          </button>
          <button
            className={`btn btn-sm ${activeSubView === 'reactions' ? 'btn-physics' : 'btn-secondary'}`}
            onClick={() => { setActiveSubView('reactions'); playPop(); }}
          >
            <Sparkles size={16} /> Tương Tác 2-10 Nguyên Tố ({selectedSandboxElements.length}/10)
          </button>
          <button
            className={`btn btn-sm ${activeSubView === 'solubility' ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => { setActiveSubView('solubility'); playPop(); }}
          >
            <FlaskConical size={16} /> Bảng Tính Tan Axit - Bazơ - Muối
          </button>
        </div>
      </div>

      {/* =========================================================
          VIEW 1: BẢNG TUẦN HOÀN NGUYÊN TỐ HÓA HỌC IUPAC
         ========================================================= */}
      {activeSubView === 'elements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Controls: Search & Category Filter */}
          <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Filter size={14} /> Phân loại:
              </span>
              {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
                <button
                  key={key}
                  className="btn btn-sm"
                  style={{
                    background: selectedCategory === key ? cat.color : 'var(--bg-surface-hover)',
                    color: selectedCategory === key ? '#ffffff' : 'var(--text-main)',
                    border: `1.5px solid ${selectedCategory === key ? cat.color : 'var(--border-subtle)'}`,
                    fontSize: '0.78rem',
                    fontWeight: 600
                  }}
                  onClick={() => {
                    setSelectedCategory(key);
                    playPop();
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Tìm O, Fe, 8, Oxygen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Elements Grid Display */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.85rem'
            }}
          >
            {filteredElements.map((el) => {
              const catInfo = CATEGORY_MAP[el.category] || { color: '#06b6d4' };

              return (
                <div
                  key={el.number}
                  className="glass-card"
                  style={{
                    padding: '0.85rem',
                    cursor: 'pointer',
                    borderLeft: `4px solid ${catInfo.color}`,
                    background: 'var(--bg-surface)',
                    borderTop: '1.5px solid var(--border-subtle)',
                    borderRight: '1.5px solid var(--border-subtle)',
                    borderBottom: '1.5px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '120px',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => {
                    setActiveElement(el);
                    playPop();
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {el.number}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {el.mass}
                    </span>
                  </div>

                  <div style={{ textAlign: 'center', margin: '0.2rem 0' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                      {el.symbol}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: catInfo.color }}>
                      {el.nameEn}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.3rem' }}>
                    <span>(cũ: {el.nameOld})</span>
                    <span>Hóa trị {el.valency}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW 2: BẢNG TÍNH TAN TƯƠNG TÁC (INTERACTIVE SOLUBILITY)
         ========================================================= */}
      {activeSubView === 'solubility' && (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#f59e0b', marginBottom: '0.2rem' }}>
                Bảng Tính Tan Của Axit - Bazơ - Muối Trong Nước
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Bấm vào từng ô để xem chi tiết tính chất kết tủa, màu sắc và hiện tượng phản ứng hóa học thực tiễn!
              </p>
            </div>

            {/* Color Legend */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#34d399', border: '1px solid #10b981' }}>
                T : Tan tốt
              </span>
              <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.25)', color: '#f87171', border: '1px solid #ef4444' }}>
                K : Không tan (Kết tủa)
              </span>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24', border: '1px solid #f59e0b' }}>
                I : Ít tan
              </span>
              <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.25)', color: '#c084fc', border: '1px solid #a855f7' }}>
                B : Bay hơi (Khí)
              </span>
              <span className="badge" style={{ background: 'rgba(100, 116, 139, 0.25)', color: '#94a3b8' }}>
                - : Không tồn tại / Bị phân hủy
              </span>
            </div>
          </div>

          {/* Solubility Table */}
          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-hover)', color: 'var(--cyan-primary)' }}>
                  <th style={{ padding: '0.75rem 0.5rem', borderBottom: '2px solid rgba(6, 182, 212, 0.4)', textAlign: 'left', minWidth: '130px' }}>
                    Cation \ Anion
                  </th>
                  {SOLUBILITY_DATA.anions.map(a => (
                    <th key={a.code} style={{ padding: '0.75rem 0.5rem', borderBottom: '2px solid rgba(6, 182, 212, 0.4)', minWidth: '70px', fontWeight: 700 }}>
                      {a.name.split(' ')[0]}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.name.split(' ')[1]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SOLUBILITY_DATA.cations.map((c, rowIdx) => (
                  <tr key={c.code} style={{ background: rowIdx % 2 === 0 ? 'var(--table-row-even)' : 'var(--table-row-odd)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, textAlign: 'left', color: 'var(--text-main)', borderRight: '1px solid var(--border-subtle)' }}>
                      {c.name}
                    </td>
                    {SOLUBILITY_DATA.anions.map(a => {
                      const item = SOLUBILITY_DATA.matrix[c.code]?.[a.code] || { s: 'T' };
                      const s = item.s;
                      let bg = 'rgba(16, 185, 129, 0.15)';
                      let textColor = '#059669';
                      let borderColor = 'rgba(16, 185, 129, 0.3)';

                      if (s === 'K') {
                        bg = 'rgba(239, 68, 68, 0.15)';
                        textColor = '#dc2626';
                        borderColor = 'rgba(239, 68, 68, 0.35)';
                      } else if (s === 'I') {
                        bg = 'rgba(245, 158, 11, 0.15)';
                        textColor = '#d97706';
                        borderColor = 'rgba(245, 158, 11, 0.35)';
                      } else if (s === 'B') {
                        bg = 'rgba(168, 85, 247, 0.15)';
                        textColor = '#7c3aed';
                        borderColor = 'rgba(168, 85, 247, 0.35)';
                      } else if (s === '-') {
                        bg = 'rgba(100, 116, 139, 0.1)';
                        textColor = 'var(--text-dim)';
                        borderColor = 'transparent';
                      }

                      return (
                        <td
                          key={a.code}
                          style={{
                            padding: '0.6rem 0.4rem',
                            cursor: 'pointer',
                            background: bg,
                            color: textColor,
                            fontWeight: 800,
                            border: `1px solid ${borderColor}`,
                            transition: 'all 0.15s ease'
                          }}
                          onClick={() => {
                            setSelectedSolubilityCell({
                              cation: c,
                              anion: a,
                              data: item
                            });
                            playPop();
                          }}
                        >
                          {s}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Solubility Explanatory Card */}
          {selectedSolubilityCell && (
            <div 
              className="glass-card animate-pulse-glow"
              style={{
                background: 'var(--bg-surface)',
                border: '2px solid #f59e0b',
                padding: '1.25rem 1.5rem',
                borderLeft: '6px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-amber">CHI TIẾT TÍNH TAN</span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>
                    {selectedSolubilityCell.cation.name} + {selectedSolubilityCell.anion.name}
                  </strong>
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {selectedSolubilityCell.data.s === 'T' && '✅ Tan tốt trong nước tạo thành dung dịch trong suốt.'}
                  {selectedSolubilityCell.data.s === 'K' && `🛑 Không tan (Kết tủa)${selectedSolubilityCell.data.color ? ` màu ${selectedSolubilityCell.data.color}` : ''}.`}
                  {selectedSolubilityCell.data.s === 'I' && '⚠️ Ít tan trong nước ở nhiệt độ thường.'}
                  {selectedSolubilityCell.data.s === 'B' && '💨 Không bền, dễ bay hơi giải phóng chất khí.'}
                  {selectedSolubilityCell.data.s === '-' && '❌ Bị nước phân hủy hoặc không tồn tại trong dung dịch.'}
                  {selectedSolubilityCell.data.n && ` — ${selectedSolubilityCell.data.n}`}
                </div>
              </div>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedSolubilityCell(null)}
              >
                Đóng Ghi Chú
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          VIEW 3: KHAY PHẢN ỨNG TƯƠNG TÁC ĐA NGUYÊN TỐ (2 - 10 NGUYÊN TỐ)
         ========================================================= */}
      {activeSubView === 'reactions' && (
        <ElementInteractionSandbox 
          selectedElements={selectedSandboxElements}
          onToggleElement={handleToggleSandboxElement}
          onClear={handleClearSandbox}
          onSetElements={handleSetSandbox}
        />
      )}

      {/* Detailed Element Modal with 3D Bohr Atomic Model */}
      {activeElement && (
        <div className="modal-backdrop" onClick={() => setActiveElement(null)}>
          <div 
            className="modal-content"
            style={{ 
              width: '680px', 
              maxWidth: '100%', 
              padding: '2rem', 
              border: `2px solid ${CATEGORY_MAP[activeElement.category]?.color || 'var(--cyan-primary)'}`,
              position: 'relative',
              maxHeight: '88vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="btn btn-secondary btn-icon"
              style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px' }}
              onClick={() => setActiveElement(null)}
            >
              <X size={16} />
            </button>

            {/* Top row: Symbol + Names Left, Bohr Animation Right */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div 
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.25))',
                    border: `2px solid ${CATEGORY_MAP[activeElement.category]?.color || '#06b6d4'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{activeElement.number}</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{activeElement.symbol}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{activeElement.mass}</span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontSize: '1.7rem', color: 'var(--text-main)' }}>{activeElement.nameEn}</h3>
                    <span className="badge badge-cyan">Chuẩn IUPAC</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                    Tên gọi cũ quen thuộc: <strong>{activeElement.nameOld}</strong>
                  </div>
                  <div style={{ marginTop: '0.35rem' }}>
                    <span 
                      className="badge" 
                      style={{ 
                        background: CATEGORY_MAP[activeElement.category]?.color + '22', 
                        color: CATEGORY_MAP[activeElement.category]?.color,
                        borderColor: CATEGORY_MAP[activeElement.category]?.color
                      }}
                    >
                      {CATEGORY_MAP[activeElement.category]?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Bohr Atomic Model */}
              <AtomicBohrModel element={activeElement} />
            </div>

            {/* Key Properties Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '0.75rem', textAlign: 'center', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Chu Kỳ & Nhóm</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', marginTop: '2px' }}>
                  Chu kỳ {activeElement.period} - Nhóm {activeElement.group}
                </div>
              </div>
              <div className="glass-card" style={{ padding: '0.75rem', textAlign: 'center', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Hóa Trị Phổ Biến</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', marginTop: '2px' }}>
                  {activeElement.valency}
                </div>
              </div>
              <div className="glass-card" style={{ padding: '0.75rem', textAlign: 'center', background: 'var(--bg-surface)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Trạng Thái Tự Nhiên</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', marginTop: '2px' }}>
                  {activeElement.state}
                </div>
              </div>
            </div>

            {/* Electron Configuration */}
            <div style={{ background: 'var(--bg-surface-hover)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1.5px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cấu hình Electron: </span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-primary)', fontSize: '1rem', marginLeft: '0.5rem' }}>
                {activeElement.config}
              </strong>
            </div>

            {/* Real World Application in Vietnam */}
            <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-subtle)', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} /> ỨNG DỤNG THỰC TẾ TRONG ĐỜI SỐNG (VIỆT NAM):
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {activeElement.app}
              </p>
            </div>

            {/* Quick Add to Sandbox Button */}
            <button
              className="btn btn-physics"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => {
                handleAddToSandbox(activeElement.symbol);
                setActiveSubView('reactions');
                setActiveElement(null);
                playPop();
              }}
            >
              <Sparkles size={16} /> Đưa {activeElement.symbol} ({activeElement.nameEn}) Vào Khay Phản Ứng Đa Nguyên Tố 🧪
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
