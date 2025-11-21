// src/app/(admin)/menu/create/page.tsx
import MenuForm from "@/components/admin/menu-form";

export default function CreateMenuPage() {
  return (
    <div className='p-6 min-h-screen bg-zinc-50/50'>
      <MenuForm isEditing={false} />
    </div>
  );
}
