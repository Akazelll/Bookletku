// src/services/analytics-service.ts
import { createClient } from "@/lib/supabase/client";

// Hanya fungsi ini yang boleh ada di sini (Client Side)
export const logEvent = async (eventType: 'page_view' | 'add_to_cart', menuItemId?: string) => {
  const supabase = createClient();
  
  try {
    await supabase.from("analytics").insert({
      event_type: eventType,
      menu_item_id: menuItemId || null,
    });
  } catch (error) {
    console.error("Failed to log analytics:", error);
  }
};