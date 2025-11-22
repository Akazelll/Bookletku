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
import { Pencil } from "lucide-react";
import MenuForm from "./menu-form";
import { MenuItem } from "@/types/menu";

interface UpdateMenuDialogProps {
  menu: MenuItem;
}

export default function UpdateMenuDialog({ menu }: UpdateMenuDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8 hover:text-blue-600 hover:border-blue-200'
        >
          <Pencil className='w-3.5 h-3.5' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>Ubah detail menu di bawah ini.</DialogDescription>
        </DialogHeader>

        <MenuForm
          initialData={menu}
          isEditing={true}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
