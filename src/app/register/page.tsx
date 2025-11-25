"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Utensils, Mail, Lock, Store, Loader2 } from "lucide-react";
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

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = React.useState(false);
  const [restaurantName, setRestaurantName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Daftar user baru ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Simpan Nama Restoran ke tabel 'profiles'
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          restaurant_name: restaurantName,
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Gagal menyimpan nama restoran:", profileError);
          // Kita tidak throw error di sini agar user tetap terdaftar
        }
      }

      alert("Registrasi Berhasil! Silakan login.");
      router.push("/login");
    } catch (error: any) {
      alert("Gagal Mendaftar: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4 overflow-hidden'>
      {/* ... (Bagian ornamen background biarkan sama) ... */}

      <Card className='z-10 w-full max-w-sm p-0 border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-md bg-white/80 dark:bg-black/80'>
        <CardHeader className='text-center border-b border-zinc-100 dark:border-zinc-800 pb-4'>
          <div className='flex justify-center mb-2'>
            <div className='h-10 w-10 bg-black dark:bg-white rounded-lg flex items-center justify-center shadow-md'>
              <Utensils className='h-5 w-5 text-white dark:text-black' />
            </div>
          </div>
          <CardTitle className='text-2xl font-bold tracking-tight'>
            Daftar Akun Baru
          </CardTitle>
          <CardDescription>
            Buat akun untuk mulai mengelola menu digital restoran Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className='pt-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='restaurantName'>Nama Restoran</Label>
              <div className='relative'>
                <Store className='absolute left-3 top-2.5 h-4 w-4 text-zinc-400' />
                <Input
                  id='restaurantName'
                  type='text'
                  placeholder='Contoh: Restoran Enak Jaya'
                  required
                  className='pl-10'
                  disabled={isLoading}
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-2.5 h-4 w-4 text-zinc-400' />
                <Input
                  id='email'
                  type='email'
                  placeholder='contoh@email.com'
                  required
                  className='pl-10'
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-2.5 h-4 w-4 text-zinc-400' />
                <Input
                  id='password'
                  type='password'
                  placeholder='Minimal 6 karakter'
                  required
                  className='pl-10'
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type='submit'
              className='w-full h-10 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100'
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className='animate-spin mr-2 h-4 w-4' />
              ) : null}
              {isLoading ? "Mendaftar..." : "Daftar Akun"}
            </Button>
          </form>

          <div className='mt-6 text-center text-sm space-y-2'>
            <p className='text-zinc-500 dark:text-zinc-400'>
              Sudah punya akun?{" "}
              <Link
                href='/login'
                className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
              >
                Masuk di sini
              </Link>
            </p>
            <p>
              <Link
                href='/'
                className='text-zinc-500 dark:text-zinc-400 hover:underline text-xs'
              >
                &larr; Kembali ke Beranda
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
