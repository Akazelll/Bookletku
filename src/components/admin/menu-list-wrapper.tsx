"use client";

import { MenuItem } from "@/types/menu";
import MenuList from "./menu-list";
import { deleteMenu } from "@/services/menu-service";
import { useRouter } from "next/navigation";

interface MenuListWrapperProps {
  initialMenus: MenuItem[];
  viewMode?: "dashboard" | "management";
  currentPage?: number;
  totalPages?: number;
  limit?: number;
}

export default function MenuListWrapper({
  initialMenus,
  viewMode = "management",
  currentPage = 1,
  totalPages = 1,
  // [UBAH DI SINI] Default limit jadi 8
  limit = 8,
}: MenuListWrapperProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await deleteMenu(id);
      router.refresh();
    } catch (error) {
      alert("Gagal menghapus menu");
    }
  };

  return (
    <MenuList
      menus={initialMenus}
      onDelete={handleDelete}
      viewMode={viewMode}
      currentPage={currentPage}
      totalPages={totalPages}
      limit={limit}
    />
  );
}
