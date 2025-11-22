"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { MenuItem, CATEGORIES } from "@/types/menu";
import { Minus, Plus, Send, ShoppingBag, Utensils, Globe, Trash2 } from "lucide-react";
// Pastikan file analytics-service.ts sudah dibuat di langkah sebelumnya
import { logEvent } from "@/services/analytics-service";

// --- KAMUS BAHASA ---
const TRANSLATIONS = {
  id: {
    title: "Bookletku Resto",
    subtitle: "Digital Menu",
    openHours: "Buka Setiap Hari: 10:00 - 22:00",
    all: "Semua",
    emptyCategory: "Menu tidak ditemukan di kategori ini.",
    noImage: "No Image",
    add: "Tambah",
    yourOrder: "Pesanan Anda",
    emptyCartTitle: "Keranjang kosong",
    emptyCartDesc: "Pilih menu enak di sebelah kiri!",
    subtotal: "Subtotal",
    total: "Total",
    checkoutWA: "Pesan via WhatsApp",
    viewCart: "Lihat Keranjang",
    itemsSelected: "item terpilih",
    greeting: "Halo, saya mau pesan:",
    pleaseProcess: "Mohon diproses ya!",
  },
  en: {
    title: "Bookletku Resto",
    subtitle: "Digital Menu",
    openHours: "Open Daily: 10:00 AM - 10:00 PM",
    all: "All",
    emptyCategory: "No items found in this category.",
    noImage: "No Image",
    add: "Add",
    yourOrder: "Your Order",
    emptyCartTitle: "Cart is empty",
    emptyCartDesc: "Pick some delicious items from the left!",
    subtotal: "Subtotal",
    total: "Total",
    checkoutWA: "Order via WhatsApp",
    viewCart: "View Cart",
    itemsSelected: "items selected",
    greeting: "Hello, I would like to order:",
    pleaseProcess: "Please process this order!",
  },
};

const WA_NUMBER = "6281234567890";

interface MenuPublicProps {
  initialMenus: MenuItem[];
  initialTheme: string;
}

export default function MenuPublic({
  initialMenus,
  initialTheme,
}: MenuPublicProps) {
  const [menus] = useState<MenuItem[]>(initialMenus);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Theme & Lang
  const [lang, setLang] = useState<"id" | "en">("id");
  const t = TRANSLATIONS[lang];

  // Update selectedCategory default saat load/ganti bahasa
  useEffect(() => {
    setSelectedCategory(t.all);
  }, [lang, t.all]);

  // --- ANALYTICS: Track Page View ---
  useEffect(() => {
    logEvent("page_view");
  }, []);

  // --- ANALYTICS: Track Add To Cart ---
  const trackAddToCart = (item: MenuItem) => {
    if (item.id) {
      logEvent("add_to_cart", item.id);
    }
  };

  // Logic Keranjang
  const updateCart = (item: MenuItem, delta: number) => {
    if (!item.id) return;

    setCart((prev) => {
      const newCount = (prev[item.id!] || 0) + delta;
      const newCart = { ...prev };
      if (newCount > 0) {
        // Jika user menambah item (bukan mengurangi), catat event
        if (delta > 0) {
          trackAddToCart(item);
        }
        newCart[item.id!] = newCount;
      } else {
        delete newCart[item.id!];
      }
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = menus.reduce((total, item) => {
    return total + item.price * (cart[item.id!] || 0);
  }, 0);

  const cartItemsList = menus.filter((m) => m.id && cart[m.id]);

  const handleCheckout = () => {
    if (cartItemsList.length === 0) return;
    let message = `${t.greeting}\n\n`;
    cartItemsList.forEach((item) => {
      message += `- ${item.name} (${
        cart[item.id!]
      }) x Rp${item.price.toLocaleString("id-ID")}\n`;
    });
    message += `\n*${t.total}: Rp ${totalPrice.toLocaleString("id-ID")}*`;
    message += `\n\n${t.pleaseProcess}`;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  // Filter Menu
  const filteredMenus =
    selectedCategory === t.all
      ? menus
      : menus.filter((m) => m.category === selectedCategory);

  // Styling
  const isColorful = initialTheme === "colorful";
  const primaryBg = isColorful ? "bg-orange-600" : "bg-black";
  const primaryText = isColorful ? "text-orange-600" : "text-black";
  const activeTabClass = isColorful
    ? "bg-orange-600 text-white shadow-orange-200"
    : "bg-black text-white shadow-zinc-900/20";

  return (
    <div
      className={`min-h-screen bg-zinc-50 font-sans text-zinc-900 ${
        isColorful ? "selection:bg-orange-100 selection:text-orange-900" : ""
      }`}
    >
      {/* NAVBAR */}
      <nav className='bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-sm h-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm ${primaryBg}`}
            >
              <Utensils className='w-5 h-5' />
            </div>
            <div>
              <h1 className='text-lg font-bold leading-tight tracking-tight'>
                {t.title}
              </h1>
              <p className='text-[10px] uppercase tracking-wider text-zinc-500 font-medium'>
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className='flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-bold transition-colors'
            >
              <Globe className='w-3.5 h-3.5' /> {lang.toUpperCase()}
            </button>
            <div className='hidden md:block text-sm font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full'>
              {t.openHours}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-start pt-4 lg:pt-8 gap-8 px-4 sm:px-6 lg:px-8'>
        {/* MENU LIST */}
        <div className='flex-1 w-full min-h-[80vh] pb-32 lg:pb-10'>
          <div className='sticky top-[72px] z-20 bg-zinc-50/95 backdrop-blur-sm py-2 mb-6 -mx-4 px-4 lg:mx-0 lg:px-0 border-b border-zinc-200/50 lg:border-none'>
            <div className='flex gap-2 overflow-x-auto no-scrollbar pb-2'>
              <button
                onClick={() => setSelectedCategory(t.all)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === t.all
                    ? `${activeTabClass} shadow-lg`
                    : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                {t.all}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === cat
                      ? `${activeTabClass} shadow-lg`
                      : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredMenus.length === 0 ? (
            <div className='text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200'>
              <div className='inline-flex p-4 bg-zinc-50 rounded-full mb-4 text-zinc-300'>
                <ShoppingBag className='w-8 h-8' />
              </div>
              <p className='text-zinc-500 font-medium'>{t.emptyCategory}</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6'>
              {filteredMenus.map((menu) => (
                <div
                  key={menu.id}
                  className='group bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-200 transition-all duration-300 overflow-hidden flex flex-row md:flex-col h-32 md:h-auto'
                >
                  <div className='w-32 md:w-full h-full md:h-48 bg-zinc-100 flex-shrink-0 relative overflow-hidden'>
                    {menu.imageUrl ? (
                      <Image
                        src={menu.imageUrl}
                        alt={menu.name}
                        fill
                        sizes='(max-width: 768px) 30vw, (max-width: 1200px) 50vw, 33vw'
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
                      <div className='hidden md:flex absolute top-3 right-3 bg-black/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm animate-in fade-in zoom-in z-10'>
                        {cart[menu.id!]}x
                      </div>
                    )}
                  </div>
                  <div className='p-4 flex flex-col justify-between flex-1'>
                    <div>
                      <h3 className='font-bold text-zinc-900 line-clamp-1 md:line-clamp-2 text-base md:text-lg mb-1'>
                        {menu.name}
                      </h3>
                      <p className='text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3'>
                        {menu.description}
                      </p>
                    </div>
                    <div className='flex items-center justify-between mt-auto'>
                      <span className={`font-bold text-base ${primaryText}`}>
                        Rp {menu.price.toLocaleString("id-ID")}
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
                          </>
                        ) : null}
                        <button
                          onClick={() => updateCart(menu, 1)}
                          className={`flex items-center justify-center rounded-full shadow-sm transition-all active:scale-90 ${
                            cart[menu.id!]
                              ? `w-8 h-8 text-white hover:opacity-90 ${primaryBg}`
                              : "px-4 py-1.5 bg-zinc-900 text-white text-xs font-bold hover:bg-black"
                          }`}
                        >
                          {cart[menu.id!] ? (
                            <Plus className='w-4 h-4' />
                          ) : (
                            t.add
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP CART */}
        <div className='hidden lg:block w-96 flex-shrink-0 sticky top-24 z-10'>
          <div className='bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]'>
            <div className='p-5 border-b border-zinc-100 bg-white'>
              <h2 className='text-lg font-bold flex items-center gap-2 text-zinc-900'>
                <ShoppingBag className={`w-5 h-5 ${primaryText}`} />{" "}
                {t.yourOrder}
              </h2>
            </div>
            <div className='flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-zinc-200'>
              {cartItemsList.length === 0 ? (
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
                cartItemsList.map((item) => (
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
                        >
                          <Trash2 className='w-3.5 h-3.5' />
                        </button>
                      </div>
                      <div className='flex justify-between items-end'>
                        <p className='text-xs text-zinc-500'>
                          @ Rp{item.price.toLocaleString("id-ID")}
                        </p>
                        <div className='flex items-center gap-2 bg-zinc-50 rounded px-1.5 py-0.5 border border-zinc-100'>
                          <button
                            onClick={() => updateCart(item, -1)}
                            className='text-zinc-400 hover:text-zinc-700'
                          >
                            <Minus className='w-3 h-3' />
                          </button>
                          <span className='text-xs font-bold w-4 text-center'>
                            {cart[item.id!]}
                          </span>
                          <button
                            onClick={() => updateCart(item, 1)}
                            className='text-zinc-400 hover:text-zinc-700'
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
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className='flex justify-between text-xl font-bold text-zinc-900 pt-2 border-t border-zinc-200/50'>
                  <span>{t.total}</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cartItemsList.length === 0}
                className={`w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform active:scale-[0.98] ${
                  isColorful
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-zinc-900 hover:bg-black"
                }`}
              >
                <Send className='w-4 h-4' />
                {t.checkoutWA}
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
                className={`w-full text-white p-3 pl-4 pr-5 rounded-2xl shadow-2xl flex justify-between items-center active:scale-95 transition-all border border-zinc-700/50 backdrop-blur-sm ${
                  isColorful
                    ? "bg-green-600 shadow-green-900/30"
                    : "bg-zinc-900 shadow-zinc-900/30"
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div className='bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm backdrop-blur-md'>
                    {totalItems}
                  </div>
                  <div className='flex flex-col items-start'>
                    <span className='font-bold text-sm'>{t.viewCart}</span>
                    <span className='text-[10px] text-zinc-200 font-medium'>
                      {totalItems} {t.itemsSelected}
                    </span>
                  </div>
                </div>
                <div className='text-right'>
                  <span className='block font-bold text-base'>
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* MOBILE CART MODAL */}
        {isMobileCartOpen && (
          <div className='lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-end justify-center animate-in fade-in duration-200'>
            <div
              className='bg-white w-full max-w-md rounded-t-[32px] p-6 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-300 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='w-full flex justify-center mb-6'>
                <div className='w-12 h-1.5 bg-zinc-200 rounded-full'></div>
              </div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-zinc-900 flex items-center gap-2'>
                  <ShoppingBag className={`w-5 h-5 ${primaryText}`} />{" "}
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
                {cartItemsList.map((item) => (
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
                          @ Rp{item.price.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                    <div className='font-bold text-zinc-900'>
                      Rp{(item.price * cart[item.id!]).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
              <div className='border-t border-zinc-100 pt-4 mb-6 space-y-2'>
                <div className='flex justify-between text-zinc-500 text-sm'>
                  <span>{t.subtotal}</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className='flex justify-between text-2xl font-bold text-zinc-900'>
                  <span>{t.total}</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className='w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-600/20'
              >
                <Send className='w-5 h-5' />
                {t.checkoutWA}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}