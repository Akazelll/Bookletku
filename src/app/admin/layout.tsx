import AdminSidebar from "@/components/admin/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen bg-zinc-50 dark:bg-black font-sans'>
      {/* Sidebar - Hidden on mobile for now (simple implementation) */}
      <div className='hidden md:block fixed inset-y-0 z-50'>
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className='flex-1 md:pl-64 flex flex-col min-h-screen'>
        {/* Top Header */}
        <header className='sticky top-0 z-40 h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-sm'>
          <h2 className='font-semibold text-sm text-zinc-500'>
            Admin Dashboard &gt; Overview
          </h2>
          <div className='flex items-center gap-4'>
            <div className='text-sm text-zinc-600 dark:text-zinc-400'>
              Halo,{" "}
              <span className='font-bold text-zinc-900 dark:text-zinc-100'>
                Owner Resto
              </span>
            </div>
            <ModeToggle />
          </div>
        </header>

        {/* Page Content Container */}
        <main className='flex-1 p-6 md:p-8 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
