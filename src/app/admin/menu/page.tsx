import { createClient } from "@/lib/supabase/server";
import { MenuItem } from "@/types/menu";
import MenuPublic from "@/components/menu-public";

export const dynamic = "force-dynamic";

export default async function PublicMenuPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
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

  // PERBAIKAN: Prop 'initialTheme' dihapus karena tidak valid lagi.
  // MenuPublic akan otomatis fallback ke tema 'minimalist'.
  return <MenuPublic initialMenus={menus} />;
}