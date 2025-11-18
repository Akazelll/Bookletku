"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MenuItem, CATEGORIES } from "@/types/menu";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Loader2,
  ImagePlus,
  X,
  Pencil,
  CloudUpload,
} from "lucide-react";

// Tipe tambahan untuk handle status upload lokal
interface OptimisticMenuItem extends MenuItem {
  isPending?: boolean; // Penanda item sedang di-upload background
  tempId?: string; // ID sementara sebelum dapat ID asli dari Firebase
}

const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(
                new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.7
        );
      };
    };
  });
};

interface MenuBuilderProps {
  initialMenus?: MenuItem[];
}

export default function MenuBuilder({ initialMenus = [] }: MenuBuilderProps) {
  const [menus, setMenus] = useState<OptimisticMenuItem[]>(initialMenus);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState<
    Omit<MenuItem, "id" | "createdAt" | "isAvailable">
  >({
    name: "",
    description: "",
    price: 0,
    category: CATEGORIES[0],
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (menu: MenuItem) => {
    setIsEditing(true);
    setEditId(menu.id!);
    setFormData({
      name: menu.name,
      description: menu.description,
      price: menu.price,
      category: menu.category,
      imageUrl: menu.imageUrl || "",
    });
    setImagePreview(menu.imageUrl || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: CATEGORIES[0],
      imageUrl: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  // --- FUNGSI BACKGROUND UPLOAD (RAHASIA KECEPATAN) ---
  const processBackgroundSave = async (
    tempData: OptimisticMenuItem,
    file: File | null,
    mode: "create" | "update",
    targetId?: string
  ) => {
    try {
      let downloadURL = tempData.imageUrl || "";

      // 1. Upload di Background
      if (file && storage) {
        const compressedFile = await compressImage(file);
        const storageRef = ref(
          storage,
          `menus/${Date.now()}_${compressedFile.name}`
        );
        const snapshot = await uploadBytes(storageRef, compressedFile);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      if (!db) return;

      if (mode === "create") {
        // 2. Simpan ke DB
        const docRef = await addDoc(collection(db, "menus"), {
          name: tempData.name,
          description: tempData.description,
          price: tempData.price,
          category: tempData.category,
          imageUrl: downloadURL,
          isAvailable: true,
          createdAt: tempData.createdAt,
        });

        // 3. Update UI: Ganti item "Temp" dengan item "Asli" (Ada ID Database)
        setMenus((prev) =>
          prev.map((m) =>
            m.tempId === tempData.tempId
              ? { ...m, id: docRef.id, imageUrl: downloadURL, isPending: false } // Hapus flag pending
              : m
          )
        );
      } else if (mode === "update" && targetId) {
        const menuRef = doc(db, "menus", targetId);
        await updateDoc(menuRef, {
          ...formData,
          name: tempData.name,
          description: tempData.description,
          price: tempData.price,
          category: tempData.category,
          imageUrl: downloadURL,
        });

        // Update UI: Matikan flag pending
        setMenus((prev) =>
          prev.map((m) =>
            m.id === targetId
              ? { ...m, imageUrl: downloadURL, isPending: false }
              : m
          )
        );
      }
    } catch (error) {
      console.error("Background sync failed:", error);
      alert("Gagal menyimpan data ke server. Cek koneksi internet Anda.");
      // Rollback jika create gagal
      if (mode === "create") {
        setMenus((prev) => prev.filter((m) => m.tempId !== tempData.tempId));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = Date.now();
    const tempId = `temp_${timestamp}`; // ID sementara
    const localImageUrl = imagePreview || formData.imageUrl;

    if (isEditing && editId) {
      // --- OPTIMISTIC UPDATE ---
      // 1. Update UI Langsung
      setMenus((prev) =>
        prev.map((m) =>
          m.id === editId
            ? {
                ...m,
                ...formData,
                imageUrl: localImageUrl || "",
                isPending: true,
              }
            : m
        )
      );

      // 2. Jalan di Background
      processBackgroundSave(
        { ...formData, createdAt: timestamp } as OptimisticMenuItem,
        imageFile,
        "update",
        editId
      );
    } else {
      // --- OPTIMISTIC CREATE ---
      const newItem: OptimisticMenuItem = {
        id: tempId, // Pakai ID sementara dulu
        tempId: tempId,
        ...formData,
        imageUrl: localImageUrl || "",
        isAvailable: true,
        createdAt: timestamp,
        isPending: true, // Tandai sedang loading
      };

      // 1. Tampil Langsung! (0 Detik)
      setMenus((prev) => [newItem, ...prev]);

      // 2. Jalan di Background
      processBackgroundSave(newItem, imageFile, "create");
    }

    // 3. Reset Form Langsung
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus menu ini?")) return;
    const oldMenus = [...menus];
    setMenus(menus.filter((m) => m.id !== id)); // Optimistic delete

    try {
      if (db) await deleteDoc(doc(db, "menus", id));
    } catch (error) {
      console.error("Delete error:", error);
      setMenus(oldMenus);
      alert("Gagal menghapus (Offline/Error).");
    }
  };

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
      {/* FORM INPUT */}
      <div className='bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit sticky top-24'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100'>
            {isEditing ? (
              <Pencil className='w-5 h-5' />
            ) : (
              <Plus className='w-5 h-5' />
            )}
            {isEditing ? "Edit Menu" : "Tambah Menu Baru"}
          </h3>
          {isEditing && (
            <Button
              variant='ghost'
              size='sm'
              onClick={resetForm}
              className='text-red-500'
            >
              Batal
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
              Foto Makanan
            </label>
            <div className='flex items-center gap-4'>
              <div className='relative w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden'>
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
                        setFormData({ ...formData, imageUrl: "" });
                      }}
                      className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'
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
                  className='block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 hover:file:bg-zinc-200 transition-colors'
                />
                <p className='text-xs text-zinc-400 mt-2'>
                  Format: JPG, PNG (Max 2MB)
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1.5'>
              Nama Menu
            </label>
            <input
              type='text'
              required
              className='w-full p-2.5 rounded-lg border border-zinc-300 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-black/10 outline-none'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder='Contoh: Nasi Goreng'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1.5'>
                Harga (Rp)
              </label>
              <input
                type='number'
                required
                min='0'
                className='w-full p-2.5 rounded-lg border border-zinc-300 bg-white dark:bg-zinc-950 outline-none'
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                placeholder='15000'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1.5'>
                Kategori
              </label>
              <select
                className='w-full p-2.5 rounded-lg border border-zinc-300 bg-white dark:bg-zinc-950 outline-none'
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
            <label className='block text-sm font-medium mb-1.5'>
              Deskripsi
            </label>
            <textarea
              className='w-full p-2.5 rounded-lg border border-zinc-300 bg-white dark:bg-zinc-950 outline-none min-h-[100px]'
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder='Penjelasan menu...'
            />
          </div>

          <Button
            type='submit'
            className='w-full bg-black text-white hover:bg-zinc-800 h-11 rounded-xl font-semibold'
          >
            {isEditing ? "Simpan Perubahan" : "Tambah Menu (Instan)"}
          </Button>
        </form>
      </div>

      {/* LIST PREVIEW */}
      <div className='space-y-4'>
        <h3 className='text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100'>
          Daftar Menu ({menus.length})
        </h3>
        {menus.length === 0 ? (
          <div className='text-center py-12 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400'>
            <p>Belum ada menu.</p>
          </div>
        ) : (
          <div className='grid gap-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide'>
            {menus.map((menu) => (
              <div
                key={menu.id}
                className={`relative flex items-start gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm transition-all ${
                  menu.isPending
                    ? "opacity-70 border-blue-200 bg-blue-50/30"
                    : "border-zinc-200"
                } ${
                  editId === menu.id ? "border-black ring-1 ring-black" : ""
                }`}
              >
                {/* Indikator Uploading */}
                {menu.isPending && (
                  <div className='absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded-full z-10'>
                    <CloudUpload className='w-3 h-3 animate-bounce' />
                    Menyimpan...
                  </div>
                )}

                <div className='w-20 h-20 bg-zinc-100 rounded-lg flex-shrink-0 overflow-hidden border border-zinc-100 relative'>
                  {menu.imageUrl ? (
                    // Gunakan <img> biasa untuk blob lokal agar preview instan (Next Image kadang butuh prop src yang valid server-side)
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
                      <span className='inline-block px-2 py-0.5 text-[10px] font-medium bg-zinc-100 text-zinc-600 rounded-full mb-1 mt-1'>
                        {menu.category}
                      </span>
                    </div>
                    <div className='flex gap-1 -mr-2 -mt-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        disabled={menu.isPending}
                        onClick={() => handleEdit(menu)}
                        className='h-8 w-8 text-zinc-400 hover:text-blue-600'
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        disabled={menu.isPending}
                        onClick={() => handleDelete(menu.id!)}
                        className='h-8 w-8 text-zinc-400 hover:text-red-600'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  <p className='text-sm text-zinc-500 line-clamp-2 mt-1'>
                    {menu.description}
                  </p>
                  <p className='text-sm font-bold mt-2 text-zinc-900'>
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
