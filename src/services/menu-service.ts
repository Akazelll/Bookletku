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

// FUNGSI TIMEOUT: Batasi waktu tunggu maksimal 10 detik
// Jika lewat 10 detik, kita anggap gagal dan munculkan error
const withTimeout = <T>(promise: Promise<T>, ms = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error("TIMEOUT: Database tidak merespon. Cek koneksi/Rules.")
          ),
        ms
      )
    ),
  ]) as Promise<T>;
};

export const MenuService = {
  async uploadImage(file: File): Promise<string> {
    if (!storage) throw new Error("Storage error.");

    // Kompres & Upload
    const compressedFile = await compressImage(file);
    // Bersihkan nama file dari karakter aneh
    const cleanName = compressedFile.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const storageRef = ref(storage, `menus/${Date.now()}_${cleanName}`);

    // Upload (Kasih waktu agak lama buat gambar: 30 detik)
    const snapshot = await withTimeout(
      uploadBytes(storageRef, compressedFile),
      30000
    );
    return await getDownloadURL(snapshot.ref);
  },

  async add(menu: Omit<MenuItem, "id">) {
    if (!db) throw new Error("Database belum terhubung.");

    // Hapus field undefined
    const cleanData = JSON.parse(JSON.stringify(menu));

    console.log("💾 Mencoba menyimpan ke Firestore...");
    // Simpan dengan timeout 10 detik
    return await withTimeout(addDoc(collection(db, "menus"), cleanData));
  },

  async update(id: string, data: Partial<MenuItem>) {
    if (!db) throw new Error("Database belum terhubung.");
    const menuRef = doc(db, "menus", id);
    const cleanData = JSON.parse(JSON.stringify(data));
    await withTimeout(updateDoc(menuRef, cleanData));
  },

  async delete(id: string) {
    if (!db) throw new Error("Database belum terhubung.");
    await withTimeout(deleteDoc(doc(db, "menus", id)));
  },
};
