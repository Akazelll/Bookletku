// src/components/menu-list.tsx
"use client";

import { MenuItem } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Trash2, ImagePlus, Pencil, CloudUpload } from "lucide-react";

export interface OptimisticMenuItem extends MenuItem {
  isPending?: boolean;
  tempImage?: string;
}

interface MenuListProps {
  menus: OptimisticMenuItem[];
  onEdit: (menu: MenuItem) => void;
  onDelete: (id: string) => void;
  editId: string | null;
}

export default function MenuList({
  menus,
  onEdit,
  onDelete,
  editId,
}: MenuListProps) {
  if (menus.length === 0) {
    return (
      <div className='text-center py-12 border-2 border-dashed border-zinc-200 rounded-xl text-zinc-400'>
        <p>Belum ada menu.</p>
      </div>
    );
  }

  return (
    <div className='grid gap-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide'>
      {menus.map((menu) => (
        <div
          key={menu.id}
          className={`relative flex items-start gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm transition-all ${
            menu.isPending
              ? "opacity-70 border-blue-200 bg-blue-50/30"
              : "border-zinc-200"
          } ${editId === menu.id ? "border-black ring-1 ring-black" : ""}`}
        >
          {menu.isPending && (
            <div className='absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded-full z-10'>
              <CloudUpload className='w-3 h-3 animate-bounce' /> Menyimpan...
            </div>
          )}
          <div className='w-20 h-20 bg-zinc-100 rounded-lg flex-shrink-0 overflow-hidden border border-zinc-100 relative'>
            {menu.tempImage || menu.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={menu.tempImage || menu.imageUrl}
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
                <span className='inline-block px-2 py-0.5 text-[10px] font-medium bg-zinc-100 text-zinc-600 rounded-full mb-1 mt-1'>
                  {menu.category}
                </span>
              </div>
              <div className='flex gap-1 -mr-2 -mt-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  disabled={!!menu.isPending}
                  onClick={() => onEdit(menu)}
                  className='h-8 w-8 text-zinc-400 hover:text-blue-600'
                >
                  <Pencil className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  disabled={!!menu.isPending}
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
            <p className='text-sm font-bold mt-2 text-zinc-900'>
              Rp {menu.price.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
