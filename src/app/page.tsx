import HomeClient from "@/components/home/HomeClient";
import { getSubsidiaries } from "@/app/admin/actions";

export default async function Home() {
  const subsidiaries = await getSubsidiaries();
  
  return (
    <main>
      <HomeClient subsidiaries={subsidiaries} />
    </main>
  );
}
