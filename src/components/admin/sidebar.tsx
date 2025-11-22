"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Settings,
  LogOut,
  Store,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Daftar Menu",
    href: "/admin/menu/list",
    icon: UtensilsCrossed,
  },
  {
    title: "QR Code",
    href: "/admin/qr",
    icon: QrCode,
  },
  {
    title: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    // Hapus 'w-64' fixed width di sini agar mengikuti parent (Desktop: layout, Mobile: Sheet)
    <div className='flex flex-col h-full w-full bg-white dark:bg-zinc-900'>
      {/* Logo Area */}
      <div className='h-16 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-800'>
        <div className='flex items-center gap-2 text-zinc-900 dark:text-zinc-100'>
          <div className='h-8 w-8 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold shadow-sm'>
            B
          </div>
          <span className='font-bold text-lg tracking-tight'>Bookletku</span>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide'>
        <div className='px-3 mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider'>
          Main Menu
        </div>
        {menuItems.map((item) => {
          // Cek active state dengan lebih teliti (termasuk sub-routes)
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link key={item.href} href={item.href} className='block'>
              <span
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-zinc-900 text-white shadow-md dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4",
                    isActive
                      ? "text-zinc-300 dark:text-zinc-600"
                      : "text-zinc-400"
                  )}
                />
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className='p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2'>
        <Link href='/menu/public' target='_blank' className='block'>
          <Button
            variant='outline'
            className='w-full justify-start gap-2 text-zinc-600 dark:text-zinc-300'
            size='sm'
          >
            <Store className='w-4 h-4' />
            Lihat Toko
          </Button>
        </Link>
        <Button
          variant='ghost'
          className='w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
          size='sm'
        >
          <LogOut className='w-4 h-4' />
          Keluar
        </Button>
      </div>
    </div>
  );
}
