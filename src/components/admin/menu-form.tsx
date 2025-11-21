// src/components/admin/menu-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MenuItem, CATEGORIES } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, ImagePlus, X } from "lucide-react";
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

      // Redirect kembali ke dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("Gagal menyimpan menu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800'>
      <div className='flex items-center gap-4 mb-6'>
        <Button variant='ghost' onClick={() => router.back()} type='button'>
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <h1 className='text-2xl font-bold text-zinc-900 dark:text-zinc-100'>
          {isEditing ? "Edit Menu" : "Tambah Menu Baru"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Image Upload */}
        <div className='space-y-2'>
          <label className='font-medium text-sm text-zinc-900 dark:text-zinc-100'>
            Foto Menu
          </label>
          <div className='flex gap-4 items-center'>
            <div className='w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden relative'>
              {preview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt='Preview'
                    className='w-full h-full object-cover'
                  />
                  <button
                    type='button'
                    onClick={() => {
                      setImageFile(null);
                      setPreview(null);
                      setFormData((p) => ({ ...p, imageUrl: "" }));
                    }}
                    className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'
                  >
                    <X className='w-6 h-6 text-white' />
                  </button>
                </>
              ) : (
                <ImagePlus className='text-zinc-400 w-8 h-8' />
              )}
            </div>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200'
            />
          </div>
        </div>

        {/* Nama Menu */}
        <div className='space-y-2'>
          <label className='font-medium text-sm text-zinc-900 dark:text-zinc-100'>
            Nama Menu
          </label>
          <input
            required
            className='w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='Contoh: Nasi Goreng Spesial'
          />
        </div>

        {/* Harga & Kategori */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='font-medium text-sm text-zinc-900 dark:text-zinc-100'>
              Harga (Rp)
            </label>
            <input
              type='number'
              required
              min='0'
              className='w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm'
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
          </div>
          <div className='space-y-2'>
            <label className='font-medium text-sm text-zinc-900 dark:text-zinc-100'>
              Kategori
            </label>
            <select
              className='w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm'
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
          <label className='font-medium text-sm text-zinc-900 dark:text-zinc-100'>
            Deskripsi
          </label>
          <textarea
            className='w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm min-h-[100px]'
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder='Jelaskan menu ini...'
          />
        </div>

        <Button
          type='submit'
          className='w-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 h-11 rounded-xl'
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
