# Bookletku 📖 - Digital Menu & WhatsApp Ordering SaaS

![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)

**Bookletku** adalah platform *SaaS (Software as a Service)* modern yang memungkinkan pemilik restoran, kafe, atau UMKM kuliner untuk membuat **Menu Digital** interaktif dalam hitungan menit.

Solusi ini menghilangkan kebutuhan akan buku menu fisik yang mahal dan mempermudah proses pemesanan melalui integrasi langsung ke WhatsApp.

## ✨ Fitur Unggulan

### 📱 Untuk Pelanggan (Public View)
* **Tanpa Instalasi:** Akses menu langsung via Browser dengan scan QR Code.
* **Mobile-First Design:** Tampilan responsif seperti aplikasi native.
* **Real-time Search & Filter:** Pencarian menu dan filter kategori instan.
* **Keranjang Belanja:** Menambah item, mengatur jumlah, dan melihat estimasi total.
* **Checkout WhatsApp:** Pesanan otomatis terformat rapi dan terkirim ke WhatsApp kasir.

### 👨‍🍳 Untuk Pemilik Restoran (Admin Dashboard)
* **Dashboard Analitik:** Memantau total kunjungan, menu terpopuler, dan estimasi omset.
* **Manajemen Menu (CRUD):** Tambah, edit, hapus menu, dan upload gambar dengan mudah.
* **Drag & Drop Sorting:** Mengatur urutan menu sesuai keinginan.
* **Manajemen Stok:** Toggle status "Ready" atau "Habis" dengan satu klik.
* **QR Code Generator:** Cetak template kartu meja siap pakai langsung dari dashboard.
* **Kustomisasi:** Ubah profil resto dan tema warna (Minimalist / Colorful).

## 🛠️ Teknologi

Project ini dibangun menggunakan stack teknologi terkini untuk performa maksimal:

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
* **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Charts:** MUI X Charts
* **Utils:** `dnd-kit` (Drag & Drop), `qrcode.react`, `zod`

## 🚀 Cara Menjalankan (Local Development)

Ikuti langkah-langkah berikut untuk menjalankan project di komputer lokal Anda:

### 1. Prasyarat
* Node.js (versi 20 atau lebih baru)
* Akun Supabase

### 2. Instalasi
Clone repositori dan install dependencies:

```bash
git clone [https://github.com/username-anda/bookletku.git](https://github.com/username-anda/bookletku.git)
cd bookletku
npm install

NEXT_PUBLIC_SUPABASE_URL=[https://project-id-anda.supabase.co](https://project-id-anda.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxh... (Anon Key Anda)

4. Setup Database (Supabase)
Jalankan query SQL berikut di SQL Editor Supabase Anda untuk membuat tabel yang diperlukan:

<details> <summary>👉 Klik untuk melihat SQL Schema</summary>

SQL

-- 1. Tabel Profil Restoran
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  restaurant_name text,
  whatsapp_number text,
  description text,
  slug text unique,
  logo_url text,
  theme text default 'minimalist',
  updated_at timestamp with time zone
);

-- 2. Tabel Menu Items
create table menu_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  price numeric not null,
  category text not null,
  image_url text,
  is_available boolean default true,
  position integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Tabel Analytics
create table analytics (
  id uuid default gen_random_uuid() primary key,
  event_type text not null, -- 'page_view' atau 'add_to_cart'
  menu_item_id uuid references menu_items(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Storage Buckets (Jangan lupa set policy public)
insert into storage.buckets (id, name, public) values ('menu-images', 'menu-images', true);
insert into storage.buckets (id, name, public) values ('logos', 'logos', true);

5. Jalankan Server
Bash

npm run dev
Buka http://localhost:3000 di browser Anda.

📂 Struktur Project
bookletku/
├── src/
│   ├── app/              # Next.js App Router (Pages & Layouts)
│   ├── components/       # Reusable UI Components (Shadcn, dsb)
│   ├── lib/              # Konfigurasi Supabase & Utils
│   ├── services/         # Logic untuk fetch data (Menu, Settings, Analytics)
│   └── types/            # Definisi Tipe TypeScript
├── public/               # Aset statis
└── ...
🤝 Kontribusi
Pull requests dipersilakan. Untuk perubahan besar, harap buka issue terlebih dahulu untuk mendiskusikan apa yang ingin Anda ubah.

📄 Lisensi
MIT


---

### 2. TEAM_README.md (Dokumentasi Internal Kelompok)
File ini khusus untuk anggota tim agar koordinasi lebih mudah. Letakkan ini di root folder juga.

```markdown
# 👋 Panduan Internal Tim Bookletku

Halo Tim! Dokumen ini berisi panduan teknis, pembagian tugas, dan aturan main biar pengerjaan project **Bookletku** lancar sampai final.

## 👥 Anggota Kelompok & Peran

| Nama | NIM |
| :---  :--- |
| **[Adam Raga]** | A11.2024.15598 |
| **[Affan Shahzada]** | A11.2024.15784 |
| **[Aiska Zahra Nailani]** | A11.2024.16014 |
| **[Nur Alif Maulana Syafrudin]** | A11.2024.15936 |

## 🔄 Alur Kerja Git (Wajib Baca!)

Agar tidak bentrok kode (*merge conflict*), ikuti aturan ini:

1.  **JANGAN coding di `main`**. Branch `main` hanya untuk kode yang sudah final dan siap demo.
2.  **Buat Branch Baru:** Setiap mau ngerjain fitur, buat branch dari `main`:
    * Format: `fitur/nama-fitur` atau `fix/nama-bug`
    * Contoh: `fitur/login-page`, `fitur/keranjang-belanja`, `fix/sidebar-mobile`.
    * Command: `git checkout -b fitur/halaman-menu`
3.  **Commit Message:** Gunakan bahasa yang jelas.
    * ✅ "Menambahkan fitur upload gambar menu"
    * ❌ "update", "fix", "asdf"
4.  **Pull Request (PR):** Kalau sudah selesai, push branch kamu dan buat PR ke `main`. Kabari di grup WA/Discord untuk di-review teman lain.

## 🗄️ Database & Environment (PENTING)

Kita menggunakan **Supabase** yang sama (Shared Project).

1.  Minta file `.env.local` terbaru ke **[Nama 1 / Ketua]**.
2.  Jangan pernah upload file `.env.local` ke GitHub! (Sudah di-ignore, tapi pastikan lagi).
3.  Jika kamu mengubah struktur tabel database, **WAJIB** bilang di grup agar teman lain tidak error.

## 🏃‍♂️ Setup Cepat

1.  `npm install` (lakukan ini setiap kali ada yang update *package.json*)
2.  `npm run dev`

## 📝 Catatan Pengembangan

### Todo List / Progress
- [x] Setup Next.js & Tailwind
- [x] Integrasi Supabase Auth (Login/Register)
- [x] Admin Dashboard (Statistik)
- [x] CRUD Menu (Create, Read, Update, Delete)
- [x] Halaman Menu Public (Customer)
- [x] Fitur Checkout WhatsApp
- [ ] Dark Mode Sempurna (Masih ada bug di chart)
- [ ] Print QR Code (Styling perlu dirapikan)

### Masalah Umum (Troubleshooting)
* **Error "Auth session missing":** Coba logout dan login ulang di `/login`. Atau hapus cookies di browser.
* **Gambar tidak muncul:** Cek bucket Supabase, pastikan policy bucket sudah `public`.
* **Error TypeScript:** Coba restart VS Code atau jalankan `Ctrl+Shift+P` -> `TypeScript: Restart TS Server`.

---
*Semangat Tim! Mari kita selesaikan Bookletku! 🚀*
