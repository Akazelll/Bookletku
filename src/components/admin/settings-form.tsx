"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save, Loader2, Store, Phone, Palette } from "lucide-react";

export default function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false);

  // Mock Data State
  const [formData, setFormData] = useState({
    restaurantName: "Restoran Enak Jaya",
    whatsappNumber: "6281234567890",
    theme: "minimalist",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi Save ke Database
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Pengaturan berhasil disimpan!");
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSave} className='space-y-6'>
      {/* Kartu Profil Restoran */}
      <Card className='border-zinc-200 dark:border-zinc-800'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Store className='w-5 h-5 text-blue-600' />
            Profil Restoran
          </CardTitle>
          <CardDescription>
            Informasi dasar yang akan tampil di halaman menu pelanggan.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nama Restoran</Label>
            <Input
              id='name'
              value={formData.restaurantName}
              onChange={(e) =>
                setFormData({ ...formData, restaurantName: e.target.value })
              }
              placeholder='Contoh: Kopi Senja'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='wa'>Nomor WhatsApp (Penerima Pesanan)</Label>
            <div className='relative'>
              <Phone className='absolute left-3 top-2.5 h-4 w-4 text-zinc-400' />
              <Input
                id='wa'
                className='pl-9'
                value={formData.whatsappNumber}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappNumber: e.target.value })
                }
                placeholder='628...'
              />
            </div>
            <p className='text-[11px] text-zinc-500'>
              Format: Gunakan kode negara (contoh: 62812...) tanpa tanda plus
              (+).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Kartu Tampilan / Tema */}
      <Card className='border-zinc-200 dark:border-zinc-800'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Palette className='w-5 h-5 text-purple-600' />
            Tampilan Menu
          </CardTitle>
          <CardDescription>
            Pilih tema warna yang cocok dengan branding restoran Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {/* Opsi Minimalist */}
            <div
              onClick={() => setFormData({ ...formData, theme: "minimalist" })}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                formData.theme === "minimalist"
                  ? "border-black bg-zinc-50 ring-1 ring-black"
                  : "border-zinc-100 hover:border-zinc-200"
              }`}
            >
              <div className='h-16 bg-zinc-200 rounded-lg mb-3'></div>
              <p className='text-center font-semibold text-xs text-zinc-900'>
                Minimalist
              </p>
            </div>

            {/* Opsi Colorful */}
            <div
              onClick={() => setFormData({ ...formData, theme: "colorful" })}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                formData.theme === "colorful"
                  ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                  : "border-zinc-100 hover:border-zinc-200"
              }`}
            >
              <div className='h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg mb-3'></div>
              <p className='text-center font-semibold text-xs text-zinc-900'>
                Colorful
              </p>
            </div>

            {/* Opsi Dark Mode (Coming Soon) */}
            <div className='opacity-50 cursor-not-allowed p-4 rounded-xl border-2 border-zinc-100'>
              <div className='h-16 bg-zinc-800 rounded-lg mb-3'></div>
              <p className='text-center font-semibold text-xs text-zinc-400'>
                Dark (Soon)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={isLoading}
          className='bg-black hover:bg-zinc-800 text-white min-w-[140px]'
        >
          {isLoading ? (
            <Loader2 className='animate-spin mr-2 h-4 w-4' />
          ) : (
            <Save className='mr-2 h-4 w-4' />
          )}
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}
