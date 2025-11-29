import { getMenusPaginated } from "@/services/menu-service";
import MenuListWrapper from "@/components/admin/menu-list-wrapper";
import CreateMenuDialog from "@/components/admin/create-menu-dialog";

export const dynamic = "force-dynamic";

interface MenuListPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MenuListPage({
  searchParams,
}: MenuListPageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;

  // [UBAH DI SINI] Ganti limit dari 10 menjadi 8
  const limit = 8;

  const { data: menus, count } = await getMenusPaginated(page, limit);
  const totalPages = Math.max(1, Math.ceil(count / limit));

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

        <CreateMenuDialog />
      </div>

      <div className='bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-1'>
        <div className='p-4 sm:p-6'>
          <MenuListWrapper
            initialMenus={menus}
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
          />
        </div>
      </div>
    </div>
  );
}
