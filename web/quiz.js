const QUIZ_BANKS = [
  {
    id: "general-easy",
    title: "Kiến thức chung Tiểu học #1",
    category: "Kiến thức chung",
    difficulty: "Dễ (Junior)",
    questions: [
      { q: "Thủ đô của nước Việt Nam là thành phố nào?", opts: ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Huế"], ans: 1, exp: "Hà Nội là thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam." },
      { q: "Một năm thường có bao nhiêu ngày?", opts: ["360 ngày", "364 ngày", "365 ngày", "366 ngày"], ans: 2, exp: "Năm thường có 365 ngày; năm nhuận có 366 ngày (tháng 2 có 29 ngày)." },
      { q: "Hành tinh nào gần Mặt Trời nhất trong Hệ Mặt Trời?", opts: ["Sao Kim", "Trái Đất", "Sao Thủy", "Sao Hỏa"], ans: 2, exp: "Sao Thủy (Mercury) là hành tinh nằm gần Mặt Trời nhất." },
      { q: "Cây xanh quang hợp cần những yếu tố chính nào?", opts: ["Ánh sáng, nước, khí CO₂", "Chỉ cần nước", "Bóng tối và khí Nitơ", "Đá và cát"], ans: 0, exp: "Cây xanh sử dụng ánh sáng Mặt Trời, nước và khí CO₂ để tạo chất hữu cơ và nhả khí O₂." },
      { q: "Hình vuông có cạnh 6 cm thì chu vi là bao nhiêu?", opts: ["12 cm", "18 cm", "24 cm", "36 cm"], ans: 2, exp: "Chu vi hình vuông = cạnh × 4 = 6 × 4 = 24 cm." },
    ],
  },
  {
    id: "science-med",
    title: "Khoa học & Vũ trụ #1",
    category: "Khoa học",
    difficulty: "Trung bình",
    questions: [
      { q: "Nước tinh khiết sôi ở nhiệt độ bao nhiêu độ C (ở áp suất 1 atm)?", opts: ["80°C", "90°C", "100°C", "120°C"], ans: 2, exp: "Ở áp suất tiêu chuẩn 1 atm, nước sôi ở 100°C và đóng băng ở 0°C." },
      { q: "Bộ phận nào của cơ thể người bơm máu đi khắp cơ thể?", opts: ["Phổi", "Tim", "Gan", "Dạ dày"], ans: 1, exp: "Tim hoạt động như một máy bơm cơ học đưa máu giàu oxy đi nuôi toàn bộ cơ thể." },
      { q: "Hành tinh nào lớn nhất trong Hệ Mặt Trời?", opts: ["Sao Thổ", "Sao Mộc", "Sao Thiên Vương", "Trái Đất"], ans: 1, exp: "Sao Mộc (Jupiter) là hành tinh khí khổng lồ lớn nhất Hệ Mặt Trời." },
      { q: "Âm thanh truyền nhanh nhất trong môi trường nào?", opts: ["Chân không", "Chất khí", "Chất lỏng", "Chất rắn"], ans: 3, exp: "Các phân tử trong chất rắn xếp sát nhau nên âm thanh truyền đi nhanh nhất; âm thanh không truyền được trong chân không." },
      { q: "Nguyên tố hóa học nào chiếm tỷ lệ lớn nhất trong không khí?", opts: ["Oxy", "Nitơ", "CO₂", "Hydro"], ans: 1, exp: "Không khí chứa khoảng 78% khí Nitơ, 21% khí Oxy và 1% các khí khác." },
    ],
  },
  {
    id: "geo-vn-med",
    title: "Địa lý & Lịch sử Việt Nam #1",
    category: "Địa lý & Lịch sử",
    difficulty: "Trung bình",
    questions: [
      { q: "Đỉnh núi nào cao nhất Việt Nam (Nóc nhà Đông Dương)?", opts: ["Bà Đen", "Fansipan", "Ngọc Linh", "Bạch Mã"], ans: 1, exp: "Đỉnh Fansipan thuộc dãy Hoàng Liên Sơn (Lào Cai) cao 3.147,3 m." },
      { q: "Vị vua nào đã dời đô từ Hoa Lư về Thăng Long năm 1010?", opts: ["Đinh Tiên Hoàng", "Lý Thái Tổ", "Trần Nhân Tông", "Lê Lợi"], ans: 1, exp: "Năm 1010, vua Lý Thái Tổ ban Chiếu dời đô và đặt tên kinh đô mới là Thăng Long." },
      { q: "Sông nào dài nhất chảy qua lãnh thổ Việt Nam?", opts: ["Sông Hồng", "Sông Đà", "Sông Mê Kông (Cửu Long)", "Sông Hương"], ans: 2, exp: "Sông Mê Kông có tổng chiều dài ~4.350 km, chảy vào Việt Nam qua đồng bằng sông Cửu Long." },
      { q: "Vịnh Hạ Long nằm ở tỉnh nào của Việt Nam?", opts: ["Hải Phòng", "Quảng Ninh", "Thanh Hóa", "Khánh Hòa"], ans: 1, exp: "Vịnh Hạ Long thuộc tỉnh Quảng Ninh, được UNESCO công nhận là Di sản Thiên nhiên Thế giới." },
      { q: "Chiến thắng Điện Biên Phủ diễn ra vào năm nào?", opts: ["1945", "1954", "1968", "1975"], ans: 1, exp: "Chiến thắng lịch sử Điện Biên Phủ diễn ra ngày 7/5/1954." },
    ],
  },
  {
    id: "english-hard",
    title: "Tiếng Anh & Toán Tư Duy #1",
    category: "Tiếng Anh & Toán",
    difficulty: "Khó",
    questions: [
      { q: "Chọn từ trái nghĩa với 'Ancient':", opts: ["Old", "Modern", "Historic", "Classic"], ans: 1, exp: "'Ancient' nghĩa là cổ đại; trái nghĩa là 'Modern' (hiện đại)." },
      { q: "Một tam giác có đáy 12 cm, chiều cao 8 cm. Diện tích là:", opts: ["96 cm²", "48 cm²", "40 cm²", "24 cm²"], ans: 1, exp: "Diện tích tam giác = (đáy × cao) / 2 = (12 × 8) / 2 = 48 cm²." },
      { q: "Câu nào đúng ngữ pháp tiếng Anh?", opts: ["She don't like apples.", "She doesn't likes apples.", "She doesn't like apples.", "She not like apples."], ans: 2, exp: "Với chủ ngữ ngôi thứ 3 số ít (She), phủ định dùng 'doesn't' + động từ nguyên mẫu 'like'." },
      { q: "Tìm số tiếp theo của dãy: 2, 6, 12, 20, 30, ...?", opts: ["38", "40", "42", "44"], ans: 2, exp: "Quy luật: 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, số tiếp theo là 6×7 = 42." },
    ],
  },
];

const CHRONO_CHALLENGES = [
  {
    id: "planets",
    title: "Kể tên 8 hành tinh trong Hệ Mặt Trời",
    duration: 120,
    items: [
      { name: "Sao Thủy", aliases: ["thuy", "mercury"] },
      { name: "Sao Kim", aliases: ["kim", "venus"] },
      { name: "Trái Đất", aliases: ["trai dat", "earth"] },
      { name: "Sao Hỏa", aliases: ["hoa", "mars"] },
      { name: "Sao Mộc", aliases: ["moc", "jupiter"] },
      { name: "Sao Thổ", aliases: ["tho", "saturn"] },
      { name: "Sao Thiên Vương", aliases: ["thien vuong", "uranus"] },
      { name: "Sao Hải Vương", aliases: ["hai vuong", "neptune"] },
    ],
  },
  {
    id: "subjects",
    title: "Kể tên 10 môn học phổ thông quen thuộc",
    duration: 120,
    items: [
      { name: "Toán", aliases: ["toan", "toan hoc"] },
      { name: "Ngữ văn / Tiếng Việt", aliases: ["van", "ngu van", "tieng viet"] },
      { name: "Tiếng Anh", aliases: ["anh", "tieng anh", "ngoai ngu"] },
      { name: "Vật lý", aliases: ["ly", "vat ly", "vat li"] },
      { name: "Hóa học", aliases: ["hoa", "hoa hoc"] },
      { name: "Sinh học", aliases: ["sinh", "sinh hoc"] },
      { name: "Lịch sử", aliases: ["su", "lich su"] },
      { name: "Địa lý", aliases: ["dia", "dia ly", "dia li"] },
      { name: "Tin học", aliases: ["tin", "tin hoc"] },
      { name: "Âm nhạc", aliases: ["nhac", "am nhac"] },
    ],
  },
];

const DAILY_QUESTIONS = [
  { q: "Số nguyên tố chẵn duy nhất là số nào?", opts: ["0", "2", "4", "6"], ans: 1, exp: "Số 2 chỉ chia hết cho 1 và chính nó, là số nguyên tố nhỏ nhất và là số nguyên tố chẵn duy nhất." },
  { q: "Quốc gia nào có diện tích lớn nhất thế giới?", opts: ["Trung Quốc", "Canada", "Hoa Kỳ", "Nga"], ans: 3, exp: "Liên bang Nga có diện tích hơn 17 triệu km², lớn nhất thế giới." },
  { q: "Trong bảng chữ cái tiếng Việt hiện đại có bao nhiêu chữ cái?", opts: ["26", "28", "29", "31"], ans: 2, exp: "Bảng chữ cái tiếng Việt có 29 chữ cái." },
];

const RANKS = [
  { min: 0, label: "🌱 Tân binh" },
  { min: 100, label: "📘 Học giả" },
  { min: 250, label: "🥈 Cao thủ" },
  { min: 500, label: "🎓 Nhà thông thái" },
  { min: 1000, label: "👑 Huyền thoại" },
];

let soundEnabled = true;

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2000);
}

function playTone(ok) {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = ok ? "sine" : "triangle";
    osc.frequency.value = ok ? 660 : 220;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch {}
}

function getProfile() {
  return JSON.parse(localStorage.getItem("htm_quiz_profile") || '{"xp":0,"done":0,"history":[]}');
}

function addXp(amount, label) {
  const p = getProfile();
  p.xp += amount;
  p.done += 1;
  p.history.unshift({ label, xp: amount, at: new Date().toLocaleTimeString("vi-VN") });
  p.history = p.history.slice(0, 10);
  localStorage.setItem("htm_quiz_profile", JSON.stringify(p));
  renderHud();
}

function renderHud() {
  const p = getProfile();
  let rank = RANKS[0].label;
  for (const r of RANKS) {
    if (p.xp >= r.min) rank = r.label;
  }
  document.getElementById("hudRank").textContent = rank;
  document.getElementById("hudXp").textContent = `⚡ ${p.xp} XP`;
  document.getElementById("hudDone").textContent = `✅ ${p.done} lượt chơi`;
}

function initThemeAndSound() {
  const saved = localStorage.getItem("htm_theme") || "light";
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  const tBtn = document.getElementById("themeToggleBtn");
  tBtn.textContent = saved === "dark" ? "☀️" : "🌙";
  tBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("htm_theme", next);
    tBtn.textContent = next === "dark" ? "☀️" : "🌙";
  });

  const sBtn = document.getElementById("soundToggleBtn");
  sBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    sBtn.textContent = soundEnabled ? "🔊" : "🔇";
    showToast(soundEnabled ? "Đã bật âm thanh" : "Đã tắt âm thanh");
  });
}

/* MODE 1: MCQ QUIZ */
function renderMcqHome(stage, autoStartQuiz = null) {
  if (autoStartQuiz) {
    startMcqQuiz(stage, autoStartQuiz);
    return;
  }
  stage.innerHTML = `
    <h2 style="margin-top:0;">🧠 Chọn bộ câu hỏi trắc nghiệm</h2>
    <p style="color:var(--muted);margin-bottom:16px;">Mỗi câu trả lời đúng có giải thích chi tiết và tích lũy điểm XP thăng hạng.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;">
      ${QUIZ_BANKS.map(
        (b) => `
        <div style="border:1px solid var(--border);border-radius:12px;padding:16px;background:var(--surface-2);display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="font-size:0.78rem;font-weight:700;color:var(--primary);margin-bottom:4px;">${b.category} • ${b.difficulty}</div>
            <h3 style="margin:0 0 8px;font-size:1.02rem;">${b.title}</h3>
            <p style="margin:0 0 12px;font-size:0.86rem;color:var(--muted);">${b.questions.length} câu hỏi có giải thích</p>
          </div>
          <button class="btn btn-primary start-quiz-btn" data-id="${b.id}">Bắt đầu Quiz →</button>
        </div>`
      ).join("")}
    </div>
  `;
  stage.querySelectorAll(".start-quiz-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const bank = QUIZ_BANKS.find((b) => b.id === btn.dataset.id);
      if (bank) startMcqQuiz(stage, bank);
    });
  });
}

function startMcqQuiz(stage, bank) {
  let idx = 0;
  let score = 0;
  let selected = null;
  let locked = false;

  function drawQ() {
    if (idx >= bank.questions.length) {
      const pct = Math.round((score / bank.questions.length) * 100);
      const earned = score * 20;
      addXp(earned, `${bank.title} (${pct}%)`);
      stage.innerHTML = `
        <div style="text-align:center;padding:24px 0;">
          <div style="font-size:3rem;">🎉</div>
          <h2 style="margin:8px 0;">Hoàn thành: ${bank.title}</h2>
          <p style="font-size:1.15rem;">Điểm số: <strong>${score} / ${bank.questions.length} (${pct}%)</strong> • Nhận <strong>+${earned} XP</strong></p>
          <div style="display:flex;gap:10px;justify-content:center;margin-top:18px;">
            <button class="btn btn-primary" id="retryBtn">↺ Làm lại</button>
            <button class="btn" id="backListBtn">← Chọn chủ đề khác</button>
          </div>
        </div>
      `;
      document.getElementById("retryBtn").addEventListener("click", () => startMcqQuiz(stage, bank));
      document.getElementById("backListBtn").addEventListener("click", () => renderMcqHome(stage));
      return;
    }

    const q = bank.questions[idx];
    const pct = Math.round(((idx + 1) / bank.questions.length) * 100);
    selected = null;
    locked = false;

    stage.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <span class="hud-pill">CÂU ${idx + 1} / ${bank.questions.length}</span>
        <span style="font-size:0.86rem;color:var(--muted);">${bank.category} • ${bank.difficulty}</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <h3 style="margin:0 0 12px;font-size:1.15rem;">${q.q}</h3>
      <div class="opt-list">
        ${q.opts
          .map(
            (opt, oi) =>
              `<button class="opt-btn" data-oi="${oi}"><strong>${["A", "B", "C", "D"][oi]}.</strong> ${opt}</button>`
          )
          .join("")}
      </div>
      <div id="explainArea"></div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:14px;">
        <button class="btn btn-primary" id="validateBtn" disabled>Kiểm tra ✓</button>
      </div>
    `;

    const optsBtns = stage.querySelectorAll(".opt-btn");
    const valBtn = document.getElementById("validateBtn");

    optsBtns.forEach((b) => {
      b.addEventListener("click", () => {
        if (locked) return;
        optsBtns.forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        selected = parseInt(b.dataset.oi, 10);
        valBtn.disabled = false;
      });
    });

    valBtn.addEventListener("click", () => {
      if (!locked) {
        locked = true;
        optsBtns.forEach((b, oi) => {
          b.disabled = true;
          if (oi === q.ans) b.classList.add("correct");
          else if (oi === selected) b.classList.add("wrong");
        });
        const isOk = selected === q.ans;
        if (isOk) score++;
        playTone(isOk);
        document.getElementById("explainArea").innerHTML = `
          <div class="explain-box">
            <strong>${isOk ? "✅ Chính xác!" : "❌ Chưa đúng!"}</strong> ${q.exp}
          </div>
        `;
        valBtn.textContent = idx + 1 < bank.questions.length ? "Câu tiếp theo →" : "Xem kết quả →";
      } else {
        idx++;
        drawQ();
      }
    });
  }

  drawQ();
}

/* MODE 2: CHRONO CHALLENGE */
let chronoInterval = null;
function renderChrono(stage) {
  clearInterval(chronoInterval);
  let active = CHRONO_CHALLENGES[0];
  let found = new Set();
  let remain = active.duration;
  let paused = false;

  function render() {
    const mins = Math.floor(remain / 60);
    const secs = String(remain % 60).padStart(2, "0");
    stage.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;">
        <div>
          <h2 style="margin:0 0 4px;">⏱️ ${active.title}</h2>
          <span style="font-size:0.86rem;color:var(--muted);">Nhập từng đáp án và nhấn Enter</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="hud-pill" id="chronoScore">Điểm: ${found.size}/${active.items.length}</span>
          <span class="hud-pill" id="chronoClock">${mins}:${secs}</span>
          <button class="btn" id="chronoPause">${paused ? "▶ Tiếp tục" : "⏸ Tạm dừng"}</button>
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-top:14px;">
        <select id="chronoSelect" class="search-input" style="max-width:280px;padding:10px;">
          ${CHRONO_CHALLENGES.map((c) => `<option value="${c.id}" ${c.id === active.id ? "selected" : ""}>${c.title}</option>`).join("")}
        </select>
        <input id="chronoInput" class="search-input" placeholder="Nhập đáp án (ví dụ: Sao Thủy)..." ${paused ? "disabled" : ""} />
      </div>

      <div class="chrono-grid">
        ${active.items
          .map((it, i) => {
            const isFound = found.has(i);
            return `<div class="chrono-slot ${isFound ? "found" : ""}">${i + 1}. ${isFound ? it.name : "…………"}</div>`;
          })
          .join("")}
      </div>
    `;

    document.getElementById("chronoSelect").addEventListener("change", (e) => {
      active = CHRONO_CHALLENGES.find((c) => c.id === e.target.value) || CHRONO_CHALLENGES[0];
      found = new Set();
      remain = active.duration;
      paused = false;
      render();
    });

    document.getElementById("chronoPause").addEventListener("click", () => {
      paused = !paused;
      render();
    });

    const inp = document.getElementById("chronoInput");
    inp.focus();
    inp.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const val = normalize(inp.value);
      if (!val) return;
      const matchIdx = active.items.findIndex((it) =>
        [normalize(it.name), ...it.aliases.map(normalize)].some((al) => al === val || val.includes(al))
      );
      if (matchIdx === -1) {
        playTone(false);
        showToast("Chưa khớp đáp án nào!");
      } else if (found.has(matchIdx)) {
        showToast("Đáp án này đã được ghi nhận rồi!");
      } else {
        found.add(matchIdx);
        playTone(true);
        if (found.size === active.items.length) {
          clearInterval(chronoInterval);
          addXp(50, `Chrono: ${active.title}`);
          showToast("🎉 Hoàn thành xuất sắc! +50 XP");
        }
        render();
      }
      inp.value = "";
    });
  }

  chronoInterval = setInterval(() => {
    if (paused) return;
    if (remain > 0) {
      remain--;
      const clk = document.getElementById("chronoClock");
      if (clk) clk.textContent = `${Math.floor(remain / 60)}:${String(remain % 60).padStart(2, "0")}`;
    } else {
      clearInterval(chronoInterval);
      showToast("⏰ Hết giờ!");
    }
  }, 1000);

  render();
}

/* MODE 3: TÍNH NHANH (LE COMPTE EST BON) */
function renderMath24(stage) {
  clearInterval(chronoInterval);
  const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100];
  let nums = [];
  let target = 0;

  function newPuzzle() {
    nums = Array.from({ length: 6 }, () => pool[Math.floor(Math.random() * pool.length)]);
    target = Math.floor(Math.random() * 400) + 100;
    draw();
  }

  function draw() {
    stage.innerHTML = `
      <div style="text-align:center;">
        <h2 style="margin:0 0 6px;">🧮 Tính Nhanh (Le Compte est Bon)</h2>
        <p style="color:var(--muted);margin:0;">Dùng các số bên dưới kết hợp với +, -, ×, ÷ để đạt đúng số mục tiêu:</p>
        <div style="font-size:2.8rem;font-weight:900;color:var(--primary);margin:14px 0;">🎯 ${target}</div>
        <div class="num-tiles">${nums.map((n) => `<div class="num-tile">${n}</div>`).join("")}</div>
        <div style="display:flex;gap:8px;max-width:480px;margin:16px auto;">
          <input id="m24Expr" class="search-input" placeholder="Ví dụ: (25 + 10) * 7" />
          <button class="btn btn-primary" id="m24Check">Kiểm tra</button>
        </div>
        <div id="m24Res" style="margin-top:10px;font-weight:700;"></div>
        <button class="btn" id="m24New" style="margin-top:14px;">🎲 Đề số mới</button>
      </div>
    `;

    document.getElementById("m24New").addEventListener("click", newPuzzle);
    document.getElementById("m24Check").addEventListener("click", () => {
      const raw = document.getElementById("m24Expr").value.trim();
      if (!/^[0-9+\-*/().\s]+$/.test(raw)) {
        document.getElementById("m24Res").textContent = "⚠️ Chỉ nhập số và phép tính +, -, *, /, ()";
        return;
      }
      try {
        const val = Function(`"use strict"; return (${raw})`)();
        if (val === target) {
          playTone(true);
          addXp(40, `Tính nhanh: ${target}`);
          document.getElementById("m24Res").innerHTML = `<span style="color:#10b981;">🎉 Chính xác! ${raw} = ${target} (+40 XP)</span>`;
        } else {
          playTone(false);
          document.getElementById("m24Res").innerHTML = `<span style="color:#ef4444;">Kết quả là ${val} (chưa bằng ${target})</span>`;
        }
      } catch {
        document.getElementById("m24Res").textContent = "⚠️ Biểu thức không hợp lệ.";
      }
    });
  }

  newPuzzle();
}

/* MODE 4: DAILY QUESTION & LEADERBOARD */
function renderDaily(stage) {
  clearInterval(chronoInterval);
  const dayIdx = Math.floor(Date.now() / 86400000) % DAILY_QUESTIONS.length;
  const dq = DAILY_QUESTIONS[dayIdx];
  const p = getProfile();

  stage.innerHTML = `
    <h2 style="margin-top:0;">🌟 Câu hỏi mỗi ngày (+30 XP)</h2>
    <p style="font-size:1.08rem;font-weight:600;">${dq.q}</p>
    <div class="opt-list">
      ${dq.opts.map((o, i) => `<button class="opt-btn daily-opt" data-i="${i}">${["A", "B", "C", "D"][i]}. ${o}</button>`).join("")}
    </div>
    <div id="dailyExp"></div>
    <hr style="border:none;border-top:1px solid var(--border);margin:24px 0;">
    <h3>🏆 Lịch sử điểm &amp; Xếp hạng cá nhân</h3>
    ${
      p.history.length
        ? `<ul style="padding-left:18px;margin:0;">${p.history.map((h) => `<li><strong>${h.label}</strong> — +${h.xp} XP (${h.at})</li>`).join("")}</ul>`
        : `<p style="color:var(--muted);">Chưa có lượt chơi nào. Hãy hoàn thành một Quiz để tích lũy XP!</p>`
    }
  `;

  stage.querySelectorAll(".daily-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.i, 10);
      stage.querySelectorAll(".daily-opt").forEach((b, bi) => {
        b.disabled = true;
        if (bi === dq.ans) b.classList.add("correct");
        else if (bi === i) b.classList.add("wrong");
      });
      const ok = i === dq.ans;
      playTone(ok);
      if (ok) addXp(30, "Câu hỏi mỗi ngày");
      document.getElementById("dailyExp").innerHTML = `<div class="explain-box"><strong>${ok ? "✅ Chính xác! +30 XP" : "❌ Chưa đúng!"}</strong> ${dq.exp}</div>`;
    });
  });
}

function init() {
  initThemeAndSound();
  renderHud();

  const stage = document.getElementById("quizStage");
  const tabs = document.querySelectorAll("#modeTabs .chip");

  function switchMode(mode) {
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === mode));
    if (mode === "mcq") renderMcqHome(stage);
    else if (mode === "chrono") renderChrono(stage);
    else if (mode === "math24") renderMath24(stage);
    else if (mode === "daily") renderDaily(stage);
  }

  tabs.forEach((t) => t.addEventListener("click", () => switchMode(t.dataset.mode)));

  document.getElementById("randomQuizBtn").addEventListener("click", () => {
    const bank = QUIZ_BANKS[Math.floor(Math.random() * QUIZ_BANKS.length)];
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === "mcq"));
    renderMcqHome(stage, bank);
    showToast(`🎲 Đã chọn: ${bank.title}`);
  });

  switchMode("mcq");
}

init();
