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
  Moon
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
    { id: 'games', label: '1. Khởi Động & Trò Chơi', icon: Gamepad2, badge: 'Đầu giờ' },
    { id: 'lab', label: '2. Thí Nghiệm & Bục Giảng', icon: FlaskConical, badge: 'Lên lớp' },
    { id: 'qa', label: '3. Q&A & AI Trợ Giảng', icon: HelpCircle, badge: 'Sau giờ' },
    { id: 'exam', label: '4. Ngân Hàng Đề Thi', icon: FileText, badge: 'Bộ GD&ĐT' },
    { id: 'classes', label: '5. Quản Lý Lớp Học', icon: Users, badge: `${currentClass?.students?.length || 0} HS` }
  ];

  return (
    <header className="navbar-header">
      {/* Brand Logo & Name */}
      <div className="brand-container" onClick={() => setActiveTab('games')}>
        <div className="brand-icon-box">
          <Atom className="animate-spin-slow" size={26} color="#06b6d4" />
        </div>
        <div>
          <div className="brand-title">EduHub</div>
        </div>
      </div>

      {/* Center Tab Navigation */}
      <nav className="nav-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                playPop();
                setActiveTab(tab.id);
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`badge badge-pill ${isActive ? 'badge-cyan' : 'badge-physics'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Class Picker, Sound & Fullscreen */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Class Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Layers size={16} color="var(--text-muted)" />
          <select 
            className="form-select"
            value={selectedClassId}
            onChange={(e) => {
              playPop();
              setSelectedClassId(e.target.value);
            }}
            style={{ 
              padding: '0.4rem 0.75rem', 
              fontSize: '0.88rem', 
              background: 'var(--bg-surface)', 
              color: 'var(--text-main)',
              border: '1.5px solid var(--border-subtle)',
              fontWeight: 600,
              width: 'auto'
            }}
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id} style={{ background: 'var(--bg-surface)', color: 'var(--text-main)' }}>
                {cls.name} ({cls.academicYear})
              </option>
            ))}
          </select>
        </div>

        {/* Audio Toggle */}
        <button
          className="btn btn-secondary btn-icon"
          title={soundOn ? 'Tắt âm thanh trò chơi' : 'Bật âm thanh trò chơi'}
          onClick={toggleSound}
          style={{ width: '38px', height: '38px' }}
        >
          {soundOn ? <Volume2 size={18} color="#06b6d4" /> : <VolumeX size={18} color="var(--text-dim)" />}
        </button>

        {/* Classroom Projector / Light Theme vs Cyber Dark Toggle */}
        <button
          className={`btn ${theme === 'light' ? 'btn-amber' : 'btn-secondary'} btn-icon`}
          title={theme === 'light' ? 'Đang bật: Chế độ Máy Chiếu Lớp Học (Sáng - Tương phản cao). Bấm để đổi sang Phòng Lab Tối' : 'Đang bật: Phòng Lab Tối. Bấm để đổi sang Máy Chiếu Lớp Học (Sáng)'}
          onClick={toggleTheme}
          style={{ width: '38px', height: '38px' }}
        >
          {theme === 'light' ? <Sun size={19} color="#ffffff" /> : <Moon size={18} color="#c4b5fd" />}
        </button>

        {/* Fullscreen / Presentation Mode Toggle */}
        <button
          className={`btn ${isPresentationMode ? 'btn-primary' : 'btn-secondary'} btn-icon`}
          title={isPresentationMode ? 'Thoát chế độ trình chiếu TV' : 'Bật chế độ trình chiếu lớp học (chữ to)'}
          onClick={togglePresentation}
          style={{ width: '38px', height: '38px' }}
        >
          {isPresentationMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </header>
  );
}
