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

// ===== Til almashtirgich (UZ / EN) =====
const langBtn = document.getElementById("langBtn");
function setLang(lang) {
  const dict = window.I18N[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    if (dict[el.dataset.i18n]) el.textContent = dict[el.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    if (dict[el.dataset.i18nHtml]) el.innerHTML = dict[el.dataset.i18nHtml];
  });
  langBtn.textContent = lang === "uz" ? "EN" : "UZ";
  try { localStorage.setItem("lang", lang); } catch (e) {}
}
langBtn.addEventListener("click", () =>
  setLang(document.documentElement.lang === "uz" ? "en" : "uz")
);
let saved = "uz";
try { saved = localStorage.getItem("lang") || "uz"; } catch (e) {}
if (saved === "en") setLang("en");

// ===== Ekranga kirganda paydo bo'lish =====
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ===== Raqamlar sanash animatsiyasi =====
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const counter = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counter.unobserve(e.target);
    const el = e.target;
    const end = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    if (reduce) return;
    const t0 = performance.now(), dur = 1400;
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v.toLocaleString("en-US") + (p === 1 ? suf : "");
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach(el => counter.observe(el));

// ===== Menyu panelidagi soat (Toshkent vaqti) =====
const clock = document.getElementById("clock");
function tick() {
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tashkent" });
}
tick(); setInterval(tick, 30000);

// ===== Joriy yil =====
document.getElementById("year").textContent = new Date().getFullYear();
