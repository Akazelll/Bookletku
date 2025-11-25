import { createClient } from "@/lib/supabase/client";

export const logEvent = async (eventType: 'page_view' | 'add_to_cart', menuItemId?: string) => {
  const supabase = createClient();
  
  try {
    // Insert data ke tabel analytics
    const { error } = await supabase.from("analytics").insert({
      event_type: eventType,
      menu_item_id: menuItemId || null,
    });

    if (error) {
      console.error("⚠️ Gagal mencatat analitik (Supabase Error):", error.message);
    } else {
      console.log("✅ Analitik tercatat:", eventType);
    }
  } catch (error) {
    console.error("❌ Error koneksi analitik:", error);
  }
};