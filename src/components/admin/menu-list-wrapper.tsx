"use client";

import { MenuItem } from "@/types/menu";
import MenuList from "./menu-list";
import { deleteMenu } from "@/services/menu-service";
import { useRouter } from "next/navigation";

interface MenuListWrapperProps {
  initialMenus: MenuItem[];
  viewMode?: "dashboard" | "management";
}

export default function MenuListWrapper({
  initialMenus,
  viewMode = "management",
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
    />
  );
}
