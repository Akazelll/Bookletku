// src/app/admin/menu/create/page.tsx
import MenuForm from "@/components/admin/menu-form"; // Import dari path baru

export default function CreateMenuPage() {
  return (
    <div className='p-6 min-h-screen bg-zinc-50/50 flex justify-center'>
      <div className='w-full max-w-2xl mt-8'>
        <MenuForm isEditing={false} />
      </div>
    </div>
  );
}
