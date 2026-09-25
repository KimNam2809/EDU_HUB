# 🤖 EduHub - Tài Liệu Bàn Giao Kỹ Thuật Dành Cho AI Kế Nhiệm (Agents.md)

> **Dành cho bất kỳ Trợ lý AI nào tiếp quản dự án này:**  
> File này chứa **toàn bộ tri thức, cấu trúc kiến trúc, lịch sử sửa lỗi, cơ chế an ninh và hướng dẫn vận hành** của EduHub. Vui lòng đọc kỹ toàn bộ file này trước khi thực hiện bất kỳ thay đổi nào để đảm bảo tính toàn vẹn và tiếp nối công việc một cách chính xác nhất.

---

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

- **Tên dự án:** **EduHub** (Nền tảng Giáo dục Số & Trợ giảng Khoa học Tự nhiên THCS chuẩn GDPT 2018).
- **Mục tiêu:** Cung cấp bộ công cụ trực quan hóa bài giảng cho giáo viên và học tập tương tác cho học sinh cấp 2 (Lớp 6, 7, 8, 9) theo chương trình giáo dục phổ thông 2018 tại Việt Nam.
- **Repository chính thức:** `https://github.com/KimNam2809/EDU_HUB.git` (nhánh `main`).
- **Địa chỉ Production (Live):** `https://edu-hub-mu-brown.vercel.app`.
- **Email quản trị viên:** `lekimnam2809@gmail.com`.

---

## 2. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

```
┌─────────────────────────────────────────────────────────────┐
│                       TRÌNH DUYỆT NGƯỜI DÙNG                │
│    React 19 + Vite • Vanilla CSS Design System • KaTeX      │
│         Offline-First: LocalStorage Cache tức thì           │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│    VERCEL SERVERLESS API     │ │     SUPABASE CLOUD POSTGRES │
│  • /api/chat.js (SciBuddy)   │ │  • public.classes           │
│  • /api/security-monitor.js  │ │  • public.qa_questions      │
│  • /api/security-shield.js   │ │  • security_incident_logs   │
│  • Tự động gửi Email Alert   │ │  • Realtime sync & fallback │
└──────────────────────────────┘ └─────────────────────────────┘
```

### 2.1. Công nghệ sử dụng:
1. **Frontend Core:**
   - React 19 + Vite 8.
   - **Vanilla CSS** (`src/index.css`): Thiết kế Glassmorphism chuẩn EdTech hiện đại, 2 phong cách màu (Chế độ Máy Chiếu Lớp Học Sáng & Chế độ Phòng Lab Tối).
   - **KaTeX 0.18.9**: Trình hiển thị công thức hóa học và toán học bằng vector font sắc nét.
   - **HTML5 Canvas 2D**: Mô phỏng Vòng quay may mắn, Nguyên tử Bohr tương tác, Bảng vẽ Whiteboard chống xóa dòng, Ống nghiệm sủi bọt/kết tủa.
   - **Lucide React**: Hệ thống icon hiện đại, tối ưu hóa kích thước.
   - **Web Audio API**: Bộ hiệu ứng âm thanh sư phạm sinh động (tiếng ting ting, reo chuông, nổ pháo hoa, vỗ tay).

2. **Backend & Serverless Functions:**
   - Vercel Serverless Functions (`/api/`):
     - `api/chat.js`: AI Trợ giảng SciBuddy đa tầng (Groq Llama 3.3 70B -> OpenRouter -> Google Gemini).
     - `api/security-shield.js`: Công cụ phát hiện mã độc (SQLi, XSS, Path Traversal, Bot scanners, DDoS Rate Limit) và gửi cảnh báo email.
     - `api/security-monitor.js`: Endpoint giám sát sức khỏe và kiểm tra bảo mật.

3. **Database & Lưu trữ đám mây:**
   - **Supabase (PostgreSQL)**:
     - Bảng `classes`: Lưu trữ danh sách lớp học, phân tổ, điểm sao thi đua.
     - Bảng `qa_questions`: Diễn đàn hỏi đáp môn học của học sinh.
     - Bảng `security_incident_logs`: Lưu vết các cuộc tấn công bị hệ thống chặn đứng.

---

## 3. DANH MỤC 5 PHÂN HỆ TÍNH NĂNG CHÍNH

### Tab 1: Khởi Động & Trò Chơi (Gamification)
- **Vòng Quay May Mắn (LuckyWheel):** Quay số ngẫu nhiên chọn học sinh trả lời câu hỏi bài cũ, tích điểm sao thi đua trực tiếp vào hồ sơ lớp.
- **Sơ Đồ Lớp Học Laser (SeatingMap):** Quét laser bàn ngẫu nhiên, xem vị trí ngồi học sinh 4 tổ trực quan.
- **Hộp Quà Bí Ẩn (MysteryBoxes):** 8 hộp quà mở quà nhận điểm thưởng hoặc thử thách khoa học vui.
- **Đấu Trường Tri Thức 5 Phút (QuickBattle):** Trận đấu đối kháng 1v1 hoặc đội nhóm có tính thời gian và tính điểm trực tiếp.

### Tab 2: Thí Nghiệm & Bục Giảng Số (Interactive Lab)
- **Bảng Tuần Hoàn IUPAC 2018 (PeriodicTable):** 118 nguyên tố chuẩn SGK mới, mô hình electron quay 3D, khay trộn phản ứng tương tác hóa học nguyên tử (H + O, Na + Cl, Fe + O,...).
- **Phòng Thí Nghiệm Ảo PhET (SimulationsLab):** Nhúng trực tiếp các mô phỏng chuẩn quốc tế Vật lý, Hóa học, Sinh học.
- **Bộ Tiện Ích Bục Giảng (TeacherToolkit):**
  - Bảng vẽ nhanh (Whiteboard) chống xóa nhầm nét vẽ của giáo viên.
  - Cân bằng PTHH & Trực quan hóa hiện tượng sủi bọt khí (↑), kết tủa (↓), tỏa nhiệt và đổi màu dung dịch trong ống nghiệm thí nghiệm ảo.
  - Đổi đại lượng KHTN ($m, V, n, M, C_M, C\%, D, p, T$).
  - Đồng hồ đếm ngược thảo luận nhóm có chuông báo.

### Tab 3: Q&A & AI Trợ Giảng (SciBuddy AI)
- **Diễn Đàn Q&A:** Học sinh gửi câu hỏi sau giờ học, giáo viên phản hồi và ghim câu hỏi hay.
- **SciBuddy AI Socrates:** Trợ lý sư phạm AI môn KHTN trả lời theo phương pháp gợi mở tư duy, không đưa đáp án ngay mà dẫn dắt học sinh tự khám phá kiến thức.

### Tab 4: Ngân Hàng Đề Thi & Ma Trận Bộ GD&ĐT (ExamGenerator)
- Tạo đề thi trắc nghiệm + tự luận chuẩn Thông tư 22, có bản đặc tả ma trận kiến thức KHTN 6, 7, 8, 9.
- Hỗ trợ xuất in đề thi ra giấy A4 với định dạng chuẩn bài thi chính quy.

### Tab 5: Quản Lý Lớp Học & Nhập Dán Excel (ClassManager)
- Nhập danh sách học sinh từ file Excel vnEdu hoặc SMAS chỉ với 1 cú click Dán Clipboard.
- Bảng xếp hạng thi đua cá nhân và tập thể 4 tổ.
- Xuất kết quả đánh giá năng lực ra file CSV.

---

## 4. CHI TIẾT CÁC LỖI ĐÃ KHẮC PHỤC & TỐI ƯU HÓA

### 4.1. Lỗi hiển thị công thức hóa học dạng mã thô LaTeX:
- **Hiện tượng cũ:** Công thức phản ứng hiển thị dạng text `2H_2 + O_2 \xrightarrow{t^o} 2H_2O`.
- **Giải pháp:** Xây dựng component `src/components/ChemicalEquation.jsx` sử dụng **KaTeX**. Tự động chuẩn hóa:
  - Điều kiện nhiệt độ: $\xrightarrow{t^\circ}$.
  - Quang hóa: $\xrightarrow{h\nu}$.
  - Điều kiện tiếng Việt: bọc `\text{...}` tự động (ví dụ: $\xrightarrow{\text{Ánh sáng, Diệp lục}}$).
  - Tự động fallback sang Unicode sắc nét nếu phương trình đã có ký tự subscript.

### 4.2. Lỗi tỷ lệ Responsive trên Desktop, Tablet và Mobile:
- **Navbar:**
  - Nhãn kép thích ứng: `nav-tab-label-full` trên màn hình siêu rộng, `nav-tab-label-short` trên laptop 1200px - 1440px giúp toàn bộ 5 tab và cụm nút điều khiển nằm gọn trên **1 dòng duy nhất**.
  - Thanh cuộn mượt không lộ thanh cuộn (`scrollbar-width: none`) trên Tablet.
  - Tích hợp **Mobile Drawer (Menu trượt ngang)** cho điện thoại di động giúp thao tác dễ dàng bằng ngón tay.
  - Khắc phục lỗi hiển thị ngoặc đơn rỗng `Lớp 8A1 ()` khi lớp học chưa có niên khóa.
- **Các thành phần Grid nội dung:**
  - `lucky-wheel-grid`, `class-manager-main-grid`, `reaction-detail-grid`, `scibuddy-main-grid` chuyển đổi linh hoạt sang 1 cột khi màn hình $\le 900\text{px}$, loại bỏ hoàn toàn hiện tượng tràn ngang màn hình.
  - Subtab chuyển sang dạng thanh cuộn ngang cảm ứng (`subtab-pills-bar`).

### 4.3. Cân bằng màu sắc 2 phong cách Light / Dark:
- **Chế độ Sáng (Classroom Projector):** Nền `#f1f5f9`, thẻ trắng `#ffffff`, viền tương phản cao chuẩn máy chiếu lớp học không bị chói hoặc nhạt màu.
- **Chế độ Tối (Cyber Lab Dark):** Nền `#0b1329`, thẻ kính `#111d40`, ánh sáng dạ quang Sky Cyan `#0284c7` và Royal Violet `#7c3aed`.

---

## 5. HỆ THỐNG AN NINH, PHÁT HIỆN TẤN CÔNG & CẢNH BÁO EMAIL

### 5.1. Cơ chế hoạt động của `api/security-shield.js`:
Mỗi khi có request gửi vào các endpoint backend (`/api/chat`, `/api/security-monitor`), hệ thống sẽ quét qua 4 tầng kiểm tra:
1. **Quét SQL Injection (SQLi):** Phát hiện các cú pháp `UNION SELECT`, `' OR 1=1`, `DROP TABLE`, `INFORMATION_SCHEMA`.
2. **Quét Cross-Site Scripting (XSS):** Phát hiện thẻ `<script>`, `javascript:`, `onerror=`, `document.cookie`.
3. **Quét Path Traversal & Dò tìm file nhạy cảm:** Phát hiện `../`, `/etc/passwd`, `.env`, `.git/config`, `wp-login`, `actuator/`.
4. **Quét Công cụ quét bảo mật xấu (Malicious Bots):** Nhận diện `sqlmap`, `nikto`, `burpsuite`, `nmap`, `gobuster`.
5. **Giới hạn tần suất (Rate Limiting DDoS):** Giới hạn tối đa 60 requests/phút trên mỗi IP.

### 5.2. Khi phát hiện tấn công:
- Ngay lập tức từ chối với mã **HTTP 403 Forbidden**.
- Ghi nhật ký vào bảng `security_incident_logs` trên Supabase.
- Gửi email cảnh báo khẩn cấp (HTML giao diện trực quan) tới **`lekimnam2809@gmail.com`** với đầy đủ IP, loại tấn công, thời gian và payload bị chặn.

### 5.3. Cách kiểm tra lưu lượng truy cập thực tế:
1. **Kiểm tra Logs trực tiếp (Realtime Access Logs):**
   - Đăng nhập [Vercel Dashboard](https://vercel.com/dashboard) -> Chọn dự án `edu-hub` -> Tab **Logs**.
   - Tại đây giáo viên/quản trị viên có thể xem từng request theo thời gian thực (IP, trạng thái 200/403, đường dẫn, thiết bị).
2. **Kiểm tra thống kê người dùng:**
   - Vào tab **Analytics** trên Vercel để xem lượng người truy cập, tỉnh thành, trình duyệt.
3. **Thử nghiệm gửi email cảnh báo an ninh:**
   - Truy cập URL: `https://edu-hub-mu-brown.vercel.app/api/security-monitor?test_alert=1`.
   - Hệ thống sẽ kích hoạt gửi thử 1 email cảnh báo mẫu vào hòm thư `lekimnam2809@gmail.com`.

---

## 6. HỆ THỐNG GITHUB ACTIONS CI/CD & KIỂM TRA TỰ ĐỘNG

Thư mục `.github/workflows/` bao gồm 3 workflows:

1. **`web-health-check.yml` (Kiểm tra sức khỏe website):**
   - **Tần suất:** Chạy tự động mỗi 6 giờ (`0 */6 * * *`) và khi có commit vào `main`, hoặc chạy thủ công bằng nút `Run workflow`.
   - **Nhiệm vụ:** Ping website live, đo latency, kiểm tra chứng chỉ SSL/TLS, kiểm tra endpoint `/api/security-monitor` trả về 200 OK.
2. **`security-audit.yml` (Quét lỗ hổng & Kiểm tra lá chắn phòng thủ):**
   - **Tần suất:** Chạy hàng ngày và khi push code.
   - **Nhiệm vụ:** Chạy `npm audit` quét CVE, quét rò rỉ secret key trong mã nguồn, và giả lập gửi các payload tấn công (SQLi, XSS, Path Traversal) để kiểm chứng hệ thống chặn đúng HTTP 403.
3. **`lockdown-vercel.yml` (Khóa khẩn cấp deploy Vercel thủ công):**
   - **Cách dùng:** Khi phát hiện có dấu hiệu bị tấn công phá hoại, quản trị viên vào tab **Actions** trên GitHub -> Chọn **"EduHub Emergency Lockdown"** -> Bấm **Run workflow**.
   - **Tác vụ:** Hướng dẫn chi tiết kích hoạt **"Attack Mode (CAPTCHA Challenge)"** và tạm dừng deploy trên Vercel chỉ trong 10 giây.

---

## 7. BIẾN MÔI TRƯỜNG CẦN THIẾT (.env)

Các biến môi trường được cấu hình tại Vercel Dashboard (Settings -> Environment Variables) hoặc file `.env` local:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Model API Keys (Cho SciBuddy AI)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxx

# Email Alert Service (Gửi mail cảnh báo tấn công về lekimnam2809@gmail.com)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 8. KIẾN TRÚC TRỢ LÝ AI AGENTS SƯ PHẠM (SCIBUDDY AI AGENT)

### 8.1. Quyết định thiết kế: Loại bỏ hoàn toàn modal "Thêm API Key"
- **Lý do sư phạm & bảo mật:** Học sinh và giáo viên phổ thông không cần phải có kiến thức về API Key, không phải tự đăng ký hay copy-paste key. Việc nhập API key trên giao diện client dễ gây lộ key cá nhân và tạo rào cản kỹ thuật lớn.
- **Giải pháp:** Toàn bộ API Key (`OPENROUTER_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`) được lưu trữ an toàn tuyệt đối ở phía Serverless Backend (`/api/chat.js` và biến môi trường Vercel). Giao diện hiển thị trực tiếp trạng thái `🟢 AI Agent Sẵn Sàng (GDPT 2018)`.

### 8.2. Cơ chế AI Agent (Hành động điều hướng hệ thống):
- **Phát hiện ý định & Thẻ hành động:** Khi người dùng đặt câu hỏi có nhu cầu mở công cụ EduHub (ví dụ: *"Mở bảng tuần hoàn"*, *"Cân bằng phương trình Fe + O2"*, *"Mở vòng quay may mắn"*...), AI Agent tự động đính kèm thẻ lệnh ở cuối câu trả lời dạng:
  - `[ACTION:NAVIGATE:games:wheel]` -> Mở Vòng quay may mắn
  - `[ACTION:NAVIGATE:games:seating]` -> Mở Sơ đồ lớp laser
  - `[ACTION:NAVIGATE:games:battle]` -> Mở Đấu trường tri thức
  - `[ACTION:NAVIGATE:lab:periodic]` -> Mở Bảng tuần hoàn nguyên tố Bohr 3D
  - `[ACTION:NAVIGATE:lab:simulations]` -> Mở Phòng thí nghiệm ảo PhET
  - `[ACTION:NAVIGATE:lab:toolkit]` -> Mở Bục giảng số & Cân bằng PTHH
  - `[ACTION:NAVIGATE:exam]` -> Mở Ngân hàng đề thi
  - `[ACTION:NAVIGATE:classes]` -> Mở Quản lý lớp học
- **Render Action Card:** Frontend phân tích thẻ này qua hàm `parseAction(text)`, bóc tách chuỗi lệnh và hiển thị thành một **Thẻ hành động trực quan (Agent Action Card)** với nút bấm **"Mở Ngay →"**. Khi bấm nút, callback `onNavigateTab(tab, subTab)` được kích hoạt để chuyển ngay đến công cụ tương ứng.

### 8.3. Chuỗi dự phòng AI Model (Resilient AI Provider Chain):
Tầng Serverless `/api/chat.js` xử lý hội thoại đa lượt (`chatHistory`) qua cơ chế ngắt mạch dự phòng tự động:
1. **OpenRouter High-Performance Models:** Ưu tiên các model chất lượng cao (Free tier: `google/gemma-4-31b-it:free`, `google/gemma-4-26b-a4b-it:free`, `qwen/qwen3.8-27b:free`; và Paid tier: `meta-llama/llama-3.3-70b-instruct`, `mistralai/mistral-small-24b-instruct-2501`).
2. **Google Gemini Flash API:** Dự phòng khi cấu hình `GEMINI_API_KEY`.
3. **Groq Llama 3.3 70B:** Dự phòng khi `GROQ_API_KEY` còn quota.
4. **Offline Socrates Heuristic Engine:** Đáp ứng tức thì 0ms cho các câu hỏi phổ biến, giữ hệ thống hoạt động 100% ngay cả khi mất mạng internet hoặc sự cố phía nhà cung cấp API.

### 8.4. Phương pháp sư phạm Socrates GDPT 2018:
- Không giải bài hộ, không đưa đáp án trần trụi.
- Đặt câu hỏi dẫn dắt, gợi mở tư duy, khơi gợi hiện tượng thực tiễn đời sống.
- Tuân thủ nghiêm ngặt danh pháp quốc tế IUPAC mới: *Oxygen, Hydrogen, Carbon, Nitrogen, Carbon monoxide, Carbon dioxide, Hydrochloric acid, Calcium carbonate...*

---

## 9. HƯỚNG DẪN DÀNH CHO AI TIẾP QUẢN KHI BẮT ĐẦU CÔNG VIỆC MỚI

Khi bạn (AI kế nhiệm) nhận một yêu cầu tiếp theo từ người dùng:
1. **Đọc kỹ file này (`Agents.md`)** cùng với `src/App.jsx` và `src/index.css` để nắm bắt phong cách code.
2. **Không tự ý cài đặt thêm thư viện nặng** nếu không thực sự cần thiết. Dự án ưu tiên tải nhanh, chạy mượt trên máy tính trường học có cấu hình khiêm tốn.
3. **Bảo tồn tính năng Offline-First:** Mọi dữ liệu lưu ở LocalStorage trước, sau đó mới đồng bộ với Supabase. Không để ứng dụng bị crash khi mất kết nối mạng.
4. **Kiểm tra Responsive:** Bất kỳ component nào mới tạo đều phải kiểm tra trên 3 kích thước: 1366px (Desktop), 768px (Tablet), 390px (Mobile).
5. **Quy trình deploy:**
   - Chạy lệnh `npm run build` để kiểm tra build thành công 0 lỗi.
   - Commit và push lên nhánh `main`: `git push origin main`.
   - Vercel sẽ tự động build và cập nhật bản mới nhất lên production URL.
