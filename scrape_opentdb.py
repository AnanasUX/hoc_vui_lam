"""Scraper to fetch high-quality trivia & educational questions from Open Trivia DB."""

import html
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


DEST = Path("scraped_data/opentdb_data.json")

# Category IDs:
# 9: General Knowledge
# 17: Science & Nature
# 18: Science: Computers
# 19: Science: Mathematics
# 22: Geography
# 23: History
# 27: Animals

CATEGORIES = [
    {"id": 17, "name": "Khoa học & Tự nhiên (Science & Nature)", "cat_slug": "science"},
    {"id": 19, "name": "Toán học & Logic (Mathematics)", "cat_slug": "math"},
    {"id": 22, "name": "Địa lý Thế giới (Geography)", "cat_slug": "geography"},
    {"id": 23, "name": "Lịch sử Thế giới (History)", "cat_slug": "history"},
    {"id": 27, "name": "Động vật & Sinh học (Animals)", "cat_slug": "animals"},
    {"id": 9, "name": "Kiến thức Chung Quốc tế (General Knowledge)", "cat_slug": "general"},
]


def fetch_questions_for_cat(cat_id: int, amount: int = 15) -> list[dict]:
    url = f"https://opentdb.com/api.php?amount={amount}&category={cat_id}&type=multiple"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if data.get("response_code") == 0:
                    results = []
                    for item in data.get("results", []):
                        question_text = html.unescape(item["question"])
                        correct = html.unescape(item["correct_answer"])
                        incorrects = [html.unescape(ans) for ans in item["incorrect_answers"]]
                        
                        options = incorrects + [correct]
                        import random
                        random.shuffle(options)
                        ans_idx = options.index(correct)
                        
                        diff_map = {
                            "easy": "Dễ (Junior)",
                            "medium": "Trung bình",
                            "hard": "Khó",
                        }
                        
                        results.append({
                            "q": question_text,
                            "opts": options,
                            "ans": ans_idx,
                            "difficulty": diff_map.get(item["difficulty"], "Trung bình"),
                            "raw_difficulty": item["difficulty"],
                            "exp": f"Đáp án đúng là: {correct}.",
                            "source": "Open Trivia DB"
                        })
                    return results
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait_sec = 5.5 + attempt * 2
                print(f"  [429 Rate limited] Waiting {wait_sec:.1f}s before retry...")
                time.sleep(wait_sec)
                continue
            else:
                print(f"Error fetching category {cat_id}: {e}")
                break
        except Exception as e:
            print(f"Error fetching category {cat_id}: {e}")
            break
    return []



def main():
    DEST.parent.mkdir(parents=True, exist_ok=True)
    all_banks = []

    print("Fetching questions from Open Trivia DB API...")
    for cat in CATEGORIES:
        print(f"Fetching {cat['name']}...")
        questions = fetch_questions_for_cat(cat["id"], amount=15)
        if questions:
            all_banks.append({
                "id": f"opentdb-{cat['cat_slug']}",
                "title": f"English Trivia: {cat['name']}",
                "category": "Tiếng Anh & Thế giới",
                "sub_category": cat["name"],
                "grade": "thcs-thpt",
                "grade_label": "THCS, THPT & Đại chúng",
                "difficulty": "Đa cấp độ",
                "questions": questions,
            })
            print(f"  -> Acquired {len(questions)} questions")
        time.sleep(5.5)  # OpenTDB rate limit is strict (1 req per 5s)

    payload = {
        "source": "https://opentdb.com",
        "description": "Bộ câu hỏi kiến thức song ngữ & quốc tế từ Open Trivia Database",
        "total_banks": len(all_banks),
        "total_questions": sum(len(b["questions"]) for b in all_banks),
        "banks": all_banks,
    }

    DEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {payload['total_questions']} questions across {len(all_banks)} banks to {DEST}")


if __name__ == "__main__":
    main()
