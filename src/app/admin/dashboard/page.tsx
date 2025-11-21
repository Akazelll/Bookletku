import Link from "next/link";
import { getMenus } from "@/services/menu-service";
import MenuListWrapper from "@/components/admin/menu-list-wrapper";
import CreateMenuDialog from "@/components/admin/create-menu-dialog"; // Import ini
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

export default async function DashboardPage() {
  const menus = await getMenus();

  // Statistik sederhana
  const totalItems = menus.length;
  const activeItems = menus.filter((m) => m.isAvailable).length;

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Ringkasan Toko
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
            Pantau performa menu dan katalog restoran Anda hari ini.
          </p>
        </div>

        {/* GANTI LINK LAMA DENGAN DIALOG */}
        <CreateMenuDialog />
      </div>

      {/* Stats Cards Grid (Sama seperti sebelumnya) */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Menu'
          value={totalItems.toString()}
          desc='Item terdaftar'
          icon={ShoppingBag}
        />
        <StatsCard
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
          icon={DollarSign}
        />
      </div>

      {/* Recent Menu Table Section */}
      <div className='bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center'>
          <h3 className='font-bold text-lg text-zinc-900 dark:text-zinc-100'>
            Daftar Menu
          </h3>
        </div>
        <div className='p-0'>
          <MenuListWrapper initialMenus={menus} />
        </div>
      </div>
    </div>
  );
}

// Komponen StatsCard tetap sama...
function StatsCard({ title, value, desc, icon: Icon }: any) {
  return (
    <div className='bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-start'>
        <div>
          <p className='text-sm font-medium text-zinc-500 dark:text-zinc-400'>
            {title}
          </p>
          <h3 className='text-2xl font-bold mt-2 text-zinc-900 dark:text-zinc-100'>
            {value}
          </h3>
        </div>
        <div className='p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100'>
          <Icon className='w-5 h-5' />
        </div>
      </div>
      <p className='text-xs text-zinc-400 mt-4'>{desc}</p>
    </div>
  );
}
