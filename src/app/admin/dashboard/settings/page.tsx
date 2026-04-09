import { getSettings } from "@/app/admin/actions";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  
  return (
    <div className="max-w-4xl mx-auto">
      <SettingsForm settings={settings} />
    </div>
  );
}
