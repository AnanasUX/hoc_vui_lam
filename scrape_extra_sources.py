"""Scraper and content generator for extra educational sources:
1. Wikipedia VN Educational Topics (Science, Geography, History)
2. Vietnamese Idioms & Proverbs (Thành ngữ, Tục ngữ, Ca dao)
3. Matching Pairs & Memory Game Data (Vocabulary, Math formulas, Geography capitals)
4. Sentence Unscramble Puzzles (Ghép câu ngữ pháp)
5. Comprehensive Mock Exams (Đề thi thử chuẩn thang điểm 10 có chấm điểm tự động)
"""

import html
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

DEST_EXTRA = Path("scraped_data/extra_learning_data.json")

# Topics to fetch from Wikipedia VN REST API
WIKI_TOPICS = [
    {"slug": "Hệ_Mặt_Trời", "title": "Hệ Mặt Trời", "category": "Vũ trụ & Thiên văn"},
    {"slug": "Trái_Đất", "title": "Trái Đất", "category": "Địa lý & Hành tinh"},
    {"slug": "Mặt_Trăng", "title": "Mặt Trăng", "category": "Vũ trụ & Thiên văn"},
    {"slug": "Khủng_long", "title": "Khủng Long", "category": "Sinh học cổ đại"},
    {"slug": "Vịnh_Hạ_Long", "title": "Vịnh Hạ Long", "category": "Địa lý Việt Nam"},
    {"slug": "Sông_Mê_Kông", "title": "Sông Mê Kông", "category": "Địa lý & Thủy văn"},
    {"slug": "Chiến_thắng_Bạch_Đằng_(938)", "title": "Chiến thắng Bạch Đằng năm 938", "category": "Lịch sử Việt Nam"},
    {"slug": "Chiến_dịch_Điện_Biên_Phủ", "title": "Chiến dịch Điện Biên Phủ", "category": "Lịch sử Việt Nam"},
    {"slug": "Cây_xanh", "title": "Cây xanh & Quang hợp", "category": "Khoa học Thực vật"},
    {"slug": "Kim_tự_tháp_Ai_Cập", "title": "Kim tự tháp Ai Cập", "category": "Kỳ quan Thế giới"}
]

def fetch_wiki_facts():
    facts = []
    print("Fetching educational topics from Wikipedia...")
    for item in WIKI_TOPICS:
        url = f"https://vi.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(item['slug'])}"
        req = urllib.request.Request(url, headers={"User-Agent": "HocThongMinh/2.0 (contact: admin@hocvui.local)"})
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                extract = data.get("extract", "")
                if extract:
                    facts.append({
                        "title": item["title"],
                        "category": item["category"],
                        "summary": extract,
                        "thumbnail": data.get("thumbnail", {}).get("source", ""),
                        "url": data.get("content_urls", {}).get("desktop", {}).get("page", "")
                    })
                    print(f"  + Retrieved: {item['title']}")
        except Exception as e:
            print(f"  - Failed {item['slug']}: {e}")
        time.sleep(0.5)
    return facts

# 2. Vietnamese Idioms & Proverbs with explanation & quizzes
PROVERBS = [
    {
        "phrase": "Uống nước nhớ nguồn",
        "meaning": "Nhắc nhở con người luôn biết ơn, ghi nhớ công lao của những người đã giúp đỡ, che chở hoặc tạo dựng nên cuộc sống ấm no cho mình.",
        "quiz": {
            "q": "Điền từ còn thiếu vào câu thành ngữ: 'Uống nước nhớ ...'",
            "opts": ["nguồn", "sông", "biển", "suối"],
            "ans": 0,
            "exp": "'Uống nước nhớ nguồn' là truyền thống đạo lý tốt đẹp của dân tộc ta."
        }
    },
    {
        "phrase": "Học thầy không tày học bạn",
        "meaning": "Đề cao tinh thần chủ động học hỏi lẫn nhau từ bạn bè trong cuộc sống và học tập.",
        "quiz": {
            "q": "Điền từ còn thiếu: 'Học ... không tày học bạn'",
            "opts": ["thầy", "sách", "mẹ", "cha"],
            "ans": 0,
            "exp": "Bên cạnh việc nghe thầy cô giảng dạy, việc trao đổi và học hỏi từ bạn bè là rất quan trọng."
        }
    },
    {
        "phrase": "Gần mực thì đen, gần đèn thì rạng",
        "meaning": "Môi trường sống và những người bạn xung quanh có ảnh hưởng rất lớn đến tính cách và đạo đức của một con người.",
        "quiz": {
            "q": "Chọn từ điền vào chỗ chấm: 'Gần mực thì đen, gần ... thì rạng'",
            "opts": ["đèn", "lửa", "nắng", "sao"],
            "ans": 0,
            "exp": "'Gần đèn thì rạng' khuyên ta nên chọn bạn tốt, môi trường lành mạnh để học tập và rèn luyện."
        }
    },
    {
        "phrase": "Ăn quả nhớ kẻ trồng cây",
        "meaning": "Khi được hưởng thành quả tốt đẹp, phải luôn nhớ ơn người đã dày công vun đắp, hy sinh tạo ra nó.",
        "quiz": {
            "q": "Thành ngữ 'Ăn quả nhớ kẻ trồng cây' khuyên chúng ta điều gì?",
            "opts": ["Lòng biết ơn", "Lòng dũng cảm", "Tính tiết kiệm", "Tính cẩn thận"],
            "ans": 0,
            "exp": "Thành ngữ giáo dục lòng biết ơn và sự tri ân thế hệ đi trước."
        }
    },
    {
        "phrase": "Có chí thì nên",
        "meaning": "Người có ý chí kiên định, lòng quyết tâm thì nhất định sẽ đạt được thành công trong cuộc đời.",
        "quiz": {
            "q": "Thành ngữ 'Có chí thì nên' có ý nghĩa tương đương với câu nào?",
            "opts": ["Có công mài sắt, có ngày nên kim", "Đi một ngày đàng, học một sàng khôn", "Học ăn học nói", "Lá lành đùm lá rách"],
            "ans": 0,
            "exp": "Cả hai câu đều ca ngợi sự kiên trì, bền bỉ và ý chí vượt khó."
        }
    },
    {
        "phrase": "Lá lành đùm lá rách",
        "meaning": "Tinh thần nhân ái, cưu mang giúp đỡ lẫn nhau của con người trong hoàn cảnh khó khăn hoạn nạn.",
        "quiz": {
            "q": "Câu 'Lá lành đùm lá rách' thể hiện truyền thống đạo đức nào của dân tộc ta?",
            "opts": ["Tương thân tương ái", "Hiếu thảo", "Cần cù", "Yêu thiên nhiên"],
            "ans": 0,
            "exp": "Truyền thống đùm bọc, giúp đỡ người hoạn nạn khó khăn gọi là tương thân tương ái."
        }
    }
]

# 3. Matching Pairs (Nối từ / Ghép cặp)
MATCHING_SETS = [
    {
        "id": "match-animals-en",
        "title": "Ghép Thú Cưng & Động Vật (Anh - Việt)",
        "category": "Tiếng Anh",
        "pairs": [
            {"left": "Dog", "right": "Con chó"},
            {"left": "Cat", "right": "Con mèo"},
            {"left": "Elephant", "right": "Con voi"},
            {"left": "Tiger", "right": "Con hổ"},
            {"left": "Lion", "right": "Sư tử"},
            {"left": "Monkey", "right": "Con khỉ"},
            {"left": "Rabbit", "right": "Con thỏ"},
            {"left": "Bear", "right": "Con gấu"}
        ]
    },
    {
        "id": "match-math-tables",
        "title": "Ghép Phép Tính Bảng Nhân (Toán Tiểu học)",
        "category": "Toán học",
        "pairs": [
            {"left": "7 × 8", "right": "56"},
            {"left": "9 × 6", "right": "54"},
            {"left": "8 × 6", "right": "48"},
            {"left": "7 × 7", "right": "49"},
            {"left": "9 × 9", "right": "81"},
            {"left": "6 × 7", "right": "42"},
            {"left": "8 × 8", "right": "64"},
            {"left": "9 × 7", "right": "63"}
        ]
    },
    {
        "id": "match-capitals-vn",
        "title": "Địa Danh & Vùng Miền Nổi Tiếng",
        "category": "Địa lý",
        "pairs": [
            {"left": "Vịnh Hạ Long", "right": "Quảng Ninh"},
            {"left": "Cố đô Huế", "right": "Thừa Thiên Huế"},
            {"left": "Đỉnh Fansipan", "right": "Lào Cai"},
            {"left": "Chợ Bến Thành", "right": "TP. Hồ Chí Minh"},
            {"left": "Hồ Gươm (Hoàn Kiếm)", "right": "Hà Nội"},
            {"left": "Bến Nhà Rồng", "right": "TP. Hồ Chí Minh"},
            {"left": "Núi Bà Đen", "right": "Tây Ninh"},
            {"left": "Đảo Phú Quốc", "right": "Kiên Giang"}
        ]
    }
]

# 4. Sentence Unscramble (Ghép câu theo thứ tự)
SENTENCE_PUZZLES = [
    {
        "id": "scramble-1",
        "lang": "vi",
        "title": "Ghép câu Tiếng Việt: Lòng biết ơn",
        "words": ["Chúng", "em", "luôn", "kính", "trọng", "và", "biết", "ơn", "thầy", "cô."],
        "hint": "Bắt đầu bằng từ 'Chúng em'"
    },
    {
        "id": "scramble-2",
        "lang": "vi",
        "title": "Ghép câu Tiếng Việt: Tình yêu quê hương",
        "words": ["Đất", "nước", "Việt", "Nam", "tươi", "đẹp", "và", "giàu", "truyền", "thống."],
        "hint": "Bắt đầu bằng từ 'Đất nước'"
    },
    {
        "id": "scramble-3",
        "lang": "en",
        "title": "Ghép câu Tiếng Anh: Thói quen tốt",
        "words": ["I", "read", "books", "every", "evening", "before", "going", "to", "bed."],
        "hint": "Bắt đầu bằng đại từ 'I'"
    },
    {
        "id": "scramble-4",
        "lang": "en",
        "title": "Ghép câu Tiếng Anh: Thời tiết",
        "words": ["The", "sun", "is", "shining", "brightly", "in", "the", "clear", "blue", "sky."],
        "hint": "Bắt đầu bằng 'The sun'"
    }
]

# 5. Full Standardized Mock Exams (Thang điểm 10)
FULL_MOCK_EXAMS = [
    {
        "id": "mock-toan-hk1-lop5",
        "title": "Đề Khảo Sát Năng Lực Toán Lớp 5 (Học kỳ 1)",
        "grade": "Lớp 5",
        "subject": "Toán học",
        "time_minutes": 35,
        "questions": [
            {
                "id": "q1",
                "q": "Chữ số 7 trong số thập phân 185,274 có giá trị là:",
                "opts": ["7/10", "7/100", "7/1000", "7 đơn vị"],
                "ans": 1,
                "points": 1.0,
                "exp": "Chữ số 7 nằm ở hàng phần trăm nên có giá trị là 7/100."
            },
            {
                "id": "q2",
                "q": "Viết hỗn số 3 và 4/5 thành số thập phân ta được:",
                "opts": ["3,4", "3,8", "3,45", "3,54"],
                "ans": 1,
                "points": 1.0,
                "exp": "4/5 = 0,8. Do đó 3 và 4/5 = 3 + 0,8 = 3,8."
            },
            {
                "id": "q3",
                "q": "Tính: 45,8 + 17,65 = ?",
                "opts": ["63,45", "62,45", "63,145", "63,85"],
                "ans": 0,
                "points": 1.0,
                "exp": "45,80 + 17,65 = 63,45."
            },
            {
                "id": "q4",
                "q": "Một lớp học có 32 học sinh, trong đó có 24 học sinh thích môn Toán. Tỉ số phần trăm của số học sinh thích môn Toán so với cả lớp là:",
                "opts": ["70%", "72%", "75%", "80%"],
                "ans": 2,
                "points": 1.5,
                "exp": "Tỉ số phần trăm = 24 ÷ 32 × 100% = 0,75 × 100% = 75%."
            },
            {
                "id": "q5",
                "q": "Một khu đất hình chữ nhật có chiều dài 80 m, chiều rộng bằng 3/4 chiều dài. Diện tích khu đất đó là:",
                "opts": ["4 800 m²", "4 200 m²", "280 m²", "2 400 m²"],
                "ans": 0,
                "points": 1.5,
                "exp": "Chiều rộng = 80 × 3/4 = 60 m. Diện tích = 80 × 60 = 4 800 m²."
            },
            {
                "id": "q6",
                "q": "Một người đi xe máy trong 2 giờ 15 phút với vận tốc 40 km/h. Quãng đường người đó đi được là:",
                "opts": ["80 km", "85 km", "90 km", "100 km"],
                "ans": 2,
                "points": 1.5,
                "exp": "2 giờ 15 phút = 2,25 giờ. Quãng đường s = v × t = 40 × 2,25 = 90 km."
            },
            {
                "id": "q7",
                "q": "Hình tròn có đường kính d = 6 cm. Diện tích của hình tròn đó là:",
                "opts": ["18,84 cm²", "28,26 cm²", "113,04 cm²", "36 cm²"],
                "ans": 1,
                "points": 1.5,
                "exp": "Bán kính r = 6 ÷ 2 = 3 cm. Diện tích S = r × r × 3,14 = 3 × 3 × 3,14 = 28,26 cm²."
            },
            {
                "id": "q8",
                "q": "Tìm x biết: x × 4,5 = 54",
                "opts": ["10", "12", "14", "15"],
                "ans": 1,
                "points": 1.0,
                "exp": "x = 54 ÷ 4,5 = 12."
            }
        ]
    },
    {
        "id": "mock-tiengviet-hk1-lop4",
        "title": "Đề Khảo Sát Tiếng Việt Lớp 4: Luyện Từ & Câu (Học kỳ 1)",
        "grade": "Lớp 4",
        "subject": "Tiếng Việt",
        "time_minutes": 30,
        "questions": [
            {
                "id": "q1",
                "q": "Từ nào dưới đây là từ ghép tổng hợp?",
                "opts": ["Bánh rán", "Xe đạp", "Nhà cửa", "Cây bàng"],
                "ans": 2,
                "points": 1.0,
                "exp": "'Nhà cửa' bao hàm chỉ chung các loại nhà, thuộc từ ghép tổng hợp."
            },
            {
                "id": "q2",
                "q": "Trong câu: 'Những đóa hoa cúc vàng rực rỡ dưới ánh nắng ban mai', từ nào là tính từ?",
                "opts": ["Những đóa hoa", "Hoa cúc", "Vàng rực rỡ", "Ánh nắng"],
                "ans": 2,
                "points": 1.0,
                "exp": "'Vàng rực rỡ' là từ chỉ màu sắc, đặc điểm nên là tính từ."
            },
            {
                "id": "q3",
                "q": "Câu nào dưới đây sử dụng biện pháp nhân hóa?",
                "opts": [
                    "Bầu trời mùa thu trong vắt và cao vút.",
                    "Chị gió tinh nghịch lướt qua rặng tre xanh.",
                    "Dòng sông uốn lượn như dải lụa mềm mại.",
                    "Các bạn học sinh đang chăm chỉ học bài."
                ],
                "ans": 1,
                "points": 1.5,
                "exp": "'Gió' được gọi là 'Chị' và có hành động 'tinh nghịch lướt qua' giống như con người."
            },
            {
                "id": "q4",
                "q": "Cặp quan hệ từ nào thích hợp điền vào câu: '... trời mưa to ... chúng em vẫn đến lớp đúng giờ'?",
                "opts": [
                    "Vì ... nên ...",
                    "Tuy ... nhưng ...",
                    "Nếu ... thì ...",
                    "Chẳng những ... mà còn ..."
                ],
                "ans": 1,
                "points": 1.5,
                "exp": "Câu biểu thị quan hệ tương phản đối lập nên dùng cặp 'Tuy ... nhưng ...'."
            },
            {
                "id": "q5",
                "q": "Thành ngữ nào dưới đây nói về lòng nhân ái, sự đùm bọc yêu thương con người?",
                "opts": [
                    "Ăn quả nhớ kẻ trồng cây",
                    "Lá lành đùm lá rách",
                    "Học đi đôi với hành",
                    "Có công mài sắt có ngày nên kim"
                ],
                "ans": 1,
                "points": 1.5,
                "exp": "'Lá lành đùm lá rách' nói lên tinh thần đoàn kết, sẻ chia với người gặp hoạn nạn."
            },
            {
                "id": "q6",
                "q": "Dấu hai chấm (:) trong câu sau có tác dụng gì: 'Cô giáo dặn cả lớp: Các em nhớ ôn tập kỹ bài học hôm nay nhé'?",
                "opts": [
                    "Báo hiệu phần giải thích cho bộ phận đứng trước",
                    "Báo hiệu lời nói trực tiếp của nhân vật",
                    "Dùng để liệt kê các sự vật",
                    "Kết thúc một câu kể"
                ],
                "ans": 1,
                "points": 1.5,
                "exp": "Dấu hai chấm dẫn lời nói trực tiếp của cô giáo (thường kết hợp với dấu ngoặc kép hoặc gạch đầu dòng)."
            },
            {
                "id": "q7",
                "q": "Tìm từ đồng nghĩa với từ 'chăm chỉ':",
                "opts": ["Cần cù", "Thật thà", "Hiền lành", "Dũng cảm"],
                "ans": 0,
                "points": 1.0,
                "exp": "'Cần cù', 'siêng năng' là các từ đồng nghĩa với 'chăm chỉ'."
            },
            {
                "id": "q8",
                "q": "Xác định chủ ngữ trong câu: 'Mặt trời từ từ nhô lên sau rặng núi xa xa':",
                "opts": ["Mặt trời", "Mặt trời từ từ", "Nhô lên", "Rặng núi"],
                "ans": 0,
                "points": 1.0,
                "exp": "Bộ phận trả lời cho câu hỏi 'Ai?' hoặc 'Cái gì?' là 'Mặt trời'."
            }
        ]
    }
]

def main():
    DEST_EXTRA.parent.mkdir(parents=True, exist_ok=True)
    wiki_facts = fetch_wiki_facts()

    # Form idioms quiz bank
    idioms_quiz_bank = {
        "id": "proverbs-vn-idioms",
        "title": "Thành Ngữ & Ca Dao Tục Ngữ Việt Nam",
        "category": "Tiếng Việt",
        "grade": "lop-3-5",
        "grade_label": "Lớp 3 - 5 & THCS",
        "difficulty": "Dễ (Junior)",
        "questions": [p["quiz"] for p in PROVERBS]
    }

    payload = {
        "source": "Wikipedia VN, Văn học Dân gian & Chuẩn GDPT Việt Nam",
        "wiki_facts": wiki_facts,
        "proverbs": PROVERBS,
        "idioms_quiz_bank": idioms_quiz_bank,
        "matching_sets": MATCHING_SETS,
        "sentence_puzzles": SENTENCE_PUZZLES,
        "mock_exams": FULL_MOCK_EXAMS,
    }

    DEST_EXTRA.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {len(wiki_facts)} wiki facts, {len(PROVERBS)} proverbs, {len(MATCHING_SETS)} match sets, {len(FULL_MOCK_EXAMS)} mock exams to {DEST_EXTRA}")


if __name__ == "__main__":
    main()
