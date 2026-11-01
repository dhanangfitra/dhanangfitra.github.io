/* Portofolio Dhanang Fitra Riaji — main.js */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;

  // ---- Theme ----
  try { const saved = localStorage.getItem("dfr-theme"); if (saved) root.dataset.theme = saved; } catch (e) {}
  $("#themeToggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("dfr-theme", next); } catch (e) {}
  });

  // ---- Mobile menu ----
  const menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
  menuBtn.addEventListener("click", () => { menuBtn.classList.toggle("open"); navLinks.classList.toggle("open"); });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => { menuBtn.classList.remove("open"); navLinks.classList.remove("open"); }));

  // ---- Scroll effects ----
  const nav = $("#nav"), toTop = $("#toTop"), progress = $("#progress");
  const sections = $$("section[id]");
  // state disimpan agar class hanya diubah saat benar-benar berubah (tidak berkedip)
  let isScrolled = null, showTop = null, activeId = null, ticking = false;
  const setActive = id => {
    if (id === activeId) return;
    activeId = id;
    $$("#navLinks a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
  };
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const s = y > 20;
    if (s !== isScrolled) { isScrolled = s; nav.classList.toggle("scrolled", s); }
    // ambang dengan histeresis: muncul > 600px, hilang < 450px (tidak kedip saat address bar HP berubah)
    const t = showTop ? y > 450 : y > 600;
    if (t !== showTop) { showTop = t; toTop.classList.toggle("show", t); }
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    let current = "home";
    sections.forEach(sec => { if (y >= sec.offsetTop - 140) current = sec.id; });
    setActive(current);
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", onScroll, { passive: true });
  update();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  // ---- Typing effect ----
  const words = ["Teacher", "Web Developer", "System Analyst", "Game Developer", "UI / UX Enthusiast"];
  const typedEl = $("#typed");
  let wi = 0, ci = 0, del = false;
  (function type() {
    const w = words[wi];
    typedEl.textContent = w.slice(0, ci);
    if (!del && ci < w.length) ci++;
    else if (del && ci > 0) ci--;
    else if (!del) { del = true; return setTimeout(type, 1600); }
    else { del = false; wi = (wi + 1) % words.length; }
    setTimeout(type, del ? 45 : 95);
  })();

  // ---- Reveal, counters, bars ----
  const countUp = el => {
    const to = +el.dataset.to, dur = 1600, start = performance.now();
    const step = t => { const p = Math.min((t - start) / dur, 1); el.textContent = Math.floor(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$(".count", e.target).forEach(countUp);
      $$(".bar-fill", e.target).forEach(b => b.style.width = b.dataset.w + "%");
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach(el => io.observe(el));

  // ---- Portfolio filter ----
  $$(".filter-btn").forEach(btn => btn.addEventListener("click", () => {
    $$(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    $$(".project").forEach(p => p.classList.toggle("hide", f !== "all" && p.dataset.cat !== f));
  }));

  // ---- Toast ----
  const toast = $("#toast");
  const showToast = msg => { toast.textContent = msg; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 4000); };

  // ---- Captcha (HTML5 Canvas) ----
  const cv = $("#captchaCanvas"), cx = cv.getContext("2d");
  const capInput = $("#captchaInput"), capErr = $("#captchaErr");
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // tanpa karakter mirip (0/O, 1/I)
  let captcha = "";
  const rnd = (a, b) => Math.random() * (b - a) + a;
  function drawCaptcha() {
    captcha = Array.from({ length: 5 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
    const W = cv.width, H = cv.height;
    const g = cx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#eef0ff"); g.addColorStop(1, "#dff8fc");
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) { // titik noise
      cx.fillStyle = `hsla(${rnd(220, 300)},70%,60%,.35)`;
      cx.beginPath(); cx.arc(rnd(0, W), rnd(0, H), rnd(.6, 1.8), 0, Math.PI * 2); cx.fill();
    }
    [...captcha].forEach((ch, i) => { // huruf miring acak
      cx.save();
      cx.translate(18 + i * 28, H / 2 + rnd(-4, 6));
      cx.rotate(rnd(-.45, .45));
      cx.font = `700 ${Math.round(rnd(24, 30))}px "Space Grotesk", monospace`;
      cx.fillStyle = ["#4f46e5", "#0891b2", "#db2777", "#7c3aed", "#0f172a"][Math.floor(rnd(0, 5))];
      cx.textBaseline = "middle";
      cx.fillText(ch, -8, 0);
      cx.restore();
    });
    for (let i = 0; i < 3; i++) { // garis pengganggu
      cx.strokeStyle = `hsla(${rnd(200, 320)},70%,50%,.5)`; cx.lineWidth = rnd(1, 2);
      cx.beginPath(); cx.moveTo(rnd(0, 20), rnd(0, H));
      cx.bezierCurveTo(rnd(30, 70), rnd(0, H), rnd(90, 130), rnd(0, H), rnd(140, W), rnd(0, H)); cx.stroke();
    }
    capInput.value = ""; capInput.classList.remove("bad"); capErr.textContent = "";
  }
  drawCaptcha();
  $("#captchaRefresh").addEventListener("click", drawCaptcha);
  capInput.addEventListener("input", () => { capInput.value = capInput.value.toUpperCase(); capInput.classList.remove("bad"); capErr.textContent = ""; });

  // ---- Contact form → kirim ke email via FormSubmit ----
  const FORM_ENDPOINT = "https://formsubmit.co/ajax/dhanangfitra@gmail.com";
  const form = $("#contactForm"), sendBtn = $("#sendBtn"), note = $("#formNote");
  const btnHTML = sendBtn.innerHTML;
  let lastSent = 0;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    note.className = "form-note";

    if (capInput.value.trim().toUpperCase() !== captcha) {
      capInput.classList.add("bad");
      capErr.textContent = "Kode captcha salah, silakan coba lagi.";
      drawCaptcha(); capInput.focus();
      return;
    }
    if (form._honey.value) return;                          // bot terdeteksi
    if (Date.now() - lastSent < 30000) {                    // cegah spam klik
      note.textContent = "Tunggu sebentar sebelum mengirim pesan lagi.";
      note.classList.add("err"); return;
    }

    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span class="spin"></span><span>Mengirim...</span>';

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: $("#name").value.trim(),
          email: form.email.value.trim(),
          subject: form.subject.value.trim(),
          message: form.message.value.trim(),
          _subject: `[Portofolio DFR] ${form.subject.value.trim()}`,
          _template: "table",
          _captcha: "false",
          _honey: ""
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && String(data.success) === "true") {
        lastSent = Date.now();
        form.reset(); drawCaptcha();
        note.textContent = "✅ Terima kasih! Pesan Anda sudah terkirim. Saya akan segera membalas.";
        note.classList.add("ok");
        showToast("✅ Pesan berhasil terkirim");
      } else {
        throw new Error(data.message || "Gagal mengirim pesan.");
      }
    } catch (err) {
      note.textContent = "❌ " + (err.message || "Gagal mengirim.") + " Silakan coba lagi atau email langsung ke dhanangfitra@gmail.com.";
      note.classList.add("err");
      drawCaptcha();
    } finally {
      sendBtn.disabled = false;
      sendBtn.innerHTML = btnHTML;
    }
  });

  $("#year").textContent = new Date().getFullYear();
})();
