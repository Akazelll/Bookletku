# Bookletku 📖 – Digital Menu & WhatsApp Ordering SaaS

## 👥 Anggota Kelompok

| Nama                           | NIM            |
| ------------------------------ | -------------- |
| **Adam Raga**                  | A11.2024.15598 |
| **Affan Shahzada**             | A11.2024.15784 |
| **Aiska Zahra Nailani**        | A11.2024.16014 |
| **Nur Alif Maulana Syafrudin** | A11.2024.15936 |

![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square\&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square\&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square\&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square\&logo=tailwind-css)

**Bookletku** adalah platform *SaaS (Software as a Service)* modern yang membantu pemilik restoran, kafe, dan UMKM kuliner membuat **Menu Digital interaktif** dan memproses pesanan melalui **WhatsApp** dalam hitungan menit.

Bookletku menggantikan buku menu fisik yang mahal dan sulit di-update dengan solusi digital yang ringan, mobile-friendly, dan mudah dikustomisasi.

---

## 🔍 Fitur Utama

### 📱 Untuk Pelanggan (Public View)

* **Tanpa Instalasi Aplikasi** → Akses via browser, cukup **scan QR Code**.
* **Mobile-First Design** → Tampilan responsif dan mirip aplikasi native.
* **Real-time Search & Filter** → Cari menu berdasarkan nama/kategori secara instan.
* **Keranjang Belanja (Cart)** → Tambah item, atur kuantitas, lihat estimasi total.
* **Checkout via WhatsApp** → Pesanan otomatis diformat rapi dan dikirim ke nomor WA kasir.

### 👨‍🍳 Untuk Pemilik Restoran (Admin Dashboard)

* **Dashboard Analitik** → Statistik kunjungan, menu terpopuler, dan estimasi omzet.
* **Manajemen Menu (CRUD)** → Tambah, edit, hapus menu, lengkap dengan gambar.
* **Drag & Drop Sorting** → Atur urutan tampilan menu dengan mudah.
* **Manajemen Stok** → Toggle status *Ready* / *Habis* hanya dengan satu klik.
* **QR Code Generator** → Generate & cetak kartu QR per meja langsung dari dashboard.
* **Kustomisasi Tampilan** → Ubah profil resto dan tema warna (mis. `minimalist`, `colorful`).

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components, Server Actions)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
* **Charts**: MUI X Charts
* **Utilities**:

  * [`dnd-kit`](https://dndkit.com/) → Drag & Drop sorting menu
  * [`qrcode.react`](https://github.com/zpao/qrcode.react) → Generate QR Code
  * [`zod`](https://zod.dev/) → Validasi input & schema

---

## 🚀 Memulai Pengembangan (Local Development)

### 1. Prasyarat

Pastikan di komputer Anda sudah terinstall:

* **Node.js** v20 atau lebih baru
* Akun **Supabase** (gratis sudah cukup untuk development)
* Git (opsional tapi direkomendasikan)

### 2. Clone Repositori & Install Dependencies

```bash
# Clone repo
git clone https://github.com/username-anda/bookletku.git
cd bookletku

# Install dependencies
npm install
```

### 3. Konfigurasi Environment (.env.local)

Buat file `.env.local` di root project, lalu isi dengan kredensial Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://project-id-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Catatan:**
>
> * Jangan pernah commit file `.env.local` ke GitHub (sudah di-ignore di `.gitignore`).
> * Untuk tim, file `.env.local` sebaiknya dibagikan secara privat (WhatsApp/Discord).

### 4. Setup Database (Supabase)

Masuk ke dashboard Supabase → menu **SQL Editor**, lalu jalankan script berikut untuk membuat tabel yang dibutuhkan:

<details>
<summary><strong>👉 Klik untuk melihat SQL Schema</strong></summary>

```sql
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
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
  on conflict (id) do nothing;
```

</details>

> Setelah membuat bucket, pastikan **RLS / policy** untuk bucket `menu-images` dan `logos` sudah diatur agar file bisa diakses publik (read-only).

### 5. Menjalankan Server

```bash
npm run dev
```

Buka `http://localhost:3000` di browser untuk mengakses aplikasi.

---

## 📂 Struktur Proyek (Ringkas)

```bash
bookletku/
├── src/
│   ├── app/              # Next.js App Router (pages, layout, route handlers)
│   ├── components/       # Reusable UI components (shadcn, layout, dsb)
│   ├── lib/              # Supabase client, constants, helper functions
│   ├── services/         # Logic fetch data (Menu, Profiles, Analytics)
│   └── types/            # Definisi tipe TypeScript
├── public/               # Static assets (ikon, images default)
├── .env.local.example    # Contoh environment variables (opsional)
└── ...                   # Config lain (tsconfig, next.config, dll)
```

---

## 🤝 Kontribusi

Pull request sangat terbuka! 🙌

1. Fork repository ini
2. Buat branch baru dari `main`:

   ```bash
   git checkout -b fitur/nama-fitur
   ```
3. Lakukan perubahan dan commit dengan pesan yang jelas
4. Push branch dan buka Pull Request ke `main`

Untuk perubahan besar, sebaiknya buat **issue** dulu untuk diskusi.

---

## 📜 Lisensi

Project ini dirilis dengan lisensi **MIT**. Silakan gunakan, modifikasi, dan kembangkan sesuai kebutuhan dengan tetap mempertahankan attribution.

---

## 👥 Tim & Workflow Internal

> Bagian ini terutama untuk kebutuhan dokumentasi kelompok / mata kuliah. Bisa disembunyikan di fork publik jika diperlukan.

### 👨‍👩‍👧‍👦 Anggota Kelompok

| Nama                           | NIM            |
| ------------------------------ | -------------- |
| **Adam Raga**                  | A11.2024.15598 |
| **Affan Shahzada**             | A11.2024.15784 |
| **Aiska Zahra Nailani**        | A11.2024.16014 |
| **Nur Alif Maulana Syafrudin** | A11.2024.15936 |

### 🔄 Alur Kerja Git (Wajib Tim Ikuti)

1. **Dilarang push langsung ke `main`**

   * Branch `main` hanya untuk kode yang sudah stabil dan siap demo.
2. **Buat branch baru saat mengerjakan fitur/bugfix**

   * Format nama branch:

     * `fitur/nama-fitur` → contoh: `fitur/login-page`, `fitur/keranjang-belanja`
     * `fix/nama-bug` → contoh: `fix/sidebar-mobile`
   * Command:

     ```bash
     git checkout -b fitur/halaman-menu
     ```
3. **Gunakan commit message yang jelas & deskriptif**

   * ✅ `feat: menambahkan fitur upload gambar menu`
   * ✅ `fix: perbaiki responsive sidebar di mobile`
   * ❌ `update`, `fix`, `aaa`
4. **Pull Request (PR)**

   * Setelah selesai kerja di branch:

     ```bash
     git push origin fitur/halaman-menu
     ```
   * Buat PR ke `main` lewat GitHub.
   * Share link PR di grup (WA/Discord) untuk di-review minimal 1 anggota tim lain.
5. **Sinkron dengan `main` secara berkala**

   * Sebelum mulai kerja:

     ```bash
     git checkout main
     git pull origin main
     git checkout fitur/branch-kamu
     git merge main
     ```

### 🗄️ Catatan Environment & Database

* Semua anggota tim menggunakan **Supabase project yang sama**.
* Kalau ada perubahan skema database (tambah kolom/tabel):

  * Update script SQL di dokumentasi
  * Umumkan di grup agar semua tahu dan tidak terjadi error mendadak.

### ✅ Todo List / Progress Internal

* [v] Setup Next.js & Tailwind
* [v] Integrasi Supabase Auth (Login / Register)
* [v] Admin Dashboard (Statistik dasar)
* [v] CRUD Menu (Create, Read, Update, Delete)
* [v] Halaman Menu Public untuk Customer
* [v] Fitur Checkout WhatsApp
* [v] Dark Mode (merata)
* [v] Styling Print QR Code (kartu meja)

### 🧰 Troubleshooting Umum

* **Error `Auth session missing`**

  * Coba logout lalu login ulang di `/login`.
  * Jika masih bermasalah, hapus cookies situs `localhost:3000` lalu refresh.

* **Gambar tidak muncul**

  * Cek di Supabase → Storage:

    * Pastikan upload ke bucket yang benar (`menu-images` / `logos`).
    * Pastikan bucket `public = true` dan policy RLS mengizinkan `SELECT` publik.

* **Error TypeScript / tipe tidak terdeteksi**

  * Restart VS Code.
  * Jalankan perintah: `TypeScript: Restart TS Server` dari Command Palette.

---

*Selamat ngoding dan semangat menyelesaikan Bookletku! 🚀*
