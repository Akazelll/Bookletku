# Bookletku 📖

![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)

**Bookletku** adalah platform *SaaS (Software as a Service)* sederhana yang memungkinkan pemilik restoran, kafe, atau UMKM untuk membuat **Menu Digital** mereka sendiri dalam hitungan menit.

Pelanggan tidak perlu menginstall aplikasi apapun. Cukup **Scan QR Code**, pilih makanan, dan **Pesan via WhatsApp**.

---

## ✨ Fitur Utama

### 👨‍🍳 Untuk Pemilik Restoran (Admin)
* **Dashboard Intuitif:** Pantau statistik pengunjung dan menu populer.
* **Manajemen Menu (CRUD):** Tambah, edit, hapus menu dengan mudah.
* **Manajemen Stok:** Ganti status menu "Ready" atau "Habis" dengan satu klik.
* **QR Code Generator:** Buat dan cetak template kartu meja QR Code secara otomatis.
* **Kustomisasi:** Ubah info restoran dan pilih tema warna (Minimalist / Colorful).
* **Image Optimization:** Upload gambar menu dengan kompresi otomatis.

### 🍽️ Untuk Pelanggan (Public)
* **Tampilan Mobile-First:** Desain responsif seperti aplikasi native.
* **Pencarian & Kategori:** Fitur pencarian dan filter kategori (Sticky Navigation).
* **Keranjang Belanja:** Tambah item, atur jumlah, dan lihat estimasi harga.
* **Checkout WhatsApp:** Pesanan terformat otomatis dan dikirim ke WhatsApp kasir.
* **Tanpa Login:** Pelanggan tidak perlu mendaftar untuk memesan.

---

## 🛠️ Teknologi yang Digunakan

Project ini dibangun menggunakan teknologi web modern untuk performa dan skalabilitas:

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router).
* **Language:** [TypeScript](https://www.typescriptlang.org/).
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/).
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI).
* **Icons:** [Lucide React](https://lucide.dev/).
* **Backend & Auth:** [Supabase](https://supabase.com/).
* **Utils:** `qrcode.react` (Generate QR), `zod` (Validation).

---

## 🚀 Cara Menjalankan Project (Localhost)

Ikuti langkah ini untuk menjalankan project di komputer Anda:

### 1. Clone Repository
```bash
git clone [https://github.com/username-anda/bookletku.git](https://github.com/username-anda/bookletku.git)
cd bookletku

npm install
# atau
pnpm install

NEXT_PUBLIC_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

