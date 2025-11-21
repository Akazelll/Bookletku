import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MenuItem } from "@/types/menu";
import { Button } from "@/components/ui/button";
import ShareMenu from "@/components/share-menu";
import { Plus } from "lucide-react";
import { deleteMenu } from "@/services/menu-service";
import MenuListWrapper from "@/components/admin/menu-list-wrapper"; // Kita buat wrapper di bawah

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });

  // Mapping
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
    <div className='p-6 max-w-6xl mx-auto space-y-8 min-h-screen bg-zinc-50/30'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-zinc-900 dark:text-zinc-100'>
            Dashboard
          </h1>
          <p className='text-zinc-500'>Kelola menu restoran Anda.</p>
        </div>
        <Link href='/admin/menu/create'>
          <Button className='bg-black text-white hover:bg-zinc-800 rounded-xl px-6'>
            <Plus className='mr-2 h-4 w-4' /> Tambah Menu
          </Button>
        </Link>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
        {/* Kolom Kiri: Daftar Menu */}
        <div className='lg:col-span-2 space-y-4'>
          <h3 className='text-lg font-semibold'>Daftar Menu</h3>
          {/* Kita butuh Client Component untuk handle Delete interaktif */}
          <MenuListWrapper initialMenus={menus} />
        </div>

        {/* Kolom Kanan: Share & Settings */}
        <div className='lg:col-span-1 space-y-6'>
          <ShareMenu />
        </div>
      </div>
    </div>
  );
}
