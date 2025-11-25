import { createClient } from "@/lib/supabase/server";
import { MenuItem, RestaurantProfile } from "@/types/menu";
import MenuPublic from "@/components/menu-public";

export const dynamic = "force-dynamic";

export default async function PublicMenuPage() {
  const supabase = await createClient();

  console.log("🔍 [Server] Sedang memuat halaman Menu Public...");

  // 1. Cek Session User (Untuk tombol Login/Logout)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Ambil Data Menu
  const { data: menuData, error: menuError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (menuError)
    console.error("❌ [Server] Error ambil menu:", menuError.message);

  const menus: MenuItem[] = (menuData || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price),
    category: item.category,
    imageUrl: item.image_url,
    isAvailable: item.is_available,
    createdAt: new Date(item.created_at).getTime(),
    user_id: item.user_id,
  }));

  // 3. Ambil Profil Toko
  let profile: RestaurantProfile | undefined;
  const ownerId = menus.find((m) => m.user_id)?.user_id;
  let profileQuery = supabase.from("profiles").select("*");

  if (ownerId) {
    profileQuery = profileQuery.eq("id", ownerId);
  } else {
    profileQuery = profileQuery.order("updated_at", { ascending: false });
  }

  const { data: profileData } = await profileQuery.limit(1).maybeSingle();

  if (profileData) {
    profile = {
      id: profileData.id,
      restaurantName: profileData.restaurant_name,
      whatsappNumber: profileData.whatsapp_number,
      theme: profileData.theme || "minimalist",
      slug: profileData.slug,
      logoUrl: profileData.logo_url,
      description: profileData.description,
    };
  }

  // Kirim data 'user' ke komponen client
  return <MenuPublic initialMenus={menus} profile={profile} user={user} />;
}
