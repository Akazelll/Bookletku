"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuItem, CATEGORIES } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  ImageOff,
  Utensils,
} from "lucide-react";

interface MenuListProps {
  menus: MenuItem[];
  onDelete: (id: string) => void;
}

export default function MenuList({ menus, onDelete }: MenuListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Logic Filter Client-Side (Cepat & Responsif)
  const filteredMenus = menus.filter((menu) => {
    const matchesSearch = menu.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || menu.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className='space-y-6'>
      {/* --- TOOLBAR (Search & Filter) --- */}
      <div className='flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm'>
        <div className='relative w-full sm:w-72'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500' />
          <Input
            placeholder='Cari menu...'
            className='pl-9 bg-zinc-50 dark:bg-zinc-800 border-none focus-visible:ring-1'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className='w-full sm:w-[180px] bg-zinc-50 dark:bg-zinc-800 border-none'>
            <div className='flex items-center gap-2'>
              <Utensils className='w-4 h-4 text-zinc-500' />
              <SelectValue placeholder='Pilih Kategori' />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Semua Kategori</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* --- LIST CONTENT --- */}
      {filteredMenus.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50'>
          <div className='bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-3'>
            <Search className='w-6 h-6 text-zinc-400' />
          </div>
          <h3 className='text-lg font-medium text-zinc-900 dark:text-zinc-100'>
            Menu tidak ditemukan
          </h3>
          <p className='text-sm text-zinc-500 mt-1'>
            Coba kata kunci lain atau ubah filter kategori.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredMenus.map((menu) => (
            <Card
              key={menu.id}
              className='group overflow-hidden border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-300'
            >
              {/* Image Header */}
              <div className='relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden'>
                {menu.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={menu.imageUrl}
                    alt={menu.name}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-zinc-300'>
                    <ImageOff className='w-8 h-8' />
                  </div>
                )}

                {/* Status Badge (Overlay) */}
                <div className='absolute top-3 left-3'>
                  <Badge
                    variant={menu.isAvailable ? "default" : "destructive"}
                    className={
                      menu.isAvailable ? "bg-green-600 hover:bg-green-700" : ""
                    }
                  >
                    {menu.isAvailable ? "Ready" : "Habis"}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <CardContent className='p-4'>
                <div className='flex justify-between items-start mb-2'>
                  <div>
                    <p className='text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider'>
                      {menu.category}
                    </p>
                    <h3 className='font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors'>
                      {menu.name}
                    </h3>
                  </div>
                </div>
                <p className='text-sm text-zinc-500 line-clamp-2 min-h-[40px]'>
                  {menu.description}
                </p>
              </CardContent>

              {/* Footer Actions */}
              <CardFooter className='p-4 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-4 bg-zinc-50/50 dark:bg-zinc-900/50'>
                <div className='font-bold text-zinc-900 dark:text-zinc-100'>
                  Rp {menu.price.toLocaleString("id-ID")}
                </div>

                {/* Action Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-zinc-500 hover:text-zinc-900'
                    >
                      <MoreHorizontal className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <Link href={`/admin/menu/${menu.id}`}>
                      <DropdownMenuItem className='cursor-pointer'>
                        <Pencil className='mr-2 w-4 h-4 text-blue-500' />
                        Edit Menu
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className='text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer'
                      onClick={() => menu.id && onDelete(menu.id)}
                    >
                      <Trash2 className='mr-2 w-4 h-4' />
                      Hapus Menu
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
