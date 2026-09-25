import React, { useState, useRef, useEffect } from 'react';
import { 
  PenTool, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  Calculator, 
  Timer, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Flame,
  Volume2,
  Download,
  Undo2,
  Redo2,
  Square,
  Eraser,
  Plus,
  Edit2,
  Play,
  Pause,
  RefreshCw,
  Eye,
  AlertTriangle,
  X
} from 'lucide-react';
import { CHEMICAL_REACTIONS } from '../data/mockData';
import { playPop, playTimerBell, playBuzzer, playFocusBeat, playVictoryFanfare } from '../utils/soundEffects';
import ChemicalEquation from './ChemicalEquation';

// --- VISUAL REACTION SIMULATOR COMPONENT ---
function ReactionPhenomenonVisualizer({ reaction }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rxSpeed, setRxSpeed] = useState(1);
  const [showMolecular, setShowMolecular] = useState(false);
  const animFrameRef = useRef(null);

  // Determine phenomenon characteristics
  const note = reaction.note || '';
  const balanced = reaction.balanced || '';
  
  const isGas = balanced.includes('↑') || note.toLowerCase().includes('khí') || note.toLowerCase().includes('bọt') || note.toLowerCase().includes('sủi');
  const isPrecipitate = balanced.includes('↓') || note.toLowerCase().includes('kết tủa');
  const isCombustion = note.toLowerCase().includes('cháy') || note.toLowerCase().includes('sáng chói') || note.toLowerCase().includes('ngọn lửa') || note.toLowerCase().includes('nổ');
  const isHeat = note.toLowerCase().includes('tỏa nhiệt') || note.toLowerCase().includes('nóng') || note.toLowerCase().includes('sôi');
  const isColorShift = note.toLowerCase().includes('quỳ tím') || note.toLowerCase().includes('đổi màu') || note.toLowerCase().includes('chuyển');

  let precipitateColor = '#ffffff'; // default milky white
  if (note.toLowerCase().includes('xanh lam')) precipitateColor = '#0284c7';
  else if (note.toLowerCase().includes('nâu đỏ')) precipitateColor = '#9a3412';
  else if (note.toLowerCase().includes('đen')) precipitateColor = '#1e293b';
  else if (note.toLowerCase().includes('vàng')) precipitateColor = '#eab308';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    // Particles array
    const bubbles = Array.from({ length: 40 }, () => ({
      x: 100 + Math.random() * 120,
      y: 120 + Math.random() * 140,
      r: 2 + Math.random() * 5,
      speed: 1 + Math.random() * 2.5,
      wobble: Math.random() * Math.PI * 2
    }));

    const pptFlakes = Array.from({ length: 50 }, () => ({
      x: 95 + Math.random() * 130,
      y: 60 + Math.random() * 160,
      r: 2 + Math.random() * 4,
      vy: 0.4 + Math.random() * 0.8,
      settled: false
    }));

    const sparks = Array.from({ length: 45 }, () => ({
      x: 160,
      y: 180,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 5 - 2,
      life: Math.random(),
      color: Math.random() > 0.3 ? '#fef08a' : '#f97316'
    }));

    const render = () => {
      time += 0.03 * rxSpeed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw background stand & bench
      ctx.fillStyle = 'rgba(2, 132, 199, 0.08)';
      ctx.fillRect(0, canvas.height - 35, canvas.width, 35);
      ctx.strokeStyle = 'var(--border-subtle)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 35);
      ctx.lineTo(canvas.width, canvas.height - 35);
      ctx.stroke();

      if (isCombustion) {
        // --- COMBUSTION / FLAME SCENARIO ---
        // Crucible / Deflagrating spoon / Gas jar
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy + 30, 40, 0, Math.PI, false);
        ctx.stroke();

        // Spoon handle
        ctx.beginPath();
        ctx.moveTo(cx, cy + 30);
        ctx.lineTo(cx - 90, cy - 60);
        ctx.stroke();

        // Flame glow
        const flameGradient = ctx.createRadialGradient(cx, cy + 15, 5, cx, cy + 15, 65);
        flameGradient.addColorStop(0, '#ffffff');
        flameGradient.addColorStop(0.3, '#fef08a');
        flameGradient.addColorStop(0.6, '#f97316');
        flameGradient.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.arc(cx, cy + 15, 65 + Math.sin(time * 5) * 8, 0, Math.PI * 2);
        ctx.fill();

        // Flying sparks
        sparks.forEach(sp => {
          if (isPlaying) {
            sp.x += sp.vx * rxSpeed;
            sp.y += sp.vy * rxSpeed;
            sp.vy += 0.08; // gravity
            sp.life -= 0.02 * rxSpeed;
            if (sp.life <= 0) {
              sp.x = cx + (Math.random() - 0.5) * 20;
              sp.y = cy + 15;
              sp.vx = (Math.random() - 0.5) * 7;
              sp.vy = -Math.random() * 6 - 2;
              sp.life = 0.8 + Math.random() * 0.4;
            }
          }
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 2.5 * sp.life, 0, Math.PI * 2);
          ctx.fillStyle = sp.color;
          ctx.fill();
        });

        // Smoke wisps
        for (let i = 0; i < 6; i++) {
          const sy = cy - 20 - ((time * 30 + i * 25) % 110);
          const sx = cx + Math.sin(time * 2 + i) * 15;
          const alpha = Math.max(0, 1 - (cy - sy) / 120);
          ctx.beginPath();
          ctx.arc(sx, sy, 8 + i * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(226, 232, 240, ${alpha * 0.4})`;
          ctx.fill();
        }
      } else {
        // --- BEAKER / TEST TUBE SCENARIO ---
        const bx = cx - 70;
        const by = cy - 80;
        const bw = 140;
        const bh = 170;

        // Beaker liquid
        let liquidColor = 'rgba(56, 189, 248, 0.25)';
        if (isColorShift) {
          liquidColor = 'rgba(244, 63, 94, 0.4)'; // pink indicator
        } else if (isPrecipitate && precipitateColor === '#0284c7') {
          liquidColor = 'rgba(14, 165, 233, 0.4)';
        }

        ctx.fillStyle = liquidColor;
        ctx.beginPath();
        ctx.roundRect(bx + 4, by + 40, bw - 8, bh - 44, [0, 0, 12, 12]);
        ctx.fill();

        // Meniscus
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(cx, by + 40, bw / 2 - 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Gas Bubbles
        if (isGas) {
          bubbles.forEach(b => {
            if (isPlaying) {
              b.y -= b.speed * rxSpeed;
              b.wobble += 0.08;
              if (b.y < by + 40) {
                b.y = by + bh - 15 - Math.random() * 30;
                b.x = bx + 15 + Math.random() * (bw - 30);
              }
            }
            const wobbleX = b.x + Math.sin(b.wobble) * 3;
            ctx.beginPath();
            ctx.arc(wobbleX, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(2, 132, 199, 0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
          });

          // Vapor rising above beaker
          for (let v = 0; v < 4; v++) {
            const vy = by + 25 - ((time * 25 + v * 30) % 70);
            const vx = cx + Math.sin(time * 2 + v) * 20;
            ctx.beginPath();
            ctx.arc(vx, vy, 6 + v * 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(203, 213, 225, 0.35)';
            ctx.fill();
          }
        }

        // Precipitate flakes & sediment layer
        if (isPrecipitate) {
          // Bottom sediment layer
          ctx.fillStyle = precipitateColor;
          ctx.beginPath();
          ctx.roundRect(bx + 6, by + bh - 24, bw - 12, 20, [0, 0, 10, 10]);
          ctx.fill();

          // Drifting flakes
          pptFlakes.forEach(f => {
            if (isPlaying) {
              f.y += f.vy * rxSpeed;
              if (f.y > by + bh - 25) {
                f.y = by + 45 + Math.random() * 20;
                f.x = bx + 12 + Math.random() * (bw - 24);
              }
            }
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fillStyle = precipitateColor;
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 3;
            ctx.fill();
            ctx.shadowBlur = 0;
          });
        }

        // Heat Waves
        if (isHeat) {
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
          ctx.lineWidth = 2;
          for (let h = 0; h < 3; h++) {
            const hx = cx - 35 + h * 35;
            ctx.beginPath();
            ctx.moveTo(hx, by + 30);
            ctx.bezierCurveTo(
              hx + Math.sin(time * 3 + h) * 10, by + 10,
              hx - Math.sin(time * 3 + h) * 10, by - 10,
              hx, by - 30
            );
            ctx.stroke();
          }
        }

        // Draw Beaker Outlines
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Top lip left
        ctx.moveTo(bx - 10, by);
        ctx.lineTo(bx, by);
        // Left wall
        ctx.lineTo(bx, by + bh - 14);
        // Bottom curve left
        ctx.quadraticCurveTo(bx, by + bh, bx + 14, by + bh);
        // Bottom flat
        ctx.lineTo(bx + bw - 14, by + bh);
        // Bottom curve right
        ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw, by + bh - 14);
        // Right wall
        ctx.lineTo(bx + bw, by);
        // Top lip right
        ctx.lineTo(bx + bw + 10, by);
        ctx.stroke();

        // Graduation marks on beaker
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.lineWidth = 1.5;
        for (let g = 1; g <= 4; g++) {
          const gy = by + bh - g * 30;
          ctx.beginPath();
          ctx.moveTo(bx + 4, gy);
          ctx.lineTo(bx + 22, gy);
          ctx.stroke();
          ctx.fillStyle = 'var(--text-muted)';
          ctx.font = '9px Outfit';
          ctx.fillText(`${g * 50}ml`, bx + 26, gy + 3);
        }
      }

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [reaction, isPlaying, rxSpeed, isGas, isPrecipitate, isCombustion, isHeat, isColorShift, precipitateColor]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {/* Visual Canvas Container */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '240px', 
        borderRadius: 'var(--radius-md)', 
        overflow: 'hidden', 
        background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-surface-hover) 100%)', 
        border: '1.5px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <canvas
          ref={canvasRef}
          width={360}
          height={240}
          style={{ width: '360px', height: '240px', display: 'block' }}
        />

        {/* Phenomenon Badges overlay */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {isGas && (
            <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              💨 Có bọt khí thoát ra (↑)
            </span>
          )}
          {isPrecipitate && (
            <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              🧪 Tạo chất kết tủa (↓)
            </span>
          )}
          {isCombustion && (
            <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              🔥 Cháy sáng chói / Tỏa nhiệt
            </span>
          )}
          {isHeat && !isCombustion && (
            <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              ⚡ Phản ứng tỏa nhiều nhiệt
            </span>
          )}
          {isColorShift && (
            <span className="badge badge-physics" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              🎨 Đổi màu chỉ thị
            </span>
          )}
        </div>

        {/* Interactive Controls Overlay */}
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '6px' }}>
          <button
            className={`btn btn-sm ${isPlaying ? 'btn-secondary' : 'btn-emerald'}`}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />} {isPlaying ? 'Tạm dừng' : 'Chạy tiếp'}
          </button>
          {[1, 2].map(sp => (
            <button
              key={sp}
              className={`btn btn-sm ${rxSpeed === sp ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
              onClick={() => setRxSpeed(sp)}
            >
              {sp}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- MAIN TEACHER TOOLKIT ---
export default function TeacherToolkit() {
  const [activeTool, setActiveTool] = useState('whiteboard'); // whiteboard, chemical, converter, timer

  // ==========================================
  // 1. DUAL-LAYER WHITEBOARD ARCHITECTURE
  // ==========================================
  const gridCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  
  const [boardBg, setBoardBg] = useState('green'); // 'green' | 'white' | 'dark'
  const [gridType, setGridType] = useState('oly'); // 'oly' (20px) | 'squares' (40px) | 'oxy' | 'none'
  const [toolMode, setToolMode] = useState('pen'); // 'pen' | 'eraser' | 'box_select'
  const [penColor, setPenColor] = useState('#ffffff');
  const [penWidth, setPenWidth] = useState(4);
  const [eraserWidth, setEraserWidth] = useState(24);

  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);

  // Undo/Redo Stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Render Bottom Grid Canvas
  const drawGridLayer = () => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Fill background
    if (boardBg === 'green') {
      ctx.fillStyle = '#064e3b'; // School green chalkboard
    } else if (boardBg === 'white') {
      ctx.fillStyle = '#f8fafc'; // Whiteboard
    } else {
      ctx.fillStyle = '#0f172a'; // Slate dark
    }
    ctx.fillRect(0, 0, w, h);

    const isLightBg = boardBg === 'white';
    const mainGridColor = isLightBg ? 'rgba(2, 132, 199, 0.22)' : 'rgba(255, 255, 255, 0.12)';
    const subGridColor = isLightBg ? 'rgba(2, 132, 199, 0.10)' : 'rgba(255, 255, 255, 0.05)';

    // Render Grid Lines
    if (gridType === 'oly') {
      // 20px Ô ly học sinh
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += 20) {
        ctx.strokeStyle = (x % 100 === 0) ? mainGridColor : subGridColor;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += 20) {
        ctx.strokeStyle = (y % 100 === 0) ? mainGridColor : subGridColor;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    } else if (gridType === 'squares') {
      // 40px KHTN Squares
      ctx.strokeStyle = mainGridColor;
      ctx.lineWidth = 1.2;
      for (let x = 0; x <= w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    } else if (gridType === 'oxy') {
      // Coordinate System Oxy
      ctx.strokeStyle = subGridColor;
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Ox and Oy axes
      const ox = 120;
      const oy = h - 100;
      ctx.strokeStyle = isLightBg ? '#0284c7' : '#38bdf8';
      ctx.lineWidth = 2.5;

      // Ox
      ctx.beginPath();
      ctx.moveTo(40, oy);
      ctx.lineTo(w - 40, oy);
      ctx.stroke();
      // Arrow Ox
      ctx.beginPath();
      ctx.moveTo(w - 40, oy);
      ctx.lineTo(w - 52, oy - 6);
      ctx.lineTo(w - 52, oy + 6);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();

      // Oy
      ctx.beginPath();
      ctx.moveTo(ox, h - 40);
      ctx.lineTo(ox, 40);
      ctx.stroke();
      // Arrow Oy
      ctx.beginPath();
      ctx.moveTo(ox, 40);
      ctx.lineTo(ox - 6, 52);
      ctx.lineTo(ox + 6, 52);
      ctx.fill();

      // Labels
      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = 'bold 15px Outfit, sans-serif';
      ctx.fillText('x (hoặc t)', w - 30, oy + 5);
      ctx.fillText('y (hoặc v, s)', ox - 50, 35);
      ctx.fillText('O', ox - 18, oy + 22);
    }
  };

  useEffect(() => {
    if (activeTool === 'whiteboard') {
      drawGridLayer();
    }
  }, [activeTool, boardBg, gridType]);

  // Save snapshot for Undo
  const pushUndoSnapshot = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev.slice(-15), snapshot]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Push current to redo
    const currentSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack(prev => [...prev, currentSnapshot]);

    const prevSnapshot = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    ctx.putImageData(prevSnapshot, 0, 0);
    playPop();
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const nextSnapshot = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));

    const currentSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, currentSnapshot]);
    ctx.putImageData(nextSnapshot, 0, 0);
    playPop();
  };

  const getCanvasCoords = (e) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e) => {
    const coords = getCanvasCoords(e);
    pushUndoSnapshot();
    setIsDrawing(true);

    if (toolMode === 'box_select') {
      setDragStart(coords);
      setDragCurrent(coords);
      return;
    }

    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    if (toolMode === 'eraser') {
      // Partial eraser uses destination-out to erase only the drawing, preserving the grid!
      ctx.globalCompositeOperation = 'destination-out';
      ctx.arc(coords.x, coords.y, eraserWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);

    if (toolMode === 'box_select') {
      setDragCurrent(coords);
      return;
    }

    const canvas = drawCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (toolMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, eraserWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (toolMode === 'box_select' && dragStart && dragCurrent) {
      // Erase selected rectangle on drawing canvas
      const canvas = drawCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const minX = Math.min(dragStart.x, dragCurrent.x);
      const minY = Math.min(dragStart.y, dragCurrent.y);
      const w = Math.abs(dragCurrent.x - dragStart.x);
      const h = Math.abs(dragCurrent.y - dragStart.y);

      if (w > 5 && h > 5) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillRect(minX, minY, w, h);
        ctx.restore();
        playPop();
      }
      setDragStart(null);
      setDragCurrent(null);
    }
  };

  // Clear entire drawing canvas without touching grid lines!
  const clearWhiteboard = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    pushUndoSnapshot();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playPop();
  };

  // Download high-res combined image
  const handleDownloadBoard = () => {
    const gCanvas = gridCanvasRef.current;
    const dCanvas = drawCanvasRef.current;
    if (!gCanvas || !dCanvas) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = gCanvas.width;
    exportCanvas.height = gCanvas.height;
    const eCtx = exportCanvas.getContext('2d');

    // Draw grid, then drawing
    eCtx.drawImage(gCanvas, 0, 0);
    eCtx.drawImage(dCanvas, 0, 0);

    const link = document.createElement('a');
    link.download = `Bang_Viet_KHTN_${Date.now()}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
    playVictoryFanfare();
  };

  // ==========================================
  // 2. CHEMICAL BALANCER & VISUAL PHENOMENA WITH CRUD
  // ==========================================
  const [customReactions, setCustomReactions] = useState(() => {
    try {
      const saved = localStorage.getItem('khtn_custom_reactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const allReactions = [...CHEMICAL_REACTIONS, ...customReactions];

  const [chemicalInput, setChemicalInput] = useState('Fe + O2');
  const [balancedResult, setBalancedResult] = useState(allReactions[1]);

  // Modal for Teacher to Add/Edit Reaction
  const [showRxModal, setShowRxModal] = useState(false);
  const [editingRxId, setEditingRxId] = useState(null);
  const [rxFormReactants, setRxFormReactants] = useState('');
  const [rxFormProducts, setRxFormProducts] = useState('');
  const [rxFormBalanced, setRxFormBalanced] = useState('');
  const [rxFormNote, setRxFormNote] = useState('');

  const handleBalanceEquation = () => {
    playPop();
    const cleanIn = chemicalInput.toLowerCase().replace(/\s+/g, '');
    const found = allReactions.find(r => 
      r.reactants.toLowerCase().replace(/\s+/g, '') === cleanIn
    );
    if (found) {
      setBalancedResult(found);
    } else {
      setBalancedResult({
        reactants: chemicalInput,
        balanced: `${chemicalInput} → (Phản ứng tự động cân bằng theo quy tắc electron)`,
        note: '💡 Hiện tượng: Phản ứng tỏa nhiệt hoặc sủi bọt khí (Thầy/cô có thể bấm "+ Thêm Phản Ứng Mới" để lưu hiện tượng chi tiết).',
        isCustom: true
      });
    }
  };

  const handleSaveCustomReaction = (e) => {
    e.preventDefault();
    if (!rxFormReactants || !rxFormBalanced) return;

    if (editingRxId) {
      const updated = customReactions.map(r => r.id === editingRxId ? {
        ...r,
        reactants: rxFormReactants,
        products: rxFormProducts,
        balanced: rxFormBalanced,
        note: rxFormNote
      } : r);
      setCustomReactions(updated);
      localStorage.setItem('khtn_custom_reactions', JSON.stringify(updated));
    } else {
      const newRx = {
        id: `rx-${Date.now()}`,
        reactants: rxFormReactants,
        products: rxFormProducts,
        balanced: rxFormBalanced,
        note: rxFormNote || 'Phản ứng do giáo viên bổ sung.',
        isCustom: true
      };
      const updated = [newRx, ...customReactions];
      setCustomReactions(updated);
      localStorage.setItem('khtn_custom_reactions', JSON.stringify(updated));
      setBalancedResult(newRx);
    }

    setShowRxModal(false);
    setEditingRxId(null);
    setRxFormReactants('');
    setRxFormProducts('');
    setRxFormBalanced('');
    setRxFormNote('');
    playVictoryFanfare();
  };

  const handleDeleteReaction = (id) => {
    if (window.confirm('Thầy/cô có chắc muốn xóa phản ứng này?')) {
      const updated = customReactions.filter(r => r.id !== id);
      setCustomReactions(updated);
      localStorage.setItem('khtn_custom_reactions', JSON.stringify(updated));
      setBalancedResult(CHEMICAL_REACTIONS[0]);
      playPop();
    }
  };

  // ==========================================
  // 3. UNIT CONVERTER
  // ==========================================
  const [convType, setConvType] = useState('speed');
  const [convValue, setConvValue] = useState(36);
  const [molarSubstance, setMolarSubstance] = useState({ name: 'Fe (Sắt)', M: 56 });

  // ==========================================
  // 4. DISCUSSION TIMER
  // ==========================================
  const [timerDuration, setTimerDuration] = useState(180);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusSoundOn, setFocusSoundOn] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (focusSoundOn && prev > 1) {
            playFocusBeat();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playTimerBell();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft, focusSoundOn]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const setTimerPreset = (secs) => {
    setIsTimerRunning(false);
    setTimerDuration(secs);
    setTimerSecondsLeft(secs);
    playPop();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Tool Navigation Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeTool === 'whiteboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTool('whiteboard'); playPop(); }}
          >
            <PenTool size={16} /> Bảng Vẽ Nhanh (Whiteboard Chống Xóa Dòng)
          </button>
          <button
            className={`btn ${activeTool === 'chemical' ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => { setActiveTool('chemical'); playPop(); }}
          >
            <Flame size={16} /> Cân Bằng & Mô Phỏng Hiện Tượng Hóa Học
          </button>
          <button
            className={`btn ${activeTool === 'converter' ? 'btn-physics' : 'btn-secondary'}`}
            onClick={() => { setActiveTool('converter'); playPop(); }}
          >
            <Calculator size={16} /> Đổi Đại Lượng KHTN
          </button>
          <button
            className={`btn ${activeTool === 'timer' ? 'btn-emerald' : 'btn-secondary'}`}
            onClick={() => { setActiveTool('timer'); playPop(); }}
          >
            <Timer size={16} /> Đồng Hồ Thảo Luận Nhóm
          </button>
        </div>
      </div>

      {/* =========================================================
          TOOL 1: DUAL-LAYER WHITEBOARD
         ========================================================= */}
      {activeTool === 'whiteboard' && (
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Controls Bar 1: Mode & Colors */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            {/* Draw / Erase Modes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className={`btn btn-sm ${toolMode === 'pen' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setToolMode('pen'); playPop(); }}
              >
                <PenTool size={14} /> Bút Viết
              </button>

              <button
                className={`btn btn-sm ${toolMode === 'eraser' ? 'btn-amber' : 'btn-secondary'}`}
                onClick={() => { setToolMode('eraser'); playPop(); }}
                title="Tẩy từng phần bằng nét di chuyển, không làm mất dòng kẻ bảng"
              >
                <Eraser size={14} /> Tẩy Từng Phần
              </button>

              <button
                className={`btn btn-sm ${toolMode === 'box_select' ? 'btn-physics' : 'btn-secondary'}`}
                onClick={() => { setToolMode('box_select'); playPop(); }}
                title="Kéo chuột khoanh vùng để xóa đối tượng/nét vẽ trong vùng đó"
              >
                <Square size={14} /> Xóa Vùng Chọn
              </button>

              {/* Color Palette (Active when in Pen mode) */}
              {toolMode === 'pen' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.5rem' }}>
                  {(boardBg === 'white' 
                    ? ['#0f172a', '#0284c7', '#dc2626', '#16a34a', '#7c3aed', '#ea580c']
                    : ['#ffffff', '#fef08a', '#38bdf8', '#4ade80', '#f43f5e', '#c084fc']
                  ).map(c => (
                    <button
                      key={c}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: c,
                        border: penColor === c ? '2.5px solid #0284c7' : '1px solid rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        transform: penColor === c ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                      onClick={() => { setPenColor(c); playPop(); }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Undo / Redo / Clear / Export */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleUndo} 
                disabled={undoStack.length === 0}
                title="Hoàn tác (Undo)"
              >
                <Undo2 size={14} />
              </button>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleRedo} 
                disabled={redoStack.length === 0}
                title="Làm lại (Redo)"
              >
                <Redo2 size={14} />
              </button>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleDownloadBoard}
                title="Lưu ảnh bài giảng PNG"
              >
                <Download size={14} /> Lưu Ảnh
              </button>

              <button 
                className="btn btn-danger btn-sm" 
                onClick={clearWhiteboard}
                title="Xóa toàn bộ nét vẽ nhưng giữ nguyên 100% dòng kẻ bảng"
              >
                <Trash2 size={14} /> Xóa Toàn Bộ Bảng
              </button>
            </div>
          </div>

          {/* Controls Bar 2: Board Styles & Thickness */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', padding: '0.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
            {/* Board Background & Grid Types */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Mặt bảng:</span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  className={`btn btn-sm ${boardBg === 'green' ? 'btn-emerald' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}
                  onClick={() => { setBoardBg('green'); setPenColor('#ffffff'); playPop(); }}
                >
                  Bảng Xanh Học Đường
                </button>
                <button
                  className={`btn btn-sm ${boardBg === 'white' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}
                  onClick={() => { setBoardBg('white'); setPenColor('#0284c7'); playPop(); }}
                >
                  Bảng Trắng Chống Lóa
                </button>
                <button
                  className={`btn btn-sm ${boardBg === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}
                  onClick={() => { setBoardBg('dark'); setPenColor('#38bdf8'); playPop(); }}
                >
                  Bảng Đen Trầm
                </button>
              </div>

              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Dòng kẻ:</span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  className={`btn btn-sm ${gridType === 'oly' ? 'btn-cyan' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}
                  onClick={() => { setGridType('oly'); playPop(); }}
                >
                  Ô Ly (20px)
                </button>
                <button
                  className={`btn btn-sm ${gridType === 'squares' ? 'btn-cyan' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}
                  onClick={() => { setGridType('squares'); playPop(); }}
                >
                  Ô Vuông KHTN (40px)
                </button>
                <button
                  className={`btn btn-sm ${gridType === 'oxy' ? 'btn-cyan' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}
                  onClick={() => { setGridType('oxy'); playPop(); }}
                >
                  Trục Oxy (Vật lý)
                </button>
                <button
                  className={`btn btn-sm ${gridType === 'none' ? 'btn-cyan' : 'btn-secondary'}`}
                  style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}
                  onClick={() => { setGridType('none'); playPop(); }}
                >
                  Trơn
                </button>
              </div>
            </div>

            {/* Thickness Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {toolMode === 'eraser' ? `Cỡ tẩy: ${eraserWidth}px` : `Cỡ nét: ${penWidth}px`}
              </span>
              <input
                type="range"
                min={toolMode === 'eraser' ? '10' : '2'}
                max={toolMode === 'eraser' ? '60' : '20'}
                value={toolMode === 'eraser' ? eraserWidth : penWidth}
                onChange={(e) => {
                  if (toolMode === 'eraser') setEraserWidth(Number(e.target.value));
                  else setPenWidth(Number(e.target.value));
                }}
                style={{ cursor: 'pointer', width: '100px' }}
              />
            </div>
          </div>

          {/* DUAL-LAYER CANVAS CONTAINER */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '520px', 
            borderRadius: 'var(--radius-md)', 
            overflow: 'hidden', 
            border: '2px solid var(--border-subtle)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)'
          }}>
            {/* LAYER 1 (BOTTOM): PERMANENT GRID CANVAS */}
            <canvas
              ref={gridCanvasRef}
              width={1200}
              height={650}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                display: 'block'
              }}
            />

            {/* LAYER 2 (TOP): TRANSPARENT USER DRAWING CANVAS */}
            <canvas
              ref={drawCanvasRef}
              width={1200}
              height={650}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: toolMode === 'eraser' ? 'cell' : toolMode === 'box_select' ? 'crosshair' : 'crosshair',
                display: 'block'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />

            {/* Box selection overlay indicator */}
            {toolMode === 'box_select' && isDrawing && dragStart && dragCurrent && (
              <div
                style={{
                  position: 'absolute',
                  left: `${Math.min(dragStart.x, dragCurrent.x) / 1200 * 100}%`,
                  top: `${Math.min(dragStart.y, dragCurrent.y) / 650 * 100}%`,
                  width: `${Math.abs(dragCurrent.x - dragStart.x) / 1200 * 100}%`,
                  height: `${Math.abs(dragCurrent.y - dragStart.y) / 650 * 100}%`,
                  border: '2px dashed #f43f5e',
                  backgroundColor: 'rgba(244, 63, 94, 0.2)',
                  pointerEvents: 'none',
                  borderRadius: '3px'
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          TOOL 2: CHEMICAL BALANCER & VISUAL PHENOMENA
         ========================================================= */}
      {activeTool === 'chemical' && (
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#f59e0b', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={22} /> Cân Bằng Phương Trình & Mô Phỏng Hiện Tượng Hóa Học
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Trực quan hóa hiện tượng xảy ra trong ống nghiệm: sủi bọt khí, đổi màu kết tủa, tỏa nhiệt và ngọn lửa theo chuẩn GDPT 2018.
              </p>
            </div>

            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditingRxId(null);
                setRxFormReactants('');
                setRxFormProducts('');
                setRxFormBalanced('');
                setRxFormNote('');
                setShowRxModal(true);
                playPop();
              }}
            >
              <Plus size={15} /> Thêm Phản Ứng Của Thầy/Cô
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '650px' }}>
            <input
              type="text"
              className="form-input"
              value={chemicalInput}
              onChange={(e) => setChemicalInput(e.target.value)}
              placeholder="Ví dụ: Fe + O2, Zn + HCl, CaO + H2O, CuSO4 + NaOH..."
              style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleBalanceEquation(); }}
            />
            <button className="btn btn-amber" onClick={handleBalanceEquation}>
              Cân Bằng & Mô Phỏng
            </button>
          </div>

          {/* Quick preset buttons */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              ⚡ Thử nhanh các phản ứng điển hình trong SGK:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
              {allReactions.map((r, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <button
                    className={`btn btn-sm ${balancedResult?.reactants === r.reactants ? 'btn-amber' : 'btn-secondary'}`}
                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
                    onClick={() => {
                      setChemicalInput(r.reactants);
                      setBalancedResult(r);
                      playPop();
                    }}
                  >
                    {r.reactants}
                  </button>
                  {r.isCustom && (
                    <button
                      onClick={() => handleDeleteReaction(r.id)}
                      style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '0 4px' }}
                      title="Xóa phản ứng này"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Result & Phenomenon Card */}
          {balancedResult && (
            <div 
              className="glass-card reaction-detail-grid"
              style={{ 
                background: 'var(--bg-surface)', 
                border: '2px solid #f59e0b', 
                padding: '1.5rem',
                borderLeft: '6px solid #f59e0b',
                alignItems: 'center'
              }}
            >
              {/* Left Details */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-amber">PHƯƠNG TRÌNH ĐÃ CÂN BẰNG</span>
                  {balancedResult.isCustom && (
                    <span className="badge badge-cyan">Phản ứng tự tạo</span>
                  )}
                </div>

                <div style={{ 
                  fontSize: '1.45rem', 
                  fontWeight: 800, 
                  color: 'var(--text-main)', 
                  margin: '0.5rem 0',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-surface-hover)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border-subtle)',
                  overflowX: 'auto',
                  overflowY: 'hidden'
                }}>
                  <ChemicalEquation formula={balancedResult.balanced} />
                </div>

                <div style={{ fontSize: '0.92rem', color: '#0284c7', lineHeight: '1.5', marginTop: '0.75rem' }}>
                  <strong>💡 Hiện tượng quan sát được:</strong>
                  <p style={{ marginTop: '0.25rem', color: 'var(--text-main)' }}>
                    {balancedResult.note}
                  </p>
                </div>
              </div>

              {/* Right: Visual Animated Phenomenon Simulator */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={15} /> Trực Quan Hóa Ống Nghiệm Thí Nghiệm:
                </div>
                <ReactionPhenomenonVisualizer reaction={balancedResult} />
              </div>
            </div>
          )}

          {/* Teacher Add/Edit Reaction Modal */}
          {showRxModal && (
            <div className="modal-backdrop">
              <div className="modal-content" style={{ maxWidth: '520px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#f59e0b' }}>
                    {editingRxId ? 'Chỉnh Sửa Phản Ứng' : 'Thêm Phản Ứng Mới'}
                  </h3>
                  <button onClick={() => setShowRxModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <X size={20} color="var(--text-muted)" />
                  </button>
                </div>

                <form onSubmit={handleSaveCustomReaction} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Chất tham gia (Reactants):
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ví dụ: BaCl2 + H2SO4"
                      value={rxFormReactants}
                      onChange={(e) => setRxFormReactants(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Phương trình cân bằng đầy đủ:
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ví dụ: BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl"
                      value={rxFormBalanced}
                      onChange={(e) => setRxFormBalanced(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Mô tả hiện tượng xảy ra (kèm từ khóa: sủi bọt khí, kết tủa trắng/xanh/nâu đỏ, tỏa nhiệt, cháy sáng):
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="Ví dụ: Xuất hiện kết tủa trắng lắng xuống đáy, không tan trong axit dư."
                      value={rxFormNote}
                      onChange={(e) => setRxFormNote(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowRxModal(false)}>
                      Hủy Bỏ
                    </button>
                    <button type="submit" className="btn btn-amber">
                      Lưu Phản Ứng
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          TOOL 3: UNIT CONVERTER
         ========================================================= */}
      {activeTool === 'converter' && (
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#0284c7', marginBottom: '0.35rem' }}>
              Máy Tính Chuyển Đổi Đại Lượng KHTN
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Quy đổi nhanh giữa các đơn vị đo lường Vật lí và Hóa học chuẩn GDPT 2018 (Ví dụ: Thể tích khí ở đktc = 24.79 L/mol tại 25°C, 1 bar).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-sm ${convType === 'speed' ? 'btn-physics' : 'btn-secondary'}`}
              onClick={() => { setConvType('speed'); setConvValue(36); playPop(); }}
            >
              Vận Tốc (km/h ↔ m/s)
            </button>
            <button 
              className={`btn btn-sm ${convType === 'gas' ? 'btn-physics' : 'btn-secondary'}`}
              onClick={() => { setConvType('gas'); setConvValue(1); playPop(); }}
            >
              Thể Tích Khí đktc (mol ↔ L)
            </button>
            <button 
              className={`btn btn-sm ${convType === 'energy' ? 'btn-physics' : 'btn-secondary'}`}
              onClick={() => { setConvType('energy'); setConvValue(1000); playPop(); }}
            >
              Nhiệt Lượng (J ↔ cal)
            </button>
            <button 
              className={`btn btn-sm ${convType === 'pressure' ? 'btn-physics' : 'btn-secondary'}`}
              onClick={() => { setConvType('pressure'); setConvValue(101325); playPop(); }}
            >
              Áp Suất (Pa ↔ atm, mmHg)
            </button>
            <button 
              className={`btn btn-sm ${convType === 'mole' ? 'btn-physics' : 'btn-secondary'}`}
              onClick={() => { setConvType('mole'); setConvValue(56); playPop(); }}
            >
              Khối Lượng & Mol (g ↔ mol)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '720px' }}>
            <div className="glass-card">
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                {convType === 'speed' 
                  ? 'Giá trị (km/h):' 
                  : convType === 'gas' 
                  ? 'Số mol khí (mol):' 
                  : convType === 'energy' 
                  ? 'Năng lượng (Joule - J):' 
                  : convType === 'pressure'
                  ? 'Áp suất (Pascal - Pa hoặc N/m²):'
                  : 'Khối lượng chất (gam):'}
              </label>
              <input
                type="number"
                className="form-input"
                value={convValue}
                onChange={(e) => setConvValue(Number(e.target.value))}
                style={{ fontSize: '1.2rem', fontWeight: 700 }}
              />

              {convType === 'mole' && (
                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Chọn chất hóa học:
                  </label>
                  <select 
                    className="form-select"
                    value={molarSubstance.M}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      const map = { 56: 'Fe (56 g/mol)', 64: 'Cu (64 g/mol)', 27: 'Al (27 g/mol)', 100: 'CaCO3 (100 g/mol)', 58.5: 'NaCl (58.5 g/mol)', 18: 'H2O (18 g/mol)' };
                      setMolarSubstance({ name: map[m] || 'Khác', M: m });
                    }}
                  >
                    <option value={56}>Fe (Sắt, M = 56)</option>
                    <option value={64}>Cu (Đồng, M = 64)</option>
                    <option value={27}>Al (Nhôm, M = 27)</option>
                    <option value={100}>CaCO₃ (Đá vôi, M = 100)</option>
                    <option value={58.5}>NaCl (Muối ăn, M = 58.5)</option>
                    <option value={18}>H₂O (Nước, M = 18)</option>
                  </select>
                </div>
              )}
            </div>

            <div className="glass-card" style={{ background: 'var(--bg-surface-hover)' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                {convType === 'speed' 
                  ? 'Kết quả quy đổi (m/s):' 
                  : convType === 'gas' 
                  ? 'Thể tích ở đktc 25°C, 1 bar (Lít):' 
                  : convType === 'energy' 
                  ? 'Kết quả (Calorie - cal):'
                  : convType === 'pressure'
                  ? 'Quy đổi sang atm & mmHg:'
                  : 'Số mol thu được (mol):'}
              </label>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7' }}>
                {convType === 'speed' 
                  ? (convValue / 3.6).toFixed(2) + ' m/s'
                  : convType === 'gas'
                  ? (convValue * 24.79).toFixed(2) + ' Lít'
                  : convType === 'energy'
                  ? (convValue / 4.184).toFixed(2) + ' cal'
                  : convType === 'pressure'
                  ? `${(convValue / 101325).toFixed(3)} atm • ${(convValue / 133.322).toFixed(1)} mmHg`
                  : `${(convValue / molarSubstance.M).toFixed(3)} mol`}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                {convType === 'speed' 
                  ? 'Công thức: v(m/s) = v(km/h) / 3.6' 
                  : convType === 'gas' 
                  ? 'GDPT 2018: V = n × 24.79 (lít) tại 25°C, 1 bar' 
                  : convType === 'energy'
                  ? 'Công thức: 1 cal ≈ 4.184 J'
                  : convType === 'pressure'
                  ? '1 atm = 101 325 Pa = 760 mmHg = 1.013 bar'
                  : `Công thức: n = m / M = ${convValue} / ${molarSubstance.M}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TOOL 4: GROUP DISCUSSION TIMER
         ========================================================= */}
      {activeTool === 'timer' && (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#059669', marginBottom: '0.5rem' }}>
            Đồng Hồ Thảo Luận Nhóm & Làm Bài 15 Phút
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Đặt thời gian hoạt động nhóm, có chuông báo thanh tịnh khi hết giờ!
          </p>

          {/* Big Digital Clock */}
          <div 
            style={{ 
              fontSize: '5rem', 
              fontWeight: 900, 
              fontFamily: 'var(--font-mono)', 
              color: timerSecondsLeft <= 10 ? '#f43f5e' : '#059669',
              background: 'var(--bg-surface)',
              padding: '1rem 3rem',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid rgba(5, 150, 105, 0.4)',
              boxShadow: '0 4px 20px rgba(5, 150, 105, 0.2)',
              letterSpacing: '0.05em'
            }}
          >
            {formatTimer(timerSecondsLeft)}
          </div>

          {/* Focus Beat Sound Toggle */}
          <div style={{ margin: '1rem 0 0.5rem' }}>
            <button
              className={`btn btn-sm ${focusSoundOn ? 'btn-emerald' : 'btn-secondary'}`}
              onClick={() => { setFocusSoundOn(!focusSoundOn); playPop(); }}
            >
              {focusSoundOn ? '🔊 Âm Thanh Nhịp Gõ Tập Trung: BẬT' : '🔇 Âm Thanh Nhịp Gõ: TẮT'}
            </button>
          </div>

          {/* Presets */}
          <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0 1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setTimerPreset(60)}>1 Phút</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setTimerPreset(180)}>3 Phút (Thảo luận)</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setTimerPreset(300)}>5 Phút (Báo cáo)</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setTimerPreset(900)}>15 Phút (Kiểm tra)</button>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className={`btn ${isTimerRunning ? 'btn-danger' : 'btn-emerald'} btn-lg`}
              onClick={() => { setIsTimerRunning(!isTimerRunning); playPop(); }}
              style={{ minWidth: '160px' }}
            >
              {isTimerRunning ? 'Tạm Dừng' : 'Bắt Đầu'}
            </button>
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => { setTimerSecondsLeft(timerDuration); setIsTimerRunning(false); playPop(); }}
            >
              <RotateCcw size={18} /> Đặt Lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
