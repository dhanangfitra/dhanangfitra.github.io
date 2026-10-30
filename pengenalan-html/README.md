# Pengenalan Struktur Dasar HTML
### Misi Pertamamu Menjadi Web Developer!

Media pembelajaran interaktif berbasis web untuk **SMK Kelas XI · Fase F · Pembuatan Web Statis**.
Dibangun dengan HTML5, CSS3, dan JavaScript murni: tanpa framework, tanpa proses build.

---

## 1. Struktur folder

```
pengenalan-html/
├── index.html                 ← halaman utama (6 halaman dalam satu aplikasi)
├── README.md                  ← dokumen ini
├── css/
│   └── style.css              ← seluruh gaya, animasi, dan tata letak responsif
├── js/
│   └── app.js                 ← logika aplikasi, data materi, soal, game, audio
└── assets/
    ├── images/
    │   ├── logo.svg           ← logo aplikasi (tag </>)
    │   ├── cursor-pintar.svg  ← maskot Cursor Pintar (versi statis)
    │   ├── hero-coding.svg    ← ilustrasi laptop + kode HTML
    │   ├── web-rapi.svg       ← mockup Halaman A (rapi)
    │   └── web-berantakan.svg ← mockup Halaman B (membingungkan)
    └── audio/
        └── BACA-SAYA.txt      ← petunjuk menambahkan file mp3 (opsional)
```

Semua ilustrasi adalah SVG orisinal. Maskot interaktif (dengan 5 ekspresi) dibuat
langsung oleh `app.js`, dan ikon memakai SVG bergaya Lucide yang disematkan langsung,
sehingga tidak ada library ikon eksternal.

## 2. Cara menjalankan

**Cara paling mudah:** klik dua kali `index.html` dan aplikasi terbuka di browser
(Chrome, Edge, Firefox, atau Safari versi terbaru).

**Cara yang disarankan untuk kelas** (agar penyimpanan progres & salin kode paling andal):

```bash
# dari dalam folder pengenalan-html
python -m http.server 8000
# lalu buka http://localhost:8000
```

Atau gunakan ekstensi **Live Server** di VS Code.

> **Offline?** Aplikasi tetap berjalan penuh. Font Plus Jakarta Sans dimuat dari Google Fonts;
> jika tidak ada internet, otomatis diganti font sistem.

## 3. Audio

- **Musik latar & efek suara sudah berfungsi tanpa file apa pun**, karena dibuat oleh
  Web Audio API (progresi akor lembut C–Am–F–G, bunyi benar/salah/selesai).
- Audio **tidak pernah diputar otomatis**. Musik hanya menyala setelah siswa menekan tombol
  *Musik* atau menyalakannya di *Pengaturan*. Bawaan: musik mati, efek suara nyala.
- Tombol speaker di topbar mematikan semua suara. Volume musik & efek bisa diatur terpisah.
- Ingin memakai mp3 sendiri? Ikuti `assets/audio/BACA-SAYA.txt`
  (letakkan file → ubah `useFiles: true` di `js/app.js`). Jika file gagal dimuat,
  aplikasi otomatis kembali ke suara Web Audio.

## 4. Tampilan satu layar penuh

Setiap halaman dirancang **pas satu layar tanpa scroll**, di laptop, tablet, maupun HP:

- Materi yang panjang dipecah menjadi **langkah-langkah** (Apersepsi 2 langkah, Materi 3 langkah)
  dengan titik progres dan tombol *Sebelumnya / Berikutnya*.
- Pratinjau browser materi, contoh hasil Lab, serta Tujuan & Panduan Guru muncul sebagai **pop-up**.
- Di HP, Lab memakai tombol **Kode / Hasil di Browser** (menekan *Jalankan* otomatis menampilkan hasil).
- Pembahasan kuis ditampilkan **satu soal per layar**.
- Diuji pas di 1366×650 (laptop + bar browser), 1280×720, 1920×1080, 768×1024 (tablet), 390×844, dan 360×740 (HP).
- Pada layar yang sangat pendek (misalnya HP posisi mendatar), halaman tetap tidak bergulir.
  Sebagai pengaman, isi kartu boleh digeser di dalam kartunya sendiri.

## 5. Fitur yang sudah berfungsi

| Halaman | Fitur |
|---|---|
| **1. Pembuka** | Judul beranimasi, tag HTML melayang, maskot melambai, tombol musik & pengaturan, info progres tersimpan |
| **2. Apersepsi** | Dua mockup web (rapi vs berantakan), 3 pilihan jawaban, umpan balik + ekspresi maskot, *Coba Lagi*, +20 XP, tombol *Intip Struktur HTML-nya* |
| **3. Materi** | Pengertian HTML, editor dengan syntax highlighting, klik baris → penjelasan & sorotan, label warna (pembungkus / informasi / konten), Sebelumnya–Berikutnya, *Jalankan Kode* ke browser mini, *Salin Kode*, **Cek Cepat head vs body** |
| **4. Lab HTML** | Editor dengan nomor baris & pewarnaan, pratinjau iframe terisolasi, 5 misi bertahap (terkunci → terbuka), *Periksa Jawaban* berbasis posisi kursor & DOMParser, pemeriksa struktur otomatis, *Jalankan / Reset Kode / Petunjuk / Tampilkan Hasil* |
| **5. Game** | **Game A:** susun 9 kartu kerangka dengan seret-lepas (mouse & sentuh) **atau** ketuk kartu → ketuk slot (juga keyboard), penanda benar/salah per slot, petunjuk bertahap, ulangi. **Game B:** 6 soal latihan bertingkat (Mudah → Menantang) dengan pembahasan & ringkasan skor |
| **6. Evaluasi** | 10 soal, navigasi nomor soal, jawaban tersimpan otomatis, cegah kumpul kosong, skor otomatis (10/soal), 4 kategori hasil, pesan apresiasi ≥ 75, confetti & bintang, *Pelajari Kesalahan* (filter yang salah + tautan ke materi terkait), *Ulangi Kuis* |

**Gamifikasi:** XP, 8 bintang, progress bar, lencana *Penjelajah HTML* & *Master Struktur HTML*,
dashboard ringkas, tersimpan di `localStorage`. XP hanya diberikan **sekali per pencapaian**;
XP evaluasi = selisih dengan nilai terbaik, sehingga mengulang tidak bisa menambah poin secara curang.
Tidak ada pengurangan poin saat salah.

**Keamanan pratinjau Lab:** kode siswa diurai dengan DOMParser; `<script>`, `<iframe>`,
`<object>`, atribut `on*`, dan URL `javascript:` dibuang; hasilnya ditampilkan di
`<iframe sandbox="">` (tanpa izin skrip) ditambah Content-Security-Policy ketat.

**Aksesibilitas:** navigasi keyboard penuh, fokus terlihat, *skip link*, label ARIA,
status benar/salah memakai ikon + teks (bukan hanya warna), opsi *Kurangi animasi*
(mengikuti `prefers-reduced-motion` atau dipilih manual).

## 6. Untuk guru

- Navigasi bebas: guru bisa langsung membuka bagian mana pun dari menu.
- Saran alur 2 × 45 menit tersedia di Dashboard → tombol *Tujuan & Panduan Guru*.
- Progres disimpan per browser. Tekan **Reset Progres** (Dashboard) sebelum perangkat dipakai siswa lain.
- Mengubah soal: edit array `PRACTICE` (latihan) dan `EVAL` (evaluasi) di `js/app.js`.
  Indeks `answer` dimulai dari 0 (A = 0, B = 1, C = 2, D = 3).

## 7. Checklist pengujian (sudah diuji otomatis di Chromium, desktop 1366px & mobile 360px)

- [x] Enam halaman utama tersedia dan saling terhubung
- [x] Navigasi sidebar (desktop) & navigasi bawah (mobile) berpindah ke bagian yang benar
- [x] Keluar menampilkan dialog konfirmasi lalu kembali ke layar pembuka
- [x] Apersepsi: jawaban salah → umpan balik + Coba Lagi, benar → +20 XP
- [x] Kode materi dijalankan di panel pratinjau (judul tab & isi body tampil)
- [x] Lab: 5 misi terdeteksi benar/salah; tab browser berubah menjadi "Profil Saya"
- [x] Skrip yang diketik siswa **tidak** dieksekusi; atribut `onerror` dibuang
- [x] Game susun kerangka dapat dimainkan dengan seret mouse dan ketukan layar sentuh
- [x] Seluruh kunci jawaban diverifikasi; skor 9 benar = 90, kategori "HTML Master"
- [x] Kumpul dengan soal kosong dicegah
- [x] Klik berulang tidak menambah XP; skor ulang yang lebih rendah tidak mengubah XP
- [x] Ulangi Kuis & Pelajari Kesalahan berfungsi
- [x] Lencana terbuka sesuai syarat
- [x] Progres pulih setelah halaman dimuat ulang
- [x] Tombol mute & pengaturan volume berfungsi
- [x] Setiap halaman & langkah pas satu layar tanpa scroll di 6 ukuran layar
- [x] Tidak ada tautan aset rusak & tidak ada error JavaScript
