/* ============================================================
 *  FRONTEND APLIKASI INVENTARIS LAB v2
 *  Login username/password · Registrasi via Google · Peran admin & peminjam
 * ============================================================ */
(() => {
  'use strict';

  const CFG = window.APP_CONFIG || {};
  const LS_SESI = 'invlab_sesi_v2';
  const KONDISI = ['Baik', 'Rusak Ringan', 'Rusak Berat'];
  const STATUS_PINJAM = ['Menunggu', 'Dipinjam', 'Ditolak', 'Dikembalikan', 'Dibatalkan'];
  const KATEGORI_DEFAULT = ['Alat Ukur', 'Alat Gelas', 'Elektronik', 'Komputer', 'Bahan Kimia', 'Furnitur', 'Lainnya'];
  const AKSI_PUBLIK = ['login', 'googleLogin', 'register', 'ping'];

  const TABS = {
    peminjam: [['katalog', 'Pinjam Barang'], ['saya', 'Peminjaman Saya'], ['profil', 'Profil']],
    admin: [['dashboard', 'Dashboard'], ['barang', 'Barang'], ['peminjaman', 'Peminjaman'],
            ['users', 'Pengguna'], ['profil', 'Profil']]
  };

  const S = {
    token: null, user: null, view: null, tab: null,
    reg: null, // { credential, email, nama } saat registrasi
    d: { barang: [], peminjaman: [], users: [], katalog: [], saya: [] }
  };

  /* ========================== HELPER ========================== */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isAdmin = () => S.user && S.user.role === 'admin';
  const today = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };
  const addDays = (s, n) => {
    const d = new Date(s + 'T00:00:00');
    d.setDate(d.getDate() + n);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  };
  const fmtTgl = (s) => {
    if (!s) return '—';
    const d = new Date(String(s).slice(0, 10) + 'T00:00:00');
    return isNaN(d) ? s : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const terlambat = (p) => p.status === 'Dipinjam' && p.rencana_kembali && p.rencana_kembali < today();
  const hariTelat = (p) => Math.round((new Date(today()) - new Date(p.rencana_kembali)) / 86400000);
  const opts = (list, cur) => list.map((v) => {
    const [val, label] = Array.isArray(v) ? v : [v, v];
    return `<option value="${esc(val)}" ${String(val) === String(cur) ? 'selected' : ''}>${esc(label)}</option>`;
  }).join('');

  function toast(msg, isError = false) {
    const t = $('#toast');
    t.textContent = msg;
    t.className = 'toast show' + (isError ? ' error' : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (t.className = 'toast'), isError ? 4500 : 3000);
  }
  let loadCount = 0;
  const loading = (on) => {
    loadCount = Math.max(0, loadCount + (on ? 1 : -1));
    $('#loader').hidden = loadCount === 0;
  };

  /* ============================ API ============================ */
  async function api(action, payload = {}) {
    const url = String(CFG.API_URL || '').trim();
    if (!url || url.includes('XXXXXXXX')) throw new Error('API_URL di config.js belum diisi.');
    if (/script\.google\.com/.test(url) && !/\/exec$/.test(url)) {
      throw new Error('API_URL harus berakhiran /exec (bukan /dev atau link editor).');
    }
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // hindari CORS preflight
        body: JSON.stringify({ action, token: S.token, ...payload })
      });
    } catch (e) {
      throw new Error('Tidak bisa terhubung ke server. Pastikan Web App di-deploy dengan akses "Siapa saja" dan versi terbaru.');
    }
    if (!res.ok) throw new Error(`Server membalas status ${res.status}.`);
    let json;
    try { json = JSON.parse(await res.text()); }
    catch (e) { throw new Error('Respons server bukan JSON. Periksa pengaturan deploy Apps Script.'); }
    if (!json.ok) {
      if (json.code === 'AUTH' && !AKSI_PUBLIK.includes(action)) {
        endSession();
        showView('login');
      }
      const err = new Error(json.error || 'Terjadi kesalahan.');
      err.code = json.code;
      throw err;
    }
    return json.data;
  }

  // Jalankan aksi dengan loader + toast; mengembalikan null jika gagal.
  async function run(fn, okMsg) {
    loading(true);
    try {
      const r = await fn();
      if (okMsg) toast(okMsg);
      return r ?? true;
    } catch (e) {
      toast(e.message, true);
      return null;
    } finally {
      loading(false);
    }
  }

  async function mutate(action, payload, okMsg) {
    const r = await run(() => api(action, payload), okMsg);
    if (r !== null) await reload();
    return r !== null;
  }

  /* ========================== SESI ========================== */
  function saveSession(token, user) {
    S.token = token; S.user = user;
    try { localStorage.setItem(LS_SESI, JSON.stringify({ token, user })); } catch (e) { /* abaikan */ }
  }
  function endSession() {
    S.token = null; S.user = null;
    try { localStorage.removeItem(LS_SESI); } catch (e) { /* abaikan */ }
  }
  function onLoggedIn(r) {
    saveSession(r.token, r.user);
    S.reg = null;
    $('#formLogin').reset();
    $('#formRegister').reset();
    history.replaceState(null, '', location.pathname + location.search);
    enterApp();
    toast(`Selamat datang, ${r.user.nama}!`);
  }
  async function logout() {
    const token = S.token;
    endSession();
    if (token) fetch(String(CFG.API_URL).trim(), {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'logout', token })
    }).catch(() => {});
    if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
    location.hash = '#login';
    showView('login');
  }

  /* ========================== VIEW ========================== */
  function showView(v) {
    S.view = v;
    ['login', 'register', 'app'].forEach((x) => ($('#view-' + x).hidden = x !== v));
    $('#themeFloat').hidden = v === 'app';
    if (v === 'register') renderRegister();
    renderGoogleButtons();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', () => {
    if (S.token) return;
    showView(location.hash === '#register' ? 'register' : 'login');
  });

  /* ==================== GOOGLE SIGN-IN ==================== */
  let gReady = false;
  const googleConfigured = () => CFG.GOOGLE_CLIENT_ID && !/^ISI_/.test(CFG.GOOGLE_CLIENT_ID);

  function initGoogle() {
    if (!googleConfigured()) {
      $$('.gbtn').forEach((el) => (el.innerHTML =
        '<p class="hint">Login Google belum dikonfigurasi. Isi <b>GOOGLE_CLIENT_ID</b> di config.js.</p>'));
      return;
    }
    let tries = 0;
    (function wait() {
      if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: CFG.GOOGLE_CLIENT_ID,
          callback: window.handleGoogleCredential,
          auto_select: false,
          cancel_on_tap_outside: true
        });
        gReady = true;
        renderGoogleButtons();
      } else if (tries++ < 50) {
        setTimeout(wait, 200);
      } else {
        $$('.gbtn').forEach((el) => (el.innerHTML =
          '<p class="hint">Gagal memuat Google Sign-In. Periksa koneksi internet atau buka lewat http/https (bukan file://).</p>'));
      }
    })();
  }

  function renderGoogleButtons() {
    if (!gReady) return;
    const card = $(`#view-${S.view} .auth-card`);
    const width = Math.max(200, Math.min(356, (card ? card.clientWidth : 420) - 64));
    const gelap = window.Tema && window.Tema.get() === 'dark';
    const base = { theme: gelap ? 'filled_black' : 'outline', size: 'large', shape: 'pill', width, locale: 'id' };
    if (S.view === 'login') google.accounts.id.renderButton($('#gLoginBtn'), { ...base, text: 'signin_with' });
    if (S.view === 'register' && !S.reg) google.accounts.id.renderButton($('#gRegBtn'), { ...base, text: 'signup_with' });
  }

  function decodeJwt(token) {
    try {
      let p = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      p += '='.repeat((4 - (p.length % 4)) % 4);
      const json = decodeURIComponent([...atob(p)].map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
      return JSON.parse(json);
    } catch (e) { return {}; }
  }

  // Dipanggil oleh Google Identity Services setelah pengguna memilih akun.
  window.handleGoogleCredential = async (resp) => {
    const credential = resp && resp.credential;
    if (!credential) return;
    if (S.view === 'register') {
      const p = decodeJwt(credential);
      S.reg = { credential, email: p.email || '', nama: p.name || '' };
      renderRegister();
      return;
    }
    // dari halaman login
    const r = await run(() => api('googleLogin', { credential }));
    if (!r) return;
    if (r.daftar) {
      S.reg = { credential, email: r.email, nama: r.nama };
      toast('Email belum terdaftar. Lengkapi pendaftaran di bawah.');
      location.hash = '#register';
      showView('register');
      return;
    }
    onLoggedIn(r);
  };

  window.addEventListener('temaberubah', () => { if (S.view !== 'app') renderGoogleButtons(); });

  /* ====================== LOGIN & REGISTER ====================== */
  $('#formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const r = await run(() => api('login', { username: f.username.value.trim(), password: f.password.value }));
    if (r) onLoggedIn(r);
  });

  function renderRegister() {
    const f = $('#formRegister');
    if (!S.reg) {
      $('#regStep1').hidden = false;
      f.hidden = true;
      return;
    }
    $('#regStep1').hidden = true;
    f.hidden = false;
    $('#regEmail').textContent = S.reg.email;
    if (!f.nama.value) f.nama.value = S.reg.nama || '';
    if (!f.username.value) {
      f.username.value = String(S.reg.email).split('@')[0].toLowerCase().replace(/[^a-z0-9._]/g, '').slice(0, 30);
    }
    f.password.focus();
  }

  $('#regGanti').addEventListener('click', () => {
    S.reg = null;
    $('#formRegister').reset();
    if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
    renderRegister();
    renderGoogleButtons();
  });

  $('#formRegister').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    if (!S.reg) return toast('Verifikasi akun Google terlebih dahulu.', true);
    if (f.password.value !== f.password2.value) return toast('Konfirmasi password tidak sama.', true);
    const r = await run(() => api('register', {
      credential: S.reg.credential,
      nama: f.nama.value.trim(),
      username: f.username.value.trim().toLowerCase(),
      password: f.password.value
    }), 'Pendaftaran berhasil!');
    if (r) onLoggedIn(r);
  });

  $$('.pw-toggle').forEach((b) => b.addEventListener('click', () => {
    const inp = b.previousElementSibling;
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    b.textContent = show ? 'Sembunyi' : 'Lihat';
  }));

  /* ======================== APP SHELL ======================== */
  function enterApp() {
    showView('app');
    const u = S.user;
    $('#userNama').textContent = u.nama;
    $('#userAvatar').textContent = (u.nama || u.username || '?').trim().charAt(0).toUpperCase();
    const rb = $('#userRole');
    rb.textContent = u.role === 'admin' ? 'Admin' : 'Peminjam';
    rb.className = 'badge ' + (u.role === 'admin' ? 'purple' : 'info');
    $('#tabs').innerHTML = TABS[u.role].map(([id, label]) =>
      `<button class="tab" data-tab="${id}">${label}<span class="count" hidden></span></button>`).join('');
    switchTab(TABS[u.role][0][0]);
    reload();
  }

  function switchTab(t) {
    S.tab = t;
    $$('#tabs .tab').forEach((x) => x.classList.toggle('active', x.dataset.tab === t));
    $$('.panel').forEach((p) => p.classList.toggle('active', p.id === 'p-' + t));
  }
  $('#tabs').addEventListener('click', (e) => {
    const b = e.target.closest('.tab');
    if (b) switchTab(b.dataset.tab);
  });
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-goto]');
    if (g) switchTab(g.dataset.goto);
  });

  async function reload() {
    if (!S.token) return;
    loading(true);
    try {
      if (isAdmin()) {
        const d = await api('adminAll');
        S.d.barang = d.barang; S.d.peminjaman = d.peminjaman; S.d.users = d.users;
      } else {
        const d = await api('userData');
        S.d.katalog = d.katalog; S.d.saya = d.peminjaman;
      }
      renderAll();
    } catch (e) {
      toast(e.message, true);
    } finally {
      loading(false);
    }
  }

  function renderAll() {
    renderProfil();
    if (isAdmin()) {
      renderFilterAdmin();
      renderDashboard();
      renderBarang();
      renderLoan();
      renderUsers();
      const n = S.d.peminjaman.filter((p) => p.status === 'Menunggu').length;
      const c = $('#tabs [data-tab="peminjaman"] .count');
      if (c) { c.textContent = n; c.hidden = n === 0; }
    } else {
      renderFilterKatalog();
      renderKatalog();
      renderSaya();
    }
  }

  /* ======================== BADGES ======================== */
  function badgeKondisi(k) {
    const cls = k === 'Baik' ? 'ok' : k === 'Rusak Ringan' ? 'warn' : 'bad';
    return `<span class="badge ${cls}">${esc(k)}</span>`;
  }
  function badgeStatus(p) {
    if (terlambat(p)) return '<span class="badge bad">Terlambat</span>';
    const cls = { Menunggu: 'warn', Dipinjam: 'info', Ditolak: 'bad', Dikembalikan: 'ok', Dibatalkan: '' }[p.status] ?? '';
    return `<span class="badge ${cls}">${esc(p.status)}</span>`;
  }

  /* ===================== PEMINJAM: KATALOG ===================== */
  function renderFilterKatalog() {
    const sel = $('#fKatalogKat');
    const cur = sel.value;
    const kats = [...new Set(S.d.katalog.map((b) => b.kategori).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Semua kategori</option>' + opts(kats, cur);
    const sl = $('#fKatalogLab');
    const curL = sl.value;
    const labs = [...new Set(S.d.katalog.map((b) => b.lab).filter(Boolean))].sort();
    sl.innerHTML = '<option value="">Semua lab</option>' + opts(labs, curL);
    sl.hidden = labs.length === 0;
    const ss = $('#fSayaStatus');
    if (ss.options.length <= 1) ss.innerHTML = '<option value="">Semua status</option>' + opts(STATUS_PINJAM);
  }

  function renderKatalog() {
    const q = $('#qKatalog').value.trim().toLowerCase();
    const k = $('#fKatalogKat').value;
    const lb = $('#fKatalogLab').value;
    const ada = $('#fKatalogAda').checked;
    const rows = S.d.katalog
      .filter((b) => (!k || b.kategori === k) && (!lb || b.lab === lb) && (!ada || b.tersedia > 0))
      .filter((b) => !q || [b.kode, b.nama, b.kategori, b.lokasi, b.lab].join(' ').toLowerCase().includes(q))
      .sort((a, b) => a.nama.localeCompare(b.nama));
    $('#emptyKatalog').hidden = rows.length > 0;
    $('#gridKatalog').innerHTML = rows.map((b) => {
      const bisa = b.tersedia > 0 && b.kondisi !== 'Rusak Berat';
      return `
      <div class="item-card">
        <div class="item-top"><span class="kode">${esc(b.kode)}</span>${badgeKondisi(b.kondisi)}</div>
        <h4>${esc(b.nama)}</h4>
        <p class="muted">${b.lab ? esc(b.lab) + ' · ' : ''}${esc(b.kategori)}${b.lokasi ? ' · ' + esc(b.lokasi) : ''}</p>
        <div class="item-foot">
          <span class="stok ${b.tersedia <= 0 ? 'habis' : ''}"><strong>${b.tersedia}</strong> <span class="muted">/ ${b.jumlah} tersedia</span></span>
          <button class="btn primary sm" data-ajukan="${esc(b.id)}" ${bisa ? '' : 'disabled'}>Ajukan</button>
        </div>
      </div>`;
    }).join('');
  }

  $('#gridKatalog').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ajukan]');
    if (b) openAjukan(b.dataset.ajukan);
  });
  ['#qKatalog', '#fKatalogKat', '#fKatalogLab', '#fKatalogAda'].forEach((s) => $(s).addEventListener('input', renderKatalog));

  function openAjukan(id) {
    const b = S.d.katalog.find((x) => x.id === id);
    if (!b) return;
    const f = $('#formAjukan');
    f.reset();
    f.id_barang.value = b.id;
    f.jumlah.max = b.tersedia;
    f.tanggal_pinjam.value = today();
    f.tanggal_pinjam.min = today();
    f.rencana_kembali.value = addDays(today(), 3);
    f.rencana_kembali.min = today();
    $('#ajukanInfo').innerHTML = `<strong>${esc(b.nama)}</strong>
      <span class="muted">${esc(b.kode)} · ${b.lab ? esc(b.lab) + ' · ' : ''}${esc(b.lokasi || '—')} · tersedia ${b.tersedia} unit</span>`;
    $('#dlgAjukan').showModal();
  }
  $('#formAjukan').tanggal_pinjam.addEventListener('change', (e) => {
    const f = $('#formAjukan');
    f.rencana_kembali.min = e.target.value;
    if (f.rencana_kembali.value < e.target.value) f.rencana_kembali.value = e.target.value;
  });
  $('#formAjukan').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.jumlah = Number(data.jumlah);
    if (await mutate('ajukan', { data }, 'Pengajuan terkirim. Menunggu persetujuan admin.')) {
      $('#dlgAjukan').close();
      switchTab('saya');
    }
  });

  /* ================ PEMINJAM: PEMINJAMAN SAYA ================ */
  function renderSaya() {
    const all = S.d.saya;
    $('#stSayaTunggu').textContent = all.filter((p) => p.status === 'Menunggu').length;
    $('#stSayaPinjam').textContent = all.filter((p) => p.status === 'Dipinjam').reduce((s, p) => s + p.jumlah, 0);
    $('#stSayaTelat').textContent = all.filter(terlambat).length;
    const st = $('#fSayaStatus').value;
    const rows = all.filter((p) => !st || p.status === st)
      .sort((a, b) => String(b.dibuat).localeCompare(String(a.dibuat)));
    $('#emptySaya').hidden = rows.length > 0;
    $('#tbSaya').innerHTML = rows.map((p) => `
      <tr>
        <td>${fmtTgl(p.tanggal_pinjam)}</td>
        <td><strong>${esc(p.nama_barang)}</strong> <span class="kode">${esc(p.kode_barang)}</span></td>
        <td class="num">${p.jumlah}</td>
        <td>${fmtTgl(p.rencana_kembali)}</td>
        <td>${badgeStatus(p)}</td>
        <td class="wrap">${esc(p.catatan_admin) || '—'}</td>
        <td class="aksi">${p.status === 'Menunggu'
          ? `<button class="btn-sm red" data-batal="${esc(p.id)}">Batalkan</button>` : ''}</td>
      </tr>`).join('');
  }
  $('#fSayaStatus').addEventListener('input', renderSaya);
  $('#tbSaya').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-batal]');
    if (b && confirm('Batalkan pengajuan ini?')) await mutate('batal', { id: b.dataset.batal }, 'Pengajuan dibatalkan');
  });

  /* ===================== ADMIN: DASHBOARD ===================== */
  function renderFilterAdmin() {
    const sel = $('#fKategori');
    const cur = sel.value;
    const kats = [...new Set(S.d.barang.map((b) => b.kategori).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Semua kategori</option>' + opts(kats, cur);
    $('#dlKategori').innerHTML = [...new Set([...KATEGORI_DEFAULT, ...kats])].map((k) => `<option value="${esc(k)}">`).join('');
    const labs = [...new Set([...(CFG.LABS || []).map((l) => l.nama), ...S.d.barang.map((b) => b.lab)].filter(Boolean))].sort();
    const fl = $('#fLab'), curL = fl.value;
    fl.innerHTML = '<option value="">Semua lab</option>' + opts(labs, curL) +
      (S.d.barang.some((b) => !b.lab) ? `<option value="__none" ${curL === '__none' ? 'selected' : ''}>Belum diatur</option>` : '');
    $('#dlLab').innerHTML = labs.map((l) => `<option value="${esc(l)}">`).join('');
    if ($('#fKondisi').options.length <= 1) $('#fKondisi').innerHTML = '<option value="">Semua kondisi</option>' + opts(KONDISI);
    if ($('#fLoanStatus').options.length <= 1) {
      $('#fLoanStatus').innerHTML = '<option value="">Semua status</option>' +
        opts([...STATUS_PINJAM, ['__telat', 'Terlambat']]);
    }
  }

  function renderDashboard() {
    const { barang, peminjaman, users } = S.d;
    const tunggu = peminjaman.filter((p) => p.status === 'Menunggu');
    const telat = peminjaman.filter(terlambat);
    $('#stJenis').textContent = barang.length;
    $('#stUnit').textContent = barang.reduce((s, b) => s + b.jumlah, 0).toLocaleString('id-ID');
    $('#stTunggu').textContent = tunggu.length;
    $('#stPinjam').textContent = peminjaman.filter((p) => p.status === 'Dipinjam').reduce((s, p) => s + p.jumlah, 0);
    $('#stUser').textContent = users.length;

    $('#listTunggu').innerHTML = tunggu.length ? tunggu
      .sort((a, b) => String(a.dibuat).localeCompare(String(b.dibuat)))
      .slice(0, 8).map((p) => `
        <div class="list-item">
          <div><strong>${esc(p.nama_barang)}</strong> × ${p.jumlah}
            <small>${esc(p.peminjam)} · ${fmtTgl(p.tanggal_pinjam)} → ${fmtTgl(p.rencana_kembali)}</small></div>
          <div class="acts">
            <button class="btn-sm green" data-loan="setujui" data-id="${esc(p.id)}">Setujui</button>
            <button class="btn-sm red" data-loan="tolak" data-id="${esc(p.id)}">Tolak</button>
          </div>
        </div>`).join('')
      : '<p class="empty">Tidak ada pengajuan baru.</p>';

    $('#listTelat').innerHTML = telat.length ? telat
      .sort((a, b) => a.rencana_kembali.localeCompare(b.rencana_kembali))
      .slice(0, 8).map((p) => `
        <div class="list-item">
          <div><strong>${esc(p.nama_barang)}</strong> × ${p.jumlah}
            <small>${esc(p.peminjam)} · harus kembali ${fmtTgl(p.rencana_kembali)}</small></div>
          <div class="acts">
            <span class="overdue">${hariTelat(p)} hari</span>
            <button class="btn-sm green" data-loan="kembali" data-id="${esc(p.id)}">Kembalikan</button>
          </div>
        </div>`).join('')
      : '<p class="empty">Tidak ada yang terlambat 👍</p>';

    const perKat = {};
    barang.forEach((b) => { const k = b.kategori || 'Lainnya'; perKat[k] = (perKat[k] || 0) + b.jumlah; });
    const rows = Object.entries(perKat).sort((a, b) => b[1] - a[1]);
    const max = Math.max(1, ...rows.map((r) => r[1]));
    $('#chartKategori').innerHTML = rows.length ? rows.map(([k, v]) => `
      <div class="bar-row"><span title="${esc(k)}">${esc(k)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(v / max) * 100}%"></div></div>
        <span class="num">${v}</span></div>`).join('')
      : '<p class="empty">Belum ada data barang.</p>';
  }
  $('#p-dashboard').addEventListener('click', (e) => {
    const b = e.target.closest('[data-loan]');
    if (b) loanAction(b.dataset.loan, b.dataset.id);
  });

  /* ======================= ADMIN: BARANG ======================= */
  function filteredBarang() {
    const q = $('#qBarang').value.trim().toLowerCase();
    const k = $('#fKategori').value;
    const c = $('#fKondisi').value;
    const lb = $('#fLab').value;
    return S.d.barang
      .filter((b) => (!k || b.kategori === k) && (!c || b.kondisi === c))
      .filter((b) => !lb || (lb === '__none' ? !b.lab : b.lab === lb))
      .filter((b) => !q || [b.kode, b.nama, b.lokasi, b.kategori, b.keterangan, b.lab].join(' ').toLowerCase().includes(q))
      .sort((a, b) => a.kode.localeCompare(b.kode));
  }

  function renderBarang() {
    const rows = filteredBarang();
    $('#emptyBarang').hidden = rows.length > 0;
    $('#tbBarang').innerHTML = rows.map((b) => `
      <tr>
        <td class="kode">${esc(b.kode)}</td>
        <td><strong>${esc(b.nama)}</strong></td>
        <td>${esc(b.lab) || '<span class="muted">—</span>'}</td>
        <td>${esc(b.kategori)}</td>
        <td class="num">${b.jumlah}</td>
        <td class="num ${b.tersedia <= 0 ? 'zero' : ''}">${b.tersedia}</td>
        <td>${badgeKondisi(b.kondisi)}</td>
        <td>${esc(b.lokasi) || '—'}</td>
        <td class="aksi"><span class="acts">
          <button class="btn-sm blue" data-act="edit" data-id="${esc(b.id)}">Edit</button>
          <button class="btn-sm red" data-act="hapus" data-id="${esc(b.id)}">Hapus</button>
        </span></td>
      </tr>`).join('');
  }
  ['#qBarang', '#fLab', '#fKategori', '#fKondisi'].forEach((s) => $(s).addEventListener('input', renderBarang));

  let editBarangId = null;
  function openBarang(b = null) {
    editBarangId = b ? b.id : null;
    const f = $('#formBarang');
    f.reset();
    f.kondisi.innerHTML = opts(KONDISI, b ? b.kondisi : 'Baik');
    $('#dlgBarangTitle').textContent = b ? 'Edit barang' : 'Tambah barang';
    if (b) ['kode', 'nama', 'lab', 'kategori', 'jumlah', 'lokasi', 'tanggal_masuk', 'keterangan'].forEach((k) => (f[k].value = b[k] ?? ''));
    else f.tanggal_masuk.value = today();
    $('#dlgBarang').showModal();
  }
  $('#btnTambahBarang').addEventListener('click', () => openBarang());
  $('#tbBarang').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const b = S.d.barang.find((x) => x.id === btn.dataset.id);
    if (!b) return;
    if (btn.dataset.act === 'edit') openBarang(b);
    if (btn.dataset.act === 'hapus' && confirm(`Hapus barang "${b.nama}" (${b.kode})?`)) {
      await mutate('barangDelete', { id: b.id }, 'Barang dihapus');
    }
  });
  $('#formBarang').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.jumlah = Number(data.jumlah);
    if (await mutate('barangSave', { id: editBarangId, data }, editBarangId ? 'Barang diperbarui' : 'Barang ditambahkan')) {
      $('#dlgBarang').close();
    }
  });

  $('#btnExport').addEventListener('click', () => {
    const cols = ['kode', 'nama', 'lab', 'kategori', 'jumlah', 'tersedia', 'kondisi', 'lokasi', 'tanggal_masuk', 'keterangan'];
    const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [cols.join(';'), ...filteredBarang().map((b) => cols.map((c) => q(b[c])).join(';'))];
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `inventaris-lab-${today()}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  /* ===================== ADMIN: PEMINJAMAN ===================== */
  function renderLoan() {
    const q = $('#qLoan').value.trim().toLowerCase();
    const st = $('#fLoanStatus').value;
    const urut = { Menunggu: 0, Dipinjam: 1, Ditolak: 2, Dikembalikan: 3, Dibatalkan: 4 };
    const rows = S.d.peminjaman
      .filter((p) => !st || (st === '__telat' ? terlambat(p) : p.status === st))
      .filter((p) => !q || [p.nama_barang, p.kode_barang, p.peminjam, p.keperluan].join(' ').toLowerCase().includes(q))
      .sort((a, b) => (urut[a.status] - urut[b.status]) || String(b.dibuat).localeCompare(String(a.dibuat)));
    $('#emptyLoan').hidden = rows.length > 0;
    $('#tbLoan').innerHTML = rows.map((p) => {
      const id = esc(p.id);
      const quick = p.status === 'Menunggu'
        ? `<button class="btn-sm green" data-loan="setujui" data-id="${id}">Setujui</button>
           <button class="btn-sm amber" data-loan="tolak" data-id="${id}">Tolak</button>`
        : p.status === 'Dipinjam'
          ? `<button class="btn-sm green" data-loan="kembali" data-id="${id}">Kembalikan</button>` : '';
      return `
      <tr>
        <td>${fmtTgl(p.tanggal_pinjam)}</td>
        <td><strong>${esc(p.nama_barang)}</strong> <span class="kode">${esc(p.kode_barang)}</span></td>
        <td>${esc(p.peminjam)}</td>
        <td class="num">${p.jumlah}</td>
        <td>${fmtTgl(p.rencana_kembali)}</td>
        <td>${badgeStatus(p)}</td>
        <td class="wrap">${esc(p.keperluan) || '—'}</td>
        <td class="aksi"><span class="acts">${quick}
          <button class="btn-sm blue" data-loan="edit" data-id="${id}">Edit</button>
          <button class="btn-sm red" data-loan="hapus" data-id="${id}">Hapus</button>
        </span></td>
      </tr>`;
    }).join('');
  }
  ['#qLoan', '#fLoanStatus'].forEach((s) => $(s).addEventListener('input', renderLoan));
  $('#tbLoan').addEventListener('click', (e) => {
    const b = e.target.closest('[data-loan]');
    if (b) loanAction(b.dataset.loan, b.dataset.id);
  });

  async function loanAction(act, id) {
    const p = S.d.peminjaman.find((x) => x.id === id);
    if (!p) return;
    const label = `${p.jumlah} × ${p.nama_barang} (${p.peminjam})`;
    if (act === 'setujui') {
      await mutate('loanStatus', { id, status: 'Dipinjam' }, 'Peminjaman disetujui');
    } else if (act === 'tolak') {
      const alasan = prompt(`Tolak pengajuan ${label}?\nAlasan (opsional):`, '');
      if (alasan !== null) await mutate('loanStatus', { id, status: 'Ditolak', catatan_admin: alasan }, 'Pengajuan ditolak');
    } else if (act === 'kembali') {
      if (confirm(`Tandai ${label} sudah dikembalikan?`)) {
        await mutate('loanStatus', { id, status: 'Dikembalikan' }, 'Barang dikembalikan');
      }
    } else if (act === 'edit') {
      openLoan(p);
    } else if (act === 'hapus') {
      if (confirm(`Hapus data peminjaman ${label}?`)) await mutate('loanDelete', { id }, 'Data peminjaman dihapus');
    }
  }

  let editLoanId = null;
  function openLoan(p = null) {
    editLoanId = p ? p.id : null;
    const f = $('#formLoan');
    f.reset();
    $('#dlgLoanTitle').textContent = p ? 'Edit peminjaman' : 'Tambah peminjaman';
    const users = [...S.d.users].sort((a, b) => a.nama.localeCompare(b.nama))
      .map((u) => [u.id, `${u.nama} (@${u.username})${u.status !== 'aktif' ? ' — nonaktif' : ''}`]);
    f.id_user.innerHTML = '<option value="">— pilih peminjam —</option>' + opts(users, p ? p.id_user : '');
    const barang = [...S.d.barang].sort((a, b) => a.nama.localeCompare(b.nama))
      .map((b) => [b.id, `${b.nama} (${b.kode}) — tersedia ${b.tersedia}`]);
    f.id_barang.innerHTML = '<option value="">— pilih barang —</option>' + opts(barang, p ? p.id_barang : '');
    f.status.innerHTML = opts(STATUS_PINJAM, p ? p.status : 'Dipinjam');
    if (p) {
      ['jumlah', 'tanggal_pinjam', 'rencana_kembali', 'tanggal_kembali', 'keperluan', 'catatan_admin']
        .forEach((k) => (f[k].value = p[k] ?? ''));
    } else {
      f.tanggal_pinjam.value = today();
      f.rencana_kembali.value = addDays(today(), 3);
    }
    updateLoanStok();
    $('#dlgLoan').showModal();
  }
  function updateLoanStok() {
    const f = $('#formLoan');
    const b = S.d.barang.find((x) => x.id === f.id_barang.value);
    if (!b) { $('#loanStokInfo').textContent = ''; return; }
    const lama = editLoanId && S.d.peminjaman.find((x) => x.id === editLoanId);
    const ikut = lama && lama.id_barang === b.id && ['Menunggu', 'Dipinjam'].includes(lama.status) ? lama.jumlah : 0;
    $('#loanStokInfo').textContent = `Stok tersedia untuk barang ini: ${b.tersedia + ikut} dari ${b.jumlah} unit.`;
  }
  $('#formLoan').id_barang.addEventListener('change', updateLoanStok);
  $('#btnTambahLoan').addEventListener('click', () => openLoan());
  $('#formLoan').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.jumlah = Number(data.jumlah);
    if (await mutate('loanSave', { id: editLoanId, data }, editLoanId ? 'Peminjaman diperbarui' : 'Peminjaman ditambahkan')) {
      $('#dlgLoan').close();
    }
  });

  /* ======================== ADMIN: USERS ======================== */
  function renderUsers() {
    const q = $('#qUser').value.trim().toLowerCase();
    const r = $('#fUserRole').value;
    const rows = S.d.users
      .filter((u) => !r || u.role === r)
      .filter((u) => !q || [u.username, u.nama, u.email].join(' ').toLowerCase().includes(q))
      .sort((a, b) => (a.role === b.role ? a.nama.localeCompare(b.nama) : a.role === 'admin' ? -1 : 1));
    $('#emptyUser').hidden = rows.length > 0;
    $('#tbUser').innerHTML = rows.map((u) => {
      const saya = u.id === S.user.id;
      return `
      <tr>
        <td class="kode">@${esc(u.username)}</td>
        <td><strong>${esc(u.nama)}</strong>${saya ? ' <span class="muted">(Anda)</span>' : ''}</td>
        <td>${esc(u.email) || '—'}</td>
        <td><span class="badge ${u.role === 'admin' ? 'purple' : 'info'}">${u.role === 'admin' ? 'Admin' : 'Peminjam'}</span></td>
        <td><span class="badge ${u.status === 'aktif' ? 'ok' : ''}">${u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</span></td>
        <td>${fmtTgl(u.dibuat)}</td>
        <td class="aksi"><span class="acts">
          <button class="btn-sm blue" data-act="edit" data-id="${esc(u.id)}">Edit</button>
          ${saya ? '' : `<button class="btn-sm red" data-act="hapus" data-id="${esc(u.id)}">Hapus</button>`}
        </span></td>
      </tr>`;
    }).join('');
  }
  ['#qUser', '#fUserRole'].forEach((s) => $(s).addEventListener('input', renderUsers));

  let editUserId = null;
  function openUser(u = null) {
    editUserId = u ? u.id : null;
    const f = $('#formUser');
    f.reset();
    $('#dlgUserTitle').textContent = u ? 'Edit pengguna' : 'Tambah pengguna';
    $('#pwHint').textContent = u ? '(kosongkan jika tidak diubah)' : '* minimal 6 karakter';
    f.password.required = !u;
    if (u) ['username', 'nama', 'email', 'role', 'status'].forEach((k) => (f[k].value = u[k] ?? ''));
    const saya = u && u.id === S.user.id;
    f.role.disabled = !!saya;
    f.status.disabled = !!saya;
    $('#dlgUser').showModal();
  }
  $('#btnTambahUser').addEventListener('click', () => openUser());
  $('#tbUser').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const u = S.d.users.find((x) => x.id === btn.dataset.id);
    if (!u) return;
    if (btn.dataset.act === 'edit') openUser(u);
    if (btn.dataset.act === 'hapus' && confirm(`Hapus pengguna ${u.nama} (@${u.username})?`)) {
      await mutate('userDelete', { id: u.id }, 'Pengguna dihapus');
    }
  });
  $('#formUser').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const data = {
      username: f.username.value.trim().toLowerCase(), nama: f.nama.value.trim(), email: f.email.value.trim(),
      role: f.role.value, status: f.status.value, password: f.password.value
    };
    const ok = await mutate('userSave', { id: editUserId, data }, editUserId ? 'Pengguna diperbarui' : 'Pengguna ditambahkan');
    if (ok) {
      $('#dlgUser').close();
      if (editUserId === S.user.id) { // perbarui nama di header
        const me = S.d.users.find((x) => x.id === S.user.id);
        if (me) { saveSession(S.token, me); $('#userNama').textContent = me.nama; renderProfil(); }
      }
    }
  });

  /* ========================== PROFIL ========================== */
  function renderProfil() {
    const u = S.user;
    $('#profilInfo').innerHTML = `
      <dt>Nama</dt><dd>${esc(u.nama)}</dd>
      <dt>Username</dt><dd>@${esc(u.username)}</dd>
      <dt>Email</dt><dd>${esc(u.email) || '—'}</dd>
      <dt>Peran</dt><dd>${u.role === 'admin' ? 'Admin' : 'Peminjam'}</dd>
      <dt>Terdaftar</dt><dd>${fmtTgl(u.dibuat)}</dd>`;
  }
  $('#formPassword').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    if (f.baru.value !== f.baru2.value) return toast('Konfirmasi password baru tidak sama.', true);
    const r = await run(() => api('gantiPassword', { lama: f.lama.value, baru: f.baru.value }), 'Password berhasil diganti');
    if (r) f.reset();
  });

  /* ========================== UMUM ========================== */
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
  $('#btnRefresh').addEventListener('click', reload);
  $('#btnLogout').addEventListener('click', () => { if (confirm('Keluar dari aplikasi?')) logout(); });

  /* ========================== INIT ========================== */
  async function init() {
    $$('.nama-lab').forEach((el) => (el.textContent = CFG.NAMA_LAB || 'Laboratorium'));
    initGoogle();
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(LS_SESI) || 'null'); } catch (e) { /* abaikan */ }
    if (saved && saved.token) {
      S.token = saved.token;
      S.user = saved.user;
      loading(true);
      try {
        const r = await api('me');
        saveSession(saved.token, r.user);
        enterApp();
        return;
      } catch (e) {
        endSession();
        if (e.code !== 'AUTH') toast(e.message, true);
      } finally {
        loading(false);
      }
    }
    showView(location.hash === '#register' ? 'register' : 'login');
  }
  init();
})();
