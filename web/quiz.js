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

let allBanks = [...QUIZ_BANKS];
let mcqFilterCat = "all";
let mcqFilterGrade = "all";
let mcqSearchQuery = "";

async function loadDynamicBanks() {
  try {
    const res = await fetch("data/quiz_banks.json");
    if (res.ok) {
      const data = await res.json();
      if (data && data.banks && data.banks.length) {
        allBanks = data.banks;
      }
    }
  } catch (e) {
    console.warn("Could not load dynamic quiz banks, fallback to defaults", e);
  }
}

/* MODE 1: MCQ QUIZ */
function renderMcqHome(stage, autoStartQuiz = null) {
  if (autoStartQuiz) {
    startMcqQuiz(stage, autoStartQuiz);
    return;
  }

  const categories = [
    { id: "all", label: "Tất cả môn" },
    { id: "Toán học", label: "📐 Toán học" },
    { id: "Tiếng Việt", label: "📖 Tiếng Việt" },
    { id: "Tiếng Anh", label: "🔤 Tiếng Anh" },
    { id: "Khoa học", label: "🔬 Khoa học" },
    { id: "Lịch sử & Địa lý", label: "🗺️ Lịch sử - Địa lý" },
    { id: "Đố vui trí tuệ", label: "💡 Đố vui dân gian" },
    { id: "Tiếng Anh & Thế giới", label: "🌍 English Trivia" },
  ];

  const grades = [
    { id: "all", label: "Mọi khối lớp" },
    { id: "lop-1-2", label: "Lớp 1 - 2" },
    { id: "lop-3-5", label: "Lớp 3 - 5" },
    { id: "thcs-thpt", label: "THCS & Thế giới" },
  ];

  // Filtering
  const qNorm = normalize(mcqSearchQuery);
  const filtered = allBanks.filter((b) => {
    // Category match
    const matchCat =
      mcqFilterCat === "all" ||
      b.category === mcqFilterCat ||
      (mcqFilterCat === "Toán học" && b.category.includes("Toán")) ||
      (mcqFilterCat === "Tiếng Anh" && b.category.includes("Tiếng Anh"));

    // Grade match
    let matchGrade = true;
    if (mcqFilterGrade === "lop-1-2") {
      matchGrade = ["lop-1", "lop-2"].includes(b.grade);
    } else if (mcqFilterGrade === "lop-3-5") {
      matchGrade = ["lop-3", "lop-4", "lop-5"].includes(b.grade);
    } else if (mcqFilterGrade === "thcs-thpt") {
      matchGrade = ["thcs-thpt", "all"].includes(b.grade);
    }

    // Search query match
    const matchSearch =
      !qNorm ||
      normalize(b.title).includes(qNorm) ||
      normalize(b.category).includes(qNorm) ||
      normalize(b.grade_label || "").includes(qNorm);

    return matchCat && matchGrade && matchSearch;
  });

  const totalQuestions = allBanks.reduce((s, b) => s + (b.questions ? b.questions.length : 0), 0);

  stage.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;">
      <div>
        <h2 style="margin:0 0 4px;">🧠 Đấu trường Trắc nghiệm Tri thức</h2>
        <p style="color:var(--muted);margin:0;font-size:0.9rem;">
          ${allBanks.length} ngân hàng câu hỏi • ${totalQuestions} câu trắc nghiệm chuẩn chương trình &amp; quốc tế
        </p>
      </div>
      <button class="btn btn-primary" id="quickMixBtn" style="background:linear-gradient(135deg,#6366f1,#06b6d4);">
        ⚡ Đấu trường Trộn Đề 10 câu
      </button>
    </div>

    <div style="margin-bottom:14px;">
      <input type="search" id="mcqSearchInput" class="search-input" style="width:100%;max-width:480px;padding:9px 14px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface-2);color:var(--text);" placeholder="🔍 Tìm kiếm bài học (ví dụ: Phân số, Lớp 1, Lịch sử, Science...)" value="${escapeHtml(mcqSearchQuery)}" />
    </div>

    <!-- Category Filter Chips -->
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
      ${categories.map((c) => `<button class="chip mcq-cat-chip ${mcqFilterCat === c.id ? "active" : ""}" data-cat="${c.id}">${c.label}</button>`).join("")}
    </div>

    <!-- Grade Filter Chips -->
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;">
      ${grades.map((g) => `<button class="chip mcq-grade-chip ${mcqFilterGrade === g.id ? "active" : ""}" data-grade="${g.id}">${g.label}</button>`).join("")}
    </div>

    ${
      filtered.length === 0
        ? `<div style="text-align:center;padding:36px;color:var(--muted);">
            <div style="font-size:2.5rem;">🔍</div>
            <p>Không tìm thấy bộ câu hỏi nào phù hợp với bộ lọc hiện tại.</p>
            <button class="btn" id="resetMcqFilterBtn">Đặt lại bộ lọc</button>
          </div>`
        : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px;">
            ${filtered
              .map(
                (b) => `
              <div style="border:1px solid var(--border);border-radius:14px;padding:16px;background:var(--surface-2);display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 2px 4px rgba(0,0,0,0.03);">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;">
                    <span style="font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--primary-soft);color:var(--primary);">${escapeHtml(b.category)}</span>
                    <span style="font-size:0.75rem;color:var(--muted);">${escapeHtml(b.grade_label || b.difficulty || "")}</span>
                  </div>
                  <h3 style="margin:0 0 8px;font-size:1.02rem;line-height:1.4;">${escapeHtml(b.title)}</h3>
                  <p style="margin:0 0 14px;font-size:0.86rem;color:var(--muted);">
                    📝 <strong>${b.questions.length} câu hỏi</strong> • Độ khó: <strong>${escapeHtml(b.difficulty)}</strong>
                  </p>
                </div>
                <button class="btn btn-primary start-quiz-btn" data-id="${b.id}" style="width:100%;">Luyện tập ngay →</button>
              </div>`
              )
              .join("")}
          </div>`
    }
  `;

  // Bind Events
  const searchInput = stage.querySelector("#mcqSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      mcqSearchQuery = e.target.value;
      renderMcqHome(stage);
    });
  }

  stage.querySelectorAll(".mcq-cat-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      mcqFilterCat = btn.dataset.cat;
      renderMcqHome(stage);
    });
  });

  stage.querySelectorAll(".mcq-grade-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      mcqFilterGrade = btn.dataset.grade;
      renderMcqHome(stage);
    });
  });

  const resetBtn = stage.querySelector("#resetMcqFilterBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      mcqFilterCat = "all";
      mcqFilterGrade = "all";
      mcqSearchQuery = "";
      renderMcqHome(stage);
    });
  }

  const quickMixBtn = stage.querySelector("#quickMixBtn");
  if (quickMixBtn) {
    quickMixBtn.addEventListener("click", () => {
      // Gather pool of all questions
      const pool = [];
      allBanks.forEach((b) => {
        (b.questions || []).forEach((q) => pool.push({ ...q, bankTitle: b.title }));
      });
      // Pick 10 random
      const shuffledPool = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
      const mixedBank = {
        id: "quick-mix-exam",
        title: "⚡ Đấu Trường Tổng Hợp 10 Câu",
        category: "Đấu trường Đa môn",
        difficulty: "Tổng hợp",
        questions: shuffledPool,
      };
      startMcqQuiz(stage, mixedBank);
      showToast("⚡ Đã khởi tạo Đấu trường Tổng hợp 10 câu!");
    });
  }

  stage.querySelectorAll(".start-quiz-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const bank = allBanks.find((b) => b.id === btn.dataset.id);
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

let learningGamesData = {
  matching_sets: [
    {
      id: "match-animals-en",
      title: "Ghép Thú Cưng & Động Vật (Anh - Việt)",
      category: "Tiếng Anh",
      pairs: [
        { left: "Dog", right: "Con chó" },
        { left: "Cat", right: "Con mèo" },
        { left: "Elephant", right: "Con voi" },
        { left: "Tiger", right: "Con hổ" },
        { left: "Lion", right: "Sư tử" },
        { left: "Monkey", right: "Con khỉ" },
        { left: "Rabbit", right: "Con thỏ" },
        { left: "Bear", right: "Con gấu" },
      ],
    },
  ],
  sentence_puzzles: [
    {
      id: "scramble-1",
      lang: "vi",
      title: "Ghép câu Tiếng Việt: Lòng biết ơn",
      words: ["Chúng", "em", "luôn", "kính", "trọng", "và", "biết", "ơn", "thầy", "cô."],
      hint: "Bắt đầu bằng từ 'Chúng em'",
    },
  ],
  wiki_facts: [],
};

async function loadLearningGames() {
  try {
    const res = await fetch("data/learning_games.json");
    if (res.ok) {
      const data = await res.json();
      if (data) learningGamesData = data;
    }
  } catch (e) {
    console.warn("Could not load learning games data", e);
  }
}

/* MODE 5: CARD MATCHING GAME (ĐẤU TRƯỜNG GHÉP THẺ) */
function renderMatchGame(stage) {
  clearInterval(chronoInterval);
  const sets = learningGamesData.matching_sets || [];
  if (!sets.length) {
    stage.innerHTML = `<p>Đang chuẩn bị bộ thẻ ghép...</p>`;
    return;
  }

  let currentSetIdx = 0;
  let cards = [];
  let selected = [];
  let matchedCount = 0;
  let moves = 0;
  let startTime = Date.now();

  function startSet(idx) {
    currentSetIdx = idx;
    const s = sets[idx];
    selected = [];
    matchedCount = 0;
    moves = 0;
    startTime = Date.now();

    // Create cards pool
    const pool = [];
    s.pairs.forEach((p, pi) => {
      pool.push({ id: `l-${pi}`, pairId: pi, text: p.left, side: "L" });
      pool.push({ id: `r-${pi}`, pairId: pi, text: p.right, side: "R" });
    });
    // Shuffle
    cards = pool.sort(() => 0.5 - Math.random());

    drawBoard();
  }

  function drawBoard() {
    const s = sets[currentSetIdx];
    const isCompleted = matchedCount === s.pairs.length;

    stage.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
        <div>
          <h2 style="margin:0 0 4px;">🃏 Đấu Trường Ghép Thẻ Thông Minh</h2>
          <p style="color:var(--muted);margin:0;font-size:0.9rem;">Lật 2 thẻ có nghĩa tương ứng để tạo thành cặp ghép đúng!</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <select id="matchSetSelect" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-weight:600;">
            ${sets.map((item, i) => `<option value="${i}" ${i === currentSetIdx ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}
          </select>
          <span class="hud-pill">Số lượt lật: ${moves}</span>
        </div>
      </div>

      ${
        isCompleted
          ? `
          <div style="text-align:center;padding:32px 0;">
            <div style="font-size:3.5rem;">🎉</div>
            <h2 style="margin:8px 0;">Xuất sắc! Bạn đã ghép đúng toàn bộ!</h2>
            <p style="font-size:1.1rem;color:var(--muted);">Thời gian hoàn thành: <strong>${Math.round((Date.now() - startTime) / 1000)} giây</strong> • <strong>+50 XP</strong></p>
            <div style="display:flex;gap:10px;justify-content:center;margin-top:18px;">
              <button class="btn btn-primary" id="matchReplayBtn">↺ Chơi lại bộ này</button>
              <button class="btn" id="matchNextBtn">Chơi bộ tiếp theo →</button>
            </div>
          </div>
        `
          : `
          <div class="match-grid">
            ${cards
              .map(
                (c, i) => `
              <div class="match-card ${c.matched ? "matched" : ""} ${selected.includes(i) ? "selected" : ""}" data-idx="${i}">
                ${escapeHtml(c.text)}
              </div>
            `
              )
              .join("")}
          </div>
        `
      }
    `;

    const setSelect = stage.querySelector("#matchSetSelect");
    if (setSelect) {
      setSelect.addEventListener("change", () => startSet(parseInt(setSelect.value, 10)));
    }

    if (isCompleted) {
      stage.querySelector("#matchReplayBtn").addEventListener("click", () => startSet(currentSetIdx));
      stage.querySelector("#matchNextBtn").addEventListener("click", () => startSet((currentSetIdx + 1) % sets.length));
      return;
    }

    stage.querySelectorAll(".match-card").forEach((cardEl) => {
      cardEl.addEventListener("click", () => {
        const cIdx = parseInt(cardEl.dataset.idx, 10);
        if (cards[cIdx].matched || selected.includes(cIdx)) return;

        if (selected.length === 0) {
          selected = [cIdx];
          drawBoard();
        } else if (selected.length === 1) {
          selected.push(cIdx);
          moves++;
          const c1 = cards[selected[0]];
          const c2 = cards[selected[1]];

          if (c1.pairId === c2.pairId && c1.side !== c2.side) {
            // Match found!
            c1.matched = true;
            c2.matched = true;
            matchedCount++;
            playTone(true);
            showToast("✨ Ghép cặp chính xác!");
            if (matchedCount === s.pairs.length) {
              addXp(50, `Ghép thẻ: ${s.title}`);
            }
            selected = [];
            drawBoard();
          } else {
            // Wrong match
            playTone(false);
            drawBoard();
            setTimeout(() => {
              selected = [];
              drawBoard();
            }, 600);
          }
        }
      });
    });
  }

  startSet(0);
}

/* MODE 6: SENTENCE BUILDER (SẮP XẾP CÂU) */
function renderSentenceBuilder(stage) {
  clearInterval(chronoInterval);
  const puzzles = learningGamesData.sentence_puzzles || [];
  if (!puzzles.length) {
    stage.innerHTML = `<p>Đang chuẩn bị bài tập ghép câu...</p>`;
    return;
  }

  let puzzleIdx = 0;
  let placed = [];
  let available = [];

  function loadPuzzle(idx) {
    puzzleIdx = idx;
    const p = puzzles[idx];
    placed = [];
    available = [...p.words].sort(() => 0.5 - Math.random());
    draw();
  }

  function draw() {
    const p = puzzles[puzzleIdx];
    const isFull = placed.length === p.words.length;

    stage.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
        <div>
          <h2 style="margin:0 0 4px;">🧩 Ghép Câu Ngữ Pháp Chuẩn</h2>
          <p style="color:var(--muted);margin:0;font-size:0.9rem;">Chạm vào các từ bên dưới để ghép thành câu hoàn chỉnh đúng trật tự ngữ pháp.</p>
        </div>
        <span class="hud-pill">Bài ${puzzleIdx + 1} / ${puzzles.length}</span>
      </div>

      <div style="background:var(--primary-soft);padding:10px 14px;border-radius:10px;margin-bottom:14px;font-size:0.92rem;">
        💡 <strong>Gợi ý:</strong> ${escapeHtml(p.hint || p.title)}
      </div>

      <div style="font-size:0.88rem;font-weight:700;margin-bottom:4px;">Câu của bạn (Chạm vào từ để gỡ bỏ):</div>
      <div class="sentence-drop-area" id="placedArea">
        ${
          placed.length === 0
            ? `<span style="color:var(--muted);font-style:italic;">Chưa có từ nào. Chạm vào các từ bên dưới để ghép vào đây...</span>`
            : placed.map((w, i) => `<span class="word-bubble" data-p="${i}">${escapeHtml(w)} ✕</span>`).join("")
        }
      </div>

      <div style="font-size:0.88rem;font-weight:700;margin:14px 0 4px;">Ngân hàng từ vựng:</div>
      <div class="sentence-word-bank" id="availArea">
        ${available.map((w, i) => `<span class="word-bubble" data-a="${i}">${escapeHtml(w)}</span>`).join("")}
      </div>

      <div id="sentenceResult" style="margin:14px 0;"></div>

      <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">
        <button class="btn btn-primary" id="checkSentenceBtn" ${!isFull ? "disabled" : ""}>✔️ Kiểm tra câu</button>
        <button class="btn" id="resetSentenceBtn">↺ Đặt lại từ đầu</button>
        <button class="btn" id="nextSentenceBtn">Bài tiếp theo →</button>
      </div>
    `;

    // Click to remove placed word
    stage.querySelectorAll("#placedArea .word-bubble").forEach((el) => {
      el.addEventListener("click", () => {
        const pIdx = parseInt(el.dataset.p, 10);
        const [w] = placed.splice(pIdx, 1);
        available.push(w);
        draw();
      });
    });

    // Click to place available word
    stage.querySelectorAll("#availArea .word-bubble").forEach((el) => {
      el.addEventListener("click", () => {
        const aIdx = parseInt(el.dataset.a, 10);
        const [w] = available.splice(aIdx, 1);
        placed.push(w);
        draw();
      });
    });

    // Check Button
    stage.querySelector("#checkSentenceBtn").addEventListener("click", () => {
      const targetStr = p.words.join(" ").trim();
      const userStr = placed.join(" ").trim();
      const resEl = stage.querySelector("#sentenceResult");

      if (userStr === targetStr) {
        playTone(true);
        addXp(30, `Ghép câu: ${p.title}`);
        resEl.innerHTML = `
          <div class="explain-box" style="border-color:#10b981;background:rgba(16,185,129,0.12);color:#047857;">
            <strong>🎉 Chính xác! (+30 XP)</strong> Câu đúng: <em>"${escapeHtml(targetStr)}"</em>
          </div>
        `;
      } else {
        playTone(false);
        resEl.innerHTML = `
          <div class="explain-box" style="border-color:#ef4444;background:rgba(239,68,68,0.12);color:#b91c1c;">
            <strong>❌ Thứ tự chưa chính xác!</strong> Hãy thử sắp xếp lại các từ nhé.
          </div>
        `;
      }
    });

    stage.querySelector("#resetSentenceBtn").addEventListener("click", () => loadPuzzle(puzzleIdx));
    stage.querySelector("#nextSentenceBtn").addEventListener("click", () => loadPuzzle((puzzleIdx + 1) % puzzles.length));
  }

  loadPuzzle(0);
}

/* MODE 7: WIKI ENCYCLOPEDIA FACTS (EM CÓ BIẾT?) */
function renderWikiFacts(stage) {
  clearInterval(chronoInterval);
  const facts = learningGamesData.wiki_facts || [];

  stage.innerHTML = `
    <div style="margin-bottom:16px;">
      <h2 style="margin:0 0 4px;">💡 Em Có Biết? – Kho Tri Thức Bách Khoa</h2>
      <p style="color:var(--muted);margin:0;font-size:0.9rem;">
        Khám phá các sự thật khoa học, thiên văn, lịch sử và địa lý kỳ thú được thu thập từ Bách khoa toàn thư.
      </p>
    </div>

    <div class="fact-grid">
      ${facts
        .map(
          (f) => `
        <div class="fact-card">
          <div>
            <span style="font-size:0.75rem;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--primary-soft);color:var(--primary);">${escapeHtml(f.category)}</span>
            <h3 style="margin:8px 0 6px;">${escapeHtml(f.title)}</h3>
            <p>${escapeHtml(f.summary)}</p>
          </div>
          ${
            f.url
              ? `<a href="${escapeHtml(f.url)}" target="_blank" rel="noopener noreferrer" style="font-size:0.84rem;color:var(--primary);font-weight:600;text-decoration:none;">Đọc thêm trên Wikipedia ↗</a>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

async function init() {
  initThemeAndSound();
  renderHud();

  const stage = document.getElementById("quizStage");
  const tabs = document.querySelectorAll("#modeTabs .chip");

  await loadDynamicBanks();
  await loadLearningGames();

  function switchMode(mode) {
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === mode));
    if (mode === "mcq") renderMcqHome(stage);
    else if (mode === "match") renderMatchGame(stage);
    else if (mode === "sentence") renderSentenceBuilder(stage);
    else if (mode === "facts") renderWikiFacts(stage);
    else if (mode === "chrono") renderChrono(stage);
    else if (mode === "math24") renderMath24(stage);
    else if (mode === "daily") renderDaily(stage);
  }

  tabs.forEach((t) => t.addEventListener("click", () => switchMode(t.dataset.mode)));

  document.getElementById("randomQuizBtn").addEventListener("click", () => {
    const bank = allBanks[Math.floor(Math.random() * allBanks.length)];
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === "mcq"));
    renderMcqHome(stage, bank);
    showToast(`🎲 Đã chọn: ${bank.title}`);
  });

  switchMode("mcq");
}

init();


