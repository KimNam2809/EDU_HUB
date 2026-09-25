# 🧪 BẢN KẾ HOẠCH KIỂM THỬ THỰC TẾ TOÀN DIỆN NỀN TẢNG EDUHUB
> **Mục tiêu**: Giúp Thầy/Cô tự kiểm tra từng tính năng, xác thực việc lưu trữ & thay đổi dữ liệu (Local & Supabase Cloud), khả năng tương tác lớp học và sự ổn định của hệ thống trước và sau khi deploy.

---

## 📑 MỤC LỤC KỊCH BẢN TEST
1. [Kịch bản 1: Kiểm thử Dữ liệu & Đồng bộ Cloud (Data CRUD & Sync)](#1-kịch-bản-1-kiểm-thử-dữ-liệu--đồng-bộ-cloud)
2. [Kịch bản 2: Kiểm thử Quản lý Lớp học & Đánh giá Năng lực TT22](#2-kịch-bản-2-kiểm-thử-quản-lý-lớp-học--đánh-giá-năng-lực-tt22)
3. [Kịch bản 3: Kiểm thử Khởi động & Trò chơi Thi đua Lớp học](#3-kịch-bản-3-kiểm-thử-khởi-động--trò-chơi-thi-đua-lớp-học)
4. [Kịch bản 4: Kiểm thử Thí nghiệm ảo, Bảng tuần hoàn & IUPAC](#4-kịch-bản-4-kiểm-thử-thí-nghiệm-ảo-bảng-tuần-hoàn--iupac)
5. [Kịch bản 5: Kiểm thử Diễn đàn Q&A & AI Trợ giảng SciBuddy](#5-kịch-bản-5-kiểm-thử-diễn-đàn-qa--ai-trợ-giảng-scibuddy)
6. [Kịch bản 6: Kiểm thử Ngân hàng Đề thi & Xuất bản in TT22](#6-kịch-bản-6-kiểm-thử-ngân-hàng-đề-thi--xuất-bản-in-tt22)
7. [Kịch bản 7: Kiểm thử Giao diện (Light/Dark, Âm thanh & Trình chiếu)](#7-kịch-bản-7-kiểm-thử-giao-diện-lightdark-âm-thanh--trình-chiếu)

---

## 1. KỊCH BẢN 1: KIỂM THỬ DỮ LIỆU & ĐỒNG BỘ CLOUD

### Mục tiêu:
Xác nhận dữ liệu thay đổi trên trình duyệt được lưu tự động, không bị mất khi F5 và đồng bộ lên Supabase PostgreSQL.

| STT | Bước thực hiện | Thao tác chi tiết | Kết quả kỳ vọng đạt chuẩn | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **1.1** | **Thay đổi số sao học sinh** | Vào Tab **1 (Khởi Động)** hoặc Tab **5 (Quản lý lớp)**, chọn 1 học sinh (VD: *Nguyễn An*), bấm `+1 Sao` hoặc `+2 Sao`. | Số sao của học sinh tăng lên ngay lập tức. | [ ] |
| **1.2** | **F5 kiểm tra lưu cục bộ** | Nhấn **F5** (hoặc `Ctrl + R`) để tải lại trang web. | Số sao của học sinh vẫn giữ nguyên số lượng vừa cộng, không bị reset về ban đầu. | [ ] |
| **1.3** | **Thêm học sinh mới** | Vào Tab **5**, bấm nút `+ Thêm Học Sinh Mới`, nhập tên *"Trần Khoa Học"*, chọn Tổ 2, vị trí Bàn 1 - Dãy 1. | Học sinh mới xuất hiện trong danh sách và hiển thị đúng vị trí trên Sơ đồ lớp. | [ ] |
| **1.4** | **Xóa học sinh** | Bấm vào thẻ học sinh vừa tạo, chọn nút `Xóa học sinh này` trong hồ sơ đánh giá. | Học sinh biến mất khỏi danh sách sau khi xác nhận. | [ ] |
| **1.5** | **Thêm lớp học mới** | Vào Tab **5**, bấm nút `+ Tạo Lớp Mới`, đặt tên *"Lớp 8A5"*, Khối 8, Năm học 2024-2025. | Lớp 8A5 xuất hiện trong menu chọn lớp ở thanh Navbar trên cùng. | [ ] |
| **1.6** | **Kiểm tra trên Supabase** | Mở **Supabase Dashboard** ➡️ **Table Editor** ➡️ Chọn bảng `classes`. | Nhìn thấy bản ghi lớp học với cột `students` dạng JSONB được cập nhật thời gian thực. | [ ] |

---

## 2. KỊCH BẢN 2: KIỂM THỬ QUẢN LÝ LỚP HỌC & ĐÁNH GIÁ NĂNG LỰC TT22

### Mục tiêu:
Kiểm tra hồ sơ học sinh theo chuẩn Thông tư 22/2021/TT-BGDĐT và chức năng xuất file Excel/CSV.

| STT | Bước thực hiện | Thao tác chi tiết | Kết quả kỳ vọng đạt chuẩn | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **2.1** | **Mở hồ sơ đánh giá chi tiết** | Bấm trực tiếp vào tên bất kỳ học sinh nào trong danh sách lớp. | Modal hồ sơ mở lên mượt mà với 3 năng lực KHTN cốt lõi và khung nhận xét. | [ ] |
| **2.2** | **Chấm điểm 3 năng lực** | Chuyển đổi các mức năng lực: Nhận thức (Tốt), Tìm hiểu tự nhiên (Khá), Vận dụng (Tốt). Nhập lời phê: *"Rất tích cực làm thí nghiệm"*. Bấm Lưu. | Dữ liệu năng lực và lời phê được ghi nhận, đóng modal và mở lại vẫn giữ nguyên. | [ ] |
| **2.3** | **Nhập hàng loạt từ Excel** | Vào Tab **5**, bấm `Dán Danh Sách Excel`, copy 5 dòng tên học sinh dán vào ô văn bản và bấm `Import`. | Cả 5 học sinh mới được thêm vào lớp học ngay tức thì. | [ ] |
| **2.4** | **Xuất file báo cáo CSV** | Bấm nút `Xuất Báo Cáo CSV (TT22)`. | Trình duyệt tải về file `.csv` chứa đầy đủ họ tên, tổ, số sao, điểm 3 năng lực KHTN và nhận xét giáo viên. | [ ] |
| **2.5** | **Kho học liệu giáo viên** | Bấm tab con `Kho Bài Giảng & Drive`, bấm `+ Thêm Học Liệu`, nhập tên tài liệu và link Google Drive. | Tài liệu xuất hiện trong kho, có thể bấm mở link ngoài hoặc chỉnh sửa. | [ ] |

---

## 3. KỊCH BẢN 3: KIỂM THỬ KHỞI ĐỘNG & TRÒ CHƠI THI ĐUA LỚP HỌC

### Mục tiêu:
Xác thực khả năng vận hành trơn tru trong giờ dạy, âm thanh Web Audio và liên kết điểm thưởng.

| STT | Phân hệ Game | Thao tác chi tiết | Kết quả kỳ vọng đạt chuẩn | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **3.1** | **Vòng quay may mắn** | Chọn lớp có học sinh ➡️ Bấm nút **QUAY NGAY** 🎡. | Vòng quay quay tít với âm thanh tích tắc sinh động, kim dừng lại đúng một học sinh và hiển thị câu hỏi ngẫu nhiên kèm hiệu ứng pháo hoa. | [ ] |
| **3.2** | **Tặng sao từ vòng quay** | Khi thẻ trúng thưởng hiện ra, bấm `⭐ Tặng 2 Sao & Lưu Vào Sổ Lớp`. | Phát âm thanh chiến thắng, thông báo đã cộng sao thành công vào sổ lớp của học sinh đó. | [ ] |
| **3.3** | **Sơ đồ lớp (Laser Desk)** | Chuyển sang tab con `Sơ Đồ Lớp` ➡️ Bấm `Quét Laser Chọn Bàn Ngẫu Nhiên` 🎯. | Đèn laser chạy qua các dãy bàn và dừng lại ở một bàn ngẫu nhiên, sáng đèn bàn học đó. | [ ] |
| **3.4** | **Hộp quà bí ẩn** | Chuyển sang `Hộp Quà Bí Ẩn` ➡️ Bấm vào Hộp quà số 1 hoặc số 2 🎁. | Hộp quà bung mở với âm thanh mở quà, hiển thị câu hỏi khoa học và phần thưởng. Bấm `Xem Chi Tiết Câu Hỏi` mở modal rõ nét. | [ ] |
| **3.5** | **Đấu trường 5 phút** | Chuyển sang `Đấu Trường Tri Thức` ➡️ Bấm `Chọn Ngẫu Nhiên 2 Bạn` ➡️ Bấm `BẮT ĐẦU TRẬN ĐẤU`. | Đồng hồ 15 giây đếm ngược, bấm nút cộng điểm bên Đấu thủ A/B ➡️ Sau 5 câu hiện bảng vinh danh người chiến thắng. | [ ] |

---

## 4. KỊCH BẢN 4: KIỂM THỬ THÍ NGHIỆM ẢO, BẢNG TUẦN HOÀN & IUPAC

### Mục tiêu:
Kiểm tra tính chính xác của danh pháp hóa học, hoạt họa mô phỏng Bohr và khay tương tác phản ứng.

| STT | Chức năng Lab | Thao tác chi tiết | Kết quả kỳ vọng đạt chuẩn | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **4.1** | **Bảng tuần hoàn IUPAC** | Bấm vào nguyên tố **Aluminium (Nhôm)** hoặc **Iron (Sắt)**. | Modal mở ra hiển thị chuẩn tên tiếng Anh mới (IUPAC), tên cũ quen thuộc, cấu hình electron và **mô hình động Bohr quay quanh hạt nhân**. | [ ] |
| **4.2** | **Phát âm danh pháp** | Trong modal nguyên tố, bấm vào biểu tượng chiếc loa 🔊 cạnh tên nguyên tố. | Trình duyệt phát âm tiếng Anh chuẩn bản xứ theo Web Speech Synthesis API. | [ ] |
| **4.3** | **Bảng tính tan** | Chuyển sang tab con `Bảng Tính Tan` ➡️ Bấm vào ô giao giữa `Cu²⁺` và `OH⁻`. | Hiển thị kết tủa màu xanh lam đặc trưng `Cu(OH)2 ↓`. Thử tiếp `Ba²⁺` và `SO4²⁻` ➡️ Kết tủa trắng `BaSO4 ↓`. | [ ] |
| **4.4** | **Khay phản ứng đa nguyên tố** | Chuyển sang `Phản Ứng Tương Tác` ➡️ Bấm chọn nguyên tố `H` và `O`. | Canvas hiển thị các hạt va chạm nhiệt học, xuất hiện phương trình: `2H2 + O2 → 2H2O` kèm hiện tượng tỏa nhiệt nổ mạnh. | [ ] |
| **4.5** | **Thêm phản ứng của GV** | Bấm `+ Thêm Phản Ứng Mới`, nhập nguyên tố `Na, Cl`, phương trình `2Na + Cl2 -> 2NaCl`, hiện tượng `Khói trắng muối ăn`. Bấm Lưu. | Phản ứng mới được lưu vào thư viện giảng dạy và hoạt động ngay trên khay. | [ ] |
| **4.6** | **Thí nghiệm ảo PhET** | Chuyển sang tab con `Thí Nghiệm PhET` ➡️ Chọn bài *"Cân Bằng Phương Trình"*. Bấm `Xem Hướng Dẫn Thao Tác`. | Modal bản chất khoa học mở lên chi tiết. Nhấp vào iframe thí nghiệm để kéo thả quả cân/nguyên tử. | [ ] |
| **4.7** | **Bảng vẽ & Bút viết bảng** | Vào `Bục Giảng Số` ➡️ Mở `Bảng Vẽ Nhanh` ➡️ Chọn Bút phấn trắng, vẽ lên bảng ➡️ Thử dùng Tẩy xóa 1 nét vẽ ➡️ Thử bấm Xóa Bảng. | Nét vẽ biến mất mượt mà, **các đường lưới ô ly tập học sinh vẫn được bảo toàn nguyên vẹn**, không bị tẩy mất. | [ ] |

---

## 5. KỊCH BẢN 5: KIỂM THỬ DIỄN ĐÀN Q&A & AI TRỢ GIẢNG SCIBUDDY

### Mục tiêu:
Kiểm tra diễn đàn hỏi đáp sau giờ học và độ nhạy của Trợ giảng AI (kết nối Serverless Groq/Gemini).

| STT | Chức năng Q&A | Thao tác chi tiết | Kết quả kỳ vọng đạt chuẩn | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **5.1** | **Gửi câu hỏi ẩn danh** | Vào Tab **3 (Q&A & AI)** ➡️ Bấm `Đặt Câu Hỏi Mới` ➡️ Nhập thắc mắc, tích chọn `Hỏi ẩn danh` ➡️ Gửi. | Câu hỏi xuất hiện trên dòng sự kiện với tên *"Ẩn danh"*, giáo viên nhìn thấy ghi chú danh tính thật bên cạnh. | [ ] |
| **5.2** | **Thích & Ghim câu hỏi** | Bấm nút `Thích (Upvote)` trên câu hỏi ➡️ Bấm nút `Ghim`. | Số like tăng lên; câu hỏi được ghim viền màu hổ phách vàng lên vị trí ưu tiên. | [ ] |
| **5.3** | **Giáo viên phản hồi** | Bấm `Thầy/Cô Trả Lời Câu Này` ➡️ Nhập lời giải sư phạm ➡️ Bấm `Gửi Phản Hồi`. | Khung phản hồi màu ngọc bích (Emerald) xuất hiện với nhãn "GIÁO VIÊN ĐÃ PHẢN HỒI". | [ ] |
| **5.4** | **Hỏi đáp với AI SciBuddy** | Chuyển sang tab con `Trợ Giảng AI (SciBuddy)` ➡️ Nhập câu hỏi: *"Vì sao khi chạm tay vào nước đá lại cảm thấy lạnh buốt?"* ➡️ Bấm Gửi. | AI phản hồi thông minh, phân tích theo phương pháp Socratic định hướng gợi mở thay vì chỉ đưa đáp án sẵn. | [ ] |
| **5.5** | **Tra cứu FAQ Khoa học** | Gõ vào ô tìm kiếm: *"quang hợp"* hoặc *"sấm sét"*. | Danh sách câu hỏi thu hẹp ngay lập tức, bấm vào câu hỏi mở modal giải thích hiện tượng đời sống. | [ ] |

---

## 6. KỊCH BẢN 6: KIỂM THỬ NGÂN HÀNG ĐỀ THI & XUẤT BẢN IN TT22

### Mục tiêu:
Kiểm tra thuật toán sinh đề ma trận 4 mức độ nhận thức và in đề không bị vỡ layout.

| STT | Chức năng Đề thi | Thao tác chi tiết | Kết quả kỳ vọng đạt chuẩn | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **6.1** | **Tạo đề thi ma trận** | Vào Tab **4 (Ngân Hàng Đề Thi)** ➡️ Chọn Khối 8 ➡️ Chọn dạng đề 15 phút (10 câu) ➡️ Bấm `TỰ ĐỘNG TẠO ĐỀ THI MA TRẬN`. | Hệ thống trích xuất chính xác 10 câu hỏi theo tỉ lệ 40% Nhận biết, 30% Thông hiểu, 20% Vận dụng, 10% Vận dụng cao. | [ ] |
| **6.2** | **Hoán vị mã đề (101 - 104)** | Bấm vào các nút chuyển mã đề `Mã 101`, `Mã 102`, `Mã 103`, `Mã 104`. | Thứ tự các câu hỏi và các phương án A, B, C, D được xáo trộn ngẫu nhiên một cách khoa học. | [ ] |
| **6.3** | **Hiển thị công thức KaTeX** | Quan sát các câu hỏi có công thức hóa học (`H2SO4`, `Fe3O4`) hoặc biểu thức vật lí (`v = s/t`). | Công thức hiển thị sắc nét bằng font toán học chuẩn KaTeX, không bị lỗi font hay mã thô. | [ ] |
| **6.4** | **Xem & Ẩn đáp án/Lời giải** | Bấm nút `Hiện Đáp Án & Hướng Dẫn Giải`. | Khung đáp án đúng và phân tích sư phạm hiện ra bên dưới mỗi câu hỏi. | [ ] |
| **6.5** | **Xem trước bản in (Print Preview)** | Bấm nút `In Đề Thi (A4)` 🖨️. | Hộp thoại in của trình duyệt mở ra: Thanh navbar, các nút bấm đều được ẩn sạch sẽ (chuẩn CSS `@media print`), chỉ còn đề thi trang trọng trên trang A4. | [ ] |

---

## 7. KỊCH BẢN 7: KIỂM THỬ GIAO DIỆN (LIGHT/DARK, ÂM THANH & TRÌNH CHIẾU)

### Mục tiêu:
Xác thực khả năng thích ứng linh hoạt trong mọi điều kiện phòng học thực tế.

| STT | Tính năng | Thao tác chi tiết | Kết quả kỳ vọng đạt chuẩn | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **7.1** | **Chế độ Sáng (Máy Chiếu)** | Bấm vào nút biểu tượng **Mặt Trời / Mặt Trăng** trên góc phải Navbar. | Giao diện chuyển sang nền sáng trắng/xám trang nhã (`#f8fafc`), chữ đen than sắc nét (`#0f172a`), các thẻ tương phản cao, không có chữ trắng chìm trên nền trắng. | [ ] |
| **7.2** | **Chế độ Tối (Phòng Lab)** | Bấm chuyển lại sang biểu tượng Mặt Trăng. | Giao diện chuyển sang Cyber Dark (`#090d16`), các viền neon và hiệu ứng phát sáng mờ êm dịu mắt. | [ ] |
| **7.3** | **Bật / Tắt âm thanh** | Bấm vào biểu tượng **Loa** 🔊 trên Navbar để tắt, thử quay vòng quay hoặc bấm nút. Bấm bật lại. | Khi tắt: Tuyệt đối không phát ra âm thanh. Khi bật lại và F5: Trạng thái âm thanh vẫn được ghi nhớ chính xác. | [ ] |
| **7.4** | **Chế độ Trình chiếu TV / Máy Chiếu** | Bấm biểu tượng **Phóng To** ⛶ cạnh nút Loa. | Giao diện chuyển sang **Presentation Mode**: Cỡ chữ tự động tăng to gấp rưỡi (+25%), khoảng cách thoáng hơn để học sinh ngồi bàn cuối lớp 40-50 học sinh vẫn đọc rất rõ. | [ ] |
| **7.5** | **Responsive đa thiết bị** | Bấm `F12` trên bàn phím, bật chế độ xem Mobile / Tablet hoặc co kéo cửa sổ trình duyệt từ to xuống nhỏ. | Thanh menu chuyển sang thanh cuộn ngang mượt mà, bố cục tự động co từ 4 cột xuống 2 cột và 1 cột, không bị tràn màn hình (horizontal overflow). | [ ] |

---

## 🏁 TỔNG KẾT TIÊU CHUẨN NGHIỆM THU
* Nếu tất cả các mục trên đều đạt dấu tick `[x]`, nền tảng **EduHub** đã đạt **100% độ hoàn thiện thực tế**, sẵn sàng phục vụ giảng dạy tại lớp học và triển khai chính thức trên Vercel!
