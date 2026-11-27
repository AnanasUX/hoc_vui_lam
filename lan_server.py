"""Zero-dependency Wi-Fi / LAN Classroom Multiplayer Server for Học Thông Minh.

Serves static files from `web/` and provides a real-time Room API (HTTP + SSE)
so teachers and students on the same Wi-Fi subnet can play quizzes together.
"""

from __future__ import annotations

import json
import mimetypes
import queue
import random
import socket
import threading
import time
import urllib.parse
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

HOST = "0.0.0.0"
PORT = 8765
WEB_DIR = Path(__file__).parent / "web"
QUIZ_BANKS_PATH = WEB_DIR / "data" / "quiz_banks.json"


def detect_lan_ip() -> str:
    """Detect the local Wi-Fi / LAN IPv4 address of this machine."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            if ip and not ip.startswith("127."):
                return ip
    except OSError:
        pass
    try:
        hostname = socket.gethostname()
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if not ip.startswith("127."):
                return ip
    except OSError:
        pass
    return "127.0.0.1"


def load_quiz_banks() -> dict[str, dict[str, Any]]:
    data = json.loads(QUIZ_BANKS_PATH.read_text(encoding="utf-8"))
    return {b["id"]: b for b in data.get("banks", [])}


class RoomManager:
    """Thread-safe in-memory manager for classroom Wi-Fi game rooms."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._rooms: dict[str, dict[str, Any]] = {}
        self._banks = load_quiz_banks()

    def _gen_code(self) -> str:
        for _ in range(50):
            code = str(random.randint(1000, 9999))
            if code not in self._rooms:
                return code
        return str(int(time.time()) % 9000 + 1000)

    def _public_room(self, room: dict[str, Any]) -> dict[str, Any]:
        q_idx = room["q_index"]
        questions = room["bank"]["questions"]
        current_q = None
        if room["status"] in ("question", "reveal") and 0 <= q_idx < len(questions):
            raw_q = questions[q_idx]
            current_q = {
                "index": q_idx,
                "total": len(questions),
                "q": raw_q["q"],
                "opts": raw_q["opts"],
                "ans": raw_q["ans"] if room["status"] == "reveal" else None,
                "exp": raw_q.get("exp", "") if room["status"] == "reveal" else "",
            }

        players_sorted = sorted(
            room["players"].values(),
            key=lambda p: (-p["score"], p["joined_at"]),
        )
        return {
            "code": room["code"],
            "host_name": room["host_name"],
            "bank_id": room["bank"]["id"],
            "bank_title": room["bank"]["title"],
            "total_questions": len(questions),
            "time_per_q": room["time_per_q"],
            "status": room["status"],
            "q_index": q_idx,
            "q_started_at": room["q_started_at"],
            "answered_count": len(room["answered_in_round"]),
            "current_question": current_q,
            "players": [
                {
                    "id": p["id"],
                    "name": p["name"],
                    "avatar": p["avatar"],
                    "score": p["score"],
                    "streak": p["streak"],
                    "answered": p["id"] in room["answered_in_round"],
                }
                for p in players_sorted
            ],
        }

    def _broadcast(self, room: dict[str, Any]) -> None:
        payload = json.dumps(self._public_room(room), ensure_ascii=False)
        dead: list[queue.Queue[str]] = []
        for q in room["subscribers"]:
            try:
                q.put_nowait(payload)
            except queue.Full:
                dead.append(q)
        for q in dead:
            room["subscribers"].discard(q)

    def list_rooms(self) -> list[dict[str, Any]]:
        with self._lock:
            return [
                {
                    "code": r["code"],
                    "host_name": r["host_name"],
                    "bank_title": r["bank"]["title"],
                    "status": r["status"],
                    "player_count": len(r["players"]),
                }
                for r in self._rooms.values()
                if r["status"] != "finished"
            ]

    def create_room(self, host_name: str, bank_id: str, time_per_q: int = 20) -> dict[str, Any]:
        with self._lock:
            bank = self._banks.get(bank_id) or next(iter(self._banks.values()))
            code = self._gen_code()
            host_token = f"h_{random.randint(100000, 999999)}"
            room = {
                "code": code,
                "host_token": host_token,
                "host_name": (host_name or "Giáo viên").strip()[:40],
                "bank": bank,
                "time_per_q": max(8, min(60, int(time_per_q))),
                "status": "lobby",  # lobby | question | reveal | finished
                "q_index": -1,
                "q_started_at": 0.0,
                "answered_in_round": set(),
                "players": {},
                "subscribers": set(),
            }
            self._rooms[code] = room
            return {"code": code, "host_token": host_token, "room": self._public_room(room)}

    def get_room(self, code: str) -> dict[str, Any] | None:
        with self._lock:
            r = self._rooms.get(code)
            return self._public_room(r) if r else None

    def subscribe(self, code: str) -> queue.Queue[str] | None:
        with self._lock:
            r = self._rooms.get(code)
            if not r:
                return None
            q: queue.Queue[str] = queue.Queue(maxsize=32)
            r["subscribers"].add(q)
            q.put_nowait(json.dumps(self._public_room(r), ensure_ascii=False))
            return q

    def unsubscribe(self, code: str, q: queue.Queue[str]) -> None:
        with self._lock:
            r = self._rooms.get(code)
            if r:
                r["subscribers"].discard(q)

    def join_room(self, code: str, player_name: str, avatar: str = "🦊") -> dict[str, Any] | None:
        with self._lock:
            r = self._rooms.get(code)
            if not r:
                return None
            pid = f"p_{random.randint(100000, 999999)}"
            r["players"][pid] = {
                "id": pid,
                "name": (player_name or "Học sinh").strip()[:30],
                "avatar": (avatar or "🦊")[:4],
                "score": 0,
                "streak": 0,
                "joined_at": time.time(),
            }
            self._broadcast(r)
            return {"player_id": pid, "room": self._public_room(r)}

    def start_or_next(self, code: str, host_token: str, action: str) -> tuple[bool, dict[str, Any] | str]:
        with self._lock:
            r = self._rooms.get(code)
            if not r:
                return False, "Phòng không tồn tại"
            if r["host_token"] != host_token:
                return False, "Không có quyền điều khiển phòng"

            total = len(r["bank"]["questions"])
            if action == "reveal":
                r["status"] = "reveal"
            elif action in ("start", "next"):
                next_idx = 0 if action == "start" else r["q_index"] + 1
                if next_idx >= total:
                    r["status"] = "finished"
                else:
                    r["q_index"] = next_idx
                    r["status"] = "question"
                    r["q_started_at"] = time.time()
                    r["answered_in_round"] = set()
            self._broadcast(r)
            return True, self._public_room(r)

    def submit_answer(self, code: str, player_id: str, q_index: int, choice: int) -> tuple[bool, dict[str, Any] | str]:
        with self._lock:
            r = self._rooms.get(code)
            if not r:
                return False, "Phòng không tồn tại"
            p = r["players"].get(player_id)
            if not p:
                return False, "Người chơi không tồn tại"
            if r["status"] != "question" or r["q_index"] != q_index:
                return False, "Câu hỏi đã đóng"
            if player_id in r["answered_in_round"]:
                return False, "Bạn đã trả lời câu này rồi"

            r["answered_in_round"].add(player_id)
            correct_idx = r["bank"]["questions"][q_index]["ans"]
            is_correct = choice == correct_idx
            gained = 0
            if is_correct:
                elapsed = max(0.0, time.time() - r["q_started_at"])
                ratio = max(0.0, 1.0 - elapsed / r["time_per_q"])
                gained = 500 + int(500 * ratio)
                p["score"] += gained
                p["streak"] += 1
            else:
                p["streak"] = 0

            # Auto-reveal if all players in room have answered
            if r["players"] and len(r["answered_in_round"]) >= len(r["players"]):
                r["status"] = "reveal"

            self._broadcast(r)
            return True, {"correct": is_correct, "gained": gained, "room": self._public_room(r)}


ROOMS = RoomManager()


class ClassroomHandler(SimpleHTTPRequestHandler):
    """Serves `web/` static files and `/api/...` classroom LAN endpoints."""

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def log_message(self, format: str, *args: Any) -> None:
        # Keep console output clean and readable for teachers
        pass

    def _send_json(self, data: Any, status: int = 200) -> None:
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(length) if length > 0 else b"{}"
        return json.loads(raw.decode("utf-8"))

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/info":
            ip = detect_lan_ip()
            self._send_json(
                {
                    "mode": "lan",
                    "lan_ip": ip,
                    "port": PORT,
                    "lan_url": f"http://{ip}:{PORT}",
                }
            )
            return

        if path == "/api/rooms":
            self._send_json({"rooms": ROOMS.list_rooms()})
            return

        if path.startswith("/api/rooms/"):
            parts = path.strip("/").split("/")
            if len(parts) == 3:
                room = ROOMS.get_room(parts[2])
                if not room:
                    self._send_json({"error": "Không tìm thấy phòng"}, 404)
                else:
                    self._send_json({"room": room})
                return
            if len(parts) == 4 and parts[3] == "events":
                code = parts[2]
                sub = ROOMS.subscribe(code)
                if not sub:
                    self._send_json({"error": "Không tìm thấy phòng"}, 404)
                    return
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", "text/event-stream; charset=utf-8")
                self.send_header("Cache-Control", "no-cache")
                self.send_header("Connection", "keep-alive")
                self.end_headers()
                try:
                    while True:
                        try:
                            msg = sub.get(timeout=15)
                            self.wfile.write(f"data: {msg}\n\n".encode("utf-8"))
                            self.wfile.flush()
                        except queue.Empty:
                            self.wfile.write(b": keepalive\n\n")
                            self.wfile.flush()
                except (BrokenPipeError, ConnectionResetError, OSError):
                    pass
                finally:
                    ROOMS.unsubscribe(code, sub)
                return

        super().do_GET()

    def do_POST(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        data = self._read_json()

        if path == "/api/rooms":
            res = ROOMS.create_room(
                data.get("host_name", "Giáo viên"),
                data.get("bank_id", "general-easy"),
                data.get("time_per_q", 20),
            )
            self._send_json(res, 201)
            return

        if path.startswith("/api/rooms/"):
            parts = path.strip("/").split("/")
            if len(parts) == 4:
                code, action = parts[2], parts[3]
                if action == "join":
                    res = ROOMS.join_room(code, data.get("player_name", "Học sinh"), data.get("avatar", "🦊"))
                    if not res:
                        self._send_json({"error": "Mã phòng không tồn tại"}, 404)
                    else:
                        self._send_json(res)
                    return
                if action in ("start", "next", "reveal"):
                    ok, out = ROOMS.start_or_next(code, data.get("host_token", ""), action)
                    self._send_json({"room": out} if ok else {"error": out}, 200 if ok else 400)
                    return
                if action == "answer":
                    ok, out = ROOMS.submit_answer(
                        code,
                        data.get("player_id", ""),
                        int(data.get("q_index", -1)),
                        int(data.get("choice", -1)),
                    )
                    self._send_json(out if ok else {"error": out}, 200 if ok else 400)
                    return

        self._send_json({"error": "Endpoint không hợp lệ"}, 404)


def main() -> None:
    mimetypes.add_type("font/woff2", ".woff2")
    ip = detect_lan_ip()
    server = ThreadingHTTPServer((HOST, PORT), ClassroomHandler)
    print("=" * 60)
    print("  HOC THONG MINH - MAY CHU LOP HOC WI-FI (LAN)")
    print("=" * 60)
    print(f"  May giao vien : http://localhost:{PORT}/room.html")
    print(f"  Hoc sinh Wi-Fi: http://{ip}:{PORT}/room.html")
    print("  (Cac thiet bi chung mang Wi-Fi mo link tren de choi cung nhau)")
    print("  Nhan Ctrl+C de dung may chu.")
    print("=" * 60)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nDa dung may chu.")
        server.server_close()


if __name__ == "__main__":
    main()
