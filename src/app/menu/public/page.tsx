import { createClient } from "@/lib/supabase/server";
import { MenuItem } from "@/types/menu";
import MenuPublic from "@/components/menu-public";

// Pastikan halaman ini selalu render ulang (tidak di-cache statis) agar stok update
export const dynamic = "force-dynamic";

export default async function PublicMenuPage() {
  const supabase = await createClient();

  // 1. Ambil data menu yang statusnya 'available'
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching public menu:", error);
  }

  // 2. Mapping data dari format Database (snake_case) ke Aplikasi (camelCase)
  // Ini penting karena Supabase mengembalikan 'image_url', tapi komponen butuh 'imageUrl'
  const menus: MenuItem[] = (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price), // Pastikan tipe number
    category: item.category,
    imageUrl: item.image_url,  // Kunci: mapping field ini
    isAvailable: item.is_available,
    createdAt: new Date(item.created_at).getTime(),
  }));

  // 3. Render komponen Client
  return <MenuPublic initialMenus={menus} initialTheme='minimalist' />;
}