"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase"; // Import storage
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Fungsi storage
import { MenuItem, CATEGORIES } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Loader2, ImagePlus, X } from "lucide-react";

export default function MenuBuilder() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<
    Omit<MenuItem, "id" | "createdAt" | "isAvailable">
  >({
    name: "",
    description: "",
    price: 0,
    category: CATEGORIES[0],
    imageUrl: "",
  });

  // State khusus untuk file gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. READ: Ambil Data
  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      if (!db) return;
      const q = query(collection(db, "menus"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const menuData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[];
      setMenus(menuData);
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Pilih Gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview lokal
    }
  };

  // 2. CREATE: Upload Gambar & Simpan Data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let downloadURL = "";

      // A. Upload ke Firebase Storage (jika ada gambar)
      if (imageFile && storage) {
        const storageRef = ref(
          storage,
          `menus/${Date.now()}_${imageFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, imageFile);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      // B. Simpan Metadata ke Firestore
      if (db) {
        await addDoc(collection(db, "menus"), {
          ...formData,
          imageUrl: downloadURL, // Link gambar dari storage
          isAvailable: true,
          createdAt: Date.now(),
        });
      }

      // C. Reset Form
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: CATEGORIES[0],
        imageUrl: "",
      });
      setImageFile(null);
      setImagePreview(null);
      fetchMenus(); // Refresh list
      alert("Menu berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Gagal menambah menu. Pastikan koneksi internet lancar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;
    try {
      if (db) {
        await deleteDoc(doc(db, "menus", id));
        setMenus(menus.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
      {/* --- FORM INPUT --- */}
      <div className='bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit'>
        <h3 className='text-lg font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-zinc-100'>
          <Plus className='w-5 h-5' /> Tambah Menu Baru
        </h3>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Upload Area */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
              Foto Makanan
            </label>
            <div className='flex items-center gap-4'>
              <div className='relative w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden group'>
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt='Preview'
                      className='w-full h-full object-cover'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <X className='w-6 h-6 text-white' />
                    </button>
                  </>
                ) : (
                  <ImagePlus className='w-8 h-8 text-zinc-400' />
                )}
              </div>
              <div className='flex-1'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-200 transition-colors'
                />
                <p className='text-xs text-zinc-400 mt-2'>
                  Format: JPG, PNG (Max 2MB)
                </p>
              </div>
            </div>
          </div>

          {/* Input Text */}
          <div>
            <label className='block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300'>
              Nama Menu
            </label>
            <input
              type='text'
              required
              className='w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black/10 outline-none transition-all'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder='Contoh: Nasi Goreng Spesial'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300'>
                Harga (Rp)
              </label>
              <input
                type='number'
                required
                min='0'
                className='w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black/10 outline-none transition-all'
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                placeholder='15000'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300'>
                Kategori
              </label>
              <select
                className='w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black/10 outline-none transition-all appearance-none'
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300'>
              Deskripsi
            </label>
            <textarea
              className='w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black/10 outline-none min-h-[100px] transition-all'
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder='Jelaskan rasa, bahan utama, atau porsi...'
            />
          </div>

          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 h-11 rounded-xl font-semibold'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='animate-spin mr-2 h-4 w-4' /> Menyimpan...
              </>
            ) : (
              <>Simpan Menu</>
            )}
          </Button>
        </form>
      </div>

      {/* --- LIST PREVIEW --- */}
      <div className='space-y-4'>
        <h3 className='text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100'>
          Daftar Menu ({menus.length})
        </h3>

        {loading ? (
          <div className='flex justify-center py-12'>
            <Loader2 className='animate-spin w-8 h-8 text-zinc-400' />
          </div>
        ) : menus.length === 0 ? (
          <div className='text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400'>
            <p>Belum ada menu yang ditambahkan.</p>
          </div>
        ) : (
          <div className='grid gap-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide'>
            {menus.map((menu) => (
              <div
                key={menu.id}
                className='flex items-start gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm group hover:border-zinc-300 transition-all'
              >
                {/* Thumbnail */}
                <div className='w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden border border-zinc-100 dark:border-zinc-700 relative'>
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-zinc-300'>
                      <ImagePlus className='w-6 h-6' />
                    </div>
                  )}
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h4 className='font-bold text-zinc-900 dark:text-zinc-100 truncate text-base'>
                        {menu.name}
                      </h4>
                      <span className='inline-block px-2 py-0.5 text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full mb-1 mt-1'>
                        {menu.category}
                      </span>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(menu.id!)}
                      className='h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 -mt-1 -mr-1'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                  <p className='text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed'>
                    {menu.description}
                  </p>
                  <p className='text-sm font-bold mt-2 text-zinc-900 dark:text-zinc-100'>
                    Rp {menu.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
