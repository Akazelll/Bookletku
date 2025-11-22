"use client";

import { useState } from "react";
import { MenuItem, CATEGORIES } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Search, ImageOff, Utensils } from "lucide-react";
import UpdateMenuDialog from "./update-menu-dialog";

interface MenuListProps {
  menus: MenuItem[];
  onDelete: (id: string) => void;
  viewMode?: "dashboard" | "management";
}

export default function MenuList({
  menus,
  onDelete,
  viewMode = "management",
}: MenuListProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

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
      {/* Toolbar hanya muncul di mode management */}
      {viewMode === "management" && (
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
      )}

      {/* CONTENT */}
      {filteredMenus.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50'>
          <p className='text-sm text-zinc-500'>Belum ada menu yang sesuai.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredMenus.map((menu) => (
            <Card
              key={menu.id}
              className='group overflow-hidden border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all'
            >
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

              <CardContent className='p-4'>
                <div className='mb-2'>
                  <p className='text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider'>
                    {menu.category}
                  </p>
                  <h3 className='font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 text-lg'>
                    {menu.name}
                  </h3>
                </div>
                <p className='text-sm text-zinc-500 line-clamp-2 min-h-[40px]'>
                  {menu.description}
                </p>
              </CardContent>

              <CardFooter className='p-4 pt-0 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 mt-4 bg-zinc-50/50 dark:bg-zinc-900/50 h-16'>
                <div className='font-bold text-zinc-900 dark:text-zinc-100'>
                  Rp {menu.price.toLocaleString("id-ID")}
                </div>

                {viewMode === "management" && (
                  <div className='flex gap-2'>
                    {/* UPDATE BUTTON (Dialog) */}
                    <UpdateMenuDialog menu={menu} />

                    {/* DELETE BUTTON (Confirm Dialog) */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-8 w-8 hover:text-red-600 hover:bg-red-50 hover:border-red-200'
                        >
                          <Trash2 className='w-3.5 h-3.5' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Menu Ini?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Menu "{menu.name}" akan dihapus permanen. Tindakan
                            ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => menu.id && onDelete(menu.id)}
                            className='bg-red-600 hover:bg-red-700 text-white'
                          >
                            Ya, Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
