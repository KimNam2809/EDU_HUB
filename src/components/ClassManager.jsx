import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Trophy, 
  Star, 
  Upload, 
  Download, 
  RotateCcw, 
  CheckCircle2, 
  FileSpreadsheet, 
  FolderGit2, 
  FileText, 
  Plus, 
  ExternalLink,
  Presentation,
  Video,
  FileCode,
  Search,
  Edit2,
  Award,
  BookOpen,
  ClipboardList,
  Sparkles,
  UserCheck,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { TEACHER_DRIVE_RESOURCES } from '../data/mockData';
import { playPop, playVictoryFanfare } from '../utils/soundEffects';

export default function ClassManager({ classes, setClasses, selectedClassId, setSelectedClassId }) {
  const [activeSubTab, setActiveSubTab] = useState('students'); // 'students' | 'drive'
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentTeam, setNewStudentTeam] = useState('Tổ 1');
  const [bulkImportText, setBulkImportText] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Student Detail & Evaluation Modal State
  const [evalStudent, setEvalStudent] = useState(null); // The student currently being viewed/evaluated
  const [studentFormName, setStudentFormName] = useState('');
  const [studentFormTeam, setStudentFormTeam] = useState('Tổ 1');
  const [studentFormRow, setStudentFormRow] = useState(1);
  const [studentFormCol, setStudentFormCol] = useState(1);
  const [studentFormGender, setStudentFormGender] = useState('unknown');
  const [studentFormStars, setStudentFormStars] = useState(0);
  const [studentFormCompetency1, setStudentFormCompetency1] = useState('Tốt'); // Nhận thức KHTN
  const [studentFormCompetency2, setStudentFormCompetency2] = useState('Tốt'); // Tìm hiểu tự nhiên
  const [studentFormCompetency3, setStudentFormCompetency3] = useState('Khá'); // Vận dụng KHTN
  const [studentFormQuality, setStudentFormQuality] = useState('Chăm chỉ, trung thực'); // Phẩm chất
  const [studentFormNotes, setStudentFormNotes] = useState('');

  // Class Management State
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState(8);

  // Teacher Drive State
  const [driveResources, setDriveResources] = useState(() => {
    try {
      const saved = localStorage.getItem('khtn_teacher_drive');
      return saved ? JSON.parse(saved) : TEACHER_DRIVE_RESOURCES;
    } catch (e) {
      return TEACHER_DRIVE_RESOURCES;
    }
  });
  const [showAddResModal, setShowAddResModal] = useState(false);
  const [editingResId, setEditingResId] = useState(null);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResType, setNewResType] = useState('word');
  const [newResGrade, setNewResGrade] = useState(8);
  const [newResLink, setNewResLink] = useState('');
  const [driveSearch, setDriveSearch] = useState('');

  // Open Student Detail & Evaluation Modal
  const handleOpenStudentEval = (student) => {
    setEvalStudent(student);
    setStudentFormName(student.name);
    setStudentFormTeam(student.team || 'Tổ 1');
    setStudentFormRow(student.desk?.row || 1);
    setStudentFormCol(student.desk?.col || 1);
    setStudentFormGender(student.gender || 'unknown');
    setStudentFormStars(student.stars || 0);
    setStudentFormCompetency1(student.competency1 || 'Tốt');
    setStudentFormCompetency2(student.competency2 || 'Tốt');
    setStudentFormCompetency3(student.competency3 || 'Khá');
    setStudentFormQuality(student.quality || 'Chăm chỉ, trung thực');
    setStudentFormNotes(student.notes || '');
    playPop();
  };

  // Save Student Evaluation
  const handleSaveStudentEval = (e) => {
    e.preventDefault();
    if (!evalStudent || !studentFormName.trim()) return;

    setClasses(prev => prev.map(c => {
      if (c.id === selectedClassId) {
        return {
          ...c,
          students: c.students.map(s => s.id === evalStudent.id ? {
            ...s,
            name: studentFormName.trim(),
            team: studentFormTeam,
            desk: { row: Number(studentFormRow), col: Number(studentFormCol) },
            gender: studentFormGender,
            stars: Number(studentFormStars),
            competency1: studentFormCompetency1,
            competency2: studentFormCompetency2,
            competency3: studentFormCompetency3,
            quality: studentFormQuality,
            notes: studentFormNotes
          } : s)
        };
      }
      return c;
    }));

    setEvalStudent(null);
    playVictoryFanfare();
  };

  // Add single student
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent = {
      id: Date.now(),
      name: newStudentName.trim(),
      team: newStudentTeam,
      desk: { 
        row: Math.floor(Math.random() * 4) + 1, 
        col: Math.floor(Math.random() * 4) + 1 
      },
      stars: 0,
      answersCount: 0,
      gender: 'unknown',
      competency1: 'Đạt',
      competency2: 'Đạt',
      competency3: 'Đạt',
      notes: ''
    };

    setClasses(prev => prev.map(c => {
      if (c.id === selectedClassId) {
        return { ...c, students: [...(c.students || []), newStudent] };
      }
      return c;
    }));

    setNewStudentName('');
    playPop();
  };

  // Remove student
  const handleRemoveStudent = (studentId) => {
    if (window.confirm('Thầy/cô có chắc chắn muốn xóa học sinh này khỏi danh sách lớp?')) {
      setClasses(prev => prev.map(c => {
        if (c.id === selectedClassId) {
          return { ...c, students: c.students.filter(s => s.id !== studentId) };
        }
        return c;
      }));
      if (evalStudent?.id === studentId) {
        setEvalStudent(null);
      }
      playPop();
    }
  };

  // Change student team directly
  const handleChangeTeam = (studentId, team) => {
    setClasses(prev => prev.map(c => {
      if (c.id === selectedClassId) {
        return {
          ...c,
          students: c.students.map(s => s.id === studentId ? { ...s, team } : s)
        };
      }
      return c;
    }));
    playPop();
  };

  // Create new class
  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newCls = {
      id: `class-${Date.now()}`,
      name: newClassName.trim(),
      grade: Number(newClassGrade),
      academicYear: '2025 - 2026',
      students: []
    };

    setClasses(prev => [...prev, newCls]);
    setSelectedClassId(newCls.id);
    setNewClassName('');
    setShowNewClassModal(false);
    playVictoryFanfare();
  };

  // Edit current class
  const handleSaveEditClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    setClasses(prev => prev.map(c => {
      if (c.id === selectedClassId) {
        return {
          ...c,
          name: newClassName.trim(),
          grade: Number(newClassGrade)
        };
      }
      return c;
    }));
    setShowEditClassModal(false);
    playVictoryFanfare();
  };

  // Delete current class
  const handleDeleteClass = () => {
    if (classes.length <= 1) {
      alert('Không thể xóa lớp học duy nhất còn lại!');
      return;
    }
    if (window.confirm(`Thầy/cô có chắc muốn xóa vĩnh viễn ${currentClass.name}? Tất cả dữ liệu học sinh trong lớp sẽ bị xóa.`)) {
      const remaining = classes.filter(c => c.id !== selectedClassId);
      setClasses(remaining);
      setSelectedClassId(remaining[0].id);
      playPop();
    }
  };

  // Bulk import from pasted vnEdu / SMAS Excel column
  const handleBulkImport = () => {
    if (!bulkImportText.trim()) return;

    const names = bulkImportText
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    const newStudents = names.map((name, idx) => ({
      id: Date.now() + idx,
      name: name,
      team: `Tổ ${(idx % 4) + 1}`,
      desk: { 
        row: (idx % 4) + 1, 
        col: Math.floor(idx / 4) + 1 
      },
      stars: 0,
      answersCount: 0,
      gender: 'unknown',
      competency1: 'Đạt',
      competency2: 'Đạt',
      competency3: 'Đạt',
      notes: ''
    }));

    setClasses(prev => prev.map(c => {
      if (c.id === selectedClassId) {
        return { ...c, students: [...(c.students || []), ...newStudents] };
      }
      return c;
    }));

    setBulkImportText('');
    setShowBulkModal(false);
    playVictoryFanfare();
  };

  // Export Leaderboard / Star CSV
  const handleExportCSV = () => {
    if (!currentClass?.students?.length) return;

    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel in Vietnam
    csvContent += 'STT,Họ và Tên,Tổ,Dãy Bàn,Hàng Bàn,Số Sao,Số Lần Phát Biểu,Nhận Thức KHTN,Tìm Hiểu Tự Nhiên,Vận Dụng,Ghi Chú Đánh Giá\n';

    const sorted = [...currentClass.students].sort((a, b) => (b.stars || 0) - (a.stars || 0));
    sorted.forEach((s, idx) => {
      csvContent += `${idx + 1},"${s.name}","${s.team || 'Tổ 1'}",${s.desk?.col || 1},${s.desk?.row || 1},${s.stars || 0},${s.answersCount || 0},"${s.competency1 || 'Đạt'}","${s.competency2 || 'Đạt'}","${s.competency3 || 'Đạt'}","${s.notes || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Bang_Danh_Gia_Thi_Dua_${currentClass.name.replace(/\s+/g, '_')}.csv`;
    link.click();
    playVictoryFanfare();
  };

  // Add / Edit Resource in Teacher's Drive
  const handleSaveResource = (e) => {
    e.preventDefault();
    if (!newResTitle.trim()) return;

    if (editingResId) {
      const updated = driveResources.map(r => r.id === editingResId ? {
        ...r,
        title: newResTitle.trim(),
        type: newResType,
        grade: Number(newResGrade),
        link: newResLink.trim() || '#',
        updatedDate: new Date().toLocaleDateString('vi-VN')
      } : r);
      setDriveResources(updated);
      try { localStorage.setItem('khtn_teacher_drive', JSON.stringify(updated)); } catch (e) {}
    } else {
      const newRes = {
        id: `res-${Date.now()}`,
        title: newResTitle.trim(),
        type: newResType,
        grade: Number(newResGrade),
        subject: 'all',
        updatedDate: new Date().toLocaleDateString('vi-VN'),
        link: newResLink.trim() || '#',
        size: newResType === 'video' ? 'Link Video HD' : 'Tài liệu số'
      };
      const updated = [newRes, ...driveResources];
      setDriveResources(updated);
      try { localStorage.setItem('khtn_teacher_drive', JSON.stringify(updated)); } catch (e) {}
    }

    setNewResTitle('');
    setNewResLink('');
    setEditingResId(null);
    setShowAddResModal(false);
    playVictoryFanfare();
  };

  const handleDeleteResource = (id) => {
    if (window.confirm('Thầy/cô có chắc muốn xóa học liệu này khỏi Teacher\'s Drive?')) {
      const updated = driveResources.filter(r => r.id !== id);
      setDriveResources(updated);
      try { localStorage.setItem('khtn_teacher_drive', JSON.stringify(updated)); } catch (e) {}
      playPop();
    }
  };

  const filteredResources = driveResources.filter(r => 
    r.title.toLowerCase().includes(driveSearch.toLowerCase())
  );

  const leaderboard = [...(currentClass?.students || [])].sort((a, b) => (b.stars || 0) - (a.stars || 0));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users color="#0284c7" size={24} />
            Quản Lý Lớp Học & Đánh Giá Học Sinh GDPT 2018 ({currentClass?.name})
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Đánh giá trực tiếp năng lực từng học sinh theo Thông tư 22, phân tổ, thi đua tích sao và lưu trữ giáo án trong Teacher's Drive!
          </p>
        </div>

        {/* View Switcher: Students vs Teacher Drive */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeSubTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveSubTab('students'); playPop(); }}
          >
            <Users size={16} /> Danh Sách Học Sinh & Đánh Giá
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'drive' ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => { setActiveSubTab('drive'); playPop(); }}
          >
            <FolderGit2 size={16} /> Kho Học Liệu (Teacher's Drive)
          </button>
        </div>
      </div>

      {/* =========================================================
          SUB-TAB 1: QUẢN LÝ LỚP HỌC & BẢNG THI ĐUA
         ========================================================= */}
      {activeSubTab === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Class Selector Bar */}
          <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lớp đang chọn:</span>
              {classes.map(c => (
                <button
                  key={c.id}
                  className={`btn btn-sm ${selectedClassId === c.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => { setSelectedClassId(c.id); playPop(); }}
                >
                  {c.name} ({c.students?.length || 0} HS)
                </button>
              ))}

              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => {
                  setNewClassName(currentClass.name);
                  setNewClassGrade(currentClass.grade || 8);
                  setShowEditClassModal(true);
                  playPop();
                }}
                title="Chỉnh sửa thông tin lớp này"
              >
                <Edit2 size={14} /> Sửa Lớp
              </button>

              <button 
                className="btn btn-secondary btn-sm" 
                onClick={handleDeleteClass}
                title="Xóa lớp này"
                style={{ color: '#f43f5e' }}
              >
                <Trash2 size={14} /> Xóa Lớp
              </button>

              <button className="btn btn-cyan btn-sm" onClick={() => setShowNewClassModal(true)}>
                <Plus size={14} /> Thêm Lớp Mới
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowBulkModal(true)}>
                <FileSpreadsheet size={16} /> Dán Excel (vnEdu/SMAS)
              </button>
              <button className="btn btn-emerald btn-sm" onClick={handleExportCSV}>
                <Download size={16} /> Xuất Bảng Đánh Giá (.CSV)
              </button>
            </div>
          </div>

          {/* Main Grid: Student List Left, Leaderboard Right */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.3fr) minmax(280px, 0.7fr)', gap: '1.5rem', alignItems: 'start' }}>
            {/* Left Column: Student List & Quick Add */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} color="#0284c7" />
                  Danh Sách Học Sinh ({currentClass?.students?.length || 0} bạn)
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  💡 Bấm vào tên học sinh để mở hồ sơ đánh giá chi tiết
                </span>
              </div>

              {/* Quick Add Input with Team Selector */}
              <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập họ và tên học sinh mới..."
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  style={{ flex: 1, minWidth: '180px', fontSize: '0.92rem' }}
                />
                <select
                  className="form-select"
                  value={newStudentTeam}
                  onChange={(e) => setNewStudentTeam(e.target.value)}
                  style={{ width: '90px', fontSize: '0.85rem' }}
                >
                  <option value="Tổ 1">Tổ 1</option>
                  <option value="Tổ 2">Tổ 2</option>
                  <option value="Tổ 3">Tổ 3</option>
                  <option value="Tổ 4">Tổ 4</option>
                </select>
                <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                  <UserPlus size={16} /> Thêm HS
                </button>
              </form>

              {/* Student items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '560px', overflowY: 'auto', paddingRight: '0.3rem' }}>
                {currentClass?.students?.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Chưa có học sinh nào trong lớp. Hãy nhập tên ở trên hoặc dán danh sách từ Excel!
                  </div>
                ) : (
                  currentClass?.students?.map((s, idx) => (
                    <div
                      key={s.id}
                      className="glass-card"
                      style={{
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-surface)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: '1.5px solid var(--border-subtle)'
                      }}
                      onClick={() => handleOpenStudentEval(s)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '24px', fontWeight: 700 }}>
                          #{idx + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {s.name}
                            <span className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                              {s.team || 'Tổ 1'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Dãy {s.desk?.col || 1} - Bàn {s.desk?.row || 1} • Nhận thức: <strong style={{ color: '#0284c7' }}>{s.competency1 || 'Đạt'}</strong> • Tìm hiểu: <strong style={{ color: '#059669' }}>{s.competency2 || 'Đạt'}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} onClick={(e) => e.stopPropagation()}>
                        <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Star size={13} fill="currentColor" /> {s.stars || 0}
                        </span>

                        <button
                          className="btn btn-secondary btn-icon"
                          style={{ width: '30px', height: '30px' }}
                          onClick={() => handleOpenStudentEval(s)}
                          title="Mở hồ sơ đánh giá chi tiết học sinh"
                        >
                          <Edit2 size={13} color="#0284c7" />
                        </button>

                        <button
                          className="btn btn-secondary btn-icon"
                          style={{ width: '30px', height: '30px' }}
                          onClick={() => handleRemoveStudent(s.id)}
                          title="Xóa học sinh này"
                        >
                          <Trash2 size={13} color="#f43f5e" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Star Leaderboard */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Trophy size={20} />
                  Bảng Xếp Hạng Thi Đua
                </h3>
                <span className="badge badge-amber">TOP SAO ⭐</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {leaderboard.slice(0, 10).map((s, idx) => (
                  <div
                    key={s.id}
                    className="glass-card"
                    style={{
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderLeft: idx === 0 
                        ? '4px solid #f59e0b' 
                        : idx === 1 
                        ? '4px solid #94a3b8' 
                        : idx === 2 
                        ? '4px solid #d97706' 
                        : '1.5px solid var(--border-subtle)',
                      background: 'var(--bg-surface)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleOpenStudentEval(s)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div 
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#d97706' : 'var(--bg-surface-hover)',
                          color: idx < 3 ? '#ffffff' : 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.8rem'
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {s.team || 'Tổ 1'}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={14} fill="currentColor" /> {s.stars || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 2: KHO HỌC LIỆU GIÁO VIÊN (TEACHER'S DRIVE)
         ========================================================= */}
      {activeSubTab === 'drive' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Controls Bar */}
          <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Tìm giáo án 5512, slide, thí nghiệm..."
                value={driveSearch}
                onChange={(e) => setDriveSearch(e.target.value)}
                style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
              />
            </div>

            <button 
              className="btn btn-primary" 
              onClick={() => {
                setEditingResId(null);
                setNewResTitle('');
                setNewResType('word');
                setNewResGrade(8);
                setNewResLink('');
                setShowAddResModal(true);
                playPop();
              }}
            >
              <Plus size={16} /> Thêm Học Liệu Mới
            </button>
          </div>

          {/* Resources Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredResources.map(res => (
              <div 
                key={res.id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderLeft: res.type === 'word' ? '4px solid #0284c7' : res.type === 'ppt' ? '4px solid #f97316' : '4px solid #ef4444',
                  background: 'var(--bg-surface)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span className="badge" style={{ background: 'var(--bg-surface-hover)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {res.type === 'word' ? <FileText size={14} color="#0284c7" /> : res.type === 'ppt' ? <Presentation size={14} color="#f97316" /> : <Video size={14} color="#ef4444" />}
                      {res.type === 'word' ? 'Giáo Án 5512' : res.type === 'ppt' ? 'Slide Trình Chiếu' : 'Video Thí Nghiệm'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lớp {res.grade}</span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.4', marginTop: '0.4rem' }}>
                    {res.title}
                  </h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>{res.size} • {res.updatedDate}</span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', height: '26px', padding: '0 6px' }}
                      onClick={() => {
                        setEditingResId(res.id);
                        setNewResTitle(res.title);
                        setNewResType(res.type);
                        setNewResGrade(res.grade);
                        setNewResLink(res.link);
                        setShowAddResModal(true);
                        playPop();
                      }}
                      title="Chỉnh sửa học liệu"
                    >
                      <Edit2 size={12} /> Sửa
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', height: '26px', padding: '0 6px', color: '#f43f5e' }}
                      onClick={() => handleDeleteResource(res.id)}
                      title="Xóa học liệu này"
                    >
                      <Trash2 size={12} />
                    </button>
                    <a 
                      href={res.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.78rem', height: '26px', padding: '0 8px' }}
                    >
                      <ExternalLink size={12} /> Mở
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: HỒ SƠ ĐÁNH GIÁ CHI TIẾT HỌC SINH (GDPT 2018)
         ========================================================= */}
      {evalStudent && (
        <div className="modal-backdrop" onClick={() => setEvalStudent(null)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '640px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1.5px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #ec4899)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                  {studentFormName ? studentFormName.charAt(0).toUpperCase() : 'H'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>
                    Hồ Sơ Đánh Giá: {studentFormName}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Lớp {currentClass.name} • Đánh giá theo Thông tư 22/2021/TT-BGDĐT
                  </span>
                </div>
              </div>

              <button onClick={() => setEvalStudent(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="var(--text-muted)" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEval} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* SECTION 1: THÔNG TIN CƠ BẢN */}
              <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={15} /> 1. Thông Tin Cơ Bản & Vị Trí Ngồi
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Họ và Tên:
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={studentFormName}
                      onChange={(e) => setStudentFormName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Tổ Học Tập:
                    </label>
                    <select
                      className="form-select"
                      value={studentFormTeam}
                      onChange={(e) => setStudentFormTeam(e.target.value)}
                    >
                      <option value="Tổ 1">Tổ 1</option>
                      <option value="Tổ 2">Tổ 2</option>
                      <option value="Tổ 3">Tổ 3</option>
                      <option value="Tổ 4">Tổ 4</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Vị trí (Dãy / Bàn):
                    </label>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        className="form-input"
                        placeholder="Dãy"
                        value={studentFormCol}
                        onChange={(e) => setStudentFormCol(e.target.value)}
                        title="Dãy bàn (1-6)"
                      />
                      <input
                        type="number"
                        min="1"
                        max="6"
                        className="form-input"
                        placeholder="Bàn"
                        value={studentFormRow}
                        onChange={(e) => setStudentFormRow(e.target.value)}
                        title="Hàng bàn (1-6)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ĐÁNH GIÁ 3 NĂNG LỰC KHTN (GDPT 2018) */}
              <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={15} /> 2. Đánh Giá Năng Lực KHTN (Chuẩn Thông Tư 22)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {/* NL1 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                      • <strong>Nhận thức KHTN:</strong> (Hiểu khái niệm, định luật, công thức)
                    </span>
                    <select
                      className="form-select"
                      style={{ width: '130px', fontSize: '0.8rem' }}
                      value={studentFormCompetency1}
                      onChange={(e) => setStudentFormCompetency1(e.target.value)}
                    >
                      <option value="Tốt">Tốt (T)</option>
                      <option value="Khá">Khá (K)</option>
                      <option value="Đạt">Đạt (Đ)</option>
                      <option value="Cần cố gắng">Cần cố gắng (C)</option>
                    </select>
                  </div>

                  {/* NL2 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                      • <strong>Tìm hiểu tự nhiên:</strong> (Kỹ năng thí nghiệm, quan sát, đo đạc)
                    </span>
                    <select
                      className="form-select"
                      style={{ width: '130px', fontSize: '0.8rem' }}
                      value={studentFormCompetency2}
                      onChange={(e) => setStudentFormCompetency2(e.target.value)}
                    >
                      <option value="Tốt">Tốt (T)</option>
                      <option value="Khá">Khá (K)</option>
                      <option value="Đạt">Đạt (Đ)</option>
                      <option value="Cần cố gắng">Cần cố gắng (C)</option>
                    </select>
                  </div>

                  {/* NL3 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                      • <strong>Vận dụng kiến thức:</strong> (Giải thích hiện tượng đời sống)
                    </span>
                    <select
                      className="form-select"
                      style={{ width: '130px', fontSize: '0.8rem' }}
                      value={studentFormCompetency3}
                      onChange={(e) => setStudentFormCompetency3(e.target.value)}
                    >
                      <option value="Tốt">Tốt (T)</option>
                      <option value="Khá">Khá (K)</option>
                      <option value="Đạt">Đạt (Đ)</option>
                      <option value="Cần cố gắng">Cần cố gắng (C)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SAO TÍCH LŨY & NHẬN XÉT THƯỜNG XUYÊN */}
              <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={15} /> 3. Sao Thi Đua Tích Lũy ({studentFormStars} ⭐)
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-amber"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                      onClick={() => setStudentFormStars(prev => prev + 1)}
                    >
                      +1 Phát biểu
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-emerald"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                      onClick={() => setStudentFormStars(prev => prev + 2)}
                    >
                      +2 Bài tập khó
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                      onClick={() => setStudentFormStars(prev => Math.max(0, prev - 1))}
                    >
                      -1 Nhắc nhở
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Lời nhận xét thường xuyên của giáo viên:
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Ví dụ: Em rất tích cực phát biểu trong tiết học về lực ma sát, lắp ráp mạch điện khéo léo..."
                    value={studentFormNotes}
                    onChange={(e) => setStudentFormNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveStudent(evalStudent.id)}
                >
                  <Trash2 size={14} /> Xóa Học Sinh Khỏi Lớp
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setEvalStudent(null)}>
                    Đóng
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} /> Lưu Đánh Giá
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Student from Excel */}
      {showBulkModal && (
        <div className="modal-backdrop" onClick={() => setShowBulkModal(false)}>
          <div 
            className="modal-content"
            style={{ width: '500px', maxWidth: '100%', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileSpreadsheet color="#059669" size={22} />
              Dán Cột Họ Tên Học Sinh Từ Excel (vnEdu / SMAS)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
              Mở file Excel của trường, chọn cột "Họ và tên", bấm Ctrl+C và dán (Ctrl+V) vào ô bên dưới. Hệ thống sẽ tự động phân chia vào 4 tổ đều nhau!
            </p>

            <textarea
              className="form-textarea"
              rows={8}
              placeholder="Nguyễn Văn A&#10;Trần Thị B&#10;Lê Hoàng C..."
              value={bulkImportText}
              onChange={(e) => setBulkImportText(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowBulkModal(false)}>
                Hủy Bỏ
              </button>
              <button className="btn btn-primary" onClick={handleBulkImport}>
                <CheckCircle2 size={16} /> Thêm Vào Lớp Học
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create New Class */}
      {showNewClassModal && (
        <div className="modal-backdrop" onClick={() => setShowNewClassModal(false)}>
          <div 
            className="modal-content"
            style={{ width: '450px', maxWidth: '100%', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Thêm Lớp Học Mới</h3>
            <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Tên Lớp (ví dụ: Lớp 6A3, Lớp 9A1):
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Lớp 6A2..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Khối Lớp:
                </label>
                <select 
                  className="form-select"
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(Number(e.target.value))}
                >
                  <option value={6}>KHTN Lớp 6</option>
                  <option value={7}>KHTN Lớp 7</option>
                  <option value={8}>KHTN Lớp 8</option>
                  <option value={9}>KHTN Lớp 9</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewClassModal(false)}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  Tạo Lớp Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Class */}
      {showEditClassModal && (
        <div className="modal-backdrop" onClick={() => setShowEditClassModal(false)}>
          <div 
            className="modal-content"
            style={{ width: '450px', maxWidth: '100%', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Chỉnh Sửa Thông Tin Lớp</h3>
            <form onSubmit={handleSaveEditClass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Tên Lớp:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Khối Lớp:
                </label>
                <select 
                  className="form-select"
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(Number(e.target.value))}
                >
                  <option value={6}>KHTN Lớp 6</option>
                  <option value={7}>KHTN Lớp 7</option>
                  <option value={8}>KHTN Lớp 8</option>
                  <option value={9}>KHTN Lớp 9</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditClassModal(false)}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Drive Resource */}
      {showAddResModal && (
        <div className="modal-backdrop" onClick={() => setShowAddResModal(false)}>
          <div 
            className="modal-content"
            style={{ width: '500px', maxWidth: '100%', padding: '1.75rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              {editingResId ? 'Chỉnh Sửa Học Liệu' : 'Thêm Học Liệu Mới Vào Drive'}
            </h3>
            <form onSubmit={handleSaveResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Tên Học Liệu / Bài Dạy:
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Kế hoạch bài dạy 5512 Bài 15..."
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Loại Tài Liệu:
                  </label>
                  <select 
                    className="form-select"
                    value={newResType}
                    onChange={(e) => setNewResType(e.target.value)}
                  >
                    <option value="word">Giáo Án Word 5512</option>
                    <option value="ppt">Slide PowerPoint</option>
                    <option value="video">Video Thí Nghiệm</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Khối Lớp:
                  </label>
                  <select 
                    className="form-select"
                    value={newResGrade}
                    onChange={(e) => setNewResGrade(Number(e.target.value))}
                  >
                    <option value={6}>KHTN Lớp 6</option>
                    <option value={7}>KHTN Lớp 7</option>
                    <option value={8}>KHTN Lớp 8</option>
                    <option value={9}>KHTN Lớp 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Liên Kết Tải Về / Link YouTube / Google Drive:
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://drive.google.com/... hoặc #"
                  value={newResLink}
                  onChange={(e) => setNewResLink(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddResModal(false)}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn btn-amber">
                  {editingResId ? 'Cập Nhật' : 'Lưu Học Liệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

