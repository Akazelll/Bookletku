import { ModeToggle } from "@/components/mode-toggle";
import MenuBuilder from "@/components/menu-builder";
import ShareMenu from "@/components/share-menu";
import MenuSettings from "@/components/menu-settings";

export default function AdminDashboard() {
  return (
    <div className='flex min-h-screen w-full flex-col bg-zinc-50/50 dark:bg-black font-sans'>
      {/* Navbar */}
      <header className='sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-zinc-950/50 backdrop-blur-md'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4 md:px-8'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 bg-black dark:bg-white rounded-lg flex items-center justify-center shadow-sm'>
              <span className='text-white dark:text-black font-bold text-lg'>
                B
              </span>
            </div>
            <h1 className='text-xl font-bold tracking-tight hidden md:block text-zinc-900 dark:text-zinc-100'>
              Bookletku
            </h1>
          </div>
          <div className='flex items-center gap-4'>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className='container mx-auto flex-1 p-4 md:p-8'>
        <div className='mb-8 space-y-1'>
          <h2 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Dashboard
          </h2>
          <p className='text-zinc-500 dark:text-zinc-400'>
            Kelola menu, pantau statistik, dan atur tampilan resto Anda.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
          {/* Kolom Kiri: Menu Builder */}
          <div className='lg:col-span-2'>
            <MenuBuilder />
          </div>

          {/* Kolom Kanan: Settings & Share */}
          <div className='lg:col-span-1 space-y-6 flex flex-col'>
            <MenuSettings />
            <ShareMenu />
          </div>
        </div>
      </main>
    </div>
  );
}
