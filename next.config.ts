import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Pola lama (Firebase) bisa dihapus atau dibiarkan jika masih ada sisa data
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      },
      // --- TAMBAHAN WAJIB UNTUK SUPABASE ---
      {
        protocol: "https",
        hostname: "mexlfixrlvuregfnxqsd.supabase.co", // Hostname project Supabase Anda
        pathname: "**",
      },
      // Jika ada gambar dummy dari Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
export default nextConfig;
