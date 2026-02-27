# 🏛️ Web Kelurahan Petamburan – Demo Mockup

## Teknologi & Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Framework Target (Production):** Laravel 10 + MySQL
- **Template Base:** SB Admin 2 (disesuaikan tema DKI Jakarta)
- **Font:** Plus Jakarta Sans + Lora (Google Fonts)
- **Icons:** Font Awesome 6.5

---

## 📁 Struktur Folder

```
kelurahan-demo/
├── index.html              → Halaman Beranda
├── layanan.html            → Halaman Layanan Publik
├── perangkat.html          → Perangkat & Struktur Organisasi
├── ppid.html               → PPID + Form Online
├── kontak.html             → Kontak + Peta
├── informasi.html          → Agenda & Informasi Kelurahan
├── assets/
│   ├── css/
│   │   └── style.css       → Stylesheet utama (Tema DKI)
│   ├── js/
│   │   └── main.js         → JavaScript interaksi
│   └── img/
│       ├── logo-dki.png    → Logo DKI Jakarta
│       ├── lurah.jpg       → Foto lurah
│       ├── hero1.jpg       → Gambar hero slider 1
│       ├── hero2.jpg       → Gambar hero slider 2
│       ├── hero3.jpg       → Gambar hero slider 3
│       ├── news1.jpg       → Thumbnail berita 1
│       ├── news2.jpg       → Thumbnail berita 2
│       ├── news3.jpg       → Thumbnail berita 3
│       └── news4.jpg       → Thumbnail berita 4
└── README.md
```

---

## 🎨 Palet Warna (Tema DKI Jakarta)

| Variabel          | Kode Hex  | Penggunaan                  |
|-------------------|-----------|-----------------------------|
| `--red-dark`      | `#9B1B1B` | Header gradient, accent gelap |
| `--red`           | `#C0392B` | Warna utama merah DKI        |
| `--red-light`     | `#E74C3C` | Hover state, highlight       |
| `--orange`        | `#E67E22` | Aksen oranye                 |
| `--orange-light`  | `#F39C12` | Aksen oranye terang          |
| `--gold`          | `#D4A017` | Dekorasi khusus              |

---

## 📄 Halaman yang Tersedia

### 1. `index.html` — Beranda
- Topbar informasi & jam
- Header sticky + navigasi dropdown
- Hero slider (3 slide)
- Stats bar (luas wilayah, RW, RT, penduduk, IKM)
- Grid berita terbaru (featured + 3 card)
- Quick access layanan (6 kartu)
- Agenda kelurahan
- Sidebar: profil lurah, jam layanan, kontak, IKM

### 2. `layanan.html` — Layanan Publik
- Maklumat layanan
- 6 jenis pelayanan dengan syarat & waktu
- Tabel jam pelayanan
- Visualisasi nilai IKM per unsur

### 3. `perangkat.html` — Perangkat Kelurahan
- Bagan struktur organisasi
- Tabel daftar pejabat dengan badge jabatan
- Uraian tugas dan fungsi per seksi

### 4. `ppid.html` — PPID
- 6 kartu menu PPID
- Form Permohonan Informasi Publik (lengkap dengan validasi)
- Form Pengajuan Keberatan
- Sidebar: info PPID, prosedur, kontak

### 5. `kontak.html` — Kontak
- Info kontak lengkap
- Embed Google Maps
- Form kirim pesan/pengaduan
- Tautan media sosial

---

## 🖼️ Gambar yang Dibutuhkan

Tambahkan gambar berikut ke folder `assets/img/`:
- `logo-dki.png` → Download dari: jakarta.go.id
- `lurah.jpg` → Foto lurah (rasio 1:1, min 300x300px)
- `hero1.jpg`, `hero2.jpg`, `hero3.jpg` → Banner hero (rasio 16:9, min 1280x720px)
- `news1.jpg`–`news4.jpg` → Thumbnail berita (rasio 16:9, min 600x338px)

---

## ⚙️ Cara Menjalankan Demo

1. Buka folder `kelurahan-demo/` di VSCode
2. Install ekstensi **Live Server** (ritwickdey.LiveServer)
3. Klik kanan pada `index.html` → **"Open with Live Server"**
4. Browser akan membuka `http://localhost:5500`

---

## 🚀 Rencana Migrasi ke Laravel 10

Setelah ACC dari client, struktur Laravel:

```
laravel-kelurahan/
├── app/
│   ├── Http/Controllers/
│   │   ├── BerandaController.php
│   │   ├── BeritaController.php
│   │   ├── LayananController.php
│   │   ├── PerangkatController.php
│   │   ├── AgendaController.php
│   │   └── PPIDController.php
│   └── Models/
│       ├── Berita.php
│       ├── Layanan.php
│       ├── Agenda.php
│       ├── Pejabat.php
│       └── PPIDPermohonan.php
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php   → Layout utama
│       ├── beranda.blade.php
│       ├── layanan/
│       ├── perangkat/
│       ├── ppid/
│       └── kontak.blade.php
├── routes/
│   └── web.php
└── database/
    └── migrations/
        ├── create_berita_table.php
        ├── create_layanan_table.php
        ├── create_agenda_table.php
        ├── create_pejabat_table.php
        └── create_ppid_permohonan_table.php
```

### Tabel Database MySQL

```sql
-- Berita
CREATE TABLE berita (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255), slug VARCHAR(255) UNIQUE,
  isi TEXT, thumbnail VARCHAR(255),
  kategori ENUM('kegiatan','sosial','pkk','pemerintahan','pengumuman'),
  status ENUM('publish','draft') DEFAULT 'draft',
  created_at TIMESTAMP, updated_at TIMESTAMP
);

-- Layanan
CREATE TABLE layanan (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255), ikon VARCHAR(100),
  deskripsi TEXT, persyaratan JSON,
  waktu VARCHAR(100), biaya VARCHAR(100),
  status BOOLEAN DEFAULT 1
);

-- Pejabat
CREATE TABLE pejabat (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255), jabatan VARCHAR(255),
  nip VARCHAR(30), foto VARCHAR(255),
  urutan INT, status BOOLEAN DEFAULT 1
);

-- Agenda
CREATE TABLE agenda (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255), tanggal DATE,
  waktu_mulai TIME, waktu_selesai TIME,
  lokasi VARCHAR(255), deskripsi TEXT,
  status ENUM('akan_datang','berlangsung','selesai')
);

-- PPID Permohonan
CREATE TABLE ppid_permohonan (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255), nik VARCHAR(20),
  email VARCHAR(255), telepon VARCHAR(20),
  alamat TEXT, tujuan VARCHAR(100),
  cara_mendapat VARCHAR(100), info_diminta TEXT,
  lampiran VARCHAR(255), status ENUM('diterima','diproses','selesai','ditolak') DEFAULT 'diterima',
  no_registrasi VARCHAR(50) UNIQUE,
  created_at TIMESTAMP, updated_at TIMESTAMP
);
```

---

## 📝 Catatan untuk Client

> **Demo ini adalah versi statis** untuk keperluan presentasi.
> Versi produksi akan menggunakan **Laravel 10 + MySQL** dengan panel admin lengkap (SB Admin 2).
> Semua konten dapat dikelola melalui CMS tanpa perlu coding.

---

**Dibuat oleh:** Tim Developer  
**Versi Demo:** 1.0.0  
**Tanggal:** Februari 2026
