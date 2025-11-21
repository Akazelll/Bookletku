// src/app/(admin)/menu/[id]/page.tsx
import { getMenuById } from "@/services/menu-service";
import MenuForm from "@/components/admin/menu-form";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function EditMenuPage({ params }: PageProps) {
  // Fetch data spesifik menu berdasarkan ID
  const menu = await getMenuById(params.id);

  if (!menu) {
    return notFound(); // Tampilkan halaman 404 jika ID salah
  }

  return (
    <div className='p-6 min-h-screen bg-zinc-50/50'>
      <MenuForm initialData={menu} isEditing={true} />
    </div>
  );
}
