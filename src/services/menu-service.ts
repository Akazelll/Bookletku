import { createClient } from "@/lib/supabase/client";
import { MenuItem } from "@/types/menu";

// Helper untuk mapping data
const mapToMenuItem = (data: any): MenuItem => ({
  id: data.id,
  name: data.name,
  description: data.description,
  price: Number(data.price),
  category: data.category,
  imageUrl: data.image_url,
  isAvailable: data.is_available,
  createdAt: new Date(data.created_at).getTime(),
  user_id: data.user_id,
  position: data.position || 0, // [BARU] Map position
});

export const getMenus = async (): Promise<MenuItem[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("position", { ascending: true }) // [UBAH] Urutkan berdasarkan posisi custom dulu
    .order("created_at", { ascending: false }); // Fallback ke waktu buat

  if (error) {
    console.error("Error fetching menus:", error);
    return [];
  }
  return data.map(mapToMenuItem);
};

export const getMenuById = async (id: string): Promise<MenuItem | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapToMenuItem(data);
};

export const createMenu = async (menu: Partial<MenuItem>) => {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Auth Error:", authError);
    throw new Error("User not authenticated. Silakan login ulang.");
  }

  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      user_id: user.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
      category: menu.category,
      image_url: menu.imageUrl,
      is_available: menu.isAvailable,
    })
    .select()
    .single();

  if (error) throw error;
  return mapToMenuItem(data);
};

export const updateMenu = async (id: string, updates: Partial<MenuItem>) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .update({
      name: updates.name,
      description: updates.description,
      price: updates.price,
      category: updates.category,
      image_url: updates.imageUrl,
      is_available: updates.isAvailable,
      position: updates.position, // [BARU] Izinkan update position
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapToMenuItem(data);
};

export const deleteMenu = async (id: string) => {
  const supabase = createClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
};

export const uploadMenuImage = async (file: File): Promise<string> => {
  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;
  const filePath = `menus/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("menu-images")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("menu-images").getPublicUrl(filePath);
  return publicUrl;
};

// [BARU] Fungsi batch update urutan
export const updateMenuOrder = async (
  items: { id: string; position: number }[]
) => {
  const supabase = createClient();

  const updates = items.map((item) =>
    supabase
      .from("menu_items")
      .update({ position: item.position })
      .eq("id", item.id)
  );

  await Promise.all(updates);
};
