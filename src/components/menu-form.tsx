// src/components/admin/menu-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MenuItem, CATEGORIES } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Pastikan sudah ada komponen UI ini
import { Label } from "@/components/ui/label"; // Opsional: shadcn label
import { ArrowLeft, Save, Loader2, ImagePlus } from "lucide-react";
// Import service Anda (asumsi sudah migrasi ke Supabase)
import {
  createMenu,
  updateMenu,
  uploadMenuImage,
} from "@/services/menu-service";

interface MenuFormProps {
  initialData?: MenuItem;
  isEditing?: boolean;
}

export default function MenuForm({
  initialData,
  isEditing = false,
}: MenuFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>(
    initialData || {
      name: "",
      description: "",
      price: 0,
      category: CATEGORIES[0],
      imageUrl: "",
      isAvailable: true,
    }
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // 1. Upload Image jika ada file baru
      if (imageFile) {
        finalImageUrl = await uploadMenuImage(imageFile);
      }

      const payload = { ...formData, imageUrl: finalImageUrl };

      if (isEditing && initialData?.id) {
        await updateMenu(initialData.id, payload);
      } else {
        await createMenu(payload);
      }

      router.push("/dashboard"); // Kembali ke dashboard setelah save
      router.refresh(); // Refresh data dashboard
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("Gagal menyimpan menu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-zinc-200'>
      <div className='flex items-center gap-4 mb-6'>
        <Button variant='ghost' onClick={() => router.back()}>
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <h1 className='text-2xl font-bold'>
          {isEditing ? "Edit Menu" : "Tambah Menu Baru"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Image Upload */}
        <div className='space-y-2'>
          <label className='font-medium text-sm'>Foto Menu</label>
          <div className='flex gap-4 items-center'>
            <div className='w-24 h-24 bg-zinc-100 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-300 overflow-hidden relative'>
              {preview ? (
                <img
                  src={preview}
                  alt='Preview'
                  className='w-full h-full object-cover'
                />
              ) : (
                <ImagePlus className='text-zinc-400' />
              )}
            </div>
            <input type='file' accept='image/*' onChange={handleImageChange} />
          </div>
        </div>

        {/* Nama Menu */}
        <div className='space-y-2'>
          <label className='font-medium text-sm'>Nama Menu</label>
          <input
            required
            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='Contoh: Nasi Goreng Spesial'
          />
        </div>

        {/* Harga & Kategori */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='font-medium text-sm'>Harga (Rp)</label>
            <input
              type='number'
              required
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors'
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
          </div>
          <div className='space-y-2'>
            <label className='font-medium text-sm'>Kategori</label>
            <select
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors'
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

        {/* Deskripsi */}
        <div className='space-y-2'>
          <label className='font-medium text-sm'>Deskripsi</label>
          <textarea
            className='flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm'
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <Button
          type='submit'
          className='w-full bg-black text-white hover:bg-zinc-800'
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className='animate-spin mr-2' />
          ) : (
            <Save className='mr-2 w-4 h-4' />
          )}
          {isEditing ? "Simpan Perubahan" : "Buat Menu"}
        </Button>
      </form>
    </div>
  );
}
