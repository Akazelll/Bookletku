// src/services/menu-service.ts
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MenuItem } from "@/types/menu";
import { compressImage } from "@/lib/image-utils";

export const MenuService = {
  async uploadImage(file: File): Promise<string> {
    console.log("🚀 Upload dimulai...");
    if (!storage) throw new Error("Storage belum siap.");

    try {
      // 1. Kompres
      console.log("🖼️ Mengompres gambar...");
      const compressedFile = await compressImage(file);

      // 2. Reference
      const fileName = `menus/${Date.now()}_${compressedFile.name.replace(
        /\s+/g,
        "_"
      )}`; // Hapus spasi di nama file
      const storageRef = ref(storage, fileName);

      // 3. Upload
      console.log(`⬆️ Mengupload ke: ${fileName}`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      console.log("✅ Upload file sukses, mengambil URL...");

      // 4. Get URL
      const url = await getDownloadURL(snapshot.ref);
      console.log("🔗 URL didapat:", url);
      return url;
    } catch (error: any) {
      console.error("❌ Upload Gagal:", error);
      // Deteksi error spesifik
      if (error.code === "storage/unauthorized") {
        throw new Error("Izin ditolak. Cek Rules Storage di Firebase Console.");
      } else if (error.code === "storage/retry-limit-exceeded") {
        throw new Error("Koneksi lambat/putus. Gagal upload.");
      } else if (error.code === "storage/canceled") {
        throw new Error("Upload dibatalkan.");
      }
      throw error;
    }
  },

  async add(menu: Omit<MenuItem, "id">) {
    if (!db) throw new Error("Koneksi Database terputus.");
    const cleanData = JSON.parse(JSON.stringify(menu)); // Hapus undefined
    return await addDoc(collection(db, "menus"), cleanData);
  },

  async update(id: string, data: Partial<MenuItem>) {
    if (!db) throw new Error("Koneksi Database terputus.");
    const menuRef = doc(db, "menus", id);
    const cleanData = JSON.parse(JSON.stringify(data));
    await updateDoc(menuRef, cleanData);
  },

  async delete(id: string) {
    if (!db) throw new Error("Koneksi Database terputus.");
    await deleteDoc(doc(db, "menus", id));
  },
};
