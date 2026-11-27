const AVATARS = ["🦊", "🐼", "🦁", "🐸", "🐯", "🐨", "🐰", "🦄"];

const state = {
  lanMode: false,
  lanUrl: window.location.origin,
  banks: [],
  role: null, // "host" | "player"
  code: null,
  hostToken: null,
  playerId: null,
  selectedAvatar: AVATARS[0],
  chosenIdx: null,
  lastQIdx: -1,
  es: null,
  pollTimer: null,
  clockTimer: null,
  room: null,
};

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2200);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function initTheme() {
  const saved = localStorage.getItem("htm_theme") || "light";
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  const btn = document.getElementById("themeToggleBtn");
  btn.textContent = saved === "dark" ? "☀️" : "🌙";
  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("htm_theme", next);
    btn.textContent = next === "dark" ? "☀️" : "🌙";
  });
}

async function detectServer() {
  const banner = document.getElementById("lanBanner");
  try {
    const r = await fetch("/api/info", { cache: "no-store" });
    if (!r.ok) throw new Error("not lan");
    const info = await r.json();
    if (info.mode === "lan") {
      state.lanMode = true;
      state.lanUrl = info.lan_url;
      banner.innerHTML = `
        <div>🟢 <strong>Máy chủ Wi-Fi Lớp học đang bật</strong> • Link cho học sinh: <code>${info.lan_url}/room.html</code></div>
        <button class="btn" id="copyLanBtn" style="padding:5px 12px;font-size:0.82rem;">📋 Sao chép link Wi-Fi</button>
      `;
      document.getElementById("copyLanBtn").addEventListener("click", () => {
        navigator.clipboard?.writeText(`${info.lan_url}/room.html`);
        showToast("Đã sao chép link Wi-Fi lớp học!");
      });
      return;
    }
  } catch {}
  state.lanMode = false;
  banner.innerHTML = `
    <div>🟡 <strong>Chưa bật máy chủ Wi-Fi LAN</strong> — Để các điện thoại/máy tính chung Wi-Fi chơi cùng nhau, hãy chạy <code>python lan_server.py</code> (hoặc mở <code>Chay_Lop_Hoc_WiFi.bat</code>).</div>
  `;
}

async function refreshOpenRooms() {
  const box = document.getElementById("openRoomsList");
  if (!box || !state.lanMode) return;
  try {
    const r = await fetch("/api/rooms", { cache: "no-store" });
    const data = await r.json();
    const rooms = data.rooms || [];
    if (!rooms.length) {
      box.innerHTML = `<p style="color:var(--muted);font-size:0.86rem;margin:0;">Chưa có phòng nào đang mở trên Wi-Fi này.</p>`;
      return;
    }
    box.innerHTML = rooms
      .map(
        (rm) => `
      <div class="lb-row">
        <div>
          <strong>Phòng ${rm.code}</strong> — ${escapeHtml(rm.bank_title)}<br>
          <small style="color:var(--muted);">GV: ${escapeHtml(rm.host_name)} • ${rm.player_count} học sinh</small>
        </div>
        <button class="btn btn-primary quick-join-btn" data-code="${rm.code}" style="padding:6px 12px;font-size:0.82rem;">Vào ngay</button>
      </div>`
      )
      .join("");
    box.querySelectorAll(".quick-join-btn").forEach((b) => {
      b.addEventListener("click", () => {
        document.getElementById("joinCode").value = b.dataset.code;
        document.getElementById("joinBtn").click();
      });
    });
  } catch {}
}

function renderEntry() {
  const stage = document.getElementById("roomStage");
  const urlCode = new URLSearchParams(window.location.search).get("room") || "";

  stage.innerHTML = `
    <div class="room-split">
      <section class="room-box">
        <h2 style="margin-top:0;">👩‍🏫 Giáo viên: Tạo phòng lớp học</h2>
        <div class="field"><label>Tên giáo viên / Chủ phòng</label><input id="hostName" value="Cô Lan" /></div>
        <div class="field"><label>Chọn bộ câu hỏi (${state.banks.length} bộ)</label>
          <select id="bankSelect">
            ${state.banks.map((b) => `<option value="${b.id}">${escapeHtml(b.title)} (${b.questions.length} câu)</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Thời gian mỗi câu</label>
          <select id="timeSelect">
            <option value="15">15 giây</option>
            <option value="20" selected>20 giây</option>
            <option value="30">30 giây</option>
          </select>
        </div>
        <button class="btn btn-primary" id="createRoomBtn" style="width:100%;">🚀 Tạo phòng Wi-Fi ngay</button>
      </section>

      <section class="room-box">
        <h2 style="margin-top:0;">🎒 Học sinh: Tham gia cùng Wi-Fi</h2>
        <div class="field"><label>Tên của bạn</label><input id="playerName" placeholder="Ví dụ: Minh An" value="Học sinh 1" /></div>
        <div class="field"><label>Chọn nhân vật</label>
          <div class="avatar-row" id="avatarRow">
            ${AVATARS.map((a, i) => `<button type="button" class="avatar-btn ${i === 0 ? "active" : ""}" data-av="${a}">${a}</button>`).join("")}
          </div>
        </div>
        <div class="field"><label>Mã phòng (4 số)</label><input id="joinCode" placeholder="Ví dụ: 4829" value="${escapeHtml(urlCode)}" maxlength="4" /></div>
        <button class="btn btn-primary" id="joinBtn" style="width:100%;margin-bottom:16px;">🎮 Vào phòng chơi</button>

        <h4 style="margin:0 0 8px;font-size:0.88rem;color:var(--muted);">📡 Phòng đang mở trên cùng Wi-Fi:</h4>
        <div id="openRoomsList"><p style="color:var(--muted);font-size:0.86rem;margin:0;">Đang quét...</p></div>
      </section>
    </div>
  `;

  document.querySelectorAll("#avatarRow .avatar-btn").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll("#avatarRow .avatar-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.selectedAvatar = b.dataset.av;
    });
  });

  document.getElementById("createRoomBtn").addEventListener("click", async () => {
    if (!state.lanMode) {
      showToast("Hãy chạy `python lan_server.py` để tạo phòng Wi-Fi!");
      return;
    }
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host_name: document.getElementById("hostName").value,
        bank_id: document.getElementById("bankSelect").value,
        time_per_q: parseInt(document.getElementById("timeSelect").value, 10),
      }),
    });
    const data = await res.json();
    state.role = "host";
    state.code = data.code;
    state.hostToken = data.host_token;
    state.room = data.room;
    subscribeRoom(data.code);
    renderRoom();
  });

  document.getElementById("joinBtn").addEventListener("click", async () => {
    if (!state.lanMode) {
      showToast("Hãy chạy `python lan_server.py` trên máy chủ lớp học!");
      return;
    }
    const code = document.getElementById("joinCode").value.trim();
    if (!code) {
      showToast("Vui lòng nhập mã phòng 4 số");
      return;
    }
    const res = await fetch(`/api/rooms/${encodeURIComponent(code)}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_name: document.getElementById("playerName").value,
        avatar: state.selectedAvatar,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Không vào được phòng");
      return;
    }
    state.role = "player";
    state.code = code;
    state.playerId = data.player_id;
    state.room = data.room;
    subscribeRoom(code);
    renderRoom();
  });

  refreshOpenRooms();
}

function subscribeRoom(code) {
  if (state.es) state.es.close();
  clearInterval(state.pollTimer);
  state.es = new EventSource(`/api/rooms/${encodeURIComponent(code)}/events`);
  state.es.onmessage = (ev) => {
    try {
      const next = JSON.parse(ev.data);
      if (next.q_index !== state.lastQIdx) {
        state.lastQIdx = next.q_index;
        state.chosenIdx = null;
      }
      state.room = next;
      renderRoom();
    } catch {}
  };
  state.es.onerror = () => {
    // Fallback polling if SSE drops
    if (!state.pollTimer) {
      state.pollTimer = setInterval(async () => {
        try {
          const r = await fetch(`/api/rooms/${encodeURIComponent(code)}`, { cache: "no-store" });
          const d = await r.json();
          if (d.room) {
            state.room = d.room;
            renderRoom();
          }
        } catch {}
      }, 1500);
    }
  };
}

async function hostAction(action) {
  await fetch(`/api/rooms/${encodeURIComponent(state.code)}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host_token: state.hostToken }),
  });
}

async function submitAnswer(choice) {
  if (state.chosenIdx !== null || state.role !== "player") return;
  state.chosenIdx = choice;
  const res = await fetch(`/api/rooms/${encodeURIComponent(state.code)}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player_id: state.playerId,
      q_index: state.room.q_index,
      choice,
    }),
  });
  const data = await res.json();
  if (res.ok) {
    showToast(data.correct ? `✅ Chính xác! +${data.gained} điểm` : "❌ Chưa đúng rồi!");
  }
  renderRoom();
}

function renderRoom() {
  const r = state.room;
  if (!r) return;
  const stage = document.getElementById("roomStage");
  clearInterval(state.clockTimer);

  if (r.status === "lobby") {
    const joinUrl = `${state.lanUrl}/room.html?room=${r.code}`;
    stage.innerHTML = `
      <div class="room-box" style="text-align:center;max-width:760px;margin:0 auto;">
        <div style="color:var(--muted);font-weight:600;">${escapeHtml(r.bank_title)} • ${r.total_questions} câu</div>
        <div class="code-hero">${r.code}</div>
        <div style="font-size:0.9rem;color:var(--muted);margin-bottom:10px;">
          Học sinh chung Wi-Fi mở: <code>${escapeHtml(joinUrl)}</code>
        </div>
        <h3 style="margin:16px 0 6px;">👥 Học sinh đã vào phòng (${r.players.length})</h3>
        <div class="player-pills">
          ${r.players.length ? r.players.map((p) => `<span class="player-pill">${p.avatar} ${escapeHtml(p.name)}</span>`).join("") : `<span style="color:var(--muted);">Đang chờ học sinh tham gia...</span>`}
        </div>
        ${
          state.role === "host"
            ? `<button class="btn btn-primary" id="startGameBtn" style="margin-top:12px;">▶ Bắt đầu trò chơi</button>`
            : `<p style="color:var(--primary);font-weight:700;">⏳ Đang chờ giáo viên (${escapeHtml(r.host_name)}) bắt đầu...</p>`
        }
      </div>
    `;
    const startBtn = document.getElementById("startGameBtn");
    if (startBtn) startBtn.addEventListener("click", () => hostAction("start"));
    return;
  }

  if (r.status === "question" || r.status === "reveal") {
    const cq = r.current_question;
    const isReveal = r.status === "reveal";
    const remainInit = Math.max(0, Math.ceil(r.time_per_q - (Date.now() / 1000 - r.q_started_at)));

    stage.innerHTML = `
      <div class="room-box" style="max-width:820px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <span class="hud-pill">Câu ${cq.index + 1} / ${cq.total}</span>
          <span class="hud-pill" id="roomTimer">${isReveal ? "Đã chốt đáp án" : `⏱️ ${remainInit}s`}</span>
          <span class="hud-pill">Đã trả lời: ${r.answered_count} / ${r.players.length}</span>
        </div>

        <h2 style="margin:16px 0 10px;">${escapeHtml(cq.q)}</h2>

        <div class="kahoot-grid">
          ${cq.opts
            .map((opt, i) => {
              const cls = [
                "k-btn",
                `k${i}`,
                state.chosenIdx === i ? "chosen" : "",
                isReveal && cq.ans === i ? "is-correct" : "",
              ].join(" ");
              const dis = isReveal || state.role !== "player" || state.chosenIdx !== null ? "disabled" : "";
              return `<button class="${cls}" data-i="${i}" ${dis}>${["A", "B", "C", "D"][i]}. ${escapeHtml(opt)}</button>`;
            })
            .join("")}
        </div>

        ${isReveal && cq.exp ? `<div class="explain-box">💡 <strong>Giải thích:</strong> ${escapeHtml(cq.exp)}</div>` : ""}

        ${
          state.role === "host"
            ? `<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px;">
                ${!isReveal ? `<button class="btn" id="revealBtn">👁️ Hiện đáp án</button>` : ""}
                <button class="btn btn-primary" id="nextBtn">${cq.index + 1 < cq.total ? "Câu tiếp theo →" : "Xem tổng kết 🏆"}</button>
              </div>`
            : ""
        }

        <h3 style="margin:20px 0 10px;">🏆 Bảng xếp hạng lớp</h3>
        ${r.players
          .slice(0, 8)
          .map(
            (p, idx) => `
          <div class="lb-row">
            <span>#${idx + 1} ${p.avatar} ${escapeHtml(p.name)} ${p.answered && !isReveal ? "✅" : ""}</span>
            <span>${p.score} điểm</span>
          </div>`
          )
          .join("")}
      </div>
    `;

    stage.querySelectorAll(".k-btn").forEach((b) => {
      b.addEventListener("click", () => submitAnswer(parseInt(b.dataset.i, 10)));
    });
    document.getElementById("revealBtn")?.addEventListener("click", () => hostAction("reveal"));
    document.getElementById("nextBtn")?.addEventListener("click", () => hostAction("next"));

    if (!isReveal) {
      state.clockTimer = setInterval(() => {
        const left = Math.max(0, Math.ceil(r.time_per_q - (Date.now() / 1000 - r.q_started_at)));
        const el = document.getElementById("roomTimer");
        if (el) el.textContent = `⏱️ ${left}s`;
      }, 500);
    }
    return;
  }

  if (r.status === "finished") {
    stage.innerHTML = `
      <div class="room-box" style="max-width:720px;margin:0 auto;text-align:center;">
        <div style="font-size:3rem;">🏆</div>
        <h2 style="margin:6px 0 16px;">Tổng kết lớp học: ${escapeHtml(r.bank_title)}</h2>
        ${r.players
          .map(
            (p, idx) => `
          <div class="lb-row">
            <span>${idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`} ${p.avatar} ${escapeHtml(p.name)}</span>
            <strong>${p.score} điểm</strong>
          </div>`
          )
          .join("")}
        <button class="btn btn-primary" id="newRoomBtn" style="margin-top:18px;">Chơi ván mới</button>
      </div>
    `;
    document.getElementById("newRoomBtn").addEventListener("click", () => {
      state.role = null;
      state.code = null;
      state.room = null;
      renderEntry();
    });
  }
}

async function init() {
  initTheme();
  const [, banksRes] = await Promise.all([
    detectServer(),
    fetch("data/quiz_banks.json").then((r) => r.json()),
  ]);
  state.banks = banksRes.banks || [];
  renderEntry();
}

init();
