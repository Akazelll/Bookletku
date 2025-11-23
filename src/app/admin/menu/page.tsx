<<<<<<< HEAD
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { MenuItem } from "@/types/menu";
import MenuPublic from "@/components/menu-public";

// --- PERBAIKAN UTAMA DI SINI ---
// Gunakan "force-dynamic" agar halaman tidak di-cache.
// Ini memaksa server mengambil data terbaru setiap kali halaman dibuka.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  let menus: MenuItem[] = [];
  let theme = "minimalist";

  try {
    console.log("🔍 [Server] Sedang mengambil data menu...");

    // 1. Ambil Data Menu
    // Kita tidak butuh timeout rumit jika koneksi database sudah benar
    const menusRef = collection(db, "menus");
    const q = query(menusRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    menus = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];

    console.log(`✅ [Server] Berhasil mendapatkan ${menus.length} item menu.`);

    // 2. Ambil Setting Tema
    try {
      const settingsRef = doc(db, "settings", "general");
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        theme = settingsSnap.data().theme || "minimalist";
      }
    } catch (e) {
      // Error tema tidak fatal, abaikan saja
      console.warn("Info: Menggunakan tema default.");
    }
  } catch (error: any) {
    console.error("❌ [CRITICAL ERROR] Gagal mengambil data:", error);
    // Jika error code masih 'not-found', berarti firebase.ts belum ter-reload sempurna
    if (error.code === "not-found") {
      console.error("Solusi: Matikan server (Ctrl+C) lalu nyalakan lagi.");
    }
  }

  // 3. Render Client Component
  return <MenuPublic initialMenus={menus} initialTheme={theme} />;
}
=======
import { getMenus } from "@/services/menu-service";
import MenuListWrapper from "@/components/admin/menu-list-wrapper";
import CreateMenuDialog from "@/components/admin/create-menu-dialog";

// Memaksa render dinamis agar data selalu fresh saat halaman dibuka
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  // Fetch data menu dari Supabase
  const menus = await getMenus();

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header Halaman */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Manajemen Menu
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
            Atur daftar menu, harga, dan ketersediaan stok restoran Anda.
          </p>
        </div>

        {/* Tombol Tambah Menu */}
        <CreateMenuDialog />
      </div>

      {/* Container List Menu */}
      <div className='bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-1'>
        <div className='p-4 sm:p-6'>
          <MenuListWrapper initialMenus={menus} viewMode="management" />
        </div>
      </div>
    </div>
  );
}
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
