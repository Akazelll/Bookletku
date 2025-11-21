import { createClient } from "@/lib/supabase/client";
import { MenuItem } from "@/types/menu";

const supabase = createClient();

// Helper untuk mapping data dari DB (snake_case) ke App (camelCase)
const mapToMenuItem = (data: any): MenuItem => ({
  id: data.id,
  name: data.name,
  description: data.description,
  price: data.price,
  category: data.category, // Asumsi di tabel kolomnya 'category' (text)
  imageUrl: data.image_url,
  isAvailable: data.is_available,
  createdAt: new Date(data.created_at).getTime(),
});

export const getMenus = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching menus:", error.message);
    return [];
  }
  return data.map(mapToMenuItem);
};

export const getMenuById = async (id: string): Promise<MenuItem | null> => {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapToMenuItem(data);
};

export const createMenu = async (menu: Partial<MenuItem>) => {
  // Mapping ke format DB
  const payload = {
    name: menu.name,
    description: menu.description,
    price: menu.price,
    category: menu.category,
    image_url: menu.imageUrl,
    is_available: menu.isAvailable,
  };

  const { data, error } = await supabase
    .from("menu_items")
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapToMenuItem(data);
};

export const updateMenu = async (id: string, updates: Partial<MenuItem>) => {
  const payload: any = { ...updates };
  // Mapping field jika ada update
  if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
  if (updates.isAvailable !== undefined)
    payload.is_available = updates.isAvailable;
  // Hapus field frontend only agar tidak error di DB
  delete payload.imageUrl;
  delete payload.isAvailable;
  delete payload.createdAt;
  delete payload.id;

  const { data, error } = await supabase
    .from("menu_items")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapToMenuItem(data);
};

export const deleteMenu = async (id: string) => {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

export const uploadMenuImage = async (file: File): Promise<string> => {
  // Validasi file
  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;
  const filePath = `menus/${fileName}`;

  // 1. Upload ke Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("menu-images") // Pastikan bucket ini ada di Supabase Storage
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  // 2. Ambil Public URL
  const { data } = supabase.storage.from("menu-images").getPublicUrl(filePath);

  return data.publicUrl;
};
