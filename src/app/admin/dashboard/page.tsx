import Link from "next/link";
import { createClient } from "@/lib/supabase/server"; // Gunakan Server Client
import { deleteMenu } from "@/services/menu-service"; // Import action delete
import { Button } from "@/components/ui/button";
import ShareMenu from "@/components/share-menu";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { MenuItem } from "@/types/menu";

export default async function DashboardPage() {
  // 1. Inisialisasi Supabase Server Client
  const supabase = await createClient();

  // 2. Ambil Data Langsung dari Supabase (Server-side fetching)
  const { data: menusData } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });

  // Mapping data agar sesuai tipe MenuItem
  const menus: MenuItem[] = (menusData || []).map((item) => ({
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
    <div className='p-6 max-w-6xl mx-auto space-y-8'>
      {/* Header & QR Code Section */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2'>
          <h1 className='text-3xl font-bold text-zinc-900 mb-2'>
            Dashboard Menu
          </h1>
          <p className='text-zinc-500 mb-6'>
            Kelola daftar menu resto Anda di sini.
          </p>

          <Link href='/menu/create'>
            <Button className='bg-black text-white hover:bg-zinc-800 rounded-xl px-6 py-6 text-md'>
              <Plus className='mr-2 h-5 w-5' /> Tambah Menu Baru
            </Button>
          </Link>
        </div>

        {/* QR Code Card */}
        <div className='bg-white p-4 rounded-xl border shadow-sm'>
          <h3 className='font-semibold mb-4'>Link Pemesanan</h3>
          <ShareMenu />
        </div>
      </div>

      {/* Daftar Menu */}
      <div className='bg-white rounded-2xl border shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-zinc-100'>
          <h2 className='text-lg font-bold'>Daftar Menu ({menus.length})</h2>
        </div>

        <div className='divide-y divide-zinc-100'>
          {menus.map((menu) => (
            <div
              key={menu.id}
              className='p-4 flex items-center gap-4 hover:bg-zinc-50 transition'
            >
              <div className='w-16 h-16 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0 relative'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {menu.imageUrl ? (
                  <img
                    src={menu.imageUrl}
                    alt={menu.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-zinc-400 text-xs'>
                    No IMG
                  </div>
                )}
              </div>

              <div className='flex-1 min-w-0'>
                <h4 className='font-bold text-zinc-900'>{menu.name}</h4>
                <p className='text-sm text-zinc-500 truncate'>
                  {menu.description}
                </p>
                <div className='flex gap-2 mt-1'>
                  <span className='text-xs bg-zinc-100 px-2 py-0.5 rounded-full font-medium text-zinc-600'>
                    {menu.category}
                  </span>
                  <span className='text-xs font-bold text-black'>
                    Rp {menu.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Link href={`/menu/${menu.id}`}>
                  <Button variant='outline' size='icon' className='h-9 w-9'>
                    <Pencil className='w-4 h-4 text-blue-600' />
                  </Button>
                </Link>

                {/* Tombol Delete dengan Server Action */}
                <form
                  action={async () => {
                    "use server";
                    await deleteMenu(menu.id!);
                    revalidatePath("/dashboard");
                  }}
                >
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-9 w-9 hover:bg-red-50 hover:border-red-200'
                  >
                    <Trash2 className='w-4 h-4 text-red-500' />
                  </Button>
                </form>
              </div>
            </div>
          ))}

          {menus.length === 0 && (
            <div className='p-12 text-center text-zinc-400'>
              Belum ada menu. Klik tombol tambah di atas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
