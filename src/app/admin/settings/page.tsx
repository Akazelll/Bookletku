import SettingsForm from "@/components/admin/settings-form";

export default function SettingsPage() {
  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>
          Pengaturan
        </h1>
        <p className='text-zinc-500 dark:text-zinc-400 mt-1'>
          Kelola profil restoran dan tampilan menu digital Anda.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}
