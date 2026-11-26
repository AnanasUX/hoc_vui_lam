function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug") || "phieu-toan";
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

/* Helper: Tạo Canvas khổ A4 HiDPI (794 x 1123 logical px, scale 2x) */
function setupA4Canvas(preview, slug) {
  const W = 794;
  const H = 1123;
  const scale = 2;
  preview.style.padding = "0";
  preview.style.background = "transparent";
  preview.style.border = "none";
  preview.style.boxShadow = "none";
  preview.innerHTML = `<canvas id="a4Canvas" class="a4-canvas" width="${W * scale}" height="${H * scale}" aria-label="Trang 1"></canvas>`;
  const canvas = document.getElementById("a4Canvas");
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const dlBtn = document.getElementById("downloadPngBtn");
  if (dlBtn) {
    dlBtn.style.display = "inline-flex";
    dlBtn.onclick = () => {
      const a = document.createElement("a");
      a.download = `${slug || "hoc-thong-minh"}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      showToast("Đã tải ảnh PNG chất lượng cao!");
    };
  }
  return { canvas, ctx, W, H };
}

/* 1. PHIẾU TOÁN */
function initMathTool(controls, preview, tool) {
  controls.innerHTML = `
    <div class="field"><label>Tiêu đề phiếu</label><input id="mTitle" value="PHIẾU BÀI TẬP TOÁN" /></div>
    <div class="field"><label>Phạm vi số</label>
      <select id="mRange">
        <option value="10">Trong phạm vi 10</option>
        <option value="20" selected>Trong phạm vi 20</option>
        <option value="100">Trong phạm vi 100</option>
        <option value="1000">Trong phạm vi 1000</option>
      </select>
    </div>
    <div class="field"><label>Phép tính</label>
      <select id="mOp">
        <option value="add">Cộng (+)</option>
        <option value="sub">Trừ (-)</option>
        <option value="mix" selected>Cộng &amp; Trừ (+, -)</option>
        <option value="mul">Nhân (×)</option>
        <option value="div">Chia (÷)</option>
      </select>
    </div>
    <div class="field"><label>Kiểu trình bày</label>
      <select id="mLayout">
        <option value="horiz" selected>Tính nhẩm (hàng ngang)</option>
        <option value="vert">Đặt tính rồi tính (cột dọc)</option>
        <option value="missing">Tìm số còn thiếu (… + b = c)</option>
      </select>
    </div>
    <div class="field"><label>Số lượng bài</label><input id="mCount" type="number" min="6" max="40" value="20" /></div>
    <div class="field"><label><input id="mAns" type="checkbox" checked style="width:auto;margin-right:6px;" /> Kèm bảng đáp án</label></div>
    <button class="btn" id="mGen" style="width:100%;">🎲 Tạo đề mới</button>
  `;

  function render() {
    const title = document.getElementById("mTitle").value;
    const maxN = parseInt(document.getElementById("mRange").value, 10);
    const op = document.getElementById("mOp").value;
    const layout = document.getElementById("mLayout").value;
    const count = Math.min(40, Math.max(6, parseInt(document.getElementById("mCount").value, 10) || 20));
    const showAns = document.getElementById("mAns").checked;

    const problems = [];
    for (let i = 0; i < count; i++) {
      let curOp = op === "mix" ? (Math.random() < 0.5 ? "add" : "sub") : op;
      let a, b, ans, sym;
      if (curOp === "add") {
        a = randInt(1, maxN - 1);
        b = randInt(1, maxN - a);
        ans = a + b;
        sym = "+";
      } else if (curOp === "sub") {
        a = randInt(2, maxN);
        b = randInt(1, a);
        ans = a - b;
        sym = "-";
      } else if (curOp === "mul") {
        const cap = Math.min(12, maxN);
        a = randInt(2, cap);
        b = randInt(2, 10);
        ans = a * b;
        sym = "×";
      } else {
        const cap = Math.min(12, maxN);
        b = randInt(2, cap);
        ans = randInt(1, 10);
        a = b * ans;
        sym = "÷";
      }
      problems.push({ a, b, sym, ans, res: curOp === "add" ? a + b : curOp === "sub" ? a - b : curOp === "mul" ? a * b : a / b });
    }

    let bodyHtml = "";
    if (layout === "vert") {
      bodyHtml = `<div class="math-grid vertical">${problems
        .map(
          (p) => `
        <div class="math-vert">
          <div>${p.a}</div>
          <div class="line">${p.sym} ${p.b}</div>
        </div>`
        )
        .join("")}</div>`;
    } else if (layout === "missing") {
      bodyHtml = `<div class="math-grid">${problems
        .map((p, idx) => {
          const hideA = idx % 2 === 0;
          const expr = hideA ? `…… ${p.sym} ${p.b} = ${p.res}` : `${p.a} ${p.sym} …… = ${p.res}`;
          const missingVal = hideA ? p.a : p.b;
          p._ans = missingVal;
          return `<div class="math-item"><strong>${idx + 1}.</strong> ${expr}</div>`;
        })
        .join("")}</div>`;
    } else {
      bodyHtml = `<div class="math-grid">${problems
        .map((p, idx) => `<div class="math-item"><strong>${idx + 1}.</strong> ${p.a} ${p.sym} ${p.b} = ………</div>`)
        .join("")}</div>`;
    }

    preview.innerHTML = `
      <div class="a4-header">
        <div><strong>${escapeHtml(title)}</strong><br><small>${escapeHtml(tool.grade_label || "Tiểu học")}</small></div>
        <div style="text-align:right;font-size:0.9rem;">Họ và tên: ………………………………<br>Lớp: ………… Ngày: ……/……/……</div>
      </div>
      ${bodyHtml}
      ${
        showAns
          ? `<div style="margin-top:28px;padding-top:12px;border-top:1px dashed #94a3b8;font-size:0.85rem;color:#475569;">
              <strong>Đáp án tham khảo:</strong> ${problems.map((p, idx) => `${idx + 1}) ${p._ans ?? p.ans}`).join(" • ")}
            </div>`
          : ""
      }
    `;
  }

  ["mTitle", "mRange", "mOp", "mLayout", "mCount", "mAns"].forEach((id) =>
    document.getElementById(id).addEventListener("input", render)
  );
  document.getElementById("mGen").addEventListener("click", () => {
    render();
    showToast("Đã tạo bộ đề Toán mới!");
  });
  render();
}

/* 2. TẬP VIẾT & GIẤY Ô LY (CANVAS A4 CHUYÊN SÂU) */
function initHandwritingTool(controls, preview) {
  const state = {
    text: "Con yêu mẹ\nBà ngoại",
    font: "'HP001', cursive",
    sizeO: 2,
    strokeStyle: "fade", // fade | dash | outline
    opacity: 80,
    color: "#334155",
    boldFirst: true,
    repeatLine: true,
    startDot: false,
    rowsPerSample: 2,
    blankRows: 1,
    paperType: "oly", // oly | lined | blank
    gridMm: 5,
    title: "Phiếu tập viết",
  };

  controls.innerHTML = `
    <div class="field"><label>Chữ / câu cần luyện (mỗi dòng 1 mẫu)</label>
      <textarea id="hwText" rows="3">${state.text}</textarea>
    </div>
    <div class="field"><label>Tiêu đề phiếu</label><input id="hwTitle" value="${state.title}" /></div>
    <div class="field"><label>Font chữ</label>
      <select id="hwFont">
        <option value="'HP001', cursive" selected>HP001 – Chữ tập viết chuẩn tiểu học (QĐ 31)</option>
        <option value="'Times New Roman', serif">Chữ đứng chuẩn (Serif)</option>
        <option value="'Poppins', 'Be Vietnam Pro', sans-serif">Chữ nét đều (Poppins)</option>
      </select>
    </div>
    <div class="field"><label>Cỡ chữ (theo chuẩn tiểu học)</label>
      <div class="pill-row" id="hwSizeRow">
        <button class="pill-btn" data-val="1">Cỡ nhỏ (1 ô)</button>
        <button class="pill-btn" data-val="1.5">1,5 ô</button>
        <button class="pill-btn active" data-val="2">Cỡ lớn (2 ô)</button>
        <button class="pill-btn" data-val="3">3 ô</button>
      </div>
    </div>
    <div class="field"><label>Kiểu nét chữ mẫu</label>
      <div class="pill-row" id="hwStyleRow">
        <button class="pill-btn active" data-val="fade">Tô mờ</button>
        <button class="pill-btn" data-val="dash">Nét chấm</button>
        <button class="pill-btn" data-val="outline">Viền rỗng</button>
      </div>
    </div>
    <div class="field"><label>Độ mờ của nét: <span id="hwOpLabel">${state.opacity}%</span></label>
      <input id="hwOp" type="range" min="10" max="100" value="${state.opacity}" />
    </div>
    <div class="field"><label>Màu nét</label>
      <div class="pill-row" id="hwColorRow">
        <button class="pill-btn active" data-val="#334155">Xám đen</button>
        <button class="pill-btn" data-val="#2563eb">Xanh dương</button>
        <button class="pill-btn" data-val="#dc2626">Đỏ</button>
        <button class="pill-btn" data-val="#059669">Xanh lá</button>
      </div>
    </div>
    <div class="field">
      <label><input id="hwBoldFirst" type="checkbox" checked style="width:auto;margin-right:6px;" /> Chữ mẫu đầu dòng viết đậm</label>
      <label><input id="hwRepeat" type="checkbox" checked style="width:auto;margin-right:6px;" /> Lặp lại chữ cho đầy dòng</label>
      <label><input id="hwStartDot" type="checkbox" style="width:auto;margin-right:6px;" /> Hiện điểm đặt bút đầu dòng</label>
    </div>
    <p style="font-size:0.78rem;color:var(--muted);margin:0 0 10px;background:var(--surface-2);padding:8px 10px;border-radius:8px;border:1px solid var(--border);">
      📏 <strong>Chuẩn tiểu học:</strong> Cỡ nhỏ (chữ thường 1 ô, nét cao/hoa 2,5 ô) • Cỡ lớn (chữ thường 2 ô, nét cao/hoa 5 ô, khuyết dưới 3 ô).
    </p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <div class="field"><label>Dòng mỗi mẫu</label><input id="hwRowsPer" type="number" min="1" max="8" value="${state.rowsPerSample}" /></div>
      <div class="field"><label>Dòng trống sau</label><input id="hwBlank" type="number" min="0" max="6" value="${state.blankRows}" /></div>
    </div>
    <div class="field"><label>Loại giấy</label>
      <div class="pill-row" id="hwPaperRow">
        <button class="pill-btn active" data-val="oly">Ô ly</button>
        <button class="pill-btn" data-val="lined">Dòng kẻ</button>
        <button class="pill-btn" data-val="blank">Giấy trắng</button>
      </div>
    </div>
    <div class="field"><label>Kích thước ô ly</label>
      <div class="pill-row" id="hwGridRow">
        <button class="pill-btn" data-val="4">4 mm</button>
        <button class="pill-btn active" data-val="5">5 mm</button>
        <button class="pill-btn" data-val="6">6 mm</button>
        <button class="pill-btn" data-val="8">8 mm</button>
      </div>
    </div>
  `;

  const { ctx, W, H } = setupA4Canvas(preview, getSlug());

  function bindPills(rowId, key, isNum = false) {
    const row = document.getElementById(rowId);
    row.querySelectorAll(".pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        row.querySelectorAll(".pill-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state[key] = isNum ? parseFloat(btn.dataset.val) : btn.dataset.val;
        draw();
      });
    });
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const padX = 44;
    const topY = 42;
    const unitPx = state.gridMm * 2;    // 1 ô ly nhỏ (5mm -> 10px, 17 ô lớn vừa khổ A4)
    const majorStep = unitPx * 4;       // 1 ô vuông lớn = 4 x 4 ô nhỏ (chuẩn vở 4 ô ly)

    // Căn kích thước lưới chẵn theo 1 ô lớn (4 ô nhỏ) để không bị cắt dở ở viền
    const majorCols = Math.floor((W - padX * 2) / majorStep);
    const cols = majorCols * 4;
    const gridW = cols * unitPx;
    const startX = Math.round((W - gridW) / 2);

    const areaTop = topY + 66;
    const maxBands = Math.floor((H - 44 - areaTop) / majorStep);
    const areaH = maxBands * majorStep;

    // Header
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 20px 'Poppins', 'Be Vietnam Pro', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(state.title, W / 2, topY + 14);

    ctx.font = "400 13px 'Poppins', 'Be Vietnam Pro', sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#475569";
    ctx.fillText("Họ và tên: ...................................................................", startX, topY + 46);
    ctx.fillText("Lớp: ........................", startX + gridW - 150, topY + 46);

    // Vẽ nền giấy (Ô ly / Dòng kẻ / Giấy trắng)
    if (state.paperType === "oly") {
      // Đường kẻ mờ từng ô nhỏ (1 ô)
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "#dbeafe";
      for (let c = 0; c <= cols; c++) {
        if (c % 4 === 0) continue;
        const x = startX + c * unitPx;
        ctx.beginPath();
        ctx.moveTo(x, areaTop);
        ctx.lineTo(x, areaTop + areaH);
        ctx.stroke();
      }
      const totalUnitRows = maxBands * 4;
      for (let r = 0; r <= totalUnitRows; r++) {
        if (r % 4 === 0) continue;
        const y = areaTop + r * unitPx;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + gridW, y);
        ctx.stroke();
      }

      // Đường kẻ đậm mỗi 4 ô (1 ô vuông lớn)
      ctx.lineWidth = 1.15;
      ctx.strokeStyle = "#60a5fa";
      for (let c = 0; c <= cols; c += 4) {
        const x = startX + c * unitPx;
        ctx.beginPath();
        ctx.moveTo(x, areaTop);
        ctx.lineTo(x, areaTop + areaH);
        ctx.stroke();
      }
      for (let b = 0; b <= maxBands; b++) {
        const y = areaTop + b * majorStep;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + gridW, y);
        ctx.stroke();
      }

      // Đường kẻ lề đỏ bên trái (chuẩn vở ô ly tiểu học)
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "#f87171";
      ctx.beginPath();
      ctx.moveTo(startX, areaTop);
      ctx.lineTo(startX, areaTop + areaH);
      ctx.stroke();
    } else if (state.paperType === "lined") {
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = "#93c5fd";
      for (let b = 0; b <= maxBands; b++) {
        const y = areaTop + b * majorStep;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + gridW, y);
        ctx.stroke();
      }
    }

    // Chuẩn hóa chiều cao chữ thường (x-height) khớp chính xác state.sizeO ô nhỏ
    ctx.font = `400 100px ${state.font}`;
    const refMeasure = ctx.measureText("o");
    const ascentRatio = (refMeasure.actualBoundingBoxAscent || 52) / 100;
    const targetXHeight = state.sizeO * unitPx;
    const fontSize = targetXHeight / ascentRatio;

    // Đường chân chữ LUÔN trùng khít lên đường kẻ ngang đậm (bội số của 4 ô)
    const firstMajor = state.sizeO >= 2 ? 2 : 1;
    const stepMajors = state.sizeO > 1 ? 2 : 1;
    const maxWritingRows = Math.max(1, Math.floor((maxBands - firstMajor) / stepMajors) + 1);

    const samples = state.text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const rowPlan = [];
    for (const sample of samples) {
      for (let i = 0; i < state.rowsPerSample; i++) rowPlan.push(sample);
      for (let i = 0; i < state.blankRows; i++) rowPlan.push("");
    }

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `400 ${fontSize}px ${state.font}`;

    for (let r = 0; r < Math.min(maxWritingRows, rowPlan.length); r++) {
      const txt = rowPlan[r];
      const baseY = areaTop + (firstMajor + r * stepMajors) * majorStep;

      if (!txt) continue;

      // Tô đậm đường chân chữ chính của dòng viết (trùng đường kẻ 4 ô ly)
      if (state.paperType !== "blank") {
        ctx.save();
        ctx.lineWidth = 1.35;
        ctx.strokeStyle = "#3b82f6";
        ctx.beginPath();
        ctx.moveTo(startX, baseY);
        ctx.lineTo(startX + gridW, baseY);
        ctx.stroke();
        ctx.restore();
      }

      // Chấm đỏ điểm đặt bút ở đầu dòng (tùy chọn)
      if (state.startDot) {
        ctx.save();
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(startX + unitPx, baseY - targetXHeight, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const sampleW = ctx.measureText(txt).width;
      const gap = Math.max(unitPx * 3, fontSize * 0.75);
      const count = state.repeatLine ? Math.max(1, Math.floor((gridW - unitPx * 2) / (sampleW + gap))) : 1;

      for (let c = 0; c < count; c++) {
        const x = startX + unitPx + c * (sampleW + gap);
        const isFirstBold = c === 0 && state.boldFirst;
        const alpha = isFirstBold ? 0.92 : (state.opacity / 100) * 0.45;
        const rgba = hexToRgba(state.color, alpha);

        ctx.save();
        ctx.font = `${isFirstBold ? 700 : 400} ${fontSize}px ${state.font}`;
        if (!isFirstBold && state.strokeStyle === "dash") {
          ctx.setLineDash([2, 3.5]);
          ctx.lineWidth = 1.1;
          ctx.strokeStyle = hexToRgba(state.color, Math.max(0.25, state.opacity / 100));
          ctx.strokeText(txt, x, baseY);
        } else if (!isFirstBold && state.strokeStyle === "outline") {
          ctx.setLineDash([]);
          ctx.lineWidth = 1.05;
          ctx.strokeStyle = hexToRgba(state.color, Math.max(0.25, state.opacity / 100));
          ctx.strokeText(txt, x, baseY);
        } else {
          ctx.fillStyle = rgba;
          ctx.fillText(txt, x, baseY);
        }
        ctx.restore();
      }
    }
  }

  bindPills("hwSizeRow", "sizeO", true);
  bindPills("hwStyleRow", "strokeStyle");
  bindPills("hwColorRow", "color");
  bindPills("hwPaperRow", "paperType");
  bindPills("hwGridRow", "gridMm", true);

  document.getElementById("hwText").addEventListener("input", (e) => { state.text = e.target.value; draw(); });
  document.getElementById("hwTitle").addEventListener("input", (e) => { state.title = e.target.value; draw(); });
  document.getElementById("hwFont").addEventListener("change", (e) => { state.font = e.target.value; draw(); });
  document.getElementById("hwOp").addEventListener("input", (e) => {
    state.opacity = parseInt(e.target.value, 10);
    document.getElementById("hwOpLabel").textContent = `${state.opacity}%`;
    draw();
  });
  document.getElementById("hwBoldFirst").addEventListener("change", (e) => { state.boldFirst = e.target.checked; draw(); });
  document.getElementById("hwRepeat").addEventListener("change", (e) => { state.repeatLine = e.target.checked; draw(); });
  document.getElementById("hwStartDot").addEventListener("change", (e) => { state.startDot = e.target.checked; draw(); });
  document.getElementById("hwRowsPer").addEventListener("input", (e) => { state.rowsPerSample = Math.max(1, parseInt(e.target.value, 10) || 1); draw(); });
  document.getElementById("hwBlank").addEventListener("input", (e) => { state.blankRows = Math.max(0, parseInt(e.target.value, 10) || 0); draw(); });

  draw();
  if (document.fonts) {
    document.fonts.ready.then(draw);
    Promise.all([
      document.fonts.load("400 24px HP001"),
      document.fonts.load("700 24px HP001"),
    ]).then(draw);
  }
}

/* 3. TRỘN ĐỀ TRẮC NGHIỆM */
function initQuizShufflerTool(controls, preview) {
  const sample = `Câu 1: Thủ đô của Việt Nam là gì?\nA. Hà Nội\nB. Đà Nẵng\nC. TP. Hồ Chí Minh\nD. Huế\nĐáp án: A\n\nCâu 2: 12 × 5 bằng bao nhiêu?\nA. 50\nB. 60\nC. 65\nD. 70\nĐáp án: B\n\nCâu 3: Hành tinh nào gần Mặt Trời nhất?\nA. Trái Đất\nB. Sao Kim\nC. Sao Thủy\nD. Sao Hỏa\nĐáp án: C`;
  controls.innerHTML = `
    <div class="field"><label>Nhập câu hỏi (mỗi câu cách nhau 1 dòng trống)</label><textarea id="qInput" rows="10">${sample}</textarea></div>
    <div class="field"><label>Số mã đề cần trộn</label><input id="qCodes" type="number" min="1" max="6" value="2" /></div>
    <button class="btn" id="qShuffle" style="width:100%;">🔀 Trộn đề ngay</button>
  `;

  function parseQuestions(raw) {
    return raw
      .split(/\n\s*\n/)
      .map((block) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (!lines.length) return null;
        const q = lines[0].replace(/^Câu\s*\d+\s*[:.]\s*/i, "");
        const opts = [];
        let ansLetter = "";
        for (const l of lines.slice(1)) {
          const m = l.match(/^([A-D])[.)]\s*(.+)$/i);
          if (m) opts.push({ key: m[1].toUpperCase(), text: m[2] });
          const am = l.match(/^Đáp án\s*[:.]\s*([A-D])/i);
          if (am) ansLetter = am[1].toUpperCase();
        }
        return { q, opts, ansText: opts.find((o) => o.key === ansLetter)?.text || "" };
      })
      .filter(Boolean);
  }

  function render() {
    const questions = parseQuestions(document.getElementById("qInput").value);
    const numCodes = Math.min(6, Math.max(1, parseInt(document.getElementById("qCodes").value, 10) || 2));
    const letters = ["A", "B", "C", "D"];

    let out = "";
    for (let c = 1; c <= numCodes; c++) {
      const shuffledQ = shuffle(questions);
      const ansKey = [];
      out += `<div style="margin-bottom:28px;padding-bottom:18px;border-bottom:2px dashed #cbd5e1;">
        <div class="a4-header">
          <div><strong>ĐỀ KIỂM TRA TRẮC NGHIỆM</strong><br><small>Mã đề: 10${c}</small></div>
          <div style="font-size:0.9rem;">Họ và tên: ………………………………<br>Lớp: …………</div>
        </div>`;
      shuffledQ.forEach((item, idx) => {
        const sOpts = shuffle(item.opts);
        let correct = "?";
        out += `<div style="margin-bottom:12px;"><strong>Câu ${idx + 1}:</strong> ${escapeHtml(item.q)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-top:4px;">`;
        sOpts.forEach((o, oi) => {
          const l = letters[oi] || String(oi + 1);
          if (o.text === item.ansText) correct = l;
          out += `<div><strong>${l}.</strong> ${escapeHtml(o.text)}</div>`;
        });
        out += `</div></div>`;
        ansKey.push(`${idx + 1}-${correct}`);
      });
      out += `<div style="font-size:0.85rem;color:#475569;margin-top:8px;"><strong>Đáp án Mã đề 10${c}:</strong> ${ansKey.join(" | ")}</div></div>`;
    }
    preview.innerHTML = out || `<p>Vui lòng nhập ít nhất 1 câu hỏi.</p>`;
  }

  document.getElementById("qShuffle").addEventListener("click", () => {
    render();
    showToast("Đã trộn mã đề mới!");
  });
  document.getElementById("qInput").addEventListener("input", render);
  render();
}

/* 4. CHIA NHÓM & VÒNG QUAY MAY MẮN (CANVAS) */
function initGroupTool(controls, preview) {
  controls.innerHTML = `
    <div class="field"><label>Danh sách học sinh (mỗi dòng 1 tên)</label>
      <textarea id="gNames" rows="8">An\nBình\nChâu\nDũng\nHà\nHuy\nKhánh\nLan\nMinh\nNgọc\nPhúc\nTrang</textarea>
    </div>
    <div class="field"><label>Số nhóm (khi chia nhóm)</label><input id="gCount" type="number" min="2" max="12" value="3" /></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn" id="gSplit" style="flex:1;">👥 Chia nhóm</button>
      <button class="btn btn-primary" id="gWheel" style="flex:1;">🎡 Vòng quay</button>
    </div>
  `;

  function getNames() {
    return document.getElementById("gNames").value.split("\n").map((s) => s.trim()).filter(Boolean);
  }

  function renderSplit() {
    const names = shuffle(getNames());
    const nGroups = Math.min(12, Math.max(2, parseInt(document.getElementById("gCount").value, 10) || 3));
    const groups = Array.from({ length: nGroups }, () => []);
    names.forEach((name, i) => groups[i % nGroups].push(name));

    preview.innerHTML = `
      <div class="a4-header"><div><strong>KẾT QUẢ CHIA NHÓM LỚP HỌC</strong></div><div>Tổng: ${names.length} học sinh</div></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;">
        ${groups
          .map(
            (g, idx) => `
          <div style="border:1px solid #cbd5e1;border-radius:10px;padding:12px;">
            <strong>Nhóm ${idx + 1} (${g.length})</strong>
            <ol style="margin:8px 0 0;padding-left:18px;">${g.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ol>
          </div>`
          )
          .join("")}
      </div>
    `;
  }

  let angle = 0;
  let spinning = false;
  function renderWheelView() {
    const names = getNames();
    preview.innerHTML = `
      <div style="text-align:center;">
        <h3 style="margin:0 0 12px;">🎡 Vòng quay gọi tên ngẫu nhiên</h3>
        <div style="position:relative;display:inline-block;">
          <div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);font-size:1.8rem;z-index:2;">🔻</div>
          <canvas id="wheelCanvas" width="380" height="380" style="max-width:100%;"></canvas>
        </div>
        <div style="margin-top:14px;">
          <button class="btn btn-primary" id="spinBtn">✨ Quay ngay!</button>
        </div>
        <div id="spinResult" style="margin-top:16px;font-size:1.5rem;font-weight:800;color:#4f46e5;"></div>
      </div>
    `;

    const canvas = document.getElementById("wheelCanvas");
    const ctx = canvas.getContext("2d");
    const colors = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#3b82f6", "#14b8a6"];

    function drawWheel(rot) {
      const n = Math.max(1, names.length);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 175;
      const arc = (Math.PI * 2) / n;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < n; i++) {
        const start = rot + i * arc;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, start, start + arc);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(names[i] || "Trống", r - 14, 5);
        ctx.restore();
      }
    }

    drawWheel(angle);

    document.getElementById("spinBtn").addEventListener("click", () => {
      if (spinning || !names.length) return;
      spinning = true;
      document.getElementById("spinResult").textContent = "Đang quay...";
      const startAngle = angle;
      const extra = Math.PI * 8 + Math.random() * Math.PI * 6;
      const duration = 3200;
      const t0 = performance.now();

      function frame(now) {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        angle = startAngle + extra * eased;
        drawWheel(angle);
        if (p < 1) {
          requestAnimationFrame(frame);
        } else {
          spinning = false;
          const arc = (Math.PI * 2) / names.length;
          // Pointer is at -PI/2 (top)
          const norm = ((-Math.PI / 2 - angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
          const idx = Math.floor(norm / arc) % names.length;
          document.getElementById("spinResult").textContent = `🎉 Chúc mừng: ${names[idx]}`;
        }
      }
      requestAnimationFrame(frame);
    });
  }

  document.getElementById("gSplit").addEventListener("click", renderSplit);
  document.getElementById("gWheel").addEventListener("click", renderWheelView);
  renderWheelView();
}

/* 5. THỜI KHÓA BIỂU */
function initTimetableTool(controls, preview) {
  controls.innerHTML = `
    <div class="field"><label>Lớp / Tên học sinh</label><input id="ttClass" value="Lớp 4A – Học kỳ I" /></div>
    <p style="font-size:0.85rem;color:var(--muted);">Nhấp trực tiếp vào từng ô trong bảng bên phải để sửa tên môn học. Tự động lưu trên trình duyệt.</p>
    <button class="btn" id="ttReset" style="width:100%;">↺ Khôi phục mẫu</button>
  `;

  const defaultRows = [
    ["Tiết 1", "Chào cờ", "Toán", "Tiếng Việt", "Toán", "Tiếng Anh"],
    ["Tiết 2", "Toán", "Tiếng Việt", "Toán", "Tiếng Việt", "Toán"],
    ["Tiết 3", "Tiếng Việt", "Tiếng Anh", "Khoa học", "Lịch sử", "Mỹ thuật"],
    ["Tiết 4", "Đạo đức", "Âm nhạc", "Thể dục", "Tin học", "Sinh hoạt"],
  ];

  function render() {
    const cls = document.getElementById("ttClass").value;
    const saved = JSON.parse(localStorage.getItem("htm_tt") || "null") || defaultRows;
    preview.innerHTML = `
      <div class="a4-header">
        <div><strong>THỜI KHÓA BIỂU</strong><br><small>${escapeHtml(cls)}</small></div>
        <div style="font-size:0.9rem;">Năm học 2026 – 2027</div>
      </div>
      <table class="tt-table">
        <thead><tr><th>Tiết</th><th>Thứ 2</th><th>Thứ 3</th><th>Thứ 4</th><th>Thứ 5</th><th>Thứ 6</th></tr></thead>
        <tbody>
          ${saved
            .map(
              (r, ri) =>
                `<tr>${r
                  .map((cell, ci) =>
                    ci === 0
                      ? `<th>${escapeHtml(cell)}</th>`
                      : `<td contenteditable="true" data-r="${ri}" data-c="${ci}">${escapeHtml(cell)}</td>`
                  )
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;

    preview.querySelectorAll("td[contenteditable]").forEach((td) => {
      td.addEventListener("input", () => {
        const cur = JSON.parse(localStorage.getItem("htm_tt") || "null") || defaultRows;
        cur[parseInt(td.dataset.r, 10)][parseInt(td.dataset.c, 10)] = td.textContent.trim();
        localStorage.setItem("htm_tt", JSON.stringify(cur));
      });
    });
  }

  document.getElementById("ttClass").addEventListener("input", render);
  document.getElementById("ttReset").addEventListener("click", () => {
    localStorage.removeItem("htm_tt");
    render();
    showToast("Đã khôi phục thời khóa biểu mẫu");
  });
  render();
}

/* 6. GIẤY KHEN (CANVAS A4) */
function initCertificateTool(controls, preview) {
  controls.innerHTML = `
    <div class="field"><label>Tên trường / Đơn vị</label><input id="ckSchool" value="TRƯỜNG TIỂU HỌC HỌC THÔNG MINH" /></div>
    <div class="field"><label>Danh hiệu</label><input id="ckAward" value="GIẤY KHEN" /></div>
    <div class="field"><label>Tặng học sinh</label><input id="ckName" value="Nguyễn Minh An" /></div>
    <div class="field"><label>Thành tích</label><textarea id="ckReason" rows="3">Đã có thành tích xuất sắc trong học tập và rèn luyện học kỳ I</textarea></div>
    <div class="field"><label>Màu khung</label>
      <select id="ckColor">
        <option value="#b45309" selected>Vàng kim trang trọng</option>
        <option value="#1d4ed8">Xanh dương hoàng gia</option>
        <option value="#b91c1c">Đỏ thắm truyền thống</option>
      </select>
    </div>
  `;

  const { ctx, W, H } = setupA4Canvas(preview, getSlug());

  function draw() {
    const school = document.getElementById("ckSchool").value;
    const award = document.getElementById("ckAward").value;
    const name = document.getElementById("ckName").value;
    const reason = document.getElementById("ckReason").value;
    const color = document.getElementById("ckColor").value;

    ctx.clearRect(0, 0, W, H);
    const grad = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 620);
    grad.addColorStop(0, "#fffdf5");
    grad.addColorStop(1, "#ffffff");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Outer & inner ornate borders
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.strokeRect(32, 32, W - 64, H - 64);
    ctx.lineWidth = 2;
    ctx.strokeRect(46, 46, W - 92, H - 92);

    // Corner squares
    [[32, 32], [W - 54, 32], [32, H - 54], [W - 54, H - 54]].forEach(([x, y]) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 22, 22);
    });

    ctx.textAlign = "center";
    ctx.fillStyle = "#334155";
    ctx.font = "700 18px 'Poppins', 'Be Vietnam Pro', sans-serif";
    ctx.fillText(school, W / 2, 130);

    ctx.fillStyle = color;
    ctx.font = "800 54px 'Poppins', 'Be Vietnam Pro', sans-serif";
    ctx.fillText(award, W / 2, 235);

    ctx.fillStyle = "#475569";
    ctx.font = "500 18px 'Poppins', 'Be Vietnam Pro', sans-serif";
    ctx.fillText("Trân trọng trao tặng em:", W / 2, 315);

    ctx.fillStyle = "#0f172a";
    ctx.font = "700 44px 'Times New Roman', serif";
    ctx.fillText(name, W / 2, 395);

    // Word-wrap achievement text
    ctx.fillStyle = "#334155";
    ctx.font = "400 20px 'Poppins', 'Be Vietnam Pro', sans-serif";
    const words = reason.split(/\s+/);
    let line = "";
    let y = 475;
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > W - 180) {
        ctx.fillText(line, W / 2, y);
        line = w;
        y += 32;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, W / 2, y);

    // Medal emblem
    ctx.beginPath();
    ctx.arc(W / 2, 690, 42, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 28px sans-serif";
    ctx.fillText("★", W / 2, 700);

    // Footer signatures
    ctx.fillStyle = "#334155";
    ctx.font = "600 16px 'Poppins', 'Be Vietnam Pro', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("HỌC THÔNG MINH", 96, H - 140);
    ctx.textAlign = "right";
    ctx.fillText("Ngày ...... tháng ...... năm 2026", W - 96, H - 170);
    ctx.fillText("GIÁO VIÊN CHỦ NHIỆM", W - 96, H - 140);
  }

  ["ckSchool", "ckAward", "ckName", "ckReason", "ckColor"].forEach((id) =>
    document.getElementById(id).addEventListener("input", draw)
  );
  draw();
  if (document.fonts) {
    document.fonts.ready.then(draw);
    Promise.all([
      document.fonts.load("400 24px HP001"),
      document.fonts.load("700 24px HP001"),
    ]).then(draw);
  }
}

/* 7. CÔNG CỤ TRÊN LỚP (ĐỒNG HỒ & ĐIỂM NHÓM) */
function initClassroomTool(controls, preview) {
  controls.innerHTML = `
    <div class="field"><label>Đặt thời gian (giây)</label><input id="clSec" type="number" min="10" max="3600" value="180" /></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
      <button class="btn" data-t="60">1 phút</button>
      <button class="btn" data-t="180">3 phút</button>
      <button class="btn" data-t="300">5 phút</button>
    </div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn-primary" id="clStart" style="flex:1;">▶ Bắt đầu</button>
      <button class="btn" id="clReset" style="flex:1;">↺ Đặt lại</button>
    </div>
  `;

  let remain = 180;
  let timer = null;
  const scores = [0, 0, 0, 0];

  function fmt(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function render() {
    preview.innerHTML = `
      <div style="text-align:center;padding:24px 0;">
        <div style="font-size:0.95rem;color:#475569;">⏱️ ĐỒNG HỒ ĐẾM NGƯỢC LỚP HỌC</div>
        <div id="clDisplay" style="font-size:5rem;font-weight:900;font-family:monospace;color:${remain <= 10 ? "#dc2626" : "#4f46e5"};margin:12px 0;">${fmt(remain)}</div>
      </div>
      <hr style="border:none;border-top:1px dashed #cbd5e1;margin:18px 0;">
      <h3 style="text-align:center;margin:0 0 14px;">🏆 Bảng điểm thi đua các tổ</h3>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;text-align:center;">
        ${scores
          .map(
            (sc, i) => `
          <div style="border:1px solid #cbd5e1;border-radius:12px;padding:12px;">
            <strong>Tổ ${i + 1}</strong>
            <div style="font-size:2rem;font-weight:800;margin:8px 0;">${sc}</div>
            <div style="display:flex;justify-content:center;gap:6px;">
              <button class="btn" data-team="${i}" data-d="-1">-1</button>
              <button class="btn btn-primary" data-team="${i}" data-d="1">+1</button>
            </div>
          </div>`
          )
          .join("")}
      </div>
    `;

    preview.querySelectorAll("button[data-team]").forEach((b) => {
      b.addEventListener("click", () => {
        scores[parseInt(b.dataset.team, 10)] += parseInt(b.dataset.d, 10);
        render();
      });
    });
  }

  controls.querySelectorAll("button[data-t]").forEach((b) => {
    b.addEventListener("click", () => {
      clearInterval(timer);
      timer = null;
      remain = parseInt(b.dataset.t, 10);
      document.getElementById("clSec").value = remain;
      render();
    });
  });

  document.getElementById("clStart").addEventListener("click", () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      document.getElementById("clStart").textContent = "▶ Tiếp tục";
      return;
    }
    document.getElementById("clStart").textContent = "⏸ Tạm dừng";
    timer = setInterval(() => {
      if (remain > 0) {
        remain--;
        const disp = document.getElementById("clDisplay");
        if (disp) {
          disp.textContent = fmt(remain);
          disp.style.color = remain <= 10 ? "#dc2626" : "#4f46e5";
        }
      } else {
        clearInterval(timer);
        timer = null;
        showToast("⏰ Hết giờ!");
      }
    }, 1000);
  });

  document.getElementById("clReset").addEventListener("click", () => {
    clearInterval(timer);
    timer = null;
    remain = parseInt(document.getElementById("clSec").value, 10) || 180;
    document.getElementById("clStart").textContent = "▶ Bắt đầu";
    render();
  });

  render();
}

/* 8. Ô CHỮ / TÌM TỪ (WORD SEARCH) */
function initWordSearchTool(controls, preview) {
  controls.innerHTML = `
    <div class="field"><label>Danh sách từ cần tìm (mỗi dòng 1 từ, không dấu)</label>
      <textarea id="wsWords" rows="7">APPLE\nBANANA\nORANGE\nSCHOOL\nTEACHER\nBOOK\nPENCIL</textarea>
    </div>
    <div class="field"><label>Kích thước lưới</label>
      <select id="wsSize">
        <option value="10" selected>10 × 10</option>
        <option value="12">12 × 12</option>
      </select>
    </div>
    <div class="field"><label><input id="wsAns" type="checkbox" style="width:auto;margin-right:6px;" /> Tô màu đáp án</label></div>
    <button class="btn" id="wsGen" style="width:100%;">🎲 Tạo bảng mới</button>
  `;

  function render() {
    const size = parseInt(document.getElementById("wsSize").value, 10) || 10;
    const showAns = document.getElementById("wsAns").checked;
    const words = document
      .getElementById("wsWords")
      .value.split("\n")
      .map((w) => w.trim().toUpperCase().replace(/[^A-Z]/g, ""))
      .filter((w) => w.length >= 2 && w.length <= size);

    const grid = Array.from({ length: size }, () => Array(size).fill(""));
    const used = Array.from({ length: size }, () => Array(size).fill(false));
    const dirs = [[0, 1], [1, 0], [1, 1]];

    for (const w of words) {
      for (let tries = 0; tries < 60; tries++) {
        const [dr, dc] = dirs[randInt(0, dirs.length - 1)];
        const r0 = randInt(0, size - 1);
        const c0 = randInt(0, size - 1);
        const rEnd = r0 + dr * (w.length - 1);
        const cEnd = c0 + dc * (w.length - 1);
        if (rEnd < 0 || rEnd >= size || cEnd < 0 || cEnd >= size) continue;
        let ok = true;
        for (let k = 0; k < w.length; k++) {
          const ch = grid[r0 + dr * k][c0 + dc * k];
          if (ch && ch !== w[k]) { ok = false; break; }
        }
        if (ok) {
          for (let k = 0; k < w.length; k++) {
            grid[r0 + dr * k][c0 + dc * k] = w[k];
            used[r0 + dr * k][c0 + dc * k] = true;
          }
          break;
        }
      }
    }

    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!grid[r][c]) grid[r][c] = alpha[randInt(0, alpha.length - 1)];
      }
    }

    preview.innerHTML = `
      <div class="a4-header">
        <div><strong>TRÒ CHƠI TÌM TỪ (WORD SEARCH)</strong></div>
        <div style="font-size:0.9rem;">Họ và tên: ………………………………</div>
      </div>
      <table class="ws-table">
        ${grid.map((row, r) => `<tr>${row.map((ch, c) => `<td class="${showAns && used[r][c] ? "hl" : ""}">${ch}</td>`).join("")}</tr>`).join("")}
      </table>
      <div style="margin-top:20px;text-align:center;">
        <strong>Từ cần tìm (${words.length}):</strong> ${words.map((w) => `<span style="display:inline-block;margin:4px 8px;padding:2px 8px;border:1px solid #cbd5e1;border-radius:6px;">${w}</span>`).join("")}
      </div>
    `;
  }

  ["wsWords", "wsSize", "wsAns"].forEach((id) => document.getElementById(id).addEventListener("input", render));
  document.getElementById("wsGen").addEventListener("click", render);
  render();
}

/* 9. GIẤY KHUÔNG NHẠC (CANVAS A4) */
function initMusicStaffTool(controls, preview) {
  controls.innerHTML = `
    <div class="field"><label>Tiêu đề</label><input id="muTitle" value="GIẤY KHUÔNG NHẠC" /></div>
    <div class="field"><label>Số khuông nhạc</label><input id="muRows" type="number" min="4" max="12" value="9" /></div>
    <div class="field"><label><input id="muClef" type="checkbox" checked style="width:auto;margin-right:6px;" /> Hiện khóa Sol (𝄞)</label></div>
  `;

  const { ctx, W, H } = setupA4Canvas(preview, getSlug());

  function draw() {
    const title = document.getElementById("muTitle").value;
    const rows = Math.min(12, Math.max(4, parseInt(document.getElementById("muRows").value, 10) || 9));
    const clef = document.getElementById("muClef").checked;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#0f172a";
    ctx.font = "700 20px 'Poppins', 'Be Vietnam Pro', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, W / 2, 54);

    ctx.font = "400 13px 'Poppins', 'Be Vietnam Pro', sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#475569";
    ctx.fillText("Họ và tên: .................................................................", 52, 86);

    const startY = 128;
    const stepY = (H - startY - 60) / rows;
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;

    for (let i = 0; i < rows; i++) {
      const y0 = startY + i * stepY;
      for (let l = 0; l < 5; l++) {
        const y = y0 + l * 9;
        ctx.beginPath();
        ctx.moveTo(52, y);
        ctx.lineTo(W - 52, y);
        ctx.stroke();
      }
      if (clef) {
        ctx.fillStyle = "#0f172a";
        ctx.font = "400 42px serif";
        ctx.fillText("𝄞", 56, y0 + 36);
      }
    }
  }

  ["muTitle", "muRows", "muClef"].forEach((id) => document.getElementById(id).addEventListener("input", draw));
  draw();
  if (document.fonts) {
    document.fonts.ready.then(draw);
    Promise.all([
      document.fonts.load("400 24px HP001"),
      document.fonts.load("700 24px HP001"),
    ]).then(draw);
  }
}

/* 10. SUDOKU */
function initSudokuTool(controls, preview) {
  controls.innerHTML = `
    <div class="field"><label>Độ khó (4×4 cho Tiểu học)</label>
      <select id="suDiff">
        <option value="6" selected>Dễ (ẩn 6 ô)</option>
        <option value="8">Trung bình (ẩn 8 ô)</option>
        <option value="10">Khó (ẩn 10 ô)</option>
      </select>
    </div>
    <div class="field"><label><input id="suAns" type="checkbox" style="width:auto;margin-right:6px;" /> Kèm đáp án</label></div>
    <button class="btn" id="suGen" style="width:100%;">🎲 Tạo Sudoku mới</button>
  `;

  function makeBoard(hideCount) {
    const base = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ];
    const map = shuffle([1, 2, 3, 4]);
    const sol = base.map((r) => r.map((v) => map[v - 1]));
    const puz = sol.map((r) => [...r]);
    const cells = shuffle([...Array(16).keys()]).slice(0, hideCount);
    for (const idx of cells) puz[Math.floor(idx / 4)][idx % 4] = 0;
    return { puz, sol };
  }

  function renderGrid(g) {
    return `<table style="border-collapse:collapse;margin:0 auto;">${g
      .map(
        (r, ri) =>
          `<tr>${r
            .map(
              (v, ci) =>
                `<td style="width:44px;height:44px;text-align:center;font-size:1.25rem;font-weight:700;border:1px solid #94a3b8;${
                  ci === 1 ? "border-right:2px solid #0f172a;" : ""
                }${ri === 1 ? "border-bottom:2px solid #0f172a;" : ""}">${v || ""}</td>`
            )
            .join("")}</tr>`
      )
      .join("")}</table>`;
  }

  function render() {
    const hideCount = parseInt(document.getElementById("suDiff").value, 10) || 6;
    const showAns = document.getElementById("suAns").checked;
    const boards = [makeBoard(hideCount), makeBoard(hideCount), makeBoard(hideCount), makeBoard(hideCount)];

    preview.innerHTML = `
      <div class="a4-header"><div><strong>PHIẾU TRÒ CHƠI SUDOKU 4×4</strong></div><div>Họ và tên: ………………………………</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;">
        ${boards.map((b, i) => `<div><p style="text-align:center;font-weight:700;">Bảng ${i + 1}</p>${renderGrid(b.puz)}</div>`).join("")}
      </div>
      ${
        showAns
          ? `<div style="margin-top:24px;padding-top:12px;border-top:1px dashed #94a3b8;font-size:0.85rem;">
              <strong>Đáp án:</strong> ${boards.map((b, i) => `Bảng ${i + 1}: [${b.sol.map((r) => r.join("")).join(" / ")}]`).join(" • ")}
            </div>`
          : ""
      }
    `;
  }

  ["suDiff", "suAns"].forEach((id) => document.getElementById(id).addEventListener("input", render));
  document.getElementById("suGen").addEventListener("click", render);
  render();
}

/* 11. THẺ HỌC TỪ (FLASHCARDS) */
function initFlashcardTool(controls, preview, tool) {
  controls.innerHTML = `
    <div class="field"><label>Danh sách thẻ (Mặt trước | Mặt sau, mỗi dòng 1 thẻ)</label>
      <textarea id="fcInput" rows="8">Apple | Quả táo\nBook | Quyển sách\nCat | Con mèo\nDog | Con chó\nSun | Mặt trời\nMoon | Mặt trăng\nTree | Cái cây\nWater | Nước</textarea>
    </div>
  `;

  function render() {
    const items = document
      .getElementById("fcInput")
      .value.split("\n")
      .map((l) => l.split("|").map((s) => s.trim()))
      .filter((p) => p[0]);

    preview.innerHTML = `
      <div class="a4-header"><div><strong>${escapeHtml(tool.title.toUpperCase())}</strong></div><div>Cắt theo đường nét đứt</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        ${items
          .map(
            (p) => `
          <div style="border:2px dashed #64748b;border-radius:12px;padding:20px;text-align:center;min-height:110px;display:flex;flex-direction:column;justify-content:center;">
            <div style="font-size:1.3rem;font-weight:800;color:#4f46e5;">${escapeHtml(p[0])}</div>
            ${p[1] ? `<div style="font-size:1rem;color:#475569;margin-top:6px;">${escapeHtml(p[1])}</div>` : ""}
          </div>`
          )
          .join("")}
      </div>
    `;
  }

  document.getElementById("fcInput").addEventListener("input", render);
  render();
}

/* 12. STUDIO A4 ĐA NĂNG CHO CÁC CÔNG CỤ CÒN LẠI */
function initGenericTool(controls, preview, tool) {
  controls.innerHTML = `
    <div class="field"><label>Tiêu đề phiếu / tài liệu</label><input id="genTitle" value="${escapeHtml(tool.title.toUpperCase())}" /></div>
    <div class="field"><label>Hướng dẫn / Đề bài</label><textarea id="genPrompt" rows="4">${escapeHtml(tool.description)}</textarea></div>
    <div class="field"><label>Số dòng trình bày</label><input id="genLines" type="number" min="4" max="20" value="12" /></div>
  `;

  function render() {
    const title = document.getElementById("genTitle").value;
    const prompt = document.getElementById("genPrompt").value;
    const lines = Math.min(20, Math.max(4, parseInt(document.getElementById("genLines").value, 10) || 12));
    let rowsHtml = "";
    for (let i = 0; i < lines; i++) {
      rowsHtml += `<div style="height:34px;border-bottom:1px dashed #cbd5e1;"></div>`;
    }
    preview.innerHTML = `
      <div class="a4-header">
        <div><strong>${escapeHtml(title)}</strong><br><small>${escapeHtml(tool.group)} • ${escapeHtml(tool.grade_label || "Mọi khối lớp")}</small></div>
        <div style="text-align:right;font-size:0.9rem;">Họ và tên: ………………………………<br>Lớp: …………</div>
      </div>
      <p style="background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:18px;">${escapeHtml(prompt)}</p>
      ${rowsHtml}
    `;
  }

  ["genTitle", "genPrompt", "genLines"].forEach((id) =>
    document.getElementById(id).addEventListener("input", render)
  );
  render();
}

async function init() {
  initTheme();
  const res = await fetch("data/tools.json");
  const data = await res.json();
  const slug = getSlug();
  const tool = data.tools.find((t) => t.slug === slug) || data.tools[0];

  document.title = `${tool.title} – Học Thông Minh`;
  document.getElementById("toolTitle").textContent = tool.title;
  document.getElementById("toolLead").textContent = tool.lead_text || tool.description;
  document.getElementById("printBtn").addEventListener("click", () => window.print());

  const controls = document.getElementById("controlsContainer");
  const preview = document.getElementById("previewArea");

  if (tool.slug === "phieu-toan") initMathTool(controls, preview, tool);
  else if (["tap-viet-chu", "giay-o-ly", "tap-to-net-co-ban"].includes(tool.slug)) initHandwritingTool(controls, preview);
  else if (tool.slug === "tron-de-trac-nghiem") initQuizShufflerTool(controls, preview);
  else if (tool.slug === "chia-nhom") initGroupTool(controls, preview);
  else if (tool.slug === "thoi-khoa-bieu") initTimetableTool(controls, preview);
  else if (tool.slug === "giay-khen") initCertificateTool(controls, preview);
  else if (tool.slug === "cong-cu-tren-lop") initClassroomTool(controls, preview);
  else if (["o-chu", "tim-tu"].includes(tool.slug)) initWordSearchTool(controls, preview);
  else if (tool.slug === "giay-khuong-nhac") initMusicStaffTool(controls, preview);
  else if (tool.slug === "sudoku") initSudokuTool(controls, preview);
  else if (tool.slug.startsWith("the-") || tool.group === "Thẻ, bảng và khen thưởng") initFlashcardTool(controls, preview, tool);
  else initGenericTool(controls, preview, tool);
}

init();
