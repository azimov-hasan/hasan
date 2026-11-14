// Mobil menyu
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

// Ekranga kirganda paydo bo'lish animatsiyasi
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Joriy yil
document.getElementById("year").textContent = new Date().getFullYear();
