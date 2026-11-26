const TOPIC_LABELS = {
  all: "Mọi chủ đề",
  viet: "Giấy kẻ, tập viết",
  toan: "Toán",
  tv: "Tiếng Việt, Ngữ văn",
  anh: "Tiếng Anh",
  nhac: "Âm nhạc",
  de: "Đề, kiểm tra",
  lop: "Lớp học",
  game: "Tô màu, trò chơi",
  pdf: "PDF, ảnh",
};

const GRADE_LABELS = {
  all: "Tất cả khối lớp",
  "lop-1": "Lớp 1",
  "lop-2": "Lớp 2",
  "lop-3": "Lớp 3",
  "lop-4": "Lớp 4",
  "lop-5": "Lớp 5",
  "thcs-thpt": "THCS, THPT",
};

const state = {
  data: null,
  grade: "all",
  aud: "all",
  topic: "all",
  group: "all",
  onlyFav: false,
  query: "",
  expanded: false,
  favorites: new Set(JSON.parse(localStorage.getItem("htm_favs") || "[]")),
};

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

function saveFavs() {
  localStorage.setItem("htm_favs", JSON.stringify([...state.favorites]));
}

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function setGrade(grade) {
  state.grade = grade;
  document.querySelectorAll("#gradeNav .grade-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.grade === grade);
  });
  renderTools();
}

function renderDrawer() {
  const gradesEl = document.getElementById("drawerGrades");
  const groupsEl = document.getElementById("drawerGroups");
  const gradeKeys = ["all", "lop-1", "lop-2", "lop-3", "lop-4", "lop-5", "thcs-thpt"];

  gradesEl.innerHTML = gradeKeys
    .map((g) => {
      const count =
        g === "all"
          ? state.data.tools.length
          : state.data.tools.filter((t) => (t.grades || []).includes(g)).length;
      return `<button class="drawer-link" data-grade="${g}"><span>${GRADE_LABELS[g]}</span><span class="count-label">${count}</span></button>`;
    })
    .join("");

  gradesEl.querySelectorAll(".drawer-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      setGrade(btn.dataset.grade);
      closeDrawer();
    });
  });

  const groups = ["all", ...(state.data.groups || [])];
  groupsEl.innerHTML = groups
    .map((g) => {
      const count =
        g === "all"
          ? state.data.tools.length
          : state.data.tools.filter((t) => t.group === g).length;
      return `<button class="drawer-link" data-group="${g}"><span>${g === "all" ? "Tất cả nhóm" : g}</span><span class="count-label">${count}</span></button>`;
    })
    .join("");

  groupsEl.querySelectorAll(".drawer-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.group = btn.dataset.group;
      renderChips();
      renderTools();
      closeDrawer();
    });
  });
}

function openDrawer() {
  document.getElementById("menuDrawer").classList.add("open");
  document.getElementById("drawerBackdrop").classList.add("open");
}

function closeDrawer() {
  document.getElementById("menuDrawer").classList.remove("open");
  document.getElementById("drawerBackdrop").classList.remove("open");
}

function renderChips() {
  const topicRow = document.getElementById("topicChips");
  const topics = ["all", ...(state.data.topics || [])];
  topicRow.innerHTML =
    topics
      .map(
        (t) =>
          `<button class="chip ${!state.onlyFav && state.topic === t ? "active" : ""}" data-topic="${t}">${
            TOPIC_LABELS[t] || t
          }</button>`
      )
      .join("") +
    `<button class="chip ${state.onlyFav ? "active" : ""}" id="favFilterChip">★ Yêu thích (${state.favorites.size})</button>`;

  topicRow.querySelectorAll(".chip[data-topic]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.onlyFav = false;
      state.topic = btn.dataset.topic;
      renderChips();
      renderTools();
    });
  });

  document.getElementById("favFilterChip").addEventListener("click", () => {
    state.onlyFav = !state.onlyFav;
    renderChips();
    renderTools();
  });

  const groupRow = document.getElementById("groupChips");
  const groups = ["all", ...(state.data.groups || [])];
  groupRow.innerHTML = groups
    .map(
      (g) =>
        `<button class="chip ${state.group === g ? "active" : ""}" data-group="${g}">${
          g === "all" ? "Tất cả nhóm" : g
        }</button>`
    )
    .join("");

  groupRow.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.group = btn.dataset.group;
      renderChips();
      renderTools();
    });
  });
}

function renderFeatured() {
  const grid = document.getElementById("featuredGrid");
  const featured = state.data.tools.filter((t) => t.featured).slice(0, 4);
  grid.innerHTML = featured
    .map(
      (t) => `
      <a class="featured-card" href="tool.html?slug=${encodeURIComponent(t.slug)}" style="--card-bg:${t.color_bg || "#eef2ff"}">
        <div>
          <h3>${t.title}</h3>
          <p class="tool-desc">${t.description}</p>
        </div>
        <div class="meta">${t.grade_label || "Mọi khối lớp"} • Mở công cụ →</div>
      </a>
    `
    )
    .join("");
}

function getFilteredTools() {
  const q = normalize(state.query.trim());
  return state.data.tools.filter((t) => {
    if (state.onlyFav && !state.favorites.has(t.slug)) return false;
    if (state.grade !== "all" && !(t.grades || []).includes(state.grade)) return false;
    if (state.aud !== "all" && t.audience_code !== "b" && t.audience_code !== state.aud) return false;
    if (state.topic !== "all" && t.topic !== state.topic) return false;
    if (state.group !== "all" && t.group !== state.group) return false;
    if (q) {
      const hay = normalize(`${t.title} ${t.description} ${t.group} ${t.search_text}`);
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderTools() {
  const filtered = getFilteredTools();
  const sorted = [...filtered].sort((a, b) => {
    const af = state.favorites.has(a.slug) ? 0 : 1;
    const bf = state.favorites.has(b.slug) ? 0 : 1;
    return af - bf || a.index - b.index;
  });

  const isFiltered =
    state.onlyFav ||
    state.grade !== "all" ||
    state.aud !== "all" ||
    state.topic !== "all" ||
    state.group !== "all" ||
    state.query.trim() !== "";

  const limit = state.expanded || isFiltered ? sorted.length : 18;
  const visible = sorted.slice(0, limit);

  document.getElementById("toolsCount").textContent = `Đang hiện ${visible.length} / ${sorted.length} công cụ phù hợp (tổng ${state.data.tools.length})`;

  const grid = document.getElementById("toolsGrid");
  if (!visible.length) {
    grid.innerHTML = `<p style="color:var(--muted)">Không tìm thấy công cụ nào khớp bộ lọc hiện tại.</p>`;
  } else {
    grid.innerHTML = visible
      .map((t, idx) => {
        const isFav = state.favorites.has(t.slug);
        const delay = Math.min(idx, 12) * 22;
        return `
        <article class="tool-card" style="--card-bg:${t.color_bg || "#eef2ff"};--card-accent:${t.color_accent || "#4f46e5"};animation-delay:${delay}ms">
          <div class="tool-top">
            <h3 class="tool-title">${t.title}</h3>
            <button class="fav-btn ${isFav ? "active" : ""}" data-slug="${t.slug}" title="Đánh dấu yêu thích">
              ${isFav ? "★" : "☆"}
            </button>
          </div>
          <div class="badges">
            <span class="badge group">${t.group}</span>
            ${t.grade_label ? `<span class="badge">${t.grade_label}</span>` : ""}
            <span class="badge">${t.audience_label}</span>
          </div>
          <p class="tool-desc">${t.description}</p>
          <a class="tool-cta" href="tool.html?slug=${encodeURIComponent(t.slug)}">Mở công cụ →</a>
        </article>
      `;
      })
      .join("");
  }

  grid.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.slug;
      if (state.favorites.has(slug)) {
        state.favorites.delete(slug);
        showToast("Đã bỏ khỏi danh sách yêu thích");
      } else {
        state.favorites.add(slug);
        showToast("Đã thêm vào danh sách yêu thích ★");
      }
      saveFavs();
      renderChips();
      renderTools();
    });
  });

  const expandBtn = document.getElementById("toggleExpandBtn");
  if (!isFiltered && sorted.length > 18) {
    expandBtn.style.display = "inline-flex";
    expandBtn.textContent = state.expanded
      ? "Thu gọn danh sách"
      : `Xem tất cả ${sorted.length} công cụ`;
  } else {
    expandBtn.style.display = "none";
  }
}

function renderFaq() {
  const faqEl = document.getElementById("faqList");
  const items = [
    ...(state.data.faq || []),
    {
      question: "Dữ liệu lớp học hay đề thi có bị lưu lên máy chủ không?",
      answer: "Không. Toàn bộ công cụ xử lý trực tiếp trên trình duyệt của bạn.",
    },
    {
      question: "Làm sao để lưu thành file PDF?",
      answer: "Trong mỗi công cụ, nhấn nút 'In / Lưu PDF (A4)' rồi chọn đích in là 'Save as PDF / Lưu dưới dạng PDF'.",
    },
  ];
  faqEl.innerHTML = items
    .map(
      (f) => `
      <details class="faq-item">
        <summary>${f.question}</summary>
        <p>${f.answer}</p>
      </details>
    `
    )
    .join("");
}

async function init() {
  initTheme();

  const res = await fetch("data/tools.json");
  state.data = await res.json();

  renderDrawer();
  renderChips();
  renderFeatured();
  renderTools();
  renderFaq();

  document.getElementById("openDrawerBtn").addEventListener("click", openDrawer);
  document.getElementById("closeDrawerBtn").addEventListener("click", closeDrawer);
  document.getElementById("drawerBackdrop").addEventListener("click", closeDrawer);

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    state.query = e.target.value;
    renderTools();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === "Escape") {
      closeDrawer();
    }
  });

  document.querySelectorAll("#gradeNav .grade-btn").forEach((btn) => {
    btn.addEventListener("click", () => setGrade(btn.dataset.grade));
  });

  document.querySelectorAll("#audGroup .aud-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#audGroup .aud-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.aud = btn.dataset.aud;
      renderTools();
    });
  });

  document.getElementById("toggleExpandBtn").addEventListener("click", () => {
    state.expanded = !state.expanded;
    renderTools();
  });
}

init();
