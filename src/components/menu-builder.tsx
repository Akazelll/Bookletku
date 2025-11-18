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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true); // Kunci tombol agar user tau sedang proses
    const tempId = `temp_${Date.now()}`;
    const tempImage = imageFile ? URL.createObjectURL(imageFile) : undefined;

    // 1. OPTIMISTIC UPDATE
    const optimisticItem: OptimisticMenuItem = {
      id: isEditing && editId ? editId : tempId,
      ...formData,
      isAvailable: true,
      createdAt: Date.now(),
      isPending: true,
      tempImage,
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

    // 2. BACKGROUND SAVE
    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) finalImageUrl = await MenuService.uploadImage(imageFile);

      if (isEditing && editId) {
        await MenuService.update(editId, {
          ...formData,
          imageUrl: finalImageUrl,
        });
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
      console.error("Save Error:", error);
      alert(`Gagal: ${error.message}`);
      if (!isEditing) setMenus((prev) => prev.filter((m) => m.id !== tempId)); // Rollback
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus?")) return;
    const backup = [...menus];
    setMenus((prev) => prev.filter((m) => m.id !== id));
    try {
      await MenuService.delete(id);
    } catch (e) {
      setMenus(backup);
      alert("Gagal menghapus.");
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
          isSubmitting={isSubmitting}
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
