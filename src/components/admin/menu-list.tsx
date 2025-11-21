"use client";

import { MenuItem } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Trash2, ImagePlus, Pencil } from "lucide-react";
import Link from "next/link";

interface MenuListProps {
  menus: MenuItem[];
  onDelete: (id: string) => void;
}

export default function MenuList({ menus, onDelete }: MenuListProps) {
  if (menus.length === 0) {
    return (
      <div className='text-center py-12 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400 bg-zinc-50/50'>
        <p>Belum ada menu yang ditambahkan.</p>
      </div>
    );
  }

  return (
    <div className='grid gap-4'>
      {menus.map((menu) => (
        <div
          key={menu.id}
          className='relative flex items-start gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-300 transition-all'
        >
          <div className='w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden border border-zinc-100 relative'>
            {menu.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={menu.imageUrl}
                alt={menu.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-zinc-300'>
                <ImagePlus className='w-6 h-6' />
              </div>
            )}
          </div>

          <div className='flex-1 min-w-0'>
            <div className='flex justify-between items-start'>
              <div>
                <h4 className='font-bold text-zinc-900 dark:text-zinc-100 truncate text-base'>
                  {menu.name}
                </h4>
                <span className='inline-block px-2 py-0.5 text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full mb-1 mt-1'>
                  {menu.category}
                </span>
              </div>

              <div className='flex gap-1 -mr-2 -mt-2'>
                {/* Tombol Edit: Link ke halaman edit */}
                <Link href={`/admin/menu/${menu.id}`}>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-zinc-400 hover:text-blue-600'
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                </Link>

                {/* Tombol Delete */}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => menu.id && onDelete(menu.id)}
                  className='h-8 w-8 text-zinc-400 hover:text-red-600'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <p className='text-sm text-zinc-500 line-clamp-2 mt-1'>
              {menu.description}
            </p>
            <p className='text-sm font-bold mt-2 text-zinc-900 dark:text-zinc-100'>
              Rp {menu.price.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
