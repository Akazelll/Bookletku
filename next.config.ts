import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
<<<<<<< HEAD
=======
      // Pola lama (Firebase) bisa dihapus atau dibiarkan jika masih ada sisa data
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      },
<<<<<<< HEAD
=======
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
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
    ],
  },
  reactStrictMode: false,
};

<<<<<<< HEAD
export default nextConfig;
=======
export default nextConfig;
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
