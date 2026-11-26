"""Scrape public categories, game modes, and sample quiz metadata from culturequizz.com."""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.culturequizz.com"
OUT_PATH = Path("scraped_data/culturequizz_data.json")
TIMEOUT = 20


def get_soup(session: requests.Session, url: str) -> BeautifulSoup:
    resp = session.get(url, timeout=TIMEOUT)
    resp.raise_for_status()
    resp.encoding = "utf-8"
    return BeautifulSoup(resp.text, "html.parser")


def main() -> None:
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        }
    )

    print("1. Fetching culturequizz.com homepage...")
    home = get_soup(session, BASE_URL)
    title = home.title.get_text(strip=True) if home.title else ""
    meta_desc_el = home.find("meta", attrs={"name": "description"})
    meta_desc = meta_desc_el["content"].strip() if meta_desc_el and meta_desc_el.get("content") else ""

    # Extract featured / recent quiz cards on homepage
    featured_quizzes: list[dict[str, str]] = []
    seen_urls: set[str] = set()
    for a in home.select("a[href*='/quiz/']"):
        href = a.get("href", "").strip()
        text = a.get_text(" ", strip=True)
        if not href or len(text) < 8 or href in seen_urls:
            continue
        if href.rstrip("/") == f"{BASE_URL}/quiz" or href.rstrip("/") == "/quiz":
            continue
        seen_urls.add(href)
        full_url = href if href.startswith("http") else f"{BASE_URL}{href}"
        featured_quizzes.append({"title": text[:140], "url": full_url})
        if len(featured_quizzes) >= 30:
            break

    print("2. Fetching categories page (/categories/)...")
    categories: list[dict[str, Any]] = []
    try:
        cat_soup = get_soup(session, f"{BASE_URL}/categories/")
        for a in cat_soup.select("a[href*='/categorie/'], a[href*='/categories/']"):
            href = a.get("href", "").strip()
            name = a.get_text(" ", strip=True)
            if name and href and href != "/categories/":
                categories.append(
                    {
                        "name": name,
                        "url": href if href.startswith("http") else f"{BASE_URL}{href}",
                    }
                )
    except Exception as exc:
        print(f"   Warning fetching categories: {exc}")

    # Deduplicate categories
    dedup_cats: list[dict[str, Any]] = []
    seen_cat_urls: set[str] = set()
    for c in categories:
        if c["url"] not in seen_cat_urls:
            seen_cat_urls.add(c["url"])
            dedup_cats.append(c)

    print("3. Fetching games / modes page (/jeux/)...")
    games: list[dict[str, str]] = []
    try:
        jeux_soup = get_soup(session, f"{BASE_URL}/jeux/")
        seen_g: set[str] = set()
        for a in jeux_soup.select("main a[href], article a[href]"):
            href = a.get("href", "").strip()
            name = a.get_text(" ", strip=True)
            if href and name and len(name) > 2 and href not in seen_g and not href.startswith("#"):
                seen_g.add(href)
                games.append(
                    {
                        "name": name[:120],
                        "url": href if href.startswith("http") else f"{BASE_URL}{href}",
                    }
                )
    except Exception as exc:
        print(f"   Warning fetching /jeux/: {exc}")

    payload = {
        "source_url": BASE_URL,
        "title": title,
        "description": meta_desc,
        "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "difficulties": ["Facile (Junior)", "Moyen", "Difficile", "Extrême"],
        "categories_count": len(dedup_cats),
        "categories": dedup_cats,
        "games_count": len(games),
        "games": games[:40],
        "sample_quizzes_count": len(featured_quizzes),
        "sample_quizzes": featured_quizzes,
    }

    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        f"Done! Saved {OUT_PATH} "
        f"({len(dedup_cats)} categories, {len(games[:40])} games/modes, {len(featured_quizzes)} sample quizzes)."
    )


if __name__ == "__main__":
    main()
