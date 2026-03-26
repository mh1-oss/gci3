import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminIndex() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (token === 'authenticated') {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/login");
  }
}
