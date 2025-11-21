import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

export default function LandingPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4'>
      <div className='max-w-md w-full text-center space-y-6'>
        <div className='flex justify-center'>
          <div className='h-16 w-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg'>
            <Utensils className='h-8 w-8 text-white dark:text-black' />
          </div>
        </div>

        <h1 className='text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
          Bookletku
        </h1>

        <p className='text-zinc-500 dark:text-zinc-400 text-lg'>
          Buat menu digital untuk restoran Anda dalam hitungan menit. Gratis dan
          mudah.
        </p>

        <div className='flex flex-col gap-3 pt-4'>
          <Link href='/admin/dashboard' className='w-full'>
            <Button className='w-full h-12 text-base rounded-xl bg-black text-white hover:bg-zinc-800'>
              Masuk ke Dashboard
            </Button>
          </Link>
          {/* Nanti bisa tambah tombol Login/Register sesungguhnya di sini */}
        </div>
      </div>
    </div>
  );
}
