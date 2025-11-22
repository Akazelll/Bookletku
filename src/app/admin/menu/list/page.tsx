import { getMenus } from "@/services/menu-service"; // Pakai Mock service
import MenuListWrapper from "@/components/admin/menu-list-wrapper";
import CreateMenuDialog from "@/components/admin/create-menu-dialog"; // Import tombol dialog

export const dynamic = "force-dynamic";

export default async function MenuListPage() {
  const menus = await getMenus();

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Manajemen Menu
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
            Atur daftar menu, harga, dan ketersediaan stok.
          </p>
        </div>

        {/* TOMBOL TAMBAH MENU DISINI SEKARANG */}
        <CreateMenuDialog />
      </div>

      <div className='bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-1'>
        <div className='p-4 sm:p-6'>
          <MenuListWrapper initialMenus={menus} />
        </div>
      </div>
    </div>
  );
}
