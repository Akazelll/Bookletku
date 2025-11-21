"use client";

import { MenuItem } from "@/types/menu";
import MenuList from "./menu-list";
import { deleteMenu } from "@/services/menu-service";
import { useRouter } from "next/navigation";

export default function MenuListWrapper({
  initialMenus,
}: {
  initialMenus: MenuItem[];
}) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus menu ini?")) {
      try {
        await deleteMenu(id);
        router.refresh(); // Refresh data server
      } catch (error) {
        alert("Gagal menghapus menu");
      }
    }
  };

  return <MenuList menus={initialMenus} onDelete={handleDelete} />;
}
