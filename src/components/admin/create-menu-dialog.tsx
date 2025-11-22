"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MenuForm from "./menu-form";

export default function CreateMenuDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black rounded-xl px-6 shadow-lg shadow-zinc-500/20 transition-all'>
          <Plus className='mr-2 h-4 w-4' /> Tambah Menu
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Tambah Menu Baru</DialogTitle>
          <DialogDescription>
            Isi detail menu di bawah ini. Klik simpan jika sudah selesai.
          </DialogDescription>
        </DialogHeader>

        {/* Panggil Form dengan prop onSuccess untuk menutup dialog */}
        <MenuForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
