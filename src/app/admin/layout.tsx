import AdminSidebar from "@/components/admin/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen bg-zinc-50/50 dark:bg-black font-sans'>
      {/* --- SIDEBAR DESKTOP (Tetap & Hidden di Mobile) --- */}
      <aside className='hidden md:block w-64 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 fixed inset-y-0 z-50 bg-white dark:bg-zinc-900'>
        <AdminSidebar />
      </aside>

      {/* --- MAIN CONTENT --- */}
      {/* Tambahkan margin-left (md:pl-64) agar tidak tertutup sidebar desktop */}
      <div className='flex-1 md:pl-64 flex flex-col min-h-screen transition-all duration-300'>
        {/* HEADER */}
        <header className='sticky top-0 z-40 h-16 flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-sm'>
          <div className='flex items-center gap-3'>
            {/* --- TOMBOL MENU MOBILE (Sheet Trigger) --- */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='md:hidden -ml-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                >
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='p-0 w-64 border-r-0'>
                {/* Accessibility Title */}
                <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
                {/* Render Sidebar di dalam Sheet */}
                <AdminSidebar />
              </SheetContent>
            </Sheet>

            {/* Judul Halaman (Breadcrumb Sederhana) */}
            <h2 className='font-semibold text-sm text-zinc-700 dark:text-zinc-300'>
              Admin Dashboard
            </h2>
          </div>

          {/* Kanan Header */}
          <div className='flex items-center gap-3'>
            <div className='hidden sm:block text-xs text-right'>
              <p className='text-zinc-500'>Login sebagai</p>
              <p className='font-bold text-zinc-900 dark:text-zinc-100'>
                Owner
              </p>
            </div>
            <ModeToggle />
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className='flex-1 p-4 md:p-8 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
