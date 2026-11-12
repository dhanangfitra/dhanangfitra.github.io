/* Layar kiosk pintu lab. Butuh: js/config.js, js/api.js, qrcode.min.js */
var D = null, OFFSET = 0, QR = null, QR_TEXT = '', NEXT_FETCH = 0, SAH = [];
function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function jam(ts) { return ts ? String(ts).slice(11, 16) : ''; }
function kelas(st) { return SAH.indexOf(st) >= 0 ? 's-good' : (st === 'Terlambat' ? 's-warn' : 's-bad'); }

function ambil() {
  API.call('getKioskData', [BOOT.lab, BOOT.key]).then(function (d) {
    D = d; SAH = d.statusSah || [];
    OFFSET = d.serverMs - Date.now();
    render();
    var periodeMs = d.periode * 1000;
    var sisa = periodeMs - (d.serverMs % periodeMs);
    NEXT_FETCH = Date.now() + Math.min(sisa + 800, 15000);
  }).catch(function (e) {
    document.getElementById('root').innerHTML = '<div class="err"><b>Kiosk tidak bisa dimuat.</b><br>' + esc(e.message) + '<br><small>Mencoba lagi dalam 30 detik…</small></div>';
    NEXT_FETCH = Date.now() + 30000;
  });
}

function render() {
  var d = D, s = d.sekarang;
  var aktif = d.aktif || [];
  var stateHtml;
  if (aktif.length) {
    stateHtml = aktif.map(function (a) { return '<div class="state ' + kelas(a.status_efektif) + '">' + esc(a.guru) + ' · ' + esc(a.status_efektif) + ' · sejak ' + jam(a.check_in) + '</div>'; }).join('<br>');
  } else if (s) {
    stateHtml = '<div class="state s-warn">Menunggu guru check-in</div>';
  } else {
    stateHtml = '<div class="state s-idle">Lab kosong</div>';
  }
  var h = '<div class="k-wrap"><div class="k-head"><div><div class="sek">' + esc(d.namaSekolah) + '</div><h1>' + esc(d.lab.nama) + '</h1></div>' +
    '<div class="k-clock"><b id="clock">--:--</b><span id="tgl">' + esc(d.hari) + ', ' + esc(d.tanggal) + '</span></div></div>';
  h += '<div>';
  if (d.khusus) h += '<div class="khusus">' + esc(d.khusus.jenis) + ': ' + esc(d.khusus.keterangan) + ' — jadwal reguler tidak berlaku</div>';
  if (String(d.lab.status).toLowerCase() === 'perbaikan') h += '<div class="khusus">Lab sedang dalam perbaikan</div>';
  h += '<div class="panel"><h2>Jadwal sekarang</h2>' +
    (s ? '<div class="now-mapel">' + esc(s.mapel || 'Peminjaman lab') + '</div><div class="now-detail">' + esc(s.kelas) + ' · ' + esc(s.guru) + '</div><div class="now-detail">' + esc(s.mulai) + ' – ' + esc(s.selesai) + (s.sumber === 'pengajuan' ? ' · pengajuan disetujui' : '') + '</div>'
      : '<div class="now-mapel" style="opacity:.6">Tidak ada jadwal</div>') +
    stateHtml + '</div>';
  h += '<div class="panel" style="margin-top:20px"><h2>Berikutnya hari ini</h2><div class="next-list">' +
    (d.berikut.length ? d.berikut.map(function (b) { return '<div><b>' + esc(b.mulai) + '–' + esc(b.selesai) + '</b><span>' + esc(b.mapel) + ' · ' + esc(b.kelas) + '<br><small style="opacity:.7">' + esc(b.guru) + '</small></span></div>'; }).join('') : '<div style="opacity:.6">Tidak ada jadwal lagi</div>') +
    '</div></div></div>';
  h += '<div class="qr-panel"><div class="qr-title">Scan untuk check-in / check-out</div><div class="qr-sub">Gunakan kamera HP · QR berganti tiap ' + d.periode + ' detik</div>' +
    '<div id="qr"></div><div class="bar"><i id="bar" style="width:100%"></i></div><div class="qr-sub small" style="margin-top:8px">Bisa juga tap kartu RFID</div></div></div>';
  document.getElementById('root').innerHTML = h;
  QR = new QRCode(document.getElementById('qr'), { text: d.qr, width: 380, height: 380, correctLevel: QRCode.CorrectLevel.M });
  QR_TEXT = d.qr;
  fokusRfid();
}

function tick() {
  var now = Date.now() + OFFSET;
  var c = document.getElementById('clock');
  if (c) {
    var t = new Date(now).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    c.textContent = t.replace(/\./g, ':');
  }
  if (D) {
    var p = D.periode * 1000, sisa = p - (now % p);
    var bar = document.getElementById('bar');
    if (bar) bar.style.width = Math.round(sisa / p * 100) + '%';
  }
  if (NEXT_FETCH && Date.now() >= NEXT_FETCH) { NEXT_FETCH = 0; ambil(); }
}

/* RFID: reader USB mengetik UID lalu Enter */
function fokusRfid() { var r = document.getElementById('rfid'); if (r && document.activeElement !== r) r.focus(); }
document.addEventListener('click', fokusRfid);
document.getElementById('rfid').addEventListener('keydown', function (ev) {
  if (ev.key !== 'Enter') return;
  var uid = this.value.trim(); this.value = '';
  if (!uid) return;
  API.call('scanRfid', [BOOT.lab, BOOT.key, uid]).then(function (r) {
    var warna = r.aksi === 'checkin' ? (SAH.indexOf(r.status) >= 0 ? '#12805c' : (r.status === 'Terlambat' ? '#b45309' : '#c2312f')) : '#1f5eff';
    tampil('<h1 style="color:' + warna + '">' + esc(r.aksi === 'checkout' ? 'Check-out' : r.aksi === 'sudah' ? 'Sudah check-in' : r.status) + '</h1><h2>' + esc(r.nama) + '</h2><p>' + esc(r.pesan) + '</p>');
    NEXT_FETCH = Date.now() + 1500;
  }).catch(function (e) {
    tampil('<h1 style="color:#c2312f">Gagal</h1><p>' + esc(e.message) + '</p>');
  });
});
function tampil(html) {
  var o = document.getElementById('overlay');
  o.querySelector('.box').innerHTML = html;
  o.style.display = 'flex';
  o.style.background = 'rgba(0,0,0,.55)';
  setTimeout(function () { o.style.display = 'none'; fokusRfid(); }, 4500);
}

if (!BOOT.lab || !BOOT.key) {
  document.getElementById('root').innerHTML = '<div class="err">Tautan kiosk tidak lengkap. Buka tautan kiosk dari menu Pengaturan & Kiosk di aplikasi (admin).</div>';
} else {
  ambil();
  setInterval(tick, 1000);
}
