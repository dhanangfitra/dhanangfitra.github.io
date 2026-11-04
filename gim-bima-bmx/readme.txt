================================================================================
                    BIMA BMX DI NEGERI ANGKA
         Gim Petualangan Belajar Perkalian dan Pembagian
                    untuk Siswa Kelas 4 Sekolah Dasar
================================================================================

Versi        : 1.0 (November 2026)
Nama file    : index.html (satu file, sekitar 145 KB)
Bahasa       : Bahasa Indonesia
Jenis gim    : RPG 2D top-down, edukatif
Sasaran      : Siswa kelas 4 SD (usia 9-10 tahun)
Materi       : Perkalian dan pembagian bilangan cacah sampai 100
Kurikulum    : Kurikulum Merdeka, Matematika Fase B, elemen Bilangan
Durasi main  : sekitar 60-90 menit untuk menamatkan seluruh cerita


--------------------------------------------------------------------------------
DAFTAR ISI
--------------------------------------------------------------------------------
 1. Tentang Gim
 2. Kebutuhan Perangkat
 3. Cara Membuka dan Memasang Gim
 4. Halaman-Halaman Gim
 5. Kontrol Permainan
 6. Cerita dan Tokoh
 7. Wilayah dan Materi Pelajaran
 8. Cara Bermain Langkah demi Langkah
 9. Sistem Pertarungan Soal
10. Energi, Koin, Level, Bintang, dan Kristal
11. HUD (Tampilan di Bagian Atas Layar)
12. Menu Panduan
13. Menu Pengaturan
14. Musik dan Efek Suara
15. Layar Penuh dan Posisi Landscape
16. Penyimpanan Data dan Menghapus Data
17. Panduan untuk Guru dan Orang Tua
18. Pertanyaan Umum dan Pemecahan Masalah
19. Informasi Teknis untuk Pengembang
20. Batasan yang Diketahui
21. Riwayat Versi


================================================================================
1. TENTANG GIM
================================================================================

Bima BMX di Negeri Angka adalah gim petualangan yang mengajak siswa berlatih
perkalian dan pembagian sambil bercerita. Pemain mengendalikan Bima, anak
laki-laki berusia 10 tahun, yang mengayuh sepeda BMX bernama Si Kilat melintasi
enam wilayah Negeri Angka.

Si Kabut Kelabu telah mencuri 6 Kristal Angka. Tanpa kristal itu, semua orang
di Negeri Angka lupa cara berhitung. Bima harus mengumpulkan kembali keenam
kristal dengan menjawab soal matematika, lalu menghadapi Si Kabut Kelabu di
Benteng Kabut.

Ciri utama:
  - Soal dibuat acak setiap kali, sehingga setiap permainan berbeda.
  - Materi bertahap dari mudah ke sulit, satu wilayah satu materi.
  - Bantuan bertingkat saat salah menjawab, tidak langsung memberi jawaban.
  - Tidak ada kata yang mengejek. Kesalahan dianggap bagian dari belajar.
  - Gambar, musik, dan suara dibuat langsung oleh gim, tanpa file tambahan.
  - Tanpa iklan, tanpa pembelian, tanpa akun, dan tanpa mengirim data ke
    internet.
  - Dapat dimainkan di komputer, laptop, tablet, dan ponsel.


================================================================================
2. KEBUTUHAN PERANGKAT
================================================================================

Perangkat : komputer, laptop, tablet, atau ponsel.
Browser   : versi terbaru dari salah satu browser berikut.
              - Google Chrome atau Microsoft Edge (disarankan)
              - Mozilla Firefox
              - Safari (iPhone, iPad, Mac)
Layar     : minimal 360 piksel. Di ponsel, posisi mendatar (landscape) sangat
            disarankan.
Internet  : tidak wajib. Internet hanya dipakai untuk memuat jenis huruf dari
            Google Fonts. Tanpa internet, gim tetap berjalan dengan huruf
            cadangan bawaan perangkat.
Suara     : speaker atau earphone (opsional).

Tidak perlu memasang aplikasi apa pun.


================================================================================
3. CARA MEMBUKA DAN MEMASANG GIM
================================================================================

A. Dibuka langsung di komputer atau laptop
   1. Simpan file index.html di folder mana saja.
   2. Klik dua kali file tersebut. Gim terbuka di browser.
   3. Bila terbuka di aplikasi lain, klik kanan > Open with / Buka dengan >
      pilih Chrome, Edge, atau Firefox.

B. Dibuka di ponsel Android
   1. Kirim file index.html ke ponsel (WhatsApp, Google Drive, kabel USB).
   2. Buka file dengan aplikasi Chrome. Bila dibuka dari WhatsApp atau aplikasi
      Files, pilih "Buka dengan Chrome".

C. Dibuka di iPhone atau iPad
   1. Simpan file ke aplikasi File (Files).
   2. Ketuk file, lalu buka dengan Safari.
   Cara yang lebih nyaman di iPhone adalah membuka gim dari situs web
   (lihat bagian D).

D. Dipasang di situs web (agar siswa cukup membuka sebuah alamat)
   Karena nama filenya index.html, gim langsung terbuka di alamat utama situs.
   Pilihan hosting gratis:
     - GitHub Pages : buat repository baru, unggah index.html, lalu aktifkan
                      Settings > Pages.
     - Netlify Drop : buka app.netlify.com/drop, lalu seret folder yang berisi
                      index.html.
     - Server sekolah: salin index.html ke folder web server sekolah.
   Bagikan alamatnya ke siswa, atau ubah menjadi kode QR.

E. Untuk laboratorium komputer tanpa internet
   Salin index.html ke setiap komputer melalui flashdisk atau jaringan lokal,
   lalu buka seperti pada bagian A.


================================================================================
4. HALAMAN-HALAMAN GIM
================================================================================

Halaman 1 - Halaman Utama (Judul)
   - Kolom "Nama pemain". Nama ini dicetak di sertifikat akhir.
   - Tombol "Mulai Petualangan" untuk memulai permainan baru dari awal.
   - Tombol "Lanjutkan" untuk melanjutkan permainan yang tersimpan. Tombol ini
     hanya muncul bila ada data simpanan.
   - Tombol "Panduan" untuk membuka petunjuk cara bermain.
   - Tombol "Pengaturan" untuk mengatur suara, tampilan, dan data.

Halaman 2 - Halaman Muat (Loading)
   - Muncul setelah menekan "Mulai Petualangan" atau "Lanjutkan".
   - Menampilkan Bima mengayuh BMX menuju garis finis, enam Kristal Angka yang
     menyala satu per satu, bilah kemajuan dengan persentase, dan keterangan
     hal yang sedang disiapkan.
   - Kotak "Tahukah kamu?" berisi trik perkalian dan pembagian yang berganti
     setiap beberapa detik.
   - Pemuatan pertama sekitar 3 detik, berikutnya sekitar 1 detik.

Halaman 3 - Halaman Permainan
   - Peta dunia, HUD, kotak dialog, dan layar pertarungan soal.
   - Ikon rumah di pojok kiri atas untuk kembali ke Halaman Utama.

Halaman 4 - Sertifikat
   - Muncul setelah menamatkan cerita.
   - Berisi nama pemain, jumlah soal yang dijawab, persentase benar pada
     percobaan pertama, koin, level, dan bintang di setiap wilayah.
   - Tombol "Main Bebas" untuk terus berlatih di peta.
   - Tombol "Mulai dari Awal" untuk memulai petualangan baru.


================================================================================
5. KONTROL PERMAINAN
================================================================================

+---------------------+------------------------------+-----------------------------+
| Aksi                | Komputer / Laptop            | Ponsel / Tablet             |
+---------------------+------------------------------+-----------------------------+
| Bersepeda           | Tombol panah, atau W A S D   | Tombol arah di kiri bawah   |
| Lanjut dialog       | Spasi atau Enter             | Ketuk kotak dialog atau A   |
| Pilih jawaban       | Klik, atau tombol angka 1-4  | Ketuk pilihan jawaban       |
| Bicara dengan tokoh | Bersepeda menabrak tokoh     | Bersepeda menabrak tokoh    |
| Mulai bertarung     | Bersepeda menabrak Kabut     | Bersepeda menabrak Kabut    |
| Layar penuh         | Tombol "Layar Penuh" di HUD  | Otomatis saat mulai         |
| Keluar layar penuh  | Tombol Esc atau tombol HUD   | Tombol kembali di ponsel    |
| Tutup jendela menu  | Esc, tombol Tutup, atau klik | Ketuk tombol Tutup atau di  |
|                     | di luar jendela              | luar jendela                |
| Ke halaman utama    | Ikon rumah di kiri atas      | Ikon rumah di kiri atas     |
+---------------------+------------------------------+-----------------------------+

Catatan: tombol arah dan tombol A di layar sentuh otomatis disembunyikan saat
dialog, pertarungan, dan menu sedang tampil, agar tidak menutupi teks.


================================================================================
6. CERITA DAN TOKOH
================================================================================

PROLOG
   Bima pulang sekolah dengan wajah murung karena mendapat nilai 55 di ulangan
   perkalian. Saat mengelap sepedanya, lampu BMX berkedip dan sepeda itu bisa
   bicara. Buku matematika di keranjang sepeda bersinar dan menyedot mereka ke
   Negeri Angka.

TOKOH
   Bima            : tokoh utama, 10 tahun, helm merah, kemeja biru, tas
                     punggung. Berani dan ceria, belajar menjadi teliti.
   Si Kilat        : sepeda BMX hijau-oranye yang bisa bicara. Memberi
                     petunjuk saat Bima salah menjawab.
   Tika            : teman sekelas berkacamata. Menjelaskan materi di setiap
                     wilayah.
   Pak Kali        : petani bercaping, penjaga Desa Kelipatan.
   Bu Rimba        : peneliti hutan, penjaga Hutan Barisan.
   Kakek Bagio     : tukang perahu berpeci, penjaga Jembatan Sungai Bagi.
   Mbak Sari       : pedagang buah berkerudung, penjaga Pasar Apung.
   Pak Unta Ucok   : unta pencerita, penjaga Gurun Cerita.
   Ratu Puncak     : pendaki berselendang batik, penjaga Gunung Bilangan Besar.
   Si Kabut Kelabu : makhluk kabut pencuri kristal. Di balik kabutnya ternyata
                     ada Kelvin, anak yang dulu sering diejek karena lemah
                     berhitung.

AKHIR CERITA
   Bima tidak sekadar mengalahkan Kelvin, tetapi mengajaknya belajar bersama.
   Pemain membantu Kelvin menjawab 3 soal sampai ia berseru "Aku bisa!".
   Negeri Angka pulih, Bima pulang, dan seminggu kemudian mendapat nilai 95.

Nilai karakter yang ditanamkan: pantang menyerah, teliti, suka menolong,
jujur, dan adil saat berbagi.


================================================================================
7. WILAYAH DAN MATERI PELAJARAN
================================================================================

Peta dunia terdiri dari 6 wilayah yang tersusun 3 kolom x 2 baris:

        +------------------+------------------+------------------+
        | 2. Hutan Barisan | 3. Jembatan      | 6. Gunung        |
        |                  |    Sungai Bagi   |    Bilangan Besar|
        |                  |                  |  (Benteng Kabut) |
        +------------------+------------------+------------------+
        | 1. Desa          | 4. Pasar Apung   | 5. Gurun Cerita  |
        |    Kelipatan     |                  |                  |
        |   (titik awal)   |                  |                  |
        +------------------+------------------+------------------+

Urutan perjalanan: 1 > 2 > 3 > 4 > 5 > 6 > Benteng Kabut.

+----+------------------------+----------------------------------------------+
| No | Wilayah                | Materi dan contoh soal                       |
+----+------------------------+----------------------------------------------+
| 1  | Desa Kelipatan         | Perkalian sebagai penjumlahan berulang,      |
|    |                        | fakta perkalian 1-5.                         |
|    |                        | Contoh: 4 + 4 + 4 = ?   3 × 5 = ?            |
| 2  | Hutan Barisan          | Perkalian dengan susunan baris dan kolom,    |
|    |                        | fakta perkalian 6-10, sifat pertukaran.      |
|    |                        | Contoh: 7 baris, tiap baris 9 pohon.         |
| 3  | Jembatan Sungai Bagi   | Pembagian sama rata dan pengurangan          |
|    |                        | berulang, pembagian tanpa sisa sampai 63.    |
|    |                        | Contoh: 24 : 4 = ?                           |
| 4  | Pasar Apung            | Keluarga fakta, hubungan perkalian dan       |
|    |                        | pembagian, mencari bilangan yang hilang.     |
|    |                        | Contoh: 8 × ? = 56    ? : 4 = 9              |
| 5  | Gurun Cerita           | Soal cerita satu langkah dan dua langkah,    |
|    |                        | memilih operasi yang tepat.                  |
|    |                        | Contoh: 3 bungkus isi 6, dimakan 4. Sisa?    |
| 6  | Gunung Bilangan Besar  | Perkalian 2 angka × 1 angka dengan cara      |
|    |                        | memecah puluhan dan satuan, pembagian sampai |
|    |                        | 100. Contoh: 23 × 3 = ?   84 : 4 = ?         |
| -  | Benteng Kabut          | Campuran semua materi dalam 3 tahap.         |
+----+------------------------+----------------------------------------------+

Simbol pembagian memakai titik dua ( : ) sesuai kebiasaan di sekolah dasar
Indonesia.


================================================================================
8. CARA BERMAIN LANGKAH DEMI LANGKAH
================================================================================

1. Di Halaman Utama, tulis nama, lalu tekan "Mulai Petualangan".
2. Tunggu halaman muat selesai, lalu baca prolog. Tekan Spasi, Enter, atau
   ketuk kotak dialog untuk melanjutkan.
3. Di setiap wilayah, lakukan empat langkah berikut:
     a. Temui TIKA untuk mendengarkan penjelasan materi.
     b. Kalahkan 3 KABUT di wilayah itu dengan menjawab soal.
     c. Temui PENJAGA WILAYAH (tokoh dengan tanda seru ! di atas kepalanya),
        lalu terima tantangannya.
     d. Dapatkan KRISTAL ANGKA. Gerbang kabut ke wilayah berikutnya terbuka.
4. Ikuti PANAH KUNING bila bingung harus ke mana. Panah selalu menunjuk ke
   target berikutnya: Kabut terdekat, penjaga wilayah, atau gerbang.
5. Singgahi BENDERA MERAH PUTIH (pos pemeriksaan) untuk memulihkan energi dan
   menyimpan permainan.
6. Setelah 6 kristal terkumpul, pergi ke pintu emas Benteng Kabut di puncak
   Gunung Bilangan Besar (bagian kanan atas peta).
7. Kalahkan Si Kabut Kelabu, bantu Kelvin, lalu terima sertifikat.

Bagian "Tujuan" di bawah HUD selalu menuliskan tugas yang sedang berjalan.


================================================================================
9. SISTEM PERTARUNGAN SOAL
================================================================================

Pertarungan dimulai saat Bima menabrak Kabut, atau saat menerima tantangan
dari penjaga wilayah. Setiap soal memiliki 4 pilihan jawaban.

JENIS LAWAN
   +---------------------------+--------------+-------------------------------+
   | Lawan                     | Jumlah soal  | Keterangan                    |
   |                           | benar        |                               |
   +---------------------------+--------------+-------------------------------+
   | Kabut biasa               | 3            | Ayam, Monyet, Ikan, Bajak,    |
   |                           |              | Badai, dan Batu Kabut, sesuai |
   |                           |              | wilayahnya.                   |
   | Penjaga wilayah           | 6            | Menentukan jumlah bintang dan |
   |                           |              | memberi Kristal Angka.        |
   | Si Kabut Kelabu (bos)     | 14           | 3 tahap:                      |
   |                           |              |  Tahap 1 Hujan Angka          |
   |                           |              |   (perkalian)                 |
   |                           |              |  Tahap 2 Labirin Pembagian    |
   |                           |              |   (pembagian, keluarga fakta, |
   |                           |              |   bilangan besar)             |
   |                           |              |  Tahap 3 Duel Soal Cerita     |
   | Bantu Kelvin              | 3            | Soal ringan. Salah menjawab   |
   |                           |              | tidak mengurangi energi.      |
   +---------------------------+--------------+-------------------------------+

JAWABAN BENAR
   - Bima melakukan trik BMX dan mengurangi nyawa lawan.
   - Mendapat koin dan poin pengalaman (XP).
   - Muncul pujian, misalnya "Mantap!" atau "Lompatan sempurna!".

JAWABAN SALAH DAN BANTUAN BERTINGKAT
   - Salah pertama : 1 roda energi berkurang. Si Kilat memberi semangat,
                     "Hampir! Coba hitung sekali lagi pelan-pelan."
   - Salah kedua   : muncul petunjuk cara berpikir, misalnya penjumlahan
                     berulang atau cara memecah bilangan.
   - Salah ketiga  : muncul langkah pengerjaan, dan satu pilihan yang salah
                     dihapus.
   Pilihan yang sudah salah dikunci, sehingga siswa tidak bisa menebak asal.
   Jawaban benar tidak pernah ditampilkan langsung. Siswa tetap harus
   memilihnya sendiri.

KEMBALI KE PETA SAAT BERTARUNG
   Bila ikon rumah ditekan saat bertarung, pertarungan dibatalkan. Kabut tetap
   menunggu di tempatnya, dan tidak ada kemajuan yang hilang.


================================================================================
10. ENERGI, KOIN, LEVEL, BINTANG, DAN KRISTAL
================================================================================

ENERGI (5 ikon roda)
   - Berkurang 1 setiap jawaban salah.
   - Bila habis, Bima kembali ke pos pemeriksaan terakhir dengan energi penuh.
     Kristal, koin, dan kemajuan lain tidak hilang.
   - Pulih penuh di setiap bendera merah putih, dan setelah mendapat Kristal
     Oranye dari Mbak Sari.

KOIN
   - +10 koin untuk jawaban benar pada percobaan pertama.
   - +5 koin untuk jawaban benar setelah mencoba lagi.
   - +5 koin tambahan setiap mengalahkan satu Kabut.

LEVEL (Lv)
   - Benar pada percobaan pertama +10 XP, benar setelah mencoba lagi +6 XP.
   - Naik 1 level setiap 100 XP. Bilah hijau di samping Lv menunjukkan
     kemajuan menuju level berikutnya.

BINTANG (dinilai dari tantangan penjaga wilayah)
   - 3 bintang : 90% atau lebih benar pada percobaan pertama.
   - 2 bintang : 75% atau lebih benar pada percobaan pertama.
   - 1 bintang : tantangan selesai.
   Bintang terbaik di setiap wilayah dicatat di sertifikat.

KRISTAL ANGKA
   Hijau (Desa), Biru (Hutan), Kuning (Sungai), Oranye (Pasar Apung),
   Ungu (Gurun), Merah (Gunung). Kristal yang sudah didapat menyala berwarna
   di HUD.

KABUT MUNCUL KEMBALI
   Kabut yang dikalahkan muncul lagi sekitar 30 detik kemudian, sehingga
   siswa bisa terus berlatih di wilayah mana pun.


================================================================================
11. HUD (TAMPILAN DI BAGIAN ATAS LAYAR)
================================================================================

Dari kiri ke kanan:
   [Ikon rumah]   Kembali ke Halaman Utama (dengan konfirmasi).
   [5 roda]       Energi.
   [Koin]         Jumlah koin.
   [Lv]           Level dan bilah XP.
   [6 kristal]    Kristal Angka yang sudah dan belum didapat.
   [Nama wilayah] Wilayah tempat Bima berada (disembunyikan di layar kecil).
   [Layar Penuh]  Masuk atau keluar layar penuh.
   [Penunjuk]     Menyalakan atau mematikan panah penunjuk misi.
   [Musik]        Menyalakan atau mematikan musik latar.
   [Suara]        Menyalakan atau mematikan efek suara.

Di bawah HUD ada baris "Tujuan" yang menjelaskan tugas yang sedang berjalan.


================================================================================
12. MENU PANDUAN
================================================================================

Dibuka dari tombol "Panduan" di Halaman Utama. Isinya:
   - Tujuan permainan.
   - Tabel kontrol untuk komputer dan ponsel.
   - Langkah di setiap wilayah.
   - Cara bertarung dan sistem bantuan.
   - Penjelasan koin, bintang, dan pos pemeriksaan.
   - Peta materi keenam wilayah.
   - Catatan untuk guru dan orang tua.


================================================================================
13. MENU PENGATURAN
================================================================================

Dibuka dari tombol "Pengaturan" di Halaman Utama.

+-----------------------------------+-----------+----------------------------+
| Pengaturan                        | Bawaan    | Keterangan                 |
+-----------------------------------+-----------+----------------------------+
| Musik latar                       | Nyala     | Nyala / mati musik.        |
| Volume musik                      | 80%       | 0-100%.                    |
| Efek suara (sepeda, jawaban)      | Nyala     | Nyala / mati efek suara.   |
| Volume efek suara                 | 100%      | 0-100%. Terdengar bunyi    |
|                                   |           | contoh saat diubah.        |
| Panah penunjuk misi               | Nyala     | Matikan agar siswa mencari |
|                                   |           | jalan sendiri.             |
| Huruf soal ekstra besar           | Mati      | Untuk siswa yang butuh     |
|                                   |           | huruf lebih besar, atau    |
|                                   |           | saat ditayangkan di        |
|                                   |           | proyektor.                 |
| Layar penuh otomatis saat mulai   | Nyala     | Masuk layar penuh saat     |
|                                   |           | menekan Mulai / Lanjutkan. |
| Hapus data simpanan               | -         | Lihat bagian 16.           |
+-----------------------------------+-----------+----------------------------+

Semua pengaturan tersimpan otomatis dan tetap berlaku saat gim dibuka lagi.
Tombol Musik, Suara, dan Penunjuk di HUD selalu sama dengan isi Pengaturan.


================================================================================
14. MUSIK DAN EFEK SUARA
================================================================================

Semua bunyi dibuat langsung oleh gim memakai Web Audio, tanpa file suara.
Karena aturan browser, suara baru terdengar setelah pemain mengetuk atau
menekan tombol pertama kali.

MUSIK LATAR
   - Lagu ceria 8 birama dengan bas, ketukan drum ringan, dan bunyi bel
     bergaya bonang gamelan.
   - Setiap wilayah punya variasi nada, tempo, dan alat musik utama:
       Desa Kelipatan        : melodi lembut dengan bonang, santai
       Hutan Barisan         : seperti suling, lebih pelan
       Jembatan Sungai Bagi  : melodi lembut dengan bonang, sedang
       Pasar Apung           : gaya chiptune, lebih riang
       Gurun Cerita          : suara hangat seperti tiupan, sedang
       Gunung Bilangan Besar : chiptune dengan bel, bersemangat
   - Musik pertarungan lebih cepat, dalam nada wilayah masing-masing.
   - Pertarungan melawan Si Kabut Kelabu memakai tema khusus bernada minor.
   - Pergantian lagu memakai efek memudar.

EFEK SUARA SEPEDA
   - Kayuhan pedal kiri dan kanan bergantian, dengan dentum engkol.
   - Bunyi rantai menggigit gir di setiap kayuhan.
   - Desis ban menggelinding selama Bima bergerak.
   - Bunyi freewheel "tik-tik-tik" yang melambat saat Bima berhenti.
   - Saat menjawab benar: desis udara dan bunyi gir mengiringi trik BMX.

EFEK SUARA LAIN
   Bunyi jawaban benar, jawaban salah, dialog, menang, dan naik level.


================================================================================
15. LAYAR PENUH DAN POSISI LANDSCAPE
================================================================================

KOMPUTER DAN LAPTOP
   - Gim selalu memenuhi seluruh jendela browser. Lebar peta menyesuaikan
     layar, sehingga layar lebar menampilkan peta lebih luas.
   - Layar penuh aktif otomatis saat menekan Mulai / Lanjutkan (bisa
     dimatikan di Pengaturan).
   - Tekan Esc atau tombol "Keluar Layar Penuh" untuk keluar.

PONSEL DAN TABLET
   - Saat mulai bermain, gim masuk layar penuh dan mengunci posisi ke
     landscape (berlaku di Android dengan Chrome).
   - Bila ponsel masih tegak, muncul layar "Putar ponselmu" dengan tombol
     "Putar ke Landscape".
   - Di iPhone dan iPad, browser tidak mengizinkan posisi diputar otomatis.
     Nyalakan "Putar otomatis" di Pusat Kontrol, lalu miringkan perangkat.
   - Tersedia pilihan "Tetap main posisi tegak" bila diperlukan.
   - Dalam posisi landscape, tampilan dibuat ringkas: HUD satu baris, gambar
     pertarungan di kiri, dan empat pilihan jawaban besar di kanan.

Catatan: browser bisa menolak layar penuh bila gim dibuka dari dalam halaman
atau aplikasi lain (misalnya pratinjau di aplikasi chat). Buka index.html
langsung di browser untuk hasil terbaik.


================================================================================
16. PENYIMPANAN DATA DAN MENGHAPUS DATA
================================================================================

PENYIMPANAN OTOMATIS
   Permainan tersimpan otomatis di browser perangkat yang dipakai:
     - setiap kali melewati bendera merah putih,
     - setelah mengalahkan Kabut atau penjaga wilayah,
     - saat kembali ke Halaman Utama lewat ikon rumah,
     - setelah menamatkan cerita.
   Yang disimpan: nama, posisi, kristal, jumlah Kabut yang dikalahkan,
   bintang, koin, XP, energi, dan jumlah soal yang dijawab.

PENTING
   - Data hanya tersimpan di browser dan perangkat tersebut. Pindah perangkat
     atau browser berarti mulai dari awal.
   - Mode penyamaran (incognito) tidak menyimpan data setelah jendela ditutup.
   - Membersihkan riwayat atau data situs di browser akan menghapus simpanan.
   - Satu browser menyimpan satu data permainan. Bila satu komputer dipakai
     bergantian, setiap siswa sebaiknya memakai profil browser masing-masing,
     atau menekan "Mulai Petualangan" untuk permainan baru.
   - Menekan "Mulai Petualangan" saat ada simpanan akan memulai permainan baru
     dan menimpa simpanan lama begitu permainan tersimpan lagi.

MENGHAPUS DATA SIMPANAN
   1. Buka Halaman Utama > Pengaturan > Hapus data simpanan > tekan "Hapus".
   2. Muncul jendela peringatan merah yang menjelaskan bahwa kemajuan, koin,
      dan kristal yang sudah tersimpan akan hilang, permainan kembali ke awal,
      dan tombol Lanjutkan di Halaman Utama juga akan hilang. Jendela ini juga
      menampilkan ringkasan data yang akan dihapus.
   3. Tekan "Ya, hapus semua" untuk menghapus, atau "Batal" untuk membatalkan.
   4. Setelah dihapus, tombol Lanjutkan hilang dan muncul pesan "Data
      simpanan sudah dihapus."
   Pengaturan (volume, ukuran huruf, dan lainnya) tidak ikut terhapus.
   Bila belum ada data simpanan, tombol Hapus tidak dapat ditekan.


================================================================================
17. PANDUAN UNTUK GURU DAN ORANG TUA
================================================================================

TUJUAN PEMBELAJARAN
   Setelah menamatkan gim, siswa diharapkan mampu:
   1. Memahami perkalian sebagai penjumlahan berulang dan susunan baris.
   2. Menguasai fakta perkalian 1 sampai 10 dengan cepat dan tepat.
   3. Memahami pembagian sebagai pembagian sama rata dan pengurangan
      berulang.
   4. Menjelaskan hubungan perkalian dan pembagian (keluarga fakta).
   5. Menghitung perkalian bilangan 2 angka dengan 1 angka.
   6. Menyelesaikan soal cerita sehari-hari yang memakai perkalian dan
      pembagian.

SARAN PENGGUNAAN DI KELAS
   - Pertemuan 1 (35 menit) : Prolog, Desa Kelipatan, Hutan Barisan.
   - Pertemuan 2 (35 menit) : Jembatan Sungai Bagi, Pasar Apung.
   - Pertemuan 3 (35 menit) : Gurun Cerita, Gunung Bilangan Besar, Benteng.
   - Sebelum bermain, bahas sebentar materi wilayah yang akan dikunjungi.
   - Setelah bermain, minta siswa menyebutkan satu trik yang mereka pelajari,
     misalnya trik jari untuk tabel 9 atau cara memecah 23 × 3.
   - Siswa yang sudah tamat dapat memakai "Main Bebas" untuk latihan tambahan.

PENGATURAN YANG BERGUNA
   - Matikan musik saat bermain bersama di kelas agar tidak bising.
   - Matikan panah penunjuk untuk melatih siswa membaca peta dan petunjuk.
   - Nyalakan huruf soal ekstra besar saat ditayangkan di proyektor.

MEMBACA HASIL SISWA
   Lihat sertifikat di akhir permainan:
     - Persentase benar pada percobaan pertama menunjukkan penguasaan.
     - Bintang per wilayah menunjukkan materi yang sudah atau belum kuat.
       Wilayah dengan 1 bintang dapat diulang lewat "Main Bebas".
   Sertifikat dapat diabadikan dengan tangkapan layar.

KEAMANAN ANAK
   Tanpa iklan, tanpa pembelian dalam gim, tanpa obrolan, tanpa akun, dan
   tidak ada data siswa yang dikirim ke internet.


================================================================================
18. PERTANYAAN UMUM DAN PEMECAHAN MASALAH
================================================================================

T: Tidak ada suara sama sekali.
J: - Ketuk layar atau tekan satu tombol dulu. Browser baru mengizinkan suara
     setelah ada sentuhan pertama.
   - Periksa tombol Musik dan Suara di HUD, serta volume di Pengaturan.
   - Periksa volume perangkat. Di iPhone, matikan mode senyap (sakelar di
     samping ponsel).

T: Tombol "Lanjutkan" tidak muncul.
J: Belum ada data simpanan, data sudah dihapus, gim dibuka di browser atau
   perangkat lain, atau data browser sudah dibersihkan.

T: Layar tidak bisa penuh atau tidak bisa landscape otomatis.
J: Buka index.html langsung di Chrome atau Edge. Di iPhone, putar perangkat
   secara manual setelah menyalakan "Putar otomatis".

T: Huruf terlihat berbeda dengan tangkapan layar.
J: Perangkat sedang tidak terhubung ke internet, sehingga gim memakai huruf
   cadangan. Gim tetap berjalan normal dan angka tetap mudah dibaca.

T: Gim terasa lambat di ponsel lama.
J: Tutup aplikasi lain, matikan musik, dan gunakan versi terbaru Chrome.

T: Bima tidak bisa melewati kabut tebal di jalan.
J: Itu gerbang kabut. Gerbang terbuka setelah mendapat kristal dari penjaga
   wilayah saat ini. Ikuti panah kuning.

T: Penjaga wilayah belum memberi tantangan.
J: Kalahkan dulu 3 Kabut di wilayah itu. Jumlahnya tertulis di baris Tujuan.

T: Energi habis saat bertarung.
J: Bima kembali ke pos pemeriksaan terakhir dengan energi penuh. Kemajuan
   tidak hilang.

T: Tombol arah di layar sentuh tidak muncul di komputer layar sentuh.
J: Tombol arah hanya muncul di perangkat yang terdeteksi sebagai layar
   sentuh utama. Gunakan keyboard di komputer.


================================================================================
19. INFORMASI TEKNIS UNTUK PENGEMBANG
================================================================================

STRUKTUR FILE
   Seluruh gim ada dalam satu file index.html: HTML, CSS, dan JavaScript
   murni tanpa pustaka luar. Sumber luar yang dipakai hanya Google Fonts
   (Atkinson Hyperlegible, Baloo 2, Pixelify Sans).

TEKNOLOGI
   - Canvas 2D untuk peta, sprite, latar, dan potret (semua digambar dengan
     kode saat gim dimuat, tanpa file gambar).
   - Web Audio API untuk musik dan efek suara (tanpa file suara).
   - localStorage untuk penyimpanan.
   - Fullscreen API dan Screen Orientation API untuk layar penuh dan
     landscape.

KUNCI PENYIMPANAN (localStorage)
   bimaBMX_v1    : data permainan (kemajuan, koin, kristal, dan lainnya).
   bimaBMX_set   : pengaturan.
   bimaBMX_music : status musik (kompatibilitas versi lama).

BAGIAN KODE (cari judul berikut di dalam index.html dengan Ctrl+F)
   "// ===== Aset gambar"               : pembuat sprite, tile, latar, potret
   "// ===== Palet tokoh ====="          : warna dan gaya setiap tokoh
   "// ===== Pembuat soal per level ====" : pembuat soal acak setiap wilayah
   "// ===== Wilayah ====="              : nama wilayah, dialog Tika, dialog
                                           penjaga, nama musuh
   "const PROLOG" / "const EPILOG"      : teks prolog dan epilog
   "// ===== Peta ====="                 : susunan peta, gerbang, posisi tokoh
   "// ===== Pertarungan ====="          : nyawa lawan, koin, XP, bantuan
   "// ===== Lagu ====="                 : not musik setiap tema
   "// ===== Suara sepeda ====="         : suara pedal, rantai, freewheel
   "// ===== Penunjuk misi ====="        : panah kuning
   "// ===== Pengaturan ====="           : menu Pengaturan dan hapus data
   "// ===== Halaman muat ====="         : halaman muat dan teks "Tahukah
                                           kamu?" (daftar TIPS)
   "// ===== Tombol rumah"               : kembali ke Halaman Utama

CONTOH PENYESUAIAN
   - Mengubah rentang soal: ubah angka di fungsi GEN untuk wilayah terkait.
     Contoh, di GEN[1], R(2,5) berarti angka acak dari 2 sampai 5.
   - Mengubah jumlah soal untuk mengalahkan lawan: cari baris
     "const hp=kind==='mob'?3:kind==='guard'?6:kind==='boss'?14:3;".
   - Mengubah syarat bintang: cari "r>=.9?3:r>=.75?2:1".
   - Mengubah dialog: ubah teks di dalam ZONES, PROLOG, BOSS_INTRO, atau
     EPILOG. Format setiap baris: ['Nama Tokoh','Isi kalimat'].
   - Menambah trik di halaman muat: tambahkan kalimat ke daftar TIPS.
   Simpan file, lalu muat ulang browser untuk melihat hasilnya. Sebaiknya
   buat salinan cadangan sebelum mengubah kode.

UKURAN DUNIA
   Peta 42 × 28 petak, setiap wilayah 14 × 14 petak. Satu petak 48 piksel.
   Jumlah petak yang terlihat menyesuaikan ukuran layar.


================================================================================
20. BATASAN YANG DIKETAHUI
================================================================================

   - Satu data simpanan per browser. Belum ada profil untuk banyak siswa.
   - Belum ada dasbor nilai guru, tes awal, atau tes akhir.
   - Data tidak tersinkron antarperangkat.
   - iPhone dan iPad tidak mendukung kunci posisi landscape otomatis.
   - Belum tersedia pengisi suara untuk membacakan teks soal.


================================================================================
21. RIWAYAT VERSI
================================================================================

Versi 1.0 - November 2026
   - Cerita lengkap: prolog, 6 wilayah, Benteng Kabut, dan epilog.
   - Soal acak untuk 6 materi perkalian dan pembagian, dengan bantuan
     bertingkat.
   - Aset gambar: tile dan sprite piksel, latar bergaya anime, potret dialog.
   - Panah penunjuk misi dan huruf angka yang mudah dibaca.
   - Layar penuh di komputer dan landscape otomatis di ponsel.
   - Musik latar per wilayah, musik pertarungan, tema bos, dan suara sepeda.
   - Halaman Utama dengan Panduan dan Pengaturan, halaman muat, ikon rumah,
     dan jendela peringatan saat menghapus data simpanan.
   - Sertifikat akhir dan mode Main Bebas.

================================================================================
                Selamat bermain dan belajar bersama Bima!
                       "Ayo kayuh, angka menunggu!"
================================================================================
