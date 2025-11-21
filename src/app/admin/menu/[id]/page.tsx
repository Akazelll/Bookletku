import { getMenuById } from "@/services/menu-service"; // Kembali ke service
import MenuForm from "@/components/admin/menu-form";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMenuPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch dari Mock Service
  const menu = await getMenuById(id);

  if (!menu) {
    return notFound();
  }

  return (
    <div className='max-w-3xl mx-auto mt-6'>
      {/* Breadcrumb simple */}
      <div className='mb-6 text-sm text-zinc-500'>
        Admin / Menu / <span className='text-zinc-900 font-medium'>Edit</span>
      </div>
      <MenuForm initialData={menu} isEditing={true} />
    </div>
  );
}
