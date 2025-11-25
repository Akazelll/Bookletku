"use client";

import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Printer, Share2, Utensils } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface PrintableQrCardProps {
  restaurantName: string;
  whatsappNumber?: string;
}

export default function PrintableQrCard({
  restaurantName,
  whatsappNumber,
}: PrintableQrCardProps) {
  const printRef = useRef<HTMLDivElement>(null);

  // PERBAIKAN: Gunakan state untuk menuUrl agar konsisten saat hydration
  const [menuUrl, setMenuUrl] = useState("");

  // Isi menuUrl hanya setelah komponen mounted di client
  useEffect(() => {
    setMenuUrl(`${window.location.origin}/menu/public`);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='space-y-6'>
      {/* Kartu Preview di Layar */}
      <div className='bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm'>
        <div className='p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 flex justify-between items-center'>
          <h3 className='font-semibold text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-2'>
            <Share2 className='w-4 h-4' /> Template Meja
          </h3>
          <Button
            size='sm'
            onClick={handlePrint}
            className='bg-black text-white hover:bg-zinc-800'
          >
            <Printer className='w-4 h-4 mr-2' /> Cetak
          </Button>
        </div>

        <div className='p-8 bg-zinc-100/50 flex justify-center'>
          {/* --- AREA YANG AKAN DICETAK (DESIGN TENT CARD) --- */}
          <div
            ref={printRef}
            id='printable-area'
            className='bg-white w-[300px] p-8 rounded-3xl border-4 border-zinc-900 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden'
          >
            {/* Dekorasi Sudut */}
            <div className='absolute top-0 left-0 w-16 h-16 bg-orange-500 rounded-br-full -translate-x-8 -translate-y-8'></div>
            <div className='absolute bottom-0 right-0 w-16 h-16 bg-zinc-900 rounded-tl-full translate-x-8 translate-y-8'></div>

            {/* Header */}
            <div className='space-y-2 z-10'>
              <div className='w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white mx-auto mb-2 shadow-lg'>
                <Utensils className='w-6 h-6' />
              </div>
              <h2 className='text-xl font-extrabold text-zinc-900 uppercase tracking-tight leading-none'>
                {restaurantName || "Nama Restoran"}
              </h2>
              <p className='text-xs font-medium text-zinc-500 uppercase tracking-widest'>
                Digital Menu
              </p>
            </div>

            {/* QR Code Frame */}
            <div className='relative p-2 bg-white rounded-2xl border-2 border-dashed border-zinc-300'>
              <div className='absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse'>
                SCAN ME
              </div>

              {/* Render QR Code hanya jika URL sudah siap */}
              {menuUrl ? (
                <QRCodeSVG
                  value={menuUrl}
                  size={180}
                  level='H'
                  className='rounded-lg'
                />
              ) : (
                // Skeleton loading saat server-side rendering / initial load
                <div className='w-[180px] h-[180px] bg-zinc-100 rounded-lg animate-pulse' />
              )}
            </div>

            {/* Footer / Call to Action */}
            <div className='space-y-1 z-10'>
              <p className='font-bold text-zinc-900 text-sm'>
                Scan untuk Pesan
              </p>
              <p className='text-xs text-zinc-500 px-4 leading-relaxed'>
                Buka kamera HP Anda, scan kode di atas, dan pesan makanan
                favoritmu tanpa antri!
              </p>
            </div>

            {/* Tempat Nomor Meja (Opsional ditulis tangan) */}
            <div className='pt-4 w-full'>
              <div className='border-t-2 border-dashed border-zinc-200 pt-2'>
                <p className='text-[10px] text-zinc-400 uppercase font-bold'>
                  Meja No.
                </p>
                <div className='h-8 w-16 mx-auto border-b-2 border-zinc-300 mt-1'></div>
              </div>
            </div>
          </div>
          {/* --- END AREA CETAK --- */}
        </div>
      </div>
    </div>
  );
}
