// src/app/admin/menu/list/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MenuItem } from "@/types/menu";
import MenuListWrapper from "@/components/admin/menu-list-wrapper"; // Wrapper client untuk handle delete
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Pastikan data selalu fresh (tidak di-cache statis)
export const dynamic = "force-dynamic";

export default async function MenuListPage() {
  // 1. Setup Supabase Server Client
  const supabase = await createClient();

  // 2. Fetch Data Menu
  const { data } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });

  // 3. Mapping Data DB ke Tipe Aplikasi
  const menus: MenuItem[] = (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    imageUrl: item.image_url,
    isAvailable: item.is_available,
    createdAt: new Date(item.created_at).getTime(),
  }));

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header Halaman */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Manajemen Menu
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
            Atur daftar menu, harga, dan ketersediaan stok.
          </p>
        </div>

        {/* Tombol Tambah Menu (Bisa diarahkan ke Dialog atau Halaman Create) */}
        {/* Jika menggunakan Dialog dari dashboard, Anda bisa import CreateMenuDialog di sini juga */}
        <Link href='/admin/menu/create'>
          <Button className='bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black rounded-xl px-6 h-11 shadow-sm transition-all'>
            <Plus className='mr-2 h-4 w-4' /> Tambah Menu Baru
          </Button>
        </Link>
      </div>

      {/* Area List Menu */}
      {/* Background putih agar kontras dengan background layout */}
      <div className='bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-1'>
        <div className='p-4 sm:p-6'>
          <MenuListWrapper initialMenus={menus} />
        </div>
      </div>
    </div>
  );
}
