# Học Thông Minh (`hoc_vui_lam`)

Hệ thống công cụ học liệu tương tác & đấu trường Quiz / Mini-Games miễn phí cho thầy cô, phụ huynh và học sinh, chạy 100% trên trình duyệt.

## Cấu trúc dự án
- `web/` — Ứng dụng web tĩnh (HTML/CSS/JS, font **Poppins + Be Vietnam Pro + HP001** cục bộ):
  - `index.html`, `app.js`, `styles.css`: Danh mục 60 công cụ học liệu, lọc theo khối lớp, chủ đề, nhóm, đối tượng, Dark/Light mode, yêu thích (`localStorage`).
  - `tool.html`, `tool.js`: Không gian tạo phiếu A4 & xuất ảnh PNG/PDF bằng `<canvas>` HiDPI (Tập viết chữ chuẩn tiểu học HP001 trên giấy 4 ô ly, Phiếu toán, Trộn đề trắc nghiệm, Vòng quay chia nhóm, Thời khóa biểu, Giấy khen, Khuông nhạc, Sudoku, Tìm từ, Thẻ học từ...).
  - `quiz.html`, `quiz.js`: Đấu trường Trắc nghiệm theo chủ đề & độ khó, Thử thách Thời gian (Chrono Challenge), Tính Nhanh (Le Compte est Bon), Câu hỏi mỗi ngày & hệ thống XP thăng hạng.
- `scraper.py` — Script Python cào dữ liệu & tài nguyên từ `hoclieu.app`.
- `scrape_culturequizz.py` — Script Python cào cấu trúc & chế độ chơi từ `culturequizz.com`.
- `scrape_opentdb.py` — Script cào ngân hàng câu hỏi kiến thức song ngữ & quốc tế từ Open Trivia DB API.
- `scrape_vn_education.py` — Script tạo lập & thu thập kho học liệu chuẩn SGK Việt Nam (Toán 1-5, Tiếng Việt, Tiếng Anh, Đố vui dân gian, Thẻ Flashcards, Đề thi mẫu).
- `enrich_platform.py` — Script chuẩn hóa & tích hợp toàn bộ dữ liệu vào `web/data/`.
- `build_site_data.py` — Script chuyển đổi dữ liệu công cụ sang `web/data/tools.json`.
- `scraped_data/` — Dữ liệu JSON/CSV và tài nguyên đã cào (`hoclieu_data.json`, `opentdb_data.json`, `vn_curriculum_data.json`, `culturequizz_data.json`).

## Chạy cục bộ
```bash
python -m http.server 8765 --directory web
```
Mở trình duyệt tại `http://localhost:8765/`.

