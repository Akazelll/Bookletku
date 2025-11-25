"use client";

import * as React from "react";
import Link from "next/link";
import { Utensils, Mail, Lock, Store, Loader2 } from "lucide-react";
// Import komponen UI yang sudah ada di proyek Anda
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
  const [isLoading, setIsLoading] = React.useState(false);
  // State untuk menyimpan nilai input
  const [restaurantName, setRestaurantName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // **********************************************
    // INI ADALAH KODE SIMULASI (DUMMY REGISTRATION)
    // **********************************************
    setTimeout(() => {
      setIsLoading(false);
      alert(
        `Simulasi Registrasi Berhasil!\nNama Resto: ${restaurantName}\nEmail: ${email}\nSekarang Anda bisa login.`
      );
      console.log("Simulasi Registrasi Berhasil.");
    }, 2000);
  };

  return (
    // Menggunakan layout full screen dengan centering dan ornamen background statis
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4 overflow-hidden">
      {/* ==================================== */}
      {/* ORNAMEN BACKGROUND MONOKROM STATIS (Sama seperti halaman login) */}
      {/* ==================================== */}
      <div
        // Lingkaran Besar Kiri Atas
        className="absolute -top-20 -left-10 w-96 h-96 bg-white dark:bg-zinc-800 rounded-full filter blur-3xl opacity-40 dark:opacity-20"
      ></div>
      <div
        // Lingkaran Sedang Kanan Bawah
        className="absolute bottom-0 -right-20 w-80 h-80 bg-zinc-200 dark:bg-zinc-700 rounded-full filter blur-3xl opacity-40 dark:opacity-20"
      ></div>
      <div
        // Lingkaran Kecil Tengah Bawah (Aksen biru lembut)
        className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-blue-200 dark:bg-blue-900 rounded-full filter blur-3xl opacity-30 dark:opacity-10"
      ></div>
      {/* ==================================== */}

      {/* Card Registrasi Utama */}
      <Card className="z-10 w-full max-w-sm p-0 border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-md bg-white/80 dark:bg-black/80">
        {/* Header Card (Logo dan Judul) */}
        <CardHeader className="text-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 bg-black dark:bg-white rounded-lg flex items-center justify-center shadow-md">
              <Utensils className="h-5 w-5 text-white dark:text-black" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Daftar Akun Baru
          </CardTitle>
          <CardDescription>
            Buat akun untuk mulai mengelola menu digital restoran Anda.
          </CardDescription>
        </CardHeader>

        {/* Konten Card (Formulir Registrasi) */}
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Restoran Field */}
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nama Restoran</Label>
              <div className="relative">
                <Store className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  id="restaurantName"
                  type="text"
                  placeholder="Contoh: Restoran Enak Jaya"
                  required
                  className="pl-10"
                  disabled={isLoading}
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contoh@email.com"
                  required
                  className="pl-10"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  required
                  className="pl-10"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <Button
              type="submit"
              className="w-full h-10 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}
              {isLoading ? "Mendaftar..." : "Daftar Akun"}
            </Button>
          </form>

          {/* Link Tambahan */}
          <div className="mt-6 text-center text-sm space-y-2">
            <p className="text-zinc-500 dark:text-zinc-400">
              Sudah punya akun?{" "}
              {/* TAUTAN SUDAH BENAR, MENGARAH KE HALAMAN LOGIN */}
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Masuk di sini
              </Link>
            </p>
            <p>
              <Link
                href="/"
                className="text-zinc-500 dark:text-zinc-400 hover:underline text-xs"
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
