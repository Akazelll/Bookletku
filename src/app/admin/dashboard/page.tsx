import Link from "next/link";
import { getMenus } from "@/services/menu-service";
<<<<<<< HEAD
import MenuListWrapper from "@/components/admin/menu-list-wrapper";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

// Hapus import CreateMenuDialog

export default async function DashboardPage() {
  const menus = await getMenus();

  // Statistik
  const totalItems = menus.length;
  const activeItems = menus.filter((m) => m.isAvailable).length;

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header Sederhana */}
=======
// PENTING: Import dari analytics-server, BUKAN analytics-service
import { getDashboardStats } from "@/services/analytics-server"; 
import MenuListWrapper from "@/components/admin/menu-list-wrapper";
import { TrendingUp, ShoppingBag, DollarSign, Eye } from "lucide-react";

export default async function DashboardPage() {
  // Mengambil data secara paralel
  const [menus, stats] = await Promise.all([
    getMenus(),
    getDashboardStats()
  ]);

  // Statistik dasar
  const totalItems = menus.length;
  
  // Hitung total interaksi 'add to cart'
  const totalAddToCartEvents = stats.popularItems.reduce((acc, item) => acc + item.count, 0);
  
  // Estimasi omset kasar (Harga Rata-rata x Jumlah Klik Tambah ke Keranjang)
  const avgPrice = totalItems > 0 ? menus.reduce((acc, m) => acc + m.price, 0) / totalItems : 0;
  const estimatedRevenue = totalAddToCartEvents * avgPrice;

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header */}
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Ringkasan Toko
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
            Pantau performa menu dan katalog restoran Anda hari ini.
          </p>
        </div>
<<<<<<< HEAD
        {/* Tombol Create SUDAH DIHAPUS dari sini */}
      </div>

      {/* Stats Cards Grid */}
=======
      </div>

      {/* Kartu Statistik */}
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Menu'
          value={totalItems.toString()}
          desc='Item terdaftar'
          icon={ShoppingBag}
        />
        <StatsCard
<<<<<<< HEAD
          title='Menu Aktif'
          value={activeItems.toString()}
          desc='Siap dipesan'
          icon={TrendingUp}
        />
        <StatsCard
          title='Kunjungan'
          value='1,204'
          desc='Bulan ini'
          icon={Users}
        />
        <StatsCard
          title='Estimasi Omset'
          value={`Rp ${(totalItems * 150000).toLocaleString("id-ID")}`}
          desc='Potensi penjualan'
=======
          title='Total Kunjungan'
          value={stats.totalViews.toLocaleString("id-ID")}
          desc='Halaman dilihat'
          icon={Eye}
        />
        <StatsCard
          title='Menu Diminati'
          value={totalAddToCartEvents.toString()}
          desc='Total klik tambah'
          icon={TrendingUp}
        />
        <StatsCard
          title='Estimasi Potensi'
          value={`Rp ${estimatedRevenue.toLocaleString("id-ID")}`}
          desc='Berdasarkan klik'
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
          icon={DollarSign}
        />
      </div>

<<<<<<< HEAD
      {/* Preview List Menu Terbatas */}
      <div className='bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center'>
          <h3 className='font-bold text-lg text-zinc-900 dark:text-zinc-100'>
            Menu Terbaru
          </h3>
          <Link
            href='/admin/menu/list'
            className='text-sm font-medium text-blue-600 hover:underline'
          >
            Kelola Semua Menu &rarr;
          </Link>
        </div>
        <div className='p-4 sm:p-6'>
          {/* viewMode="management" akan menampilkan tombol Edit & Delete secara langsung */}
          <MenuListWrapper initialMenus={menus} viewMode='management' />
=======
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Preview Menu Terbaru */}
        <div className='lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden'>
            <div className='p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center'>
            <h3 className='font-bold text-lg text-zinc-900 dark:text-zinc-100'>
                Menu Terbaru
            </h3>
            <Link
                href='/admin/menu/list'
                className='text-sm font-medium text-blue-600 hover:underline'
            >
                Kelola Semua &rarr;
            </Link>
            </div>
            <div className='p-4 sm:p-6'>
            <MenuListWrapper initialMenus={menus.slice(0, 3)} viewMode='management' />
            </div>
        </div>

        {/* Kolom Kanan: Analitik Item Terpopuler */}
        <div className='bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit'>
            <div className='p-6 border-b border-zinc-100 dark:border-zinc-800'>
                <h3 className='font-bold text-lg text-zinc-900 dark:text-zinc-100'>
                    🔥 Paling Diminati
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Menu dengan interaksi terbanyak</p>
            </div>
            <div className="p-2">
                {stats.popularItems.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 text-sm">
                        Belum ada data interaksi.
                    </div>
                ) : (
                    <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {stats.popularItems.map((item, index) => (
                            <li key={index} className="flex justify-between items-center p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                                        index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                        index === 1 ? 'bg-zinc-100 text-zinc-700' : 
                                        index === 2 ? 'bg-orange-100 text-orange-800' : 
                                        'bg-zinc-50 text-zinc-500'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 line-clamp-1">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md">
                                    {item.count} klik
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, desc, icon: Icon }: any) {
  return (
    <div className='bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm'>
      <div className='flex justify-between items-start'>
        <div>
          <p className='text-sm font-medium text-zinc-500'>{title}</p>
          <h3 className='text-2xl font-bold mt-2'>{value}</h3>
        </div>
        <div className='p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg'>
          <Icon className='w-5 h-5 text-zinc-900 dark:text-zinc-100' />
        </div>
      </div>
      <p className='text-xs text-zinc-400 mt-4'>{desc}</p>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> a77c2d3054bb3e2859d7153bc55913dc488845e5
