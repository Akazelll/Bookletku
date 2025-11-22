import { createClient } from "@/lib/supabase/client";
import { RestaurantProfile } from "@/types/menu";

const supabase = createClient();

export const getSettings = async (): Promise<RestaurantProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching settings:", error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    restaurantName: data.restaurant_name,
    whatsappNumber: data.whatsapp_number,
    theme: data.theme,
  };
};

export const saveSettings = async (settings: Partial<RestaurantProfile>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const payload = {
    id: user.id,
    restaurant_name: settings.restaurantName,
    whatsapp_number: settings.whatsappNumber,
    theme: settings.theme,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").upsert(payload);
  if (error) throw error;
};