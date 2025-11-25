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
    slug: data.slug,               // Mapping baru
    logoUrl: data.logo_url,        // Mapping baru
    description: data.description, // Mapping baru
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
    slug: settings.slug,               // Simpan baru
    logo_url: settings.logoUrl,        // Simpan baru
    description: settings.description, // Simpan baru
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").upsert(payload);
  if (error) throw error;
};

// Fungsi baru untuk upload logo
export const uploadLogo = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `logo-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload ke bucket 'logos'
  const { error: uploadError } = await supabase.storage
    .from("logos") 
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(filePath);
  return publicUrl;
};