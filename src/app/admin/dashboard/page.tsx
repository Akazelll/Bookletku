import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMenus } from "@/services/menu-service";
import { getDashboardStats } from "@/services/analytics-server";
import MenuListWrapper from "@/components/admin/menu-list-wrapper";

// Import Chart Components
// Pastikan file chart Anda (category-distribution-chart.tsx & popular-products-chart.tsx)
// sudah diupdate dengan script responsif sebelumnya agar hasil maksimal.
import { CategoryDistributionChart } from "@/components/admin/charts/category-distribution-chart";
import { PopularProductsChart } from "@/components/admin/charts/popular-products-chart";

import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Cek User Login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 2. Ambil Data Menu & Statistik secara Paralel
  const [menus, stats] = await Promise.all([getMenus(), getDashboardStats()]);

  // 3. Kalkulasi Statistik Dasar
  const totalItems = menus.length;
  const activeItems = menus.filter((m) => m.isAvailable).length;

  // Hitung total interaksi 'add to cart'
  const totalAddToCartEvents = stats.popularItems.reduce(
    (acc, item) => acc + item.count,
    0
  );

  // Estimasi Revenue (Rumus: Rata-rata Harga Menu x Jumlah Klik Add to Cart)
  const avgPrice =
    totalItems > 0
      ? menus.reduce((acc, m) => acc + m.price, 0) / totalItems
      : 0;
  const estimatedRevenue = totalAddToCartEvents * avgPrice;

  // Waktu Sapaan
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Selamat Pagi" : hour < 18 ? "Selamat Sore" : "Selamat Malam";

  return (
    <div className='max-w-[1600px] mx-auto space-y-8 p-6 md:p-8 pb-20'>
      {/* --- HEADER SECTION --- */}
      <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
        <div>
          <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400'>
            {greeting}, Owner! 👋
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400 mt-2 text-base md:text-lg'>
            Berikut ringkasan performa restoran Anda hari ini.
          </p>
        </div>
        <div className='flex items-center gap-3 w-full lg:w-auto'>
          <Button
            variant='outline'
            className='hidden md:flex gap-2 cursor-default hover:bg-transparent'
          >
            <Calendar className='w-4 h-4 text-zinc-500' />
            <span>
              {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
            </span>
          </Button>
          <Link
            href='/menu/public'
            target='_blank'
            className='w-full lg:w-auto'
          >
            <Button className='w-full lg:w-auto gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 shadow-lg shadow-zinc-500/20'>
              Lihat Toko <ArrowUpRight className='w-4 h-4' />
            </Button>
          </Link>
        </div>
      </div>

      {/* --- KPI STATS GRID --- */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatsCard
          title='Total Menu'
          value={totalItems.toString()}
          desc={`${activeItems} menu sedang aktif`}
          icon={UtensilsCrossed}
          color='blue'
        />
        <StatsCard
          title='Total Kunjungan'
          value={stats.totalViews.toLocaleString("id-ID")}
          desc='Views halaman menu'
          icon={Users}
          color='indigo'
        />
        <StatsCard
          title='Interaksi Pesanan'
          value={totalAddToCartEvents.toString()}
          desc='Klik "Tambah ke Keranjang"'
          icon={TrendingUp}
          trend='up'
          color='emerald'
        />
        <StatsCard
          title='Estimasi Omset'
          value={`Rp ${estimatedRevenue.toLocaleString("id-ID")}`}
          desc='Potensi pendapatan kasar'
          icon={DollarSign}
          color='amber'
        />
      </div>

      {/* --- CHARTS SECTION (BENTO GRID LAYOUT) --- */}
      {/* Grid: 1 Kolom di HP, 3 Kolom di Layar Lebar (XL) */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        {/* CHART 1: Komposisi Menu (Mengambil 1 Kolom) */}
        {/* Class 'overflow-hidden' PENTING agar chart tidak melewari border card di HP */}
        <Card className='xl:col-span-1 shadow-sm border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/50 overflow-hidden'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <CardTitle className='flex items-center gap-2 text-base font-bold uppercase tracking-wider text-zinc-500'>
                  <PieChartIcon className='w-4 h-4' /> Distribusi
                </CardTitle>
                <h3 className='text-xl font-bold text-zinc-900 dark:text-zinc-100'>
                  Kategori Menu
                </h3>
              </div>
            </div>
          </CardHeader>
          {/* Padding dihilangkan di HP (p-0) agar chart maksimal */}
          <CardContent className='flex items-center justify-center min-h-[350px] p-0 sm:p-6'>
            <CategoryDistributionChart menus={menus} />
          </CardContent>
        </Card>

        {/* CHART 2: Menu Terpopuler (Mengambil 2 Kolom) */}
        <Card className='xl:col-span-2 shadow-sm border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/50 overflow-hidden'>
          <CardHeader>
            <div className='flex items-center justify-between flex-wrap gap-2'>
              <div className='space-y-1'>
                <CardTitle className='flex items-center gap-2 text-base font-bold uppercase tracking-wider text-zinc-500'>
                  <BarChart3 className='w-4 h-4' /> Trending
                </CardTitle>
                <h3 className='text-xl font-bold text-zinc-900 dark:text-zinc-100'>
                  Menu Paling Diminati
                </h3>
              </div>
              <Badge variant='secondary' className='hidden sm:flex'>
                Top 5 Items
              </Badge>
            </div>
            <CardDescription>
              Menu dengan jumlah interaksi tertinggi minggu ini.
            </CardDescription>
          </CardHeader>
          <CardContent className='min-h-[350px] p-0 sm:p-6'>
            <PopularProductsChart data={stats.popularItems} />
          </CardContent>
        </Card>
      </div>

      {/* --- RECENT MENU LIST --- */}
      <Card className='shadow-sm border-zinc-200 dark:border-zinc-800 overflow-hidden'>
        <div className='p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-50/50 dark:bg-zinc-800/20'>
          <div>
            <h3 className='font-bold text-lg text-zinc-900 dark:text-zinc-100'>
              Katalog Menu Terbaru
            </h3>
            <p className='text-sm text-zinc-500'>
              Daftar menu yang baru saja Anda tambahkan atau perbarui.
            </p>
          </div>
          <Link href='/admin/menu/list'>
            <Button
              variant='outline'
              size='sm'
              className='bg-white dark:bg-zinc-900'
            >
              Kelola Semua Menu
            </Button>
          </Link>
        </div>
        <div className='p-6'>
          {menus.length === 0 ? (
            <div className='text-center py-12'>
              <div className='bg-zinc-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <ShoppingBag className='w-8 h-8 text-zinc-400' />
              </div>
              <h3 className='text-zinc-900 font-medium'>Belum ada menu</h3>
              <p className='text-zinc-500 text-sm mt-1'>
                Mulai tambahkan menu pertama Anda sekarang.
              </p>
              <Link href='/admin/menu/list' className='inline-block mt-4'>
                <Button>Tambah Menu +</Button>
              </Link>
            </div>
          ) : (
            <MenuListWrapper
              initialMenus={menus.slice(0, 4)} // Tampilkan max 4 item
              viewMode='dashboard'
            />
          )}
        </div>
      </Card>
    </div>
  );
}

// --- SUB COMPONENTS (Helpers) ---

// Map warna untuk icon background yang estetik
const colorMap: any = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  indigo:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
};

function StatsCard({
  title,
  value,
  desc,
  icon: Icon,
  trend,
  color = "blue",
}: any) {
  return (
    <Card className='border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group'>
      <CardContent className='p-6 relative z-10'>
        <div className='flex items-center justify-between pb-4'>
          <p className='text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide'>
            {title}
          </p>
          <div
            className={`p-2.5 rounded-xl ${colorMap[color]} transition-colors group-hover:scale-110 duration-300 shadow-sm`}
          >
            <Icon className='w-5 h-5' />
          </div>
        </div>
        <div className='flex items-baseline gap-2'>
          <h3 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight'>
            {value}
          </h3>
        </div>

        <div className='flex items-center mt-3 gap-2'>
          {trend === "up" ? (
            <span className='flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/50'>
              <TrendingUp className='w-3 h-3 mr-1' /> Naik
            </span>
          ) : (
            <span className='flex items-center text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'>
              Stabil
            </span>
          )}
          <p className='text-xs text-zinc-400 font-medium truncate'>{desc}</p>
        </div>
      </CardContent>

      {/* Decorative gradient overlay (Glassmorphism Effect) */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${color}-500/10 to-transparent rounded-bl-full -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none`}
      />
    </Card>
  );
}
