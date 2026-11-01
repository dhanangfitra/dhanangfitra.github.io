==============================================================================
               JELAJAH HTML — RPG 2D KOTA WEBTOPIA
        Game Edukasi Struktur Dasar HTML5 (Pembuatan Web Statis)
==============================================================================

  Dibuat Oleh  : Dhanang Fitra Riaji, M.T.
  Materi       : Pembuatan Web Statis — Struktur Dasar HTML5
  Sasaran      : Peserta didik SMK Kelas XI (Fase F)
  Bentuk       : Game RPG 2D bergaya piksel, satu file, bisa dimainkan
                 tanpa internet (offline)


DAFTAR ISI
  1.  Tentang Game
  2.  Isi Paket
  3.  Kebutuhan Perangkat
  4.  Cara Menjalankan
  5.  Tampilan Layar Penuh dan Zoom Layar
  6.  Kontrol Permainan
  7.  Layar Judul dan Memulai Permainan
  8.  Tampilan Saat Bermain (HUD)
  9.  Peta Kota Webtopia
  10. Tokoh dan Lokasi
  11. Alur Permainan (Prolog, Level, dan Misi)
  12. Jenis Aktivitas
  13. Aturan Skor, Nyawa, Bintang, dan Lencana
  14. Penanda Misi Selesai
  15. Laporan Akhir
  16. Penyimpanan Progres dan Mulai Ulang
  17. Pengaturan Suara dan Tampilan
  18. Aksesibilitas
  19. Panduan untuk Guru (Mengganti Materi)
  20. Saran Penggunaan di Kelas
  21. Mengatasi Masalah (Troubleshooting)
  22. Informasi dan Kredit


------------------------------------------------------------------------------
1. TENTANG GAME
------------------------------------------------------------------------------

  Jelajah HTML adalah game petualangan edukatif. Pemain berperan sebagai
  "Dev Muda" yang menjelajahi Kota Webtopia, sebuah kota yang tata letaknya
  meniru susunan dokumen HTML:

    Gerbang DOCTYPE (paling atas)
      └─ Menara HTML (pembungkus seluruh kota)
           ├─ Kawasan <head>  (bagian atas: Ruang Arsip Head, Kios Tab Title)
           └─ Kawasan <body>  (bagian bawah: Taman Body)

  Sambil berjalan, berbicara dengan warga, dan menyelesaikan misi, peserta
  didik mempelajari:
    - pengertian dan fungsi HTML dalam pembuatan web statis,
    - elemen dasar dokumen: <!DOCTYPE html>, <html>, <head>, <title>,
      <meta>, dan <body>,
    - perbedaan isi bagian <head> dan <body>,
    - urutan penyusunan struktur dasar dokumen HTML5 yang benar,
    - cara menemukan dan memperbaiki kesalahan (bug) struktur HTML.

  Setiap misi dibuka berurutan. Materi diberikan lewat dialog dan kartu
  materi singkat, lalu langsung dipraktikkan dalam aktivitas interaktif.


------------------------------------------------------------------------------
2. ISI PAKET
------------------------------------------------------------------------------

  index.html   Seluruh game dalam SATU file: HTML, CSS, JavaScript, gambar,
               font judul, musik, dan efek suara. Tidak membutuhkan internet,
               server, instalasi, atau file tambahan apa pun.
  README.txt   Dokumen petunjuk ini.


------------------------------------------------------------------------------
3. KEBUTUHAN PERANGKAT
------------------------------------------------------------------------------

  Perangkat  : Laptop/komputer, tablet, atau HP (Android/iOS).
  Browser    : Google Chrome, Microsoft Edge, Mozilla Firefox, Safari
               (macOS & iOS), atau Samsung Internet versi dua tahun terakhir.
  Layar      : Bebas. Game mengisi penuh layar di semua ukuran. Paling
               nyaman pada posisi mendatar (landscape).
  Internet   : Tidak diperlukan.
  Suara      : Opsional (speaker atau earphone).
  Ukuran     : Sekitar 300 KB.


------------------------------------------------------------------------------
4. CARA MENJALANKAN
------------------------------------------------------------------------------

  A. Laptop / Komputer
     1. Simpan index.html di folder mana saja (misalnya Desktop).
     2. Klik dua kali index.html. Game langsung terbuka di browser.
     3. Agar lebih imersif, klik tombol layar penuh di HUD (ikon kotak
        di kanan atas) atau tekan F11.

  B. HP / Tablet
     1. Salin index.html ke HP (lewat kabel USB, Bluetooth, Google Drive,
        WhatsApp, atau aplikasi lain).
     2. Buka file dengan Chrome, Safari, atau Samsung Internet.
        Tips Android: buka aplikasi "File"/"Files", ketuk index.html, lalu
        pilih Chrome.
     3. Putar HP ke posisi mendatar (landscape). Jika HP dalam posisi tegak,
        game menampilkan anjuran untuk memutar layar (bisa ditutup).

  C. LMS (Google Classroom, Moodle, dan lainnya)
     - Unggah index.html apa adanya. Peserta didik mengunduh lalu membukanya
       di browser. Tidak ada file lain yang perlu disertakan.

  D. Jaringan sekolah / server lokal (opsional)
     - index.html juga bisa diletakkan di web server mana pun (misalnya
       XAMPP, server sekolah, atau hosting statis) dan dibuka lewat alamat
       URL-nya.


------------------------------------------------------------------------------
5. TAMPILAN LAYAR PENUH DAN ZOOM LAYAR
------------------------------------------------------------------------------

  Layar penuh tanpa sisi kosong
  - Tampilan game selalu mengisi penuh seluruh halaman browser, baik di
    desktop maupun HP. Tidak ada bagian kosong di sisi kiri dan kanan.
  - Pada layar lebar (misalnya monitor 21:9), kota terlihat lebih luas ke
    samping. Pada layar lebih tinggi (misalnya tablet 4:3), kota terlihat
    lebih luas ke atas-bawah.
  - Tombol HUD dan kontrol sentuh otomatis menjauh dari poni/notch HP.
  - Layar penuh sesungguhnya (tanpa bilah browser): tombol layar penuh di
    HUD atau F11 di komputer.

  Zoom layar (memperbesar/memperkecil tampilan kota)
  - Tombol di HUD kanan atas:  [ − ]  [ 100% ]  [ + ]
      −      = perkecil (melihat area kota lebih luas)
      +      = perbesar (tokoh dan bangunan tampak lebih besar)
      100%   = klik untuk kembali ke ukuran normal
  - Keyboard   : tombol + (atau =) memperbesar, tombol − memperkecil,
                 tombol 0 mengembalikan ke 100%.
  - Mouse      : putar roda mouse di atas kota.
  - Layar sentuh: cubit dengan dua jari (pinch) di area kota.
  - Pengaturan : menu Pengaturan > "Zoom Layar" (penggeser 80%–175%).
  - Besar zoom tersimpan otomatis dan dipakai lagi saat game dibuka.

  Zoom halaman materi (memperbesar tulisan dialog, kartu materi, soal,
  hasil, laporan, dan jendela informasi)
  - Setiap halaman materi punya tombol  [ − ]  [ 100% ]  [ + ]  sendiri:
      di kotak dialog (kanan atas kotak), di kepala panel Aktivitas
      Developer (di samping nyawa), dan di Laporan Akhir.
  - Rentang 80%–150%. Klik angka persen untuk kembali ke 100%.
  - Keyboard   : + / − / 0 saat halaman materi terbuka.
  - Mouse      : Ctrl + putar roda mouse di halaman materi.
  - Layar sentuh: cubit dua jari di halaman materi.
  - Pengaturan : menu Pengaturan > "Zoom Materi".
  - Pada zoom 120% ke atas, kolom maskot disembunyikan agar materi punya
    ruang lebih luas. Jika isi tidak muat, geser (scroll) ke bawah. Saat
    menyeret kartu ke tepi bawah/atas, halaman ikut bergulir otomatis.
  - Zoom kota dan zoom materi diatur terpisah dan sama-sama tersimpan.


------------------------------------------------------------------------------
6. KONTROL PERMAINAN
------------------------------------------------------------------------------

  Keyboard
    W A S D / tombol panah   berjalan
    E                        bicara dengan warga (NPC) terdekat
    M                        buka Peta Petualangan
    + / − / 0                zoom perbesar / perkecil / kembali 100%
                             (kota saat berjalan, materi saat halaman
                             materi terbuka)
    Spasi / Enter            percepat tulisan dialog atau lanjut dialog
    Tab, Shift+Tab           pindah fokus tombol atau kartu
    Enter                    pilih tombol atau kartu yang sedang difokus
    Esc                      tutup jendela atau peta

  Layar sentuh (HP/tablet)
    Joystick (kiri bawah)       geser untuk berjalan
    Tombol "Sentuh/Bicara"      muncul di kanan bawah saat dekat warga
    Cubit dua jari              zoom kota, atau zoom materi saat halaman
                                materi terbuka
    Tombol joystick di HUD      tampilkan/sembunyikan kontrol sentuh

  Mouse
    Klik tombol, pilihan jawaban, dan kartu. Roda mouse untuk zoom kota.

  Aktivitas seret-lepas (drag & drop) bisa dimainkan dengan tiga cara:
    1. seret kartu ke tujuan,
    2. ketuk/klik kartu, lalu ketuk/klik tujuannya,
    3. keyboard: Tab ke kartu, Enter, lalu Tab ke tujuan dan Enter.


------------------------------------------------------------------------------
7. LAYAR JUDUL DAN MEMULAI PERMAINAN
------------------------------------------------------------------------------

  Layar judul menampilkan tokoh utama, Cursor Pintar, matahari yang
  bersinar, awan yang bergerak, dan tag HTML yang melayang (<html>, <head>,
  <title>, <body>, </>). Tombol yang tersedia:

    Mulai        memulai petualangan baru
    Lanjutkan    muncul jika ada progres tersimpan, melanjutkan permainan
    Panduan      cara bermain singkat
    Pengaturan   volume musik, efek suara, dan zoom layar

  Setelah menekan Mulai:
    1. Tulis nama (minimal 2 huruf).
    2. Pilih tokoh Dev Muda: laki-laki atau perempuan.
    3. Tekan tombol untuk masuk ke Kota Webtopia.


------------------------------------------------------------------------------
8. TAMPILAN SAAT BERMAIN (HUD)
------------------------------------------------------------------------------

  Kiri atas
    Papan Misi     tahap/level, judul misi, dan instruksi yang harus
                   dilakukan sekarang.
    Panduan Arah   kompas yang menunjuk lokasi tujuan beserta jaraknya.
                   Di dunia juga ada panah kuning di sekitar tokoh.

  Kanan atas
    ❤️ 3/3         sisa nyawa pada misi yang sedang dikerjakan
    🏅 skor        total skor saat ini
    [− 100% +]     zoom layar
    Baris tombol:
      Joystick       tampil/sembunyikan kontrol sentuh
      Peta (M)       buka Peta Petualangan
      ?  Panduan     cara bermain
      i  Info Materi informasi materi dan pembuat, serta tombol mulai ulang
      Trofi          Laporan Akhir (muncul setelah semua misi selesai)
      Musik          nyala/matikan musik latar
      Speaker        nyala/matikan efek suara
      Penggeser      Pengaturan (volume dan zoom)
      Kotak          layar penuh
    Daftar Misi    panel kayu berisi Prolog dan 8 misi beserta statusnya
                   (klik judul panel untuk melipat/membuka).

  Di dunia
    "!" kuning di atas warga  = warga yang harus ditemui untuk misi sekarang
    ✓ hijau di atas warga     = misi warga tersebut sudah selesai
    Papan nama kayu bangunan  = nama lokasi (diberi ✓ jika misinya selesai)


------------------------------------------------------------------------------
9. PETA KOTA WEBTOPIA
------------------------------------------------------------------------------

  Kota bergaya fantasi piksel: pegunungan bersalju di utara, sungai dengan
  jembatan kayu di timur, danau di selatan, kincir angin, rumah warga,
  kastel Gerbang DOCTYPE, Menara HTML, Taman Body dengan air mancur, dan
  Arena Final berbentuk koloseum.

  Peta Petualangan (tombol peta atau M) menampilkan:
    - seluruh kota dengan papan nama setiap lokasi,
    - ★ dan sorotan kuning  = tujuan misi saat ini,
    - titik biru            = posisi kamu,
    - ✓ hijau               = lokasi yang misinya sudah selesai,
    - kompas mata angin (U, S, B, T),
    - panel Daftar Misi lengkap per level.


------------------------------------------------------------------------------
10. TOKOH DAN LOKASI
------------------------------------------------------------------------------

  Tokoh utama
    Dev Muda (pilih laki-laki atau perempuan), bergaya piksel: topi "HTML"
    biru tua bertepi oranye, jaket biru tua, hoodie oranye, kaos bergaris,
    celana pendek abu-abu, ransel, dan sepatu oranye. Versi perempuan
    berkuncir kuda.

  Mentor
    Cursor Pintar — kursor ramah yang memandu sejak Prolog.

  Warga (NPC) dan lokasinya
    Bu Rina       Pustakawan        Perpustakaan Kode   (membawa buku HTML)
    Pak Doktipe   Penjaga Gerbang   Gerbang DOCTYPE     (kunci gerbang)
    Kak Hana      Arsitek           Menara HTML         (helm & cetak biru)
    Mas Meta      Petugas Arsip     Ruang Arsip Head    (map <meta>)
    Dik Tia       Pemilik Kios      Kios Tab Title      (papan <title>)
    Bang Bodi     Pengelola Taman   Taman Body          (alat siram)
    Mbak Kode     Kepala Bengkel    Bengkel Kerangka    (kunci pas & headset)
    Profesor Bug  Juri Arena Final  Laboratorium Bug, lalu Arena Final
                                    (kaca pembesar & kumbang)

  Lokasi lain
    Studio Web    tempat Cursor Pintar dan Prolog
    Gerbang Kota  tempat tokoh pertama kali muncul (bagian bawah peta)


------------------------------------------------------------------------------
11. ALUR PERMAINAN (PROLOG, LEVEL, DAN MISI)
------------------------------------------------------------------------------

  PROLOG — Studio Web (Cursor Pintar)
    Perkenalan dan pemanasan (apersepsi): membandingkan web yang rapi dan
    berantakan. Tidak mengurangi nyawa.

  LEVEL 1 — Mengenal HTML
    Misi 1  Rahasia Nama HTML        Perpustakaan Kode · Bu Rina      TP1
            Pengertian dan fungsi HTML (kuis pilihan ganda).
    Misi 2  Gerbang dan Menara       Pak Doktipe, lalu Kak Hana       TP2
            Mengenal <!DOCTYPE html> dan <html> (mencocokkan).

  LEVEL 2 — Kepala dan Badan Dokumen
    Misi 3  Arsip Rahasia Dokumen    Ruang Arsip Head · Mas Meta      TP2, TP4
            Memilah isi yang tepat untuk <head> dan <body>.
    Misi 4  Kios Tab Title           Kios Tab Title · Dik Tia         TP2
            Fungsi <title> (pilih baris kode + kuis).
    Misi 5  Taman Konten             Taman Body · Bang Bodi           TP2, TP4
            Konten yang tampil di halaman melalui <body> (kuis).

  LEVEL 3 — Rakit Halaman Pertama
    Misi 6  Bengkel Kerangka         Bengkel Kerangka · Mbak Kode     TP3
            Menyusun kerangka dokumen HTML5 dengan urutan benar.
    Misi 7  Pemburu Bug              Laboratorium Bug · Profesor Bug  TP3, TP4
            Menemukan baris kode yang salah dan memilih alasannya.
    Misi 8  Final Mission            Arena Final · Profesor Bug       TP1–TP5
            Evaluasi akhir: 10 soal dari seluruh materi.

  AKHIR — Laporan Akhir Petualangan.

  Setiap misi berpola sama: temui warga → dialog → kartu materi →
  aktivitas → hasil (skor dan bintang) → misi berikutnya terbuka.
  Misi yang belum terbuka dijaga warga dengan pesan "selesaikan misi
  sebelumnya dulu".


------------------------------------------------------------------------------
12. JENIS AKTIVITAS
------------------------------------------------------------------------------

  Pilihan ganda   pilih satu jawaban; ada penjelasan setelah menjawab.
  Mencocokkan     pasangkan tag dengan fungsinya.
  Memilah         seret kartu ke keranjang <head> atau <body>.
  Pilih baris     klik baris kode yang diminta, lalu jawab pertanyaan.
  Mengurutkan     susun kartu tag ke slot sesuai urutan dokumen HTML5.
  Berburu bug     temukan baris yang salah dan pilih alasan kesalahannya.
                  Tombol Petunjuk tersedia (pada misi tertentu tanpa
                  penalti).
  Final           10 soal campuran dari seluruh materi, dengan pembahasan.


------------------------------------------------------------------------------
13. ATURAN SKOR, NYAWA, BINTANG, DAN LENCANA
------------------------------------------------------------------------------

  Nyawa
  - Setiap misi dimulai dengan 3 nyawa. Jawaban salah mengurangi 1 nyawa.
  - Nyawa habis: kembali ke checkpoint awal misi tersebut (materi bisa
    dibaca ulang). Skor tidak hilang.

  Misi 1–7
  - Skor = 100 − 20 × jumlah salah (minimal 40).
  - Bintang: tanpa salah ★★★, 1 salah ★★, 2 salah ★.

  Misi 8 (Final Mission)
  - Setiap jawaban benar 10 poin, salah 0 poin, maksimum 100.
  - Salah TIDAK mengurangi nyawa. Semua soal wajib dijawab.
  - Lulus jika skor minimal 60.
  - Bintang: 90–100 ★★★, 75–89 ★★, 60–74 ★.
  - Skor di bawah 60 → layar "Gagal di Misi Terakhir" dengan dua pilihan:
      Pelajari Lagi          kembali ke kota dengan ringkasan materi,
                             lalu boleh mencoba lagi.
      Lanjut dengan Penalti  total skor dikurangi 50 (minimal 0), lalu
                             Laporan Akhir dibuka.

  Mengulang misi
  - Misi yang sudah selesai boleh diulang untuk memperbaiki skor.
    Skor TERBAIK yang disimpan.

  Lencana
  - "Penjelajah HTML"       : selesaikan Level 1 dan Level 2 (Misi 1–5).
  - "Master Struktur HTML"  : Misi 6 dengan ★★★ dan skor Final ≥ 75.

  Skor total maksimum: 800 (8 misi × 100).


------------------------------------------------------------------------------
14. PENANDA MISI SELESAI
------------------------------------------------------------------------------

  Misi yang sudah selesai ditandai di beberapa tempat sekaligus:
  - Panel "Daftar Misi" (HUD kanan atas dan Peta Petualangan):
      ✓ kotak hijau + judul dicoret   = selesai
      ▶ kotak kuning (disorot)        = misi yang sedang dikerjakan
      kotak putus-putus               = belum terbuka
      angka x/8                       = jumlah misi selesai
  - Lencana ✓ hijau di papan nama bangunan.
  - Lencana ✓ hijau di atas kepala warga.
  - Papan nama hijau bertanda ✓ di Peta Petualangan.


------------------------------------------------------------------------------
15. LAPORAN AKHIR
------------------------------------------------------------------------------

  Setelah Misi 8 selesai, Laporan Akhir Petualangan terbuka berisi:
  - nama pemain dan jumlah misi yang selesai,
  - tabel per misi: nomor, nama misi, Tujuan Pembelajaran (TP), bintang,
    dan skor,
  - penalti (jika memilih "Lanjut dengan Penalti") dan total skor,
  - lencana yang diperoleh atau yang masih terkunci beserta syaratnya,
  - ajakan bermain bersama teman sekelas,
  - tombol "Kembali ke Kota" atau "Reset & Mulai Ulang".

  Laporan dapat dibuka lagi kapan saja lewat tombol trofi di HUD.
  Laporan Akhir adalah hasil permainan, bukan sertifikat resmi. Peserta
  didik dapat memotret layar (screenshot) laporan untuk dikumpulkan
  kepada guru.


------------------------------------------------------------------------------
16. PENYIMPANAN PROGRES DAN MULAI ULANG
------------------------------------------------------------------------------

  - Progres tersimpan otomatis di browser: nama, tokoh, misi, skor,
    bintang, nyawa, lencana, posisi di kota, pengaturan suara, zoom kota,
    zoom materi, dan
    status panel Daftar Misi.
  - Tombol "Lanjutkan" muncul di layar judul jika ada progres.
  - Progres hanya ada di browser dan perangkat yang sama. Membuka file di
    browser lain atau perangkat lain berarti mulai dari awal.
  - Mode penyamaran (incognito/private) tidak menyimpan progres setelah
    jendela ditutup.
  - Menghapus data/riwayat browser juga menghapus progres.
  - Mulai ulang: HUD > Info Materi > "Mulai Ulang Game", atau tombol
    "Reset & Mulai Ulang" di Laporan Akhir. Lakukan sebelum perangkat
    dipakai peserta didik lain. Pengaturan suara tetap tersimpan.


------------------------------------------------------------------------------
17. PENGATURAN SUARA DAN TAMPILAN
------------------------------------------------------------------------------

  Menu Pengaturan (tombol penggeser di HUD atau di layar judul):
    Musik Latar   penggeser volume + tombol Nyala/Mati
    Efek Suara    penggeser volume + tombol Nyala/Mati
    Zoom Layar    penggeser 80%–175% + tombol untuk kembali ke 100%
    Zoom Materi   penggeser 80%–150% + tombol untuk kembali ke 100%
    Tes Suara     memutar contoh efek suara

  Catatan: browser baru mengizinkan suara setelah ada klik/ketukan
  pertama. Musik dan efek suara dibuat langsung oleh kode, sehingga tetap
  berfungsi tanpa internet.


------------------------------------------------------------------------------
18. AKSESIBILITAS
------------------------------------------------------------------------------

  - Seluruh permainan bisa dimainkan hanya dengan keyboard.
  - Aktivitas seret-lepas memiliki alternatif ketuk-ketuk dan keyboard.
  - Tombol sentuh berukuran besar (minimal sekitar 48 px di layar).
  - Teks penting memiliki kontras tinggi; status misi tidak hanya
    ditandai warna, tetapi juga ikon (✓, ▶) dan coretan.
  - Pembaca layar mendapat label pada tombol dan status misi.
  - Jika perangkat mengaktifkan pengaturan "kurangi gerakan" (reduce
    motion), animasi dikurangi otomatis.
  - Zoom layar dan zoom materi membantu pemain yang membutuhkan tampilan
    atau tulisan lebih besar, termasuk di HP.


------------------------------------------------------------------------------
19. PANDUAN UNTUK GURU (MENGGANTI MATERI)
------------------------------------------------------------------------------

  Semua teks game (dialog, kartu materi, soal, pesan) dapat diubah tanpa
  memahami pemrograman.

  1. Buat salinan cadangan index.html terlebih dahulu.
  2. Buka index.html dengan editor teks (Notepad++, VS Code, Sublime Text,
     atau Notepad). Jangan membuka dengan Microsoft Word.
  3. Cari (Ctrl+F) tulisan:   const GAME_DATA = {
     Semua isi game ada di dalam blok ini, lengkap dengan komentar.
  4. Bagian yang paling sering diubah:
       meta.pembuat         nama pembuat (tampil di Info Materi)
       meta.materi          nama materi
       meta.sasaran         sasaran peserta didik
       prolog.dialog        dialog pembuka Cursor Pintar
       level                nama level dan pembagian misi
       misi.m1 ... misi.m8  dialog, kartu materi, dan aktivitas tiap misi
       aktivitas.soal       soal pilihan ganda, bentuknya:
                            { soal: '...', pilihan: ['A','B','C','D'],
                              kunci: 1, penjelasan: '...' }
       lencana              nama dan syarat lencana
       aturan               jumlah nyawa dan aturan skor
       teks                 pesan umum (benar, salah, nyawa habis, dll.)
  5. Aturan penulisan:
       - kunci dimulai dari 0  (A = 0, B = 1, C = 2, D = 3).
       - Nomor baris pada aktivitas "pilihBaris" dan "buru" dimulai dari 1.
       - {nama}   akan diganti nama pemain.
       - **teks** ditampilkan tebal.
       - `kode`   ditampilkan sebagai kode (aman untuk menulis tag HTML,
                  misalnya `<title>`).
       - Teks diapit tanda kutip tunggal '...'. Jika teks berisi kutip
         tunggal, tulis \'  (contoh: 'Jum\'at').
       - Jangan menghapus koma di antara item atau kurung kurawal { }.
  6. Simpan file, lalu muat ulang (refresh) halaman di browser.
     Jika game tidak muncul atau layar kosong, kemungkinan ada koma atau
     tanda kutip yang hilang. Bandingkan dengan file cadangan.

  Jangan mengubah bagian di bawah GAME_DATA (mesin game) kecuali Anda
  memahami JavaScript.


------------------------------------------------------------------------------
20. SARAN PENGGUNAAN DI KELAS
------------------------------------------------------------------------------

  Perkiraan waktu bermain: 45–70 menit (satu kali tatap muka), atau dibagi
  per level dalam beberapa pertemuan.

  Contoh alur pembelajaran:
    1. Pembuka (5 menit)      : guru menjelaskan tujuan dan cara bermain.
    2. Bermain (40–55 menit)  : peserta didik bermain mandiri/berpasangan.
                                Guru berkeliling memantau Daftar Misi
                                setiap peserta didik.
    3. Penutup (10 menit)     : peserta didik mengumpulkan screenshot
                                Laporan Akhir; guru membahas soal Final
                                yang paling banyak salah.

  Tips:
  - Minta peserta didik menekan "Mulai Ulang Game" sebelum bergantian
    perangkat.
  - Gunakan earphone atau matikan musik agar kelas tetap kondusif.
  - Tindak lanjut: minta peserta didik mengetik ulang kerangka HTML5 dari
    Misi 6 di editor kode dan membukanya di browser.


------------------------------------------------------------------------------
21. MENGATASI MASALAH (TROUBLESHOOTING)
------------------------------------------------------------------------------

  Game tidak terbuka / tampil sebagai tulisan kode
    → Klik kanan index.html > Open with / Buka dengan > Chrome atau Edge.

  Di HP file terbuka di aplikasi lain (misalnya penampil HTML bawaan)
    → Buka lewat Chrome atau Safari, atau unggah ke Google Drive lalu
      unduh dan buka dengan Chrome.

  Tidak ada suara
    → Klik/ketuk layar sekali, cek tombol Musik dan Speaker di HUD, cek
      volume di Pengaturan, dan pastikan perangkat tidak dalam mode senyap.

  Tampilan terlalu kecil atau terlalu besar
    → Kota: tombol − / + di HUD. Tulisan materi, soal, dan dialog: tombol
      − / + di halaman materi tersebut (atau menu Pengaturan > Zoom Materi).

  Tokoh tidak bisa berjalan
    → Tutup jendela yang masih terbuka (Esc), klik area kota sekali agar
      keyboard aktif, atau aktifkan kontrol sentuh lewat tombol joystick.

  Progres hilang
    → Pastikan memakai browser dan perangkat yang sama dan tidak dalam
      mode penyamaran. Progres juga hilang jika data browser dihapus.

  Game menjadi lambat di perangkat lama
    → Tutup tab lain, keluar dari mode layar penuh, atau perkecil zoom.

  HP tegak menampilkan anjuran memutar layar
    → Putar HP ke posisi mendatar, atau tutup anjuran tersebut.


------------------------------------------------------------------------------
22. INFORMASI DAN KREDIT
------------------------------------------------------------------------------

  Dibuat Oleh   : Dhanang Fitra Riaji, M.T.
  Materi        : Pembuatan Web Statis — Struktur Dasar HTML5
  Gambar        : dibuat langsung dengan kode (SVG dan Canvas), gaya piksel
  Font judul    : Poppins Bold (SIL Open Font License), disematkan di file
  Musik & suara : dibuat langsung dengan kode (Web Audio API)
  Privasi       : tidak ada data yang dikirim ke internet; progres hanya
                  disimpan di browser perangkat pemain.

  Skema permainan, karakter, dan nama tempat dalam game ini fiktif dan
  hanya sebagai pendukung pembelajaran.

  Sudah diuji: alur lengkap Prolog sampai Laporan Akhir (termasuk nyawa
  habis, Gagal di Misi Terakhir, dan Lanjut dengan Penalti) pada zoom
  materi 100%, 130%, dan 150%, zoom layar,
  serta tampilan layar penuh pada ukuran 360×640, 640×360, 844×390,
  390×844, 768×1024, 1024×768, 1280×1024, 1366×768, 1920×1080, dan
  2560×1080.
==============================================================================
