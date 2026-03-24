import { getSettings } from "@/app/admin/actions";
import ContactClient from "@/components/contact/ContactClient";

export default async function ContactPage() {
  const settings = await getSettings();
  
  return <ContactClient settings={settings} />;
}
