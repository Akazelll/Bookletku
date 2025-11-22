import { getMenus } from "@/services/menu-service";
import MenuListWrapper from "@/components/admin/menu-list-wrapper";
import CreateMenuDialog from "@/components/admin/create-menu-dialog";

// Memaksa render dinamis agar data selalu fresh saat halaman dibuka
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  // Fetch data menu dari Supabase
  const menus = await getMenus();

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header Halaman */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Manajemen Menu
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
            Atur daftar menu, harga, dan ketersediaan stok restoran Anda.
          </p>
        </div>

        {/* Tombol Tambah Menu */}
        <CreateMenuDialog />
      </div>

      {/* Container List Menu */}
      <div className='bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-1'>
        <div className='p-4 sm:p-6'>
          <MenuListWrapper initialMenus={menus} viewMode="management" />
        </div>
      </div>
    </div>
  );
}