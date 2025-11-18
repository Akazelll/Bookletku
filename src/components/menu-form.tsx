// src/components/menu-form.tsx
"use client";

import { useState, useEffect } from "react";
import { MenuItem, CATEGORIES } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Plus, ImagePlus, X, Pencil } from "lucide-react";

interface MenuFormProps {
  initialData?: MenuItem;
  isEditing: boolean;
  onSubmit: (data: any, file: File | null) => void;
  onCancel: () => void;
}

export default function MenuForm({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
}: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: CATEGORIES[0],
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        category: initialData.category,
        imageUrl: initialData.imageUrl || "",
      });
      setImagePreview(initialData.imageUrl || null);
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: CATEGORIES[0],
        imageUrl: "",
      });
      setImageFile(null);
      setImagePreview(null);
    }
  }, [isEditing, initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, imageUrl: formData.imageUrl }, imageFile);
    if (!isEditing) {
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: CATEGORIES[0],
        imageUrl: "",
      });
      setImageFile(null);
      setImagePreview(null);
    }
  };

  return (
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
            onClick={onCancel}
            className='text-red-500'
          >
            Batal
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className='space-y-5'>
        <div className='space-y-2'>
          <div className='flex items-center gap-4'>
            <div className='relative w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden'>
              {imagePreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                      setFormData((p) => ({ ...p, imageUrl: "" }));
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
                className='block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-zinc-100 hover:file:bg-zinc-200 transition-colors'
              />
              <p className='text-xs text-zinc-400 mt-2'>JPG/PNG (Max 600px)</p>
            </div>
          </div>
        </div>

        <input
          type='text'
          required
          className='w-full p-2.5 rounded-lg border bg-white dark:bg-zinc-950'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder='Nama Menu'
        />

        <div className='grid grid-cols-2 gap-4'>
          <input
            type='number'
            required
            min='0'
            className='w-full p-2.5 rounded-lg border bg-white dark:bg-zinc-950'
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            placeholder='Harga'
          />
          <select
            className='w-full p-2.5 rounded-lg border bg-white dark:bg-zinc-950'
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

        <textarea
          className='w-full p-2.5 rounded-lg border bg-white dark:bg-zinc-950 min-h-[100px]'
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder='Deskripsi...'
        />

        <Button
          type='submit'
          className='w-full bg-black text-white hover:bg-zinc-800 h-11 rounded-xl font-semibold'
        >
          {isEditing ? "Simpan Perubahan" : "Tambah Menu (Instan)"}
        </Button>
      </form>
    </div>
  );
}
