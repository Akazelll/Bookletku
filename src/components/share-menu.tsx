"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Printer } from "lucide-react";

export default function ShareMenu() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const menuUrl = `${window.location.origin}/menu`;

  const handleCopy = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-zinc-900 dark:text-zinc-100'>
          Bagikan Menu
        </h3>
      </div>

      <div className='flex flex-col items-center space-y-6'>
        <div className='bg-white p-4 rounded-xl border-2 border-zinc-100 shadow-sm'>
          <QRCodeSVG
            value={menuUrl}
            size={160}
            level='H'
            includeMargin={true}
          />
        </div>

        <div className='w-full space-y-4'>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <input
                readOnly
                value={menuUrl}
                className='w-full text-sm pl-3 pr-10 py-2 rounded-md border border-zinc-300 bg-zinc-50 text-zinc-600 focus:outline-none'
              />
            </div>
            <Button variant='outline' size='icon' onClick={handleCopy}>
              {copied ? (
                <Check className='h-4 w-4 text-green-600' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>

          <div className='flex gap-2'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => window.open(menuUrl, "_blank")}
            >
              <ExternalLink className='mr-2 h-4 w-4' /> Buka
            </Button>
            <Button
              className='flex-1 bg-black text-white hover:bg-zinc-800'
              onClick={() => window.print()}
            >
              <Printer className='mr-2 h-4 w-4' /> Cetak
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
