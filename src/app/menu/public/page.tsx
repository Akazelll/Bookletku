import { createClient } from "@/lib/supabase/server";
import { MenuItem, RestaurantProfile } from "@/types/menu";
import MenuPublic from "@/components/menu-public";

// Memastikan halaman selalu dirender ulang untuk data terbaru (SSR)
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PublicMenuPage({ searchParams }: PageProps) {
  // 1. Inisialisasi Supabase Client
  const supabase = await createClient();
  const resolvedParams = await searchParams;

  // 2. Parse Parameter URL (dengan nilai default yang aman)
  const rawPage = resolvedParams?.page;
  const page = Math.max(
    1,
    Number(Array.isArray(rawPage) ? rawPage[0] : rawPage) || 1
  );

  const rawCategory = resolvedParams?.category;
  const category =
    (Array.isArray(rawCategory) ? rawCategory[0] : rawCategory) || "all";

  const rawSearch = resolvedParams?.search;
  const search = (Array.isArray(rawSearch) ? rawSearch[0] : rawSearch) || "";

  const LIMIT = 9; // Jumlah item per halaman

  // 3. Bangun Query Menu
  let query = supabase
    .from("menu_items")
    .select("*", { count: "exact" }) // Ambil data + total jumlah
    .eq("is_available", true);

  // -> Filter Kategori
  if (category !== "all") {
    query = query.eq("category", category);
  }

  // -> Filter Pencarian (Case Insensitive)
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  // -> Pagination & Sorting
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  const {
    data: menuData,
    count,
    error: menuError,
  } = await query
    .order("position", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (menuError) {
    console.error("❌ [PublicMenu] Error fetching menus:", menuError.message);
  }

  // 4. Transformasi Data (Mapping ke Tipe MenuItem)
  const menus: MenuItem[] = (menuData || []).map((item) => ({
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

  const totalPages = Math.max(1, Math.ceil((count || 0) / LIMIT));

  // 5. Fetch Profil Restoran (Optimized)
  // Mengambil profil yang paling baru diupdate sebagai fallback utama
  let profile: RestaurantProfile | undefined;

  const { data: profileList, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (profileError) {
    console.error(
      "❌ [PublicMenu] Error fetching profile:",
      profileError.message
    );
  }

  const profileData = profileList?.[0];

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

  // 6. Cek Session User (untuk menampilkan tombol Admin Dashboard jika owner login)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 7. Render Komponen Client
  return (
    <MenuPublic
      initialMenus={menus}
      profile={profile}
      user={user}
      currentPage={page}
      totalPages={totalPages}
      currentCategory={category}
      currentSearch={search}
    />
  );
}
