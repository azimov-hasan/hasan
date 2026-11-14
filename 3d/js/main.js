(function () {
  "use strict";

  var CFG = window.PORTFOLIO_CONFIG;
  var SCREENS = window.PORTFOLIO_SCREENS
    .filter(function (s) { return s.visible !== false; })
    .sort(function (a, b) { return a.order - b.order; });
  var N = SCREENS.length;
  var HOME = Math.max(0, SCREENS.findIndex(function (s) { return s.id === CFG.homeId; }));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ================= HOLATLAR MASHINASI ================= */
  // Har bir bosqichdan faqat ruxsat etilgan keyingi bosqichga o'tish mumkin.
  var ALLOWED = {
    loading: ["intro"],
    intro: ["ready"],
    ready: ["rotating"],
    rotating: ["dropping"],
    dropping: ["carousel"],
    carousel: ["detail"],
    detail: ["carousel"]
  };
  var state = { stage: "loading", selectedId: null, locked: false };
  function go(next) {
    if (ALLOWED[state.stage].indexOf(next) === -1) return false;
    state.stage = next;
    document.body.dataset.stage = next;
    return true;
  }
  function show(node, on) { node.classList.toggle("is-visible", on); }

  var loader = $("loader"), enterBtn = $("enterBtn"), skipBtn = $("skipBtn"), ctaBtn = $("ctaBtn");
  var holo = $("holo"), track = $("track"), hint = $("hint");
  var bgStill = $("bgStill"), bgDim = $("bgDim"), vIntro = $("vIntro"), vRotate = $("vRotate");
  var degraded = false;

  ctaBtn.textContent = CFG.ctaText;
  if (!CFG.useVideo) $("badge").hidden = false;

  /* ================= YUKLANISH (haqiqiy resurslar bo'yicha) ================= */
  var assets = [{ t: "img", src: CFG.stills.main }, { t: "img", src: CFG.stills.dim }];
  if (CFG.useVideo) {
    assets.push({ t: "video", src: CFG.videos.intro }, { t: "video", src: CFG.videos.rotate });
  }
  var loaded = 0, loadFinished = false;
  function finishLoad() {
    if (loadFinished) return;
    loadFinished = true;
    $("loaderBar").style.transform = "scaleX(1)";
    $("loaderPct").textContent = "100%";
    if (degraded) {
      $("loaderText").textContent = "Ba'zi resurslar yuklanmadi. Soddalashtirilgan ko'rinishda davom etasiz.";
      document.body.classList.add("degraded");
    } else {
      $("loaderText").textContent = "Tayyor";
    }
    enterBtn.disabled = false;
    enterBtn.focus();
  }
  function assetDone(ok) {
    if (!ok) degraded = true;
    loaded++;
    var p = Math.round((loaded / assets.length) * 100);
    $("loaderPct").textContent = p + "%";
    $("loaderBar").style.transform = "scaleX(" + p / 100 + ")";
    if (loaded >= assets.length) finishLoad();
  }
  assets.forEach(function (a) {
    if (a.t === "img") {
      var i = new Image();
      i.onload = function () { assetDone(true); };
      i.onerror = function () { assetDone(false); };
      i.src = a.src;
    } else {
      var v = document.createElement("video");
      v.preload = "auto"; v.muted = true;
      v.oncanplaythrough = function () { v.oncanplaythrough = null; assetDone(true); };
      v.onerror = function () { assetDone(false); };
      v.src = a.src;
    }
  });
  // Zaxira: hech qachon qotib qolmasin (ba'zi telefonlar canplaythrough yubormaydi)
  setTimeout(finishLoad, 12000);

  enterBtn.addEventListener("click", function () {
    loader.classList.add("is-done");
    setTimeout(function () { loader.hidden = true; }, 900);
    playIntro();
  });

  /* ================= 1-VIDEO: KIRISH ================= */
  var skipResolve;
  var skipped = new Promise(function (r) { skipResolve = r; });
  skipBtn.addEventListener("click", function () { skipResolve(); });

  function playVideo(v, src) {
    return new Promise(function (resolve) {
      v.onended = resolve;
      v.onerror = resolve;
      v.src = src;
      var p = v.play();
      if (p && p.then) {
        p.then(function () { v.classList.add("is-in"); }).catch(resolve);
      }
    });
  }

  async function playIntro() {
    go("intro");
    show(skipBtn, true);
    if (CFG.useVideo && !degraded) {
      await Promise.race([playVideo(vIntro, CFG.videos.intro), skipped]);
      try { vIntro.pause(); if (vIntro.duration) vIntro.currentTime = Math.max(0, vIntro.duration - 0.04); } catch (e) {}
      vIntro.classList.add("is-in");
    } else {
      bgStill.classList.add("is-in");
      await Promise.race([wait(2600), skipped]);
    }
    show(skipBtn, false);
    go("ready");
    await wait(300);
    show(ctaBtn, true);
  }

  /* ================= TUGMA → 2-VIDEO: DIVAN AYLANISHI ================= */
  ctaBtn.addEventListener("click", async function () {
    if (state.locked || state.stage !== "ready") return;
    state.locked = true;
    show(ctaBtn, false);
    go("rotating");
    if (CFG.useVideo && !degraded) {
      await playVideo(vRotate, CFG.videos.rotate);
      vRotate.classList.add("is-in");
    } else {
      bgDim.classList.add("is-in");
      await wait(2400);
    }
    go("dropping");
    await dropScreens();
    go("carousel");
    state.locked = false;
    hint.classList.add("is-visible");
  });

  /* ================= HOLOGRAMMA EKRANLARI ================= */
  var ICONS = {
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-4 3.5-6 7-6s7 2 7 6"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
    people: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c0-3.5 3-5 6-5s6 1.5 6 5"/><path d="M15 14.5c3 0 6 1 6 4"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/><path d="M3 13h18"/>'
  };
  function icon(name) {
    var s = el("span", "icon");
    s.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.user) + "</svg>";
    return s;
  }

  var items = [];
  var pos = HOME, target = HOME, dragging = false, raf = 0, cardW = 520, spacing = 380;

  function buildTrack() {
    SCREENS.forEach(function (s, i) {
      var item = el("div", "holo__item");
      item.dataset.id = s.id;
      item.setAttribute("role", "button");
      item.tabIndex = 0;
      item.setAttribute("aria-label", s.title + ": " + s.description);
      // Tushish tartibi: markaz birinchi, keyin atrofga
      var rank = Math.abs(i - HOME) * 2 - (i < HOME ? 1 : 0);
      item.style.setProperty("--i", Math.max(0, rank));

      var card = el("div", "holo__card" + (s.kind === "hero" ? " holo__card--hero" : ""));
      if (s.kind === "hero") {
        card.appendChild(el("p", "holo__eyebrow", s.eyebrow || ""));
        card.appendChild(el("h2", "holo__title", s.title));
        card.appendChild(el("p", "holo__sub", s.description));
        var mark = el("div", "hero-mark", "H");
        mark.setAttribute("aria-hidden", "true");
        card.appendChild(mark);
        card.appendChild(el("p", "holo__more", "Suring va tanlang →"));
      } else {
        card.appendChild(icon(s.icon));
        card.appendChild(el("h2", "holo__title", s.title));
        card.appendChild(el("p", "holo__sub", s.description));
        card.appendChild(el("span", "holo__arrow", "→"));
      }
      item.appendChild(card);
      track.appendChild(item);
      items.push(item);
    });
  }

  function measure() {
    cardW = Math.min(480, window.innerWidth * 0.82);
    spacing = cardW * 0.9;
    holo.style.setProperty("--card-w", cardW + "px");
  }

  function layout() {
    items.forEach(function (it, i) {
      var d = i - pos, a = Math.abs(d);
      var x = d * spacing;
      var z = -Math.min(a, 2.5) * 150;
      var ry = clamp(-d * 28, -48, 48);
      var sc = 1 - Math.min(a, 2) * 0.18;
      var op = a <= 1 ? 1 - a * 0.25 : Math.max(0, 0.75 - (a - 1) * 0.55);
      it.style.transform = "translate3d(" + x.toFixed(1) + "px,0," + z.toFixed(1) + "px) rotateY(" + ry.toFixed(1) + "deg) scale(" + sc.toFixed(3) + ")";
      it.style.opacity = op.toFixed(3);
      it.style.zIndex = String(100 - Math.round(a * 10));
      it.classList.toggle("is-center", a < 0.5);
    });
    $("prevBtn").disabled = target <= 0;
    $("nextBtn").disabled = target >= N - 1;
  }

  function loop() {
    if (!dragging) {
      var diff = target - pos;
      if (Math.abs(diff) < 0.0008) { pos = target; layout(); raf = 0; return; }
      pos += diff * (reduce ? 1 : 0.14);
      layout();
    }
    raf = requestAnimationFrame(loop);
  }
  function setTarget(t) {
    target = clamp(Math.round(t), 0, N - 1);
    if (!raf) raf = requestAnimationFrame(loop);
    layout();
  }

  async function dropScreens() {
    measure();
    holo.classList.add("is-visible", "is-dropping");
    layout();
    var total = 1100 + (N - 1) * 150 + 200;
    await wait(total);
    holo.classList.remove("is-dropping");
    holo.classList.add("is-settled");
  }

  /* ---- surish (drag/swipe) ---- */
  var startX = 0, startPos = 0, moved = 0, lastX = 0, lastT = 0, vel = 0;
  holo.addEventListener("pointerdown", function (e) {
    if (state.stage !== "carousel" || state.locked) return;
    if (e.target.closest(".holo__nav")) return;
    dragging = true; moved = 0; vel = 0;
    startX = lastX = e.clientX; startPos = pos; lastT = performance.now();
    hint.classList.remove("is-visible");
  });
  window.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    pos = clamp(startPos - dx / spacing, -0.35, N - 0.65);
    var t = performance.now();
    vel = (e.clientX - lastX) / Math.max(1, t - lastT);
    lastX = e.clientX; lastT = t;
    layout();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    setTarget(moved > 6 ? pos - (vel * 180) / spacing : pos);
  }
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);

  // Bosish: yon ekran → markazga; markaziy ekran → ochish
  holo.addEventListener("click", function (e) {
    if (moved > 6) { moved = 0; return; }
    var it = e.target.closest(".holo__item");
    if (!it || state.stage !== "carousel" || state.locked) return;
    var i = items.indexOf(it);
    if (i !== Math.round(target)) setTarget(i);
    else openDetail(SCREENS[i].id, it);
  });
  holo.addEventListener("keydown", function (e) {
    var it = e.target.closest && e.target.closest(".holo__item");
    if (it && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); it.click(); }
  });
  window.addEventListener("keydown", function (e) {
    if (state.stage === "carousel" && !state.locked) {
      if (e.key === "ArrowLeft") setTarget(target - 1);
      if (e.key === "ArrowRight") setTarget(target + 1);
    }
    if (e.key === "Escape" && state.stage === "detail") closeDetail();
  });
  $("prevBtn").addEventListener("click", function () { if (state.stage === "carousel" && !state.locked) setTarget(target - 1); });
  $("nextBtn").addEventListener("click", function () { if (state.stage === "carousel" && !state.locked) setTarget(target + 1); });
  window.addEventListener("resize", function () { measure(); layout(); });

  /* ================= TANLANGAN EKRAN: KATTALASHISH ================= */
  var detail = $("detail"), panel = $("detailPanel"), backdrop = $("detailBackdrop"), backBtn = $("backBtn");
  var openedFrom = null;

  function fillDetail(s) {
    panel.textContent = "";
    var body = el("div", "detail__body");
    body.appendChild(el("p", "detail__cat", s.category || ""));
    var h = el("h2", "detail__title", s.title);
    h.id = "detailTitle";
    body.appendChild(h);
    body.appendChild(el("p", "detail__desc", s.description));
    (s.content || "").split("\n\n").forEach(function (p) { if (p.trim()) body.appendChild(el("p", "", p)); });
    if (s.highlights && s.highlights.length) {
      var ul = el("ul", "detail__list");
      s.highlights.forEach(function (t) { ul.appendChild(el("li", "", t)); });
      body.appendChild(ul);
    }
    if (s.media && s.media.length) {
      var g = el("div", "detail__media");
      s.media.forEach(function (m) {
        if (m.type === "video") {
          var v = el("video"); v.src = m.url; v.controls = true; v.playsInline = true; g.appendChild(v);
        } else {
          var im = el("img"); im.src = m.url; im.alt = m.alt || ""; im.loading = "lazy"; g.appendChild(im);
        }
      });
      body.appendChild(g);
    }
    if (s.links && s.links.length) {
      var row = el("div", "detail__links");
      s.links.forEach(function (l) {
        var a = el("a", "btn", l.label);
        a.href = l.url; a.target = "_blank"; a.rel = "noopener";
        row.appendChild(a);
      });
      body.appendChild(row);
    }
    panel.appendChild(body);
    return body;
  }

  function flip(fromRect, toRect) {
    var dx = fromRect.left + fromRect.width / 2 - (toRect.left + toRect.width / 2);
    var dy = fromRect.top + fromRect.height / 2 - (toRect.top + toRect.height / 2);
    return "translate(" + dx + "px," + dy + "px) scale(" + fromRect.width / toRect.width + "," + fromRect.height / toRect.height + ")";
  }
  function anim(node, frames, ms, extra) {
    var a = node.animate(frames, Object.assign({ duration: reduce ? 1 : ms, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both" }, extra || {}));
    return a.finished.catch(function () {});
  }

  async function openDetail(id, itemEl) {
    if (state.locked || state.stage !== "carousel") return;
    var s = SCREENS.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    state.locked = true;
    go("detail");
    state.selectedId = id;
    openedFrom = itemEl;
    var body = fillDetail(s);
    var cardRect = itemEl.querySelector(".holo__card").getBoundingClientRect();
    detail.hidden = false;
    holo.classList.add("is-dimmed");
    var pr = panel.getBoundingClientRect();
    anim(backdrop, [{ opacity: 0 }, { opacity: 1 }], 600);
    anim(body, [{ opacity: 0 }, { opacity: 1 }], 450, { delay: reduce ? 0 : 280 });
    await anim(panel, [{ transform: flip(cardRect, pr), opacity: 0.4 }, { transform: "none", opacity: 1 }], 750);
    state.locked = false;
    backBtn.focus();
  }

  async function closeDetail() {
    if (state.locked || state.stage !== "detail") return;
    state.locked = true;
    var cardRect = openedFrom.querySelector(".holo__card").getBoundingClientRect();
    var pr = panel.getBoundingClientRect();
    anim(backdrop, [{ opacity: 1 }, { opacity: 0 }], 500);
    await anim(panel, [{ transform: "none", opacity: 1 }, { transform: flip(cardRect, pr), opacity: 0 }], 600);
    detail.hidden = true;
    holo.classList.remove("is-dimmed");
    go("carousel");
    state.locked = false;
    openedFrom.focus({ preventScroll: true });
  }
  backBtn.addEventListener("click", closeDetail);
  backdrop.addEventListener("click", closeDetail);

  /* ================= BOSHLASH ================= */
  buildTrack();
  measure();
  layout();
  window.__portfolio = { state: state }; // faqat tekshirish uchun
})();
