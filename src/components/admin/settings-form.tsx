"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save, Loader2, Store, Phone, Palette, Check, ImagePlus, X, Link as LinkIcon } from "lucide-react";
import { getSettings, saveSettings, uploadLogo } from "@/services/settings-service";

export default function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    restaurantName: "",
    whatsappNumber: "",
    theme: "minimalist",
    slug: "",
    description: "",
    logoUrl: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSettings();
        if (data) {
          setFormData({
            restaurantName: data.restaurantName || "",
            whatsappNumber: data.whatsappNumber || "",
            theme: data.theme || "minimalist",
            slug: data.slug || "",
            description: data.description || "",
            logoUrl: data.logoUrl || "",
          });
          if (data.logoUrl) setPreviewLogo(data.logoUrl);
        }
      } catch (error) {
        console.error("Gagal memuat pengaturan:", error);
      } finally {
        setIsFetching(false);
      }
    }
    loadData();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalLogoUrl = formData.logoUrl;

      // Upload logo jika ada file baru dipilih
      if (logoFile) {
        finalLogoUrl = await uploadLogo(logoFile);
      }

      await saveSettings({ ...formData, logoUrl: finalLogoUrl });
      alert("Pengaturan berhasil disimpan!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      // Handle error duplicate slug (kode error PostgreSQL 23505)
      if (error.code === "23505" && error.message?.includes("slug")) {
        alert("Gagal: URL Toko (Slug) ini sudah dipakai orang lain. Silakan ganti.");
      } else {
        const message = error?.message || "Terjadi kesalahan saat menyimpan.";
        alert(`Gagal menyimpan: ${message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper untuk membersihkan slug (hanya a-z, 0-9, -)
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, slug: val });
  };

  if (isFetching) {
    return (
      <div className="flex h-40 items-center justify-center text-zinc-500">
        <Loader2 className="animate-spin mr-2 h-5 w-5" />
        Memuat pengaturan...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className='space-y-6'>
      
      {/* --- KARTU PROFIL RESTORAN --- */}
      <Card className='border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Store className='w-5 h-5 text-blue-600' />
            Profil Restoran
          </CardTitle>
          <CardDescription>
            Informasi dasar toko Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          
          {/* Upload Logo */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="space-y-2">
              <Label>Logo Toko</Label>
              <div className='relative w-28 h-28 bg-zinc-50 dark:bg-zinc-800 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden group'>
                {previewLogo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewLogo}
                      alt='Logo Preview'
                      className='w-full h-full object-cover transition-opacity group-hover:opacity-75'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setLogoFile(null);
                        setPreviewLogo(null);
                        setFormData((p) => ({ ...p, logoUrl: "" }));
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
              <div className="w-28">
                <label 
                  htmlFor="logo-upload" 
                  className="block text-xs text-center text-blue-600 cursor-pointer hover:underline mt-1"
                >
                  Ubah Logo
                </label>
                <Input
                  id="logo-upload"
                  type='file'
                  accept='image/*'
                  onChange={handleLogoChange}
                  className='hidden'
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className='space-y-2'>
                <Label htmlFor='name'>Nama Restoran</Label>
                <Input
                  id='name'
                  value={formData.restaurantName}
                  onChange={(e) =>
                    setFormData({ ...formData, restaurantName: e.target.value })
                  }
                  placeholder='Contoh: Kopi Senja'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='slug'>URL Toko (Slug)</Label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-zinc-400 text-sm select-none">
                    bookletku.com/
                  </div>
                  <Input
                    id='slug'
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className="pl-32 font-mono text-sm"
                    placeholder='kopi-senja'
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Unik. Gunakan huruf kecil dan tanda strip (-) saja.
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='desc'>Deskripsi Singkat</Label>
            <Textarea 
              id="desc"
              placeholder="Contoh: Tempat ngopi paling asik se-Jakarta Selatan."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="h-20"
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
                required
              />
            </div>
            <p className='text-[11px] text-zinc-500'>
              Format: Gunakan kode negara (contoh: 62812...) tanpa tanda plus (+).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* --- KARTU TAMPILAN MENU --- */}
      <Card className='border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Palette className='w-5 h-5 text-orange-600' />
            Tampilan Menu
          </CardTitle>
          <CardDescription>
            Pilih tema warna yang cocok dengan branding restoran Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            
            {/* 1. Opsi Minimalist */}
            <div
              onClick={() => setFormData({ ...formData, theme: "minimalist" })}
              className={`relative cursor-pointer group overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                formData.theme === "minimalist"
                  ? "border-black ring-1 ring-black/10 shadow-md scale-[1.02]"
                  : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
              }`}
            >
              {formData.theme === "minimalist" && (
                <div className="absolute top-2 right-2 z-10 bg-black text-white rounded-full p-1">
                  <Check className="w-3 h-3" />
                </div>
              )}
              
              {/* Preview Visual Mini */}
              <div className="bg-zinc-50 p-3 h-28 flex flex-col justify-between relative">
                 <div className="w-8 h-2 bg-black rounded-sm mb-2"></div>
                 <div className="space-y-2">
                    <div className="flex gap-2 bg-white p-1.5 rounded border border-zinc-100 shadow-sm">
                        <div className="w-8 h-8 bg-zinc-100 rounded flex-shrink-0"></div>
                        <div className="flex-1 space-y-1">
                            <div className="w-12 h-1.5 bg-zinc-200 rounded-full"></div>
                            <div className="w-8 h-1.5 bg-zinc-800 rounded-full"></div>
                        </div>
                        <div className="w-4 h-4 bg-black rounded-full self-end"></div>
                    </div>
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-1.5 border-t border-zinc-100 text-center">
                    <p className="font-bold text-xs text-zinc-900">Minimalist</p>
                 </div>
              </div>
            </div>

            {/* 2. Opsi Colorful */}
            <div
              onClick={() => setFormData({ ...formData, theme: "colorful" })}
              className={`relative cursor-pointer group overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                formData.theme === "colorful"
                  ? "border-orange-500 ring-1 ring-orange-500/20 shadow-md scale-[1.02]"
                  : "border-zinc-200 hover:border-orange-200 hover:shadow-sm"
              }`}
            >
              {formData.theme === "colorful" && (
                <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full p-1 shadow-md">
                  <Check className="w-3 h-3" />
                </div>
              )}

              <div className="bg-orange-50/60 p-3 h-28 flex flex-col justify-between relative">
                 <div className="w-8 h-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-sm mb-2"></div>
                 <div className="space-y-2">
                    <div className="flex gap-2 bg-white p-1.5 rounded border border-orange-100 shadow-sm">
                        <div className="w-8 h-8 bg-orange-100 rounded flex-shrink-0"></div>
                        <div className="flex-1 space-y-1">
                            <div className="w-12 h-1.5 bg-orange-200 rounded-full"></div>
                            <div className="w-8 h-1.5 bg-orange-600 rounded-full"></div>
                        </div>
                        <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full self-end shadow-sm"></div>
                    </div>
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-1.5 border-t border-orange-100 text-center">
                    <p className="font-bold text-xs text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Colorful</p>
                 </div>
              </div>
            </div>

            {/* 3. Dark Mode (Coming Soon) */}
            <div className='opacity-50 cursor-not-allowed relative rounded-xl border-2 border-zinc-800 overflow-hidden bg-zinc-950'>
                <div className="p-3 h-28 flex flex-col items-center justify-center text-zinc-500 gap-1">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                    </div>
                    <span className="text-xs font-medium text-zinc-400">Dark Mode</span>
                    <span className="text-[9px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">Soon</span>
                </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <Button
          type='submit'
          disabled={isLoading}
          className='bg-black hover:bg-zinc-800 text-white min-w-[140px] h-11 rounded-xl shadow-lg shadow-zinc-500/10'
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