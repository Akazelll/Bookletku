"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { MenuItem, CATEGORIES, RestaurantProfile } from "@/types/menu";
import {
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Utensils,
  Globe,
  Trash2,
  LogIn,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { logEvent } from "@/services/analytics-service";
import { Input } from "@/components/ui/input";

const TRANSLATIONS = {
  id: {
    defaultTitle: "Bookletku Resto",
    defaultDesc: "Digital Menu",
    loading: "Memuat...",
    logoAlt: "Logo Restoran",
    all: "Semua",
    searchPlaceholder: "Mau makan apa hari ini?",
    emptyCategory: "Menu tidak ditemukan.",
    noImage: "Tidak ada gambar",
    add: "Tambah",
    currency: "Rp",
    ready: "Tersedia",
    soldOut: "Habis",
    yourOrder: "Pesanan Anda",
    emptyCartTitle: "Keranjang kosong",
    emptyCartDesc: "Pilih menu enak di sebelah kiri!",
    subtotal: "Subtotal",
    total: "Total",
    checkoutWA: "Pesan via WhatsApp",
    viewCart: "Lihat Keranjang",
    itemsSelected: "item terpilih",
    greeting: "Halo, saya mau pesan:",
    orderListHeader: "Daftar Pesanan:",
    pleaseProcess: "Mohon diproses ya, terima kasih!",
    login: "Masuk",
    logout: "Keluar",
    dashboard: "Dashboard",
    remove: "Hapus item",
    increase: "Tambah jumlah",
    decrease: "Kurangi jumlah",
    page: "Halaman",
  },
  en: {
    defaultTitle: "Bookletku Resto",
    defaultDesc: "Digital Menu",
    loading: "Loading...",
    logoAlt: "Restaurant Logo",
    all: "All",
    searchPlaceholder: "What are you craving?",
    emptyCategory: "No items found.",
    noImage: "No Image",
    add: "Add",
    currency: "Rp",
    ready: "Ready",
    soldOut: "Sold Out",
    yourOrder: "Your Order",
    emptyCartTitle: "Cart is empty",
    emptyCartDesc: "Pick some delicious items from the left!",
    subtotal: "Subtotal",
    total: "Total",
    checkoutWA: "Order via WhatsApp",
    viewCart: "View Cart",
    itemsSelected: "items selected",
    greeting: "Hello, I would like to order:",
    orderListHeader: "Order List:",
    pleaseProcess: "Please process this order, thank you!",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    remove: "Remove item",
    increase: "Increase quantity",
    decrease: "Decrease quantity",
    page: "Page",
  },
};

const CATEGORY_NAMES: Record<string, { id: string; en: string }> = {
  "Makanan Utama": { id: "Makanan Utama", en: "Main Course" },
  Minuman: { id: "Minuman", en: "Beverages" },
  Cemilan: { id: "Cemilan", en: "Snacks" },
  Dessert: { id: "Pencuci Mulut", en: "Desserts" }, 
  "Paket Hemat": { id: "Paket Hemat", en: "Value Meals" },
};

interface MenuPublicProps {
  initialMenus: MenuItem[];
  profile?: RestaurantProfile;
  user?: User | null;
  currentPage: number;
  totalPages: number;
  currentCategory: string;
  currentSearch: string;
}

export default function MenuPublic({
  initialMenus,
  profile,
  user,
  currentPage,
  totalPages,
  currentCategory,
  currentSearch,
}: MenuPublicProps) {
  const menus = initialMenus;
  const router = useRouter();
  const supabase = createClient();

  const [lang, setLang] = useState<"id" | "en">("id");
  const t = TRANSLATIONS[lang];

  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Theme Logic
  const themeName = profile?.theme || "minimalist";
  const isColorful = themeName === "colorful";
  const storeName = profile?.restaurantName || t.defaultTitle;
  const storeDesc = profile?.description || t.defaultDesc;
  const waNumber = (profile?.whatsappNumber || "6281234567890")
    .replace(/\D/g, "")
    .replace(/^0/, "62");
  const logoUrl = profile?.logoUrl;

  useEffect(() => {
    if (searchTerm === currentSearch) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (currentCategory !== "all") params.set("category", currentCategory);
      if (searchTerm) params.set("search", searchTerm);
      params.set("page", "1");

      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentCategory, router, currentSearch]);

  useEffect(() => {
    logEvent("page_view");
  }, []);

  const updateCart = (item: MenuItem, delta: number) => {
    if (!item.id) return;
    setCart((prev) => {
      const newCount = (prev[item.id!] || 0) + delta;
      const newCart = { ...prev };
      if (newCount > 0) {
        newCart[item.id!] = newCount;
      } else {
        delete newCart[item.id!];
      }
      return newCart;
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = menus.reduce(
    (total, item) => total + item.price * (cart[item.id!] || 0),
    0
  );

  const handleCheckout = () => {
    const cartItemsList = menus.filter((m) => m.id && cart[m.id]);
    if (cartItemsList.length === 0) return;

    let message = `${t.greeting}\n\n`;
    cartItemsList.forEach((item) => {
      const qty = cart[item.id!];
      message += `- ${item.name} (${qty}) x ${
        t.currency
      } ${item.price.toLocaleString("id-ID")}\n`;
    });

    const visibleTotal = cartItemsList.reduce(
      (acc, item) => acc + item.price * cart[item.id!],
      0
    );
    message += `\n*${t.total}: ${t.currency} ${visibleTotal.toLocaleString(
      "id-ID"
    )}*`;
    message += `\n\n${t.pleaseProcess}`;

    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const getCategoryLabel = (cat: string) => {
    return CATEGORY_NAMES[cat] ? CATEGORY_NAMES[cat][lang] : cat;
  };

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams();
    if (cat !== "all") params.set("category", cat);
    if (currentSearch) params.set("search", currentSearch);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (currentCategory !== "all") params.set("category", currentCategory);
    if (currentSearch) params.set("search", currentSearch);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  // Styles (Updated for better search UI)
  const theme = {
    pageBg: isColorful ? "bg-orange-50/60" : "bg-zinc-50",
    navBorder: isColorful ? "border-orange-100/50" : "border-zinc-200",
    logoBg: isColorful
      ? "bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/20"
      : "bg-black",
    titleText: isColorful
      ? "text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"
      : "text-zinc-900",

    // Header (Sticky Background)
    headerBg: isColorful ? "bg-orange-50/90" : "bg-zinc-50/95",

    // Tabs
    activeTab: isColorful
      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30 border-transparent"
      : "bg-black text-white shadow-zinc-900/20 border-transparent",
    inactiveTab: isColorful
      ? "bg-white text-zinc-600 border-orange-100 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700"
      : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100",

    // Search Bar Specifics [NEW]
    searchInput: isColorful
      ? "bg-white border-orange-100 focus-visible:ring-orange-400 placeholder:text-orange-300 text-orange-900 shadow-orange-100"
      : "bg-white border-zinc-200 focus-visible:ring-zinc-400 placeholder:text-zinc-400 text-zinc-900 shadow-sm",
    searchIcon: isColorful ? "text-orange-400" : "text-zinc-400",

    cardBorder: isColorful
      ? "border-orange-100/60 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10"
      : "border-zinc-100 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/50",
    priceText: isColorful ? "text-orange-600" : "text-black",
    addButton: isColorful
      ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md shadow-orange-500/20"
      : "bg-zinc-900 hover:bg-black text-white",
    counterBtn: isColorful
      ? "bg-gradient-to-br from-orange-500 to-red-600"
      : "bg-black",
    checkoutBtn: isColorful
      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
      : "bg-zinc-900 hover:bg-black text-white",
    cartIcon: isColorful ? "text-orange-600" : "text-black",
    floatingCart: isColorful
      ? "bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-900/30 border-green-500/50"
      : "bg-zinc-900 shadow-zinc-900/30 border-zinc-700/50",
  };

  return (
    <div
      className={`min-h-screen font-sans text-zinc-900 ${theme.pageBg} ${
        isColorful ? "selection:bg-orange-100 selection:text-orange-900" : ""
      }`}
    >
      {/* NAVBAR */}
      <nav
        className={`bg-white/80 backdrop-blur-md border-b sticky top-0 z-30 shadow-sm h-16 ${theme.navBorder}`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {logoUrl ? (
              <div className='w-10 h-10 relative rounded-xl overflow-hidden shadow-sm border border-zinc-100'>
                <Image
                  src={logoUrl}
                  alt={t.logoAlt}
                  fill
                  className='object-cover'
                />
              </div>
            ) : (
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-all hover:scale-105 ${theme.logoBg}`}
              >
                <Utensils className='w-5 h-5' />
              </div>
            )}
            <div>
              <h1
                className={`text-lg font-bold leading-tight tracking-tight ${theme.titleText}`}
              >
                {storeName}
              </h1>
              <p className='text-[10px] uppercase tracking-wider text-zinc-500 font-medium line-clamp-1 max-w-[200px]'>
                {storeDesc}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 md:gap-3'>
            <button
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className='flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100/80 hover:bg-zinc-200 text-xs font-bold transition-colors border border-transparent hover:border-zinc-300'
            >
              <Globe className='w-3.5 h-3.5' /> {lang.toUpperCase()}
            </button>
            {user ? (
              <div className='flex items-center gap-2'>
                <Link href='/admin/dashboard'>
                  <button className='hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-bold transition-colors'>
                    <LayoutDashboard className='w-3.5 h-3.5' />
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className='flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors border border-red-100'
                >
                  <LogOut className='w-3.5 h-3.5' /> {t.logout}
                </button>
              </div>
            ) : (
              <Link href='/login'>
                <button
                  className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm ${
                    isColorful
                      ? "bg-orange-600 text-white hover:bg-orange-700"
                      : "bg-black text-white hover:bg-zinc-800"
                  }`}
                >
                  <LogIn className='w-3.5 h-3.5' /> {t.login}
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-start pt-4 lg:pt-8 gap-8 px-4 sm:px-6 lg:px-8'>
        {/* MENU CONTENT */}
        <div className='flex-1 w-full min-h-[80vh] pb-32 lg:pb-10'>
          {/* SEARCH & CATEGORY HEADER (STICKY) */}
          <div
            className={`sticky top-[64px] z-20 pt-4 pb-2 mb-4 -mx-4 px-4 lg:mx-0 lg:px-0 backdrop-blur-md transition-all duration-300 ${theme.headerBg} lg:bg-transparent lg:backdrop-blur-none border-b ${theme.navBorder} lg:border-none`}
          >
            {/* SEARCH INPUT */}
            <div className='relative mb-4 max-w-md mx-auto lg:mx-0'>
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${theme.searchIcon}`}
              />
              <Input
                placeholder={t.searchPlaceholder}
                className={`pl-11 pr-10 h-11 rounded-2xl border transition-all duration-300 ${theme.searchInput}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 transition-colors ${theme.searchIcon}`}
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>

            {/* CATEGORY TABS */}
            <div className='flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-fade'>
              <button
                onClick={() => handleCategoryChange("all")}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 border ${
                  currentCategory === "all"
                    ? theme.activeTab
                    : theme.inactiveTab
                }`}
              >
                {t.all}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 border ${
                    currentCategory === cat
                      ? theme.activeTab
                      : theme.inactiveTab
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* LIST MENU */}
          {menus.length === 0 ? (
            <div className='text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200'>
              <div className='inline-flex p-4 bg-zinc-50 rounded-full mb-4 text-zinc-300'>
                <ShoppingBag className='w-8 h-8' />
              </div>
              <p className='text-zinc-500 font-medium'>{t.emptyCategory}</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className='mt-2 text-sm text-blue-600 hover:underline font-medium'
                >
                  Hapus pencarian
                </button>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6'>
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className={`group bg-white rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden flex flex-row md:flex-col h-32 md:h-auto ${theme.cardBorder}`}
                >
                  <div className='w-32 md:w-full h-full md:h-48 bg-zinc-100 flex-shrink-0 relative overflow-hidden'>
                    {menu.imageUrl ? (
                      <Image
                        src={menu.imageUrl}
                        alt={menu.name}
                        fill
                        sizes='(max-width: 768px) 150px, (max-width: 1200px) 50vw, 33vw'
                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                        priority={false}
                      />
                    ) : (
                      <div className='w-full h-full flex flex-col items-center justify-center text-zinc-300'>
                        <ShoppingBag className='w-6 h-6 md:w-8 md:h-8 mb-1 opacity-50' />
                        <span className='text-[10px] md:text-xs font-medium'>
                          {t.noImage}
                        </span>
                      </div>
                    )}
                    {cart[menu.id!] > 0 && (
                      <div className='hidden md:flex absolute top-3 right-3 bg-black/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm z-10'>
                        {cart[menu.id!]}x
                      </div>
                    )}
                  </div>
                  <div className='p-4 flex flex-col justify-between flex-1'>
                    <div>
                      <h3 className='font-bold text-zinc-900 line-clamp-1 md:line-clamp-2 text-base md:text-lg mb-1 group-hover:text-primary transition-colors'>
                        {menu.name}
                      </h3>
                      <p className='text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3'>
                        {menu.description}
                      </p>
                    </div>
                    <div className='flex items-center justify-between mt-auto'>
                      <span
                        className={`font-bold text-base ${theme.priceText}`}
                      >
                        {t.currency} {menu.price.toLocaleString("id-ID")}
                      </span>
                      <div className='flex items-center gap-2'>
                        {cart[menu.id!] ? (
                          <>
                            <button
                              onClick={() => updateCart(menu, -1)}
                              className='w-8 h-8 flex items-center justify-center bg-white border border-zinc-200 rounded-full text-zinc-700 hover:bg-zinc-50 active:scale-90 transition-all'
                            >
                              <Minus className='w-3 h-3' />
                            </button>
                            <span className='w-4 text-center text-sm font-bold text-zinc-900'>
                              {cart[menu.id!]}
                            </span>
                            <button
                              onClick={() => updateCart(menu, 1)}
                              className={`flex items-center justify-center rounded-full shadow-sm transition-all active:scale-90 ${theme.counterBtn} w-8 h-8 text-white hover:opacity-90`}
                            >
                              <Plus className='w-4 h-4' />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => updateCart(menu, 1)}
                            className={`flex items-center justify-center rounded-full shadow-sm transition-all active:scale-90 px-4 py-1.5 text-xs font-bold ${theme.addButton}`}
                          >
                            {t.add}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className='flex items-center justify-center gap-4 mt-8 pt-6 border-t border-zinc-200/50'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className='flex items-center gap-1 px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
              >
                <ChevronLeft className='w-4 h-4' /> Prev
              </button>
              <span className='text-sm font-medium text-zinc-500'>
                {t.page} {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className='flex items-center gap-1 px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-full hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
              >
                Next <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          )}
        </div>

        {/* CART SIDEBAR (DESKTOP) */}
        <div className='hidden lg:block w-96 flex-shrink-0 sticky top-24 z-10'>
          <div className='bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]'>
            <div className='p-5 border-b border-zinc-100 bg-white'>
              <h2 className='text-lg font-bold flex items-center gap-2 text-zinc-900'>
                <ShoppingBag className={`w-5 h-5 ${theme.cartIcon}`} />{" "}
                {t.yourOrder}
              </h2>
            </div>
            <div className='flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-zinc-200'>
              {Object.keys(cart).length === 0 ? (
                <div className='py-12 flex flex-col items-center justify-center text-zinc-400 text-center space-y-3'>
                  <div className='w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center'>
                    <ShoppingBag className='w-8 h-8 opacity-30' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-zinc-600'>
                      {t.emptyCartTitle}
                    </p>
                    <p className='text-xs mt-1'>{t.emptyCartDesc}</p>
                  </div>
                </div>
              ) : (
                menus
                  .filter((m) => m.id && cart[m.id])
                  .map((item) => (
                    <div key={item.id} className='flex gap-3 group'>
                      <div className='w-14 h-14 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-100 relative'>
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes='56px'
                            className='object-cover'
                          />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex justify-between items-start mb-1'>
                          <h4 className='font-semibold text-sm text-zinc-900 line-clamp-1'>
                            {item.name}
                          </h4>
                          <button
                            onClick={() =>
                              setCart((prev) => {
                                const n = { ...prev };
                                delete n[item.id!];
                                return n;
                              })
                            }
                            className='text-zinc-300 hover:text-red-500 transition-colors p-0.5'
                            title={t.remove}
                          >
                            <Trash2 className='w-3.5 h-3.5' />
                          </button>
                        </div>
                        <div className='flex justify-between items-end'>
                          <p className='text-xs text-zinc-500'>
                            @ {t.currency} {item.price.toLocaleString("id-ID")}
                          </p>
                          <div className='flex items-center gap-2 bg-zinc-50 rounded px-1.5 py-0.5 border border-zinc-100'>
                            <button
                              onClick={() => updateCart(item, -1)}
                              className='text-zinc-400 hover:text-zinc-700'
                              title={t.decrease}
                            >
                              <Minus className='w-3 h-3' />
                            </button>
                            <span className='text-xs font-bold w-4 text-center'>
                              {cart[item.id!]}
                            </span>
                            <button
                              onClick={() => updateCart(item, 1)}
                              className='text-zinc-400 hover:text-zinc-700'
                              title={t.increase}
                            >
                              <Plus className='w-3 h-3' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
            <div className='p-5 border-t border-zinc-100 bg-zinc-50 space-y-4'>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm text-zinc-500'>
                  <span>{t.subtotal}</span>
                  <span>
                    {t.currency} {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className='flex justify-between text-xl font-bold text-zinc-900 pt-2 border-t border-zinc-200/50'>
                  <span>{t.total}</span>
                  <span>
                    {t.currency} {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={Object.keys(cart).length === 0}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${theme.checkoutBtn}`}
              >
                <Send className='w-4 h-4' /> {t.checkoutWA}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE FLOATING CART */}
        {totalItems > 0 && (
          <div className='lg:hidden fixed bottom-6 left-0 right-0 px-4 z-40 flex justify-center animate-in slide-in-from-bottom-10 fade-in duration-500'>
            <div className='w-full max-w-md'>
              <button
                onClick={() => setIsMobileCartOpen(true)}
                className={`w-full text-white p-3 pl-4 pr-5 rounded-2xl shadow-2xl flex justify-between items-center active:scale-95 transition-all border backdrop-blur-md ${theme.floatingCart}`}
              >
                <div className='flex items-center gap-3'>
                  <div className='bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm backdrop-blur-md'>
                    {totalItems}
                  </div>
                  <div className='flex flex-col items-start'>
                    <span className='font-bold text-sm'>{t.viewCart}</span>
                    <span className='text-[10px] text-zinc-100/90 font-medium'>
                      {totalItems} {t.itemsSelected}
                    </span>
                  </div>
                </div>
                <div className='text-right'>
                  <span className='block font-bold text-base'>
                    {t.currency} {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* MOBILE CART MODAL */}
        {isMobileCartOpen && (
          <div
            className='lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-end justify-center animate-in fade-in duration-200'
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className='bg-white w-full max-w-md rounded-t-[32px] p-6 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-300 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='w-full flex justify-center mb-6'>
                <div className='w-12 h-1.5 bg-zinc-200 rounded-full'></div>
              </div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-zinc-900 flex items-center gap-2'>
                  <ShoppingBag className={`w-5 h-5 ${theme.cartIcon}`} />{" "}
                  {t.yourOrder}
                </h2>
                <button
                  onClick={() => setIsMobileCartOpen(false)}
                  className='p-2 bg-zinc-50 rounded-full text-zinc-500 hover:bg-zinc-100 transition-colors'
                >
                  <Minus className='w-5 h-5' />
                </button>
              </div>
              <div className='flex-1 overflow-y-auto space-y-4 mb-6 pr-1 scrollbar-hide'>
                {menus
                  .filter((m) => m.id && cart[m.id])
                  .map((item) => (
                    <div
                      key={item.id}
                      className='flex justify-between items-center bg-zinc-50 p-3 rounded-2xl border border-zinc-100'
                    >
                      <div className='flex gap-4 items-center'>
                        <div className='bg-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-zinc-900 border border-zinc-200 shadow-sm'>
                          {cart[item.id!]}x
                        </div>
                        <div>
                          <div className='text-sm font-bold text-zinc-900 line-clamp-1'>
                            {item.name}
                          </div>
                          <div className='text-xs text-zinc-500'>
                            @ {t.currency} {item.price.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                      <div className='font-bold text-zinc-900'>
                        {t.currency}{" "}
                        {(item.price * cart[item.id!]).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
              </div>
              <div className='border-t border-zinc-100 pt-4 mb-6 space-y-2'>
                <div className='flex justify-between text-zinc-500 text-sm'>
                  <span>{t.subtotal}</span>
                  <span>
                    {t.currency} {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className='flex justify-between text-2xl font-bold text-zinc-900'>
                  <span>{t.total}</span>
                  <span>
                    {t.currency} {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${theme.checkoutBtn}`}
              >
                <Send className='w-5 h-5' /> {t.checkoutWA}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
