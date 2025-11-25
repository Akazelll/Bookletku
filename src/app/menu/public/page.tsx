import { createClient } from "@/lib/supabase/server";
import { MenuItem, RestaurantProfile } from "@/types/menu";
import MenuPublic from "@/components/menu-public";

export const dynamic = "force-dynamic";

export default async function PublicMenuPage() {
  const supabase = await createClient();

  console.log("🔍 [Server] Sedang memuat halaman Menu Public...");

  // 1. Ambil Data Menu
  const { data: menuData, error: menuError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (menuError) console.error("❌ [Server] Error ambil menu:", menuError.message);

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

  // 2. Logika Cerdas Mengambil Profil (Double Fallback)
  let profile: RestaurantProfile | undefined;
  
  // Cari ID pemilik dari salah satu menu
  const ownerId = menus.find((m) => m.user_id)?.user_id;
  
  let profileData = null;

  // PERCOBAAN 1: Cari profil berdasarkan ID pemilik menu
  if (ownerId) {
    console.log("👤 [Server] Mencoba ambil profil milik user:", ownerId);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", ownerId)
      .limit(1)
      .maybeSingle();
    
    if (data) {
      profileData = data;
      console.log("✅ [Server] Profil pemilik ditemukan.");
    } else {
      console.log("⚠️ [Server] Profil pemilik tidak ditemukan. Mencoba fallback...");
    }
  }

  // PERCOBAAN 2 (Fallback): Jika profil pemilik tidak ketemu, ambil profil terakhir yang diupdate
  // Ini berguna jika data menu tidak sinkron dengan data profil
  if (!profileData) {
    console.log("🔄 [Server] Mengambil profil toko terakhir (Fallback mode)...");
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) {
      console.error("❌ [Server] Error fallback profil:", error.message);
    }
    profileData = data;
  }

  // 3. Format Data Profil
  if (profileData) {
    console.log("🎨 [Server] Menggunakan Tema:", profileData.theme);
    
    profile = {
      id: profileData.id,
      restaurantName: profileData.restaurant_name,
      whatsappNumber: profileData.whatsapp_number,
      theme: profileData.theme || "minimalist",
      slug: profileData.slug,
      logoUrl: profileData.logo_url,
      description: profileData.description,
    };
  } else {
    console.error("❌ [Server] FATAL: Tidak ada profil toko sama sekali di database.");
  }

  return <MenuPublic initialMenus={menus} profile={profile} />;
}