import ShareMenu from "@/components/share-menu";
import PrintableQrCard from "@/components/admin/printable-qr-card";
import { getSettings } from "@/services/settings-service";
import { Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function QrPage() {
  // Ambil nama restoran dari settings
  const settings = await getSettings();
  const restaurantName = settings?.restaurantName || "Bookletku Resto";

  return (
    <div className='max-w-6xl mx-auto space-y-8 pb-20'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
          QR Code & Promosi
        </h1>
        <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
          Bagikan link menu atau cetak kartu QR untuk diletakkan di meja
          pelanggan.
        </p>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 items-start'>
        {/* KIRI: Link Sharing Sederhana */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
            Link Digital
          </h2>
          <ShareMenu />

          {/* Tips Box */}
          <div className='bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800'>
            <div className='flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-300 font-semibold'>
              <Info className='w-5 h-5' />
              <h3>Cara Kerja</h3>
            </div>
            <ul className='list-disc list-inside text-sm text-blue-700/80 dark:text-blue-300/80 space-y-2 leading-relaxed'>
              <li>Pelanggan scan kode QR menggunakan kamera HP.</li>
              <li>Menu terbuka di browser (tanpa install aplikasi).</li>
              <li>Pesanan masuk otomatis ke WhatsApp Anda.</li>
            </ul>
          </div>
        </div>

        {/* KANAN: Template Cetak */}
        <div className='space-y-6'>
          <h2 className='text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
            Template Cetak (Meja)
          </h2>
          <PrintableQrCard restaurantName={restaurantName} />
        </div>
      </div>
    </div>
  );
}
