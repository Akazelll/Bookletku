import { createClient } from "@/lib/supabase/server";

// Fungsi ini dipindahkan ke sini (Server Side)
export const getDashboardStats = async () => {
  const supabase = await createClient();

  // 1. Ambil Total Kunjungan (Page Views)
  const { count: totalViews } = await supabase
    .from("analytics")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "page_view");

  // 2. Ambil Data "Add to Cart" untuk mencari Item Populer
  const { data: events } = await supabase
    .from("analytics")
    .select("menu_item_id, menu_items(name)")
    .eq("event_type", "add_to_cart")
    .not("menu_item_id", "is", null);

  // Agregasi manual
  const itemCounts: { [key: string]: { name: string; count: number } } = {};

  if (events) {
    events.forEach((event: any) => {
      const id = event.menu_item_id;
      const name = event.menu_items?.name || "Unknown Item";
      
      if (!itemCounts[id]) {
        itemCounts[id] = { name, count: 0 };
      }
      itemCounts[id].count += 1;
    });
  }

  const popularItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalViews: totalViews || 0,
    popularItems,
  };
};