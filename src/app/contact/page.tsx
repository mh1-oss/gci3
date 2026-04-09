import { getSettings } from "@/app/admin/actions";
import ContactClient from "@/components/contact/ContactClient";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  
  return <ContactClient settings={settings} />;
}
