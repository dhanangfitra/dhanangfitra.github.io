# Aplikasi Inventaris Lab v2

Aplikasi web inventaris laboratorium dengan login, registrasi akun Google, dan dua peran pengguna.
Frontend: HTML, CSS, JavaScript murni · Database: Google Spreadsheet (melalui Google Apps Script).

## Alur & fitur

| Halaman | Isi |
|---|---|
| **Login** (halaman pertama) | Masuk dengan username + password, atau tombol *Masuk dengan Google* bagi yang sudah terdaftar |
| **Registrasi** | Tahap 1: verifikasi email dengan akun Google. Tahap 2: isi nama, username, password. Akun baru otomatis berperan **peminjam** |
| **Dashboard peminjam** | *Pinjam Barang* (katalog + stok tersedia, tombol Ajukan) · *Peminjaman Saya* (status, catatan admin, batalkan pengajuan) · *Profil* (ganti password) |
| **Dashboard admin** | *Dashboard* (statistik, pengajuan menunggu, keterlambatan) · CRUD **Barang** · CRUD **Peminjaman** (setujui/tolak/kembalikan) · CRUD **Pengguna** · *Profil* |

Status peminjaman: **Menunggu → Dipinjam → Dikembalikan**, atau **Ditolak** / **Dibatalkan**.
Stok tersedia = jumlah barang − (Menunggu + Dipinjam), dan selalu dicek di server.

## Struktur file
| File | Fungsi |
|---|---|
| `index.html` | Semua halaman (login, registrasi, dashboard peminjam & admin) |
| `style.css` | Desain |
| `script.js` | Logika frontend |
| `config.js` | URL Web App, Google Client ID, nama lab |
| `Code.gs` | Backend Google Apps Script |

---

## Cara pemasangan

### 1. Buat Google OAuth Client ID (untuk login/registrasi Google)
1. Buka <https://console.cloud.google.com/> → buat proyek baru (mis. *Inventaris Lab*).
2. **APIs & Services → OAuth consent screen** → pilih *External* → isi nama aplikasi & email → simpan.
   Lalu klik **Publish app** agar semua akun Gmail bisa mendaftar (selama masih *Testing*, hanya *test users* yang bisa).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorized JavaScript origins**: alamat tempat `index.html` dibuka, contoh:
     - `http://localhost:5500` (Live Server VS Code)
     - `http://127.0.0.1:5500`
     - `https://namaanda.github.io` (jika di-hosting di GitHub Pages)
   - Redirect URI tidak perlu diisi.
4. Salin **Client ID** (berakhiran `.apps.googleusercontent.com`).

> Login Google **tidak berfungsi** jika `index.html` dibuka dengan klik ganda (`file://`). Wajib lewat `http://localhost` atau hosting `https://`.

### 2. Siapkan Spreadsheet & Apps Script
1. Buka spreadsheet → **Ekstensi → Apps Script**.
2. Ganti seluruh isi `Code.gs` dengan file `Code.gs` versi baru ini.
3. Isi `GOOGLE_CLIENT_ID` di baris atas dengan Client ID dari langkah 1.
4. Pilih fungsi **`setup`** → **Jalankan** → izinkan akses (ada izin baru: *koneksi ke layanan eksternal*, untuk memverifikasi login Google).
   - Membuat sheet `users`, `barang`, `peminjaman`.
   - Membuat akun admin awal: **username `admin`, password `admin123`**. Segera ganti di menu *Profil*.
   - Sheet lama yang strukturnya berbeda (mis. `peminjaman` dari versi 1) **tidak dihapus**, tetapi diganti nama menjadi `peminjaman_lama_…` sebagai cadangan. Data sheet `barang` versi 1 tetap dipakai.

### 3. Deploy Web App
- **Sudah pernah deploy (versi 1):** **Terapkan → Kelola deployment → ✏️ Edit → Versi: Versi baru → Terapkan**. URL tetap sama.
- **Belum pernah:** **Terapkan → Deployment baru → Aplikasi web**, *Jalankan sebagai: Saya*, *Yang memiliki akses: Siapa saja*. Salin URL `/exec`.

### 4. Isi `config.js`
```js
window.APP_CONFIG = {
  API_URL: 'https://script.google.com/macros/s/XXXXXXXX/exec',
  GOOGLE_CLIENT_ID: '1234567890-abc.apps.googleusercontent.com', // sama dengan Code.gs
  NAMA_LAB: 'Laboratorium IPA'
};
```

### 5. Jalankan
Buka folder di VS Code → klik kanan `index.html` → **Open with Live Server**, atau upload ke GitHub Pages / Netlify.

---

## Keamanan
- Password disimpan sebagai hash SHA-256 berulang dengan salt, tidak pernah dalam bentuk asli.
- Setiap permintaan diperiksa di server: token sesi valid, akun aktif, dan peran admin untuk aksi admin.
- Token Google diverifikasi ke server Google, dan Client ID-nya harus cocok.
- Sesi berlaku 6 jam sejak aktivitas terakhir, lalu pengguna diminta login ulang.
- Admin tidak bisa menghapus, menonaktifkan, atau menurunkan peran akunnya sendiri, supaya tidak terkunci.

## Mengatasi masalah
| Gejala | Solusi |
|---|---|
| *Tidak bisa terhubung ke server* / *Failed to fetch* | Akses deploy harus **Siapa saja**, lalu deploy **versi baru** setelah mengubah kode |
| *Sheet "users" belum ada* | Jalankan `setup()` |
| Tombol Google tidak muncul | Isi `GOOGLE_CLIENT_ID`, dan buka lewat `http://localhost` / `https://`, bukan `file://` |
| *The given origin is not allowed* (di konsol) | Tambahkan alamat halaman ke **Authorized JavaScript origins**, tunggu ±5 menit |
| *Client ID berbeda* | Samakan `GOOGLE_CLIENT_ID` di `Code.gs` dan `config.js` |
| Lupa password admin | Hapus baris admin di sheet `users` (spreadsheet), lalu jalankan `setup()` lagi. Admin awal dibuat ulang jika tidak ada admin lain |
