"""Consolidate scraped datasets (VN Curriculum, CultureQuizz, OpenTDB)
into web/data/quiz_banks.json, web/data/flashcards.json, and web/data/sample_exams.json.
"""

import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

DATA_DIR = Path("web/data")
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Base default banks from web/quiz.js to preserve them
BASE_BANKS = [
    {
        "id": "general-easy",
        "title": "Kiến thức chung Tiểu học #1",
        "category": "Kiến thức chung",
        "grade": "all",
        "grade_label": "Tiểu học & Đại chúng",
        "difficulty": "Dễ (Junior)",
        "questions": [
            {"q": "Thủ đô của nước Việt Nam là thành phố nào?", "opts": ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Huế"], "ans": 1, "exp": "Hà Nội là thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam."},
            {"q": "Một năm thường có bao nhiêu ngày?", "opts": ["360 ngày", "364 ngày", "365 ngày", "366 ngày"], "ans": 2, "exp": "Năm thường có 365 ngày; năm nhuận có 366 ngày (tháng 2 có 29 ngày)."},
            {"q": "Hành tinh nào gần Mặt Trời nhất trong Hệ Mặt Trời?", "opts": ["Sao Kim", "Trái Đất", "Sao Thủy", "Sao Hỏa"], "ans": 2, "exp": "Sao Thủy (Mercury) là hành tinh nằm gần Mặt Trời nhất."},
            {"q": "Cây xanh quang hợp cần những yếu tố chính nào?", "opts": ["Ánh sáng, nước, khí CO₂", "Chỉ cần nước", "Bóng tối và khí Nitơ", "Đá và cát"], "ans": 0, "exp": "Cây xanh sử dụng ánh sáng Mặt Trời, nước và khí CO₂ để tạo chất hữu cơ và nhả khí O₂."},
            {"q": "Hình vuông có cạnh 6 cm thì chu vi là bao nhiêu?", "opts": ["12 cm", "18 cm", "24 cm", "36 cm"], "ans": 2, "exp": "Chu vi hình vuông = cạnh × 4 = 6 × 4 = 24 cm."}
        ]
    },
    {
        "id": "science-med",
        "title": "Khoa học & Vũ trụ #1",
        "category": "Khoa học",
        "grade": "lop-4",
        "grade_label": "Lớp 4 - 5 & THCS",
        "difficulty": "Trung bình",
        "questions": [
            {"q": "Nước tinh khiết sôi ở nhiệt độ bao nhiêu độ C (ở áp suất 1 atm)?", "opts": ["80°C", "90°C", "100°C", "120°C"], "ans": 2, "exp": "Ở áp suất tiêu chuẩn 1 atm, nước sôi ở 100°C và đóng băng ở 0°C."},
            {"q": "Bộ phận nào của cơ thể người bơm máu đi khắp cơ thể?", "opts": ["Phổi", "Tim", "Gan", "Dạ dày"], "ans": 1, "exp": "Tim hoạt động như một máy bơm cơ học đưa máu giàu oxy đi nuôi toàn bộ cơ thể."},
            {"q": "Hành tinh nào lớn nhất trong Hệ Mặt Trời?", "opts": ["Sao Thổ", "Sao Mộc", "Sao Thiên Vương", "Trái Đất"], "ans": 1, "exp": "Sao Mộc (Jupiter) là hành tinh khí khổng lồ lớn nhất Hệ Mặt Trời."},
            {"q": "Âm thanh truyền nhanh nhất trong môi trường nào?", "opts": ["Chân không", "Chất khí", "Chất lỏng", "Chất rắn"], "ans": 3, "exp": "Các phân tử trong chất rắn xếp sát nhau nên âm thanh truyền đi nhanh nhất; âm thanh không truyền được trong chân không."},
            {"q": "Nguyên tố hóa học nào chiếm tỷ lệ lớn nhất trong không khí?", "opts": ["Oxy", "Nitơ", "CO₂", "Hydro"], "ans": 1, "exp": "Không khí chứa khoảng 78% khí Nitơ, 21% khí Oxy và 1% các khí khác."}
        ]
    },
    {
        "id": "geo-vn-med",
        "title": "Địa lý & Lịch sử Việt Nam #1",
        "category": "Lịch sử & Địa lý",
        "grade": "lop-4",
        "grade_label": "Lớp 4 - 5 & THCS",
        "difficulty": "Trung bình",
        "questions": [
            {"q": "Đỉnh núi nào cao nhất Việt Nam (Nóc nhà Đông Dương)?", "opts": ["Bà Đen", "Fansipan", "Ngọc Linh", "Bạch Mã"], "ans": 1, "exp": "Đỉnh Fansipan thuộc dãy Hoàng Liên Sơn (Lào Cai) cao 3.147,3 m."},
            {"q": "Vị vua nào đã dời đô từ Hoa Lư về Thăng Long năm 1010?", "opts": ["Đinh Tiên Hoàng", "Lý Thái Tổ", "Trần Nhân Tông", "Lê Lợi"], "ans": 1, "exp": "Năm 1010, vua Lý Thái Tổ ban Chiếu dời đô và đặt tên kinh đô mới là Thăng Long."},
            {"q": "Sông nào dài nhất chảy qua lãnh thổ Việt Nam?", "opts": ["Sông Hồng", "Sông Đà", "Sông Mê Kông (Cửu Long)", "Sông Hương"], "ans": 2, "exp": "Sông Mê Kông có tổng chiều dài ~4.350 km, chảy vào Việt Nam qua đồng bằng sông Cửu Long."},
            {"q": "Vịnh Hạ Long nằm ở tỉnh nào của Việt Nam?", "opts": ["Hải Phòng", "Quảng Ninh", "Thanh Hóa", "Khánh Hòa"], "ans": 1, "exp": "Vịnh Hạ Long thuộc tỉnh Quảng Ninh, được UNESCO công nhận là Di sản Thiên nhiên Thế giới."},
            {"q": "Chiến thắng Điện Biên Phủ diễn ra vào năm nào?", "opts": ["1945", "1954", "1968", "1975"], "ans": 1, "exp": "Chiến thắng lịch sử Điện Biên Phủ diễn ra ngày 7/5/1954."}
        ]
    },
    {
        "id": "english-hard",
        "title": "Tiếng Anh & Toán Tư Duy #1",
        "category": "Toán & Tiếng Anh",
        "grade": "thcs-thpt",
        "grade_label": "THCS & THPT",
        "difficulty": "Khó",
        "questions": [
            {"q": "Chọn từ trái nghĩa với 'Ancient':", "opts": ["Old", "Modern", "Historic", "Classic"], "ans": 1, "exp": "'Ancient' nghĩa là cổ đại; trái nghĩa là 'Modern' (hiện đại)."},
            {"q": "Một tam giác có đáy 12 cm, chiều cao 8 cm. Diện tích là:", "opts": ["96 cm²", "48 cm²", "40 cm²", "24 cm²"], "ans": 1, "exp": "Diện tích tam giác = (đáy × cao) / 2 = (12 × 8) / 2 = 48 cm²."},
            {"q": "Câu nào đúng ngữ pháp tiếng Anh?", "opts": ["She don't like apples.", "She doesn't likes apples.", "She doesn't like apples.", "She not like apples."], "ans": 2, "exp": "Với chủ ngữ ngôi thứ 3 số ít (She), phủ định dùng 'doesn't' + động từ nguyên mẫu 'like'."},
            {"q": "Tìm số tiếp theo của dãy: 2, 6, 12, 20, 30, ...?", "opts": ["38", "40", "42", "44"], "ans": 2, "exp": "Quy luật: 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, số tiếp theo là 6×7 = 42."}
        ]
    }
]

def main():
    quiz_banks = list(BASE_BANKS)

    # 1. Load VN Curriculum Data
    vn_file = Path("scraped_data/vn_curriculum_data.json")
    if vn_file.exists():
        vn_data = json.loads(vn_file.read_text(encoding="utf-8"))
        quiz_banks.extend(vn_data.get("banks", []))
        
        # Save flashcards and sample exams to web/data/
        flashcards = vn_data.get("flashcards", [])
        Path("web/data/flashcards.json").write_text(
            json.dumps({"flashcards": flashcards}, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
        print(f"Saved {len(flashcards)} flashcard categories to web/data/flashcards.json")
        
        sample_exams = vn_data.get("sample_exams", [])
        Path("web/data/sample_exams.json").write_text(
            json.dumps({"sample_exams": sample_exams}, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
        print(f"Saved {len(sample_exams)} sample exams to web/data/sample_exams.json")

    # 2. Load OpenTDB Data
    opentdb_file = Path("scraped_data/opentdb_data.json")
    if opentdb_file.exists():
        opentdb_data = json.loads(opentdb_file.read_text(encoding="utf-8"))
        for bank in opentdb_data.get("banks", []):
            if bank["questions"]:
                quiz_banks.append(bank)
        print(f"Loaded OpenTDB banks: {len(opentdb_data.get('banks', []))}")

    # 3. Load Extra Learning Data (Wikipedia, Idioms, Matching, Sentence, Mock Exams)
    extra_file = Path("scraped_data/extra_learning_data.json")
    if extra_file.exists():
        extra_data = json.loads(extra_file.read_text(encoding="utf-8"))
        if "idioms_quiz_bank" in extra_data:
            quiz_banks.append(extra_data["idioms_quiz_bank"])

        # Save learning games data
        games_payload = {
            "wiki_facts": extra_data.get("wiki_facts", []),
            "proverbs": extra_data.get("proverbs", []),
            "matching_sets": extra_data.get("matching_sets", []),
            "sentence_puzzles": extra_data.get("sentence_puzzles", [])
        }
        Path("web/data/learning_games.json").write_text(
            json.dumps(games_payload, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
        print(f"Saved learning games data ({len(games_payload['matching_sets'])} match sets, {len(games_payload['wiki_facts'])} wiki facts) to web/data/learning_games.json")

        # Save mock exams data
        mock_exams = extra_data.get("mock_exams", [])
        Path("web/data/mock_exams.json").write_text(
            json.dumps({"mock_exams": mock_exams}, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )
        print(f"Saved {len(mock_exams)} mock exams to web/data/mock_exams.json")

    # Standardize and save quiz_banks.json
    total_q = sum(len(b["questions"]) for b in quiz_banks)
    payload = {
        "total_banks": len(quiz_banks),
        "total_questions": total_q,
        "banks": quiz_banks,
    }
    Path("web/data/quiz_banks.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"Successfully consolidated {total_q} questions across {len(quiz_banks)} quiz banks into web/data/quiz_banks.json")


if __name__ == "__main__":
    main()

