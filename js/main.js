const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== Mobil menyu =====
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// ===== Ekranga kirganda paydo bo'lish (yuklanish ekranidan keyin ishga tushadi) =====
let revealStarted = false;
function initReveal() {
  if (revealStarted) return;
  revealStarted = true;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

// ===== Yuklanish ekrani =====
const loader = document.getElementById("loader");
const pct = document.getElementById("loaderPct");
let loaderDone = false;
function hideLoader() {
  if (loaderDone) return;
  loaderDone = true;
  document.body.classList.remove("is-loading");
  if (loader) {
    loader.classList.add("is-done");
    setTimeout(() => loader.remove(), 800);
  }
  initReveal();
}
if (!loader || reduce) {
  hideLoader();
} else {
  const t0 = performance.now(), dur = 1200;
  (function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    pct.textContent = Math.round(p * 100);
    if (p < 1) requestAnimationFrame(step); else setTimeout(hideLoader, 250);
  })(t0);
  setTimeout(hideLoader, 3500); // zaxira: hech qachon qotib qolmasin
}

// ===== Raqamlar sanash animatsiyasi =====
const counter = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counter.unobserve(e.target);
    if (reduce) return;
    const el = e.target;
    const end = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const t0 = performance.now(), dur = 1400;
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v.toLocaleString("en-US") + (p === 1 ? suf : "");
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach(el => counter.observe(el));

// ===== Skroll chizig'i va faol bo'lim =====
const bar = document.getElementById("progress");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = "scaleX(" + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ")";
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();

const navMap = new Map();
links.querySelectorAll('a[href^="#"]:not(.btn)').forEach(a => navMap.set(a.getAttribute("href").slice(1), a));
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const a = navMap.get(e.target.id);
    if (a && e.isIntersecting) { navMap.forEach(x => x.classList.remove("is-active")); a.classList.add("is-active"); }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

// ===== Kursor halqasi (faqat sichqonchali qurilmalarda) =====
const ring = document.getElementById("cursor");
if (ring && !reduce && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let tx = 0, ty = 0, x = 0, y = 0;
  addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; ring.classList.add("is-on"); }, { passive: true });
  document.addEventListener("mouseover", e => ring.classList.toggle("is-hover", !!e.target.closest("a, button")));
  document.documentElement.addEventListener("mouseleave", () => ring.classList.remove("is-on"));
  (function loop() {
    x += (tx - x) * 0.18; y += (ty - y) * 0.18;
    ring.style.transform = "translate3d(" + x + "px," + y + "px,0) translate(-50%,-50%)";
    requestAnimationFrame(loop);
  })();
}

// ===== Hero: sichqonchaga javob beradigan 3D ikosaedr (canvas, kutubxonasiz) =====
(function wire() {
  const cv = document.getElementById("wire");
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d");
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw = [];
  [-1, 1].forEach(a => [-phi, phi].forEach(b => { raw.push([0, a, b], [a, b, 0], [b, 0, a]); }));
  const V = raw.map(v => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; });
  const E = [];
  for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
    if (Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]) < 1.1) E.push([i, j]);
  }
  let w = 0, h = 0, dpr = 1, ax = 0.4, ay = 0, tax = 0.4, tay = 0, running = true, drift = 0;
  const accent = "79,140,255", accent2 = "138,107,255";

  function size() {
    const r = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function project(v) {
    const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
    let x = v[0] * cy + v[2] * sy, z = -v[0] * sy + v[2] * cy, y = v[1] * cx - z * sx; z = v[1] * sx + z * cx;
    const s = (Math.min(w, h) * 0.34) * (3 / (3 - z * 0.6));
    return [w / 2 + x * s, h / 2 + y * s, z];
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const P = V.map(project);
    E.forEach(([i, j]) => {
      const a = P[i], b = P[j], depth = (a[2] + b[2]) / 2, al = 0.25 + (depth + 1) * 0.3;
      const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]);
      g.addColorStop(0, "rgba(" + accent + "," + al + ")"); g.addColorStop(1, "rgba(" + accent2 + "," + al + ")");
      ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    });
    P.forEach(p => { ctx.fillStyle = "rgba(238,240,246," + (0.5 + (p[2] + 1) * 0.25) + ")"; ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, 6.283); ctx.fill(); });
  }
  function frame() {
    if (!running) return;
    drift += 0.004; tay += 0.004;
    ax += (tax - ax) * 0.06; ay += (tay - ay) * 0.06;
    draw(); requestAnimationFrame(frame);
  }
  size(); draw();
  addEventListener("resize", () => { size(); draw(); });
  if (reduce) return;
  addEventListener("mousemove", e => {
    tax = 0.4 + (e.clientY / innerHeight - 0.5) * 1.6;
    tay = drift + (e.clientX / innerWidth - 0.5) * 2.4;
  }, { passive: true });
  new IntersectionObserver(es => { const v = es[0].isIntersecting; if (v && !running) { running = true; frame(); } running = v; }).observe(cv);
  frame();
})();

// ===== Joriy yil =====
document.getElementById("year").textContent = new Date().getFullYear();
