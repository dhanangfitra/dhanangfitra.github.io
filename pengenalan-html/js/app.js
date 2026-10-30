/* ==========================================================================
   Pengenalan Struktur Dasar HTML — app.js
   JavaScript murni, tanpa framework.

   Daftar isi:
    1. Konfigurasi & data materi
    2. State, penyimpanan (localStorage) & gamifikasi
    3. Utilitas (ikon, escape, highlight kode, toast, efek)
    4. Audio (Web Audio API + opsi file lokal)
    5. Maskot Cursor Pintar
    6. Navigasi & routing
    7. Dashboard (Home)
    8. Apersepsi
    9. Materi
   10. Lab HTML (Eksplorasi)
   11. Game A (susun kerangka) & Game B (kuis latihan)
   12. Evaluasi akhir
   13. Pengaturan, dialog & inisialisasi
   ========================================================================== */
(function () {
  'use strict';

  /* ==========================================================================
     1. KONFIGURASI & DATA
     ========================================================================== */

  const STORAGE_KEY = 'pengenalan-html.v1';

  /* Audio: setel useFiles ke true SETELAH file mp3 benar-benar ada di folder
     assets/audio/. Jika false (bawaan) atau file gagal dimuat, aplikasi memakai
     suara buatan Web Audio API sehingga tidak ada tautan audio yang rusak. */
  const AUDIO_CONFIG = {
    useFiles: false,
    files: {
      music: 'assets/audio/background-music.mp3',
      correct: 'assets/audio/correct.mp3',
      wrong: 'assets/audio/wrong.mp3',
      complete: 'assets/audio/complete.mp3'
    }
  };

  const ROUTES = [
    { id: 'home', label: 'Home', short: 'Home', icon: 'home' },
    { id: 'apersepsi', label: 'Apersepsi', short: 'Apersepsi', icon: 'lightbulb', modules: ['apersepsi'] },
    { id: 'materi', label: 'Materi', short: 'Materi', icon: 'book', modules: ['materi'] },
    { id: 'eksplorasi', label: 'Eksplorasi', short: 'Lab', icon: 'flask', modules: ['lab'] },
    { id: 'game', label: 'Game', short: 'Game', icon: 'gamepad', modules: ['gameA', 'gameB'] },
    { id: 'kuis', label: 'Kuis', short: 'Kuis', icon: 'trophy', modules: ['eval'] }
  ];
  const ROUTE_IDS = ROUTES.map(r => r.id);

  const MODULES = [
    { id: 'apersepsi', route: 'apersepsi', num: 'Misi 1', title: 'Apersepsi', desc: 'Bandingkan web rapi dan berantakan.', icon: 'lightbulb', tone: '#4F46E5', soft: '#EEF2FF', accent: 'linear-gradient(90deg,#4F46E5,#8B5CF6)' },
    { id: 'materi', route: 'materi', num: 'Misi 2', title: 'Kerangka HTML5', desc: 'Pelajari 9 bagian kerangka dokumen.', icon: 'book', tone: '#0E7490', soft: '#ECFEFF', accent: 'linear-gradient(90deg,#06B6D4,#4F46E5)' },
    { id: 'lab', route: 'eksplorasi', num: 'Misi 3', title: 'Lab HTML', desc: 'Ubah kode dan lihat hasilnya langsung.', icon: 'flask', tone: '#7C3AED', soft: '#F5F3FF', accent: 'linear-gradient(90deg,#8B5CF6,#06B6D4)' },
    { id: 'gameA', route: 'game', tab: 'a', num: 'Misi 4', title: 'Susun Kerangka', desc: 'Seret kartu tag ke posisi yang benar.', icon: 'puzzle', tone: '#B45309', soft: '#FFFBEB', accent: 'linear-gradient(90deg,#FBBF24,#F97316)' },
    { id: 'gameB', route: 'game', tab: 'b', num: 'Misi 5', title: 'Kuis Latihan', desc: '6 soal bertahap dengan pembahasan.', icon: 'list', tone: '#15803D', soft: '#F0FDF4', accent: 'linear-gradient(90deg,#22C55E,#06B6D4)' },
    { id: 'eval', route: 'kuis', num: 'Misi 6', title: 'Final Mission', desc: '10 soal evaluasi akhir, skor 0–100.', icon: 'trophy', tone: '#BE123C', soft: '#FFF1F2', accent: 'linear-gradient(90deg,#F43F5E,#8B5CF6)' }
  ];

  const STAR_MAX = { apersepsi: 1, materi: 1, lab: 1, gameA: 1, gameB: 1, eval: 3 };
  const STAR_TOTAL = Object.values(STAR_MAX).reduce((a, b) => a + b, 0);

  const BADGES = {
    explorer: { title: 'Penjelajah HTML', desc: 'Selesaikan Apersepsi, Materi, dan Lab HTML.', colors: ['#06B6D4', '#4F46E5'], icon: 'compass' },
    master: { title: 'Master Struktur HTML', desc: 'Selesaikan Game Susun Kerangka dan raih nilai evaluasi minimal 75.', colors: ['#FBBF24', '#F97316'], icon: 'crown' }
  };

  /* ---------- Materi ---------- */
  const MATERI_CODE = [
    '<!DOCTYPE html>',
    '<html lang="id">',
    '<head>',
    '    <meta charset="UTF-8">',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '    <title>Halaman Pertamaku</title>',
    '</head>',
    '<body>',
    '    <h1>Halo, Dunia Web!</h1>',
    '    <p>Aku sedang belajar HTML.</p>',
    '</body>',
    '</html>'
  ];
  const LINE_GROUP = ['wrap', 'wrap', 'head', 'head', 'head', 'head', 'head', 'body', 'body', 'body', 'body', 'wrap'];
  const GROUP_LABEL = { wrap: 'Pembungkus dokumen', head: 'Informasi dokumen', body: 'Konten halaman' };

  const SEGMENTS = [
    { tag: '<!DOCTYPE html>', lines: [0], group: 'wrap', core: true,
      text: 'Deklarasi yang memberi tahu browser bahwa dokumen ini menggunakan HTML5. Ditulis paling atas, sebelum tag lainnya. DOCTYPE bukan elemen, jadi tidak punya tag penutup.',
      analogy: 'Seperti tulisan "Bahasa Indonesia" di sampul buku: pembaca langsung tahu cara membacanya.' },
    { tag: '<html lang="id">', lines: [1], related: [11], group: 'wrap', core: true,
      text: 'Elemen akar (root) yang membungkus seluruh dokumen HTML. Semua elemen lain berada di dalamnya, dan ditutup dengan </html> di baris paling akhir. Atribut lang="id" menunjukkan bahwa isi halaman berbahasa Indonesia.',
      analogy: 'Seperti sampul buku yang membungkus semua halaman di dalamnya.' },
    { tag: '<head>', lines: [2], related: [6], group: 'head', core: true,
      text: 'Berisi metadata, yaitu informasi tentang dokumen, yang umumnya tidak ditampilkan sebagai konten halaman. Contohnya pengaturan karakter, viewport, dan judul dokumen. Ditutup dengan </head>.',
      analogy: 'Seperti kartu identitas buku: berisi judul dan keterangan, bukan isi cerita.' },
    { tag: '<meta charset="UTF-8">', lines: [3], group: 'head', core: false,
      text: 'Pelengkap praktik HTML5. Mengatur encoding karakter menjadi UTF-8 agar huruf, angka, dan simbol (misalnya é, ©, atau aksara lain) dapat ditampilkan dengan benar.',
      analogy: 'Seperti memilih "kamus huruf" yang dipakai browser untuk membaca teksmu.' },
    { tag: '<meta name="viewport">', lines: [4], group: 'head', core: false,
      text: 'Pelengkap praktik HTML5. Membantu halaman menyesuaikan lebar tampilan perangkat sehingga terlihat pas di smartphone, tablet, maupun laptop.',
      analogy: 'Seperti menyesuaikan ukuran foto agar pas dengan layar yang dipakai.' },
    { tag: '<title>…</title>', lines: [5], group: 'head', core: true,
      text: 'Menentukan judul dokumen. Teks di antara <title> dan </title> biasanya terlihat pada tab browser dan saat halaman disimpan sebagai bookmark. Letaknya di dalam <head>.',
      analogy: 'Seperti label nama di punggung buku: terlihat walau bukunya belum dibuka.' },
    { tag: '<body>', lines: [7], related: [10], group: 'body', core: true,
      text: 'Memuat konten utama yang ditampilkan pada halaman web: judul, paragraf, gambar, tautan, dan lainnya. Semua yang dilihat pengunjung ditulis di antara <body> dan </body>.',
      analogy: 'Seperti isi buku: semua cerita dan gambar yang dibaca pembaca.' },
    { tag: '<h1> dan <p>', lines: [8, 9], group: 'body', core: false,
      text: 'Contoh konten di dalam body. <h1> adalah judul utama (heading tingkat 1) dan <p> adalah paragraf. Elemen-elemen seperti ini yang membuat struktur informasi menjadi jelas.',
      analogy: 'Seperti judul bab dan paragraf di dalam buku pelajaran.' },
    { tag: '</body> dan </html>', lines: [10, 11], group: 'wrap', core: false,
      text: 'Tag penutup, ditandai garis miring (/). </body> menutup bagian konten, lalu </html> menutup seluruh dokumen. Urutan penutupan kebalikan dari urutan pembukaan.',
      analogy: 'Seperti menutup kotak kecil dulu, baru menutup kotak besar yang membungkusnya.' }
  ];
  const LINE_TO_SEGMENT = [0, 1, 2, 3, 4, 5, 2, 6, 7, 7, 8, 8];
  const CORE_CHIPS = [
    { label: '<!DOCTYPE html>', seg: 0 },
    { label: '<html>', seg: 1 },
    { label: '<head>', seg: 2 },
    { label: '<title>', seg: 5 },
    { label: '<body>', seg: 6 }
  ];

  const QUICK_ITEMS = [
    { id: 'q1', code: '<title>Toko Buku Ceria</title>', answer: 'head', why: '<title> adalah informasi dokumen, jadi masuk head.' },
    { id: 'q2', code: '<h1>Selamat Datang!</h1>', answer: 'body', why: 'Heading tampil di halaman, jadi masuk body.' },
    { id: 'q3', code: '<meta charset="UTF-8">', answer: 'head', why: 'meta adalah metadata, jadi masuk head.' },
    { id: 'q4', code: '<p>Kami menjual buku pelajaran.</p>', answer: 'body', why: 'Paragraf tampil di halaman, jadi masuk body.' }
  ];

  /* ---------- Lab ---------- */
  const LAB_STARTER = MATERI_CODE.join('\n');
  const LAB_SOLUTION = [
    '<!DOCTYPE html>',
    '<html lang="id">',
    '<head>',
    '    <meta charset="UTF-8">',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '    <title>Profil Saya</title>',
    '</head>',
    '<body>',
    '    <h1>Halo, Aku Web Developer!</h1>',
    '    <p>Aku sedang belajar HTML.</p>',
    '    <p>Namaku Raka, siswa kelas XI RPL yang suka membuat web.</p>',
    '</body>',
    '</html>'
  ].join('\n');

  const MISSIONS = [
    { title: 'Temukan judul tab browser', short: 'Judul tab',
      text: 'Klik atau ketuk baris kode yang menentukan judul pada tab browser, lalu tekan "Periksa Jawaban".',
      hint: 'Cari tag yang namanya mirip kata "judul" dalam bahasa Inggris. Letaknya di dalam <head>.' },
    { title: 'Temukan bagian konten halaman', short: 'Konten halaman',
      text: 'Letakkan kursor di salah satu baris yang memuat konten halaman (yang tampil di layar), lalu tekan "Periksa Jawaban".',
      hint: 'Konten yang tampil berada di antara <body> dan </body>. Coba klik baris <h1> atau <p>.' },
    { title: 'Ubah judul dokumen', short: 'Profil Saya',
      text: 'Ganti teks di dalam <title> menjadi "Profil Saya". Tekan "Jalankan" dan lihat tab browser berubah.',
      hint: 'Hapus "Halaman Pertamaku" di antara <title> dan </title>, lalu ketik Profil Saya. Jangan hapus tag-nya.' },
    { title: 'Ubah teks heading', short: 'Heading baru',
      text: 'Ubah teks di dalam <h1> menjadi "Halo, Aku Web Developer!".',
      hint: 'Teks heading ada di antara <h1> dan </h1> di dalam body. Ganti "Halo, Dunia Web!".' },
    { title: 'Tambahkan paragraf perkenalan', short: 'Paragraf baru',
      text: 'Tambahkan satu paragraf baru <p>…</p> berisi perkenalan dirimu, di dalam <body> setelah paragraf yang sudah ada.',
      hint: 'Buat baris baru sebelum </body>, lalu ketik misalnya: <p>Namaku Sari, aku suka desain web.</p>' }
  ];

  /* ---------- Game A ---------- */
  const CARDS = [
    { id: 'doctype', text: '<!DOCTYPE html>' },
    { id: 'html-open', text: '<html>' },
    { id: 'head-open', text: '<head>' },
    { id: 'title-open', text: '<title>' },
    { id: 'title-close', text: '</title>' },
    { id: 'head-close', text: '</head>' },
    { id: 'body-open', text: '<body>' },
    { id: 'body-close', text: '</body>' },
    { id: 'html-close', text: '</html>' }
  ];
  /* slot ke-i jawabannya CARDS[i] */
  const BOARD = [
    [{ slot: 0 }],
    [{ slot: 1 }],
    [{ indent: 1 }, { slot: 2 }],
    [{ indent: 2 }, { slot: 3 }, { text: 'Profil Saya' }, { slot: 4 }],
    [{ indent: 1 }, { slot: 5 }],
    [{ indent: 1 }, { slot: 6 }],
    [{ indent: 2 }, { code: '<h1>Halo, Dunia!</h1>' }],
    [{ indent: 1 }, { slot: 7 }],
    [{ slot: 8 }]
  ];
  const GAME_A_HINTS = [
    'Baris pertama selalu deklarasi <!DOCTYPE html>.',
    'Setelah DOCTYPE, buka elemen akar <html>. Penutupnya </html> ada di baris paling akhir.',
    '<head> dibuka sebelum <body>. Judul tab ditulis di antara <title> dan </title>.',
    'Tag penutup memakai garis miring. </head> harus menutup head sebelum <body> dibuka.'
  ];

  /* ---------- Game B: kuis latihan (bertahap) ---------- */
  const PRACTICE = [
    { id: 'p1', level: 1, prompt: 'Kepanjangan HTML adalah …',
      options: ['HyperText Markup Language', 'Hyperlink Mobile Language', 'Hyper This Mobile Lose', 'HyperTell Markup Language'], answer: 0,
      explain: 'HTML = HyperText Markup Language, bahasa markup untuk menyusun struktur halaman web.' },
    { id: 'p2', level: 1, prompt: 'Elemen yang menjadi akar atau pembungkus seluruh dokumen HTML adalah …',
      options: ['<body>', '<head>', '<html>', '<doc>'], answer: 2,
      explain: '<html> adalah elemen akar (root). Semua elemen lain, termasuk <head> dan <body>, berada di dalamnya.' },
    { id: 'p3', level: 2, prompt: 'Teks "Toko Buku Ceria" ingin ditampilkan pada tab browser. Teks itu harus ditulis di dalam elemen …',
      options: ['<h1>', '<title>', '<body>', '<p>'], answer: 1,
      explain: 'Teks di dalam <title> menjadi judul dokumen yang biasanya muncul pada tab browser.' },
    { id: 'p4', level: 2, prompt: 'Elemen <title> seharusnya ditempatkan di dalam elemen …',
      options: ['<body>', '<p>', '<head>', '<h1>'], answer: 2,
      explain: '<title> termasuk informasi dokumen (metadata), sehingga diletakkan di dalam <head>.' },
    { id: 'p5', level: 3, prompt: 'Penulisan tag penutup yang benar untuk elemen head adalah …',
      options: ['<head/>', '<\\head>', '<end head>', '</head>'], answer: 3,
      explain: 'Tag penutup ditulis dengan garis miring (/) setelah tanda <, yaitu </head>.' },
    { id: 'p6', level: 3, prompt: 'Raka ingin paragraf "Selamat datang di web kelas kami" terlihat oleh pengunjung. Di mana paragraf itu ditulis?',
      options: ['Di dalam <head>, setelah <title>', 'Di dalam <body>', 'Sebelum <!DOCTYPE html>', 'Di antara </head> dan <body>'], answer: 1,
      explain: 'Semua konten yang tampil di halaman ditulis di dalam <body>.' }
  ];
  const LEVEL_LABEL = { 1: 'Mudah', 2: 'Sedang', 3: 'Menantang' };

  /* ---------- Evaluasi akhir (10 soal) ---------- */
  const EVAL = [
    { id: 'e1', topic: 'Pengertian HTML', seg: null,
      prompt: 'Fungsi utama HTML dalam pembuatan web statis adalah …',
      options: ['Mengatur warna dan animasi halaman', 'Menyusun struktur dan konten halaman web', 'Menyimpan data pengguna di server', 'Menjalankan logika program di server'], answer: 1,
      explain: 'HTML menyusun struktur dan konten halaman. Warna dan animasi diatur dengan CSS, sedangkan logika program memakai bahasa pemrograman lain.' },
    { id: 'e2', topic: 'Kepanjangan HTML', seg: null,
      prompt: 'HTML merupakan singkatan dari …',
      options: ['Hyper Transfer Markup Language', 'HighText Machine Language', 'HyperText Markup Language', 'HyperText Making Language'], answer: 2,
      explain: 'HTML = HyperText Markup Language.' },
    { id: 'e3', topic: 'Fungsi <!DOCTYPE html>', seg: 0,
      prompt: 'Fungsi <!DOCTYPE html> pada baris pertama dokumen adalah …',
      options: ['Menampilkan judul pada tab browser', 'Memberi tahu browser bahwa dokumen menggunakan HTML5', 'Membuat paragraf pertama halaman', 'Menutup seluruh dokumen HTML'], answer: 1,
      explain: '<!DOCTYPE html> adalah deklarasi yang memberi tahu browser bahwa dokumen menggunakan HTML5.' },
    { id: 'e4', topic: 'Fungsi elemen <html>', seg: 1,
      prompt: 'Pernyataan yang tepat tentang elemen <html> adalah …',
      options: ['Elemen akar yang membungkus seluruh isi dokumen HTML', 'Tempat menulis judul tab browser', 'Elemen untuk membuat teks bercetak tebal', 'Elemen yang hanya berisi konten gambar'], answer: 0,
      explain: '<html> adalah elemen akar (root). <head> dan <body> berada di dalamnya.' },
    { id: 'e5', topic: 'Fungsi elemen <head>', seg: 2,
      prompt: 'Elemen <head> berisi …',
      options: ['Konten utama yang dilihat pengunjung', 'Daftar menu navigasi halaman', 'Metadata atau informasi dokumen yang umumnya tidak tampil sebagai konten', 'Gambar dan video utama halaman'], answer: 2,
      explain: '<head> menyimpan metadata seperti charset, viewport, dan title.' },
    { id: 'e6', topic: 'Fungsi elemen <title>', seg: 5,
      prompt: 'Teks yang ditulis di dalam elemen <title> akan …',
      options: ['Menjadi heading terbesar di tengah halaman', 'Menjadi judul dokumen yang biasanya terlihat pada tab browser', 'Tampil sebagai paragraf pertama', 'Mengubah warna latar belakang halaman'], answer: 1,
      explain: '<title> menentukan judul dokumen yang biasanya terlihat pada tab browser.' },
    { id: 'e7', topic: 'Fungsi elemen <body>', seg: 6,
      prompt: 'Siswa menulis <h1>Profil Kelas XI</h1> agar tampil di halaman. Kode tersebut harus berada di dalam elemen …',
      options: ['<head>', '<title>', '<meta>', '<body>'], answer: 3,
      explain: 'Konten yang ditampilkan pada halaman, termasuk heading, ditulis di dalam <body>.' },
    { id: 'e8', topic: 'Perbedaan <head> dan <body>', seg: 2,
      prompt: 'Perbedaan <head> dan <body> yang paling tepat adalah …',
      options: ['<head> berisi informasi tentang dokumen, <body> berisi konten yang tampil di halaman', '<head> berisi konten utama, <body> berisi metadata', 'Keduanya sama-sama hanya berisi judul tab', '<body> harus ditulis sebelum <head>'], answer: 0,
      explain: 'head = informasi dokumen (metadata), body = konten yang dilihat pengunjung. head ditulis sebelum body.' },
    { id: 'e9', topic: 'Urutan kerangka dasar', seg: 1,
      prompt: 'Urutan pembukaan bagian kerangka dasar HTML5 yang benar adalah …',
      options: ['<html> → <!DOCTYPE html> → <head> → <body>', '<!DOCTYPE html> → <head> → <html> → <body>', '<!DOCTYPE html> → <html> → <head> → <body>', '<!DOCTYPE html> → <html> → <body> → <head>'], answer: 2,
      explain: 'Urutannya: DOCTYPE, lalu elemen akar <html>, kemudian <head>, dan terakhir <body>.' },
    { id: 'e10', topic: 'Identifikasi kesalahan', seg: 5,
      prompt: 'Perhatikan kode berikut. Kesalahan pada kerangka tersebut adalah …',
      code: ['<!DOCTYPE html>', '<html>', '<body>', '    <title>Profil</title>', '</body>', '<head>', '</head>', '</html>'],
      options: ['<!DOCTYPE html> seharusnya ditulis di baris terakhir', 'Tag <html> tidak perlu ditutup', '<title> berada di dalam <body> dan <head> ditulis setelah <body>', 'Tidak ada kesalahan pada kode tersebut'], answer: 2,
      explain: '<title> harus berada di dalam <head>, dan <head> ditulis sebelum <body>.' }
  ];

  /* ==========================================================================
     2. STATE, PENYIMPANAN & GAMIFIKASI
     ========================================================================== */

  function defaultState() {
    return {
      version: 1,
      started: false,
      xp: 0,
      awards: {},
      stars: {},
      done: { apersepsi: false, materi: false, lab: false, gameA: false, gameB: false, eval: false },
      badges: { explorer: false, master: false },
      apersepsi: { correct: false },
      materi: { visited: [], quick: {} },
      lab: { missions: [false, false, false, false, false], current: 0, code: null },
      gameA: { placed: Array(9).fill(null), order: null, attempts: 0, hint: 0 },
      gameB: { index: 0, answers: {}, finished: false },
      eval: { answers: {}, current: 0, started: false, submitted: false, score: null, best: 0 },
      lastRoute: 'home',
      settings: { muted: false, music: false, sfx: true, musicVol: 45, sfxVol: 70, motion: 'system' }
    };
  }

  let storageOK = true;
  function storageAvailable() {
    try {
      const k = '__tes__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  }

  /* Gabungkan data tersimpan dengan struktur bawaan (aman bila versi berubah). */
  function mergeDeep(base, saved) {
    if (Array.isArray(base)) return Array.isArray(saved) ? saved : base;
    if (base && typeof base === 'object') {
      const out = {};
      Object.keys(base).forEach(k => { out[k] = (saved && k in saved) ? mergeDeep(base[k], saved[k]) : base[k]; });
      if (saved && typeof saved === 'object') {
        Object.keys(saved).forEach(k => { if (!(k in out)) out[k] = saved[k]; });
      }
      return out;
    }
    return (saved === undefined || saved === null) && base !== null ? base : saved;
  }

  function loadState() {
    storageOK = storageAvailable();
    if (!storageOK) return defaultState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return mergeDeep(defaultState(), JSON.parse(raw));
    } catch (e) { return defaultState(); }
  }

  let state = loadState();

  function save() {
    if (!storageOK) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { storageOK = false; }
  }

  /* XP hanya diberikan SEKALI per kunci → klik berulang tidak menambah poin. */
  function award(key, amount, message) {
    if (state.awards[key]) return false;
    state.awards[key] = amount;
    state.xp += amount;
    save();
    updateHUD(true);
    toast(`+${amount} XP · ${message}`, 'zap');
    return true;
  }

  function setStars(key, n) {
    const capped = Math.min(n, STAR_MAX[key] || 0);
    if ((state.stars[key] || 0) >= capped) return false;
    state.stars[key] = capped;
    save();
    updateHUD(true);
    return true;
  }
  const totalStars = () => Object.values(state.stars).reduce((a, b) => a + b, 0);

  function completeModule(id) {
    if (state.done[id]) return false;
    state.done[id] = true;
    save();
    sfx('complete');
    renderNav();
    updateHUD();
    checkBadges();
    return true;
  }

  function progressPercent() {
    const done = MODULES.filter(m => state.done[m.id]).length;
    return Math.round(done / MODULES.length * 100);
  }

  function checkBadges() {
    const unlocked = [];
    if (!state.badges.explorer && state.done.apersepsi && state.done.materi && state.done.lab) {
      state.badges.explorer = true; unlocked.push('explorer');
    }
    if (!state.badges.master && state.done.gameA && state.eval.best >= 75) {
      state.badges.master = true; unlocked.push('master');
    }
    if (unlocked.length) {
      save();
      unlocked.forEach((b, i) => setTimeout(() => showReward(b), 900 + i * 400));
    }
  }

  /* ==========================================================================
     3. UTILITAS
     ========================================================================== */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Ikon garis gaya Lucide (inline SVG, tanpa library eksternal). */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v6L4.5 19A2 2 0 0 0 6.3 22h11.4a2 2 0 0 0 1.8-3L14 9V3"/><path d="M7.5 15h9"/>',
    gamepad: '<rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4"/><circle cx="15.5" cy="11" r="1"/><circle cx="18" cy="13" r="1"/>',
    trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3"/><path d="M7 5H4v2a3 3 0 0 0 3 3"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    'volume-x': '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
    'x-circle': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    circle: '<circle cx="12" cy="12" r="9"/>',
    play: '<path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'arrow-right': '<path d="M5 12h14M13 5l7 7-7 7"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0"/><path d="M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'file-code': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m10 13-2 2 2 2M14 17l2-2-2-2"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    puzzle: '<path d="M19.4 14.6a2 2 0 1 0-2.8-2.8L15 10V6a1 1 0 0 0-1-1h-4l-1.6-1.6a2 2 0 1 0-2.8 2.8L7 7.6V10H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1.6l1.6-1.6a2 2 0 1 1 2.8 2.8L7.4 18H11a1 1 0 0 0 1-1v-1.6l1.6-1.6a2 2 0 1 1 2.8 2.8L15 18h4a1 1 0 0 0 1-1v-1.6z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
    grip: '<circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    flag: '<path d="M4 22V4a1 1 0 0 1 .4-.8C5.2 2.6 6.4 2 8 2c3 0 5 2 8 2 1.3 0 2.4-.3 3.4-.8a.4.4 0 0 1 .6.4V15a1 1 0 0 1-.4.8C18.8 16.4 17.6 17 16 17c-3 0-5-2-8-2-1.6 0-2.8.6-3.6 1.2"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
    crown: '<path d="m2 18 2-11 5 5 3-7 3 7 5-5 2 11z"/><path d="M4 21h16"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>'
  };

  function icon(name, cls = '') {
    return `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.circle}</svg>`;
  }

  /* Ganti setiap <i data-icon="..."> menjadi SVG. */
  function hydrateIcons(root = document) {
    $$('i[data-icon]', root).forEach(el => {
      const tpl = document.createElement('template');
      tpl.innerHTML = icon(el.dataset.icon, el.className);
      const svg = tpl.content.firstElementChild;
      if (el.id) svg.id = el.id;
      if (el.hidden) svg.setAttribute('hidden', '');
      el.replaceWith(svg);
    });
  }

  /* Pewarnaan sintaks HTML sederhana. Setiap karakter sumber tetap
     dipertahankan agar lapisan highlight sejajar dengan textarea. */
  function highlightHTML(src) {
    const re = /<!--[\s\S]*?(?:-->|$)|<!doctype[^>]*>?|<\/?[a-zA-Z][^<>]*>?|[^<]+|</gi;
    let out = '';
    let m;
    while ((m = re.exec(src)) !== null) {
      const t = m[0];
      if (t.startsWith('<!--')) out += `<span class="t-com">${esc(t)}</span>`;
      else if (/^<!doctype/i.test(t)) out += `<span class="t-doc">${esc(t)}</span>`;
      else if (/^<\/?[a-zA-Z]/.test(t)) out += highlightTag(t);
      else out += `<span class="t-txt">${esc(t)}</span>`;
    }
    return out;
  }
  function highlightTag(t) {
    const m = t.match(/^(<\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?>)?$/);
    if (!m) return esc(t);
    const [, open, name, rest, close] = m;
    let attrs = '';
    const are = /(\s+)|([^\s=/>]+)(\s*=\s*)("[^"]*"?|'[^']*'?|[^\s"'>]+)?|([\s\S])/g;
    let a;
    while ((a = are.exec(rest)) !== null) {
      if (a[1]) attrs += a[1];
      else if (a[2]) {
        attrs += `<span class="t-attr">${esc(a[2])}</span>`;
        if (a[3]) attrs += `<span class="t-punc">${esc(a[3])}</span>`;
        if (a[4]) attrs += `<span class="t-str">${esc(a[4])}</span>`;
      } else if (a[5]) attrs += `<span class="t-punc">${esc(a[5])}</span>`;
    }
    return `<span class="t-punc">${esc(open)}</span><span class="t-tag">${esc(name)}</span>${attrs}${close ? `<span class="t-punc">${esc(close)}</span>` : ''}`;
  }

  function codeBlock(lines, opts = {}) {
    return lines.map((line, i) => {
      const group = opts.groups ? ` data-group="${opts.groups[i]}"` : '';
      return `<div class="code-line"${group}><span class="src">${highlightHTML(line) || ' '}</span></div>`;
    }).join('');
  }

  /* Toast notifikasi singkat */
  function toast(text, iconName = 'zap') {
    const region = $('#toast-region');
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `${icon(iconName)}<span></span>`;
    el.querySelector('span').textContent = text;
    region.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, 2600);
  }

  const motionReduced = () => document.documentElement.classList.contains('reduce-motion');

  function confetti(count = 90) {
    if (motionReduced()) return;
    const layer = $('#fx-layer');
    const colors = ['#4F46E5', '#06B6D4', '#8B5CF6', '#FBBF24', '#22C55E', '#F43F5E'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'confetti';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--d', (2.2 + Math.random() * 1.8) + 's');
      p.style.setProperty('--x', (Math.random() * 200 - 100) + 'px');
      p.style.setProperty('--r', (Math.random() * 900 + 180) + 'deg');
      p.style.animationDelay = (Math.random() * .5) + 's';
      if (i % 3 === 0) { p.style.width = '8px'; p.style.height = '8px'; p.style.borderRadius = '50%'; }
      layer.appendChild(p);
      setTimeout(() => p.remove(), 4800);
    }
  }

  function starBurst(target) {
    if (motionReduced() || !target) return;
    const r = target.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const layer = $('#fx-layer');
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      s.className = 'star-fx';
      s.innerHTML = `<svg viewBox="0 0 24 24">${ICONS.star}</svg>`;
      const ang = (Math.PI * 2 / 10) * i;
      const dist = 70 + Math.random() * 50;
      s.style.left = (cx - 13) + 'px';
      s.style.top = (cy - 13) + 'px';
      s.style.setProperty('--x', Math.cos(ang) * dist + 'px');
      s.style.setProperty('--y', Math.sin(ang) * dist + 'px');
      layer.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  }

  function setFeedback(el, type, title, detail) {
    const map = { ok: 'check-circle', bad: 'x-circle', info: 'info', warn: 'lightbulb' };
    el.className = `feedback ${type}`;
    el.innerHTML = `${icon(map[type])}<div><p></p>${detail ? '<p></p>' : ''}</div>`;
    const ps = el.querySelectorAll('p');
    ps[0].textContent = title;
    if (detail) ps[1].textContent = detail;
    el.hidden = false;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* lanjut ke cara cadangan */ }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  /* ==========================================================================
     4. AUDIO
     ========================================================================== */

  const AudioEngine = {
    ctx: null,
    master: null,
    musicBus: null,
    sfxBus: null,
    timer: null,
    nextTime: 0,
    step: 0,
    fileMusic: null,
    fileFailed: false,

    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.connect(this.ctx.destination);
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 2400;
        lp.connect(this.master);
        this.musicBus = this.ctx.createGain();
        this.musicBus.connect(lp);
        this.sfxBus = this.ctx.createGain();
        this.sfxBus.connect(this.master);
        this.applyVolumes();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return true;
    },

    applyVolumes() {
      const s = state.settings;
      if (this.ctx) {
        const t = this.ctx.currentTime;
        this.master.gain.setTargetAtTime(s.muted ? 0 : 1, t, .05);
        this.musicBus.gain.setTargetAtTime((s.musicVol / 100) * .55, t, .1);
        this.sfxBus.gain.setTargetAtTime((s.sfxVol / 100) * .8, t, .05);
      }
      if (this.fileMusic) this.fileMusic.volume = s.muted ? 0 : (s.musicVol / 100) * .6;
    },

    tone(freq, start, dur, type = 'sine', vol = .2, bus = this.sfxBus) {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(vol, start + .02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(g);
      g.connect(bus);
      osc.start(start);
      osc.stop(start + dur + .05);
    },

    playFile(name) {
      if (!AUDIO_CONFIG.useFiles || this.fileFailed) return false;
      try {
        const a = new Audio(AUDIO_CONFIG.files[name]);
        a.volume = (state.settings.sfxVol / 100);
        a.addEventListener('error', () => { this.fileFailed = true; });
        const p = a.play();
        if (p && p.catch) p.catch(() => { this.fileFailed = true; this.synth(name); });
        return true;
      } catch (e) { this.fileFailed = true; return false; }
    },

    sfx(name) {
      const s = state.settings;
      if (s.muted || !s.sfx) return;
      if (this.playFile(name)) return;
      if (!this.ensure()) return;
      this.synth(name);
    },

    synth(name) {
      if (!this.ensure()) return;
      const t = this.ctx.currentTime + .01;
      const N = { C5: 523.25, E5: 659.25, G5: 783.99, C6: 1046.5, A4: 440, F4: 349.23, D4: 293.66, E4: 329.63, G4: 392 };
      switch (name) {
        case 'correct':
          this.tone(N.E5, t, .16, 'triangle', .22);
          this.tone(N.G5, t + .09, .18, 'triangle', .22);
          this.tone(N.C6, t + .18, .32, 'sine', .18);
          break;
        case 'wrong':
          this.tone(N.E4, t, .18, 'sine', .2);
          this.tone(N.D4 * .98, t + .14, .32, 'sine', .18);
          break;
        case 'complete':
          [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => this.tone(f, t + i * .1, .35, 'triangle', .2));
          this.tone(N.G5, t + .45, .5, 'sine', .14);
          this.tone(N.C6 * 1.5, t + .5, .6, 'sine', .08);
          break;
        case 'click':
          this.tone(880, t, .05, 'sine', .07);
          break;
        case 'place':
          this.tone(620, t, .08, 'triangle', .12);
          break;
        default:
          break;
      }
    },

    /* Musik latar instrumental: progresi C – Am – F – G, arpeggio lembut. */
    startMusic() {
      if (AUDIO_CONFIG.useFiles && !this.fileFailed) {
        try {
          if (!this.fileMusic) {
            this.fileMusic = new Audio(AUDIO_CONFIG.files.music);
            this.fileMusic.loop = true;
            this.fileMusic.addEventListener('error', () => { this.fileFailed = true; this.fileMusic = null; this.startMusic(); });
          }
          this.applyVolumes();
          const p = this.fileMusic.play();
          if (p && p.catch) p.catch(() => {});
          return;
        } catch (e) { this.fileFailed = true; }
      }
      if (!this.ensure() || this.timer) return;
      this.nextTime = this.ctx.currentTime + .1;
      this.step = 0;
      this.timer = setInterval(() => this.schedule(), 90);
    },

    schedule() {
      const eighth = 60 / 96 / 2;
      const chords = [
        [261.63, 329.63, 392.0, 523.25],
        [220.0, 261.63, 329.63, 440.0],
        [174.61, 220.0, 261.63, 349.23],
        [196.0, 246.94, 293.66, 392.0]
      ];
      const pattern = [0, 1, 2, 3, 2, 1, 2, 1];
      while (this.nextTime < this.ctx.currentTime + .25) {
        const bar = Math.floor(this.step / 8) % 4;
        const idx = this.step % 8;
        const chord = chords[bar];
        this.tone(chord[pattern[idx]] , this.nextTime, eighth * 1.6, 'triangle', .07, this.musicBus);
        if (idx === 0 || idx === 4) this.tone(chord[0] / 2, this.nextTime, eighth * 3.6, 'sine', .11, this.musicBus);
        if (idx === 0 && Math.floor(this.step / 32) % 2 === 1) this.tone(chord[3] * 2, this.nextTime + eighth, eighth * 3, 'sine', .03, this.musicBus);
        this.nextTime += eighth;
        this.step++;
      }
    },

    stopMusic() {
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
      if (this.fileMusic) this.fileMusic.pause();
    },

    syncMusic() {
      const s = state.settings;
      if (s.music && !s.muted) this.startMusic(); else this.stopMusic();
      this.applyVolumes();
    }
  };

  const sfx = name => AudioEngine.sfx(name);

  /* ==========================================================================
     5. MASKOT CURSOR PINTAR
     ========================================================================== */

  let mascotId = 0;
  function mascotSVG() {
    const id = 'mg' + (++mascotId);
    return `<svg viewBox="0 0 170 210" role="img" aria-label="Cursor Pintar, maskot pemandu">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366F1"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs>
      <ellipse class="m-shadow" cx="78" cy="200" rx="46" ry="6" fill="#172033" opacity=".12"/>
      <g class="m-float">
        <g class="m-extra m-extra-celebrate">
          <path d="M14 30l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L5 37l6-1z" fill="#FBBF24"/>
          <path d="M150 40l2.4 4.8 5 .7-3.6 3.5.9 5-4.7-2.4-4.7 2.4.9-5-3.6-3.5 5-.7z" fill="#06B6D4"/>
          <path d="M140 160l2 4 4.4.6-3.2 3 .8 4.4-4-2-4 2 .8-4.4-3.2-3 4.4-.6z" fill="#F43F5E"/>
          <path d="M10 150l2 4 4.4.6-3.2 3 .8 4.4-4-2-4 2 .8-4.4-3.2-3 4.4-.6z" fill="#22C55E"/>
        </g>
        <g class="m-extra m-extra-happy"><path d="M138 34l2.4 4.8 5 .7-3.6 3.5.9 5-4.7-2.4-4.7 2.4.9-5-3.6-3.5 5-.7z" fill="#FBBF24"/></g>
        <g class="m-extra m-extra-think">
          <circle cx="112" cy="40" r="5" fill="#A5B4FC"/><circle cx="128" cy="26" r="7" fill="#A5B4FC"/><circle cx="148" cy="12" r="9" fill="#A5B4FC"/>
        </g>
        <g class="m-extra m-extra-encourage"><path d="M140 52c3-6 12-4 10 3-1 4-10 9-10 9s-9-5-10-9c-2-7 7-9 10-3z" fill="#F43F5E"/></g>
        <g class="m-arm-l">
          <path d="M30 118 Q12 112 8 92" fill="none" stroke="#4F46E5" stroke-width="8" stroke-linecap="round"/>
          <circle cx="8" cy="90" r="8" fill="#FBBF24"/>
        </g>
        <g class="m-arm-r">
          <path d="M112 132 Q132 128 146 110" fill="none" stroke="#4F46E5" stroke-width="8" stroke-linecap="round"/>
          <circle cx="148" cy="107" r="8" fill="#FBBF24"/>
        </g>
        <path d="M30 14 L30 160 L64 128 L88 180 L114 168 L90 117 L136 117 Z" fill="url(#${id})" stroke="url(#${id})" stroke-width="12" stroke-linejoin="round"/>
        <path d="M38 30 L38 70 Q46 46 66 40 Z" fill="#fff" opacity=".22"/>
        <path class="m-brow m-brow-think" d="M40 62 Q50 55 60 61 M68 62 Q78 54 88 60" fill="none" stroke="#172033" stroke-width="3.5" stroke-linecap="round"/>
        <path class="m-brow m-brow-soft" d="M40 64 Q50 60 58 64 M70 68 Q78 64 86 68" fill="none" stroke="#172033" stroke-width="3.5" stroke-linecap="round"/>
        <g class="m-eyes">
          <ellipse cx="50" cy="80" rx="11" ry="13" fill="#fff"/>
          <ellipse cx="76" cy="84" rx="11" ry="13" fill="#fff"/>
          <g class="m-pupils">
            <circle cx="52" cy="82" r="5.5" fill="#172033"/>
            <circle cx="78" cy="86" r="5.5" fill="#172033"/>
            <circle cx="54" cy="80" r="1.8" fill="#fff"/>
            <circle cx="80" cy="84" r="1.8" fill="#fff"/>
          </g>
        </g>
        <ellipse cx="40" cy="100" rx="6" ry="3.5" fill="#F472B6" opacity=".6"/>
        <ellipse cx="88" cy="106" rx="6" ry="3.5" fill="#F472B6" opacity=".6"/>
        <path class="m-mouth m-mouth-happy" d="M54 102 Q64 114 76 104" fill="none" stroke="#172033" stroke-width="4" stroke-linecap="round"/>
        <path class="m-mouth m-mouth-think" d="M58 106 Q66 103 74 107" fill="none" stroke="#172033" stroke-width="4" stroke-linecap="round"/>
        <path class="m-mouth m-mouth-encourage" d="M56 104 Q65 110 74 106" fill="none" stroke="#172033" stroke-width="4" stroke-linecap="round"/>
        <path class="m-mouth m-mouth-celebrate" d="M52 100 Q64 98 78 103 Q72 120 60 116 Q52 112 52 100 Z" fill="#172033"/>
      </g>
    </svg>`;
  }

  function mountMascots(root = document) {
    $$('[data-mascot]', root).forEach(el => {
      if (!el.firstElementChild) {
        el.classList.add('mascot');
        el.innerHTML = mascotSVG();
      }
    });
  }

  function setMood(el, mood) {
    if (!el) return;
    el.dataset.mood = mood;
    el.classList.remove('react');
    void el.offsetWidth; // restart animasi
    el.classList.add('react');
  }

  /* Pemandu: ubah teks balon & ekspresi maskot pada bagian tertentu. */
  function say(guideKey, text, mood) {
    const g = $(`.guide[data-guide="${guideKey}"]`);
    if (!g) return;
    const bubble = $('.bubble', g);
    bubble.textContent = text;
    bubble.classList.remove('pop');
    void bubble.offsetWidth;
    bubble.classList.add('pop');
    if (mood) setMood($('.mascot', g), mood);
  }

  /* ==========================================================================
     6. NAVIGASI & ROUTING
     ========================================================================== */

  let currentRoute = null;

  function routeStatus(route) {
    if (!route.modules) return 'none';
    const n = route.modules.filter(m => state.done[m]).length;
    if (n === route.modules.length) return 'done';
    return n > 0 ? 'part' : 'todo';
  }

  function renderNav() {
    const side = $('#side-nav');
    const bottom = $('#bottom-nav');
    side.innerHTML = ROUTES.map(r => {
      const st = routeStatus(r);
      const statusHTML = st === 'none' ? '' :
        `<span class="nav-status ${st}" aria-hidden="true">${st === 'done' ? icon('check') : ''}</span>`;
      const srText = st === 'done' ? ' (selesai)' : st === 'part' ? ' (sebagian)' : st === 'todo' ? ' (belum dikerjakan)' : '';
      return `<li><button type="button" class="nav-item" data-route="${r.id}">${icon(r.icon)}<span>${r.label}<span class="sr-only">${srText}</span></span>${statusHTML}</button></li>`;
    }).join('');
    bottom.innerHTML = ROUTES.map(r => {
      const st = routeStatus(r);
      return `<li><button type="button" class="bn-item" data-route="${r.id}" aria-label="${r.label}${st === 'done' ? ', selesai' : ''}">${icon(r.icon)}<span>${r.short}</span>${st === 'done' ? '<i class="bn-dot" aria-hidden="true"></i>' : ''}</button></li>`;
    }).join('');
    markActiveNav();
  }

  function markActiveNav() {
    $$('[data-route]').forEach(b => {
      if (b.dataset.route === currentRoute) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
  }

  function go(route) {
    if (!ROUTE_IDS.includes(route)) route = 'home';
    const target = '#/' + route;
    if (location.hash !== target) location.hash = target;
    else showScreen(route);
  }

  function showScreen(route) {
    if (!ROUTE_IDS.includes(route)) route = 'home';
    if ($('#app').hidden) enterApp(false);
    currentRoute = route;
    $$('.screen').forEach(s => { s.hidden = s.dataset.screen !== route; });
    const r = ROUTES.find(x => x.id === route);
    $('#crumb-current').textContent = r.label;
    document.title = `${r.label} · Pengenalan Struktur Dasar HTML`;
    markActiveNav();
    state.lastRoute = route;
    save();
    const hook = ENTER_HOOKS[route];
    if (hook) hook();
    window.scrollTo({ top: 0, behavior: motionReduced() ? 'auto' : 'smooth' });
    const title = $(`#screen-${route} .screen-title`);
    if (title) title.focus({ preventScroll: true });
  }

  const ENTER_HOOKS = {
    home: () => renderHome(),
    eksplorasi: () => { syncEditor(); runLab(false); },
    game: () => { renderGameHUD(); },
    kuis: () => renderEvalEntry()
  };

  function enterApp(navigate = true) {
    $('#welcome').hidden = true;
    $('#app').hidden = false;
    if (!state.started) { state.started = true; save(); }
    if (navigate) {
      const hashRoute = location.hash.replace('#/', '');
      go(ROUTE_IDS.includes(hashRoute) ? hashRoute : (state.done.apersepsi ? 'home' : 'apersepsi'));
    }
  }

  function showWelcome() {
    $('#app').hidden = true;
    $('#welcome').hidden = false;
    currentRoute = null;
    document.title = 'Pengenalan Struktur Dasar HTML — Misi Pertamamu Menjadi Web Developer!';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    updateWelcome();
    window.scrollTo(0, 0);
    $('#btn-start').focus({ preventScroll: true });
  }

  function updateWelcome() {
    const p = progressPercent();
    const el = $('#welcome-progress');
    if (state.started && (p > 0 || state.xp > 0)) {
      el.hidden = false;
      el.textContent = `Progres tersimpan: ${p}% · ${state.xp} XP`;
    } else el.hidden = true;
    const mb = $('#welcome-music');
    const on = state.settings.music && !state.settings.muted;
    mb.setAttribute('aria-pressed', String(on));
    mb.innerHTML = `${icon('music')}<span class="label">Musik: ${on ? 'Nyala' : 'Mati'}</span>`;
  }

  /* HUD: XP, bintang, progres */
  function updateHUD(bump = false) {
    $('#hud-xp').textContent = state.xp;
    $('#hud-stars').textContent = totalStars();
    $('#hud-stars-max').textContent = STAR_TOTAL;
    const p = progressPercent();
    $('#side-progress-text').textContent = p + '%';
    const bar = $('#side-progress-bar');
    bar.style.setProperty('--p', p + '%');
    bar.firstElementChild.style.setProperty('--p', p + '%');
    bar.setAttribute('aria-valuenow', p);
    if (bump) {
      $$('.topbar .chip').forEach(c => { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); });
    }
    const mute = $('#btn-mute');
    mute.setAttribute('aria-pressed', String(state.settings.muted));
    mute.setAttribute('aria-label', state.settings.muted ? 'Nyalakan suara' : 'Matikan semua suara');
    mute.innerHTML = icon(state.settings.muted ? 'volume-x' : 'volume');
  }

  function setBar(el, value, max) {
    const pct = max ? Math.round(value / max * 100) : 0;
    el.firstElementChild.style.setProperty('--p', pct + '%');
    el.setAttribute('aria-valuenow', value);
  }

  /* ==========================================================================
     7. DASHBOARD (HOME)
     ========================================================================== */

  function badgeSVG(key, unlocked) {
    const b = BADGES[key];
    const gid = 'bg-' + key + '-' + (++mascotId);
    return `<svg viewBox="0 0 100 110" role="img" aria-label="Lencana ${esc(b.title)}${unlocked ? '' : ' (terkunci)'}">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b.colors[0]}"/><stop offset="1" stop-color="${b.colors[1]}"/></linearGradient></defs>
      <path d="M30 70 20 104l16-7 10 13 6-36z" fill="#F43F5E"/><path d="M70 70l10 34-16-7-10 13-6-36z" fill="#E11D48"/>
      <path d="M50 4 88 24v38L50 82 12 62V24z" fill="url(#${gid})" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
      <path d="M50 16 78 30v26L50 70 22 56V30z" fill="#fff" opacity=".2"/>
      <g transform="translate(32 25) scale(1.5)" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${unlocked ? ICONS[b.icon] : ICONS.lock}</g>
    </svg>`;
  }

  function nextRoute() {
    const m = MODULES.find(x => !state.done[x.id]);
    return m ? m : null;
  }

  function renderHome() {
    const p = progressPercent();
    const doneCount = MODULES.filter(m => state.done[m.id]).length;
    $('#home-ring-value').textContent = p + '%';
    $('#home-ring-fg').style.strokeDashoffset = String(314.16 * (1 - p / 100));
    $('#stat-xp').textContent = state.xp;
    $('#stat-stars').textContent = `${totalStars()}/${STAR_TOTAL}`;
    $('#stat-done').textContent = `${doneCount}/6`;
    $('#stat-best').textContent = state.eval.submitted || state.eval.best ? state.eval.best : '–';
    const next = nextRoute();
    $('#home-lead').textContent = next
      ? `Misi berikutnya: ${next.title}. Selesaikan 6 misi untuk menguasai kerangka dasar HTML5.`
      : 'Semua misi selesai! Kamu boleh mengulang kuis untuk memperbaiki nilai.';
    $('#btn-continue span').textContent = next ? 'Lanjutkan Misi' : 'Ulangi Final Mission';
    if (doneCount === 0) say('home', 'Aku akan menemanimu di setiap misi. Mulai dari Misi 1: Apersepsi ya!', 'happy');
    else if (next) say('home', `Keren, ${doneCount} misi beres! Lanjut ke ${next.title}, yuk.`, 'happy');
    else say('home', 'Semua misi tuntas! Kamu hebat!', 'celebrate');

    $('#module-grid').innerHTML = MODULES.map(m => {
      const done = state.done[m.id];
      const xpGot = Object.keys(state.awards).filter(k => k.startsWith(m.id + ':')).reduce((a, k) => a + state.awards[k], 0);
      return `<li><button type="button" class="module-card ${done ? 'is-done' : ''}" style="--tone:${m.tone};--soft:${m.soft};--accent:${m.accent}" data-go="${m.route}" ${m.tab ? `data-tab="${m.tab}"` : ''} aria-label="${m.num}: ${m.title}, ${done ? 'selesai' : 'belum dikerjakan'}. Buka">
        <span class="module-top"><span class="module-icon">${icon(m.icon)}</span><span><span class="module-num">${m.num}</span><span class="m-title">${m.title}</span></span></span>
        <span class="module-status" aria-hidden="true">${icon(done ? 'check-circle' : 'circle')}</span>
        <span class="module-desc">${m.desc}</span>
        <span class="module-foot">
          <span class="status-pill ${done ? 'done' : ''}">${icon(done ? 'check-circle' : 'circle')}${done ? 'Selesai' : 'Belum'}${xpGot ? ` · ${xpGot} XP` : ''}</span>
          <span class="go-label">${done ? 'Buka lagi' : 'Mulai'}${icon('arrow-right')}</span>
        </span>
      </button></li>`;
    }).join('');

    $('#badge-grid').innerHTML = Object.keys(BADGES).map(k => {
      const on = state.badges[k];
      return `<div class="card badge-card ${on ? 'is-unlocked' : ''}">
        <div class="badge-art ${on ? '' : 'locked'}">${badgeSVG(k, on)}</div>
        <div><h4>${BADGES[k].title}</h4><p>${on ? 'Terbuka! ' : 'Terkunci. '}${BADGES[k].desc}</p></div>
      </div>`;
    }).join('');

    $('#storage-note').hidden = storageOK;
  }

  function showReward(key) {
    const b = BADGES[key];
    $('#reward-art').innerHTML = badgeSVG(key, true);
    $('#reward-title').textContent = b.title;
    $('#reward-msg').textContent = b.desc;
    confetti(70);
    sfx('complete');
    openDialog($('#reward-dialog'));
    if (currentRoute === 'home') renderHome();
  }

  /* ==========================================================================
     8. APERSEPSI
     ========================================================================== */

  const APERSEPSI_OPTIONS = [
    { text: 'Halaman A karena informasinya tersusun rapi.', correct: true },
    { text: 'Halaman B karena tampilannya lebih padat.', correct: false,
      why: 'Tampilan padat belum tentu mudah dibaca. Di halaman B tulisan saling berhimpitan dan ukurannya acak, sehingga mata sulit menemukan informasi.' },
    { text: 'Keduanya sama saja.', correct: false,
      why: 'Coba bandingkan lagi: halaman A punya judul, paragraf, dan daftar yang jelas, sedangkan halaman B tersusun acak.' }
  ];

  function renderApersepsi() {
    const wrap = $('#apersepsi-options');
    wrap.innerHTML = APERSEPSI_OPTIONS.map((o, i) =>
      `<button type="button" class="option" data-i="${i}"><span class="opt-letter">${'ABC'[i]}</span><span class="opt-text">${esc(o.text)}</span><span class="opt-status"></span></button>`
    ).join('');
    if (state.apersepsi.correct) answerApersepsi(0, true);
  }

  function answerApersepsi(i, silent = false) {
    const opt = APERSEPSI_OPTIONS[i];
    const buttons = $$('#apersepsi-options .option');
    buttons.forEach(b => { b.disabled = true; });
    const btn = buttons[i];
    const fb = $('#apersepsi-feedback');
    $('#card-a').classList.remove('is-chosen-ok', 'is-chosen-bad');
    $('#card-b').classList.remove('is-chosen-ok', 'is-chosen-bad');
    if (opt.correct) {
      btn.classList.add('is-correct');
      btn.querySelector('.opt-status').innerHTML = `${icon('check-circle')}Benar`;
      buttons.forEach((b, j) => { if (j !== i) b.classList.add('is-dim'); });
      $('#card-a').classList.add('is-chosen-ok');
      $('#mini-a').classList.add('is-ok');
      $('#mini-b').classList.remove('is-bad');
      setFeedback(fb, 'ok', 'Tepat sekali! Halaman A lebih mudah dibaca.', 'Halaman web yang mudah dibaca memiliki struktur informasi yang jelas. HTML membantu kita menyusun judul, paragraf, daftar, dan bagian konten agar browser memahami susunan halaman.');
      $('#apersepsi-retry').hidden = true;
      $('#apersepsi-next').hidden = false;
      $('#btn-peek').hidden = false;
      say('apersepsi', 'Mantap! Struktur yang jelas memang kuncinya. Coba "Intip Struktur HTML" halaman A.', 'happy');
      say('apersepsi-observe', 'Kamu sudah menjawab dengan benar! Halaman A tersusun rapi berkat elemen HTML.', 'happy');
      if (!silent) {
        sfx('correct');
        state.apersepsi.correct = true;
        award('apersepsi:answer', 20, 'Tantangan pertama selesai');
        setStars('apersepsi', 1);
        completeModule('apersepsi');
        starBurst(btn);
      }
    } else {
      btn.classList.add('is-wrong');
      btn.querySelector('.opt-status').innerHTML = `${icon('x-circle')}Kurang tepat`;
      $(i === 1 ? '#mini-b' : '#mini-a').classList.add('is-bad');
      if (i === 2) $('#mini-b').classList.add('is-bad');
      setFeedback(fb, 'bad', 'Belum tepat, tapi pengamatanmu sudah bagus untuk dicoba lagi!', opt.why);
      $('#apersepsi-retry').hidden = false;
      $('#apersepsi-next').hidden = true;
      say('apersepsi', 'Tidak apa-apa! Lihat lagi judul dan jarak tulisannya, lalu coba sekali lagi.', 'encourage');
      sfx('wrong');
    }
  }

  function retryApersepsi() {
    $$('#apersepsi-options .option').forEach(b => {
      b.disabled = false;
      b.classList.remove('is-wrong', 'is-correct', 'is-dim');
      b.querySelector('.opt-status').innerHTML = '';
    });
    $('#apersepsi-feedback').hidden = true;
    $('#apersepsi-retry').hidden = true;
    $('#mini-a').classList.remove('is-bad');
    $('#mini-b').classList.remove('is-bad');
    say('apersepsi', 'Ayo coba lagi. Bayangkan kamu sedang mencari jadwal kegiatan klub.', 'think');
    $('#apersepsi-options .option').focus();
  }

  /* ==========================================================================
     9. MATERI
     ========================================================================== */

  let segIndex = 0;

  function renderMateri() {
    $('#materi-code').innerHTML = MATERI_CODE.map((line, i) =>
      `<button type="button" class="code-line" data-line="${i}" data-group="${LINE_GROUP[i]}" aria-label="Baris ${i + 1}: ${esc(line.trim())}"><span class="src">${highlightHTML(line)}</span></button>`
    ).join('');
    $('#explain-dots').innerHTML = SEGMENTS.map(() => '<span></span>').join('');
    renderQuick();
    selectSegment(0, false);
  }

  function selectSegment(i, animate = true) {
    segIndex = Math.max(0, Math.min(SEGMENTS.length - 1, i));
    const seg = SEGMENTS[segIndex];
    if (!state.materi.visited.includes(segIndex)) {
      state.materi.visited.push(segIndex);
      save();
    }
    $$('#materi-code .code-line').forEach((el, li) => {
      el.classList.toggle('is-active', seg.lines.includes(li));
      el.classList.toggle('is-related', !!(seg.related && seg.related.includes(li)));
      el.setAttribute('aria-pressed', String(seg.lines.includes(li)));
    });
    const card = $('#explain-card');
    card.classList.remove('g-head', 'g-body', 'swap');
    if (seg.group !== 'wrap') card.classList.add('g-' + seg.group);
    if (animate) { void card.offsetWidth; card.classList.add('swap'); }
    $('#explain-count').textContent = `Bagian ${segIndex + 1} dari ${SEGMENTS.length}`;
    const gp = $('#explain-group');
    gp.className = 'group-pill' + (seg.group !== 'wrap' ? ' g-' + seg.group : '');
    gp.textContent = GROUP_LABEL[seg.group] + (seg.core ? '' : ' · pelengkap');
    $('#explain-tag').textContent = seg.tag;
    $('#explain-text').textContent = seg.text;
    $('#explain-analogy').innerHTML = `${icon('lightbulb')}<span></span>`;
    $('#explain-analogy span').textContent = seg.analogy;
    $$('#explain-dots span').forEach((d, di) => {
      d.className = di === segIndex ? 'a' : (state.materi.visited.includes(di) ? 'v' : '');
    });
    $$('#core-chips .core-chip').forEach(ch => {
      const s = +ch.dataset.seg;
      ch.classList.toggle('is-active', s === segIndex);
      ch.classList.toggle('is-visited', s !== segIndex && state.materi.visited.includes(s));
    });
    $('#explain-prev').disabled = segIndex === 0;
    $('#explain-next').setAttribute('aria-label', segIndex === SEGMENTS.length - 1 ? 'Lanjut ke Cek Cepat' : 'Bagian berikutnya');
    const activeLine = $('#materi-code .code-line.is-active');
    const box = $('#materi-code');
    if (activeLine && box.scrollHeight > box.clientHeight) {
      const top = activeLine.offsetTop;
      const h = activeLine.offsetHeight;
      if (top < box.scrollTop) box.scrollTop = top;
      else if (top + h > box.scrollTop + box.clientHeight) box.scrollTop = top + h - box.clientHeight;
    }

    const tips = {
      wrap: 'Bagian ini adalah pembungkus dokumen. Perhatikan garis ungu di sebelah kiri kode.',
      head: 'Ini wilayah informasi dokumen (garis cyan). Isinya umumnya tidak tampil di halaman.',
      body: 'Ini wilayah konten halaman (garis kuning). Semua yang tampil ditulis di sini.'
    };
    if (animate) say('materi', seg.core ? tips[seg.group] : 'Bagian ini pelengkap. Bagus untuk diketahui, tapi fokus utamamu tetap 5 struktur inti.', 'think');

    if (state.materi.visited.length === SEGMENTS.length && !state.done.materi) {
      award('materi:all', 30, 'Semua bagian kerangka dipelajari');
      setStars('materi', 1);
      completeModule('materi');
      say('materi', 'Hebat, semua bagian sudah dipelajari! Coba "Jalankan Kode", lalu tekan Berikutnya untuk Cek Cepat.', 'happy');
    }
  }

  function runMateri() {
    const src = MATERI_CODE.join('\n');
    const result = buildPreview(src);
    $('#materi-frame').srcdoc = result.html;
    $('#materi-tab-title').textContent = result.title || '(tanpa judul)';
    openDialog($('#preview-dialog'));
    const tab = $('#preview-dialog .browser-tab');
    tab.classList.remove('flash'); void tab.offsetWidth; tab.classList.add('flash');
    sfx('click');
    say('materi', 'Lihat! "Halaman Pertamaku" ada di tab, sedangkan h1 dan p tampil di halaman.', 'happy');
  }

  function renderQuick() {
    $('#quick-list').innerHTML = QUICK_ITEMS.map(q => {
      const ans = state.materi.quick[q.id];
      const ok = ans === q.answer;
      const stateCls = ans ? (ok ? 'ok' : 'bad') : '';
      const stateTxt = ans ? (ok ? `${icon('check-circle')}<span class="qs-text">Benar</span>` : `${icon('x-circle')}<span class="qs-text">Coba lagi</span>`) : '';
      return `<li class="quick-item ${stateCls}" data-q="${q.id}">
        <span class="q-code"><code>${esc(q.code)}</code></span>
        <span class="quick-btns" role="group" aria-label="Pilih letak untuk ${esc(q.code)}">
          <button type="button" class="btn btn-secondary" data-place="head" aria-pressed="${ans === 'head'}">&lt;head&gt;</button>
          <button type="button" class="btn btn-secondary" data-place="body" aria-pressed="${ans === 'body'}">&lt;body&gt;</button>
        </span>
        <span class="quick-state" aria-live="polite">${stateTxt}</span>
      </li>`;
    }).join('');
  }

  function answerQuick(qid, place) {
    const q = QUICK_ITEMS.find(x => x.id === qid);
    state.materi.quick[qid] = place;
    save();
    renderQuick();
    const fb = $('#quick-feedback');
    if (place === q.answer) {
      sfx('correct');
      setFeedback(fb, 'ok', 'Benar!', q.why);
    } else {
      sfx('wrong');
      setFeedback(fb, 'bad', 'Belum tepat. Pikirkan: apakah baris ini tampil di halaman?', 'Informasi dokumen → head. Konten yang terlihat → body.');
    }
    const allOk = QUICK_ITEMS.every(x => state.materi.quick[x.id] === x.answer);
    if (allOk) {
      setFeedback(fb, 'ok', 'Semua benar! Kamu bisa membedakan metadata (head) dan konten (body).');
      award('materi:quick', 20, 'Cek Cepat head/body tuntas');
      say('materi', 'Sempurna! Kamu sudah paham bedanya head dan body.', 'celebrate');
    }
  }

  /* ==========================================================================
     10. LAB HTML
     ========================================================================== */

  /* Pratinjau aman: kode diurai DOMParser, elemen/atribut berbahaya dibuang,
     lalu ditampilkan di iframe sandbox="" (tanpa allow-scripts) + CSP ketat. */
  function buildPreview(src) {
    const doc = new DOMParser().parseFromString(src, 'text/html');
    doc.querySelectorAll('script, iframe, frame, frameset, object, embed, applet, base, link, meta[http-equiv], noscript, template, portal').forEach(n => n.remove());
    doc.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        const name = attr.name.toLowerCase();
        const val = attr.value.replace(/[\s\u0000-\u001f]/g, '').toLowerCase();
        if (name.startsWith('on')) el.removeAttribute(attr.name);
        else if (['href', 'src', 'action', 'formaction', 'xlink:href', 'srcset', 'poster', 'data'].includes(name)) {
          if (/^(javascript|vbscript|data):/.test(val) && !/^data:image\/(png|jpe?g|gif|webp);/.test(val)) el.removeAttribute(attr.name);
        }
      });
      if (el.tagName === 'A' && el.hasAttribute('href')) {
        el.setAttribute('title', 'Tautan dinonaktifkan di pratinjau');
        el.removeAttribute('href');
        el.style.textDecoration = 'underline';
        el.style.color = '#4F46E5';
      }
    });
    const csp = doc.createElement('meta');
    csp.setAttribute('http-equiv', 'Content-Security-Policy');
    csp.setAttribute('content', "default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:");
    doc.head.prepend(csp);
    const title = (doc.title || '').trim();
    return { html: '<!DOCTYPE html>\n' + doc.documentElement.outerHTML, title, doc };
  }

  function checkStructure(src) {
    const s = src.toLowerCase();
    const has = re => re.test(s);
    return [
      { label: '<!DOCTYPE html>', ok: /^\s*<!doctype\s+html\s*>/i.test(src) },
      { label: '<html>', ok: has(/<html[\s>]/) && s.includes('</html>') },
      { label: '<head>', ok: has(/<head[\s>]/) && s.includes('</head>') },
      { label: '<title>', ok: has(/<title[\s>]/) && s.includes('</title>') },
      { label: '<body>', ok: has(/<body[\s>]/) && s.includes('</body>') },
      { label: 'head sebelum body', ok: s.indexOf('<head') > -1 && s.indexOf('<body') > s.indexOf('<head') }
    ];
  }

  const editor = () => $('#lab-editor');
  let caretLine = 0;

  function syncEditor() {
    const ta = editor();
    const src = ta.value;
    $('#editor-highlight').innerHTML = highlightHTML(src) + '\n ';
    const lines = src.split('\n').length;
    const pos = ta.selectionStart || 0;
    caretLine = src.slice(0, pos).split('\n').length - 1;
    let g = '';
    for (let i = 0; i < lines; i++) g += `<div${i === caretLine ? ' class="cur"' : ''}>${i + 1}</div>`;
    $('#editor-gutter').innerHTML = g;
    $('#caret-pos').textContent = `Baris ${caretLine + 1}`;
    syncScroll();
  }

  function syncScroll() {
    const ta = editor();
    const hl = $('#editor-highlight');
    hl.scrollTop = ta.scrollTop;
    hl.scrollLeft = ta.scrollLeft;
    $('#editor-gutter').scrollTop = ta.scrollTop;
  }

  let saveTimer = null;
  function onEditorInput() {
    syncEditor();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { state.lab.code = editor().value; save(); }, 400);
  }

  function setLabView(view) {
    $('.lab-grid').dataset.view = view;
    $('#lab-view-code').setAttribute('aria-selected', String(view === 'code'));
    $('#lab-view-preview').setAttribute('aria-selected', String(view === 'preview'));
  }
  const isCompact = () => window.matchMedia('(max-width: 899px)').matches;

  function runLab(withSound = true) {
    const src = editor().value;
    const result = buildPreview(src);
    $('#lab-frame').srcdoc = result.html;
    $('#lab-tab-title').textContent = result.title || '(tanpa judul)';
    const tab = $('#lab-tab-title').parentElement;
    if (withSound) {
      if (isCompact()) setLabView('preview');
      tab.classList.remove('flash'); void tab.offsetWidth; tab.classList.add('flash'); sfx('click');
    }
    $('#lab-lint').innerHTML = checkStructure(src).map(c =>
      `<span class="lint-chip ${c.ok ? 'ok' : 'bad'}">${icon(c.ok ? 'check' : 'x')}${esc(c.label)}<span class="sr-only">${c.ok ? ' sudah benar' : ' perlu diperiksa'}</span></span>`
    ).join('');
    state.lab.code = src;
    save();
  }

  const norm = s => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const normLoose = s => norm(s).replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();

  /* Pemeriksa misi: memakai posisi kursor & DOMParser, bukan sekadar teks mentah. */
  const MISSION_CHECKS = [
    function m1(src) {
      const line = src.split('\n')[caretLine] || '';
      if (/<\/?title[\s>]/i.test(line)) return { ok: true, msg: `Benar! Baris ${caretLine + 1} berisi <title>, penentu judul tab browser.` };
      return { ok: false, msg: `Kursormu ada di baris ${caretLine + 1}. Itu bukan bagian judul tab. Klik baris yang berisi <title>.` };
    },
    function m2(src) {
      const low = src.toLowerCase();
      const pos = editor().selectionStart;
      const bOpen = low.search(/<body[\s>]/);
      const bClose = low.indexOf('</body>');
      if (bOpen < 0 || bClose < 0) return { ok: false, msg: 'Tag <body> atau </body> tidak ditemukan. Tekan "Reset Kode" bila perlu.' };
      const openEnd = low.indexOf('>', bOpen) + 1;
      const line = (src.split('\n')[caretLine] || '').trim();
      if (pos >= openEnd && pos <= bClose && line && !/^<\/?body/i.test(line)) {
        return { ok: true, msg: `Tepat! Baris ${caretLine + 1} berada di dalam <body>, yaitu konten yang tampil di halaman.` };
      }
      if (/^<\/?body/i.test(line)) return { ok: false, msg: 'Hampir! Itu tag pembuka/penutup body. Pilih baris konten di antara keduanya, misalnya <h1>.' };
      return { ok: false, msg: `Baris ${caretLine + 1} belum termasuk konten halaman. Cari baris di antara <body> dan </body>.` };
    },
    function m3(src) {
      const { doc } = buildPreview(src);
      const low = src.toLowerCase();
      const tPos = low.search(/<title[\s>]/);
      const bPos = low.search(/<body[\s>]/);
      if (tPos < 0) return { ok: false, msg: 'Elemen <title> tidak ditemukan. Jangan hapus tag-nya, cukup ganti teks di dalamnya.' };
      if (bPos > -1 && tPos > bPos) return { ok: false, msg: '<title> harus tetap berada di dalam <head>, bukan di body.' };
      if (norm(doc.title) === 'profil saya') return { ok: true, msg: 'Berhasil! Judul tab kini "Profil Saya".' };
      return { ok: false, msg: `Judul saat ini "${doc.title.trim() || '(kosong)'}". Ubah menjadi "Profil Saya".` };
    },
    function m4(src) {
      const { doc } = buildPreview(src);
      const h1 = doc.body ? doc.body.querySelector('h1') : null;
      if (!h1) return { ok: false, msg: 'Elemen <h1> tidak ditemukan di dalam body.' };
      if (normLoose(h1.textContent) === 'halo aku web developer') return { ok: true, msg: 'Keren! Heading kini "Halo, Aku Web Developer!".' };
      return { ok: false, msg: `Isi <h1> saat ini "${h1.textContent.trim()}". Ubah menjadi "Halo, Aku Web Developer!".` };
    },
    function m5(src) {
      const low = src.toLowerCase();
      const bOpen = low.search(/<body[\s>]/);
      const bClose = low.lastIndexOf('</body>');
      if (bOpen < 0 || bClose < 0) return { ok: false, msg: 'Pastikan tag <body> dan </body> masih ada.' };
      const inside = low.slice(bOpen, bClose);
      const rawCount = (inside.match(/<p[\s>]/g) || []).length;
      const { doc } = buildPreview(src);
      const ps = doc.body ? Array.from(doc.body.querySelectorAll('p')).filter(p => p.textContent.trim().length >= 5) : [];
      if (rawCount >= 2 && ps.length >= 2) return { ok: true, msg: `Mantap! Ada ${ps.length} paragraf di dalam body. Halaman profilmu jadi!` };
      if ((low.match(/<p[\s>]/g) || []).length > rawCount) return { ok: false, msg: 'Paragraf barumu berada di luar <body>. Pindahkan ke sebelum </body>.' };
      if (rawCount >= 2) return { ok: false, msg: 'Paragraf baru sudah ada, tapi isinya terlalu pendek. Tulis kalimat perkenalan minimal 5 huruf.' };
      return { ok: false, msg: 'Belum ada paragraf baru. Tambahkan <p>…</p> berisi perkenalan di dalam body.' };
    }
  ];

  function firstOpenMission() {
    const i = state.lab.missions.findIndex(x => !x);
    return i === -1 ? MISSIONS.length - 1 : i;
  }

  function renderMissions() {
    const done = state.lab.missions;
    const firstOpen = done.findIndex(x => !x);
    $('#mission-strip').innerHTML = MISSIONS.map((m, i) => {
      const isDone = done[i];
      const locked = !isDone && firstOpen !== -1 && i > firstOpen;
      const cls = isDone ? 'is-done' : locked ? 'is-locked' : 'is-current';
      const ic = isDone ? 'check-circle' : locked ? 'lock' : 'target';
      const status = isDone ? 'selesai' : locked ? 'terkunci' : 'sedang dikerjakan';
      return `<button type="button" role="listitem" class="mission-tab ${cls} ${i === state.lab.current ? 'is-active' : ''}" data-mission="${i}" ${locked ? 'aria-disabled="true"' : ''} aria-label="Misi ${i + 1}: ${m.short}, ${status}">${icon(ic)}<span>${i + 1}</span><span class="m-label">${m.short}</span></button>`;
    }).join('');
    const count = done.filter(Boolean).length;
    setBar($('#lab-progress'), count, MISSIONS.length);
    const m = MISSIONS[state.lab.current];
    $('#mission-count').textContent = `Misi ${state.lab.current + 1} dari ${MISSIONS.length}${done[state.lab.current] ? ' · Selesai' : ''}`;
    $('#mission-title').textContent = m.title;
    $('#mission-text').textContent = m.text;
    const card = $('#mission-card');
    card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
  }

  function selectMission(i) {
    const firstOpen = state.lab.missions.findIndex(x => !x);
    if (!state.lab.missions[i] && firstOpen !== -1 && i > firstOpen) {
      say('lab', `Misi ${i + 1} masih terkunci. Selesaikan Misi ${firstOpen + 1} dulu ya.`, 'encourage');
      return;
    }
    state.lab.current = i;
    save();
    $('#lab-feedback').hidden = true;
    renderMissions();
    say('lab', MISSIONS[i].text, 'think');
  }

  function checkMission() {
    const i = state.lab.current;
    const src = editor().value;
    const res = MISSION_CHECKS[i](src);
    const fb = $('#lab-feedback');
    if (res.ok) {
      sfx('correct');
      setFeedback(fb, 'ok', res.msg);
      const first = !state.lab.missions[i];
      state.lab.missions[i] = true;
      save();
      if (first) award(`lab:m${i + 1}`, 20, `Misi lab ${i + 1} selesai`);
      starBurst($('#lab-check'));
      runLab(false);
      if (state.lab.missions.every(Boolean)) {
        if (!state.done.lab) {
          setStars('lab', 1);
          completeModule('lab');
          confetti(60);
        }
        say('lab', 'Semua misi lab tuntas! Kamu baru saja membangun halaman profil pertamamu.', 'celebrate');
        renderMissions();
      } else {
        say('lab', 'Berhasil! Misi berikutnya sudah terbuka.', 'happy');
        setTimeout(() => {
          state.lab.current = firstOpenMission();
          save();
          renderMissions();
          $('#lab-feedback').hidden = false;
        }, 1100);
        renderMissions();
      }
    } else {
      sfx('wrong');
      setFeedback(fb, 'bad', res.msg);
      say('lab', 'Belum pas, tapi kamu sudah dekat. Tekan "Petunjuk" kalau butuh bantuan.', 'encourage');
    }
  }

  function initEditor() {
    const ta = editor();
    ta.value = state.lab.code || LAB_STARTER;
    let escPressed = false;
    ta.addEventListener('input', onEditorInput);
    ta.addEventListener('scroll', syncScroll);
    ['click', 'keyup', 'select', 'focus'].forEach(ev => ta.addEventListener(ev, syncEditor));
    ta.addEventListener('keydown', e => {
      if (e.key === 'Escape') { escPressed = true; return; }
      if (e.key === 'Tab' && !escPressed && !e.shiftKey) {
        e.preventDefault();
        const s = ta.selectionStart;
        const end = ta.selectionEnd;
        ta.setRangeText('    ', s, end, 'end');
        onEditorInput();
      }
      if (e.key !== 'Tab') escPressed = false;
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runLab(); }
    });
    syncEditor();
  }

  /* ==========================================================================
     11. GAME
     ========================================================================== */

  function renderGameHUD() {
    const gamePts = Object.keys(state.awards).filter(k => k.startsWith('gameA:') || k.startsWith('gameB:')).reduce((a, k) => a + state.awards[k], 0);
    $('#game-points').textContent = gamePts;
    $('#game-stars').textContent = `${(state.stars.gameA || 0) + (state.stars.gameB || 0)}/2`;
    const n = (state.done.gameA ? 1 : 0) + (state.done.gameB ? 1 : 0);
    $('#game-progress-text').textContent = `${n}/2`;
    setBar($('#game-progress'), n, 2);
    $('#tab-a-done').toggleAttribute('hidden', !state.done.gameA);
    $('#tab-b-done').toggleAttribute('hidden', !state.done.gameB);
  }

  function selectTab(which) {
    const a = which === 'a';
    $('#tab-a').setAttribute('aria-selected', String(a));
    $('#tab-b').setAttribute('aria-selected', String(!a));
    $('#tab-a').tabIndex = a ? 0 : -1;
    $('#tab-b').tabIndex = a ? -1 : 0;
    $('#panel-a').hidden = !a;
    $('#panel-b').hidden = a;
  }

  /* ---------- Game A ---------- */
  let selectedCard = null;
  let suppressClick = false;
  let gameALocked = false;

  function ensureOrder() {
    if (!state.gameA.order || state.gameA.order.length !== CARDS.length) {
      let order = shuffle(CARDS.map(c => c.id));
      if (order.every((id, i) => id === CARDS[i].id)) order = order.reverse();
      state.gameA.order = order;
      save();
    }
  }

  const cardText = id => CARDS.find(c => c.id === id).text;

  function cardHTML(id, inSlot) {
    /* Kartu di dalam slot berupa <span> (slot itu sendiri yang bisa diklik) agar tidak ada tombol bersarang. */
    if (inSlot) return `<span class="tag-card in-slot" data-card="${id}" aria-hidden="true">${esc(cardText(id))}</span>`;
    return `<button type="button" class="tag-card ${selectedCard === id ? 'is-selected' : ''}" data-card="${id}" aria-pressed="${selectedCard === id}" aria-label="Kartu ${esc(cardText(id))}">${icon('grip', 'grip')}${esc(cardText(id))}</button>`;
  }

  function renderGameA() {
    ensureOrder();
    const placed = state.gameA.placed;
    let ln = 0;
    $('#board').innerHTML = BOARD.map(line => {
      ln++;
      const parts = line.map(part => {
        if (part.indent) return `<span class="board-indent" style="--n:${part.indent}" aria-hidden="true"></span>`;
        if (part.text) return `<span class="board-fixed t-txt">${esc(part.text)}</span>`;
        if (part.code) return `<span class="board-fixed">${highlightHTML(part.code)}</span>`;
        const idx = part.slot;
        const id = placed[idx];
        const label = id ? `Slot ${idx + 1} berisi ${cardText(id)}` : `Slot ${idx + 1} kosong`;
        return `<span class="slot ${id ? 'is-filled' : ''} ${selectedCard && !id ? 'is-ready' : ''}" data-index="${idx}" role="button" tabindex="0" aria-label="${esc(label)}">${id ? cardHTML(id, true) : `<span aria-hidden="true">slot ${idx + 1}</span>`}<span class="slot-mark"></span></span>`;
      }).join('');
      return `<div class="board-line"><span class="board-ln" aria-hidden="true">${ln}</span>${parts}</div>`;
    }).join('');

    const tray = state.gameA.order.filter(id => !placed.includes(id));
    $('#tray').innerHTML = tray.length
      ? tray.map(id => cardHTML(id, false)).join('')
      : `<p class="tray-empty">Semua kartu sudah terpasang. Tekan "Periksa Susunan"!</p>`;
    $('#slot-count').textContent = `${placed.filter(Boolean).length}/9 terisi`;
    $('#tray-help').textContent = selectedCard
      ? `Kartu ${cardText(selectedCard)} dipilih. Sekarang pilih slot tujuan.`
      : 'Seret kartu ke slot, atau pilih kartu lalu pilih slot tujuan.';
    $('#gameA-check').disabled = gameALocked;
  }

  function selectCard(id) {
    if (gameALocked) return;
    selectedCard = selectedCard === id ? null : id;
    sfx('click');
    renderGameA();
    if (selectedCard) {
      const firstEmpty = $('#board .slot:not(.is-filled)');
      say('gameA', `Kartu ${cardText(id)} siap. Pilih slot yang tepat untuknya!`, 'think');
      if (firstEmpty && document.activeElement && document.activeElement.closest('#tray')) {
        const again = $(`#tray [data-card="${id}"]`);
        if (again) again.focus();
      }
    }
  }

  function placeCard(id, idx) {
    if (gameALocked) return;
    const placed = state.gameA.placed;
    const from = placed.indexOf(id);
    const occupant = placed[idx];
    if (from === idx) return;
    if (from > -1) placed[from] = null;
    if (occupant && occupant !== id) {
      if (from > -1) placed[from] = occupant; // tukar posisi
    }
    placed[idx] = id;
    selectedCard = null;
    save();
    sfx('place');
    renderGameA();
    clearSlotMarks();
    const el = $(`#board .slot[data-index="${idx}"] .tag-card`);
    if (el) el.classList.add('place-anim');
    const slotEl = $(`#board .slot[data-index="${idx}"]`);
    if (slotEl) slotEl.focus({ preventScroll: true });
    $('#gameA-feedback').hidden = true;
    if (placed.every(Boolean)) say('gameA', 'Semua slot terisi. Tekan "Periksa Susunan" untuk mengecek!', 'happy');
  }

  function unplace(id) {
    if (gameALocked) return;
    const i = state.gameA.placed.indexOf(id);
    if (i > -1) state.gameA.placed[i] = null;
    save();
    renderGameA();
  }

  function clearSlotMarks() {
    $$('#board .slot').forEach(s => s.classList.remove('is-correct', 'is-wrong'));
  }

  function onSlotActivate(slotEl) {
    if (gameALocked) return;
    const idx = +slotEl.dataset.index;
    const filled = state.gameA.placed[idx];
    if (selectedCard) placeCard(selectedCard, idx);
    else if (filled) { unplace(filled); say('gameA', `Kartu ${cardText(filled)} kembali ke tempat kartu.`, 'think'); }
    else say('gameA', 'Pilih dulu salah satu kartu di Kartu Tag, lalu pilih slot ini.', 'think');
  }

  function checkGameA() {
    const placed = state.gameA.placed;
    const fb = $('#gameA-feedback');
    if (placed.some(x => !x)) {
      setFeedback(fb, 'warn', `Masih ada ${placed.filter(x => !x).length} slot kosong.`, 'Isi semua slot dulu sebelum memeriksa.');
      say('gameA', 'Isi semua slot dulu ya, baru kita periksa.', 'think');
      return;
    }
    state.gameA.attempts++;
    let correct = 0;
    placed.forEach((id, i) => {
      const ok = id === CARDS[i].id;
      if (ok) correct++;
      const slot = $(`#board .slot[data-index="${i}"]`);
      slot.classList.add(ok ? 'is-correct' : 'is-wrong');
      slot.querySelector('.slot-mark').innerHTML = icon(ok ? 'check-circle' : 'x-circle') + `<span class="sr-only">${ok ? 'benar' : 'salah'}</span>`;
    });
    save();
    if (correct === CARDS.length) {
      gameALocked = true;
      $('#gameA-check').disabled = true;
      sfx('complete');
      setFeedback(fb, 'ok', 'Sempurna! Kerangka HTML5 tersusun dengan benar.', `Kamu menyelesaikannya dalam ${state.gameA.attempts} percobaan.`);
      say('gameA', 'Luar biasa! Kamu arsitek HTML sejati!', 'celebrate');
      /* Poin: 50 untuk penyelesaian pertama, +10 bonus jika langsung benar. Tidak ada pengurangan. */
      award('gameA:done', 50, 'Kerangka HTML tersusun');
      if (state.gameA.attempts === 1) award('gameA:perfect', 10, 'Bonus langsung benar');
      setStars('gameA', 1);
      completeModule('gameA');
      starBurst($('#gameA-check'));
      confetti(50);
      renderGameHUD();
      setMood($('#game-hud-mascot'), 'celebrate');
    } else {
      sfx('wrong');
      setFeedback(fb, 'bad', `${correct} dari 9 posisi sudah benar.`, 'Slot bertanda merah perlu ditukar. Ketuk slot untuk mengembalikan kartunya, lalu coba lagi.');
      say('gameA', 'Hampir! Perhatikan slot merah. Ingat: yang dibuka belakangan ditutup lebih dulu.', 'encourage');
    }
  }

  function hintGameA() {
    const i = state.gameA.hint % GAME_A_HINTS.length;
    state.gameA.hint++;
    save();
    say('gameA', GAME_A_HINTS[i], 'think');
    setFeedback($('#gameA-feedback'), 'info', `Petunjuk ${i + 1}/${GAME_A_HINTS.length}`, GAME_A_HINTS[i]);
  }

  function resetGameA() {
    state.gameA.placed = Array(9).fill(null);
    state.gameA.order = null;
    state.gameA.attempts = 0;
    gameALocked = false;
    selectedCard = null;
    save();
    renderGameA();
    $('#gameA-feedback').hidden = true;
    say('gameA', 'Kartu sudah diacak ulang. Ayo susun lagi!', 'think');
  }

  /* Seret-dan-lepas memakai Pointer Events → bekerja untuk mouse & layar sentuh. */
  function initDrag() {
    const board = $('#board');
    const tray = $('#tray');
    const area = $('#panel-a');
    area.addEventListener('pointerdown', e => {
      const card = e.target.closest('.tag-card');
      if (!card || gameALocked || (e.pointerType === 'mouse' && e.button !== 0)) return;
      const id = card.dataset.card;
      const sx = e.clientX;
      const sy = e.clientY;
      let ghost = null;
      let hoverEl = null;
      const rect = card.getBoundingClientRect();
      const offX = sx - rect.left;
      const offY = sy - rect.top;

      const move = ev => {
        if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) {
          ghost = card.cloneNode(true);
          ghost.classList.add('drag-ghost');
          ghost.classList.remove('is-selected');
          ghost.style.width = rect.width + 'px';
          document.body.appendChild(ghost);
          card.classList.add('is-dragging');
        }
        if (ghost) {
          ev.preventDefault();
          ghost.style.transform = `translate(${ev.clientX - offX}px, ${ev.clientY - offY}px)`;
          const under = document.elementFromPoint(ev.clientX, ev.clientY);
          const target = under ? (under.closest('.slot') || under.closest('#tray')) : null;
          if (hoverEl && hoverEl !== target) hoverEl.classList.remove('is-target');
          if (target) target.classList.add('is-target');
          hoverEl = target;
        }
      };
      const up = ev => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        if (hoverEl) hoverEl.classList.remove('is-target');
        if (!ghost) return;
        ghost.remove();
        card.classList.remove('is-dragging');
        suppressClick = true;
        setTimeout(() => { suppressClick = false; }, 50);
        const under = document.elementFromPoint(ev.clientX, ev.clientY);
        const slot = under && under.closest('#board .slot');
        if (slot) placeCard(id, +slot.dataset.index);
        else if (under && under.closest('#tray')) unplace(id);
      };
      window.addEventListener('pointermove', move, { passive: false });
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    });

    tray.addEventListener('click', e => {
      if (suppressClick) return;
      const card = e.target.closest('.tag-card');
      if (card) selectCard(card.dataset.card);
    });
    board.addEventListener('click', e => {
      if (suppressClick) return;
      const slot = e.target.closest('.slot');
      if (slot) { e.preventDefault(); onSlotActivate(slot); }
    });
    board.addEventListener('keydown', e => {
      const slot = e.target.closest('.slot');
      if (slot && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onSlotActivate(slot); }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && selectedCard) { selectedCard = null; renderGameA(); }
    });
  }

  /* ---------- Game B: kuis latihan ---------- */
  function renderPractice() {
    const card = $('#practice-card');
    const gb = state.gameB;
    if (gb.finished) {
      const correct = PRACTICE.filter(q => gb.answers[q.id] === q.answer).length;
      const msg = correct >= 5 ? 'Luar biasa! Kamu siap untuk Final Mission.'
        : correct >= 4 ? 'Bagus! Baca lagi pembahasan soal yang salah sebelum evaluasi.'
        : 'Tidak apa-apa. Ulangi latihan atau buka lagi Materi agar makin yakin.';
      card.innerHTML = `<div class="summary quiz-swap">
        <div class="mascot mascot-lg" data-mascot data-mood="${correct >= 4 ? 'celebrate' : 'encourage'}"></div>
        <p class="kicker">Ringkasan Skor Latihan</p>
        <p class="summary-score">${correct}/${PRACTICE.length}</p>
        <h3>${correct >= 4 ? 'Latihan selesai dengan baik!' : 'Latihan selesai!'}</h3>
        <p>${msg}</p>
        <div class="quiz-dots" style="width:100%;max-width:320px">${PRACTICE.map(q => `<span class="${gb.answers[q.id] === q.answer ? 'ok' : 'bad'}"></span>`).join('')}</div>
        <div class="action-row">
          <button type="button" class="btn btn-secondary" id="practice-retry">${icon('rotate')}Ulangi Latihan</button>
          <button type="button" class="btn btn-primary" data-go="kuis">${icon('trophy')}Menuju Evaluasi Akhir</button>
        </div>
      </div>`;
      mountMascots(card);
      say('gameB', msg, correct >= 4 ? 'celebrate' : 'encourage');
      return;
    }
    const q = PRACTICE[gb.index];
    const answered = q.id in gb.answers;
    card.innerHTML = `<div class="quiz-swap">
      <div class="quiz-top"><span class="quiz-num">Soal ${gb.index + 1} dari ${PRACTICE.length}</span><span class="level level-${q.level}">${LEVEL_LABEL[q.level]}</span></div>
      <div class="quiz-dots" aria-hidden="true">${PRACTICE.map((p, i) => {
        const a = gb.answers[p.id];
        const cls = i === gb.index ? 'cur' : (p.id in gb.answers ? (a === p.answer ? 'ok' : 'bad') : '');
        return `<span class="${cls}"></span>`;
      }).join('')}</div>
      <fieldset class="q-fieldset"><legend class="q-prompt"></legend>
        <div class="option-list cols-2">${q.options.map((o, i) =>
          `<button type="button" class="option" data-i="${i}"><span class="opt-letter">${'ABCD'[i]}</span><span class="opt-text"></span><span class="opt-status"></span></button>`).join('')}</div>
      </fieldset>
      <div class="feedback" id="practice-feedback" role="status" aria-live="polite" hidden></div>
      <div class="action-row" id="practice-next-row" hidden><button type="button" class="btn btn-primary" id="practice-next">${gb.index === PRACTICE.length - 1 ? 'Lihat Ringkasan Skor' : 'Soal Berikutnya'}${icon('arrow-right')}</button></div>
    </div>`;
    $('.q-prompt', card).textContent = q.prompt;
    $$('.opt-text', card).forEach((el, i) => { el.textContent = q.options[i]; });
    if (answered) revealPractice(q, gb.answers[q.id], true);
  }

  function revealPractice(q, chosen, silent = false) {
    const card = $('#practice-card');
    const opts = $$('.option', card);
    opts.forEach(b => { b.disabled = true; });
    const ok = chosen === q.answer;
    opts[q.answer].classList.add('is-correct');
    opts[q.answer].querySelector('.opt-status').innerHTML = `${icon('check-circle')}Benar`;
    if (!ok) {
      opts[chosen].classList.add('is-wrong');
      opts[chosen].querySelector('.opt-status').innerHTML = `${icon('x-circle')}Pilihanmu`;
    }
    opts.forEach((b, i) => { if (i !== q.answer && i !== chosen) b.classList.add('is-dim'); });
    setFeedback($('#practice-feedback'), ok ? 'ok' : 'bad', ok ? 'Benar! Hebat!' : `Belum tepat. Jawaban yang benar: ${'ABCD'[q.answer]}.`, q.explain);
    $('#practice-next-row').hidden = false;
    if (!silent) {
      if (ok) {
        sfx('correct');
        award(`gameB:${q.id}`, 10, 'Jawaban latihan benar');
        say('gameB', 'Mantap! Lanjut ke soal berikutnya.', 'happy');
        starBurst(opts[q.answer]);
      } else {
        sfx('wrong');
        say('gameB', 'Tidak apa-apa salah saat latihan. Baca penjelasannya ya!', 'encourage');
      }
      renderGameHUD();
      $('#practice-next').focus({ preventScroll: true });
    }
  }

  function answerPractice(i) {
    const q = PRACTICE[state.gameB.index];
    if (q.id in state.gameB.answers) return; // cegah jawaban ganda
    state.gameB.answers[q.id] = i;
    save();
    revealPractice(q, i);
  }

  function nextPractice() {
    if (state.gameB.index < PRACTICE.length - 1) {
      state.gameB.index++;
      save();
      renderPractice();
      say('gameB', `Soal ${state.gameB.index + 1}: tingkat ${LEVEL_LABEL[PRACTICE[state.gameB.index].level]}. Kamu pasti bisa!`, 'think');
      $('#practice-card .q-prompt').focus && $('#practice-card .option').focus({ preventScroll: true });
    } else {
      state.gameB.finished = true;
      const correct = PRACTICE.filter(q => state.gameB.answers[q.id] === q.answer).length;
      save();
      if (!state.done.gameB) completeModule('gameB');
      if (correct >= 4) setStars('gameB', 1);
      renderPractice();
      renderGameHUD();
    }
  }

  function retryPractice() {
    state.gameB = { index: 0, answers: {}, finished: false };
    save();
    renderPractice();
    say('gameB', 'Latihan diulang. Poin hanya diberikan sekali per soal, tapi pemahamanmu makin kuat!', 'think');
  }

  /* ==========================================================================
     12. EVALUASI AKHIR
     ========================================================================== */

  function evalView(view) {
    ['intro', 'run', 'result', 'review'].forEach(v => { $('#eval-' + v).hidden = v !== view; });
  }

  function renderEvalEntry() {
    const ev = state.eval;
    if (ev.submitted) { renderResult(); evalView('result'); return; }
    if (ev.started) { renderEvalQuestion(); evalView('run'); return; }
    $('#eval-start span').textContent = 'Mulai Evaluasi';
    $('#eval-see-result').hidden = true;
    evalView('intro');
  }

  function renderEvalNav() {
    const ev = state.eval;
    $('#eval-nav').innerHTML = EVAL.map((q, i) => {
      const ans = q.id in ev.answers;
      return `<button type="button" data-q="${i}" class="${ans ? 'answered' : ''}" ${i === ev.current ? 'aria-current="step"' : ''} aria-label="Soal ${i + 1}${ans ? ', sudah dijawab' : ', belum dijawab'}">${i + 1}</button>`;
    }).join('');
    const n = Object.keys(ev.answers).length;
    $('#eval-answered').textContent = n;
    setBar($('#eval-bar'), n, EVAL.length);
  }

  function renderEvalQuestion() {
    const ev = state.eval;
    const q = EVAL[ev.current];
    const card = $('#eval-card');
    card.innerHTML = `<div class="quiz-swap">
      <div class="quiz-top"><span class="quiz-num">Soal ${ev.current + 1} dari ${EVAL.length}</span><span class="level level-2">10 poin</span></div>
      <fieldset class="q-fieldset"><legend class="q-prompt"></legend>
        <div class="q-grid ${q.code ? 'has-code' : ''}">
        ${q.code ? `<div class="code-window q-code"><div class="code-body code-static">${codeBlock(q.code)}</div></div>` : ''}
        <div class="option-list">${q.options.map((o, i) =>
          `<button type="button" class="option ${ev.answers[q.id] === i ? 'is-selected' : ''}" data-i="${i}" aria-pressed="${ev.answers[q.id] === i}"><span class="opt-letter">${'ABCD'[i]}</span><span class="opt-text"></span><span class="opt-status"></span></button>`).join('')}</div>
        </div>
      </fieldset>
    </div>`;
    $('.q-prompt', card).textContent = q.prompt;
    $$('.opt-text', card).forEach((el, i) => { el.textContent = q.options[i]; });
    $$('.option', card).forEach((b, i) => { if (ev.answers[q.id] === i) b.querySelector('.opt-status').innerHTML = `${icon('check')}Dipilih`; });
    $('#eval-qnum').textContent = `Soal ${ev.current + 1}`;
    $('#eval-prev').disabled = ev.current === 0;
    $('#eval-next').disabled = ev.current === EVAL.length - 1;
    renderEvalNav();
  }

  function startEval() {
    state.eval.started = true;
    save();
    renderEvalQuestion();
    evalView('run');
    sfx('click');
    $('#eval-card .option').focus({ preventScroll: true });
  }

  function chooseEval(i) {
    const ev = state.eval;
    if (ev.submitted) return;
    ev.answers[EVAL[ev.current].id] = i;
    save();
    sfx('click');
    renderEvalQuestion();
    $(`#eval-card .option[data-i="${i}"]`).focus({ preventScroll: true });
  }

  function gotoEval(i) {
    state.eval.current = Math.max(0, Math.min(EVAL.length - 1, i));
    save();
    renderEvalQuestion();
  }

  async function submitEval() {
    const ev = state.eval;
    const empty = EVAL.map((q, i) => (q.id in ev.answers ? -1 : i)).filter(i => i > -1);
    if (empty.length) {
      renderEvalNav();
      empty.forEach(i => { const b = $(`#eval-nav [data-q="${i}"]`); if (b) b.classList.add('flag-empty'); });
      sfx('wrong');
      const go2 = await confirmDialog({
        title: 'Masih ada soal kosong',
        message: `Soal nomor ${empty.map(i => i + 1).join(', ')} belum dijawab. Semua soal wajib dijawab sebelum dikumpulkan.`,
        okText: `Ke soal nomor ${empty[0] + 1}`, cancelText: 'Tutup', tone: 'warn', iconName: 'flag'
      });
      if (go2) gotoEval(empty[0]);
      return;
    }
    const ok = await confirmDialog({
      title: 'Kumpulkan jawaban?',
      message: 'Setelah dikumpulkan, nilai akan langsung dihitung dan kamu bisa melihat pembahasan.',
      okText: 'Ya, kumpulkan', cancelText: 'Periksa lagi', iconName: 'flag'
    });
    if (!ok) return;
    const correct = EVAL.filter(q => ev.answers[q.id] === q.answer).length;
    const score = correct * 10;
    const prevBest = ev.best || 0;
    ev.submitted = true;
    ev.score = score;
    ev.best = Math.max(prevBest, score);
    save();
    /* XP evaluasi = selisih dengan nilai terbaik sebelumnya → tidak bisa "farming" XP. */
    if (score > prevBest) {
      state.awards['eval:best'] = (state.awards['eval:best'] || 0) + (score - prevBest);
      state.xp += score - prevBest;
      save();
      toast(`+${score - prevBest} XP · Nilai evaluasi terbaik baru`, 'zap');
    }
    setStars('eval', score >= 90 ? 3 : score >= 75 ? 2 : score >= 60 ? 1 : 0);
    completeModule('eval');
    checkBadges();
    updateHUD(true);
    renderResult(true);
    evalView('result');
    $('#t-kuis').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: motionReduced() ? 'auto' : 'smooth' });
  }

  function resultCategory(score) {
    if (score >= 90) return 'HTML Master! Luar biasa!';
    if (score >= 75) return 'Hebat! Kamu sudah memahami sebagian besar materi.';
    if (score >= 60) return 'Bagus! Pelajari kembali bagian yang masih sulit.';
    return 'Tetap semangat! Ayo pelajari kembali materi dan coba lagi.';
  }

  function renderResult(fresh = false) {
    const ev = state.eval;
    const score = ev.score || 0;
    const correct = score / 10;
    const pass = score >= 75;
    const starsN = score >= 90 ? 3 : score >= 75 ? 2 : score >= 60 ? 1 : 0;
    const wrongTopics = EVAL.filter(q => ev.answers[q.id] !== q.answer);
    const card = $('#eval-result');
    card.classList.toggle('win', pass);
    card.innerHTML = `
      <div class="result-left">
      <div class="result-top">
        <div class="mascot mascot-lg" data-mascot data-mood="${pass ? 'celebrate' : 'encourage'}"></div>
        <div class="score-ring" role="img" aria-label="Nilai akhir ${score} dari 100">
          <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" class="ring-bg"/><circle cx="60" cy="60" r="50" class="ring-fg" style="stroke:${pass ? '#22C55E' : score >= 60 ? '#FBBF24' : '#4F46E5'};stroke-dashoffset:314.16"/></svg>
          <div class="score-ring-text"><strong>${score}</strong><span>dari 100</span></div>
        </div>
      </div>
      <div class="result-stars" role="img" aria-label="${starsN} dari 3 bintang">${[0, 1, 2].map(i => icon('star', i < starsN ? 'on' : '')).join('')}</div>
      </div>
      <div class="result-right">
      <h3 class="result-cat">${resultCategory(score)}</h3>
      ${pass ? `<p class="appreciation">${icon('award')}Hebat! Kamu sudah paham tentang tag dasar HTML!</p>` : ''}
      <p class="result-msg">${pass
        ? 'Kamu berhasil menyelesaikan Final Mission. Pertahankan semangat belajarmu untuk materi HTML berikutnya!'
        : 'Nilai ini belum mencapai 75. Pelajari kembali bagian yang belum dikuasai di bawah ini, lalu coba lagi. Kamu pasti bisa!'}</p>
      <div class="result-stats">
        <span class="chip chip-ok">${icon('check-circle')}${correct} benar</span>
        <span class="chip chip-bad">${icon('x-circle')}${10 - correct} salah</span>
        <span class="chip chip-xp">${icon('trophy')}Nilai terbaik: ${ev.best}</span>
      </div>
      ${state.badges.master ? `<div class="result-badge"><div class="badge-art">${badgeSVG('master', true)}</div><div><strong>Lencana Master Struktur HTML</strong><span>Sudah kamu miliki.</span></div></div>`
        : pass && !state.done.gameA ? `<div class="result-badge"><div class="badge-art locked">${badgeSVG('master', false)}</div><div><strong>Satu langkah lagi!</strong><span>Selesaikan Game Susun Kerangka untuk membuka lencana Master Struktur HTML.</span></div></div>` : ''}
      ${!pass && wrongTopics.length ? `<div class="review-topics"><h4>Bagian yang perlu dipelajari lagi:</h4><ul>${
        Array.from(new Map(wrongTopics.map(q => [q.topic, q])).values()).map(q =>
          `<li><button type="button" class="btn btn-sm btn-secondary" data-study="${q.seg === null ? 'intro' : q.seg}">${icon('book')}${esc(q.topic)}</button></li>`).join('')
      }</ul></div>` : ''}
      <div class="action-row">
        <button type="button" class="btn btn-secondary" data-eval="review">${icon('book')}Pelajari Kesalahan</button>
        <button type="button" class="btn btn-primary" data-eval="retry">${icon('rotate')}Ulangi Kuis</button>
      </div>
      </div>`;
    mountMascots(card);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const fg = $('.score-ring .ring-fg', card);
      if (fg) fg.style.strokeDashoffset = String(314.16 * (1 - score / 100));
    }));
    if (fresh) {
      sfx(pass ? 'complete' : 'wrong');
      if (pass) { confetti(120); setTimeout(() => starBurst($('.score-ring', card)), 400); }
    }
  }

  let reviewIndex = 0;
  function renderReview() {
    const ev = state.eval;
    const onlyWrong = $('#review-wrong-only').checked;
    const items = EVAL.map((q, i) => ({ q, i, chosen: ev.answers[q.id], ok: ev.answers[q.id] === q.answer }))
      .filter(x => !onlyWrong || !x.ok);
    if (!items.length) {
      $('#review-list').innerHTML = `<div class="card review-empty">${icon('check-circle')}<p>Semua jawabanmu benar. Tidak ada kesalahan untuk dipelajari!</p></div>`;
      $('#review-pos').textContent = '0/0';
      $('#review-prev').disabled = true;
      $('#review-next').disabled = true;
      return;
    }
    reviewIndex = Math.max(0, Math.min(items.length - 1, reviewIndex));
    $('#review-pos').textContent = `${reviewIndex + 1}/${items.length}`;
    $('#review-prev').disabled = reviewIndex === 0;
    $('#review-next').disabled = reviewIndex === items.length - 1;
    $('#review-list').innerHTML = [items[reviewIndex]].map(({ q, i, chosen, ok }) => `
      <article class="card review-item ${ok ? 'right' : 'wrong'}">
        <h4>${icon(ok ? 'check-circle' : 'x-circle')}<span>Soal ${i + 1}. ${esc(q.prompt)}</span></h4>
        ${q.code ? `<div class="code-window q-code" style="margin-top:10px"><div class="code-body code-static">${codeBlock(q.code)}</div></div>` : ''}
        <div class="review-ans">
          <div><b>Jawabanmu:</b><span class="${ok ? 'is-good' : 'is-bad'}">${chosen === undefined ? '(kosong)' : `${'ABCD'[chosen]}. ${esc(q.options[chosen])}`} ${ok ? '✓ Benar' : '✗ Salah'}</span></div>
          ${ok ? '' : `<div><b>Jawaban benar:</b><span class="is-good">${'ABCD'[q.answer]}. ${esc(q.options[q.answer])}</span></div>`}
        </div>
        <p class="review-exp"><strong>Pembahasan:</strong> ${esc(q.explain)}</p>
        ${ok ? '' : `<button type="button" class="btn btn-sm btn-secondary" data-study="${q.seg === null ? 'intro' : q.seg}">${icon('book')}Buka materi: ${esc(q.topic)}</button>`}
      </article>`).join('');
  }

  function openReview() {
    const anyWrong = EVAL.some(q => state.eval.answers[q.id] !== q.answer);
    $('#review-wrong-only').checked = anyWrong;
    reviewIndex = 0;
    renderReview();
    evalView('review');
    $('#t-kuis').focus({ preventScroll: true });
  }

  async function retryEval() {
    const ok = await confirmDialog({
      title: 'Ulangi Final Mission?',
      message: 'Jawaban sebelumnya akan dihapus. Nilai terbaikmu tetap tersimpan.',
      okText: 'Ya, ulangi', cancelText: 'Batal', iconName: 'rotate'
    });
    if (!ok) return;
    state.eval = { ...state.eval, answers: {}, current: 0, started: true, submitted: false, score: null };
    save();
    renderEvalQuestion();
    evalView('run');
    $('#t-kuis').focus({ preventScroll: true });
  }

  function studyTopic(seg) {
    go('materi');
    setTimeout(() => {
      if (seg === 'intro') {
        setStage('materi', 0);
        say('materi-intro', 'Baca lagi pengertian dan kepanjangan HTML di sini ya.', 'think');
      } else {
        setStage('materi', 1);
        selectSegment(+seg);
      }
    }, 120);
  }

  /* ---------- Sistem langkah (stage): satu layar = satu fokus ---------- */
  const STAGE_CONFIG = {
    apersepsi: { next: 'materi', nextLabel: 'Lanjut ke Materi' },
    materi: { next: 'eksplorasi', nextLabel: 'Lanjut ke Eksplorasi' }
  };
  const stageIndex = {};
  const stageSeen = {};

  function initStages() {
    $$('[data-stages]').forEach(wrap => {
      const key = wrap.dataset.stages;
      stageIndex[key] = 0;
      stageSeen[key] = new Set([0]);
      $(`[data-stage-bar="${key}"]`).innerHTML = `
        <button type="button" class="btn btn-secondary" data-stage-prev="${key}" aria-label="Langkah sebelumnya">${icon('chevron-left')}<span class="hide-xs" aria-hidden="true">Sebelumnya</span></button>
        <div class="stage-info"><div class="stage-dots" aria-hidden="true"></div><span class="stage-label" aria-live="polite"></span></div>
        <button type="button" class="btn btn-primary" data-stage-next="${key}"><span>Berikutnya</span>${icon('chevron-right')}</button>`;
      setStage(key, 0, false);
    });
  }

  function setStage(key, i, focus = true) {
    const wrap = $(`[data-stages="${key}"]`);
    const stages = $$(':scope > .stage', wrap);
    i = Math.max(0, Math.min(stages.length - 1, i));
    stageIndex[key] = i;
    stageSeen[key].add(i);
    stages.forEach((st, j) => { st.hidden = j !== i; });
    const bar = $(`[data-stage-bar="${key}"]`);
    $('.stage-dots', bar).innerHTML = stages.map((_, j) => `<span class="${j === i ? 'on' : stageSeen[key].has(j) ? 'seen' : ''}"></span>`).join('');
    $('.stage-label', bar).textContent = `Langkah ${i + 1} dari ${stages.length} · ${stages[i].dataset.title}`;
    $('[data-stage-prev]', bar).disabled = i === 0;
    const last = i === stages.length - 1;
    $('[data-stage-next] span', bar).textContent = last ? STAGE_CONFIG[key].nextLabel : 'Berikutnya';
    if (focus) {
      sfx('click');
      const target = stages[i].querySelector('h3, legend, .bubble');
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    }
  }

  /* ==========================================================================
     13. PENGATURAN, DIALOG & INISIALISASI
     ========================================================================== */

  function openDialog(dlg) {
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); }
    else dlg.setAttribute('open', '');
  }

  function confirmDialog({ title, message, okText = 'Ya', cancelText = 'Batal', tone = '', iconName = 'info' }) {
    const dlg = $('#confirm-dialog');
    if (typeof dlg.showModal !== 'function') return Promise.resolve(window.confirm(`${title}\n\n${message}`));
    $('#confirm-title').textContent = title;
    $('#confirm-msg').textContent = message;
    $('#confirm-ok').textContent = okText;
    $('#confirm-cancel').textContent = cancelText;
    const ic = $('#confirm-icon');
    ic.className = 'dialog-icon' + (tone ? ' tone-' + tone : '');
    ic.innerHTML = icon(iconName);
    return new Promise(resolve => {
      dlg.returnValue = '';
      const onClose = () => { dlg.removeEventListener('close', onClose); resolve(dlg.returnValue === 'ok'); };
      dlg.addEventListener('close', onClose);
      dlg.showModal();
      $('#confirm-ok').focus();
    });
  }

  function applyMotion() {
    const pref = state.settings.motion;
    const sys = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reduce = pref === 'reduce' || (pref === 'system' && sys);
    document.documentElement.classList.toggle('reduce-motion', reduce);
  }

  function syncSettingsForm() {
    const s = state.settings;
    $('#set-music').checked = s.music;
    $('#set-sfx').checked = s.sfx;
    $('#set-music-vol').value = s.musicVol;
    $('#set-sfx-vol').value = s.sfxVol;
    $('#set-motion').value = s.motion;
  }

  function initSettings() {
    $$('[data-open-settings]').forEach(b => b.addEventListener('click', () => { syncSettingsForm(); openDialog($('#settings-dialog')); }));
    $('#set-music').addEventListener('change', e => {
      state.settings.music = e.target.checked;
      if (e.target.checked) state.settings.muted = false;
      save(); AudioEngine.syncMusic(); updateHUD(); updateWelcome();
    });
    $('#set-sfx').addEventListener('change', e => { state.settings.sfx = e.target.checked; save(); });
    $('#set-music-vol').addEventListener('input', e => { state.settings.musicVol = +e.target.value; AudioEngine.applyVolumes(); save(); });
    $('#set-sfx-vol').addEventListener('input', e => { state.settings.sfxVol = +e.target.value; AudioEngine.applyVolumes(); save(); });
    $('#set-test').addEventListener('click', () => {
      const prev = state.settings.muted;
      state.settings.muted = false;
      AudioEngine.ensure(); AudioEngine.applyVolumes();
      AudioEngine.synth('correct');
      state.settings.muted = prev;
      setTimeout(() => AudioEngine.applyVolumes(), 700);
    });
    $('#set-motion').addEventListener('change', e => { state.settings.motion = e.target.value; save(); applyMotion(); });
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) mq.addEventListener('change', applyMotion);
    }

    $('#btn-mute').addEventListener('click', () => {
      state.settings.muted = !state.settings.muted;
      save();
      AudioEngine.ensure();
      AudioEngine.syncMusic();
      updateHUD();
      toast(state.settings.muted ? 'Semua suara dimatikan' : 'Suara dinyalakan', state.settings.muted ? 'volume-x' : 'volume');
    });
    $('#welcome-music').addEventListener('click', () => {
      const on = !(state.settings.music && !state.settings.muted);
      state.settings.music = on;
      if (on) state.settings.muted = false;
      save();
      AudioEngine.ensure();
      AudioEngine.syncMusic();
      updateWelcome();
      updateHUD();
    });
  }

  async function exitApp() {
    const ok = await confirmDialog({
      title: 'Keluar ke layar pembuka?',
      message: 'Tenang, progres dan poinmu tetap tersimpan di browser ini.',
      okText: 'Ya, keluar', cancelText: 'Tetap belajar', iconName: 'logout'
    });
    if (ok) { AudioEngine.syncMusic(); showWelcome(); }
  }

  async function resetProgress() {
    const ok = await confirmDialog({
      title: 'Reset semua progres?',
      message: 'XP, bintang, lencana, jawaban, dan kode lab akan dihapus. Tindakan ini tidak bisa dibatalkan.',
      okText: 'Ya, reset', cancelText: 'Batal', tone: 'danger', iconName: 'rotate'
    });
    if (!ok) return;
    const settings = state.settings;
    state = defaultState();
    state.settings = settings;
    state.started = true;
    save();
    selectedCard = null;
    gameALocked = false;
    editor().value = LAB_STARTER;
    renderAll();
    toast('Progres berhasil direset', 'rotate');
    go('home');
  }

  function renderAll() {
    renderNav();
    updateHUD();
    renderApersepsi();
    if (!state.apersepsi.correct) $('#apersepsi-feedback').hidden = true;
    $('#apersepsi-next').hidden = !state.apersepsi.correct;
    $('#apersepsi-retry').hidden = true;
    $('#btn-peek').hidden = !state.apersepsi.correct;
    if (!state.apersepsi.correct) { $('#card-a').classList.remove('is-chosen-ok'); $('#mini-a').classList.remove('is-ok'); }
    $('#peek-layer').hidden = true;
    renderMateri();
    $('#quick-feedback').hidden = true;
    state.lab.current = Math.min(state.lab.current, MISSIONS.length - 1);
    renderMissions();
    $('#lab-feedback').hidden = true;
    syncEditor();
    $('#solution-code').innerHTML = codeBlock(LAB_SOLUTION.split('\n'));
    gameALocked = state.done.gameA && state.gameA.placed.every((id, i) => id === CARDS[i].id);
    renderGameA();
    $('#gameA-feedback').hidden = true;
    if (gameALocked) setFeedback($('#gameA-feedback'), 'ok', 'Game ini sudah kamu selesaikan!', 'Tekan "Ulangi" untuk bermain lagi (poin hanya diberikan sekali).');
    renderPractice();
    renderGameHUD();
    renderHome();
    updateWelcome();
  }

  function bindEvents() {
    $('#btn-start').addEventListener('click', () => {
      AudioEngine.ensure();
      AudioEngine.syncMusic();
      sfx('click');
      enterApp(true);
    });

    /* Delegasi klik global: navigasi, tombol "data-go", aksi */
    document.addEventListener('click', e => {
      const routeBtn = e.target.closest('[data-route]');
      if (routeBtn && routeBtn.matches('button')) { go(routeBtn.dataset.route); return; }
      const goBtn = e.target.closest('[data-go]');
      if (goBtn) {
        const tab = goBtn.dataset.tab;
        go(goBtn.dataset.go);
        if (tab) selectTab(tab);
        return;
      }
      const action = e.target.closest('[data-action]');
      if (action) {
        if (action.dataset.action === 'exit') exitApp();
        if (action.dataset.action === 'welcome') showWelcome();
        return;
      }
      const sPrev = e.target.closest('[data-stage-prev]');
      if (sPrev) { setStage(sPrev.dataset.stagePrev, stageIndex[sPrev.dataset.stagePrev] - 1); return; }
      const sNext = e.target.closest('[data-stage-next]');
      if (sNext) {
        const key = sNext.dataset.stageNext;
        const n = $$(`[data-stages="${key}"] > .stage`).length;
        if (stageIndex[key] >= n - 1) go(STAGE_CONFIG[key].next);
        else setStage(key, stageIndex[key] + 1);
        return;
      }
      const study = e.target.closest('[data-study]');
      if (study) { studyTopic(study.dataset.study); return; }
      const evBtn = e.target.closest('[data-eval]');
      if (evBtn) {
        if (evBtn.dataset.eval === 'review') openReview();
        if (evBtn.dataset.eval === 'retry') retryEval();
      }
    });

    window.addEventListener('hashchange', () => {
      const r = location.hash.replace('#/', '');
      if (ROUTE_IDS.includes(r)) showScreen(r);
      else if (!location.hash) showWelcome();
    });

    /* Home */
    $('#btn-continue').addEventListener('click', () => {
      const next = nextRoute();
      if (next) { go(next.route); if (next.tab) selectTab(next.tab); }
      else go('kuis');
    });
    $('#btn-reset').addEventListener('click', resetProgress);

    /* Apersepsi */
    $('#apersepsi-options').addEventListener('click', e => {
      const b = e.target.closest('.option');
      if (b && !b.disabled) answerApersepsi(+b.dataset.i);
    });
    $('#apersepsi-retry').addEventListener('click', retryApersepsi);
    $('#apersepsi-next').addEventListener('click', () => go('materi'));
    $('#btn-peek').addEventListener('click', () => {
      $('#peek-layer').hidden = false;
      setStage('apersepsi', 0);
      say('apersepsi-observe', 'Setiap bagian ditandai elemen HTML: h1 judul, p paragraf, h2 subjudul, ul-li daftar.', 'happy');
    });

    /* Materi */
    $('#materi-code').addEventListener('click', e => {
      const l = e.target.closest('.code-line');
      if (l) { selectSegment(LINE_TO_SEGMENT[+l.dataset.line]); sfx('click'); }
    });
    $('#explain-prev').addEventListener('click', () => selectSegment(segIndex - 1));
    $('#explain-next').addEventListener('click', () => {
      if (segIndex === SEGMENTS.length - 1) setStage('materi', 2);
      else selectSegment(segIndex + 1);
    });
    $('#materi-run').addEventListener('click', runMateri);
    $('#materi-copy').addEventListener('click', async e => {
      const ok = await copyText(MATERI_CODE.join('\n'));
      const span = e.currentTarget.querySelector('span');
      span.textContent = ok ? 'Tersalin!' : 'Gagal menyalin';
      toast(ok ? 'Kode berhasil disalin' : 'Browser tidak mengizinkan menyalin otomatis', ok ? 'check-circle' : 'info');
      setTimeout(() => { span.textContent = 'Salin Kode'; }, 1800);
    });
    $('#quick-list').addEventListener('click', e => {
      const b = e.target.closest('[data-place]');
      if (b) answerQuick(b.closest('.quick-item').dataset.q, b.dataset.place);
    });

    /* Lab */
    $('#mission-strip').addEventListener('click', e => {
      const t = e.target.closest('.mission-tab');
      if (t) selectMission(+t.dataset.mission);
    });
    $('#lab-check').addEventListener('click', checkMission);
    $('#lab-run').addEventListener('click', () => runLab(true));
    $('#lab-reset').addEventListener('click', async () => {
      const ok = await confirmDialog({ title: 'Reset kode?', message: 'Kode di editor akan dikembalikan ke kode awal. Misi yang sudah selesai tetap tersimpan.', okText: 'Ya, reset kode', iconName: 'rotate' });
      if (!ok) return;
      editor().value = LAB_STARTER;
      state.lab.code = LAB_STARTER;
      save();
      syncEditor();
      runLab(false);
      say('lab', 'Kode sudah kembali seperti semula. Ayo coba lagi!', 'think');
    });
    $('#lab-hint').addEventListener('click', () => {
      const m = MISSIONS[state.lab.current];
      say('lab', m.hint, 'think');
      setFeedback($('#lab-feedback'), 'info', 'Petunjuk', m.hint);
    });
    $('#lab-solution').addEventListener('click', () => openDialog($('#solution-dialog')));
    $('#lab-view-code').addEventListener('click', () => setLabView('code'));
    $('#lab-view-preview').addEventListener('click', () => { runLab(false); setLabView('preview'); });
    $('#btn-info').addEventListener('click', () => openDialog($('#info-dialog')));

    /* Game */
    $('#tab-a').addEventListener('click', () => selectTab('a'));
    $('#tab-b').addEventListener('click', () => selectTab('b'));
    $('.tabs').addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const toB = $('#tab-a').getAttribute('aria-selected') === 'true';
        selectTab(toB ? 'b' : 'a');
        $(toB ? '#tab-b' : '#tab-a').focus();
      }
    });
    $('#gameA-check').addEventListener('click', checkGameA);
    $('#gameA-hint').addEventListener('click', hintGameA);
    $('#gameA-reset').addEventListener('click', resetGameA);
    $('#practice-card').addEventListener('click', e => {
      const b = e.target.closest('.option');
      if (b && !b.disabled) { answerPractice(+b.dataset.i); return; }
      if (e.target.closest('#practice-next')) nextPractice();
      if (e.target.closest('#practice-retry')) retryPractice();
    });

    /* Evaluasi */
    $('#eval-start').addEventListener('click', startEval);
    $('#eval-see-result').addEventListener('click', () => { renderResult(); evalView('result'); });
    $('#eval-card').addEventListener('click', e => {
      const b = e.target.closest('.option');
      if (b) chooseEval(+b.dataset.i);
    });
    $('#eval-nav').addEventListener('click', e => {
      const b = e.target.closest('[data-q]');
      if (b) gotoEval(+b.dataset.q);
    });
    $('#eval-prev').addEventListener('click', () => gotoEval(state.eval.current - 1));
    $('#eval-next').addEventListener('click', () => gotoEval(state.eval.current + 1));
    $('#eval-submit').addEventListener('click', submitEval);
    $('#review-wrong-only').addEventListener('change', () => { reviewIndex = 0; renderReview(); });
    $('#review-prev').addEventListener('click', () => { reviewIndex--; renderReview(); });
    $('#review-next').addEventListener('click', () => { reviewIndex++; renderReview(); });
    $('#review-back').addEventListener('click', () => { renderResult(); evalView('result'); $('#t-kuis').focus({ preventScroll: true }); });
    $('#review-retry').addEventListener('click', retryEval);
  }

  function init() {
    hydrateIcons();
    mountMascots();
    applyMotion();
    initEditor();
    initDrag();
    initSettings();
    initStages();
    bindEvents();
    renderAll();
    selectTab('a');

    const r = location.hash.replace('#/', '');
    if (state.started && ROUTE_IDS.includes(r)) enterApp(true);
    else showWelcome();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
