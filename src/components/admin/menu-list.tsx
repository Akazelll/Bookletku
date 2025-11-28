"use client";

import { useState, useEffect } from "react";
import { MenuItem, CATEGORIES } from "@/types/menu";
import { updateMenuOrder } from "@/services/menu-service";
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
import {
  Trash2,
  Search,
  ImageOff,
  Utensils,
  GripVertical,
  Save,
} from "lucide-react";
import UpdateMenuDialog from "./update-menu-dialog";

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface MenuListProps {
  menus: MenuItem[];
  onDelete: (id: string) => void;
  viewMode?: "dashboard" | "management";
}

// --- Komponen Kartu Menu yang Bisa Digeser ---
function SortableMenuCard({
  menu,
  onDelete,
  viewMode,
}: {
  menu: MenuItem;
  onDelete: (id: string) => void;
  viewMode: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className='relative group h-full'>
      <Card
        className={`h-full flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all ${
          isDragging
            ? "shadow-xl ring-2 ring-black dark:ring-white scale-105"
            : ""
        }`}
      >
        <div className='relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden'>
          {/* Handle Drag (Icon Grip) */}
          {viewMode === "management" && (
            <div
              {...attributes}
              {...listeners}
              className='absolute top-2 right-2 z-10 p-1.5 bg-white/80 dark:bg-black/80 backdrop-blur rounded-md cursor-grab active:cursor-grabbing hover:bg-white text-zinc-500 hover:text-black transition-colors shadow-sm'
            >
              <GripVertical className='w-4 h-4' />
            </div>
          )}

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

        <CardContent className='p-4 flex-1'>
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
              <UpdateMenuDialog menu={menu} />
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
                      Menu "{menu.name}" akan dihapus permanen.
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
    </div>
  );
}

// --- Komponen Utama MenuList ---
export default function MenuList({
  menus: initialMenus,
  onDelete,
  viewMode = "management",
}: MenuListProps) {
  const [menus, setMenus] = useState(initialMenus);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMenus(initialMenus);
  }, [initialMenus]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredMenus = menus.filter((menu) => {
    const matchesSearch = menu.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || menu.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Fitur Sortable hanya aktif jika tidak ada filter (menampilkan semua)
  const isSortable =
    viewMode === "management" && categoryFilter === "all" && search === "";

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMenus((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        setIsOrderChanged(true);
        return newOrder;
      });
    }
  };

  const saveOrder = async () => {
    setIsSaving(true);
    try {
      const orderPayload = menus.map((menu, index) => ({
        id: menu.id!,
        position: index,
      }));

      await updateMenuOrder(orderPayload);
      setIsOrderChanged(false);
    } catch (error) {
      console.error("Gagal menyimpan urutan:", error);
      alert("Gagal menyimpan urutan menu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Toolbar */}
      {viewMode === "management" && (
        <div className='flex flex-col gap-4'>
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

            <div className='flex gap-2 w-full sm:w-auto'>
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
          </div>

          {/* Alert / Info jika Sortable aktif & ada perubahan */}
          {isSortable && isOrderChanged && (
            <div className='flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-800 animate-in slide-in-from-top-2'>
              <p className='text-sm text-blue-700 dark:text-blue-300'>
                Urutan menu telah diubah. Simpan perubahan agar tampil di menu
                pelanggan.
              </p>
              <Button
                size='sm'
                onClick={saveOrder}
                disabled={isSaving}
                className='bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm'
              >
                {isSaving ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save className='w-4 h-4 mr-2' /> Simpan Urutan
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Hint jika filter aktif */}
          {!isSortable && viewMode === "management" && (
            <p className='text-xs text-zinc-400 px-2 italic'>
              *Fitur geser urutan (drag-and-drop) hanya aktif saat menampilkan
              "Semua Kategori" tanpa pencarian.
            </p>
          )}
        </div>
      )}

      {/* CONTENT GRID */}
      {filteredMenus.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50'>
          <p className='text-sm text-zinc-500'>Belum ada menu yang sesuai.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredMenus.map((m) => m.id!)}
            strategy={rectSortingStrategy}
            disabled={!isSortable}
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredMenus.map((menu) => (
                <SortableMenuCard
                  key={menu.id}
                  menu={menu}
                  onDelete={onDelete}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
