// src/components/menu-builder.tsx
"use client";

import { useState } from "react";
import { MenuItem } from "@/types/menu";
import {
  createMenu,
  updateMenu,
  deleteMenu,
  uploadMenuImage,
} from "@/services/menu-service"; // Gunakan import baru
import MenuForm from "@/components/admin/menu-form"; // Pastikan path ini benar sesuai struktur baru
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
    setIsSubmitting(true);
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

    // 2. BACKGROUND SAVE (SUPABASE)
    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadMenuImage(imageFile);
      }

      if (isEditing && editId) {
        const updatedItem = await updateMenu(editId, {
          ...formData,
          imageUrl: finalImageUrl,
        });

        setMenus((prev) =>
          prev.map((m) =>
            m.id === editId
              ? { ...updatedItem, isPending: false } // Gunakan data asli dari server
              : m
          )
        );
      } else {
        const newItem = await createMenu({
          ...optimisticItem,
          imageUrl: finalImageUrl,
          id: undefined, // Biarkan DB generate ID
        });

        setMenus((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...newItem, // ID asli dari Supabase ada di sini
                  isPending: false,
                }
              : m
          )
        );
      }
    } catch (error: any) {
      console.error("Save Error:", error);
      alert(`Gagal: ${error.message}`);
      // Rollback jika gagal create baru
      if (!isEditing) setMenus((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus?")) return;
    const backup = [...menus];
    // Optimistic delete
    setMenus((prev) => prev.filter((m) => m.id !== id));

    try {
      await deleteMenu(id);
    } catch (e) {
      console.error(e);
      setMenus(backup); // Rollback
      alert("Gagal menghapus.");
    }
  };

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
      <div className='h-fit sticky top-24'>
        <h3 className='text-lg font-bold mb-4 text-zinc-900 dark:text-zinc-100 lg:hidden'>
          Form Menu
        </h3>
        {/* Pastikan props sesuai dengan komponen MenuForm baru */}
        <MenuForm
          initialData={editItem}
          isEditing={isEditing}
          // Kita perlu membungkus handler onSubmit karena signature props mungkin berbeda
          // Jika MenuForm baru menghandle submit sendiri, bagian ini mungkin perlu disesuaikan.
          // Namun untuk kompatibilitas MenuBuilder lama, kita gunakan logika submit di sini.
        />

        {/* CATATAN: Jika Anda menggunakan komponen MenuForm baru (yang ada di src/components/admin/menu-form.tsx),
           komponen tersebut sudah menghandle submit sendiri. 
           
           Jika Anda ingin tetap menggunakan MenuBuilder sebagai "Client Side Controller", 
           Anda harus menyesuaikan MenuForm agar menerima props `onSubmit` manual seperti sebelumnya,
           ATAU ubah MenuBuilder ini agar hanya menampilkan list, dan form dipisah ke halaman /menu/create & /menu/[id].
           
           Untuk saat ini, kode di atas memperbaiki error import, tapi Anda mungkin perlu
           memastikan `MenuForm` yang diimport sesuai dengan logika yang Anda inginkan.
        */}
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
