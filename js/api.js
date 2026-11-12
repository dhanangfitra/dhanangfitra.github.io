/**
 * api.js — satu pintu untuk memanggil fungsi server Apps Script.
 *
 * - Dibuka dari Apps Script (HtmlService): memakai google.script.run.
 * - Dibuka dari GitHub Pages / hosting statis: memakai fetch POST ke CONFIG.API_URL (doPost di Router.gs).
 *   Content-Type text/plain dipakai agar browser tidak mengirim preflight CORS.
 */
(function () {
  var diAppsScript = typeof google !== 'undefined' && google.script && google.script.run;

  function rapikanPesan(m) {
    return String(m || 'Terjadi kesalahan').replace(/^(Error|Exception|ScriptError):\s*/i, '');
  }

  function call(fn, args) {
    args = args || [];
    if (diAppsScript) {
      return new Promise(function (resolve, reject) {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(function (err) { reject(new Error(rapikanPesan(err && err.message || err))); })[fn].apply(null, args);
      });
    }
    var url = window.CONFIG && window.CONFIG.API_URL;
    if (!url || /GANTI_DENGAN/.test(url)) {
      return Promise.reject(new Error('API_URL belum diisi di js/config.js (URL Web app Apps Script).'));
    }
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ fn: fn, args: args })
    }).then(function (r) {
      if (!r.ok) throw new Error('Server tidak merespons (' + r.status + ').');
      return r.json();
    }, function () {
      throw new Error('Tidak bisa menghubungi server. Periksa koneksi internet dan API_URL.');
    }).then(function (r) {
      if (!r || !r.ok) throw new Error(rapikanPesan(r && r.error));
      return r.result;
    });
  }

  // Parameter halaman: disuntikkan server bila dari Apps Script, dibaca dari URL bila dari GitHub Pages.
  if (!window.BOOT) {
    var q = new URLSearchParams(location.search);
    window.BOOT = { page: q.get('page') || 'app', lab: q.get('lab') || '', t: q.get('t') || '', key: q.get('key') || '' };
  }

  window.API = { call: call, diAppsScript: !!diAppsScript };
})();
