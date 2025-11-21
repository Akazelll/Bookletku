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
