// src/app/admin/qr/page.tsx
import ShareMenu from "@/components/share-menu";
import { Info } from "lucide-react";

export default function QrPage() {
  return (
    <div className='max-w-5xl mx-auto space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
          Bagikan Menu
        </h1>
        <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
          Unduh kode QR untuk dicetak di meja atau bagikan link menu langsung ke
          pelanggan.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start'>
        {/* Kolom Kiri: Komponen ShareMenu yang sudah ada */}
        <div className='md:col-span-2'>
          {/* Kita bungkus agar backgroundnya menyatu dengan ShareMenu */}
          <ShareMenu />
        </div>

        {/* Kolom Kanan: Tips / Info */}
        <div className='space-y-6'>
          <div className='bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800'>
            <div className='flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-300 font-semibold'>
              <Info className='w-5 h-5' />
              <h3>Tips Penggunaan</h3>
            </div>
            <ul className='list-disc list-inside text-sm text-blue-700/80 dark:text-blue-300/80 space-y-2 leading-relaxed'>
              <li>
                Cetak kode QR dan tempelkan di setiap meja restoran atau kasir.
              </li>
              <li>Pelanggan tidak perlu menginstall aplikasi apapun.</li>
              <li>Cukup scan menggunakan kamera HP, menu langsung terbuka.</li>
              <li>Pesanan akan dikirim langsung ke WhatsApp Anda.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
