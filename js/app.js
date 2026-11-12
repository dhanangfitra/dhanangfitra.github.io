/* =========================================================
 * Aplikasi Jadwal Lab RPL — kode browser (SPA sederhana)
 * Butuh: js/config.js, js/api.js (dimuat lebih dulu)
 * ========================================================= */
var TOKEN = '';
try { TOKEN = localStorage.getItem('labrpl_token') || ''; } catch (e) {}
var REF = null;          // data referensi dari getBootstrap
var VIEW = '';           // view aktif
var TIMER = null;        // auto refresh dashboard

var HARI = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
var ROLE_LABEL = { admin: 'Admin', kurikulum: 'Waka Kurikulum', kalab: 'Kepala Lab', kepsek: 'Kepala Sekolah', guru: 'Guru' };
var PENGELOLA = ['kalab', 'kurikulum', 'kepsek', 'admin'];
var PENYETUJU = ['kalab', 'kurikulum', 'admin'];

/* ---------- helper ---------- */
function $(s, root) { return (root || document).querySelector(s); }
function $all(s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); }
function esc(v) {
  return String(v === undefined || v === null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function setToken(t) { TOKEN = t || ''; try { if (t) localStorage.setItem('labrpl_token', t); else localStorage.removeItem('labrpl_token'); } catch (e) {} }
function punya(roles) { return REF && REF.user && (REF.user.role === 'admin' || roles.indexOf(REF.user.role) >= 0); }
function byId(list, id) { for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i]; return null; }
function nama(list, id) { var r = byId(list, id); return r ? (r.nama || r.kode) : ''; }
function tglIndo(t) {
  if (!t) return '';
  var b = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var p = String(t).split('-');
  return Number(p[2]) + ' ' + b[Number(p[1])] + ' ' + p[0];
}
function jamDari(ts) { return ts ? String(ts).slice(11, 16) : '—'; }
function opsi(list, val, kosong, labelFn) {
  var h = kosong !== undefined ? '<option value="">' + esc(kosong) + '</option>' : '';
  (list || []).forEach(function (x) {
    var v = typeof x === 'object' ? x.id : x;
    var l = labelFn ? labelFn(x) : (typeof x === 'object' ? (x.nama || x.kode) : x);
    h += '<option value="' + esc(v) + '"' + (String(v) === String(val) ? ' selected' : '') + '>' + esc(l) + '</option>';
  });
  return h;
}
function kelasStatus(st) {
  if (['Sesuai', 'Pengajuan Disetujui', 'Disetujui'].indexOf(st) >= 0) return 'b-good';
  if (['Terlambat'].indexOf(st) >= 0) return 'b-warn';
  if (['Menunggu'].indexOf(st) >= 0) return 'b-info';
  if (['Dibatalkan', '', undefined].indexOf(st) >= 0) return 'b-gray';
  return 'b-bad';
}
function badge(st) { return '<span class="badge ' + kelasStatus(st) + '">' + esc(st || '—') + '</span>'; }
function badgeSesi(s) {
  var h = badge(s.status_efektif);
  if (s.status_koreksi && s.status_koreksi !== s.status) h += ' <span class="small muted strike" title="Status asli">' + esc(s.status) + '</span>';
  if (s.pulang_awal === 'Ya') h += ' <span class="badge b-warn">Pulang Awal</span>';
  return h;
}
function hariIni() { return REF ? REF.hariIni : new Date().toISOString().slice(0, 10); }
function tambahHari(t, n) { var d = new Date(t + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }

function toast(msg, err) {
  var d = document.createElement('div');
  if (err) d.className = 'err';
  d.textContent = msg;
  $('#toast').appendChild(d);
  setTimeout(function () { d.remove(); }, err ? 6000 : 3500);
}

function modal(judul, isiHtml, tombol) {
  var m = $('#modal');
  m.innerHTML = '<div class="box"><h2>' + esc(judul) + '</h2><div class="isi">' + isiHtml + '</div><div class="actions"></div></div>';
  var act = $('.actions', m);
  (tombol || [{ label: 'Tutup' }]).forEach(function (t) {
    var b = document.createElement('button');
    b.textContent = t.label;
    if (t.kelas) b.className = t.kelas;
    b.onclick = function () {
      if (!t.aksi) return tutupModal();
      b.disabled = true;
      Promise.resolve(t.aksi(m)).then(function (r) { if (r !== false) tutupModal(); })
        .catch(function (e) { toast(e.message, true); }).then(function () { b.disabled = false; });
    };
    act.appendChild(b);
  });
  m.classList.remove('hidden');
  m.onclick = function (ev) { if (ev.target === m) tutupModal(); };
  return m;
}
function tutupModal() { $('#modal').classList.add('hidden'); $('#modal').innerHTML = ''; }
function nilaiForm(root) {
  var o = {};
  $all('[name]', root).forEach(function (el) { o[el.name] = el.value; });
  return o;
}

/* ---------- panggilan server ---------- */
function panggil(fn, args) {
  return API.call(fn, args).catch(function (err) {
    var m = err.message;
    if (m.indexOf('AUTH:') >= 0) {
      setToken('');
      renderLogin(m.replace('AUTH:', '').trim());
    }
    throw new Error(m.replace('AUTH:', '').trim());
  });
}
function api(fn) { var a = Array.prototype.slice.call(arguments, 1); return panggil(fn, [TOKEN].concat(a)); }

/* ---------- start ---------- */
function mulai() {
  // Di GitHub Pages, tautan kiosk lama (index.html?page=kiosk...) diarahkan ke kiosk.html.
  if (BOOT.page === 'kiosk' && !API.diAppsScript) { location.replace('kiosk.html' + location.search); return; }
  panggil('whoAmI', [TOKEN]).then(function (me) {
    if (!me) return renderLogin();
    return setelahLogin();
  }).catch(function (e) { renderLogin(e.message); });
}

function setelahLogin() {
  return api('getBootstrap').then(function (ref) {
    REF = ref;
    renderShell();
    if (BOOT.page === 'checkin' && BOOT.lab) {
      BOOT.page = 'app';
      // Hapus parameter QR dari alamat agar halaman yang di-refresh tidak memproses scan lagi.
      try { if (!API.diAppsScript) history.replaceState(null, '', location.pathname); } catch (e) {}
      prosesCheckin(BOOT.lab, BOOT.t);
    } else {
      buka(punya(['kalab', 'kurikulum', 'kepsek']) && REF.user.role !== 'guru' ? 'dashboard' : 'beranda');
    }
  });
}

function renderLogin(pesan) {
  REF = null;
  var info = BOOT.page === 'checkin' ? '<div class="banner b-info">Login dulu untuk menyelesaikan check-in di <b>' + esc(BOOT.lab) + '</b>. Bila QR sudah kedaluwarsa, scan ulang setelah login.</div>' : '';
  $('#app').innerHTML =
    '<div class="login-wrap"><div class="card">' +
    '<h1>Jadwal Lab RPL</h1><p class="muted">Masuk dengan akun yang diberikan admin.</p>' + info +
    (pesan ? '<div class="banner b-bad">' + esc(pesan) + '</div>' : '') +
    '<form id="fLogin"><label class="f">Username<input name="username" autocomplete="username" required></label>' +
    '<label class="f">Password<input name="password" type="password" autocomplete="current-password" required></label>' +
    '<button class="primary" style="width:100%">Masuk</button></form>' +
    '<p class="small muted" style="margin-top:12px">Jika sekolah memakai Google Workspace dan email Anda terdaftar, aplikasi akan otomatis masuk saat dibuka dengan akun Google sekolah.</p>' +
    '</div></div>';
  $('#fLogin').onsubmit = function (ev) {
    ev.preventDefault();
    var f = nilaiForm(ev.target), btn = $('button', ev.target);
    btn.disabled = true; btn.textContent = 'Memeriksa…';
    panggil('login', [f.username, f.password]).then(function (r) {
      setToken(r.token);
      return setelahLogin();
    }).catch(function (e) { renderLogin(e.message); });
  };
}

function keluar() {
  panggil('logout', [TOKEN]).catch(function () {});
  setToken('');
  if (TIMER) clearInterval(TIMER);
  renderLogin('Anda sudah keluar.');
}

/* ---------- shell & menu ---------- */
var MENU = [
  { id: 'beranda', label: 'Beranda', roles: '*' },
  { id: 'dashboard', label: 'Monitoring Lab', roles: ['kalab', 'kurikulum', 'kepsek'] },
  { id: 'jadwalSaya', label: 'Jadwal Saya', roles: '*' },
  { id: 'pengajuan', label: 'Pengajuan', roles: '*' },
  { id: 'jadwalLab', label: 'Jadwal Lab', roles: '*' },
  { id: 'kalender', label: 'Kalender Khusus', roles: ['kurikulum', 'kalab'] },
  { id: 'sesi', label: 'Riwayat & Koreksi', roles: ['kalab', 'kurikulum', 'kepsek'] },
  { id: 'laporan', label: 'Laporan', roles: ['kalab', 'kurikulum', 'kepsek'] },
  { id: 'master', label: 'Master Data', roles: ['admin'] },
  { id: 'pengaturan', label: 'Pengaturan & Kiosk', roles: ['admin'] },
  { id: 'akun', label: 'Akun Saya', roles: '*' }
];

function renderShell() {
  var u = REF.user;
  var menu = MENU.filter(function (m) { return m.roles === '*' || punya(m.roles); });
  $('#app').innerHTML =
    '<div class="topbar"><div class="brand">Jadwal Lab RPL<small>' + esc(REF.namaSekolah) + '</small></div><div class="spacer"></div>' +
    '<div class="who"><b>' + esc(u.nama) + '</b><br><span class="role">' + esc(ROLE_LABEL[u.role] || u.role) + '</span></div>' +
    '<button class="sm" onclick="keluar()">Keluar</button></div>' +
    '<div class="layout"><nav class="side">' +
    menu.map(function (m) { return '<a data-v="' + m.id + '" onclick="buka(\'' + m.id + '\')">' + esc(m.label) + '</a>'; }).join('') +
    '</nav><main id="view"></main></div>';
}

function buka(v) {
  VIEW = v;
  if (TIMER) { clearInterval(TIMER); TIMER = null; }
  $all('nav.side a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-v') === v); });
  var el = $('#view');
  el.innerHTML = '<div class="loading">Memuat…</div>';
  var fn = VIEWS[v];
  if (!fn) { el.innerHTML = 'Halaman tidak ditemukan.'; return; }
  Promise.resolve(fn(el)).catch(function (e) { el.innerHTML = '<div class="banner b-bad">' + esc(e.message) + '</div>'; });
}

function muatUlangRef() { return api('getBootstrap').then(function (r) { REF = r; }); }

/* ---------- CHECK-IN (dibuka dari QR) ---------- */
function prosesCheckin(lab, t, konfirmasi) {
  $all('nav.side a').forEach(function (a) { a.classList.remove('active'); });
  var el = $('#view');
  el.innerHTML = '<div class="card"><div class="loading">Memproses scan di ' + esc(lab) + '…</div></div>';
  api('scanCheckin', lab, t, !!konfirmasi).then(function (r) {
    if (r.aksi === 'tanya_checkout') {
      el.innerHTML = '<div class="card"><div class="hasil info"><div class="ikon">?</div><h1>Check-out?</h1><p>' + esc(r.pesan) + '</p></div>' +
        '<p class="center"><button class="primary" id="btnYaOut">Ya, check-out sekarang</button> <button onclick="buka(\'beranda\')">Tidak</button></p></div>';
      $('#btnYaOut').onclick = function () { prosesCheckin(lab, t, true); };
      return;
    }
    var kelas = r.aksi === 'checkout' || r.aksi === 'sudah' ? 'info' : (kelasStatus(r.status) === 'b-good' ? 'good' : (kelasStatus(r.status) === 'b-warn' ? 'warn' : 'bad'));
    var ikon = { good: '✓', warn: '!', bad: '✕', info: 'i' }[kelas];
    var judul = r.aksi === 'checkout' ? 'Check-out tercatat' : (r.aksi === 'sudah' ? 'Sudah check-in' : r.status);
    var s = r.slot;
    el.innerHTML = '<div class="card"><div class="hasil ' + kelas + '"><div class="ikon">' + ikon + '</div><h1>' + esc(judul) + '</h1>' +
      '<p>' + esc(r.pesan) + '</p>' +
      (s ? '<p class="small">' + esc(s.mapel) + ' · ' + esc(s.kelas) + ' · ' + esc(s.lab) + ' · ' + esc(s.mulai) + '–' + esc(s.selesai) + '</p>' : '') +
      '<p class="small muted">' + esc(r.lab || '') + ' · pukul ' + esc(r.jam || '') + '</p></div>' +
      '<p class="center"><button class="primary" onclick="buka(\'beranda\')">Ke Beranda</button></p></div>';
  }).catch(function (e) {
    el.innerHTML = '<div class="card"><div class="hasil bad"><div class="ikon">✕</div><h1>Scan gagal</h1><p>' + esc(e.message) + '</p></div>' +
      '<p class="center"><button onclick="buka(\'beranda\')">Ke Beranda</button></p></div>';
  });
}

/* =========================================================
 * VIEWS
 * ========================================================= */
var VIEWS = {};

/* ---------- Beranda ---------- */
VIEWS.beranda = function (el) {
  return api('getBeranda').then(function (d) {
    var sesiPerSlot = {};
    d.sesi.forEach(function (s) { if (s.slot_id) sesiPerSlot[s.slot_id] = s; });
    var h = '<h1>Selamat datang, ' + esc(REF.user.nama) + '</h1><p class="muted">' + esc(d.hari) + ', ' + tglIndo(d.tanggal) + ' · ' + esc(d.jam) + '</p>';
    if (d.khusus) h += '<div class="banner b-warn">Hari ini: <b>' + esc(d.khusus.jenis) + '</b> — ' + esc(d.khusus.keterangan) + '. Jadwal reguler tidak berlaku.</div>';
    if (d.menungguPersetujuan) h += '<div class="banner b-info">Ada <b>' + d.menungguPersetujuan + '</b> pengajuan menunggu persetujuan. <a onclick="buka(\'pengajuan\')" href="javascript:void 0">Lihat</a></div>';
    h += '<div class="grid grid-2"><div class="card"><h2>Jadwal saya hari ini</h2>';
    if (!d.jadwal.length) h += '<p class="muted">Tidak ada jadwal lab hari ini.</p>';
    else {
      h += '<div class="tbl-wrap"><table class="tbl"><tr><th>Jam</th><th>Lab</th><th>Mapel / Kelas</th><th>Status</th></tr>';
      d.jadwal.forEach(function (s) {
        var ss = sesiPerSlot[s.slot_id];
        h += '<tr><td>' + esc(s.mulai) + '–' + esc(s.selesai) + '</td><td>' + esc(s.lab) + (s.sumber === 'pengajuan' ? ' <span class="badge b-info">pengajuan</span>' : '') + '</td><td>' + esc(s.mapel) + '<br><span class="muted small">' + esc(s.kelas) + '</span></td><td>' +
          (ss ? badgeSesi(ss) + '<br><span class="small muted">in ' + jamDari(ss.check_in) + ' · out ' + jamDari(ss.check_out) + '</span>' : '<span class="muted small">Belum check-in</span>') + '</td></tr>';
      });
      h += '</table></div>';
    }
    h += '<p class="small muted" style="margin-top:10px">Check-in: scan QR di layar pintu lab dengan kamera HP. Scan sekali lagi saat selesai untuk check-out.</p></div>';

    h += '<div class="card"><h2>Ringkasan saya</h2><div class="stats">';
    REF.statusList.forEach(function (st) { h += '<div class="stat"><b>' + (d.ringkas[st] || 0) + '</b>' + badge(st) + '</div>'; });
    h += '</div>';
    var lain = d.sesi.filter(function (s) { return d.jadwal.every(function (j) { return j.slot_id !== s.slot_id; }); });
    if (lain.length) {
      h += '<h3 style="margin-top:14px">Sesi lain hari ini</h3><table class="tbl">';
      lain.forEach(function (s) { h += '<tr><td>' + esc(s.lab) + '</td><td>' + jamDari(s.check_in) + '–' + jamDari(s.check_out) + '</td><td>' + badgeSesi(s) + '</td></tr>'; });
      h += '</table>';
    }
    h += '</div></div>';

    h += '<div class="card"><h2>Riwayat (30 terakhir)</h2>' + tabelSesi(d.riwayat, false) + '</div>';
    el.innerHTML = h;
  });
};

function tabelSesi(list, denganGuru, bisaKoreksi) {
  if (!list.length) return '<p class="muted">Belum ada data.</p>';
  var h = '<div class="tbl-wrap"><table class="tbl"><tr><th>Tanggal</th><th>Lab</th>' + (denganGuru ? '<th>Guru</th>' : '') +
    '<th>Jadwal</th><th>Masuk</th><th>Keluar</th><th>Status</th><th>Catatan</th>' + (bisaKoreksi ? '<th></th>' : '') + '</tr>';
  list.forEach(function (s) {
    h += '<tr><td>' + tglIndo(s.tanggal) + '</td><td>' + esc(s.lab) + '</td>' + (denganGuru ? '<td>' + esc(s.guru) + '</td>' : '') +
      '<td>' + (s.jadwal_mulai ? esc(s.jadwal_mulai) + '–' + esc(s.jadwal_selesai) : '<span class="muted">—</span>') + '</td>' +
      '<td>' + jamDari(s.check_in) + (s.metode && s.metode !== 'sistem' ? ' <span class="small muted">' + esc(s.metode) + '</span>' : '') + '</td>' +
      '<td>' + jamDari(s.check_out) + '</td><td>' + badgeSesi(s) + '</td>' +
      '<td class="small">' + esc(s.catatan) + (s.alasan_koreksi ? '<br><i>Koreksi (' + esc(s.dikoreksi_oleh) + '): ' + esc(s.alasan_koreksi) + '</i>' : '') + '</td>' +
      (bisaKoreksi ? '<td><button class="sm" onclick="formKoreksi(\'' + esc(s.id) + '\',\'' + esc(s.status_efektif) + '\')">Koreksi</button></td>' : '') + '</tr>';
  });
  return h + '</table></div>';
}

/* ---------- Dashboard / Monitoring ---------- */
VIEWS.dashboard = function (el) {
  var render = function () {
    return api('getDashboard').then(function (d) {
      if (VIEW !== 'dashboard') return;
      var KOND = {
        'sesuai': ['b-good', 'Dipakai sesuai jadwal'], 'terlambat': ['b-warn', 'Dipakai (terlambat)'],
        'pelanggaran': ['b-bad', 'Ada pelanggaran'], 'kosong-terjadwal': ['b-warn', 'Terjadwal, belum ada guru'],
        'kosong': ['b-gray', 'Kosong'], 'perbaikan': ['b-gray', 'Perbaikan']
      };
      var h = '<div class="row" style="justify-content:space-between;align-items:center;margin-bottom:12px"><div><h1>Monitoring Lab</h1><span class="muted">' + esc(d.hari) + ', ' + tglIndo(d.tanggal) + ' · diperbarui ' + esc(d.jam) + '</span></div>' +
        '<div class="row"><button onclick="lihatNotif()">Notifikasi' + (d.notifBelumDibaca ? ' <span class="badge b-bad">' + d.notifBelumDibaca + '</span>' : '') + '</button>' +
        (d.menungguPersetujuan ? '<button onclick="buka(\'pengajuan\')">Persetujuan <span class="badge b-info">' + d.menungguPersetujuan + '</span></button>' : '') + '</div></div>';
      h += '<div class="grid grid-4">';
      d.labs.forEach(function (L) {
        var k = KOND[L.kondisi] || ['b-gray', L.kondisi];
        h += '<div class="card lab k-' + L.kondisi + '"><div class="row" style="justify-content:space-between;align-items:center"><h2 style="margin:0">' + esc(L.lab.nama) + '</h2><span class="badge ' + k[0] + '">' + k[1] + '</span></div>';
        if (L.khusus) h += '<div class="small muted" style="margin:6px 0">' + esc(L.khusus.jenis) + ': ' + esc(L.khusus.keterangan) + '</div>';
        h += '<div class="kv" style="margin-top:10px">';
        h += '<div>Terjadwal</div><div>' + (L.sekarang ? '<b>' + esc(L.sekarang.mapel) + '</b><br>' + esc(L.sekarang.kelas) + ' · ' + esc(L.sekarang.guru) + '<br><span class="muted">' + esc(L.sekarang.mulai) + '–' + esc(L.sekarang.selesai) + '</span>' : '<span class="muted">—</span>') + '</div>';
        h += '<div>Di lab</div><div>' + (L.aktif.length ? L.aktif.map(function (a) { return esc(a.guru) + ' ' + badge(a.status_efektif) + '<br><span class="small muted">sejak ' + jamDari(a.check_in) + '</span>'; }).join('<br>') : '<span class="muted">Tidak ada</span>') + '</div>';
        h += '<div>Berikutnya</div><div>' + (L.berikut ? esc(L.berikut.mulai) + ' ' + esc(L.berikut.mapel) + '<br><span class="muted small">' + esc(L.berikut.guru) + '</span>' : '<span class="muted">—</span>') + '</div>';
        h += '</div></div>';
      });
      h += '</div>';
      var m = d.minggu;
      h += '<div class="card"><h2>Minggu ini (' + tglIndo(d.mingguDari) + ' – ' + tglIndo(d.tanggal) + ')</h2><div class="stats">' +
        '<div class="stat"><b>' + (m.persenSesuai === null ? '—' : m.persenSesuai + '%') + '</b>Kesesuaian</div>' +
        '<div class="stat"><b>' + m.terjadwal + '</b>Slot terjadwal</div>';
      REF.statusList.forEach(function (st) { h += '<div class="stat"><b>' + (m[st] || 0) + '</b>' + badge(st) + '</div>'; });
      h += '</div></div>';
      h += '<div class="card"><h2>Perlu perhatian hari ini</h2>' + tabelSesi(d.pelanggaran, true, punya(PENYETUJU)) + '</div>';
      el.innerHTML = h;
    });
  };
  TIMER = setInterval(function () { if (VIEW === 'dashboard' && $('#modal').classList.contains('hidden')) render().catch(function () {}); }, 30000);
  return render();
};

function lihatNotif() {
  api('listNotifikasi').then(function (list) {
    var h = list.length ? '<div class="tbl-wrap" style="max-height:60vh;overflow-y:auto"><table class="tbl">' + list.map(function (n) {
      return '<tr><td class="small muted" style="white-space:nowrap">' + esc(n.waktu.slice(5, 16)) + '</td><td><b>' + esc(n.judul) + '</b>' + (n.dibaca ? '' : ' <span class="badge b-info">baru</span>') + '<br>' + esc(n.pesan) + '</td></tr>';
    }).join('') + '</table></div>' : '<p class="muted">Belum ada notifikasi.</p>';
    modal('Notifikasi', h, [{ label: 'Tandai semua dibaca', aksi: function () { return api('tandaiNotifikasiDibaca').then(function () { buka('dashboard'); }); } }, { label: 'Tutup' }]);
  }).catch(function (e) { toast(e.message, true); });
}

function formKoreksi(id, statusSaatIni) {
  modal('Koreksi status sesi',
    '<label class="f">Status baru<select name="status">' + opsi(REF.statusList, statusSaatIni) + '</select></label>' +
    '<label class="f">Alasan koreksi (wajib)<textarea name="alasan" placeholder="mis. Pindah lab karena LAB 3 mati listrik, sudah izin kepala lab"></textarea></label>' +
    '<p class="small muted">Status asli tetap disimpan; koreksi tercatat di log audit.</p>',
    [{ label: 'Batal' }, {
      label: 'Simpan koreksi', kelas: 'primary', aksi: function (m) {
        var f = nilaiForm(m);
        return api('koreksiSesi', id, f.status, f.alasan).then(function () { toast('Status dikoreksi.'); buka(VIEW); });
      }
    }]);
}

/* ---------- Jadwal saya ---------- */
VIEWS.jadwalSaya = function (el) {
  return api('getJadwalSaya').then(function (d) {
    if (!d.semester) { el.innerHTML = '<div class="card">Belum ada semester aktif.</div>'; return; }
    var list = d.jadwal.sort(function (a, b) { return (a.hari - b.hari) || (a.jam_mulai_ke - b.jam_mulai_ke); });
    var h = '<h1>Jadwal Saya</h1><p class="muted">Semester ' + esc(d.semester.nama) + '</p><div class="card">';
    if (!list.length) h += '<p class="muted">Anda belum memiliki jadwal di lab.</p>';
    else {
      h += '<div class="tbl-wrap"><table class="tbl"><tr><th>Hari</th><th>Jam ke</th><th>Waktu</th><th>Lab</th><th>Mapel</th><th>Kelas</th></tr>';
      list.forEach(function (j) {
        h += '<tr><td>' + esc(j.nama_hari) + '</td><td>' + esc(j.jam_mulai_ke) + '–' + esc(j.jam_selesai_ke) + '</td><td>' + esc(j.mulai) + '–' + esc(j.selesai) + '</td><td>' + esc(j.lab) + '</td><td>' + esc(j.mapel) + '</td><td>' + esc(j.kelas) + '</td></tr>';
      });
      h += '</table></div>';
    }
    el.innerHTML = h + '</div>';
  });
};

/* ---------- Pengajuan ---------- */
var TAB_PENGAJUAN = 'ajukan';
VIEWS.pengajuan = function (el) {
  var bisaSetuju = punya(PENYETUJU) || REF.user.role === 'kepsek';
  if (bisaSetuju && TAB_PENGAJUAN === 'ajukan' && !el.getAttribute('data-sudah')) TAB_PENGAJUAN = 'persetujuan';
  el.setAttribute('data-sudah', '1');
  var tabs = [['ajukan', 'Ajukan baru'], ['saya', 'Pengajuan saya']];
  if (bisaSetuju) tabs.push(['persetujuan', 'Semua pengajuan / persetujuan']);
  var h = '<h1>Pengajuan</h1><p class="muted">Pinjam lab di luar jadwal, guru pengganti, atau pindah lab/jam. Pengajuan yang disetujui menjadi jadwal berlaku sehingga check-in tercatat sah.</p><div class="tabs">' +
    tabs.map(function (t) { return '<a class="' + (TAB_PENGAJUAN === t[0] ? 'active' : '') + '" onclick="TAB_PENGAJUAN=\'' + t[0] + '\';buka(\'pengajuan\')">' + t[1] + '</a>'; }).join('') + '</div><div id="pgIsi"></div>';
  el.innerHTML = h;
  var isi = $('#pgIsi');
  if (TAB_PENGAJUAN === 'ajukan') return formPengajuan(isi);
  return api('listPengajuan', TAB_PENGAJUAN === 'persetujuan' ? 'semua' : 'saya').then(function (list) { isi.innerHTML = '<div class="card">' + tabelPengajuan(list, TAB_PENGAJUAN === 'persetujuan') + '</div>'; });
};

function formPengajuan(isi) {
  var besok = tambahHari(hariIni(), 0);
  isi.innerHTML = '<div class="card" style="max-width:720px"><form id="fPg">' +
    '<div class="form-grid"><label class="f">Jenis<select name="jenis" id="pgJenis"><option value="Pinjam">Pinjam lab di luar jadwal</option><option value="Pengganti">Guru pengganti untuk jadwal saya</option><option value="Pindah">Pindah lab / jam (tanggal sama)</option></select></label>' +
    '<label class="f">Tanggal<input type="date" name="tanggal" id="pgTgl" value="' + besok + '" min="' + hariIni() + '"></label></div>' +
    '<div id="pgDinamis"></div>' +
    '<label class="f">Alasan<textarea name="alasan" placeholder="mis. Praktik remedial kelas XI RPL 1"></textarea></label>' +
    '<button class="primary">Kirim pengajuan</button></form></div>';
  var renderDinamis = function () {
    var jenis = $('#pgJenis').value, tgl = $('#pgTgl').value, box = $('#pgDinamis');
    var labJam = '<div class="form-grid"><label class="f">Lab' + (jenis === 'Pindah' ? ' tujuan' : '') + '<select name="lab_id">' + opsi(REF.lab, '', '— pilih lab —') + '</select></label>' +
      '<label class="f">Jam mulai<input type="time" name="jam_mulai"></label><label class="f">Jam selesai<input type="time" name="jam_selesai"></label></div>';
    if (jenis === 'Pinjam') {
      box.innerHTML = labJam + '<div class="form-grid"><label class="f">Kelas<select name="kelas_id">' + opsi(REF.kelas, '', '— opsional —') + '</select></label>' +
        '<label class="f">Mapel<select name="mapel_id">' + opsi(REF.mapel, '', '— opsional —') + '</select></label></div>';
      return;
    }
    box.innerHTML = '<div class="loading small">Memuat jadwal Anda pada tanggal itu…</div>';
    api('opsiJadwalSaya', tgl).then(function (slots) {
      if (!slots.length) { box.innerHTML = '<div class="banner b-warn">Anda tidak punya jadwal lab pada ' + tglIndo(tgl) + '. Pilih tanggal lain.</div>'; return; }
      var pilih = '<label class="f">Jadwal asal<select name="jadwal_asal_id">' + slots.map(function (s) {
        return '<option value="' + esc(s.slot_id) + '">' + esc(s.mulai + '–' + s.selesai + ' · ' + s.lab + ' · ' + s.mapel + ' · ' + s.kelas) + '</option>';
      }).join('') + '</select></label>';
      if (jenis === 'Pengganti') {
        box.innerHTML = pilih + '<label class="f">Guru pengganti<select name="guru_pengganti_id">' +
          opsi(REF.guru.filter(function (g) { return g.id !== REF.user.id; }), '', '— pilih guru —') + '</select></label>';
      } else {
        box.innerHTML = pilih + labJam;
      }
    }).catch(function (e) { box.innerHTML = '<div class="banner b-bad">' + esc(e.message) + '</div>'; });
  };
  $('#pgJenis').onchange = renderDinamis;
  $('#pgTgl').onchange = renderDinamis;
  renderDinamis();
  $('#fPg').onsubmit = function (ev) {
    ev.preventDefault();
    var btn = $('button.primary', ev.target);
    btn.disabled = true;
    api('ajukan', nilaiForm(ev.target)).then(function () {
      toast('Pengajuan terkirim, menunggu persetujuan.');
      TAB_PENGAJUAN = 'saya';
      buka('pengajuan');
    }).catch(function (e) { toast(e.message, true); btn.disabled = false; });
  };
}

function tabelPengajuan(list, semua) {
  if (!list.length) return '<p class="muted">Belum ada pengajuan.</p>';
  var h = '<div class="tbl-wrap"><table class="tbl"><tr><th>Status</th><th>Jenis</th><th>Tanggal & jam</th><th>Lab</th>' + (semua ? '<th>Pemohon</th>' : '') + '<th>Detail</th><th>Alasan</th><th></th></tr>';
  list.forEach(function (p) {
    var det = [p.mapel, p.kelas].filter(Boolean).join(' · ');
    if (p.jenis === 'Pengganti') det = 'Pengganti: <b>' + esc(p.pengganti) + '</b>' + (det ? '<br>' + esc(det) : '');
    else det = esc(det);
    h += '<tr><td>' + badge(p.status) + (p.diputus_oleh ? '<br><span class="small muted">' + esc(p.diputus_oleh) + '</span>' : '') + '</td><td>' + esc(p.jenis) + '</td><td>' + tglIndo(p.tanggal) + '<br>' + esc(p.jam_mulai) + '–' + esc(p.jam_selesai) + '</td>' +
      '<td>' + esc(p.lab) + '</td>' + (semua ? '<td>' + esc(p.pemohon) + '</td>' : '') + '<td class="small">' + det + '</td><td class="small">' + esc(p.alasan) + (p.catatan_putusan ? '<br><i>' + esc(p.catatan_putusan) + '</i>' : '') + '</td><td style="white-space:nowrap">' +
      (p.bisaDiputus ? '<button class="sm good" onclick="putuskan(\'' + p.id + '\',\'Disetujui\')">Setujui</button> <button class="sm danger" onclick="putuskan(\'' + p.id + '\',\'Ditolak\')">Tolak</button>' : '') +
      (p.bisaDibatalkan ? ' <button class="sm" onclick="batalkan(\'' + p.id + '\')">Batalkan</button>' : '') + '</td></tr>';
  });
  return h + '</table></div>';
}

function putuskan(id, keputusan) {
  modal(keputusan === 'Disetujui' ? 'Setujui pengajuan' : 'Tolak pengajuan',
    '<label class="f">Catatan (opsional)<textarea name="catatan"></textarea></label>',
    [{ label: 'Batal' }, {
      label: keputusan === 'Disetujui' ? 'Setujui' : 'Tolak', kelas: 'primary', aksi: function (m) {
        return api('putuskanPengajuan', id, keputusan, nilaiForm(m).catatan).then(function () { toast('Pengajuan ' + keputusan.toLowerCase() + '.'); buka('pengajuan'); });
      }
    }]);
}
function batalkan(id) {
  modal('Batalkan pengajuan?', '<p>Pengajuan akan dibatalkan.</p>', [{ label: 'Tidak' }, {
    label: 'Ya, batalkan', kelas: 'primary', aksi: function () { return api('batalkanPengajuan', id).then(function () { buka('pengajuan'); }); }
  }]);
}

/* ---------- Jadwal Lab (grid) ---------- */
var HARI_KECIL = ['', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
/** Jam pelajaran untuk satu hari: jam khusus hari itu, atau jam "reguler" bila tidak ada (sama dengan server). */
function jamHari(hr) {
  var norm = function (j) { return String(j.jenis_hari).toLowerCase().trim(); };
  var r = REF.jam.filter(function (j) { return norm(j) === HARI_KECIL[hr]; });
  if (!r.length) r = REF.jam.filter(function (j) { return norm(j) === 'reguler'; });
  return r.slice().sort(function (a, b) { return a.jam_ke - b.jam_ke; });
}
var JL = { lab: '', semester: '' };
VIEWS.jadwalLab = function (el) {
  var bisaUbah = punya(['kurikulum']);
  if (!JL.lab && REF.lab.length) JL.lab = REF.lab[0].id;
  if (!JL.semester && REF.semesterAktif) JL.semester = REF.semesterAktif.id;
  return api('listJadwal', JL.semester).then(function (d) {
    var hariAda = [1, 2, 3, 4, 5, 6].filter(function (x) { return jamHari(x).length; });
    var maxJam = 0;
    hariAda.forEach(function (x) { jamHari(x).forEach(function (j) { maxJam = Math.max(maxJam, Number(j.jam_ke)); }); });
    var list = d.jadwal.filter(function (j) { return j.lab_id === JL.lab; });
    var peta = {}, tertutup = {};
    list.forEach(function (j) {
      peta[j.hari + '-' + j.jam_mulai_ke] = j;
      for (var k = Number(j.jam_mulai_ke) + 1; k <= Number(j.jam_selesai_ke); k++) tertutup[j.hari + '-' + k] = true;
    });
    var h = '<div class="row" style="justify-content:space-between"><div><h1>Jadwal Lab</h1><p class="muted">' + (d.semester ? 'Semester ' + esc(d.semester.nama) : 'Belum ada semester aktif') +
      (bisaUbah ? ' · klik sel kosong untuk menambah, klik jadwal untuk mengubah' : '') + '</p></div>' +
      '<div class="row"><label class="f">Semester<select id="jlSem">' + opsi(REF.semester, JL.semester) + '</select></label>' +
      '<label class="f">Lab<select id="jlLab">' + opsi(REF.lab, JL.lab) + '</select></label></div></div>';
    if (!hariAda.length) h += '<div class="banner b-warn">Jam pelajaran belum diisi. Isi di Master Data › Jam Pelajaran.</div>';
    h += '<div class="card tbl-wrap"><table class="jgrid"><tr><th style="width:56px">Jam ke</th>' + hariAda.map(function (x) { return '<th>' + HARI[x] + '</th>'; }).join('') + '</tr>';
    for (var jk = 1; jk <= maxJam; jk++) {
      h += '<tr><td class="jam center"><b>' + jk + '</b></td>';
      hariAda.forEach(function (hr) {
        var key = hr + '-' + jk;
        if (tertutup[key]) return;
        var j = peta[key];
        var jamIni = jamHari(hr).filter(function (x) { return Number(x.jam_ke) === jk; })[0];
        if (j) {
          var span = Number(j.jam_selesai_ke) - Number(j.jam_mulai_ke) + 1;
          h += '<td class="isi" rowspan="' + span + '" onclick="formJadwal(\'' + j.id + '\')"><b>' + esc(j.mapel) + '</b>' + esc(j.kelas) + '<br>' + esc(j.guru) +
            '<br><span class="muted">jam ' + esc(j.jam_mulai_ke) + '–' + esc(j.jam_selesai_ke) + ' · ' + esc(j.mulai) + '–' + esc(j.selesai) + '</span></td>';
        } else if (jamIni) {
          h += '<td class="kosong" ' + (bisaUbah ? 'onclick="formJadwal(\'\',' + hr + ',' + jk + ')"' : '') + '><span class="small muted">' + esc(jamIni.jam_mulai) + '–' + esc(jamIni.jam_selesai) + '</span></td>';
        } else {
          h += '<td style="background:#f3f4f6"></td>';
        }
      });
      h += '</tr>';
    }
    h += '</table>';
    // Istirahat = jeda antar jam pelajaran tiap hari
    var jeda = hariAda.map(function (hr) {
      var js = jamHari(hr), g = [];
      for (var i = 1; i < js.length; i++) if (js[i].jam_mulai > js[i - 1].jam_selesai) g.push(js[i - 1].jam_selesai + '–' + js[i].jam_mulai);
      return '<b>' + HARI[hr] + '</b> ' + (js.length ? js[0].jam_mulai + '–' + js[js.length - 1].jam_selesai : '') + (g.length ? ' (istirahat ' + g.join(', ') + ')' : ' (tanpa istirahat)');
    });
    h += '<p class="small muted" style="margin:10px 0 0">' + jeda.join(' · ') + '. Jadwal yang melewati jam istirahat tetap dihitung satu sesi.</p></div>';
    if (bisaUbah) h += '<div class="card"><h3>Impor massal</h3><p class="small muted">Untuk banyak jadwal sekaligus: isi sheet <b>ImportJadwal</b> di Spreadsheet (kode_lab, nip_guru/username, kode_mapel, nama_kelas, hari, jam_mulai_ke, jam_selesai_ke), lalu pilih menu <b>Lab RPL › Proses impor jadwal</b>. Baris yang bentrok akan ditandai GAGAL.</p></div>';
    el.innerHTML = h;
    JL._data = d.jadwal;
    $('#jlLab').onchange = function () { JL.lab = this.value; buka('jadwalLab'); };
    $('#jlSem').onchange = function () { JL.semester = this.value; buka('jadwalLab'); };
  });
};

function formJadwal(id, hari, jamKe) {
  var bisaUbah = punya(['kurikulum']);
  var j = id ? (JL._data || []).filter(function (x) { return x.id === id; })[0] : { lab_id: JL.lab, hari: hari, jam_mulai_ke: jamKe, jam_selesai_ke: jamKe };
  if (!j) return;
  if (!bisaUbah) {
    modal('Detail jadwal', '<p><b>' + esc(j.mapel) + '</b><br>' + esc(j.kelas) + '<br>' + esc(j.guru) + '<br>' + esc(j.nama_hari) + ' jam ke-' + esc(j.jam_mulai_ke) + ' s.d. ' + esc(j.jam_selesai_ke) + ' (' + esc(j.mulai) + '–' + esc(j.selesai) + ')<br>' + esc(j.lab) + '</p>');
    return;
  }
  var maxKe = 0;
  [1, 2, 3, 4, 5, 6].forEach(function (x) { jamHari(x).forEach(function (r) { maxKe = Math.max(maxKe, Number(r.jam_ke)); }); });
  var jamOpsi = [];
  for (var q = 1; q <= maxKe; q++) jamOpsi.push(String(q));
  var isi = '<div class="form-grid">' +
    '<label class="f">Lab<select name="lab_id">' + opsi(REF.lab, j.lab_id) + '</select></label>' +
    '<label class="f">Hari<select name="hari">' + opsi([1, 2, 3, 4, 5, 6].map(function (x) { return { id: String(x), nama: HARI[x] }; }), String(j.hari)) + '</select></label>' +
    '<label class="f">Jam ke (mulai)<select name="jam_mulai_ke">' + opsi(jamOpsi, String(j.jam_mulai_ke)) + '</select></label>' +
    '<label class="f">Jam ke (selesai)<select name="jam_selesai_ke">' + opsi(jamOpsi, String(j.jam_selesai_ke)) + '</select></label>' +
    '<label class="f">Guru<select name="guru_id">' + opsi(REF.guru, j.guru_id, '— pilih —') + '</select></label>' +
    '<label class="f">Mapel<select name="mapel_id">' + opsi(REF.mapel, j.mapel_id, '— pilih —') + '</select></label>' +
    '<label class="f">Kelas<select name="kelas_id">' + opsi(REF.kelas, j.kelas_id, '— pilih —') + '</select></label></div>' +
    '<p class="small muted">Sistem menolak jadwal yang bentrok lab, guru, atau kelas.</p>';
  var tombol = [{ label: 'Batal' }];
  if (id) tombol.push({
    label: 'Hapus', kelas: 'danger', aksi: function () {
      if (!confirm('Hapus jadwal ini?')) return false;
      return api('hapusJadwal', id).then(function () { toast('Jadwal dihapus.'); buka('jadwalLab'); });
    }
  });
  tombol.push({
    label: 'Simpan', kelas: 'primary', aksi: function (m) {
      var f = nilaiForm(m);
      f.id = id || '';
      f.semester_id = JL.semester;
      return api('simpanJadwal', f).then(function () { toast('Jadwal disimpan.'); buka('jadwalLab'); });
    }
  });
  modal(id ? 'Ubah jadwal' : 'Tambah jadwal', isi, tombol);
}

/* ---------- Kalender khusus ---------- */
VIEWS.kalender = function (el) {
  var bisaUbah = punya(['kurikulum']);
  return api('listKalender').then(function (list) {
    var h = '<h1>Kalender Khusus</h1><p class="muted">Pada tanggal di bawah, jadwal reguler tidak berlaku (tidak ada deteksi Tidak Hadir). Pengajuan yang disetujui tetap berlaku.</p>';
    if (bisaUbah) {
      h += '<div class="card"><form id="fKal" class="row">' +
        '<label class="f">Tanggal<input type="date" name="tanggal" required></label>' +
        '<label class="f">Jenis<select name="jenis"><option>Libur</option><option>Ujian</option><option>Kegiatan</option></select></label>' +
        '<label class="f">Lab<select name="lab_id">' + opsi(REF.lab, '', 'Semua lab') + '</select></label>' +
        '<label class="f" style="flex:1 1 220px">Keterangan<input name="keterangan" placeholder="mis. Libur Maulid Nabi"></label>' +
        '<label class="f"><span>&nbsp;</span><button class="primary">Tambah</button></label></form></div>';
    }
    h += '<div class="card">' + (list.length ? '<div class="tbl-wrap"><table class="tbl"><tr><th>Tanggal</th><th>Jenis</th><th>Lab</th><th>Keterangan</th><th></th></tr>' + list.map(function (k) {
      return '<tr><td>' + HARI[new Date(k.tanggal + 'T12:00:00Z').getUTCDay() || 7] + ', ' + tglIndo(k.tanggal) + '</td><td>' + esc(k.jenis) + '</td><td>' + esc(k.lab) + '</td><td>' + esc(k.keterangan) + '</td><td>' +
        (bisaUbah ? '<button class="sm danger" onclick="hapusKal(\'' + k.id + '\')">Hapus</button>' : '') + '</td></tr>';
    }).join('') + '</table></div>' : '<p class="muted">Belum ada tanggal khusus.</p>') + '</div>';
    el.innerHTML = h;
    if (bisaUbah) $('#fKal').onsubmit = function (ev) {
      ev.preventDefault();
      api('simpanKalender', nilaiForm(ev.target)).then(function () { toast('Tersimpan.'); buka('kalender'); }).catch(function (e) { toast(e.message, true); });
    };
  });
};
function hapusKal(id) { api('hapusKalender', id).then(function () { buka('kalender'); }).catch(function (e) { toast(e.message, true); }); }

/* ---------- Riwayat & koreksi ---------- */
var FS = null;
VIEWS.sesi = function (el) {
  if (!FS) FS = { dari: hariIni(), sampai: hariIni(), lab_id: '', guru_id: '', status: '' };
  el.innerHTML = '<h1>Riwayat & Koreksi Sesi</h1><div class="card"><form id="fSesi" class="row">' +
    '<label class="f">Dari<input type="date" name="dari" value="' + FS.dari + '"></label>' +
    '<label class="f">Sampai<input type="date" name="sampai" value="' + FS.sampai + '"></label>' +
    '<label class="f">Lab<select name="lab_id">' + opsi(REF.lab, FS.lab_id, 'Semua') + '</select></label>' +
    '<label class="f">Guru<select name="guru_id">' + opsi(REF.guru, FS.guru_id, 'Semua') + '</select></label>' +
    '<label class="f">Status<select name="status">' + opsi(REF.statusList, FS.status, 'Semua') + '</select></label>' +
    '<label class="f"><span>&nbsp;</span><button class="primary">Tampilkan</button></label></form></div><div class="card" id="sesiIsi"><div class="loading">Memuat…</div></div>';
  $('#fSesi').onsubmit = function (ev) { ev.preventDefault(); FS = nilaiForm(ev.target); buka('sesi'); };
  return api('listSesi', FS).then(function (list) {
    $('#sesiIsi').innerHTML = '<p class="small muted">' + list.length + ' sesi' + (list.length >= 500 ? ' (dibatasi 500, persempit filter)' : '') + '</p>' + tabelSesi(list, true, punya(PENYETUJU));
  });
};

/* ---------- Laporan ---------- */
var FL = null;
VIEWS.laporan = function (el) {
  if (!FL) FL = { dari: hariIni().slice(0, 8) + '01', sampai: hariIni() };
  el.innerHTML = '<h1>Laporan</h1><div class="card"><form id="fLap" class="row">' +
    '<label class="f">Dari<input type="date" name="dari" value="' + FL.dari + '"></label>' +
    '<label class="f">Sampai<input type="date" name="sampai" value="' + FL.sampai + '"></label>' +
    '<label class="f"><span>&nbsp;</span><button class="primary">Tampilkan</button></label>' +
    '<label class="f"><span>&nbsp;</span><button type="button" id="btnEkspor">Ekspor ke Spreadsheet</button></label></form><div id="eksporHasil"></div></div><div id="lapIsi"><div class="loading">Menghitung…</div></div>';
  $('#fLap').onsubmit = function (ev) { ev.preventDefault(); FL = nilaiForm(ev.target); buka('laporan'); };
  $('#btnEkspor').onclick = function () {
    var b = this; b.disabled = true;
    api('exportLaporan', FL.dari, FL.sampai).then(function (r) {
      $('#eksporHasil').innerHTML = '<div class="banner b-good small">Sheet "' + esc(r.nama) + '" dibuat. <a target="_blank" href="' + esc(r.url) + '">Buka</a> · <a target="_blank" href="' + esc(r.pdf) + '">Unduh PDF</a> · <a target="_blank" href="' + esc(r.xlsx) + '">Unduh Excel</a> (perlu akses ke Spreadsheet)</div>';
    }).catch(function (e) { toast(e.message, true); }).then(function () { b.disabled = false; });
  };
  return api('getLaporan', FL.dari, FL.sampai).then(function (L) {
    var st = L.statusList;
    var t = L.total;
    var h = '<div class="card"><h2>Ringkasan ' + tglIndo(L.dari) + ' – ' + tglIndo(L.sampai) + '</h2><div class="stats">' +
      '<div class="stat"><b>' + (t.persenSesuai === null ? '—' : t.persenSesuai + '%') + '</b>Kesesuaian</div><div class="stat"><b>' + t.terjadwal + '</b>Slot terjadwal</div>';
    st.forEach(function (s) { h += '<div class="stat"><b>' + (t[s] || 0) + '</b>' + badge(s) + '</div>'; });
    h += '</div><p class="small muted" style="margin-top:8px">Kesesuaian = (Sesuai + Pengajuan Disetujui) ÷ slot terjadwal. Status yang sudah dikoreksi memakai status koreksi.</p></div>';
    h += '<div class="card"><h2>Per guru</h2><div class="tbl-wrap"><table class="tbl"><tr><th>Guru</th><th class="right">Terjadwal</th>' + st.map(function (s) { return '<th class="right">' + esc(s) + '</th>'; }).join('') + '<th class="right">Pulang Awal</th><th class="right">% Sesuai</th></tr>';
    L.perGuru.forEach(function (g) {
      h += '<tr><td>' + esc(g.guru) + '</td><td class="right">' + g.terjadwal + '</td>' + st.map(function (s) { return '<td class="right">' + (g[s] || '') + '</td>'; }).join('') +
        '<td class="right">' + (g.pulangAwal || '') + '</td><td class="right"><b>' + (g.persenSesuai === null ? '—' : g.persenSesuai + '%') + '</b></td></tr>';
    });
    h += '</table></div></div>';
    h += '<div class="card"><h2>Per lab</h2><div class="tbl-wrap"><table class="tbl"><tr><th>Lab</th><th class="right">Slot terjadwal</th><th class="right">Sesi check-in</th><th class="right">Di luar jadwal</th><th class="right">Jam terpakai</th><th class="right">Jam tersedia</th><th class="right">% Pemakaian</th></tr>';
    L.perLab.forEach(function (x) {
      h += '<tr><td>' + esc(x.lab) + '</td><td class="right">' + x.slotTerjadwal + '</td><td class="right">' + x.sesi + '</td><td class="right">' + x.luarJadwal + '</td><td class="right">' + x.jamTerpakai + '</td><td class="right">' + x.jamTersedia + '</td><td class="right"><b>' + x.persenPakai + '%</b></td></tr>';
    });
    h += '</table></div></div>';
    $('#lapIsi').innerHTML = h;
  });
};

/* ---------- Master data ---------- */
var MASTER = {
  Pengguna: { kolom: [['nama', 'Nama'], ['nip', 'NIP'], ['username', 'Username'], ['email', 'Email Google (opsional)'], ['role', 'Role', ['guru', 'kalab', 'kurikulum', 'kepsek', 'admin']],
    ['no_hp', 'No. HP'], ['telegram_chat_id', 'Telegram chat ID'], ['rfid_uid', 'UID kartu RFID'], ['aktif', 'Aktif', ['Ya', 'Tidak']], ['password', 'Password (isi untuk membuat/mengganti)', 'password']] },
  Lab: { kolom: [['kode', 'Kode (dipakai di URL kiosk)'], ['nama', 'Nama'], ['kapasitas', 'Kapasitas'], ['status', 'Status', ['Aktif', 'Perbaikan']]] },
  Mapel: { kolom: [['kode', 'Kode'], ['nama', 'Nama']] },
  Kelas: { kolom: [['nama', 'Nama'], ['tingkat', 'Tingkat']] },
  Semester: { kolom: [['nama', 'Nama (mis. 2026/2027 Ganjil)'], ['tgl_mulai', 'Tanggal mulai', 'date'], ['tgl_selesai', 'Tanggal selesai', 'date'], ['aktif', 'Aktif', ['Ya', 'Tidak']]] },
  JamPelajaran: { kolom: [['jenis_hari', 'Hari', ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'reguler']], ['jam_ke', 'Jam ke', 'number'], ['jam_mulai', 'Mulai', 'time'], ['jam_selesai', 'Selesai', 'time']] }
};
var TAB_MASTER = 'Pengguna';
VIEWS.master = function (el) {
  var h = '<h1>Master Data</h1><div class="tabs">' + Object.keys(MASTER).map(function (t) {
    return '<a class="' + (t === TAB_MASTER ? 'active' : '') + '" onclick="TAB_MASTER=\'' + t + '\';buka(\'master\')">' + t.replace('JamPelajaran', 'Jam Pelajaran') + '</a>';
  }).join('') + '</div><div class="card" id="mIsi"><div class="loading">Memuat…</div></div>';
  el.innerHTML = h;
  return api('listMaster', TAB_MASTER).then(function (list) {
    var kol = MASTER[TAB_MASTER].kolom.filter(function (k) { return k[2] !== 'password'; });
    if (TAB_MASTER === 'JamPelajaran') {
      var urut = function (x) { var i = HARI_KECIL.indexOf(String(x.jenis_hari).toLowerCase()); return i < 0 ? 9 : i; };
      list.sort(function (a, b) { return (urut(a) - urut(b)) || (a.jam_ke - b.jam_ke); });
    }
    MASTER._data = list;
    var t = '<div class="row" style="justify-content:space-between;margin-bottom:10px"><span class="muted">' + list.length + ' data</span><button class="primary" onclick="formMaster(\'\')">Tambah</button></div>';
    t += '<div class="tbl-wrap"><table class="tbl"><tr>' + kol.map(function (k) { return '<th>' + esc(k[1].replace(/ \(.*\)$/, '')) + '</th>'; }).join('') + '<th></th></tr>';
    list.forEach(function (r) {
      t += '<tr>' + kol.map(function (k) { return '<td>' + esc(r[k[0]]) + '</td>'; }).join('') +
        '<td style="white-space:nowrap"><button class="sm" onclick="formMaster(\'' + r.id + '\')">Ubah</button> <button class="sm danger" onclick="hapusMaster(\'' + r.id + '\')">Hapus</button></td></tr>';
    });
    $('#mIsi').innerHTML = t + '</table></div>';
  });
};
function formMaster(id) {
  var r = id ? MASTER._data.filter(function (x) { return x.id === id; })[0] : {};
  var isi = '<div class="form-grid">' + MASTER[TAB_MASTER].kolom.map(function (k) {
    var v = r[k[0]] || '';
    if (Array.isArray(k[2])) return '<label class="f">' + esc(k[1]) + '<select name="' + k[0] + '">' + opsi(k[2], v) + '</select></label>';
    return '<label class="f">' + esc(k[1]) + '<input name="' + k[0] + '" type="' + (k[2] || 'text') + '" value="' + (k[2] === 'password' ? '' : esc(v)) + '"></label>';
  }).join('') + '</div>';
  modal((id ? 'Ubah ' : 'Tambah ') + TAB_MASTER, isi, [{ label: 'Batal' }, {
    label: 'Simpan', kelas: 'primary', aksi: function (m) {
      var f = nilaiForm(m);
      f.id = id;
      return api('simpanMaster', TAB_MASTER, f).then(function () { toast('Tersimpan.'); return muatUlangRef(); }).then(function () { buka('master'); });
    }
  }]);
}
function hapusMaster(id) {
  modal('Hapus data?', '<p>Data yang masih dipakai jadwal tidak bisa dihapus; nonaktifkan saja.</p>', [{ label: 'Batal' }, {
    label: 'Hapus', kelas: 'primary', aksi: function () {
      return api('hapusMaster', TAB_MASTER, id).then(function () { toast('Dihapus.'); return muatUlangRef(); }).then(function () { buka('master'); });
    }
  }]);
}

/* ---------- Pengaturan & kiosk ---------- */
VIEWS.pengaturan = function (el) {
  return Promise.all([api('getPengaturan'), api('getKioskLinks')]).then(function (res) {
    var list = res[0], k = res[1];
    var h = '<h1>Pengaturan & Kiosk</h1><div class="card"><h2>Tautan kiosk per lab</h2>' +
      '<p class="small muted">Buka tautan ini di tablet/monitor yang dipasang di pintu masing-masing lab (mode layar penuh). Jangan bagikan ke guru: tautan berisi kunci kiosk.</p>' +
      (k.appUrl ? '' : '<div class="banner b-warn">URL web app belum terbaca. Deploy sebagai Web app lalu isi APP_URL di bawah.</div>') +
      '<div class="tbl-wrap"><table class="tbl">' + k.links.map(function (x) {
        return '<tr><td><b>' + esc(x.lab) + '</b></td><td class="small" style="word-break:break-all">' + esc(x.url) + '</td><td><a class="btn sm" target="_blank" href="' + esc(x.url) + '">Buka</a></td></tr>';
      }).join('') + '</table></div><p class="small muted">URL aplikasi untuk guru: <a target="_blank" href="' + esc(k.appUrl) + '">' + esc(k.appUrl) + '</a></p></div>';
    h += '<div class="card"><h2>Pengaturan</h2><form id="fSet"><div class="tbl-wrap"><table class="tbl">' + list.map(function (s) {
      return '<tr><td style="width:240px"><b>' + esc(s.kunci) + '</b><br><span class="small muted">' + esc(s.keterangan) + '</span></td><td><input style="width:100%" name="' + esc(s.kunci) + '" value="' + esc(s.nilai) + '"></td></tr>';
    }).join('') + '</table></div><p><button class="primary">Simpan pengaturan</button></p></form>' +
      '<p class="small muted">Mengganti KIOSK_KEY membuat tautan kiosk lama tidak berlaku. Telegram: buat bot lewat @BotFather, masukkan bot ke grup, lalu isi token dan chat ID grup.</p></div>';
    el.innerHTML = h;
    $('#fSet').onsubmit = function (ev) {
      ev.preventDefault();
      api('simpanPengaturan', nilaiForm(ev.target)).then(function () { toast('Pengaturan disimpan.'); return muatUlangRef(); }).then(function () { buka('pengaturan'); }).catch(function (e) { toast(e.message, true); });
    };
  });
};

/* ---------- Akun ---------- */
VIEWS.akun = function (el) {
  var u = REF.user;
  el.innerHTML = '<h1>Akun Saya</h1><div class="grid grid-2"><div class="card"><h2>Profil</h2><div class="lab"><div class="kv">' +
    '<div>Nama</div><div>' + esc(u.nama) + '</div><div>NIP</div><div>' + esc(u.nip || '—') + '</div><div>Username</div><div>' + esc(u.username) + '</div>' +
    '<div>Email</div><div>' + esc(u.email || '—') + '</div><div>Peran</div><div>' + esc(ROLE_LABEL[u.role]) + '</div></div></div></div>' +
    '<div class="card"><h2>Ganti password</h2><form id="fPw"><label class="f">Password lama<input type="password" name="lama"></label>' +
    '<label class="f">Password baru (min. 6 karakter)<input type="password" name="baru"></label><button class="primary">Simpan</button></form></div></div>';
  $('#fPw').onsubmit = function (ev) {
    ev.preventDefault();
    var f = nilaiForm(ev.target);
    api('gantiPassword', f.lama, f.baru).then(function () { toast('Password diganti.'); ev.target.reset(); }).catch(function (e) { toast(e.message, true); });
  };
};

mulai();
