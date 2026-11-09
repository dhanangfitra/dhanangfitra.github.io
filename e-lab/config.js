// Konfigurasi aplikasi — sesuaikan dengan milik Anda.
window.APP_CONFIG = {
  // URL Web App Apps Script (berakhiran /exec)
  API_URL: 'https://script.google.com/macros/s/AKfycbyz17lNXInAUrXEqSsG2EmShw6LEFTST8kQdNq1HAv8tgPZOpC5gHBAJJRszOMMyP4p/exec',

  // OAuth Client ID dari Google Cloud Console (HARUS sama dengan GOOGLE_CLIENT_ID di Code.gs)
  GOOGLE_CLIENT_ID: '553740532104-r02vq7o7jmam52kqb58cb71q61l3i8bh.apps.googleusercontent.com',

  NAMA_LAB: 'Inventaris Lab PPLG (RPL)',

  // (Opsional) Daftar lab untuk kartu di display.html: menentukan urutan, keterangan,
  // dan tetap menampilkan lab yang belum punya barang. Nama harus sama persis dengan
  // isian kolom "Lab" pada data barang. Hapus tanda // untuk memakai.
  // LABS: [
  //   { nama: 'Lab Kimia',    info: 'Gedung B lt. 2 · PJ: Bu Rina' },
  //   { nama: 'Lab Biologi',  info: 'Gedung B lt. 1 · PJ: Pak Agus' },
  //   { nama: 'Lab Fisika',   info: 'Gedung C lt. 1' },
  //   { nama: 'Lab Komputer', info: 'Gedung A lt. 3' }
  // ]
};
