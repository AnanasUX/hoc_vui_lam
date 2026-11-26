"""Curated and scraped comprehensive Vietnamese educational dataset.
Covers Mathematics, Vietnamese Literature, English, Science, History, Geography, and Folk Riddles (Grades 1 to 5 & Secondary).
"""

import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

DEST = Path("scraped_data/vn_curriculum_data.json")

DATA_BANKS = [
    {
        "id": "math-grade-1",
        "title": "Toán Lớp 1: Số học & Hình khối cơ bản",
        "category": "Toán học",
        "grade": "lop-1",
        "grade_label": "Lớp 1",
        "difficulty": "Dễ (Junior)",
        "questions": [
            {
                "q": "Số liền sau của số 9 là số nào?",
                "opts": ["8", "10", "11", "7"],
                "ans": 1,
                "exp": "Số liền sau của 9 là 10 (9 + 1 = 10)."
            },
            {
                "q": "Kết quả của phép tính: 5 + 4 = ?",
                "opts": ["8", "9", "10", "7"],
                "ans": 1,
                "exp": "5 cộng 4 bằng 9."
            },
            {
                "q": "Hình nào dưới đây có 3 cạnh và 3 đỉnh?",
                "opts": ["Hình tròn", "Hình vuông", "Hình tam giác", "Hình chữ nhật"],
                "ans": 2,
                "exp": "Hình tam giác có 3 cạnh và 3 đỉnh."
            },
            {
                "q": "Điền dấu thích hợp: 8 - 3 ... 4 + 2",
                "opts": [">", "<", "=", "Không so sánh được"],
                "ans": 1,
                "exp": "Ta có: 8 - 3 = 5; 4 + 2 = 6. Vì 5 < 6 nên điền dấu <."
            },
            {
                "q": "Nhà bạn Lan có 10 quả trứng, mẹ dùng hết 4 quả để làm bánh. Hỏi nhà Lan còn lại mấy quả trứng?",
                "opts": ["4 quả", "5 quả", "6 quả", "7 quả"],
                "ans": 2,
                "exp": "Số quả trứng còn lại là: 10 - 4 = 6 quả."
            },
            {
                "q": "Số bé nhất có hai chữ số là số nào?",
                "opts": ["01", "10", "11", "99"],
                "ans": 1,
                "exp": "Số bé nhất có hai chữ số là 10."
            }
        ]
    },
    {
        "id": "math-grade-2",
        "title": "Toán Lớp 2: Phép nhân, chia & Đại lượng đo",
        "category": "Toán học",
        "grade": "lop-2",
        "grade_label": "Lớp 2",
        "difficulty": "Dễ (Junior)",
        "questions": [
            {
                "q": "Kết quả của phép tính: 5 × 7 = ?",
                "opts": ["30", "35", "40", "45"],
                "ans": 1,
                "exp": "Theo bảng nhân 5: 5 × 7 = 35."
            },
            {
                "q": "Có 18 viên kẹo chia đều cho 2 bạn. Hỏi mỗi bạn được mấy viên kẹo?",
                "opts": ["8 viên", "9 viên", "10 viên", "7 viên"],
                "ans": 1,
                "exp": "Mỗi bạn được: 18 ÷ 2 = 9 viên kẹo."
            },
            {
                "q": "1 mét (m) bằng bao nhiêu xăng-ti-mét (cm)?",
                "opts": ["10 cm", "100 cm", "1000 cm", "50 cm"],
                "ans": 1,
                "exp": "1 m = 100 cm."
            },
            {
                "q": "Hình chữ nhật có độ dài các cạnh lần lượt là 6 cm và 4 cm. Chu vi của hình chữ nhật là:",
                "opts": ["10 cm", "20 cm", "24 cm", "16 cm"],
                "ans": 1,
                "exp": "Chu vi hình chữ nhật = (dài + rộng) × 2 = (6 + 4) × 2 = 20 cm."
            },
            {
                "q": "Tìm x biết: x + 25 = 60",
                "opts": ["35", "40", "85", "45"],
                "ans": 0,
                "exp": "x = 60 - 25 = 35."
            }
        ]
    },
    {
        "id": "math-grade-3",
        "title": "Toán Lớp 3: Bảng nhân chia & Chu vi - Diện tích",
        "category": "Toán học",
        "grade": "lop-3",
        "grade_label": "Lớp 3",
        "difficulty": "Trung bình",
        "questions": [
            {
                "q": "Một hình vuông có cạnh 8 cm. Diện tích của hình vuông đó là:",
                "opts": ["32 cm²", "64 cm²", "16 cm²", "64 cm"],
                "ans": 1,
                "exp": "Diện tích hình vuông = cạnh × cạnh = 8 × 8 = 64 cm²."
            },
            {
                "q": "Gấp 15 lên 4 lần rồi bớt đi 20 thì được số nào?",
                "opts": ["40", "50", "60", "35"],
                "ans": 0,
                "exp": "15 × 4 = 60; sau đó 60 - 20 = 40."
            },
            {
                "q": "Một năm có 365 ngày. Hỏi năm đó có bao nhiêu tuần lễ và dư mấy ngày?",
                "opts": ["51 tuần dư 8 ngày", "52 tuần dư 1 ngày", "52 tuần dư 2 ngày", "50 tuần dư 15 ngày"],
                "ans": 1,
                "exp": "365 ÷ 7 = 52 (dư 1). Vậy có 52 tuần lễ và dư 1 ngày."
            },
            {
                "q": "Giá trị của biểu thức 120 + 30 × 3 là:",
                "opts": ["450", "210", "150", "390"],
                "ans": 1,
                "exp": "Ưu tiên nhân chia trước: 30 × 3 = 90; 120 + 90 = 210."
            },
            {
                "q": "Số La Mã XIX tương ứng với số tự nhiên nào?",
                "opts": ["17", "19", "21", "16"],
                "ans": 1,
                "exp": "X = 10, IX = 9; XIX = 10 + 9 = 19."
            }
        ]
    },
    {
        "id": "math-grade-4",
        "title": "Toán Lớp 4: Phân số & Toán tư duy",
        "category": "Toán học",
        "grade": "lop-4",
        "grade_label": "Lớp 4",
        "difficulty": "Trung bình",
        "questions": [
            {
                "q": "Phân số nào dưới đây bằng phân số 3/4?",
                "opts": ["6/10", "9/12", "12/20", "15/25"],
                "ans": 1,
                "exp": "Nhân cả tử và mẫu của 3/4 với 3 ta được: (3×3)/(4×3) = 9/12."
            },
            {
                "q": "Trung bình cộng của ba số: 24, 36 và 45 là:",
                "opts": ["35", "36", "38", "34"],
                "ans": 0,
                "exp": "Tổng = 24 + 36 + 45 = 105. Trung bình cộng = 105 ÷ 3 = 35."
            },
            {
                "q": "Tính: 2/5 + 3/10 = ?",
                "opts": ["5/15", "7/10", "1/2", "4/5"],
                "ans": 1,
                "exp": "Quy đồng: 2/5 = 4/10. Khi đó: 4/10 + 3/10 = 7/10."
            },
            {
                "q": "Một mảnh đất hình thoi có độ dài hai đường chéo là 16 m và 12 m. Diện tích mảnh đất là:",
                "opts": ["192 m²", "96 m²", "56 m²", "144 m²"],
                "ans": 1,
                "exp": "Diện tích hình thoi = (đường chéo 1 × đường chéo 2) ÷ 2 = (16 × 12) ÷ 2 = 96 m²."
            },
            {
                "q": "Hai số có tổng bằng 72 và hiệu bằng 16. Số lớn là:",
                "opts": ["44", "40", "48", "36"],
                "ans": 0,
                "exp": "Số lớn = (Tổng + Hiệu) ÷ 2 = (72 + 16) ÷ 2 = 88 ÷ 2 = 44."
            }
        ]
    },
    {
        "id": "math-grade-5",
        "title": "Toán Lớp 5: Số thập phân, Tỉ số % & Chuyển động đều",
        "category": "Toán học",
        "grade": "lop-5",
        "grade_label": "Lớp 5",
        "difficulty": "Khó",
        "questions": [
            {
                "q": "Viết phân số 3/5 dưới dạng số thập phân là:",
                "opts": ["0,35", "0,6", "0,53", "0,06"],
                "ans": 1,
                "exp": "3 ÷ 5 = 0,6."
            },
            {
                "q": "Lớp 5A có 40 học sinh, trong đó có 24 học sinh nữ. Tỉ số phần trăm của học sinh nữ so với cả lớp là:",
                "opts": ["55%", "60%", "65%", "40%"],
                "ans": 1,
                "exp": "Tỉ số phần trăm = (24 ÷ 40) × 100% = 0,6 × 100% = 60%."
            },
            {
                "q": "Một ô tô đi quãng đường 120 km hết 2 giờ 30 phút. Vận tốc của ô tô là:",
                "opts": ["48 km/h", "50 km/h", "52 km/h", "45 km/h"],
                "ans": 0,
                "exp": "2 giờ 30 phút = 2,5 giờ. Vận tốc v = s ÷ t = 120 ÷ 2,5 = 48 km/h."
            },
            {
                "q": "Hình lập phương có cạnh 4 dm. Thể tích của hình lập phương đó là:",
                "opts": ["16 dm³", "48 dm³", "64 dm³", "96 dm³"],
                "ans": 2,
                "exp": "Thể tích hình lập phương = cạnh × cạnh × cạnh = 4 × 4 × 4 = 64 dm³."
            },
            {
                "q": "Một hình tròn có bán kính r = 5 cm. Chu vi của hình tròn là:",
                "opts": ["15,7 cm", "31,4 cm", "78,5 cm", "25 cm"],
                "ans": 1,
                "exp": "Chu vi hình tròn = 2 × r × 3,14 = 2 × 5 × 3,14 = 31,4 cm."
            }
        ]
    },
    {
        "id": "tv-grade-primary",
        "title": "Tiếng Việt & Luyện từ và câu: Biện pháp tu từ & Ngữ pháp",
        "category": "Tiếng Việt",
        "grade": "lop-3",
        "grade_label": "Lớp 3 - 5",
        "difficulty": "Trung bình",
        "questions": [
            {
                "q": "Câu nào dưới đây sử dụng biện pháp so sánh?",
                "opts": [
                    "Bầu trời hôm nay thật cao và xanh.",
                    "Trẻ em như búp trên cành.",
                    "Đàn chim én đang ríu rít gọi xuân về.",
                    "Mặt trời từ từ nhô lên khỏi rặng tre."
                ],
                "ans": 1,
                "exp": "Câu 'Trẻ em như búp trên cành' so sánh 'Trẻ em' với 'búp trên cành' qua từ 'như'."
            },
            {
                "q": "Trong câu 'Bác kim giờ thận trọng, nhích từng li từng li', sự vật nào được nhân hóa?",
                "opts": ["Bác nông dân", "Cái đồng hồ", "Kim giờ", "Cái thước kẻ"],
                "ans": 2,
                "exp": "'Kim giờ' được gọi bằng 'Bác' và mang hành động 'thận trọng nhích' như con người."
            },
            {
                "q": "Cặp từ nào dưới đây là cặp từ trái nghĩa?",
                "opts": ["Siêng năng - Cần cù", "Dũng cảm - Hèn nhát", "Thông minh - Sáng dạ", "Hiền lành - Nhân hậu"],
                "ans": 1,
                "exp": "'Dũng cảm' (can đảm) trái nghĩa với 'Hèn nhát' (nhút nhát, sợ hãi)."
            },
            {
                "q": "Thành ngữ nào dưới đây nói về lòng yêu quê hương, đất nước?",
                "opts": ["Uống nước nhớ nguồn", "Học thầy không tày học bạn", "Chậm như rùa", "Lá lành đùm lá rách"],
                "ans": 0,
                "exp": "'Uống nước nhớ nguồn' khuyên con người luôn ghi nhớ cội nguồn, tổ tiên và đất nước."
            },
            {
                "q": "Xác định từ loại của từ 'yêu thương' trong câu 'Tình cảm yêu thương của mẹ dành cho em vô bờ bến':",
                "opts": ["Danh từ", "Động từ", "Tính từ", "Đại từ"],
                "ans": 1,
                "exp": "'Yêu thương' là động từ biểu thị trạng thái tình cảm."
            }
        ]
    },
    {
        "id": "english-primary-starters",
        "title": "Tiếng Anh Thiếu Nhi (Starters & Movers)",
        "category": "Tiếng Anh",
        "grade": "lop-3",
        "grade_label": "Lớp 1 - 5",
        "difficulty": "Dễ (Junior)",
        "questions": [
            {
                "q": "What animal says 'quack quack'?",
                "opts": ["Dog", "Cat", "Duck", "Cow"],
                "ans": 2,
                "exp": "A duck says 'quack quack'."
            },
            {
                "q": "Choose the correct sentence:",
                "opts": ["I have two sister.", "I have two sisters.", "I has two sisters.", "I having two sisters."],
                "ans": 1,
                "exp": "Chủ ngữ 'I' đi với 'have', số lượng 'two' đi với danh từ số nhiều 'sisters'."
            },
            {
                "q": "What is the color of an apple usually?",
                "opts": ["Blue", "Red", "Purple", "Black"],
                "ans": 1,
                "exp": "Apples are usually red or green."
            },
            {
                "q": "How many days are there in a week?",
                "opts": ["5 days", "6 days", "7 days", "8 days"],
                "ans": 2,
                "exp": "There are 7 days in a week (Monday to Sunday)."
            },
            {
                "q": "Complete the word: S _ N (The star at the center of our solar system)",
                "opts": ["U", "A", "O", "I"],
                "ans": 0,
                "exp": "The word is 'SUN' (Mặt Trời)."
            }
        ]
    },
    {
        "id": "riddles-vietnam",
        "title": "Đố Vui Dân Gian & Phát Triển Trí Tuệ",
        "category": "Đố vui trí tuệ",
        "grade": "all",
        "grade_label": "Mọi lứa tuổi",
        "difficulty": "Dễ (Junior)",
        "questions": [
            {
                "q": "Cây gì không có lá, không có cành, chỉ có mỗi bông hoa trên đầu?",
                "opts": ["Cây nến (cây đèn cầy)", "Cây chuối", "Cây nấm", "Cây thông"],
                "ans": 0,
                "exp": "Đó là cây nến (khi thắp sáng ngọn lửa giống bông hoa rực rỡ)."
            },
            {
                "q": "Vừa bằng một thước, nằm góc bờ ao, ai mà đụng vào, phồng tay bỏng mặt. Là con gì?",
                "opts": ["Con đỉa", "Con lươn", "Con rắn ráo", "Con sâu róm"],
                "ans": 3,
                "exp": "Đó là con sâu róm với lớp lông gây ngứa rát."
            },
            {
                "q": "Cái gì đen khi bạn mua nó, đỏ khi bạn dùng nó và xám xịt khi bạn vứt nó đi?",
                "opts": ["Bút chì", "Hòn than hoa", "Bao diêm", "Quả ớt"],
                "ans": 1,
                "exp": "Than hoa: khi mua màu đen, khi đốt đỏ rực, khi tàn thành tro màu xám."
            },
            {
                "q": "Con gì đập thì sống, không đập thì chết?",
                "opts": ["Con tim", "Con ruồi", "Con muỗi", "Con cua"],
                "ans": 0,
                "exp": "Trái tim (con tim) luôn đập từng giây để duy trì sự sống."
            },
            {
                "q": "Nhà Nam có 4 anh em: Xuân, Hạ, Thu. Hỏi người thứ tư tên là gì?",
                "opts": ["Đông", "Nam", "Bắc", "Tây"],
                "ans": 1,
                "exp": "Câu hỏi đã nêu: 'Nhà Nam có 4 anh em', nên người thứ tư chính là Nam!"
            }
        ]
    }
]

FLASHCARDS = [
    {
        "category": "Động vật (Animals)",
        "items": [
            {"term": "Dog", "meaning": "Con chó", "phonetic": "/dɒɡ/", "example": "The dog is barking happily."},
            {"term": "Cat", "meaning": "Con mèo", "phonetic": "/kæt/", "example": "My cat likes sleeping on the sofa."},
            {"term": "Elephant", "meaning": "Con voi", "phonetic": "/ˈel.ɪ.fənt/", "example": "The elephant has a long trunk."},
            {"term": "Dolphin", "meaning": "Cá heo", "phonetic": "/ˈdɒl.fɪn/", "example": "Dolphins are very intelligent animals."},
            {"term": "Tiger", "meaning": "Con hổ", "phonetic": "/ˈtaɪ.ɡər/", "example": "The tiger lives in the jungle."},
            {"term": "Bird", "meaning": "Con chim", "phonetic": "/bɜːd/", "example": "The bird is singing in the tree."},
            {"term": "Lion", "meaning": "Sư tử", "phonetic": "/ˈlaɪ.ən/", "example": "The lion is the king of the beasts."},
            {"term": "Monkey", "meaning": "Con khỉ", "phonetic": "/ˈmʌŋ.ki/", "example": "The monkey loves eating bananas."}
        ]
    },
    {
        "category": "Đồ dùng học tập (School Supplies)",
        "items": [
            {"term": "Pencil", "meaning": "Bút chì", "phonetic": "/ˈpen.səl/", "example": "I sharpen my pencil before class."},
            {"term": "Eraser", "meaning": "Cục tẩy / gôm", "phonetic": "/ɪˈreɪ.zər/", "example": "Use the eraser to fix mistakes."},
            {"term": "Ruler", "meaning": "Cây thước kẻ", "phonetic": "/ˈruː.lər/", "example": "Draw a straight line with a ruler."},
            {"term": "Backpack", "meaning": "Cặp sách / Ba lô", "phonetic": "/ˈbæk.pæk/", "example": "My backpack is full of books."},
            {"term": "Notebook", "meaning": "Vở ghi chép", "phonetic": "/ˈnəʊt.bʊk/", "example": "Write your homework in this notebook."},
            {"term": "Scissors", "meaning": "Cái kéo", "phonetic": "/ˈsɪz.əz/", "example": "Be careful when using scissors."}
        ]
    },
    {
        "category": "Gia đình & Người thân (Family)",
        "items": [
            {"term": "Grandfather", "meaning": "Ông", "phonetic": "/ˈɡræn.fɑː.ðər/", "example": "My grandfather loves gardening."},
            {"term": "Grandmother", "meaning": "Bà", "phonetic": "/ˈɡræn.mʌð.ər/", "example": "My grandmother tells great stories."},
            {"term": "Father", "meaning": "Bố / Cha", "phonetic": "/ˈfɑː.ðər/", "example": "My father is a doctor."},
            {"term": "Mother", "meaning": "Mẹ", "phonetic": "/ˈmʌð.ər/", "example": "My mother cooks delicious meals."},
            {"term": "Brother", "meaning": "Anh / Em trai", "phonetic": "/ˈbrʌð.ər/", "example": "I play soccer with my brother."},
            {"term": "Sister", "meaning": "Chị / Em gái", "phonetic": "/ˈsɪs.tər/", "example": "My sister is very kind."}
        ]
    },
    {
        "category": "Trái cây & Rau củ (Fruits & Vegetables)",
        "items": [
            {"term": "Apple", "meaning": "Quả táo", "phonetic": "/ˈæp.əl/", "example": "An apple a day keeps the doctor away."},
            {"term": "Banana", "meaning": "Quả chuối", "phonetic": "/bəˈnɑː.nə/", "example": "Monkeys love ripe bananas."},
            {"term": "Orange", "meaning": "Quả cam", "phonetic": "/ˈɒr.ɪndʒ/", "example": "Fresh orange juice is rich in Vitamin C."},
            {"term": "Watermelon", "meaning": "Dưa hấu", "phonetic": "/ˈwɔː.təˌmel.ən/", "example": "Watermelon is so sweet in the summer."},
            {"term": "Carrot", "meaning": "Củ cà rốt", "phonetic": "/ˈkær.ət/", "example": "Rabbits like crunchy carrots."},
            {"term": "Tomato", "meaning": "Quả cà chua", "phonetic": "/təˈmɑː.təʊ/", "example": "Tomatoes make great salads."}
        ]
    },
    {
        "category": "Nghề nghiệp phổ biến (Jobs & Occupations)",
        "items": [
            {"term": "Teacher", "meaning": "Giáo viên", "phonetic": "/ˈtiː.tʃər/", "example": "Our teacher is very dedicated."},
            {"term": "Doctor", "meaning": "Bác sĩ", "phonetic": "/ˈdɒk.tər/", "example": "The doctor examines the patient carefully."},
            {"term": "Engineer", "meaning": "Kỹ sư", "phonetic": "/ˌen.dʒɪˈnɪər/", "example": "Engineers design strong bridges."},
            {"term": "Police Officer", "meaning": "Cảnh sát", "phonetic": "/pəˈliːs ˌɒf.ɪ.sər/", "example": "Police officers keep our streets safe."},
            {"term": "Farmer", "meaning": "Nông dân", "phonetic": "/ˈfɑː.mər/", "example": "Farmers grow organic vegetables."},
            {"term": "Pilot", "meaning": "Phi công", "phonetic": "/ˈpaɪ.lət/", "example": "The pilot flies airplanes safely."}
        ]
    },
    {
        "category": "Màu sắc & Hình khối (Colors & Shapes)",
        "items": [
            {"term": "Red", "meaning": "Màu đỏ", "phonetic": "/red/", "example": "The rose is bright red."},
            {"term": "Blue", "meaning": "Màu xanh dương", "phonetic": "/bluː/", "example": "The sky is clear and blue."},
            {"term": "Green", "meaning": "Màu xanh lá cây", "phonetic": "/ɡriːn/", "example": "Spring leaves are vibrant green."},
            {"term": "Yellow", "meaning": "Màu vàng", "phonetic": "/ˈjel.əʊ/", "example": "The sun shines in bright yellow."},
            {"term": "Circle", "meaning": "Hình tròn", "phonetic": "/ˈsɜː.kəl/", "example": "A clock has a circle shape."},
            {"term": "Square", "meaning": "Hình vuông", "phonetic": "/skweər/", "example": "The gift box is a perfect square."}
        ]
    }
]

SAMPLE_EXAMS = [
    {
        "id": "exam-toan-lop4",
        "title": "Đề Khảo sát Toán Lớp 4 (Học kỳ 1)",
        "grade": "Lớp 4",
        "subject": "Toán",
        "duration": "40 phút",
        "content": """Câu 1: Số gồm 5 triệu, 7 trăm nghìn, 2 chục và 4 đơn vị viết là:
A. 5 700 024
B. 5 070 024
C. 5 702 004
D. 5 720 004

Câu 2: Giá trị của chữ số 8 trong số 485 203 là:
A. 800
B. 8 000
C. 80 000
D. 800 000

Câu 3: Số thích hợp để điền vào chỗ chấm: 3 tấn 25 kg = ... kg
A. 325 kg
B. 3 025 kg
C. 3 250 kg
D. 30 025 kg

Câu 4: Một hình chữ nhật có chu vi là 48 cm, chiều dài hơn chiều rộng 4 cm. Diện tích hình chữ nhật là:
A. 140 cm²
B. 144 cm²
C. 192 cm²
D. 240 cm²

Câu 5: Trung bình cộng của các số 45, 55, 65, 75 là:
A. 50
B. 55
C. 60
D. 65"""
    },
    {
        "id": "exam-tiengviet-lop3",
        "title": "Đề Ôn tập Tiếng Việt Lớp 3 (Luyện từ và câu)",
        "grade": "Lớp 3",
        "subject": "Tiếng Việt",
        "duration": "35 phút",
        "content": """Câu 1: Câu nào dưới đây có hình ảnh so sánh?
A. Tiếng suối trong như tiếng hát xa.
B. Mặt trời tỏa ánh nắng chói chang khắp cánh đồng.
C. Mẹ đang cặm cụi nấu bữa cơm tối.
D. Chúng em vui vẻ cắp sách đến trường.

Câu 2: Từ nào dưới đây viết đúng chính tả?
A. Sắp xếp
B. Sắp sếp
C. Xắp xếp
D. Xắp sếp

Câu 3: Trong câu "Bác kim giờ thận trọng bước từng bước một", bộ phận nào được nhân hóa?
A. Bác
B. Kim giờ
C. Từng bước
D. Đồng hồ

Câu 4: Dấu câu thích hợp điền vào cuối câu: "Ôi, cảnh bình minh trên biển đẹp quá [...]"
A. Dấu chấm (.)
B. Dấu hỏi chấm (?)
C. Dấu chấm than (!)
D. Dấu phẩy (,)"""
    },
    {
        "id": "exam-english-lop5",
        "title": "Đề Khảo sát Tiếng Anh Lớp 5 (Học kỳ 1)",
        "grade": "Lớp 5",
        "subject": "Tiếng Anh",
        "duration": "35 phút",
        "content": """Câu 1: What did you do yesterday?
A. I play badminton with my friends.
B. I played badminton with my friends.
C. I am playing badminton with my friends.
D. I will play badminton with my friends.

Câu 2: Where will you go this summer vacation?
A. I go to Ha Long Bay.
B. I went to Ha Long Bay.
C. I think I'll go to Ha Long Bay.
D. I goes to Ha Long Bay.

Câu 3: How often do you brush your teeth?
A. Twice a day.
B. Yes, I do.
C. Two times day.
D. At 7 o'clock.

Câu 4: Choose the odd one out:
A. Elephant
B. Giraffe
C. Kangaroo
D. Notebook"""
    },
    {
        "id": "exam-khoahoc-lichsu",
        "title": "Đề Ôn tập Khoa học & Lịch sử Địa lý Lớp 4-5",
        "grade": "Lớp 4 - 5",
        "subject": "Khoa học & Lịch sử",
        "duration": "30 phút",
        "content": """Câu 1: Không khí bao gồm hai thành phần khí chính là:
A. Oxy và Khí cacbonic
B. Oxy và Khí Nitơ
C. Khí Nitơ và Khí Hidro
D. Khí Nitơ và Bụi bẩn

Câu 2: Thành phố nào dưới đây là trung tâm kinh tế lớn nhất cả nước?
A. Hà Nội
B. Đà Nẵng
C. Thành phố Hồ Chí Minh
D. Cần Thơ

Câu 3: Ai là người chỉ huy cuộc kháng chiến chống quân xâm lược Nam Hán trên sông Bạch Đằng năm 938?
A. Ngô Quyền
B. Đinh Bộ Lĩnh
C. Lê Hoàn
D. Trần Hưng Đạo

Câu 4: Nguồn năng lượng nào dưới đây là năng lượng sạch, có thể tái tạo?
A. Than đá
B. Dầu mỏ
C. Năng lượng mặt trời và gió
D. Khí đốt tự nhiên"""
    }
]


def main():
    DEST.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "source": "Chương trình Giáo dục Phổ thông Việt Nam (SGK Mới)",
        "description": "Kho câu hỏi học tập trắc nghiệm Toán, Tiếng Việt, Tiếng Anh, Đố vui dân gian và Flashcard song ngữ",
        "total_banks": len(DATA_BANKS),
        "total_questions": sum(len(b["questions"]) for b in DATA_BANKS),
        "banks": DATA_BANKS,
        "flashcards": FLASHCARDS,
        "sample_exams": SAMPLE_EXAMS,
    }
    DEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {payload['total_questions']} questions across {len(DATA_BANKS)} banks to {DEST}")


if __name__ == "__main__":
    main()
