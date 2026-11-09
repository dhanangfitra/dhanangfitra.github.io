/* ============================================================
 *  Tema terang / gelap — dimuat di <head> agar tidak berkedip.
 *  - Default mengikuti pengaturan perangkat.
 *  - Pilihan pengguna disimpan di browser.
 *  - Tombol apa pun dengan atribut [data-theme-toggle] akan mengganti tema.
 * ============================================================ */
(function () {
  'use strict';
  var KEY = 'invlab_tema';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function simpanan() {
    try { var v = localStorage.getItem(KEY); return v === 'dark' || v === 'light' ? v : null; }
    catch (e) { return null; }
  }
  function sistem() { return mq && mq.matches ? 'dark' : 'light'; }

  var IKON = {
    // ikon menunjukkan tema tujuan
    dark: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    light: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
  };

  function perbaruiTombol(t) {
    var tujuan = t === 'dark' ? 'light' : 'dark';
    var label = tujuan === 'dark' ? 'Mode gelap' : 'Mode terang';
    var list = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      b.setAttribute('aria-label', 'Ganti ke ' + label.toLowerCase());
      b.setAttribute('title', 'Ganti ke ' + label.toLowerCase());
      b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      b.innerHTML = IKON[tujuan] + (b.hasAttribute('data-theme-label') ? '<span>' + label + '</span>' : '');
    }
  }

  function terapkan(t) {
    root.setAttribute('data-theme', t);
    root.style.colorScheme = t;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#111214' : '#f4f6fa');
    perbaruiTombol(t);
    try { window.dispatchEvent(new CustomEvent('temaberubah', { detail: t })); } catch (e) { /* abaikan */ }
  }

  window.Tema = {
    get: function () { return root.getAttribute('data-theme') || sistem(); },
    set: function (t) {
      try { localStorage.setItem(KEY, t); } catch (e) { /* abaikan */ }
      terapkan(t);
    },
    toggle: function () { this.set(this.get() === 'dark' ? 'light' : 'dark'); }
  };

  // ?tema=gelap / ?tema=terang di alamat halaman memaksa tema (mis. untuk TV), tanpa disimpan
  var paksa = null;
  try {
    var q = new URLSearchParams(location.search).get('tema');
    if (q === 'gelap' || q === 'dark') paksa = 'dark';
    if (q === 'terang' || q === 'light') paksa = 'light';
  } catch (e) { /* abaikan */ }

  terapkan(paksa || simpanan() || sistem());

  // ikut perubahan tema perangkat selama pengguna belum memilih sendiri
  if (mq) {
    var ikut = function () { if (!simpanan() && !paksa) terapkan(sistem()); };
    if (mq.addEventListener) mq.addEventListener('change', ikut); else if (mq.addListener) mq.addListener(ikut);
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (b) { e.preventDefault(); window.Tema.toggle(); }
  });
  document.addEventListener('DOMContentLoaded', function () { perbaruiTombol(window.Tema.get()); });
})();
