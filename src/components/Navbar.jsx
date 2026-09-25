import React, { useState } from 'react';
import { 
  Atom, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Gamepad2, 
  FlaskConical, 
  HelpCircle, 
  FileText, 
  Users,
  Layers,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playPop } from '../utils/soundEffects';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  classes, 
  selectedClassId, 
  setSelectedClassId,
  isPresentationMode,
  setIsPresentationMode,
  soundOn,
  setSoundOn,
  theme = 'light',
  setTheme
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    if (newState) playPop();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('khtn_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    playPop();
  };

  const togglePresentation = () => {
    setIsPresentationMode(!isPresentationMode);
    playPop();
  };

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  const tabs = [
    { id: 'games', label: '1. Khởi Động & Trò Chơi', shortLabel: 'Khởi Động', icon: Gamepad2, badge: 'Đầu giờ' },
    { id: 'lab', label: '2. Thí Nghiệm & Bục Giảng', shortLabel: 'Thí Nghiệm', icon: FlaskConical, badge: 'Lên lớp' },
    { id: 'qa', label: '3. Q&A & AI Trợ Giảng', shortLabel: 'Hỏi Đáp & AI', icon: HelpCircle, badge: 'Sau giờ' },
    { id: 'exam', label: '4. Ngân Hàng Đề Thi', shortLabel: 'Đề Thi', icon: FileText, badge: 'Bộ GD&ĐT' },
    { id: 'classes', label: '5. Quản Lý Lớp Học', shortLabel: 'Lớp Học', icon: Users, badge: `${currentClass?.students?.length || 0} HS` }
  ];

  const handleTabClick = (tabId) => {
    playPop();
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="navbar-header">
        {/* Brand Logo & Name */}
        <div className="brand-container" onClick={() => handleTabClick('games')}>
          <div className="brand-icon-box">
            <Atom className="animate-spin-slow" size={26} color="#06b6d4" />
          </div>
          <div>
            <div className="brand-title">EduHub</div>
          </div>
        </div>

        {/* Center Tab Navigation (Adaptive: Short on tablet/laptop, full on ultra-wide) */}
        <nav className="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <Icon size={17} className="nav-tab-icon" />
                <span className="nav-tab-label-full">{tab.label}</span>
                <span className="nav-tab-label-short">{tab.shortLabel}</span>
                {tab.badge && (
                  <span className={`badge badge-pill nav-tab-badge ${isActive ? 'badge-cyan' : 'badge-physics'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Class Picker, Sound, Theme, Presentation, Mobile Toggle */}
        <div className="navbar-controls">
          {/* Class Selector Dropdown */}
          <div className="class-selector-wrapper">
            <Layers size={15} color="var(--text-muted)" className="class-selector-icon" />
            <select 
              className="form-select class-selector-dropdown"
              value={selectedClassId}
              onChange={(e) => {
                playPop();
                setSelectedClassId(e.target.value);
              }}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}{cls.academicYear ? ` (${cls.academicYear})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Audio Toggle */}
          <button
            className="btn btn-secondary btn-icon"
            title={soundOn ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            onClick={toggleSound}
          >
            {soundOn ? <Volume2 size={17} color="#06b6d4" /> : <VolumeX size={17} color="var(--text-dim)" />}
          </button>

          {/* Theme Toggle: Projector Light vs Cyber Lab Dark */}
          <button
            className={`btn ${theme === 'light' ? 'btn-amber' : 'btn-secondary'} btn-icon`}
            title={theme === 'light' ? 'Đang bật: Máy Chiếu Lớp Học (Sáng). Bấm để chuyển Lab Tối' : 'Đang bật: Lab Tối. Bấm để chuyển Máy Chiếu Lớp Học (Sáng)'}
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Sun size={18} color="#ffffff" /> : <Moon size={17} color="#c4b5fd" />}
          </button>

          {/* Fullscreen / Presentation Mode Toggle */}
          <button
            className={`btn ${isPresentationMode ? 'btn-primary' : 'btn-secondary'} btn-icon`}
            title={isPresentationMode ? 'Thoát chế độ trình chiếu TV' : 'Bật chế độ trình chiếu lớp học'}
            onClick={togglePresentation}
          >
            {isPresentationMode ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            className="btn btn-secondary btn-icon mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="Menu điều hướng"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="brand-container">
                <div className="brand-icon-box" style={{ width: '36px', height: '36px' }}>
                  <Atom size={20} color="#06b6d4" />
                </div>
                <div className="brand-title" style={{ fontSize: '1.2rem' }}>EduHub</div>
              </div>
              <button 
                className="btn btn-secondary btn-icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-drawer-section">
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                🏫 LỚP ĐANG DẠY HỌC:
              </label>
              <select 
                className="form-select"
                value={selectedClassId}
                onChange={(e) => {
                  playPop();
                  setSelectedClassId(e.target.value);
                }}
                style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.92rem' }}
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}{cls.academicYear ? ` (${cls.academicYear})` : ''} - {cls.students?.length || 0} Học Sinh
                  </option>
                ))}
              </select>
            </div>

            <div className="mobile-drawer-tabs">
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                📑 CHỨC NĂNG CHÍNH:
              </label>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={`mobile-drawer-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <Icon size={20} color={isActive ? '#0284c7' : 'var(--text-muted)'} />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isActive ? 'var(--cyan-primary)' : 'var(--text-main)' }}>
                        {tab.label}
                      </div>
                    </div>
                    {tab.badge && (
                      <span className={`badge ${isActive ? 'badge-cyan' : 'badge-physics'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mobile-drawer-footer">
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                <button
                  className={`btn ${theme === 'light' ? 'btn-amber' : 'btn-secondary'}`}
                  onClick={toggleTheme}
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                >
                  {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{theme === 'light' ? 'Chế độ Sáng' : 'Chế độ Tối'}</span>
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={toggleSound}
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                >
                  {soundOn ? <Volume2 size={16} color="#06b6d4" /> : <VolumeX size={16} />}
                  <span>{soundOn ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
