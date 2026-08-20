<div align="center">
  <img src="public/logo.png" alt="Enteam Logo" width="120" />
  <h1>✨ ENTEAM ✨</h1>
  <p><strong>Platform Manajemen Proyek & Kolaborasi Tim</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://prisma.io/"><img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
  </p>
</div>

<br />

> **ENTEAM** adalah pusat komando digital yang dirancang untuk tim yang ingin fokus mengeksekusi ide tanpa distraksi. Kami menyediakan ekosistem manajemen tugas yang terstruktur, rapi, dan dinamis dengan estetika monokromatik yang tajam dan berkinerja tinggi.

---

## 🚀 Fitur Unggulan

💎 **Estetika Monokromatik & Minimalis**  
Antarmuka yang tajam, kontras tinggi, dan *no-nonsense*. Dirancang khusus untuk meminimalkan gangguan visual sehingga tim dapat fokus sepenuhnya pada pekerjaan yang ada di depan mata.

📋 **Manajemen Tugas Berbasis Papan (Kanban-Style)**  
Atur alur kerja Anda dengan mudah. Buat *Workspace* (Board), kelompokkan ke dalam *Columns* (List), dan lacak setiap tugas menggunakan *Cards* dengan fitur *drag-and-drop* yang interaktif.

🤝 **Kolaborasi Tim & Manajemen Anggota**  
Sistem undangan (*invite*) yang mulus. Bawa rekan kerja Anda ke dalam ruang kerja dalam hitungan detik dan bangun tim yang solid. Dilengkapi dengan status dan manajemen peran (*role*).

📊 **Analitik & Laporan Produktivitas**  
Pantau performa tim Anda melalui dasbor analitik waktu-nyata (*real-time*). Visualisasikan data pembuatan tugas, jumlah ruang kerja, dan metrik kolaborasi secara otomatis dari basis data.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) + SQLite
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Visualisasi Data**: [Recharts](https://recharts.org/)

---

## 📂 Struktur Direktori

```text
ENTEAM/
├── prisma/                 # Skema basis data dan migrasi Prisma
├── public/                 # Aset statis, gambar, dan logo
├── src/
│   ├── app/                # Pages dan routing (Next.js App Router)
│   │   ├── (dashboard)/    # Layout utama untuk aplikasi terautentikasi
│   │   │   ├── analytics/  # Halaman dasbor analitik
│   │   │   ├── board/      # Halaman detail ruang kerja/kanban
│   │   │   ├── members/    # Halaman manajemen tim
│   │   │   └── tasks/      # Halaman daftar tugas global
│   │   └── page.tsx        # Halaman masuk/landing
│   ├── components/         # Komponen React yang dapat digunakan ulang
│   └── lib/                # Konfigurasi utilitas (misal: koneksi Prisma DB)
├── tailwind.config.ts      # Konfigurasi Tailwind CSS
└── package.json            # Dependensi proyek
```

---

## 💻 Panduan Instalasi & Pengembangan

Ikuti langkah-langkah di bawah ini untuk menjalankan ENTEAM di mesin lokal Anda:

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/akirausethis/ENTEAM.git
   cd ENTEAM
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Inisialisasi Basis Data Prisma:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```

5. **Buka di browser:**
   Akses `http://localhost:3000` untuk melihat aplikasi berjalan.

---

<div align="center">
  <p>Dibuat dengan 🖤 untuk Tim yang Produktif.</p>
  <p><b>© 2026 ENTEAM. Hak Cipta Dilindungi.</b></p>
</div>
