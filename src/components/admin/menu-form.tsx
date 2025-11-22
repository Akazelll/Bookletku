"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MenuItem, CATEGORIES } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, ImagePlus, X } from "lucide-react";
import {
  createMenu,
  updateMenu,
  uploadMenuImage,
} from "@/services/menu-service";

interface MenuFormProps {
  initialData?: MenuItem;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export default function MenuForm({
  initialData,
  isEditing = false,
  onSuccess,
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

      if (imageFile) {
        finalImageUrl = await uploadMenuImage(imageFile);
      }

      const payload = { ...formData, imageUrl: finalImageUrl };

      if (isEditing && initialData?.id) {
        await updateMenu(initialData.id, payload);
      } else {
        await createMenu(payload);
      }

      router.refresh();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error saving menu:", error);
      alert(`Gagal menyimpan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Image Upload */}
      <div className='space-y-2'>
        <Label>Foto Menu</Label>
        <div className='flex gap-4 items-center'>
          <div className='relative w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden group'>
            {preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt='Preview'
                  className='w-full h-full object-cover transition-opacity group-hover:opacity-75'
                />
                <button
                  type='button'
                  onClick={() => {
                    setImageFile(null);
                    setPreview(null);
                    setFormData((p) => ({ ...p, imageUrl: "" }));
                  }}
                  className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-all'
                >
                  <X className='w-6 h-6 text-white' />
                </button>
              </>
            ) : (
              <ImagePlus className='w-8 h-8 text-zinc-400' />
            )}
          </div>
          <div className='flex-1'>
            <Input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='cursor-pointer'
            />
            <p className='text-[10px] text-zinc-500 mt-1'>
              Format: JPG, PNG. Max 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Nama Menu */}
      <div className='space-y-2'>
        <Label htmlFor='name'>Nama Menu</Label>
        <Input
          id='name'
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder='Contoh: Nasi Goreng Spesial'
        />
      </div>

      {/* Harga & Kategori */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='price'>Harga (Rp)</Label>
          <Input
            id='price'
            type='number'
            required
            min='0'
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='category'>Kategori</Label>
          <select
            id='category'
            className='flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
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
        <Label htmlFor='desc'>Deskripsi</Label>
        <Textarea
          id='desc'
          className='min-h-[80px]'
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder='Jelaskan detail menu ini...'
        />
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? (
          <Loader2 className='animate-spin mr-2 w-4 h-4' />
        ) : (
          <Save className='mr-2 w-4 h-4' />
        )}
        {isEditing ? "Simpan Perubahan" : "Buat Menu"}
      </Button>
    </form>
  );
}
