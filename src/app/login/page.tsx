"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // --- PERBAIKAN UTAMA: TRIM EMAIL ---
    // Menghapus spasi yang tidak sengaja terbawa di awal/akhir
    const cleanEmail = email.trim();

    try {
      if (isLogin) {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
        
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        // REGISTER
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
        
        alert("Registrasi berhasil! Silakan cek email Anda untuk verifikasi (jika diaktifkan) atau langsung login.");
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4'>
      <Card className='w-full max-w-md border-zinc-200 dark:border-zinc-800'>
        <CardHeader className='text-center'>
          <CardTitle>{isLogin ? "Login Admin" : "Daftar Akun"}</CardTitle>
          <CardDescription>
            Masuk untuk mengelola menu digital Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className='space-y-4'>
            <div className='space-y-2'>
              <Input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <Loader2 className='animate-spin w-4 h-4' />
              ) : isLogin ? (
                "Masuk"
              ) : (
                "Daftar"
              )}
            </Button>
            <div className='text-center text-sm text-zinc-500'>
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                type='button'
                onClick={() => setIsLogin(!isLogin)}
                className='text-blue-600 hover:underline font-medium'
              >
                {isLogin ? "Daftar sekarang" : "Login di sini"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}