Ran command: `git status -s`
Ran command: `git status`
Viewed Navbar.jsx:63-75
Ran command: `git diff`
Ran command: `git status --ignored -s`
Created KE_HOACH_TEST_EDUHUB.md
Viewed .gitignore:15-33
Ran command: `git status -s`
Ran command: `git add KE_HOACH_TEST_EDUHUB.md; git commit -m "docs: add comprehensive EduHub real-world test plan"; git push origin main`

Tôi đã xây dựng hoàn chỉnh **Kế hoạch Kiểm Thử Thực Tế Toàn Diện cho EduHub** và lưu thành tài liệu chuyên nghiệp tại [`KE_HOACH_TEST_EDUHUB.md`](file:///d:/KHTN_Cap2/Games/KE_HOACH_TEST_EDUHUB.md) (đồng thời đã được đồng bộ đẩy lên repository GitHub của bạn).

Dưới đây là 7 kịch bản kiểm thử chi tiết từng bước để bạn có thể tự kiểm tra mọi góc độ vận hành của hệ thống:

---

## 🧪 KẾ HOẠCH KIỂM THỬ THỰC TẾ CHI TIẾT (EDUHUB TEST PLAN)

### 📌 KỊCH BẢN 1: KIỂM THỬ DỮ LIỆU & ĐỒNG BỘ CLOUD (DATA CRUD & SYNC)
> **Mục tiêu**: Chứng minh dữ liệu hoạt động thực tế 100%, không bị mất khi F5 và đồng bộ hai chiều với Supabase PostgreSQL.

1. **Test tăng sao thi đua & F5 lưu trữ**:
   - Vào **Tab 1 (Khởi động)** hoặc **Tab 5 (Quản lý lớp)**, bấm chọn một học sinh (VD: *Nguyễn An*), bấm `+1 Sao` hoặc `+2 Sao`.
   - Quan sát số sao tăng ngay trên giao diện.
   - Nhấn **F5** (Tải lại trang) ➡️ **Kết quả đạt**: Số sao vẫn giữ nguyên, không bị reset về 0.
2. **Test Thêm - Sửa - Xóa học sinh (CRUD)**:
   - Tại Tab 5, bấm `+ Thêm Học Sinh Mới`, nhập tên *"Trần Khoa Học"*, chọn Tổ 2, Bàn 1.
   - Học sinh mới xuất hiện ngay trong danh sách và trên Sơ đồ chỗ ngồi.
   - Bấm vào tên em đó để mở hồ sơ, chọn nút màu đỏ `Xóa học sinh này` ➡️ **Kết quả đạt**: Học sinh được xóa sạch sẽ khỏi bộ nhớ.
3. **Test Tạo lớp học mới**:
   - Bấm `+ Tạo Lớp Mới`, nhập *"Lớp 8A5"*, chọn Khối 8.
   - Menu chọn lớp ở góc trên bên phải thanh Navbar sẽ có thêm lựa chọn *"Lớp 8A5"*.
4. **Test Đồng bộ Supabase**:
   - Mở [Supabase Table Editor](https://supabase.com/dashboard/project/hiotzlqpolehlcmmsntr/editor) ➡️ Xem bảng `classes`.
   - **Kết quả đạt**: Các lớp học và mảng dữ liệu học sinh (cột `students` dạng JSONB) xuất hiện đầy đủ trên cloud.

---

### 📌 KỊCH BẢN 2: KIỂM THỬ HỒ SƠ ĐÁNH GIÁ HỌC SINH (CHUẨN THÔNG TƯ 22)
> **Mục tiêu**: Đánh giá năng lực thực chất theo chương trình KHTN GDPT 2018 và xuất dữ liệu báo cáo.

1. **Mở hồ sơ đánh giá chi tiết**:
   - Bấm trực tiếp vào bất kỳ thẻ học sinh nào trong danh sách hoặc trên bàn học.
   - Modal đánh giá mở lên với hiệu ứng làm mờ nền (backdrop blur).
2. **Chấm điểm 3 năng lực cốt lõi**:
   - Đánh giá mức độ:
     * *Nhận thức KHTN*: Tốt
     * *Tìm hiểu tự nhiên*: Khá
     * *Vận dụng kiến thức, kĩ năng*: Tốt
   - Nhập lời phê giáo viên: *"Rất hăng hái phát biểu và cẩn thận trong giờ thực hành"*.
   - Bấm Lưu ➡️ Đóng modal và mở lại ➡️ **Kết quả đạt**: Mọi đánh giá và lời phê được lưu vẹn nguyên.
3. **Nhập hàng loạt từ Excel (Bulk Import)**:
   - Bấm `Dán Danh Sách Excel`, copy 5 dòng tên học sinh dán vào khung và bấm `Import` ➡️ 5 học sinh vào lớp ngay tức thì.
4. **Xuất file báo cáo CSV**:
   - Bấm nút `Xuất Báo Cáo CSV (TT22)` ➡️ Trình duyệt tải về file `.csv` mở được bằng Excel với đầy đủ điểm số, sao và lời nhận xét.

---

### 📌 KỊCH BẢN 3: KIỂM THỬ KHỞI ĐỘNG & TRÒ CHƠI LỚP HỌC (GAMIFICATION)
> **Mục tiêu**: Kiểm tra tính ngẫu nhiên, âm thanh Web Audio sinh động và liên kết điểm thưởng.

1. **Vòng quay may mắn (Lucky Wheel)**:
   - Bấm nút **QUAY NGAY 🎡** ➡️ Vòng quay quay tít với âm thanh tích tắc, kim dừng đúng tên một học sinh.
   - Thẻ trúng thưởng hiện ra kèm hiệu ứng pháo hoa rực rỡ và câu hỏi kiểm tra bài cũ.
   - Bấm `⭐ Tặng 2 Sao & Lưu Vào Sổ Lớp` ➡️ Phát nhạc chiến thắng, hệ thống tự động ghi điểm vào sổ lớp.
2. **Sơ đồ lớp học quét Laser (Laser Desk Scanner)**:
   - Chuyển sang tab con `Sơ Đồ Lớp` ➡️ Bấm `Quét Laser Chọn Bàn Ngẫu Nhiên 🎯`.
   - Vệt sáng quét qua các dãy bàn và dừng lại ở một bàn ngẫu nhiên, làm nổi bật học sinh đang ngồi tại bàn đó.
3. **Hộp quà bí ẩn (Mystery Boxes)**:
   - Bấm vào bất kỳ hộp quà nào 🎁 ➡️ Nắp hộp bung mở, hiển thị phần thưởng và câu hỏi khoa học. Bấm `Xem Chi Tiết Câu Hỏi` mở modal to rõ ràng.
4. **Đấu trường tri thức 5 phút (Quick Battle)**:
   - Bấm `Chọn Ngẫu Nhiên 2 Bạn` ➡️ Bấm `BẮT ĐẦU TRẬN ĐẤU`.
   - Đồng hồ đếm ngược 15 giây/câu, bấm nút `+1 Điểm Đúng (A)` hoặc `(B)` ➡️ Kết thúc trận tự động vinh danh người chiến thắng.

---

### 📌 KỊCH BẢN 4: KIỂM THỬ THÍ NGHIỆM ẢO & BẢNG TUẦN HOÀN IUPAC
> **Mục tiêu**: Xác thực danh pháp IUPAC mới, mô hình nguyên tử Bohr và khay phản ứng đa nguyên tố.

1. **Bảng tuần hoàn IUPAC & Mô hình Bohr động**:
   - Bấm vào nguyên tố **Aluminium (Nhôm)** hoặc **Oxygen**.
   - Modal mở ra hiển thị: Tên tiếng Anh mới (`Aluminium`), tên cũ (`Nhôm`), số hiệu nguyên tử, khối lượng.
   - Quan sát Canvas: Các electron đang chuyển động quay quanh hạt nhân theo mô hình động Bohr thời gian thực.
   - Bấm vào biểu tượng chiếc loa 🔊 ➡️ Trình duyệt đọc phát âm tiếng Anh chuẩn bản ngữ (`/ˌæl.jəˈmɪn.i.əm/`).
2. **Khay phản ứng đa nguyên tố (2 - 10 nguyên tố)**:
   - Chọn tab con `Phản Ứng Tương Tác` ➡️ Bấm chọn nguyên tố `H` và `O`.
   - Quan sát Canvas hạt va chạm nhiệt học ➡️ Xuất hiện phương trình: `2H2 + O2 → 2H2O` và hiện tượng tỏa nhiệt nổ mạnh.
   - Thử bấm `+ Thêm Phản Ứng Mới` để nhập 1 phản ứng do giáo viên tự biên soạn (VD: `Na + Cl2 -> NaCl`).
3. **Bảng tính tan KHTN**:
   - Chuyển sang tab con `Bảng Tính Tan` ➡️ Tra cứu giao điểm `Cu²⁺` và `OH⁻` ➡️ Thẻ hiện kết tủa xanh lam `Cu(OH)2 ↓`.
4. **Bảng vẽ bục giảng & Bút phấn không làm mất ô ly**:
   - Mở `Bục Giảng Số` ➡️ Mở `Bảng Vẽ Nhanh`.
   - Chọn bút phấn trắng vẽ thử vài nét công thức lên bảng kẻ ô ly.
   - Chọn công cụ Tẩy xóa 1 nét vẽ ➡️ Thử tiếp nút Xóa bảng ➡️ **Kết quả đạt**: Nét vẽ bị xóa nhưng **các đường lưới ô ly tập học sinh vẫn được giữ nguyên vẹn**, không bị tẩy mất.

---

### 📌 KỊCH BẢN 5: KIỂM THỬ DIỄN ĐÀN Q&A & AI TRỢ GIẢNG (SCIBUDDY)
> **Mục tiêu**: Kiểm tra tính năng tương tác hỏi đáp sau giờ học và phản hồi AI.

1. **Gửi câu hỏi ẩn danh**:
   - Vào Tab **3 (Q&A & AI)** ➡️ Bấm `Đặt Câu Hỏi Mới` ➡️ Nhập câu hỏi thắc mắc bài tập về nhà.
   - Tích chọn `Hỏi ẩn danh` ➡️ Bấm Gửi.
   - Câu hỏi hiển thị trên dòng tin với tác giả *"Ẩn danh"*, giáo viên nhìn thấy ghi chú danh tính thật bên cạnh.
2. **Thích & Ghim lời giải hay**:
   - Bấm nút `Thích (Upvote)` để tăng lượt tương tác.
   - Bấm nút `Ghim` ➡️ Câu hỏi có viền vàng hổ phách nổi bật lên đầu trang.
   - Bấm `Thầy/Cô Trả Lời Câu Này` ➡️ Nhập lời giải sư phạm và bấm Gửi.
3. **Trợ giảng AI SciBuddy (Kết nối Serverless)**:
   - Chuyển sang tab con `Trợ Giảng AI (SciBuddy)` ➡️ Nhập: *"Vì sao khi chạm tay vào nước đá ta lại thấy lạnh buốt?"*.
   - **Kết quả đạt**: Trợ giảng phản hồi bằng phương pháp Socratic gợi mở khoa học, chuẩn danh pháp GDPT 2018.

---

### 📌 KỊCH BẢN 6: KIỂM THỬ NGÂN HÀNG ĐỀ THI & IN ẤN CHUẨN A4
> **Mục tiêu**: Kiểm tra thuật toán sinh đề ma trận 4 mức độ nhận thức và định dạng in không bị vỡ layout.

1. **Tạo đề thi ma trận tự động**:
   - Vào Tab **4 (Ngân Hàng Đề Thi)** ➡️ Chọn Khối 8 ➡️ Chọn đề 15 phút (10 câu) ➡️ Bấm `TỰ ĐỘNG TẠO ĐỀ THI MA TRẬN`.
   - Đề thi được bốc chính xác theo tỉ lệ: 40% Nhận biết, 30% Thông hiểu, 20% Vận dụng, 10% Vận dụng cao.
2. **Hoán vị mã đề (101 - 104)**:
   - Bấm qua các mã đề `Mã 101`, `Mã 102`, `Mã 103`, `Mã 104`.
   - Thứ tự câu hỏi và các đáp án A, B, C, D được xáo trộn ngẫu nhiên.
3. **Xem trước bản in (Print Preview)**:
   - Bấm nút `In Đề Thi (A4) 🖨️`.
   - Hộp thoại in mở ra: Thanh menu, các nút bấm đều được ẩn đi hoàn toàn, chỉ còn lại đề thi trang trọng trên khổ giấy A4 sẵn sàng phát cho học sinh.

---

### 📌 KỊCH BẢN 7: KIỂM THỬ GIAO DIỆN (LIGHT/DARK & PHÒNG HỌC MÁY CHIẾU)
> **Mục tiêu**: Đảm bảo hiển thị hoàn hảo trong mọi điều kiện ánh sáng lớp học.

1. **Chuyển đổi Chế độ Sáng (Máy Chiếu Lớp Học)**:
   - Bấm biểu tượng **Mặt Trời / Mặt Trăng** trên thanh Navbar góc phải.
   - Nền chuyển sang trắng/xám trang nhã (`#f8fafc`), chữ xanh than đậm (`#0f172a`), các đường viền sắc nét, đảm bảo chiếu lên máy chiếu học sinh ngồi cuối lớp nhìn rất rõ.
2. **Chuyển đổi Chế độ Tối (Phòng Lab Khoa Học)**:
   - Bấm chuyển lại sang biểu tượng Mặt Trăng ➡️ Giao diện chuyển sang Cyber Dark (`#090d16`), các viền neon phát sáng êm dịu cho mắt.
3. **Bật / Tắt Loa**:
   - Bấm nút Loa 🔊 để tắt âm thanh ➡️ Thử bấm các nút không phát tiếng ➡️ Bấm bật lại và F5 ➡️ Trạng thái loa được ghi nhớ chính xác.
4. **Chế độ Trình chiếu TV (Presentation Mode)**:
   - Bấm nút Phóng to ⛶ ➡️ Cỡ chữ toàn hệ thống tự động phóng to hơn 25%, khoảng cách lề thoáng hơn phục vụ trình chiếu trên tivi lớp học.

---

💡 **Bạn có thể mở ngay trình duyệt tại `http://localhost:5174/` để trải nghiệm lần lượt từng kịch bản trên, hoặc mở file [`KE_HOACH_TEST_EDUHUB.md`](file:///d:/KHTN_Cap2/Games/KE_HOACH_TEST_EDUHUB.md) ngay trong IDE để vừa thực hiện vừa đánh dấu tích hoàn thành!**