/**
 * ============================================================
 *  BACKEND APLIKASI INVENTARIS LAB v2 — Google Apps Script
 *  Database : Google Spreadsheet (sheet users, barang, peminjaman)
 *  Fitur    : login username/password, registrasi via akun Google,
 *             peran admin & peminjam, CRUD user/barang/peminjaman.
 * ============================================================
 *  1. Isi GOOGLE_CLIENT_ID di bawah (lihat README).
 *  2. Jalankan fungsi setup() sekali → membuat sheet + akun admin awal.
 *  3. Deploy → Aplikasi web (Jalankan sebagai: Saya, Akses: Siapa saja).
 */

// OAuth Client ID dari Google Cloud Console (sama dengan di config.js)
const GOOGLE_CLIENT_ID = '553740532104-r02vq7o7jmam52kqb58cb71q61l3i8bh.apps.googleusercontent.com';

// Lama sesi login (maksimal 6 jam, batas CacheService)
const SESSION_JAM = 6;

// Akun admin yang dibuat otomatis saat setup() — SEGERA GANTI PASSWORD setelah login.
const ADMIN_AWAL = { username: 'admin', password: 'admin123', nama: 'Administrator' };

const SCHEMA = {
  users: ['id', 'username', 'nama', 'email', 'role', 'password_hash', 'salt', 'status', 'dibuat'],
  barang: ['id', 'kode', 'nama', 'kategori', 'jumlah', 'kondisi', 'lokasi', 'tanggal_masuk', 'keterangan'],
  peminjaman: ['id', 'id_barang', 'kode_barang', 'nama_barang', 'id_user', 'peminjam', 'jumlah',
               'tanggal_pinjam', 'rencana_kembali', 'tanggal_kembali', 'status', 'keperluan',
               'catatan_admin', 'dibuat']
};
const KOLOM_ANGKA = ['jumlah'];
const KONDISI = ['Baik', 'Rusak Ringan', 'Rusak Berat'];
const ROLES = ['admin', 'peminjam'];
const STATUS_USER = ['aktif', 'nonaktif'];
const STATUS_PINJAM = ['Menunggu', 'Dipinjam', 'Ditolak', 'Dikembalikan', 'Dibatalkan'];
const MENGIKAT_STOK = ['Menunggu', 'Dipinjam']; // status yang mengurangi stok tersedia

/* ============================ SETUP ============================ */

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SCHEMA).forEach(function (name) {
    const cols = SCHEMA[name];
    let sh = ss.getSheetByName(name);
    // Jika struktur kolom lama berbeda, sheet lama disimpan sebagai cadangan.
    if (sh && sh.getLastRow() > 0) {
      const head = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0].map(String);
      if (head.join('|') !== cols.join('|')) {
        sh.setName(name + '_lama_' + Utilities.formatDate(new Date(), tz_(), 'yyyyMMdd_HHmm'));
        sh = null;
      }
    }
    if (!sh) sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, cols.length).setValues([cols])
      .setFontWeight('bold').setBackground('#1e3a5f').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    cols.forEach(function (c, i) {
      if (KOLOM_ANGKA.indexOf(c) < 0) sh.getRange(1, i + 1, sh.getMaxRows(), 1).setNumberFormat('@');
    });
  });

  if (!readAll_('users').some(function (u) { return u.role === 'admin'; })) {
    const salt = newId_();
    insert_('users', {
      id: newId_(), username: ADMIN_AWAL.username, nama: ADMIN_AWAL.nama, email: '',
      role: 'admin', password_hash: hash_(ADMIN_AWAL.password, salt), salt: salt,
      status: 'aktif', dibuat: now_()
    });
    Logger.log('Akun admin dibuat → username: %s, password: %s', ADMIN_AWAL.username, ADMIN_AWAL.password);
  }
}

/* ============================ HTTP ============================= */

function doGet() {
  return out_(function () { return { pesan: 'API Inventaris Lab aktif. Gunakan POST.', versi: 2 }; });
}

function doPost(e) {
  return out_(function () {
    return route_(JSON.parse((e && e.postData && e.postData.contents) || '{}'));
  });
}

function out_(fn) {
  let res;
  try { res = { ok: true, data: fn() }; }
  catch (err) { res = { ok: false, error: err.message || String(err), code: err.code || '' }; }
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

const AKSI_PUBLIK = { login: login_, googleLogin: googleLogin_, register: register_ };
const AKSI_LOGIN = { me: me_, logout: logout_, gantiPassword: gantiPassword_,
                     userData: userData_, ajukan: ajukan_, batal: batal_ };
const AKSI_ADMIN = { adminAll: adminAll_, barangSave: barangSave_, barangDelete: barangDelete_,
                     loanSave: loanSave_, loanStatus: loanStatus_, loanDelete: loanDelete_,
                     userSave: userSave_, userDelete: userDelete_ };

function route_(b) {
  const a = String(b.action || '');
  if (a === 'ping') return { pesan: 'pong' };
  return kunci_(function () {
    if (AKSI_PUBLIK.hasOwnProperty(a)) return AKSI_PUBLIK[a](b);
    const sesi = auth_(b.token);
    if (AKSI_LOGIN.hasOwnProperty(a)) return AKSI_LOGIN[a](b, sesi);
    if (AKSI_ADMIN.hasOwnProperty(a)) {
      if (sesi.user.role !== 'admin') throw new Error('Akses ditolak: khusus admin.');
      return AKSI_ADMIN[a](b, sesi);
    }
    throw new Error('Aksi tidak dikenal: ' + a);
  });
}

function kunci_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

/* ======================= AUTENTIKASI =========================== */

function login_(b) {
  const username = str_(b.username).toLowerCase();
  const u = readAll_('users').filter(function (x) { return x.username === username; })[0];
  if (!u || hash_(String(b.password || ''), u.salt) !== u.password_hash) {
    throw new Error('Username atau password salah.');
  }
  if (u.status !== 'aktif') throw new Error('Akun Anda dinonaktifkan. Hubungi admin.');
  return buatSesi_(u);
}

function googleLogin_(b) {
  const g = verifikasiGoogle_(b.credential);
  const u = readAll_('users').filter(function (x) { return x.email && x.email.toLowerCase() === g.email; })[0];
  if (!u) return { daftar: true, email: g.email, nama: g.nama };
  if (u.status !== 'aktif') throw new Error('Akun Anda dinonaktifkan. Hubungi admin.');
  return buatSesi_(u);
}

function register_(b) {
  const g = verifikasiGoogle_(b.credential);
  cekEmail_(g.email);
  const username = str_(b.username).toLowerCase();
  cekUsername_(username);
  cekPassword_(b.password);
  const salt = newId_();
  const u = insert_('users', {
    id: newId_(), username: username, nama: str_(b.nama) || g.nama, email: g.email,
    role: 'peminjam', password_hash: hash_(String(b.password), salt), salt: salt,
    status: 'aktif', dibuat: now_()
  });
  return buatSesi_(u);
}

function verifikasiGoogle_(credential) {
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.indexOf('ISI_') === 0) {
    throw new Error('GOOGLE_CLIENT_ID di Code.gs belum diisi.');
  }
  if (!credential) throw new Error('Token Google tidak ada.');
  const r = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' +
    encodeURIComponent(credential), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) throw new Error('Token Google tidak valid atau kedaluwarsa. Coba lagi.');
  const t = JSON.parse(r.getContentText());
  if (t.aud !== GOOGLE_CLIENT_ID) throw new Error('Token Google bukan untuk aplikasi ini (Client ID berbeda).');
  if (String(t.email_verified) !== 'true') throw new Error('Email Google belum terverifikasi.');
  return { email: String(t.email).toLowerCase(), nama: t.name || String(t.email).split('@')[0] };
}

function auth_(token) {
  const gagal = new Error('Sesi berakhir, silakan login kembali.');
  gagal.code = 'AUTH';
  if (!token) throw gagal;
  const cache = CacheService.getScriptCache();
  const raw = cache.get('s_' + token);
  if (!raw) throw gagal;
  const uid = JSON.parse(raw).uid;
  const user = readAll_('users').filter(function (u) { return u.id === uid; })[0];
  if (!user || user.status !== 'aktif') { cache.remove('s_' + token); throw gagal; }
  cache.put('s_' + token, raw, detikSesi_()); // perpanjang sesi saat aktif
  return { token: token, user: user };
}

function buatSesi_(u) {
  const token = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
  CacheService.getScriptCache().put('s_' + token, JSON.stringify({ uid: u.id }), detikSesi_());
  return { token: token, user: publicUser_(u) };
}

function me_(b, sesi) { return { user: publicUser_(sesi.user) }; }

function logout_(b, sesi) {
  CacheService.getScriptCache().remove('s_' + sesi.token);
  return { keluar: true };
}

function gantiPassword_(b, sesi) {
  const u = sesi.user;
  if (hash_(String(b.lama || ''), u.salt) !== u.password_hash) throw new Error('Password lama salah.');
  cekPassword_(b.baru);
  u.salt = newId_();
  u.password_hash = hash_(String(b.baru), u.salt);
  update_('users', u.id, u);
  return { berhasil: true };
}

/* ========================= PEMINJAM ============================ */

function userData_(b, sesi) {
  const katalog = barangDenganStok_().map(function (x) {
    return { id: x.id, kode: x.kode, nama: x.nama, kategori: x.kategori, kondisi: x.kondisi,
             lokasi: x.lokasi, jumlah: x.jumlah, tersedia: x.tersedia };
  });
  const milik = readAll_('peminjaman').filter(function (p) { return p.id_user === sesi.user.id; });
  return { katalog: katalog, peminjaman: milik };
}

function ajukan_(b, sesi) {
  const d = b.data || {};
  const brg = readAll_('barang').filter(function (x) { return x.id === str_(d.id_barang); })[0];
  if (!brg) throw new Error('Barang tidak ditemukan.');
  if (brg.kondisi === 'Rusak Berat') throw new Error('Barang rusak berat dan tidak bisa dipinjam.');
  const jml = int_(d.jumlah, 'Jumlah');
  if (jml < 1) throw new Error('Jumlah pinjam minimal 1.');
  const sisa = brg.jumlah - terikat_(brg.id, readAll_('peminjaman'));
  if (jml > sisa) throw new Error('Stok tersedia hanya ' + sisa + ' unit.');
  const tp = tgl_(d.tanggal_pinjam, 'Tanggal pinjam') || today_();
  const rk = tgl_(d.rencana_kembali, 'Rencana kembali');
  if (!rk) throw new Error('Rencana tanggal kembali wajib diisi.');
  if (rk < tp) throw new Error('Rencana kembali tidak boleh sebelum tanggal pinjam.');
  if (!str_(d.keperluan)) throw new Error('Keperluan wajib diisi.');
  return insert_('peminjaman', {
    id: newId_(), id_barang: brg.id, kode_barang: brg.kode, nama_barang: brg.nama,
    id_user: sesi.user.id, peminjam: sesi.user.nama, jumlah: jml,
    tanggal_pinjam: tp, rencana_kembali: rk, tanggal_kembali: '', status: 'Menunggu',
    keperluan: str_(d.keperluan), catatan_admin: '', dibuat: now_()
  });
}

function batal_(b, sesi) {
  const p = readAll_('peminjaman').filter(function (x) { return x.id === String(b.id); })[0];
  if (!p || p.id_user !== sesi.user.id) throw new Error('Data peminjaman tidak ditemukan.');
  if (p.status !== 'Menunggu') throw new Error('Hanya pengajuan berstatus Menunggu yang bisa dibatalkan.');
  p.status = 'Dibatalkan';
  return update_('peminjaman', p.id, p);
}

/* =========================== ADMIN ============================= */

function adminAll_() {
  return {
    barang: barangDenganStok_(),
    peminjaman: readAll_('peminjaman'),
    users: readAll_('users').map(publicUser_)
  };
}

// ---- Barang ----
function barangSave_(b) {
  const d = b.data || {};
  const o = {
    kode: str_(d.kode).toUpperCase(),
    nama: str_(d.nama),
    kategori: str_(d.kategori) || 'Lainnya',
    jumlah: int_(d.jumlah, 'Jumlah'),
    kondisi: KONDISI.indexOf(str_(d.kondisi)) >= 0 ? str_(d.kondisi) : 'Baik',
    lokasi: str_(d.lokasi),
    tanggal_masuk: tgl_(d.tanggal_masuk, 'Tanggal masuk'),
    keterangan: str_(d.keterangan)
  };
  if (!o.kode) throw new Error('Kode barang wajib diisi.');
  if (!o.nama) throw new Error('Nama barang wajib diisi.');
  const semua = readAll_('barang');
  if (semua.some(function (x) { return x.kode.toUpperCase() === o.kode && x.id !== String(b.id || ''); })) {
    throw new Error('Kode "' + o.kode + '" sudah dipakai barang lain.');
  }
  if (b.id) {
    const terpakai = terikat_(String(b.id), readAll_('peminjaman'));
    if (o.jumlah < terpakai) throw new Error('Jumlah tidak boleh kurang dari ' + terpakai + ' (sedang dipinjam/diajukan).');
    o.id = String(b.id);
    return update_('barang', o.id, o);
  }
  o.id = newId_();
  return insert_('barang', o);
}

function barangDelete_(b) {
  if (terikat_(String(b.id), readAll_('peminjaman')) > 0) {
    throw new Error('Barang masih dipinjam atau diajukan. Selesaikan dulu peminjamannya.');
  }
  remove_('barang', b.id);
  return { id: b.id };
}

// ---- Peminjaman ----
function loanSave_(b) {
  const d = b.data || {};
  const semua = readAll_('peminjaman');
  const lama = b.id ? semua.filter(function (p) { return p.id === String(b.id); })[0] : null;
  if (b.id && !lama) throw new Error('Data peminjaman tidak ditemukan.');
  const brg = readAll_('barang').filter(function (x) { return x.id === str_(d.id_barang); })[0];
  if (!brg) throw new Error('Barang tidak ditemukan.');
  const usr = readAll_('users').filter(function (u) { return u.id === str_(d.id_user); })[0];
  if (!usr) throw new Error('Peminjam tidak ditemukan.');
  const jml = int_(d.jumlah, 'Jumlah');
  if (jml < 1) throw new Error('Jumlah minimal 1.');
  const status = STATUS_PINJAM.indexOf(str_(d.status)) >= 0 ? str_(d.status) : 'Dipinjam';
  if (MENGIKAT_STOK.indexOf(status) >= 0) {
    const sisa = brg.jumlah - terikat_(brg.id, semua, lama && lama.id);
    if (jml > sisa) throw new Error('Stok tersedia hanya ' + sisa + ' unit.');
  }
  const tp = tgl_(d.tanggal_pinjam, 'Tanggal pinjam') || today_();
  const rk = tgl_(d.rencana_kembali, 'Rencana kembali');
  if (rk && rk < tp) throw new Error('Rencana kembali tidak boleh sebelum tanggal pinjam.');
  let tk = tgl_(d.tanggal_kembali, 'Tanggal kembali');
  if (status === 'Dikembalikan' && !tk) tk = today_();
  if (status !== 'Dikembalikan') tk = '';
  const o = {
    id: lama ? lama.id : newId_(), id_barang: brg.id, kode_barang: brg.kode, nama_barang: brg.nama,
    id_user: usr.id, peminjam: usr.nama, jumlah: jml, tanggal_pinjam: tp, rencana_kembali: rk,
    tanggal_kembali: tk, status: status, keperluan: str_(d.keperluan),
    catatan_admin: str_(d.catatan_admin), dibuat: lama ? lama.dibuat : now_()
  };
  return lama ? update_('peminjaman', o.id, o) : insert_('peminjaman', o);
}

function loanStatus_(b) {
  const semua = readAll_('peminjaman');
  const p = semua.filter(function (x) { return x.id === String(b.id); })[0];
  if (!p) throw new Error('Data peminjaman tidak ditemukan.');
  const status = str_(b.status);
  if (STATUS_PINJAM.indexOf(status) < 0) throw new Error('Status tidak valid.');
  const dariMengikat = MENGIKAT_STOK.indexOf(p.status) >= 0;
  if (MENGIKAT_STOK.indexOf(status) >= 0 && !dariMengikat) {
    const brg = readAll_('barang').filter(function (x) { return x.id === p.id_barang; })[0];
    const sisa = brg ? brg.jumlah - terikat_(brg.id, semua, p.id) : 0;
    if (p.jumlah > sisa) throw new Error('Stok tersedia hanya ' + sisa + ' unit.');
  }
  p.status = status;
  p.tanggal_kembali = status === 'Dikembalikan' ? today_() : '';
  if (b.catatan_admin !== undefined) p.catatan_admin = str_(b.catatan_admin);
  return update_('peminjaman', p.id, p);
}

function loanDelete_(b) {
  remove_('peminjaman', b.id);
  return { id: b.id };
}

// ---- User ----
function userSave_(b, sesi) {
  const d = b.data || {};
  const lama = b.id ? readAll_('users').filter(function (u) { return u.id === String(b.id); })[0] : null;
  if (b.id && !lama) throw new Error('User tidak ditemukan.');
  const username = str_(d.username).toLowerCase();
  cekUsername_(username, lama && lama.id);
  const email = str_(d.email).toLowerCase();
  cekEmail_(email, lama && lama.id, true);
  const nama = str_(d.nama);
  if (!nama) throw new Error('Nama wajib diisi.');
  const role = ROLES.indexOf(d.role) >= 0 ? d.role : 'peminjam';
  const status = STATUS_USER.indexOf(d.status) >= 0 ? d.status : 'aktif';
  if (lama && lama.id === sesi.user.id && (role !== 'admin' || status !== 'aktif')) {
    throw new Error('Anda tidak bisa menurunkan peran atau menonaktifkan akun sendiri.');
  }
  const o = lama ? Object.assign({}, lama) : { id: newId_(), dibuat: now_() };
  Object.assign(o, { username: username, nama: nama, email: email, role: role, status: status });
  if (d.password) {
    cekPassword_(d.password);
    o.salt = newId_();
    o.password_hash = hash_(String(d.password), o.salt);
  } else if (!lama) {
    throw new Error('Password wajib diisi untuk user baru.');
  }
  if (lama) update_('users', o.id, o); else insert_('users', o);
  // perbarui nama peminjam di riwayat agar konsisten
  if (lama && lama.nama !== nama) {
    readAll_('peminjaman').forEach(function (p) {
      if (p.id_user === o.id) { p.peminjam = nama; update_('peminjaman', p.id, p); }
    });
  }
  return publicUser_(o);
}

function userDelete_(b, sesi) {
  if (String(b.id) === sesi.user.id) throw new Error('Anda tidak bisa menghapus akun sendiri.');
  const aktif = readAll_('peminjaman').some(function (p) {
    return p.id_user === String(b.id) && MENGIKAT_STOK.indexOf(p.status) >= 0;
  });
  if (aktif) throw new Error('User masih punya peminjaman aktif/menunggu.');
  remove_('users', b.id);
  return { id: b.id };
}

/* ======================== VALIDASI ============================= */

function publicUser_(u) {
  return { id: u.id, username: u.username, nama: u.nama, email: u.email,
           role: u.role, status: u.status, dibuat: u.dibuat };
}

function cekUsername_(username, kecualiId) {
  if (!/^[a-z0-9._]{3,30}$/.test(username)) {
    throw new Error('Username 3–30 karakter: huruf kecil, angka, titik, atau garis bawah.');
  }
  if (readAll_('users').some(function (u) { return u.username === username && u.id !== kecualiId; })) {
    throw new Error('Username "' + username + '" sudah dipakai.');
  }
}

function cekEmail_(email, kecualiId, boleh_kosong) {
  if (!email) { if (boleh_kosong) return; throw new Error('Email wajib diisi.'); }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Format email tidak valid.');
  if (readAll_('users').some(function (u) { return u.email && u.email.toLowerCase() === email && u.id !== kecualiId; })) {
    throw new Error('Email ' + email + ' sudah terdaftar. Silakan login.');
  }
}

function cekPassword_(pw) {
  if (String(pw || '').length < 6) throw new Error('Password minimal 6 karakter.');
}

function hash_(pw, salt) {
  let h = salt + '|' + pw;
  for (let i = 0; i < 100; i++) {
    h = Utilities.base64Encode(Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, h, Utilities.Charset.UTF_8));
  }
  return h;
}

function terikat_(idBarang, pinjaman, kecualiId) {
  return pinjaman.filter(function (p) {
    return p.id_barang === idBarang && MENGIKAT_STOK.indexOf(p.status) >= 0 && p.id !== kecualiId;
  }).reduce(function (s, p) { return s + Number(p.jumlah || 0); }, 0);
}

function barangDenganStok_() {
  const pj = readAll_('peminjaman');
  return readAll_('barang').map(function (b) {
    return Object.assign({}, b, { tersedia: b.jumlah - terikat_(b.id, pj) });
  });
}

/* ======================= UTIL SHEET ============================ */

function getSheet_(name) {
  if (!SCHEMA[name]) throw new Error('Sheet tidak dikenal: ' + name);
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error('Sheet "' + name + '" belum ada. Jalankan setup() di Apps Script.');
  return sh;
}

function readAll_(name) {
  const sh = getSheet_(name);
  const cols = SCHEMA[name];
  const last = sh.getLastRow();
  if (last < 2) return [];
  const tz = tz_();
  return sh.getRange(2, 1, last - 1, cols.length).getValues()
    .filter(function (r) { return r[0] !== ''; })
    .map(function (r) {
      const o = {};
      cols.forEach(function (c, i) {
        let v = r[i];
        if (v instanceof Date) v = Utilities.formatDate(v, tz, c === 'dibuat' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd');
        o[c] = KOLOM_ANGKA.indexOf(c) >= 0 ? Number(v) || 0 : String(v);
      });
      return o;
    });
}

function findRow_(sh, id) {
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

function toRow_(name, obj) {
  return SCHEMA[name].map(function (c) {
    const v = obj[c] === undefined || obj[c] === null ? '' : obj[c];
    // cegah teks diawali "=" dianggap rumus
    return typeof v === 'string' && v.charAt(0) === '=' ? "'" + v : v;
  });
}

function insert_(name, obj) {
  getSheet_(name).appendRow(toRow_(name, obj));
  return obj;
}

function update_(name, id, obj) {
  const sh = getSheet_(name);
  const row = findRow_(sh, id);
  if (row < 0) throw new Error('Data tidak ditemukan.');
  sh.getRange(row, 1, 1, SCHEMA[name].length).setValues([toRow_(name, obj)]);
  return obj;
}

function remove_(name, id) {
  const sh = getSheet_(name);
  const row = findRow_(sh, id);
  if (row < 0) throw new Error('Data tidak ditemukan.');
  sh.deleteRow(row);
}

function tz_() { return Session.getScriptTimeZone() || 'Asia/Jakarta'; }
function today_() { return Utilities.formatDate(new Date(), tz_(), 'yyyy-MM-dd'); }
function now_() { return Utilities.formatDate(new Date(), tz_(), 'yyyy-MM-dd HH:mm'); }
function newId_() { return Utilities.getUuid().replace(/-/g, '').slice(0, 12); }
function detikSesi_() { return Math.min(21600, SESSION_JAM * 3600); }
function str_(v) { return String(v == null ? '' : v).trim(); }

function int_(v, label) {
  const n = Number(v);
  if (!Number.isInteger(n) || n < 0) throw new Error(label + ' harus bilangan bulat ≥ 0.');
  return n;
}

function tgl_(v, label) {
  const s = str_(v);
  if (!s) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error(label + ' tidak valid (format YYYY-MM-DD).');
  return s;
}
