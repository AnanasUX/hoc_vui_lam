"""Scraper for https://hoclieu.app/ to extract structured data and static HTML."""

from __future__ import annotations

import csv
import json
import re
import time
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://hoclieu.app"
OUT_DIR = Path("scraped_data")
HTML_DIR = OUT_DIR / "html"
ASSETS_DIR = OUT_DIR / "assets"
TIMEOUT = 20
MAX_WORKERS = 8

AUDIENCE_MAP = {
    "b": "Thầy cô, phụ huynh",
    "t": "Thầy cô",
    "p": "Phụ huynh",
}


def create_session() -> requests.Session:
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
        }
    )
    return session


def fetch_sitemap_urls(session: requests.Session) -> list[str]:
    """Discover all URLs from sitemap-index.xml -> sitemap-*.xml."""
    urls: list[str] = []
    idx_resp = session.get(f"{BASE_URL}/sitemap-index.xml", timeout=TIMEOUT)
    idx_resp.raise_for_status()
    root = ET.fromstring(idx_resp.text)
    sitemap_locs = [el.text.strip() for el in root.iter() if el.tag.endswith("loc") and el.text]

    for sm_url in sitemap_locs:
        sm_resp = session.get(sm_url, timeout=TIMEOUT)
        sm_resp.raise_for_status()
        sm_root = ET.fromstring(sm_resp.text)
        for el in sm_root.iter():
            if el.tag.endswith("loc") and el.text:
                urls.append(el.text.strip())

    return sorted(set(urls))


def url_to_slug(url: str) -> str:
    path = urlparse(url).path.strip("/")
    return path if path else "index"


def parse_style_vars(style_str: str) -> tuple[str, str]:
    bg_match = re.search(r"--bg:\s*([^;]+)", style_str or "")
    sh_match = re.search(r"--sh:\s*([^;]+)", style_str or "")
    return (
        bg_match.group(1).strip() if bg_match else "",
        sh_match.group(1).strip() if sh_match else "",
    )


def parse_homepage(html: str) -> dict[str, Any]:
    """Extract tools, featured list, filters, benefits, and FAQ from homepage HTML."""
    soup = BeautifulSoup(html, "html.parser")

    site_title = soup.title.get_text(strip=True) if soup.title else ""
    meta_desc_tag = soup.find("meta", attrs={"name": "description"})
    meta_desc = meta_desc_tag["content"].strip() if meta_desc_tag and meta_desc_tag.get("content") else ""

    featured_slugs: list[str] = []
    seen_feat: set[str] = set()
    for a in soup.select("#noi-bat a.h-fcard[href]"):
        href = a.get("href", "").strip()
        if href and href not in seen_feat:
            seen_feat.add(href)
            featured_slugs.append(href)

    tools: list[dict[str, Any]] = []
    for card in soup.select("#tgrid .h-card.tool"):
        href = (card.get("data-href") or "").strip()
        link = card.select_one("a.h-link")
        title_el = card.select_one("h3, .h-title, strong")
        if title_el:
            title = title_el.get_text(" ", strip=True)
        elif link:
            title = link.get_text(" ", strip=True).split("|")[0].strip()
        else:
            title = href.strip("/")

        # Extract visible badge texts and description inside the card
        leaf_spans = [
            s.get_text(" ", strip=True)
            for s in card.select("a.h-link span")
            if not s.find("span") and s.get_text(strip=True)
        ]
        grade_label = leaf_spans[0] if len(leaf_spans) >= 1 else ""
        description = leaf_spans[-1] if len(leaf_spans) >= 2 else ""

        bg_color, accent_color = parse_style_vars(card.get("style", ""))
        aud_code = (card.get("data-aud") or "b").strip()
        lops_raw = (card.get("data-lops") or "").strip()

        tools.append(
            {
                "index": int(card.get("data-i", len(tools))),
                "title": title,
                "slug": href.lstrip("/"),
                "path": href,
                "url": f"{BASE_URL}{href}",
                "topic": (card.get("data-topic") or "").strip(),
                "group": (card.get("data-group") or "").strip(),
                "audience_code": aud_code,
                "audience_label": AUDIENCE_MAP.get(aud_code, aud_code),
                "grade_label": grade_label,
                "grades": lops_raw.split() if lops_raw else [],
                "description": description,
                "search_text": (card.get("data-text") or "").strip(),
                "color_bg": bg_color,
                "color_accent": accent_color,
                "featured": href in featured_slugs,
            }
        )

    # Extract FAQ items (<details><summary>...</summary>...</details>)
    faq: list[dict[str, str]] = []
    for det in soup.select("details"):
        q_el = det.select_one("summary")
        if not q_el:
            continue
        question = q_el.get_text(" ", strip=True)
        # Remove summary temporarily in text extraction by collecting sibling text
        answer_parts = []
        for child in det.children:
            if child == q_el:
                continue
            txt = child.get_text(" ", strip=True) if hasattr(child, "get_text") else str(child).strip()
            if txt:
                answer_parts.append(txt)
        faq.append({"question": question, "answer": " ".join(answer_parts)})

    # Extract grade links from nav/menu
    grade_pages: list[dict[str, str]] = []
    seen_grades: set[str] = set()
    for a in soup.select("a[href^='/lop-'], a[href='/thcs-thpt']"):
        href = a.get("href", "").strip()
        label = a.get_text(" ", strip=True)
        if href and href not in seen_grades and label:
            seen_grades.add(href)
            grade_pages.append({"label": label, "path": href, "url": f"{BASE_URL}{href}"})

    # Extract unique topics & groups
    topics = sorted({t["topic"] for t in tools if t["topic"]})
    groups = sorted({t["group"] for t in tools if t["group"]})

    return {
        "site_info": {
            "source_url": BASE_URL,
            "title": site_title,
            "description": meta_desc,
            "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        },
        "featured_paths": featured_slugs,
        "topics": topics,
        "groups": groups,
        "grade_pages": grade_pages,
        "tools": tools,
        "faq": faq,
    }


def download_and_parse_page(url: str) -> dict[str, Any]:
    """Download one page, save its HTML, and extract metadata."""
    session = create_session()
    slug = url_to_slug(url)
    resp = session.get(url, timeout=TIMEOUT)
    resp.raise_for_status()
    resp.encoding = "utf-8"
    html = resp.text

    out_file = HTML_DIR / f"{slug}.html"
    out_file.write_text(html, encoding="utf-8")

    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.get_text(strip=True) if soup.title else ""
    meta_desc_tag = soup.find("meta", attrs={"name": "description"})
    meta_desc = meta_desc_tag["content"].strip() if meta_desc_tag and meta_desc_tag.get("content") else ""
    h1_el = soup.find("h1")
    h1 = h1_el.get_text(" ", strip=True) if h1_el else ""

    # First meaningful paragraph after h1
    lead_text = ""
    if h1_el:
        p = h1_el.find_next("p")
        if p:
            lead_text = p.get_text(" ", strip=True)

    return {
        "url": url,
        "slug": slug,
        "path": "/" if slug == "index" else f"/{slug}",
        "status_code": resp.status_code,
        "html_file": str(out_file).replace("\\", "/"),
        "html_bytes": len(html.encode("utf-8")),
        "title": title,
        "meta_description": meta_desc,
        "h1": h1,
        "lead_text": lead_text,
    }


def extract_asset_paths_from_html(html: str) -> set[str]:
    """Find all static asset paths (CSS, JS, Astro islands, images, fonts) in HTML."""
    paths: set[str] = set()
    for match in re.findall(r'(?:src|href|component-url|renderer-url|data-src)=["\'](/[^"\']+)["\']', html):
        clean = match.split("?")[0].split("#")[0]
        if any(
            clean.startswith("/_astro/")
            or clean.startswith("/mau/")
            or clean.endswith(ext)
            for ext in (".css", ".js", ".svg", ".png", ".webp", ".jpg", ".ico", ".woff2", ".woff", ".json")
        ):
            paths.add(clean)
    return paths


def extract_sub_assets(asset_path: str, content: bytes) -> set[str]:
    """Find nested asset imports inside CSS (url(...)) and JS (from './...')."""
    sub: set[str] = set()
    parent_dir = "/" + "/".join(asset_path.strip("/").split("/")[:-1])
    if parent_dir == "/":
        parent_dir = ""
    text = content.decode("utf-8", errors="ignore")

    if asset_path.endswith(".css"):
        for ref in re.findall(r'url\(["\']?([^"\')]+)["\']?\)', text):
            if ref.startswith("data:") or ref.startswith("http"):
                continue
            if ref.startswith("/"):
                sub.add(ref.split("?")[0])
            else:
                sub.add(f"{parent_dir}/{ref.lstrip('./')}".replace("//", "/"))
    elif asset_path.endswith(".js"):
        for ref in re.findall(r'from\s*["\'](\./[^"\']+\.js)["\']|import\s*\(\s*["\'](\./[^"\']+\.js)["\']\s*\)', text):
            rel = ref[0] or ref[1]
            if rel:
                sub.add(f"{parent_dir}/{rel.lstrip('./')}".replace("//", "/"))
    return sub


def crawl_all_assets(html_files: list[Path]) -> tuple[int, int]:
    """Download all CSS, JS, images, fonts, and Astro bundles recursively."""
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    queue: set[str] = set()
    for hf in html_files:
        queue.update(extract_asset_paths_from_html(hf.read_text(encoding="utf-8")))

    visited: set[str] = set()
    downloaded = 0
    errors = 0

    def fetch_one(path: str) -> tuple[str, bytes | None]:
        sess = create_session()
        r = sess.get(f"{BASE_URL}{path}", timeout=TIMEOUT)
        r.raise_for_status()
        return path, r.content

    while queue - visited:
        batch = sorted(queue - visited)
        visited.update(batch)
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
            futures = {pool.submit(fetch_one, p): p for p in batch}
            for fut in as_completed(futures):
                p = futures[fut]
                try:
                    asset_path, content = fut.result()
                    if content is None:
                        continue
                    dest = ASSETS_DIR / asset_path.lstrip("/")
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    dest.write_bytes(content)
                    downloaded += 1
                    if asset_path.endswith((".css", ".js")):
                        queue.update(extract_sub_assets(asset_path, content))
                except Exception:
                    errors += 1

    return downloaded, errors


def main() -> None:
    HTML_DIR.mkdir(parents=True, exist_ok=True)
    session = create_session()

    print("1. Discovering URLs from sitemap...")
    urls = fetch_sitemap_urls(session)
    print(f"   Found {len(urls)} URLs.")

    print("2. Downloading all static HTML pages...")
    pages: list[dict[str, Any]] = []
    errors: list[dict[str, str]] = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        future_map = {pool.submit(download_and_parse_page, url): url for url in urls}
        for future in as_completed(future_map):
            url = future_map[future]
            try:
                pages.append(future.result())
            except Exception as exc:
                errors.append({"url": url, "error": str(exc)})

    pages.sort(key=lambda p: p["slug"])
    print(f"   Downloaded {len(pages)} pages ({len(errors)} errors).")

    print("3. Downloading all CSS, JS, fonts, images & Astro bundles...")
    html_files = list(HTML_DIR.glob("*.html"))
    asset_ok, asset_err = crawl_all_assets(html_files)
    print(f"   Downloaded {asset_ok} assets ({asset_err} errors).")

    print("4. Parsing homepage catalog & enriching tool metadata...")
    index_html = (HTML_DIR / "index.html").read_text(encoding="utf-8")
    data = parse_homepage(index_html)

    page_by_path = {p["path"]: p for p in pages}
    for tool in data["tools"]:
        p = page_by_path.get(tool["path"])
        if p:
            tool["page_title"] = p["title"]
            tool["meta_description"] = p["meta_description"]
            tool["h1"] = p["h1"]
            tool["lead_text"] = p["lead_text"]
            tool["html_file"] = p["html_file"]

    data["site_info"]["total_pages"] = len(pages)
    data["site_info"]["total_tools"] = len(data["tools"])
    data["pages"] = pages
    data["errors"] = errors

    json_path = OUT_DIR / "hoclieu_data.json"
    json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    csv_path = OUT_DIR / "tools.csv"
    fieldnames = [
        "index",
        "title",
        "slug",
        "url",
        "topic",
        "group",
        "audience_label",
        "grades",
        "featured",
        "description",
        "page_title",
        "meta_description",
        "color_bg",
        "color_accent",
        "html_file",
    ]
    with csv_path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for tool in data["tools"]:
            writer.writerow(
                {
                    "index": tool["index"],
                    "title": tool["title"],
                    "slug": tool["slug"],
                    "url": tool["url"],
                    "topic": tool["topic"],
                    "group": tool["group"],
                    "audience_label": tool["audience_label"],
                    "grades": ", ".join(tool["grades"]),
                    "featured": tool["featured"],
                    "description": tool["description"],
                    "page_title": tool.get("page_title", ""),
                    "meta_description": tool.get("meta_description", ""),
                    "color_bg": tool["color_bg"],
                    "color_accent": tool["color_accent"],
                    "html_file": tool.get("html_file", ""),
                }
            )

    print(f"4. Done! Saved:\n   - {json_path}\n   - {csv_path}\n   - {HTML_DIR}/ ({len(pages)} HTML files)")


if __name__ == "__main__":
    main()
