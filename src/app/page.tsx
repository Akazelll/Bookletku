import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  QrCode,
  Smartphone,
  Zap,
  CheckCircle2,
  Store,
  BarChart3,
  Utensils,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-orange-100 selection:text-orange-900">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold shadow-sm">
              <Utensils className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Bookletku
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link
              href="#features"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Fitur
            </Link>
            <Link
              href="#demo"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Contoh
            </Link>
            <Link
              href="#pricing"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              Harga
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="rounded-full px-6 bg-black hover:bg-zinc-800 dark:bg-white dark:text-black"
              >
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-orange-400 opacity-20 blur-[100px]"></div>

        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 rounded-full border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 shadow-sm animate-in fade-in zoom-in duration-500"
          >
            <span className="mr-2">✨</span> Solusi Digital No. #1 untuk UMKM
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
            Bikin Menu Digital <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
              Tanpa Ribet, Tanpa Aplikasi.
            </span>
          </h1>

          <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
            Tingkatkan omset restoran Anda dengan menu QR Code yang modern.
            Pelanggan scan, pilih menu, dan pesan langsung via WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full h-12 text-base rounded-full bg-black hover:bg-zinc-800 dark:bg-white dark:text-black shadow-xl shadow-zinc-200/50"
              >
                Buat Menu Gratis
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#demo" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base rounded-full border-zinc-200 bg-white hover:bg-zinc-50"
              >
                <QrCode className="mr-2 w-4 h-4" />
                Lihat Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- MOCKUP / PREVIEW --- */}
      <section id="demo" className="pb-24 px-4">
        <div className="container mx-auto">
          <div className="relative max-w-5xl mx-auto">
            {/* Visual Frame */}
            <div className="relative rounded-3xl border border-zinc-200 bg-zinc-100/50 dark:bg-zinc-900/50 p-2 md:p-4 shadow-2xl">
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 relative aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group">
                {/* Simulated UI */}
                <div className="absolute inset-0 flex flex-col md:flex-row">
                  {/* Left Panel (Admin) */}
                  <div className="w-full md:w-1/2 p-8 border-r border-zinc-100 flex flex-col justify-center space-y-6 bg-white">
                    <div className="space-y-2">
                      <div className="h-2 w-24 bg-zinc-100 rounded mb-4"></div>
                      <h3 className="text-2xl font-bold text-zinc-900">
                        Dashboard Admin
                      </h3>
                      <p className="text-zinc-500">
                        Kelola stok dan harga semudah update status.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-zinc-50">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold">
                          1
                        </div>
                        <div className="text-sm font-medium text-zinc-700">
                          Upload Foto Makanan
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-zinc-50">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                          2
                        </div>
                        <div className="text-sm font-medium text-zinc-700">
                          Atur Harga & Kategori
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-zinc-50">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">
                          3
                        </div>
                        <div className="text-sm font-medium text-zinc-700">
                          Download QR Code
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel (Mobile View) */}
                  <div className="hidden md:flex w-1/2 bg-zinc-50 items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                    <div className="w-64 h-[500px] bg-white rounded-[2.5rem] border-8 border-zinc-900 shadow-2xl relative overflow-hidden transform rotate-[-5deg] transition-transform group-hover:rotate-0 duration-500">
                      {/* Mobile UI Mockup */}
                      <div className="h-full w-full bg-zinc-50 flex flex-col">
                        <div className="h-14 bg-white border-b flex items-center px-4 justify-between">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
                          <div className="w-20 h-3 bg-zinc-100 rounded"></div>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="h-32 bg-zinc-200 rounded-xl animate-pulse"></div>
                          <div className="flex gap-2">
                            <div className="h-8 w-20 bg-zinc-900 rounded-full"></div>
                            <div className="h-8 w-20 bg-zinc-200 rounded-full"></div>
                          </div>
                          <div className="space-y-2 pt-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="h-20 bg-white rounded-xl border border-zinc-100 flex p-2 gap-3"
                              >
                                <div className="w-16 h-16 bg-zinc-100 rounded-lg"></div>
                                <div className="flex-1 py-1 space-y-2">
                                  <div className="w-24 h-3 bg-zinc-100 rounded"></div>
                                  <div className="w-12 h-3 bg-zinc-100 rounded"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
              Kenapa Memilih Bookletku?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Kami merancang sistem yang memudahkan pemilik restoran dan
              memanjakan pelanggan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: QrCode,
                title: "QR Code Instan",
                desc: "Generate QR Code otomatis untuk setiap meja. Pelanggan tinggal scan tanpa perlu install aplikasi tambahan.",
              },
              {
                icon: Smartphone,
                title: "Order via WhatsApp",
                desc: "Pesanan pelanggan otomatis terformat rapi dan dikirim langsung ke nomor WhatsApp kasir atau dapur Anda.",
              },
              {
                icon: Store,
                title: "Manajemen Mudah",
                desc: "Ubah harga, tambah menu baru, atau matikan stok kosong secara real-time dari dashboard admin.",
              },
              {
                icon: Zap,
                title: "Super Cepat",
                desc: "Website menu ringan dan cepat diakses meski dengan sinyal minim. Tidak bikin pelanggan menunggu.",
              },
              {
                icon: BarChart3,
                title: "Analitik Toko",
                desc: "Pantau seberapa banyak menu Anda dilihat dan produk apa yang paling diminati pelanggan.",
              },
              {
                icon: CheckCircle2,
                title: "Hemat Biaya",
                desc: "Tidak perlu cetak ulang buku menu fisik setiap ganti harga. Hemat kertas, hemat biaya operasional.",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:shadow-lg transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[2.5rem] bg-black dark:bg-zinc-900 overflow-hidden px-6 py-20 text-center md:px-20">
            {/* Decorative gradients */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-50"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Siap Digitalisasi Restoran Anda?
              </h2>
              <p className="text-zinc-400 text-lg mb-10">
                Bergabung dengan ratusan pemilik bisnis kuliner lainnya. Daftar
                sekarang, gratis selamanya untuk fitur dasar.
              </p>
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-zinc-200 font-bold"
                >
                  Mulai Sekarang - Gratis
                </Button>
              </Link>
              <p className="mt-6 text-xs text-zinc-500 uppercase tracking-widest font-medium">
                Tanpa Kartu Kredit • Setup 5 Menit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold">
                  B
                </div>
                <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Bookletku
                </span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                Platform pembuatan menu digital QR Code terbaik untuk UMKM,
                Cafe, dan Restoran di Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Produk
              </h4>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-black dark:hover:text-white"
                  >
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-black dark:hover:text-white"
                  >
                    Harga
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-black dark:hover:text-white"
                  >
                    Showcase
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Perusahaan
              </h4>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-black dark:hover:text-white"
                  >
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-black dark:hover:text-white"
                  >
                    Kontak
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-black dark:hover:text-white"
                  >
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
            <p>
              &copy; {new Date().getFullYear()} Bookletku. All rights reserved.
            </p>
            <p>Dibuat dengan ❤️ di Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
