import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LuckyWheel from './components/LuckyWheel';
import SeatingMap from './components/SeatingMap';
import MysteryBoxes from './components/MysteryBoxes';
import QuickBattle from './components/QuickBattle';
import PeriodicTable from './components/PeriodicTable';
import SimulationsLab from './components/SimulationsLab';
import TeacherToolkit from './components/TeacherToolkit';
import QABoard from './components/QABoard';
import SciBuddyAI from './components/SciBuddyAI';
import ExamGenerator from './components/ExamGenerator';
import ClassManager from './components/ClassManager';

import { INITIAL_CLASSES, QUESTION_BANK } from './data/mockData';
import { 
  Sparkles, 
  Gamepad2, 
  Users, 
  Gift, 
  Swords, 
  Atom, 
  FlaskConical, 
  PenTool, 
  MessageSquare, 
  Bot 
} from 'lucide-react';
import { playPop, setSoundEnabled } from './utils/soundEffects';
import { syncClasses, loadClassesWithCloudFallback, isSupabaseConfigured } from './utils/supabaseClient';

export default function App() {
  // Main Navigation Tabs: games, lab, qa, exam, classes
  const [activeTab, setActiveTab] = useState('games');

  // Sub-tabs for Tab 1 (Games): wheel, seating, mystery, battle
  const [activeGameSubTab, setActiveGameSubTab] = useState('wheel');

  // Sub-tabs for Tab 2 (Lab): periodic, simulations, toolkit
  const [activeLabSubTab, setActiveLabSubTab] = useState('periodic');

  // Sub-tabs for Tab 3 (QA): board, scibuddy
  const [activeQASubTab, setActiveQASubTab] = useState('board');

  // Presentation / Fullscreen Mode
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Sound FX State (Persisted in localStorage)
  const [soundOn, setSoundOn] = useState(() => {
    try {
      const saved = localStorage.getItem('khtn_sound_on');
      return saved !== null ? saved === 'true' : true;
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('khtn_sound_on', String(soundOn));
      setSoundEnabled(soundOn);
    } catch (e) {}
  }, [soundOn]);

  // Persistent Classes State
  const [classes, setClasses] = useState(() => {
    try {
      const saved = localStorage.getItem('khtn_hub_classes');
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch (e) {
      return INITIAL_CLASSES;
    }
  });

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'class-8a1');

  // Classroom Projector / Light Theme vs Cyber Lab Dark
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('khtn_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('khtn_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Load from Supabase on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      loadClassesWithCloudFallback(INITIAL_CLASSES).then(cloudData => {
        if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
          setClasses(cloudData);
        }
      });
    }
  }, []);

  // Persist classes to LocalStorage and sync with Supabase whenever updated
  useEffect(() => {
    syncClasses(classes);
  }, [classes]);

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Helper to add stars to a student by name
  const handleAddStarByName = (studentName, count = 1) => {
    setClasses(prev => prev.map(cls => {
      if (cls.id === selectedClassId) {
        return {
          ...cls,
          students: cls.students.map(s => {
            if (s.name === studentName) {
              return { 
                ...s, 
                stars: (s.stars || 0) + count,
                answersCount: (s.answersCount || 0) + 1
              };
            }
            return s;
          })
        };
      }
      return cls;
    }));
  };

  // Helper to update student properties by ID
  const handleUpdateStudent = (studentId, updates) => {
    setClasses(prev => prev.map(cls => {
      if (cls.id === selectedClassId) {
        return {
          ...cls,
          students: cls.students.map(s => {
            if (s.id === studentId) {
              return { ...s, ...updates };
            }
            return s;
          })
        };
      }
      return cls;
    }));
  };

  return (
    <div className={`app-container ${isPresentationMode ? 'presentation-mode' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        classes={classes}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        isPresentationMode={isPresentationMode}
        setIsPresentationMode={setIsPresentationMode}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Viewport */}
      <main className={`main-app-container ${isPresentationMode ? 'presentation-active' : ''}`}>
        
        {/* =========================================================
            TAB 1: KHỞI ĐỘNG & TRÒ CHƠI KIỂM TRA BÀI CŨ (GAMIFICATION)
           ========================================================= */}
        {activeTab === 'games' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Sub-tab Pills */}
            <div className="subtab-pills-bar">
              <button
                className={`btn btn-sm ${activeGameSubTab === 'wheel' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setActiveGameSubTab('wheel'); playPop(); }}
              >
                <Sparkles size={16} /> Vòng Quay May Mắn (Kiểm Tra Bài Cũ)
              </button>
              <button
                className={`btn btn-sm ${activeGameSubTab === 'seating' ? 'btn-physics' : 'btn-secondary'}`}
                onClick={() => { setActiveGameSubTab('seating'); playPop(); }}
              >
                <Users size={16} /> Sơ Đồ Lớp Tương Tác (Quét Laser Bàn)
              </button>
              <button
                className={`btn btn-sm ${activeGameSubTab === 'mystery' ? 'btn-amber' : 'btn-secondary'}`}
                onClick={() => { setActiveGameSubTab('mystery'); playPop(); }}
              >
                <Gift size={16} /> Hộp Quà Bí Ẩn (Mystery Boxes)
              </button>
              <button
                className={`btn btn-sm ${activeGameSubTab === 'battle' ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => { setActiveGameSubTab('battle'); playPop(); }}
              >
                <Swords size={16} /> Đấu Trường Tri Thức 5 Phút
              </button>
            </div>

            {/* Sub-tab Views */}
            {activeGameSubTab === 'wheel' && (
              <LuckyWheel 
                currentClass={currentClass} 
                onAddStar={handleAddStarByName} 
                questionBank={QUESTION_BANK} 
              />
            )}
            {activeGameSubTab === 'seating' && (
              <SeatingMap 
                currentClass={currentClass} 
                onUpdateStudent={handleUpdateStudent} 
              />
            )}
            {activeGameSubTab === 'mystery' && (
              <MysteryBoxes 
                currentClass={currentClass}
                onAddStar={handleAddStarByName}
              />
            )}
            {activeGameSubTab === 'battle' && (
              <QuickBattle 
                currentClass={currentClass} 
                questionBank={QUESTION_BANK} 
                onAddStar={handleAddStarByName}
              />
            )}
          </div>
        )}

        {/* =========================================================
            TAB 2: THÍ NGHIỆM & BỤC GIẢNG SỐ (INTERACTIVE LAB)
           ========================================================= */}
        {activeTab === 'lab' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Sub-tab Pills */}
            <div className="subtab-pills-bar">
              <button
                className={`btn btn-sm ${activeLabSubTab === 'periodic' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setActiveLabSubTab('periodic'); playPop(); }}
              >
                <Atom size={16} /> Bảng Tuần Hoàn IUPAC 2018 (3D Electron)
              </button>
              <button
                className={`btn btn-sm ${activeLabSubTab === 'simulations' ? 'btn-emerald' : 'btn-secondary'}`}
                onClick={() => { setActiveLabSubTab('simulations'); playPop(); }}
              >
                <FlaskConical size={16} /> Phòng Thí Nghiệm Ảo PhET (Lý - Hóa - Sinh)
              </button>
              <button
                className={`btn btn-sm ${activeLabSubTab === 'toolkit' ? 'btn-physics' : 'btn-secondary'}`}
                onClick={() => { setActiveLabSubTab('toolkit'); playPop(); }}
              >
                <PenTool size={16} /> Bộ Tiện Ích Bục Giảng (Bảng Vẽ, Cân Bằng PTHH, Đồng Hồ)
              </button>
            </div>

            {/* Sub-tab Views */}
            {activeLabSubTab === 'periodic' && (
              <PeriodicTable />
            )}
            {activeLabSubTab === 'simulations' && (
              <SimulationsLab />
            )}
            {activeLabSubTab === 'toolkit' && (
              <TeacherToolkit />
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: HỎI ĐÁP Q&A & AI TRỢ GIẢNG (SCIBUDDY)
           ========================================================= */}
        {activeTab === 'qa' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Sub-tab Pills */}
            <div className="subtab-pills-bar">
              <button
                className={`btn btn-sm ${activeQASubTab === 'board' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setActiveQASubTab('board'); playPop(); }}
              >
                <MessageSquare size={16} /> Diễn Đàn Hỏi Đáp Sau Giờ Học
              </button>
              <button
                className={`btn btn-sm ${activeQASubTab === 'scibuddy' ? 'btn-physics' : 'btn-secondary'}`}
                onClick={() => { setActiveQASubTab('scibuddy'); playPop(); }}
              >
                <Bot size={16} /> Trợ Lý AI Gợi Mở Socrates (SciBuddy AI)
              </button>
            </div>

            {/* Sub-tab Views */}
            {activeQASubTab === 'board' && (
              <QABoard currentClass={currentClass} />
            )}
            {activeQASubTab === 'scibuddy' && (
              <SciBuddyAI 
                onNavigateTab={(tab, subTab) => {
                  setActiveTab(tab);
                  if (tab === 'games' && subTab) setActiveGameSubTab(subTab);
                  if (tab === 'lab' && subTab) setActiveLabSubTab(subTab);
                  if (tab === 'qa' && subTab) setActiveQASubTab(subTab);
                }}
              />
            )}
          </div>
        )}

        {/* =========================================================
            TAB 4: NGÂN HÀNG ĐỀ & MA TRẬN BỘ GD&ĐT
           ========================================================= */}
        {activeTab === 'exam' && (
          <ExamGenerator currentClass={currentClass} />
        )}

        {/* =========================================================
            TAB 5: QUẢN LÝ LỚP HỌC & NHẬP EXCEL (VNEDU / SMAS)
           ========================================================= */}
        {activeTab === 'classes' && (
          <ClassManager 
            classes={classes} 
            setClasses={setClasses} 
            selectedClassId={selectedClassId} 
            setSelectedClassId={setSelectedClassId} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.25rem 2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: 'auto' }}>
        EduHub • Nền tảng Giáo dục Số & Trợ giảng Khoa học Tự nhiên THCS (Lớp 6, 7, 8, 9) chuẩn GDPT 2018 • Hỗ trợ hoàn toàn Ngoại tuyến (Offline-First)
      </footer>
    </div>
  );
}
