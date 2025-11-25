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
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cleanEmail = email.trim();

    try {
      if (isLogin) {
        // --- LOGIKA LOGIN ---
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (authError) throw authError;

        if (authData.user) {
          // Cek Role user ini di database
          const { data: roleData, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", authData.user.id)
            .single();

          // Jika error atau role kosong, anggap sebagai 'user' biasa
          const role = roleData?.role || "user";

          // Redirect sesuai role
          if (role === "owner" || role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/menu/public");
          }
          router.refresh();
        }

      } else {
        // --- LOGIKA REGISTER ---
        // 1. Buat Akun Auth
        const { error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });
        
        if (signUpError) throw signUpError;
        
        alert("Registrasi berhasil! Silakan login.");
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4'>
      <Card className='w-full max-w-md border-zinc-200 dark:border-zinc-800'>
        <CardHeader className='text-center'>
          <CardTitle>{isLogin ? "Login System" : "Daftar Akun"}</CardTitle>
          <CardDescription>
            {isLogin ? "Masuk untuk mengelola restoran atau memesan." : "Buat akun baru untuk mulai memesan."}
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
              <button
                type='button'
                onClick={() => setIsLogin(!isLogin)}
                className='text-blue-600 hover:underline font-medium'
              >
                {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Login"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}