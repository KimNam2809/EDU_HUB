import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Shuffle, 
  CheckCircle, 
  BookOpen, 
  Layers, 
  Sparkles,
  Download,
  Key,
  Grid,
  Plus,
  Edit2,
  Trash2,
  Database,
  BookmarkCheck,
  FolderArchive,
  Search,
  X,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { QUESTION_BANK, EXAM_MATRIX_SPECIFICATION } from '../data/mockData';
import { playPop, playVictoryFanfare } from '../utils/soundEffects';

export default function ExamGenerator({ currentClass }) {
  const [activeTab, setActiveTab] = useState('paper'); // 'paper' | 'matrix' | 'key' | 'bank' | 'saved'
  const [examType, setExamType] = useState('15min'); // 15min, midterm, final
  const [examCode, setExamCode] = useState('101');
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [schoolName, setSchoolName] = useState('TRƯỜNG THCS NGUYỄN DU');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // ==========================================
  // 1. QUESTION BANK WITH LOCALSTORAGE CRUD
  // ==========================================
  const [customQuestions, setCustomQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem('khtn_custom_question_bank');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const allQuestions = [...QUESTION_BANK, ...customQuestions];

  // Bank filters
  const [bankSubject, setBankSubject] = useState('all');
  const [bankGrade, setBankGrade] = useState('all');
  const [bankFormat, setBankFormat] = useState('all');
  const [bankSearch, setBankSearch] = useState('');

  // Add/Edit Question Modal State
  const [showQModal, setShowQModal] = useState(false);
  const [editingQId, setEditingQId] = useState(null);
  const [qSubject, setQSubject] = useState('physics');
  const [qGrade, setQGrade] = useState(8);
  const [qFormat, setQFormat] = useState(1); // 1: 4 choices, 2: True/False, 3: Short answer, 4: Essay
  const [qLevel, setQLevel] = useState('Thông hiểu');
  const [qQuestion, setQQuestion] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectChoice, setQCorrectChoice] = useState(0); // 0 = A, 1 = B, 2 = C, 3 = D
  const [qSubQ1, setQSubQ1] = useState('a) Ý nhận định 1');
  const [qSubQ1Ans, setQSubQ1Ans] = useState(true);
  const [qSubQ2, setQSubQ2] = useState('b) Ý nhận định 2');
  const [qSubQ2Ans, setQSubQ2Ans] = useState(false);
  const [qShortAns, setQShortAns] = useState('');
  const [qEssayScore, setQEssayScore] = useState(1.5);
  const [qExplanation, setQExplanation] = useState('');

  // Filter questions for the active Exam Paper
  const filteredForExam = allQuestions.filter(q => q.grade === selectedGrade || !q.grade);
  const multipleChoiceQs = filteredForExam.filter(q => q.format === 1);
  const trueFalseQs = filteredForExam.filter(q => q.format === 2);
  const shortAnswerQs = filteredForExam.filter(q => q.format === 3);
  const essayQs = filteredForExam.filter(q => q.format === 4);

  // ==========================================
  // 2. SAVED EXAMS WITH LOCALSTORAGE CRUD
  // ==========================================
  const [savedExams, setSavedExams] = useState(() => {
    try {
      const saved = localStorage.getItem('khtn_saved_exams');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleSaveCurrentExam = () => {
    const newSavedExam = {
      id: `exam-${Date.now()}`,
      title: `Đề Kiểm Tra KHTN ${selectedGrade} - Mã ${examCode} (${examType === '15min' ? '15 Phút' : '45 Phút'})`,
      schoolName,
      grade: selectedGrade,
      examType,
      examCode,
      createdAt: new Date().toLocaleString('vi-VN'),
      questionCount: multipleChoiceQs.length + trueFalseQs.length + shortAnswerQs.length + essayQs.length,
      questions: {
        mc: multipleChoiceQs,
        tf: trueFalseQs,
        sa: shortAnswerQs,
        es: essayQs
      }
    };

    const updated = [newSavedExam, ...savedExams];
    setSavedExams(updated);
    try { localStorage.setItem('khtn_saved_exams', JSON.stringify(updated)); } catch (e) {}
    setCopiedNotification('Đã lưu đề thi vào danh mục "Đề Thi Của Tôi"!');
    setTimeout(() => setCopiedNotification(''), 3000);
    playVictoryFanfare();
  };

  const handleDeleteSavedExam = (id) => {
    if (window.confirm('Thầy/cô có chắc muốn xóa đề thi này khỏi danh mục lưu trữ?')) {
      const updated = savedExams.filter(e => e.id !== id);
      setSavedExams(updated);
      try { localStorage.setItem('khtn_saved_exams', JSON.stringify(updated)); } catch (e) {}
      playPop();
    }
  };

  const handleLoadSavedExam = (exam) => {
    setSchoolName(exam.schoolName);
    setSelectedGrade(exam.grade);
    setExamType(exam.examType);
    setExamCode(exam.examCode);
    setActiveTab('paper');
    playPop();
  };

  // Question Bank Actions
  const handleOpenAddQModal = () => {
    setEditingQId(null);
    setQSubject('physics');
    setQGrade(selectedGrade);
    setQFormat(1);
    setQLevel('Thông hiểu');
    setQQuestion('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQCorrectChoice(0);
    setQShortAns('');
    setQEssayScore(1.5);
    setQExplanation('');
    setShowQModal(true);
    playPop();
  };

  const handleOpenEditQModal = (q) => {
    setEditingQId(q.id);
    setQSubject(q.subject || 'physics');
    setQGrade(q.grade || 8);
    setQFormat(q.format || 1);
    setQLevel(q.level || 'Thông hiểu');
    setQQuestion(q.question || '');
    if (q.format === 1 && q.options) {
      setQOptA(q.options[0] || '');
      setQOptB(q.options[1] || '');
      setQOptC(q.options[2] || '');
      setQOptD(q.options[3] || '');
      setQCorrectChoice(q.correctAnswer || 0);
    } else if (q.format === 3) {
      setQShortAns(q.displayAnswer || '');
    } else if (q.format === 4) {
      setQEssayScore(q.maxScore || 1.5);
    }
    setQExplanation(q.explanation || q.solution || '');
    setShowQModal(true);
    playPop();
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!qQuestion.trim()) return;

    let formattedQ = {
      id: editingQId || `custom-q-${Date.now()}`,
      subject: qSubject,
      grade: Number(qGrade),
      format: Number(qFormat),
      level: qLevel,
      question: qQuestion.trim(),
      isCustom: true
    };

    if (qFormat === 1) {
      formattedQ.options = [qOptA.trim(), qOptB.trim(), qOptC.trim(), qOptD.trim()];
      formattedQ.correctAnswer = Number(qCorrectChoice);
      formattedQ.explanation = qExplanation.trim();
    } else if (qFormat === 2) {
      formattedQ.subQuestions = [
        { text: qSubQ1.trim(), isCorrect: qSubQ1Ans },
        { text: qSubQ2.trim(), isCorrect: qSubQ2Ans }
      ];
      formattedQ.explanation = qExplanation.trim();
    } else if (qFormat === 3) {
      formattedQ.displayAnswer = qShortAns.trim();
      formattedQ.explanation = qExplanation.trim();
    } else if (qFormat === 4) {
      formattedQ.maxScore = Number(qEssayScore);
      formattedQ.solution = qExplanation.trim();
    }

    if (editingQId) {
      const updated = customQuestions.map(q => q.id === editingQId ? formattedQ : q);
      setCustomQuestions(updated);
      try { localStorage.setItem('khtn_custom_question_bank', JSON.stringify(updated)); } catch (err) {}
    } else {
      const updated = [formattedQ, ...customQuestions];
      setCustomQuestions(updated);
      try { localStorage.setItem('khtn_custom_question_bank', JSON.stringify(updated)); } catch (err) {}
    }

    setShowQModal(false);
    playVictoryFanfare();
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Thầy/cô có chắc muốn xóa câu hỏi này khỏi Ngân hàng?')) {
      const updated = customQuestions.filter(q => q.id !== id);
      setCustomQuestions(updated);
      try { localStorage.setItem('khtn_custom_question_bank', JSON.stringify(updated)); } catch (err) {}
      playPop();
    }
  };

  // Shuffle questions for new exam code
  const handleShuffle = (code) => {
    setExamCode(code);
    playPop();
  };

  const handlePrint = () => {
    window.print();
  };

  // Direct Word (.doc) Download
  const handleDownloadDoc = () => {
    let htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Đề Kiểm Tra KHTN ${selectedGrade} - Mã ${examCode}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000; }
          table { width: 100%; border-collapse: collapse; }
          .header-table td { vertical-align: top; }
          .bold { font-weight: bold; }
          .center { text-align: center; }
          .part-title { font-weight: bold; margin-top: 15pt; margin-bottom: 5pt; text-decoration: underline; }
          .question { margin-top: 8pt; margin-bottom: 4pt; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td style="width: 45%;">
              <div class="bold center">${schoolName.toUpperCase()}</div>
              <div class="bold center">TỔ KHOA HỌC TỰ NHIÊN</div>
              <div class="center" style="margin-top: 5pt;"><strong>MÃ ĐỀ THI: ${examCode}</strong></div>
            </td>
            <td style="width: 55%; text-align: center;">
              <div class="bold" style="font-size: 14pt;">BÀI KIỂM TRA ĐỊNH KỲ MÔN KHTN ${selectedGrade}</div>
              <div>Năm học: 2025 - 2026</div>
              <div style="font-style: italic;">Thời gian làm bài: ${examType === '15min' ? '15 phút' : '45 phút'} (Không kể thời gian phát đề)</div>
            </td>
          </tr>
        </table>

        <div style="border: 1pt solid #000; padding: 6pt; margin-top: 10pt; margin-bottom: 15pt;">
          Họ và tên học sinh: ................................................................................ Lớp: ................. Phòng thi: ........ SBD: ........
        </div>

        <div class="part-title">PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (Mỗi câu trả lời đúng được 0,25 điểm)</div>
        ${multipleChoiceQs.map((q, idx) => `
          <div class="question">
            <strong>Câu ${idx + 1}:</strong> ${q.question} <em>[${q.subject.toUpperCase()} - ${q.level}]</em><br>
            ${q.options.map((opt, oIdx) => `&nbsp;&nbsp;&nbsp;<strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}<br>`).join('')}
          </div>
        `).join('')}

        <div class="part-title">PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI (Thí sinh trả lời Đúng hoặc Sai cho mỗi ý a, b, c, d)</div>
        ${trueFalseQs.map((q, idx) => `
          <div class="question">
            <strong>Câu ${idx + 1}:</strong> ${q.question}<br>
            ${q.subQuestions.map(sq => `&nbsp;&nbsp;&nbsp;${sq.text}<br>`).join('')}
          </div>
        `).join('')}

        <div class="part-title">PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN</div>
        ${shortAnswerQs.map((q, idx) => `
          <div class="question">
            <strong>Câu ${idx + 1}:</strong> ${q.question}<br>
            &nbsp;&nbsp;&nbsp;<em>Trả lời: ...................................................................................................................</em>
          </div>
        `).join('')}

        <div class="part-title">PHẦN IV. TỰ LUẬN</div>
        ${essayQs.map((q, idx) => `
          <div class="question">
            <strong>Câu ${idx + 1} (${q.maxScore} điểm):</strong> ${q.question}<br>
            &nbsp;&nbsp;&nbsp;<em>Bài làm: ...................................................................................................................</em>
          </div>
        `).join('')}

        <div class="center" style="margin-top: 25pt; font-style: italic;">
          --- HẾT ---<br>
          (Giám thị coi thi không giải thích gì thêm)
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `De_Kiem_Tra_KHTN_${selectedGrade}_Ma${examCode}.doc`;
    link.click();
    playVictoryFanfare();
  };

  // Filtered Question Bank List
  const filteredBank = allQuestions.filter(q => {
    const matchSub = bankSubject === 'all' || q.subject === bankSubject;
    const matchGrade = bankGrade === 'all' || q.grade === Number(bankGrade);
    const matchFormat = bankFormat === 'all' || q.format === Number(bankFormat);
    const matchSearch = !bankSearch || q.question.toLowerCase().includes(bankSearch.toLowerCase());
    return matchSub && matchGrade && matchFormat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Controls Bar */}
      <div className="glass-panel no-print" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText color="#f59e0b" size={24} />
            Soạn Đề & Ma Trận Kiểm Tra KHTN (Chuẩn Thông Tư 22 & Cấu Trúc 2026)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Hỗ trợ đầy đủ 4 dạng thức thi mới: Trắc nghiệm 4 lựa chọn, Đúng/Sai a-b-c-d, Trả lời ngắn và Tự luận kèm ma trận đặc tả!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-emerald" onClick={handleSaveCurrentExam}>
            <BookmarkCheck size={16} /> Lưu Đề Này
          </button>
          <button className="btn btn-secondary" onClick={handleDownloadDoc}>
            <Download size={16} /> Tải File Word (.doc)
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> In Đề / Xuất PDF
          </button>
        </div>
      </div>

      {copiedNotification && (
        <div className="glass-card animate-fade-in" style={{ padding: '0.65rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10b981', color: '#059669', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
          <CheckCircle2 size={16} /> {copiedNotification}
        </div>
      )}

      {/* Tabs View Switcher (no-print) */}
      <div className="no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${activeTab === 'paper' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('paper'); playPop(); }}
        >
          <FileText size={16} /> Đề Thi Học Sinh (4 Dạng Thức)
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'matrix' ? 'btn-physics' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('matrix'); playPop(); }}
        >
          <Grid size={16} /> Khung Ma Trận & Bản Đặc Tả (Thông Tư 22)
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'key' ? 'btn-emerald' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('key'); playPop(); }}
        >
          <Key size={16} /> Đáp Án & Thang Điểm Chi Tiết
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'bank' ? 'btn-amber' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('bank'); playPop(); }}
        >
          <Database size={16} /> Ngân Hàng Câu Hỏi ({allQuestions.length} câu)
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'saved' ? 'btn-cyan' : 'btn-secondary'}`}
          onClick={() => { setActiveTab('saved'); playPop(); }}
        >
          <FolderArchive size={16} /> Đề Thi Đã Lưu ({savedExams.length} đề)
        </button>
      </div>

      {/* Configuration Strip (Shown for paper, matrix, key) */}
      {(activeTab === 'paper' || activeTab === 'matrix' || activeTab === 'key') && (
        <div className="glass-panel no-print" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tên Trường Học:</label>
            <input
              type="text"
              className="form-input"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              style={{ width: '240px', padding: '0.4rem 0.75rem', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Khối Lớp:</label>
            <select 
              className="form-select"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(Number(e.target.value))}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.88rem' }}
            >
              <option value={6}>KHTN Lớp 6</option>
              <option value={7}>KHTN Lớp 7</option>
              <option value={8}>KHTN Lớp 8</option>
              <option value={9}>KHTN Lớp 9</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Loại Bài Kiểm Tra:</label>
            <select 
              className="form-select"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.88rem' }}
            >
              <option value="15min">Kiểm tra thường xuyên (15 phút)</option>
              <option value="midterm">Kiểm tra Giữa Học Kỳ (45 phút)</option>
              <option value="final">Kiểm tra Cuối Học Kỳ (60 - 90 phút)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Trộn Mã Đề:</label>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['101', '102', '103', '104'].map((code) => (
                <button
                  key={code}
                  className={`btn btn-sm ${examCode === code ? 'btn-amber' : 'btn-secondary'}`}
                  onClick={() => handleShuffle(code)}
                >
                  Mã {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 1: FORMAL STUDENT EXAM PAPER PREVIEW
         ========================================================= */}
      {activeTab === 'paper' && (
        <div 
          style={{
            background: '#ffffff',
            color: '#111827',
            padding: '2.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: '860px',
            margin: '0 auto',
            width: '100%',
            fontFamily: "'Plus Jakarta Sans', serif",
            border: '1.5px solid var(--border-subtle)'
          }}
        >
          {/* Official Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', borderBottom: '2px solid #000000', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{schoolName.toUpperCase()}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>TỔ KHOA HỌC TỰ NHIÊN</div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>
                <strong>Mã đề thi: {examCode}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>KIỂM TRA ĐỊNH KỲ MÔN KHTN {selectedGrade}</div>
              <div style={{ fontSize: '0.85rem' }}>Năm học: 2025 - 2026</div>
              <div style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                Thời gian làm bài: {examType === '15min' ? '15 phút' : '45 phút'} (Không kể thời gian phát đề)
              </div>
            </div>
          </div>

          {/* Student name & score table */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem', border: '1px solid #9ca3af', padding: '0.75rem', borderRadius: '4px' }}>
            <div>
              <div style={{ marginBottom: '0.5rem' }}>Họ và tên học sinh: ..........................................................................</div>
              <div>Lớp: ......................... Phòng thi: ................ Số báo danh: ................</div>
            </div>
            <div style={{ borderLeft: '1px solid #9ca3af', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>ĐIỂM SỐ:</div>
              <div style={{ height: '30px' }}></div>
            </div>
          </div>

          {/* Exam Questions Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Part 1: Multiple Choice */}
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', background: '#f3f4f6', padding: '0.4rem 0.6rem', borderLeft: '4px solid #111827', marginBottom: '0.85rem' }}>
                PHẦN I. TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (Mỗi câu trả lời đúng được 0,25 điểm)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {multipleChoiceQs.map((q, idx) => (
                  <div key={q.id} style={{ pageBreakInside: 'avoid' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem', lineHeight: '1.5' }}>
                      <strong>Câu {idx + 1}:</strong> {q.question}
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '6px', fontWeight: 'normal' }}>
                        [{q.subject === 'physics' ? 'Vật lí' : q.subject === 'chemistry' ? 'Hóa học' : q.subject === 'biology' ? 'Sinh học' : 'Trái Đất'} - {q.level}]
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', paddingLeft: '1.25rem' }}>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} style={{ fontSize: '0.9rem' }}>
                          <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Part 2: True / False */}
            {trueFalseQs.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', background: '#f3f4f6', padding: '0.4rem 0.6rem', borderLeft: '4px solid #111827', marginBottom: '0.85rem' }}>
                  PHẦN II. TRẮC NGHIỆM ĐÚNG / SAI (Thí sinh trả lời Đúng hoặc Sai cho mỗi ý a, b, c, d)
                </div>
                {trueFalseQs.map((q, idx) => (
                  <div key={q.id} style={{ marginBottom: '1rem', pageBreakInside: 'avoid' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.4rem', lineHeight: '1.5' }}>
                      <strong>Câu {idx + 1}:</strong> {q.question}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '1.25rem' }}>
                      {q.subQuestions.map((sq, sIdx) => (
                        <div key={sIdx} style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #e5e7eb', paddingBottom: '2px' }}>
                          <span>{sq.text}</span>
                          <span style={{ fontWeight: 700, color: '#6b7280', minWidth: '100px', textAlign: 'right' }}>[ Đúng / Sai ]</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Part 3: Short Answer */}
            {shortAnswerQs.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', background: '#f3f4f6', padding: '0.4rem 0.6rem', borderLeft: '4px solid #111827', marginBottom: '0.85rem' }}>
                  PHẦN III. TRẮC NGHIỆM TRẢ LỜI NGẮN (Thí sinh điền kết quả số hoặc đơn vị vào ô trả lời)
                </div>
                {shortAnswerQs.map((q, idx) => (
                  <div key={q.id} style={{ marginBottom: '1rem', pageBreakInside: 'avoid' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem', lineHeight: '1.5' }}>
                      <strong>Câu {idx + 1}:</strong> {q.question}
                    </div>
                    <div style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', fontStyle: 'italic', color: '#4b5563' }}>
                      Đáp án của thí sinh: ............................................................................................
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Part 4: Essay */}
            {essayQs.length > 0 && (
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', background: '#f3f4f6', padding: '0.4rem 0.6rem', borderLeft: '4px solid #111827', marginBottom: '0.85rem' }}>
                  PHẦN IV. TỰ LUẬN (Vận dụng kiến thức khoa học vào giải thích thực tiễn)
                </div>
                {essayQs.map((q, idx) => (
                  <div key={q.id} style={{ marginBottom: '1rem', pageBreakInside: 'avoid' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem', lineHeight: '1.5' }}>
                      <strong>Câu {idx + 1} ({q.maxScore} điểm):</strong> {q.question}
                    </div>
                    <div style={{ height: '70px', border: '1px dashed #d1d5db', borderRadius: '4px', margin: '0.5rem 0', padding: '0.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>
                      (Phần ghi bài làm của thí sinh)
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontStyle: 'italic', fontSize: '0.85rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
              --- HẾT (Cán bộ coi thi không giải thích gì thêm) ---
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: KHUNG MA TRẬN & BẢN ĐẶC TẢ ĐỀ THI (THÔNG TƯ 22)
         ========================================================= */}
      {activeTab === 'matrix' && (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#8b5cf6', marginBottom: '0.35rem' }}>
              {EXAM_MATRIX_SPECIFICATION.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Bảng phân bố trọng số điểm theo các mạch nội dung GDPT 2018 và 4 cấp độ nhận thức chuẩn Công văn Bộ GD&ĐT.
            </p>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-main)' }}>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'left', borderBottom: '2px solid rgba(139, 92, 246, 0.4)' }}>
                    Mạch Kiến Thức / Chủ Đề
                  </th>
                  <th style={{ padding: '0.85rem 0.5rem', borderBottom: '2px solid rgba(139, 92, 246, 0.4)' }}>Tỷ lệ %</th>
                  <th style={{ padding: '0.85rem 0.5rem', borderBottom: '2px solid rgba(139, 92, 246, 0.4)' }}>Nhận Biết (40%)</th>
                  <th style={{ padding: '0.85rem 0.5rem', borderBottom: '2px solid rgba(139, 92, 246, 0.4)' }}>Thông Hiểu (30%)</th>
                  <th style={{ padding: '0.85rem 0.5rem', borderBottom: '2px solid rgba(139, 92, 246, 0.4)' }}>Vận Dụng (20%)</th>
                  <th style={{ padding: '0.85rem 0.5rem', borderBottom: '2px solid rgba(139, 92, 246, 0.4)' }}>Vận Dụng Cao (10%)</th>
                  <th style={{ padding: '0.85rem 0.5rem', borderBottom: '2px solid rgba(139, 92, 246, 0.4)' }}>Tổng Điểm</th>
                </tr>
              </thead>
              <tbody>
                {EXAM_MATRIX_SPECIFICATION.domains.map((d, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-surface-hover)' }}>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-main)' }}>
                      {d.name}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0284c7' }}>{d.weight}</td>
                    <td>{d.recog} đ</td>
                    <td>{d.under} đ</td>
                    <td>{d.apply} đ</td>
                    <td>{d.applyHigh} đ</td>
                    <td style={{ fontWeight: 800, color: '#f59e0b' }}>{d.score} đ</td>
                  </tr>
                ))}
                <tr style={{ background: 'rgba(139, 92, 246, 0.15)', fontWeight: 800 }}>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#7c3aed' }}>TỔNG CỘNG CÁC MẠCH:</td>
                  <td style={{ color: '#7c3aed' }}>100%</td>
                  <td>4.0 điểm</td>
                  <td>3.0 điểm</td>
                  <td>2.0 điểm</td>
                  <td>1.0 điểm</td>
                  <td style={{ color: '#f59e0b', fontSize: '1.05rem' }}>10.0 ĐIỂM</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
            {EXAM_MATRIX_SPECIFICATION.levels.map((lvl, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1rem', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <strong style={{ color: 'var(--text-main)' }}>{lvl.name}</strong>
                  <span className="badge badge-physics">{lvl.percent} ({lvl.score}đ)</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {lvl.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: PHIẾU ĐÁP ÁN & THANG ĐIỂM CHI TIẾT (ANSWER KEY)
         ========================================================= */}
      {activeTab === 'key' && (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#059669', marginBottom: '0.35rem' }}>
                Đáp Án & Thang Điểm Chi Tiết - Mã Đề {examCode}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Bảng đối chiếu đáp án phục vụ giáo viên chấm thi trắc nghiệm và biểu điểm tự luận chuẩn GDPT 2018.
              </p>
            </div>
            <span className="badge badge-emerald">MÃ ĐỀ: {examCode}</span>
          </div>

          {/* Part 1 Answer Grid */}
          <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-surface)' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Phần I: Đáp Án Trắc Nghiệm Nhiều Lựa Chọn (0,25đ / câu)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
              {multipleChoiceQs.map((q, idx) => (
                <div key={q.id} style={{ background: 'var(--bg-surface-hover)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1.5px solid rgba(5, 150, 105, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Câu {idx + 1}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                    {String.fromCharCode(65 + q.correctAnswer)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Part 2 True/False Answer Grid */}
          {trueFalseQs.length > 0 && (
            <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-surface)' }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Phần II: Đáp Án Đúng / Sai (Cấu trúc 2026)
              </h4>
              {trueFalseQs.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                    Câu {idx + 1}:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {q.subQuestions.map((sq, sIdx) => (
                      <div key={sIdx} style={{ background: 'var(--bg-surface-hover)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Ý {sq.text.substring(0, 2)}</span>
                        <strong style={{ color: sq.isCorrect ? '#059669' : '#e11d48' }}>
                          {sq.isCorrect ? 'ĐÚNG' : 'SAI'}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Part 3 Short Answer & Essay Solution */}
          <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--bg-surface)' }}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Phần III & IV: Đáp Số Ngắn & Lời Giải Tự Luận
            </h4>
            {shortAnswerQs.map((q, idx) => (
              <div key={q.id} style={{ marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                <strong>Phần III - Câu {idx + 1}:</strong> {q.question}
                <div style={{ color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                  Đáp án: {q.displayAnswer} ({q.explanation})
                </div>
              </div>
            ))}

            {essayQs.map((q, idx) => (
              <div key={q.id} style={{ marginTop: '0.75rem' }}>
                <strong>Phần IV - Câu {idx + 1} ({q.maxScore} điểm):</strong> {q.question}
                <div style={{ background: 'var(--bg-surface-hover)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-line', fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '0.4rem', borderLeft: '3px solid #059669' }}>
                  {q.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: NGÂN HÀNG CÂU HỎI (QUESTION BANK CRUD)
         ========================================================= */}
      {activeTab === 'bank' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Controls & Filter Bar */}
          <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Tìm nội dung câu hỏi..."
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  style={{ paddingLeft: '2rem', fontSize: '0.85rem' }}
                />
              </div>

              {/* Subject filter */}
              <select
                className="form-select"
                value={bankSubject}
                onChange={(e) => setBankSubject(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                <option value="all">Tất cả phân môn</option>
                <option value="physics">Vật lí</option>
                <option value="chemistry">Hóa học</option>
                <option value="biology">Sinh học</option>
                <option value="earth">Trái Đất & Bầu trời</option>
              </select>

              {/* Grade filter */}
              <select
                className="form-select"
                value={bankGrade}
                onChange={(e) => setBankGrade(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                <option value="all">Tất cả khối lớp</option>
                <option value="6">Lớp 6</option>
                <option value="7">Lớp 7</option>
                <option value="8">Lớp 8</option>
                <option value="9">Lớp 9</option>
              </select>

              {/* Format filter */}
              <select
                className="form-select"
                value={bankFormat}
                onChange={(e) => setBankFormat(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                <option value="all">Tất cả 4 dạng thức</option>
                <option value="1">Dạng 1: Trắc nghiệm 4 lựa chọn</option>
                <option value="2">Dạng 2: Đúng / Sai</option>
                <option value="3">Dạng 3: Trả lời ngắn</option>
                <option value="4">Dạng 4: Tự luận</option>
              </select>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddQModal}>
              <Plus size={16} /> Thêm Câu Hỏi Mới
            </button>
          </div>

          {/* Questions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredBank.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Không tìm thấy câu hỏi nào phù hợp với bộ lọc. Bấm nút "+ Thêm Câu Hỏi Mới" để tạo câu hỏi đầu tiên!
              </div>
            ) : (
              filteredBank.map((q, idx) => (
                <div
                  key={q.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    borderLeft: q.format === 1 ? '4px solid #0284c7' : q.format === 2 ? '4px solid #8b5cf6' : q.format === 3 ? '4px solid #059669' : '4px solid #f59e0b'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-cyan">
                        {q.subject === 'physics' ? 'Vật lí' : q.subject === 'chemistry' ? 'Hóa học' : q.subject === 'biology' ? 'Sinh học' : 'Trái Đất'}
                      </span>
                      <span className="badge badge-secondary">Lớp {q.grade || 8}</span>
                      <span className="badge badge-physics">
                        {q.format === 1 ? 'Trắc nghiệm 4 lựa chọn' : q.format === 2 ? 'Đúng / Sai' : q.format === 3 ? 'Trả lời ngắn' : 'Tự luận'}
                      </span>
                      <span className="badge badge-amber">{q.level}</span>
                      {q.isCustom && <span className="badge badge-emerald">Giáo viên biên soạn</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ height: '28px', padding: '0 8px' }}
                        onClick={() => handleOpenEditQModal(q)}
                        title="Chỉnh sửa câu hỏi này"
                      >
                        <Edit2 size={13} /> Sửa
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ height: '28px', padding: '0 8px', color: '#f43f5e' }}
                        onClick={() => handleDeleteQuestion(q.id)}
                        title="Xóa câu hỏi này"
                      >
                        <Trash2 size={13} /> Xóa
                      </button>
                    </div>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {idx + 1}. {q.question}
                  </div>

                  {/* Format specifics */}
                  {q.format === 1 && q.options && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.4rem', paddingLeft: '1rem', fontSize: '0.88rem' }}>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} style={{ color: oIdx === q.correctAnswer ? '#059669' : 'var(--text-muted)', fontWeight: oIdx === q.correctAnswer ? 700 : 'normal' }}>
                          {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctAnswer && '✓'}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.format === 2 && q.subQuestions && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '1rem', fontSize: '0.85rem' }}>
                      {q.subQuestions.map((sq, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted var(--border-subtle)' }}>
                          <span>{sq.text}</span>
                          <strong style={{ color: sq.isCorrect ? '#059669' : '#e11d48' }}>
                            {sq.isCorrect ? 'ĐÚNG' : 'SAI'}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.format === 3 && (
                    <div style={{ paddingLeft: '1rem', fontSize: '0.88rem', color: '#0284c7' }}>
                      <strong>Đáp án chính xác:</strong> {q.displayAnswer}
                    </div>
                  )}

                  {q.format === 4 && (
                    <div style={{ paddingLeft: '1rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      <strong>Thang điểm:</strong> {q.maxScore} điểm • <strong>Hướng dẫn chấm:</strong> {q.solution}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 5: ĐỀ THI ĐÃ LƯU (SAVED EXAMS CRUD)
         ========================================================= */}
      {activeTab === 'saved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderArchive size={20} />
                Danh Mục Đề Thi Đã Lưu ({savedExams.length} đề)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Lưu trữ các đề kiểm tra đã biên soạn, có thể mở lại để in, tạo mã đề khác hoặc tải bản Word (.doc) nhanh chóng.
              </p>
            </div>
            <button className="btn btn-emerald" onClick={handleSaveCurrentExam}>
              <BookmarkCheck size={16} /> Lưu Đề Hiện Tại
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {savedExams.length === 0 ? (
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Chưa có đề thi nào được lưu. Hãy bấm nút "Lưu Đề Hiện Tại" ở trên để lưu đề thi đang soạn!
              </div>
            ) : (
              savedExams.map((exam) => (
                <div
                  key={exam.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    borderLeft: '4px solid #0284c7'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span className="badge badge-cyan">KHTN Lớp {exam.grade}</span>
                      <span className="badge badge-amber">Mã {exam.examCode}</span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.4', margin: '0.5rem 0 0.25rem' }}>
                      {exam.title}
                    </h4>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {exam.schoolName} • {exam.questionCount} câu hỏi • Tạo lúc: {exam.createdAt}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#f43f5e' }}
                      onClick={() => handleDeleteSavedExam(exam.id)}
                    >
                      <Trash2 size={13} /> Xóa
                    </button>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleLoadSavedExam(exam)}
                    >
                      <FileCheck size={14} /> Mở & In Đề Này
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: THÊM / CHỈNH SỬA CÂU HỎI
         ========================================================= */}
      {showQModal && (
        <div className="modal-backdrop" onClick={() => setShowQModal(false)}>
          <div 
            className="modal-content" 
            style={{ maxWidth: '640px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1.5px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>
                {editingQId ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới Vào Ngân Hàng'}
              </h3>
              <button onClick={() => setShowQModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="var(--text-muted)" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Phân Môn:</label>
                  <select className="form-select" value={qSubject} onChange={(e) => setQSubject(e.target.value)}>
                    <option value="physics">Vật lí</option>
                    <option value="chemistry">Hóa học</option>
                    <option value="biology">Sinh học</option>
                    <option value="earth">Trái Đất</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Khối Lớp:</label>
                  <select className="form-select" value={qGrade} onChange={(e) => setQGrade(Number(e.target.value))}>
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Dạng Thức Thi:</label>
                  <select className="form-select" value={qFormat} onChange={(e) => setQFormat(Number(e.target.value))}>
                    <option value={1}>Dạng 1: Trắc nghiệm 4 lựa chọn</option>
                    <option value={2}>Dạng 2: Đúng / Sai (a, b)</option>
                    <option value={3}>Dạng 3: Trả lời ngắn</option>
                    <option value={4}>Dạng 4: Tự luận</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Mức Độ:</label>
                  <select className="form-select" value={qLevel} onChange={(e) => setQLevel(e.target.value)}>
                    <option value="Nhận biết">Nhận biết</option>
                    <option value="Thông hiểu">Thông hiểu</option>
                    <option value="Vận dụng">Vận dụng</option>
                    <option value="Vận dụng cao">Vận dụng cao</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Nội Dung Đề Bài:</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Nhập câu hỏi..."
                  value={qQuestion}
                  onChange={(e) => setQQuestion(e.target.value)}
                  required
                />
              </div>

              {/* Dạng 1: 4 Options */}
              {qFormat === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7' }}>4 Phương Án Lựa Chọn (Tích chọn đáp án đúng):</span>
                  {[
                    { label: 'A', val: qOptA, setVal: setQOptA, idx: 0 },
                    { label: 'B', val: qOptB, setVal: setQOptB, idx: 1 },
                    { label: 'C', val: qOptC, setVal: setQOptC, idx: 2 },
                    { label: 'D', val: qOptD, setVal: setQOptD, idx: 3 },
                  ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="correctChoice"
                        checked={qCorrectChoice === item.idx}
                        onChange={() => setQCorrectChoice(item.idx)}
                        style={{ cursor: 'pointer' }}
                      />
                      <strong style={{ width: '20px' }}>{item.label}.</strong>
                      <input
                        type="text"
                        className="form-input"
                        placeholder={`Nội dung đáp án ${item.label}...`}
                        value={item.val}
                        onChange={(e) => item.setVal(e.target.value)}
                        required
                        style={{ flex: 1, padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Dạng 2: True/False */}
              {qFormat === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8b5cf6' }}>Các Ý Nhận Định (Đúng / Sai):</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="text" className="form-input" value={qSubQ1} onChange={(e) => setQSubQ1(e.target.value)} style={{ flex: 1 }} />
                    <select className="form-select" value={qSubQ1Ans ? 'true' : 'false'} onChange={(e) => setQSubQ1Ans(e.target.value === 'true')} style={{ width: '90px' }}>
                      <option value="true">ĐÚNG</option>
                      <option value="false">SAI</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="text" className="form-input" value={qSubQ2} onChange={(e) => setQSubQ2(e.target.value)} style={{ flex: 1 }} />
                    <select className="form-select" value={qSubQ2Ans ? 'true' : 'false'} onChange={(e) => setQSubQ2Ans(e.target.value === 'true')} style={{ width: '90px' }}>
                      <option value="true">ĐÚNG</option>
                      <option value="false">SAI</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Dạng 3: Short Answer */}
              {qFormat === 3 && (
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Đáp Số Ngắn Chính Xác:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: 25 hoặc 10 m/s..."
                    value={qShortAns}
                    onChange={(e) => setQShortAns(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Dạng 4: Essay */}
              {qFormat === 4 && (
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Điểm Tối Đa:</label>
                  <input
                    type="number"
                    step="0.25"
                    className="form-input"
                    value={qEssayScore}
                    onChange={(e) => setQEssayScore(Number(e.target.value))}
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  {qFormat === 4 ? 'Hướng Dẫn Chấm & Biểu Điểm:' : 'Lời Giải Thích / Hướng Dẫn:'}
                </label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Giải thích chi tiết..."
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowQModal(false)}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingQId ? 'Cập Nhật Câu Hỏi' : 'Lưu Vào Ngân Hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
