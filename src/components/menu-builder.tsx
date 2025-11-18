// src/components/menu-builder.tsx
"use client";

import { useState } from "react";
import { MenuItem } from "@/types/menu";
import { MenuService } from "@/services/menu-service";
import MenuForm from "./menu-form";
import MenuList, { OptimisticMenuItem } from "./menu-list";

export default function MenuBuilder({
  initialMenus = [],
}: {
  initialMenus?: MenuItem[];
}) {
  const [menus, setMenus] = useState<OptimisticMenuItem[]>(initialMenus);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<MenuItem | undefined>(undefined);

  const handleEditMode = (menu: MenuItem) => {
    setIsEditing(true);
    setEditId(menu.id!);
    setEditItem(menu);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setEditItem(undefined);
  };

  const handleSave = async (formData: any, imageFile: File | null) => {
    const tempId = `temp_${Date.now()}`;
    const tempImage = imageFile ? URL.createObjectURL(imageFile) : undefined;

    // 1. OPTIMISTIC UPDATE (Update UI duluan)
    const optimisticItem: OptimisticMenuItem = {
      id: isEditing && editId ? editId : tempId,
      ...formData,
      isAvailable: true,
      createdAt: Date.now(),
      isPending: true,
      tempImage: tempImage,
      imageUrl: formData.imageUrl, // Pertahankan URL lama jika ada
    };

    if (isEditing && editId) {
      setMenus((prev) =>
        prev.map((m) =>
          m.id === editId ? { ...optimisticItem, imageUrl: m.imageUrl } : m
        )
      );
      handleCancelEdit();
    } else {
      setMenus((prev) => [optimisticItem, ...prev]);
    }

    // 2. BACKGROUND PROCESS
    try {
      let finalImageUrl = formData.imageUrl;

      // Hanya upload jika ada file baru
      if (imageFile) {
        finalImageUrl = await MenuService.uploadImage(imageFile);
      }

      if (isEditing && editId) {
        await MenuService.update(editId, {
          ...formData,
          imageUrl: finalImageUrl,
        });
        // Sukses update -> Hilangkan status pending & update URL baru
        setMenus((prev) =>
          prev.map((m) =>
            m.id === editId
              ? { ...m, imageUrl: finalImageUrl, isPending: false }
              : m
          )
        );
      } else {
        const docRef = await MenuService.add({
          ...optimisticItem,
          imageUrl: finalImageUrl,
          id: undefined,
        });
        // Sukses create -> Ganti ID temp dengan ID asli & URL baru
        setMenus((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...m,
                  id: docRef.id,
                  imageUrl: finalImageUrl,
                  isPending: false,
                }
              : m
          )
        );
      }
    } catch (error: any) {
      console.error("Background Save Error:", error);
      alert(`Gagal menyimpan: ${error.message}`);

      // ROLLBACK (Batalkan perubahan di UI jika gagal)
      if (!isEditing) {
        setMenus((prev) => prev.filter((m) => m.id !== tempId));
      } else if (editId) {
        // Jika edit gagal, mungkin kita mau me-reload atau biarkan user coba lagi (di sini biarkan saja pending false agar tombol aktif lagi)
        setMenus((prev) =>
          prev.map((m) => (m.id === editId ? { ...m, isPending: false } : m))
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus menu ini?")) return;
    const backupMenus = [...menus];
    setMenus((prev) => prev.filter((m) => m.id !== id)); // Optimistic Delete

    try {
      await MenuService.delete(id);
    } catch (error: any) {
      console.error(error);
      setMenus(backupMenus); // Rollback
      alert(`Gagal menghapus: ${error.message}`);
    }
  };

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
      <div className='h-fit sticky top-24'>
        <h3 className='text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100 lg:hidden'>
          Form Menu
        </h3>
        <MenuForm
          initialData={editItem}
          isEditing={isEditing}
          onSubmit={handleSave}
          onCancel={handleCancelEdit}
        />
      </div>
      <div>
        <h3 className='text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100'>
          Daftar Menu ({menus.length})
        </h3>
        <MenuList
          menus={menus}
          onEdit={handleEditMode}
          onDelete={handleDelete}
          editId={editId}
        />
      </div>
    </div>
  );
}
