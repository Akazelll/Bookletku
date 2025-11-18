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

// Revalidate data setiap 60 detik (ISR)
export const revalidate = 60;

export default async function MenuPage() {
  let menus: MenuItem[] = [];
  let theme = "minimalist";

  try {
    // 1. Ambil Data Menu
    // Gunakan timeout race agar tidak hanging selamanya jika offline
    const menuDataPromise = (async () => {
      const menusRef = collection(db, "menus");
      const q = query(menusRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[];
    })();

    // Batasi waktu tunggu server maks 5 detik
    const timeoutPromise = new Promise<MenuItem[]>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 5000)
    );

    menus = await Promise.race([menuDataPromise, timeoutPromise]);

    // 2. Ambil Setting Tema
    try {
      const settingsRef = doc(db, "settings", "general");
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        theme = settingsSnap.data().theme || "minimalist";
      }
    } catch (e) {
      console.warn("Gagal load theme, pakai default.");
    }
  } catch (error) {
    console.error("⚠️ Gagal mengambil menu di server (Offline/Error):", error);
    // Kita biarkan menus kosong [], jadi halaman tetap tampil (kosong)
    // daripada error 500 "Runtime Error".
  }

  // 3. Render Client Component
  return <MenuPublic initialMenus={menus} initialTheme={theme} />;
}
