"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { MenuItem, CATEGORIES, RestaurantProfile } from "@/types/menu"; // Pastikan import RestaurantProfile
import {
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Utensils,
  Globe,
  Trash2,
  Search,
  X,
  ChefHat,
} from "lucide-react";
import { logEvent } from "@/services/analytics-service";

const TRANSLATIONS = {
  id: {
    title: "Bookletku Resto",
    subtitle: "Menu Digital",
    openHours: "Buka: 10:00 - 22:00",
    all: "Semua",
    emptyCategory: "Menu belum tersedia di kategori ini.",
    noImage: "Foto Belum Tersedia",
    add: "Tambah",
    yourOrder: "Pesanan Kamu",
    emptyCartTitle: "Keranjang masih kosong",
    emptyCartDesc: "Yuk, pilih menu favoritmu sekarang!",
    subtotal: "Subtotal",
    total: "Total Bayar",
    checkoutWA: "Pesan via WhatsApp",
    viewCart: "Lihat Keranjang",
    itemsSelected: "menu dipilih",
    greeting: "Halo, saya mau pesan menu ini:",
    pleaseProcess: "Mohon diproses ya, Terima kasih!",
    searchPlaceholder: "Cari menu lapar...",
  },
  en: {
    title: "Bookletku Resto",
    subtitle: "Digital Menu",
    openHours: "Open: 10:00 AM - 10:00 PM",
    all: "All",
    emptyCategory: "No items found here.",
    noImage: "No Image",
    add: "Add",
    yourOrder: "Your Order",
    emptyCartTitle: "Cart is empty",
    emptyCartDesc: "Go pick some delicious food!",
    subtotal: "Subtotal",
    total: "Total",
    checkoutWA: "Order on WhatsApp",
    viewCart: "View Cart",
    itemsSelected: "items selected",
    greeting: "Hello, I would like to order:",
    pleaseProcess: "Please process my order, Thanks!",
    searchPlaceholder: "Search for food...",
  },
};

const CATEGORY_LABELS: Record<string, { id: string; en: string }> = {
  "Makanan Utama": { id: "Makanan Utama", en: "Main Course" },
  Minuman: { id: "Minuman", en: "Drinks" },
  Cemilan: { id: "Cemilan", en: "Snacks" },
  Dessert: { id: "Dessert", en: "Dessert" },
  "Paket Hemat": { id: "Paket Hemat", en: "Value Meals" },
};

// --- UPDATE INTERFACE PROPS ---
interface MenuPublicProps {
  initialMenus: MenuItem[];
  profile?: RestaurantProfile | null; // Tambahkan ini agar tidak error saat build
  initialTheme?: string; // Opsional, untuk backward compatibility
}

export default function MenuPublic({ initialMenus, profile }: MenuPublicProps) {
  const [menus] = useState<MenuItem[]>(initialMenus);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const [lang, setLang] = useState<"id" | "en">("id");
  const t = TRANSLATIONS[lang];

  // --- DATA DINAMIS DARI PROFILE ---
  const theme = profile?.theme || "minimalist";
  const restaurantName = profile?.restaurantName || "Bookletku Resto";
  const whatsappNumber = profile?.whatsappNumber || "6281234567890";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    logEvent("page_view");
  }, []);

  const trackAddToCart = (item: MenuItem) => {
    if (item.id) {
      logEvent("add_to_cart", item.id);
    }
  };

  const updateCart = (item: MenuItem, delta: number) => {
    if (!item.id) return;

    setCart((prev) => {
      const currentQty = prev[item.id!] || 0;
      const newCount = currentQty + delta;
      const newCart = { ...prev };

      if (newCount > 0) {
        if (delta > 0) trackAddToCart(item);
        newCart[item.id!] = newCount;
      } else {
        delete newCart[item.id!];
      }
      return newCart;
    });
  };

  const totalItems = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      menus.reduce((total, item) => {
        if (!item.id) return total;
        return total + item.price * (cart[item.id] || 0);
      }, 0),
    [cart, menus]
  );

  const cartItemsList = useMemo(
    () => menus.filter((m) => m.id && cart[m.id]),
    [cart, menus]
  );

  const handleCheckout = () => {
    if (cartItemsList.length === 0) return;
    let message = `${t.greeting}\n\n`;
    cartItemsList.forEach((item) => {
      if (!item.id) return;
      message += `• ${item.name} (${cart[item.id]}x) — Rp ${(
        item.price * cart[item.id]
      ).toLocaleString("id-ID")}\n`;
    });
    message += `\n*${t.total}: Rp ${totalPrice.toLocaleString("id-ID")}*`;
    message += `\n\n${t.pleaseProcess}`;

    // Gunakan nomor WA dinamis
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  const filteredMenus = menus.filter((menu) => {
    const matchCategory =
      selectedCategory === "ALL" || menu.category === selectedCategory;
    const matchSearch = menu.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Style Logik
  const isColorful = theme === "colorful";

  const activeTabClass = isColorful
    ? "bg-orange-600 text-white shadow-orange-200 shadow-md ring-2 ring-orange-100"
    : "bg-zinc-900 text-white shadow-zinc-200 shadow-md ring-2 ring-zinc-100";

  const primaryBtnClass = isColorful
    ? "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200"
    : "bg-zinc-900 hover:bg-black text-white shadow-zinc-200";

  const priceTextClass = isColorful ? "text-orange-600" : "text-zinc-900";

  return (
    <div className='min-h-screen bg-white selection:bg-zinc-100 font-sans text-zinc-900 pb-24 lg:pb-0'>
      <nav
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-zinc-200 shadow-sm py-3"
            : "bg-white border-transparent py-5"
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg ${primaryBtnClass}`}
            >
              <ChefHat className='w-6 h-6' />
            </div>
            <div>
              {/* Nama Restoran Dinamis */}
              <h1 className='text-lg font-bold leading-none tracking-tight'>
                {restaurantName}
              </h1>
              <p className='text-xs font-medium text-zinc-500 mt-1 uppercase tracking-wider'>
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='hidden md:flex items-center px-3 py-1.5 bg-zinc-100 rounded-full border border-zinc-200'>
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isColorful ? "bg-green-500" : "bg-zinc-500 animate-pulse"
                }`}
              ></div>
              <span className='text-xs font-semibold text-zinc-600'>
                {t.openHours}
              </span>
            </div>
            <button
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className='flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-zinc-100 border border-zinc-200 transition-colors bg-white'
            >
              <Globe className='w-4 h-4 text-zinc-600' />
              <span className='text-xs font-bold text-zinc-700'>
                {lang.toUpperCase()}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- Search & Categories --- */}
      <div className='pt-24 lg:pt-28 pb-6 px-4 sm:px-6 max-w-7xl mx-auto'>
        <div className='relative max-w-2xl mx-auto lg:mx-0 mb-8'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400' />
            <input
              type='text'
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all placeholder:text-zinc-400 font-medium'
            />
          </div>
        </div>

        <div className='sticky top-[70px] md:top-[80px] z-30 bg-white/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-zinc-100 sm:border-none'>
          <div className='flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0'>
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 ${
                selectedCategory === "ALL"
                  ? activeTabClass
                  : "bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
              }`}
            >
              {t.all}
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 ${
                  selectedCategory === cat
                    ? activeTabClass
                    : "bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
                }`}
              >
                {CATEGORY_LABELS[cat]?.[lang] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Main Grid Content --- */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10 items-start'>
        <div className='flex-1 w-full min-h-[50vh]'>
          {filteredMenus.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50'>
              <div className='w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4 shadow-sm'>
                <Utensils className='w-8 h-8 text-zinc-300' />
              </div>
              <h3 className='text-lg font-bold text-zinc-900'>
                {t.emptyCategory}
              </h3>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
              {filteredMenus.map((menu) => {
                const qty = menu.id ? cart[menu.id] || 0 : 0;

                return (
                  <div
                    key={menu.id}
                    className={`group relative bg-white rounded-3xl p-3 border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-row sm:flex-col gap-4 sm:gap-0 ${
                      qty > 0 ? "ring-1 ring-zinc-200 bg-zinc-50/30" : ""
                    }`}
                  >
                    <div className='w-28 h-28 sm:w-full sm:h-52 bg-zinc-100 rounded-2xl overflow-hidden relative flex-shrink-0'>
                      {menu.imageUrl ? (
                        <Image
                          src={menu.imageUrl}
                          alt={menu.name}
                          fill
                          sizes='(max-width: 768px) 30vw, (max-width: 1200px) 50vw, 33vw'
                          className='object-cover group-hover:scale-110 transition-transform duration-500'
                        />
                      ) : (
                        <div className='w-full h-full flex flex-col items-center justify-center text-zinc-300 bg-zinc-50'>
                          <Utensils className='w-8 h-8 mb-2 opacity-20' />
                          <span className='text-[10px] font-medium uppercase tracking-widest opacity-40'>
                            {t.noImage}
                          </span>
                        </div>
                      )}

                      {!menu.isAvailable && (
                        <div className='absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10'>
                          <span className='bg-black text-white text-xs font-bold px-3 py-1 rounded-full'>
                            Habis
                          </span>
                        </div>
                      )}
                    </div>

                    <div className='flex flex-col justify-between flex-1 sm:pt-4 sm:px-2 pb-1'>
                      <div>
                        <div className='flex justify-between items-start mb-1'>
                          <span className='text-[10px] font-bold uppercase tracking-wider text-zinc-400'>
                            {CATEGORY_LABELS[menu.category]?.[lang] ||
                              menu.category}
                          </span>
                        </div>
                        <h3 className='font-bold text-zinc-900 text-base sm:text-lg leading-snug line-clamp-2 mb-2'>
                          {menu.name}
                        </h3>
                        <p className='text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4 hidden sm:block'>
                          {menu.description}
                        </p>
                      </div>

                      <div className='flex items-end justify-between mt-auto'>
                        <div
                          className={`font-extrabold text-lg ${priceTextClass}`}
                        >
                          <span className='text-xs font-medium text-zinc-400 mr-0.5'>
                            Rp
                          </span>
                          {menu.price.toLocaleString("id-ID")}
                        </div>

                        <div className='flex items-center'>
                          {qty > 0 ? (
                            <div className='flex items-center bg-black rounded-full p-1 shadow-lg animate-in fade-in zoom-in duration-200'>
                              <button
                                onClick={() => updateCart(menu, -1)}
                                className='w-7 h-7 flex items-center justify-center bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-colors active:scale-90'
                              >
                                <Minus className='w-3.5 h-3.5' />
                              </button>
                              <span className='w-8 text-center text-sm font-bold text-white'>
                                {qty}
                              </span>
                              <button
                                onClick={() => updateCart(menu, 1)}
                                className='w-7 h-7 flex items-center justify-center bg-white text-black rounded-full hover:bg-zinc-200 transition-colors active:scale-90'
                              >
                                <Plus className='w-3.5 h-3.5' />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => updateCart(menu, 1)}
                              disabled={!menu.isAvailable}
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm hover:shadow-md ${
                                !menu.isAvailable
                                  ? "bg-zinc-100 text-zinc-300 cursor-not-allowed"
                                  : `bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50`
                              }`}
                            >
                              <Plus className='w-5 h-5' />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Cart */}
        <aside className='hidden lg:block w-[380px] flex-shrink-0 sticky top-28 h-[calc(100vh-140px)]'>
          <div className='bg-white rounded-[32px] shadow-2xl shadow-zinc-200/50 border border-zinc-100 flex flex-col h-full overflow-hidden'>
            <div className='p-6 border-b border-zinc-100 bg-zinc-50/50 backdrop-blur-sm'>
              <h2 className='text-xl font-bold flex items-center gap-3 text-zinc-900'>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${primaryBtnClass}`}
                >
                  <ShoppingBag className='w-4 h-4' />
                </div>
                {t.yourOrder}
              </h2>
            </div>

            <div className='flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 hover:scrollbar-thumb-zinc-300'>
              {cartItemsList.length === 0 ? (
                <div className='h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60'>
                  <div className='w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100'>
                    <ShoppingBag className='w-8 h-8 text-zinc-300' />
                  </div>
                  <div>
                    <p className='text-zinc-900 font-bold'>
                      {t.emptyCartTitle}
                    </p>
                    <p className='text-sm text-zinc-500 mt-1'>
                      {t.emptyCartDesc}
                    </p>
                  </div>
                </div>
              ) : (
                cartItemsList.map((item) => (
                  <div
                    key={item.id}
                    className='group flex gap-4 animate-in slide-in-from-right-4 duration-300'
                  >
                    <div className='w-16 h-16 bg-zinc-100 rounded-xl overflow-hidden relative flex-shrink-0 border border-zinc-100'>
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className='object-cover'
                        />
                      )}
                    </div>
                    <div className='flex-1 min-w-0 flex flex-col justify-between py-0.5'>
                      <div className='flex justify-between items-start'>
                        <h4 className='font-bold text-sm text-zinc-900 line-clamp-1 pr-2'>
                          {item.name}
                        </h4>
                        <button
                          onClick={() => {
                            if (item.id) {
                              const newCart = { ...cart };
                              delete newCart[item.id];
                              setCart(newCart);
                            }
                          }}
                          className='text-zinc-300 hover:text-red-500 transition-colors'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                      <div className='flex items-end justify-between mt-1'>
                        <p className='text-xs font-medium text-zinc-500'>
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                        <div className='flex items-center bg-zinc-50 border border-zinc-200 rounded-lg px-1 py-0.5'>
                          <button
                            onClick={() => updateCart(item, -1)}
                            className='w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-white rounded-md transition-all'
                          >
                            <Minus className='w-3 h-3' />
                          </button>
                          <span className='w-6 text-center text-xs font-bold text-zinc-900'>
                            {cart[item.id!]}
                          </span>
                          <button
                            onClick={() => updateCart(item, 1)}
                            className='w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-white rounded-md transition-all'
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

            <div className='p-6 bg-zinc-50 border-t border-zinc-100 space-y-4'>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between text-zinc-500'>
                  <span>{t.subtotal}</span>
                  <span className='font-medium'>
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className='flex justify-between items-center pt-3 border-t border-zinc-200'>
                  <span className='font-bold text-zinc-900 text-lg'>
                    {t.total}
                  </span>
                  <span className={`font-bold text-xl ${priceTextClass}`}>
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cartItemsList.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${primaryBtnClass}`}
              >
                <Send className='w-4 h-4' />
                {t.checkoutWA}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Floating Button */}
      {totalItems > 0 && !isMobileCartOpen && (
        <div className='lg:hidden fixed bottom-6 inset-x-4 z-50 animate-in slide-in-from-bottom-10 duration-500'>
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className={`w-full p-4 rounded-2xl shadow-2xl flex items-center justify-between text-white backdrop-blur-md active:scale-95 transition-all ${primaryBtnClass}`}
          >
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-sm backdrop-blur-sm border border-white/10'>
                {totalItems}
              </div>
              <div className='flex flex-col items-start'>
                <span className='font-bold text-sm'>{t.viewCart}</span>
                <span className='text-[10px] opacity-80 font-medium'>
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            <ShoppingBag className='w-5 h-5 opacity-90' />
          </button>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobileCartOpen && (
        <>
          <div
            className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300'
            onClick={() => setIsMobileCartOpen(false)}
          />
          <div className='lg:hidden fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300'>
            <div
              className='w-full flex justify-center pt-3 pb-1 bg-white'
              onClick={() => setIsMobileCartOpen(false)}
            >
              <div className='w-12 h-1.5 bg-zinc-200 rounded-full' />
            </div>

            <div className='px-6 pb-4 border-b border-zinc-100 flex items-center justify-between bg-white'>
              <h2 className='text-lg font-bold text-zinc-900 flex items-center gap-2'>
                <ShoppingBag
                  className={`w-5 h-5 ${
                    isColorful ? "text-orange-600" : "text-black"
                  }`}
                />
                {t.yourOrder}
              </h2>
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className='p-2 bg-zinc-100 rounded-full text-zinc-500 hover:bg-zinc-200'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto p-6 space-y-5 bg-zinc-50/50'>
              {cartItemsList.map((item) => (
                <div
                  key={item.id}
                  className='flex gap-4 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm'
                >
                  <div className='w-16 h-16 bg-zinc-100 rounded-xl overflow-hidden relative flex-shrink-0'>
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    )}
                  </div>
                  <div className='flex-1 min-w-0 flex flex-col justify-between'>
                    <h4 className='font-bold text-sm text-zinc-900 line-clamp-1'>
                      {item.name}
                    </h4>
                    <div className='flex items-end justify-between mt-2'>
                      <span className='text-xs font-medium text-zinc-500'>
                        Rp {item.price.toLocaleString("id-ID")}
                      </span>
                      <div className='flex items-center bg-zinc-50 border border-zinc-200 rounded-lg px-1 py-0.5'>
                        <button
                          onClick={() => updateCart(item, -1)}
                          className='w-7 h-7 flex items-center justify-center text-zinc-500 hover:bg-white rounded-md'
                        >
                          <Minus className='w-3.5 h-3.5' />
                        </button>
                        <span className='w-6 text-center text-xs font-bold text-zinc-900'>
                          {cart[item.id!]}
                        </span>
                        <button
                          onClick={() => updateCart(item, 1)}
                          className='w-7 h-7 flex items-center justify-center text-zinc-500 hover:bg-white rounded-md'
                        >
                          <Plus className='w-3.5 h-3.5' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='p-6 bg-white border-t border-zinc-100 pb-safe-area'>
              <div className='flex justify-between items-center mb-4'>
                <span className='text-sm font-medium text-zinc-500'>
                  {t.total}
                </span>
                <span className={`text-xl font-extrabold ${priceTextClass}`}>
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform ${primaryBtnClass}`}
              >
                <Send className='w-5 h-5' />
                {t.checkoutWA}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
