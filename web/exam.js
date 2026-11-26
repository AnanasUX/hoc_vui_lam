function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2000);
}

function initTheme() {
  const saved = localStorage.getItem("htm_theme") || "light";
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
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

const FALLBACK_EXAMS = [
  {
    id: "mock-toan-hk1-lop5",
    title: "Đề Khảo Sát Năng Lực Toán Lớp 5 (Học kỳ 1)",
    grade: "Lớp 5",
    subject: "Toán học",
    time_minutes: 35,
    questions: [
      { id: "q1", q: "Chữ số 7 trong số thập phân 185,274 có giá trị là:", opts: ["7/10", "7/100", "7/1000", "7 đơn vị"], ans: 1, points: 1.0, exp: "Chữ số 7 nằm ở hàng phần trăm nên có giá trị là 7/100." },
      { id: "q2", q: "Viết hỗn số 3 và 4/5 thành số thập phân ta được:", opts: ["3,4", "3,8", "3,45", "3,54"], ans: 1, points: 1.0, exp: "4/5 = 0,8. Do đó 3 và 4/5 = 3 + 0,8 = 3,8." },
      { id: "q3", q: "Tính: 45,8 + 17,65 = ?", opts: ["63,45", "62,45", "63,145", "63,85"], ans: 0, points: 1.0, exp: "45,80 + 17,65 = 63,45." },
      { id: "q4", q: "Một lớp học có 32 học sinh, trong đó có 24 học sinh thích môn Toán. Tỉ số phần trăm của học sinh thích Toán là:", opts: ["70%", "72%", "75%", "80%"], ans: 2, points: 1.5, exp: "24 ÷ 32 × 100% = 75%." },
      { id: "q5", q: "Hình chữ nhật có chiều dài 80 m, chiều rộng bằng 3/4 chiều dài. Diện tích khu đất là:", opts: ["4 800 m²", "4 200 m²", "280 m²", "2 400 m²"], ans: 0, points: 1.5, exp: "Chiều rộng = 60 m. Diện tích = 80 × 60 = 4 800 m²." },
      { id: "q6", q: "Đi xe máy trong 2 giờ 15 phút với vận tốc 40 km/h. Quãng đường đi được là:", opts: ["80 km", "85 km", "90 km", "100 km"], ans: 2, points: 1.5, exp: "2 giờ 15 phút = 2,25 giờ. s = 40 × 2,25 = 90 km." },
      { id: "q7", q: "Hình tròn có đường kính d = 6 cm. Diện tích của hình tròn đó là:", opts: ["18,84 cm²", "28,26 cm²", "113,04 cm²", "36 cm²"], ans: 1, points: 1.5, exp: "r = 3 cm. S = 3 × 3 × 3,14 = 28,26 cm²." },
      { id: "q8", q: "Tìm x biết: x × 4,5 = 54", opts: ["10", "12", "14", "15"], ans: 1, points: 1.0, exp: "x = 54 ÷ 4,5 = 12." }
    ]
  }
];

let examsList = [];
let currentExam = null;
let userAnswers = {};
let flaggedQuestions = new Set();
let currentQIdx = 0;
let timeRemaining = 0;
let timerInterval = null;
let candidateName = "Học sinh";
let candidateSchool = "Trường Tiểu học";

async function loadExams() {
  try {
    const res = await fetch("data/mock_exams.json");
    if (res.ok) {
      const data = await res.json();
      if (data && data.mock_exams && data.mock_exams.length) {
        examsList = data.mock_exams;
      }
    }
  } catch {
    examsList = FALLBACK_EXAMS;
  }
  if (!examsList.length) examsList = FALLBACK_EXAMS;
}

function renderExamLobby() {
  clearInterval(timerInterval);
  const container = document.getElementById("examContainer");
  container.innerHTML = `
    <div style="max-width:760px;margin:30px auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:30px;box-shadow:var(--shadow);">
      <div style="text-align:center;margin-bottom:24px;">
        <span style="padding:4px 12px;border-radius:999px;background:var(--primary-soft);color:var(--primary);font-size:0.85rem;font-weight:700;">HỆ THỐNG KHẢO SÁT CHUẨN</span>
        <h1 style="margin:10px 0 6px;font-size:1.6rem;">🏛️ Phòng Thi Trực Tuyến &amp; Cấp Giấy Khen</h1>
        <p style="color:var(--muted);margin:0;">Làm bài thi thử có đồng hồ bấm giờ chuẩn, chấm điểm thang 10 tự động và cấp Giấy Khen vinh danh A4 ngay khi hoàn thành!</p>
      </div>

      <div class="field" style="margin-bottom:14px;">
        <label>Họ và tên thí sinh:</label>
        <input id="candName" type="text" placeholder="Ví dụ: Nguyễn Hoàng Nam" value="${escapeHtml(candidateName !== "Học sinh" ? candidateName : "")}" style="font-size:1.05rem;" />
      </div>

      <div class="field" style="margin-bottom:18px;">
        <label>Lớp / Trường:</label>
        <input id="candSchool" type="text" placeholder="Ví dụ: Lớp 5A – Tiểu học Kim Đồng" value="${escapeHtml(candidateSchool !== "Trường Tiểu học" ? candidateSchool : "")}" />
      </div>

      <h3 style="margin:20px 0 10px;">Chọn đề thi khảo sát:</h3>
      <div style="display:grid;gap:12px;margin-bottom:24px;">
        ${examsList.map((ex, i) => `
          <div style="border:1.5px solid var(--border);border-radius:12px;padding:16px;background:var(--surface-2);display:flex;justify-content:space-between;align-items:center;cursor:pointer;" class="exam-select-card" data-idx="${i}">
            <div>
              <div style="font-size:0.8rem;font-weight:700;color:var(--primary);">${escapeHtml(ex.subject)} • ${escapeHtml(ex.grade)}</div>
              <h4 style="margin:4px 0 6px;font-size:1.05rem;">${escapeHtml(ex.title)}</h4>
              <span style="font-size:0.85rem;color:var(--muted);">⏱️ Thời gian: <strong>${ex.time_minutes} phút</strong> • <strong>${ex.questions.length} câu hỏi</strong> • Thang điểm 10.0</span>
            </div>
            <button class="btn btn-primary start-exam-btn" data-idx="${i}">Vào phòng thi →</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  container.querySelectorAll(".start-exam-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx, 10);
      startExam(examsList[idx]);
    });
  });

  container.querySelectorAll(".exam-select-card").forEach(card => {
    card.addEventListener("click", () => {
      const idx = parseInt(card.dataset.idx, 10);
      startExam(examsList[idx]);
    });
  });
}

function startExam(exam) {
  const nameInput = document.getElementById("candName");
  const schoolInput = document.getElementById("candSchool");
  if (nameInput && nameInput.value.trim()) candidateName = nameInput.value.trim();
  if (schoolInput && schoolInput.value.trim()) candidateSchool = schoolInput.value.trim();

  currentExam = exam;
  userAnswers = {};
  flaggedQuestions = new Set();
  currentQIdx = 0;
  timeRemaining = exam.time_minutes * 60;

  renderExamRoom();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      showToast("Hết giờ làm bài! Hệ thống đang tự động nộp bài...");
      finishExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById("examTimer");
  if (!timerEl) return;
  const m = Math.floor(timeRemaining / 60);
  const s = timeRemaining % 60;
  timerEl.textContent = `⏱️ ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  if (timeRemaining < 300) {
    timerEl.classList.add("urgent");
  } else {
    timerEl.classList.remove("urgent");
  }
}

function renderExamRoom() {
  const container = document.getElementById("examContainer");
  const q = currentExam.questions[currentQIdx];
  const totalQ = currentExam.questions.length;

  container.innerHTML = `
    <div class="exam-layout">
      <!-- Main Question Area -->
      <section class="exam-main">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:12px;margin-bottom:16px;">
          <div>
            <span style="font-size:0.8rem;font-weight:700;color:var(--primary);text-transform:uppercase;">${escapeHtml(currentExam.subject)} • ${escapeHtml(currentExam.grade)}</span>
            <h2 style="margin:2px 0 0;font-size:1.15rem;">${escapeHtml(currentExam.title)}</h2>
          </div>
          <div style="text-align:right;">
            <span class="hud-pill">Câu ${currentQIdx + 1} / ${totalQ}</span>
            <div style="font-size:0.8rem;color:var(--muted);margin-top:2px;">Điểm: ${q.points || 1.0} đ</div>
          </div>
        </div>

        <div style="font-size:1.12rem;font-weight:600;margin-bottom:20px;line-height:1.5;">
          ${escapeHtml(q.q)}
        </div>

        <div class="opt-list">
          ${q.opts.map((opt, i) => {
            const isSel = userAnswers[currentQIdx] === i;
            return `
              <button class="opt-btn ${isSel ? "selected" : ""}" data-idx="${i}">
                <strong>${["A", "B", "C", "D"][i]}.</strong> ${escapeHtml(opt)}
              </button>
            `;
          }).join("")}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:28px;gap:8px;flex-wrap:wrap;">
          <button class="btn" id="prevQBtn" ${currentQIdx === 0 ? "disabled" : ""}>← Câu trước</button>
          
          <button class="btn" id="flagQBtn" style="border-color:${flaggedQuestions.has(currentQIdx) ? "#f59e0b" : "var(--border)"};">
            ${flaggedQuestions.has(currentQIdx) ? "🚩 Đã đánh dấu xem lại" : "🏳️ Đánh dấu xem lại"}
          </button>

          <button class="btn btn-primary" id="nextQBtn">
            ${currentQIdx === totalQ - 1 ? "Xem lại bài" : "Câu tiếp theo →"}
          </button>
        </div>
      </section>

      <!-- Sidebar Area -->
      <aside class="exam-sidebar">
        <div class="exam-timer" id="examTimer">⏱️ 00:00</div>
        
        <div style="font-size:0.88rem;font-weight:700;margin-bottom:8px;">Bảng câu hỏi:</div>
        <div class="exam-palette" id="examPalette">
          ${currentExam.questions.map((_, i) => {
            let cls = "palette-btn";
            if (userAnswers[i] !== undefined) cls += " answered";
            if (i === currentQIdx) cls += " current";
            if (flaggedQuestions.has(i)) cls += " flagged";
            return `<button class="${cls}" data-idx="${i}">${i + 1}</button>`;
          }).join("")}
        </div>

        <div style="font-size:0.78rem;color:var(--muted);margin-bottom:16px;line-height:1.6;">
          <div><span style="display:inline-block;width:10px;height:10px;background:var(--primary);border-radius:2px;margin-right:4px;"></span> Đã làm</div>
          <div><span style="display:inline-block;width:10px;height:10px;border:1px solid #f59e0b;border-radius:2px;margin-right:4px;"></span> Đánh dấu xem lại</div>
          <div><span style="display:inline-block;width:10px;height:10px;border:1px solid var(--border);border-radius:2px;margin-right:4px;"></span> Chưa làm</div>
        </div>

        <button class="btn btn-primary" id="submitExamBtn" style="width:100%;padding:12px;background:linear-gradient(135deg,#10b981,#059669);border:none;">
          ✅ NỘP BÀI THI
        </button>
      </aside>
    </div>
  `;

  updateTimerDisplay();

  // Option selection
  container.querySelectorAll(".opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const optIdx = parseInt(btn.dataset.idx, 10);
      userAnswers[currentQIdx] = optIdx;
      renderExamRoom();
    });
  });

  // Palette jump
  container.querySelectorAll(".palette-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentQIdx = parseInt(btn.dataset.idx, 10);
      renderExamRoom();
    });
  });

  // Nav buttons
  document.getElementById("prevQBtn").addEventListener("click", () => {
    if (currentQIdx > 0) {
      currentQIdx--;
      renderExamRoom();
    }
  });

  document.getElementById("nextQBtn").addEventListener("click", () => {
    if (currentQIdx < totalQ - 1) {
      currentQIdx++;
      renderExamRoom();
    } else {
      showToast("Bạn đã ở câu hỏi cuối cùng.");
    }
  });

  document.getElementById("flagQBtn").addEventListener("click", () => {
    if (flaggedQuestions.has(currentQIdx)) flaggedQuestions.delete(currentQIdx);
    else flaggedQuestions.add(currentQIdx);
    renderExamRoom();
  });

  document.getElementById("submitExamBtn").addEventListener("click", () => {
    const answeredCount = Object.keys(userAnswers).length;
    const unanswered = totalQ - answeredCount;
    let msg = "Bạn có chắc chắn muốn nộp bài thi?";
    if (unanswered > 0) {
      msg = `Bạn còn ${unanswered} câu chưa trả lời. Bạn vẫn muốn nộp bài thi ngay?`;
    }
    if (confirm(msg)) {
      finishExam();
    }
  });
}

function finishExam() {
  clearInterval(timerInterval);
  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;

  currentExam.questions.forEach((q, i) => {
    const p = q.points || 1.0;
    maxScore += p;
    if (userAnswers[i] === q.ans) {
      totalScore += p;
      correctCount++;
    }
  });

  const scaledScore = Math.round((totalScore / maxScore) * 100) / 10;
  let rankTitle = "XUẤT SẮC";
  let badgeColor = "#10b981";
  if (scaledScore < 5.0) { rankTitle = "CẦN CỐ GẮNG"; badgeColor = "#ef4444"; }
  else if (scaledScore < 6.5) { rankTitle = "TRUNG BÌNH"; badgeColor = "#f59e0b"; }
  else if (scaledScore < 8.0) { rankTitle = "KHÁ"; badgeColor = "#06b6d4"; }
  else if (scaledScore < 9.0) { rankTitle = "GIỎI"; badgeColor = "#6366f1"; }

  const container = document.getElementById("examContainer");
  container.innerHTML = `
    <div style="max-width:860px;margin:24px auto;">
      <div style="text-align:center;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;box-shadow:var(--shadow);margin-bottom:24px;">
        <div style="font-size:3rem;margin-bottom:6px;">🏆</div>
        <span style="font-size:0.85rem;font-weight:700;color:var(--primary);text-transform:uppercase;">KẾT QUẢ KHẢO SÁT CHÍNH THỨC</span>
        <h2 style="margin:6px 0;">${escapeHtml(currentExam.title)}</h2>
        <p style="color:var(--muted);margin:0 0 16px;">Thí sinh: <strong>${escapeHtml(candidateName)}</strong> • ${escapeHtml(candidateSchool)}</p>

        <div style="display:flex;justify-content:center;gap:18px;margin:20px 0;flex-wrap:wrap;">
          <div style="padding:14px 24px;border-radius:14px;background:var(--surface-2);border:1px solid var(--border);">
            <div style="font-size:2.2rem;font-weight:800;color:${badgeColor};">${scaledScore.toFixed(1)} / 10</div>
            <div style="font-size:0.85rem;color:var(--muted);font-weight:700;">ĐIỂM SỐ</div>
          </div>
          <div style="padding:14px 24px;border-radius:14px;background:var(--surface-2);border:1px solid var(--border);">
            <div style="font-size:2.2rem;font-weight:800;color:var(--primary);">${correctCount} / ${currentExam.questions.length}</div>
            <div style="font-size:0.85rem;color:var(--muted);font-weight:700;">SỐ CÂU ĐÚNG</div>
          </div>
          <div style="padding:14px 24px;border-radius:14px;background:var(--surface-2);border:1px solid var(--border);">
            <div style="font-size:2.2rem;font-weight:800;color:${badgeColor};">${rankTitle}</div>
            <div style="font-size:0.85rem;color:var(--muted);font-weight:700;">XẾP LOẠI</div>
          </div>
        </div>

        <div style="display:flex;justify-content:center;gap:10px;margin-top:20px;flex-wrap:wrap;">
          <button class="btn btn-primary" id="viewCertBtn">📜 Xem Giấy Khen Vinh Danh</button>
          <button class="btn" id="retryExamBtn">↺ Làm lại đề này</button>
          <button class="btn" id="lobbyBtn">← Danh sách đề thi khác</button>
        </div>
      </div>

      <!-- Certificate Canvas Modal / Display -->
      <div id="certContainer" style="display:none;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow);margin-bottom:24px;text-align:center;">
        <h3 style="margin-top:0;">📜 Giấy Khen Vinh Danh Khổ A4 HiDPI</h3>
        <p style="color:var(--muted);font-size:0.9rem;">Tự động cấp chứng nhận vinh danh cho thành tích của bạn</p>
        <div style="display:flex;justify-content:center;margin:16px 0;overflow-x:auto;">
          <canvas id="certCanvas" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.12);"></canvas>
        </div>
        <div style="display:flex;justify-content:center;gap:10px;">
          <button class="btn btn-primary" id="downloadCertBtn">📥 Tải Giấy Khen PNG</button>
          <button class="btn" onclick="window.print()">🖨️ In Giấy Khen (A4)</button>
        </div>
      </div>

      <!-- Detailed Breakdown -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow);">
        <h3 style="margin-top:0;">Chi tiết bài làm &amp; Lời giải:</h3>
        <div style="display:grid;gap:16px;">
          ${currentExam.questions.map((q, i) => {
            const userAns = userAnswers[i];
            const isCorrect = userAns === q.ans;
            return `
              <div style="border-left:4px solid ${isCorrect ? "#10b981" : "#ef4444"};padding:12px 16px;background:var(--surface-2);border-radius:0 10px 10px 0;">
                <div style="font-weight:700;margin-bottom:6px;">Câu ${i + 1}: ${escapeHtml(q.q)}</div>
                <div style="font-size:0.92rem;margin-bottom:4px;">
                  Bạn chọn: <strong style="color:${isCorrect ? "#10b981" : "#ef4444"};">${userAns !== undefined ? ["A", "B", "C", "D"][userAns] + ". " + escapeHtml(q.opts[userAns]) : "Chưa chọn"}</strong>
                  ${!isCorrect ? ` • Đáp án đúng: <strong style="color:#10b981;">${["A", "B", "C", "D"][q.ans]}. ${escapeHtml(q.opts[q.ans])}</strong>` : ""}
                </div>
                <div style="font-size:0.86rem;color:var(--muted);background:var(--primary-soft);padding:8px 12px;border-radius:6px;margin-top:6px;">
                  💡 <strong>Giải thích:</strong> ${escapeHtml(q.exp)}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;

  // Draw Certificate
  drawCertificate(scaledScore, rankTitle);

  document.getElementById("viewCertBtn").addEventListener("click", () => {
    const certBox = document.getElementById("certContainer");
    certBox.style.display = certBox.style.display === "none" ? "block" : "none";
    certBox.scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("retryExamBtn").addEventListener("click", () => {
    startExam(currentExam);
  });

  document.getElementById("lobbyBtn").addEventListener("click", renderExamLobby);
}

function drawCertificate(score, rankTitle) {
  const canvas = document.getElementById("certCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = 1123;
  const H = 794;
  const scale = 1.5;
  canvas.width = W * scale;
  canvas.height = H * scale;
  canvas.style.width = `${W * 0.7}px`;
  canvas.style.height = `${H * 0.7}px`;
  ctx.scale(scale, scale);

  // Background Parchment
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, W, H);

  // Outer Gold Border
  ctx.strokeStyle = "#c59b27";
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  // Inner Delicate Border
  ctx.strokeStyle = "#947620";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(32, 32, W - 64, H - 64);

  // Corner Ornaments
  const corners = [
    [40, 40],
    [W - 40, 40],
    [40, H - 40],
    [W - 40, H - 40]
  ];
  ctx.fillStyle = "#c59b27";
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Header Motto
  ctx.textAlign = "center";
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 15px 'Be Vietnam Pro', serif";
  ctx.fillText("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", W / 2, 75);
  ctx.font = "italic 13px 'Be Vietnam Pro', serif";
  ctx.fillText("Độc lập – Tự do – Hạnh phúc", W / 2, 98);
  ctx.strokeStyle = "#c59b27";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 80, 108);
  ctx.lineTo(W / 2 + 80, 108);
  ctx.stroke();

  // Certificate Big Title
  ctx.fillStyle = "#991b1b";
  ctx.font = "bold 44px 'Be Vietnam Pro', serif";
  ctx.fillText("GIẤY KHEN", W / 2, 175);

  ctx.fillStyle = "#475569";
  ctx.font = "16px 'Be Vietnam Pro', sans-serif";
  ctx.fillText("HỘI ĐỒNG KHẢO SÁT HỌC THÔNG MINH KHEN TẶNG EM", W / 2, 220);

  // Candidate Name
  ctx.fillStyle = "#1e3a8a";
  ctx.font = "bold 36px 'Be Vietnam Pro', sans-serif";
  ctx.fillText(candidateName.toUpperCase(), W / 2, 275);

  // School / Class
  ctx.fillStyle = "#475569";
  ctx.font = "italic 17px 'Be Vietnam Pro', sans-serif";
  ctx.fillText(candidateSchool, W / 2, 312);

  // Achievement Text
  ctx.fillStyle = "#1e293b";
  ctx.font = "18px 'Be Vietnam Pro', sans-serif";
  ctx.fillText(`Đã xuất sắc hoàn thành kỳ thi: ${currentExam.title}`, W / 2, 365);
  ctx.font = "bold 20px 'Be Vietnam Pro', sans-serif";
  ctx.fillStyle = "#059669";
  ctx.fillText(`Điểm số: ${score.toFixed(1)} / 10.0  •  Xếp loại: ${rankTitle}`, W / 2, 400);

  // Seal & Ribbon (Drawn Gold Medal)
  ctx.beginPath();
  ctx.arc(W / 2, 485, 40, 0, Math.PI * 2);
  ctx.fillStyle = "#c59b27";
  ctx.fill();
  ctx.strokeStyle = "#947620";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px 'Be Vietnam Pro', sans-serif";
  ctx.fillText("HTM", W / 2, 492);

  // Footer Signatures
  const today = new Date();
  const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
  
  ctx.font = "italic 15px 'Be Vietnam Pro', sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText(dateStr, W - 220, 570);
  ctx.font = "bold 16px 'Be Vietnam Pro', sans-serif";
  ctx.fillStyle = "#1e293b";
  ctx.fillText("HỘI ĐỒNG KHẢO SÁT", W - 220, 595);
  ctx.font = "italic 14px 'Be Vietnam Pro', sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("(Đã xác thực điện tử)", W - 220, 645);

  // Download Button Handler
  const dlBtn = document.getElementById("downloadCertBtn");
  if (dlBtn) {
    dlBtn.onclick = () => {
      const a = document.createElement("a");
      a.download = `GiayKhen_${candidateName.replace(/\s+/g, "_")}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      showToast("Đã tải Giấy Khen chất lượng cao A4!");
    };
  }
}

async function init() {
  initTheme();
  await loadExams();
  renderExamLobby();
}

init();
