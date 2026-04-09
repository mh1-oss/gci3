import HomeClient from "@/components/home/HomeClient";
import { getSubsidiaries } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const subsidiaries = await getSubsidiaries();
  
  return (
    <main>
      <HomeClient subsidiaries={subsidiaries} />
    </main>
  );
}
