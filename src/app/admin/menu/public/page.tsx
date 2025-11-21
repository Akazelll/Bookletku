// Halaman ini akan menampilkan menu untuk pelanggan
import { createClient } from "@/lib/supabase/server";
import { MenuItem } from "@/types/menu";
import MenuPublic from "@/components/menu-public"; // Komponen tampilan pelanggan

export const dynamic = "force-dynamic";

export default async function PublicMenuPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true) // Hanya tampilkan yang tersedia
    .order("created_at", { ascending: false });

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

  // Kita hardcode tema 'minimalist' dulu, nanti bisa ambil dari tabel settings
  return <MenuPublic initialMenus={menus} initialTheme='minimalist' />;
}
