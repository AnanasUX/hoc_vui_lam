"""Transform scraped hoclieu_data.json into clean frontend data for web/data/tools.json."""

import json
from pathlib import Path

SRC = Path("scraped_data/hoclieu_data.json")
DEST = Path("web/data/tools.json")


def main() -> None:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    DEST.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "brand": "Học Thông Minh",
        "source_reference": data["site_info"]["source_url"],
        "total_tools": len(data["tools"]),
        "topics": data["topics"],
        "groups": data["groups"],
        "grade_pages": data["grade_pages"],
        "faq": data["faq"],
        "tools": [
            {
                "index": t["index"],
                "title": t["title"],
                "slug": t["slug"],
                "topic": t["topic"],
                "group": t["group"],
                "audience_code": t["audience_code"],
                "audience_label": t["audience_label"],
                "grade_label": t.get("grade_label", ""),
                "grades": t["grades"],
                "description": t["description"],
                "lead_text": t.get("lead_text", ""),
                "search_text": t["search_text"],
                "color_bg": t["color_bg"],
                "color_accent": t["color_accent"],
                "featured": t["featured"],
            }
            for t in data["tools"]
        ],
    }

    DEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(payload['tools'])} tools to {DEST}")


if __name__ == "__main__":
    main()
