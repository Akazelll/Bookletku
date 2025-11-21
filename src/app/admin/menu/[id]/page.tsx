// src/app/admin/menu/[id]/page.tsx
import { getMenuById } from "@/services/menu-service";
import MenuForm from "@/components/admin/menu-form"; // Import dari path baru
import { notFound } from "next/navigation";

export default async function EditMenuPage({
  params,
}: {
  params: { id: string };
}) {
  const menu = await getMenuById(params.id);

  if (!menu) return notFound();

  return (
    <div className='p-6 min-h-screen bg-zinc-50/50 flex justify-center'>
      <div className='w-full max-w-2xl mt-8'>
        <MenuForm initialData={menu} isEditing={true} />
      </div>
    </div>
  );
}
