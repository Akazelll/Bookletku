import { createClient } from "@/lib/supabase/server";
import { MenuItem, RestaurantProfile } from "@/types/menu";
import MenuPublic from "@/components/menu-public";

export const dynamic = "force-dynamic";

export default async function PublicMenuPage() {
  const supabase = await createClient();

  // 1. Ambil User Admin yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Ambil Data Menu (Ambil semua untuk preview admin, tanpa pagination nyata)
  const { data: menuData } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

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
    position: item.position || 0,
  }));

  // 3. Ambil Profil Restoran milik Admin
  let profile: RestaurantProfile | undefined;

  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

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
  }

  // 4. Render dengan nilai default untuk props Pagination & Search
  // (Props ini wajib ada karena komponen MenuPublic sudah diupdate)
  return (
    <MenuPublic
      initialMenus={menus}
      profile={profile}
      user={user}
      // --- NILAI DUMMY AGAR TIDAK ERROR ---
      currentPage={1}
      totalPages={1}
      currentCategory='all'
      currentSearch=''
    />
  );
}
