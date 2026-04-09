import { db } from "./src/db";
import { subsidiaries } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Restoring GCI brand data...");

  const gciDescription = "GCI Paints – دهانات أردنية عالية الجودة. طلاء GCI Paints يمنح جدرانك مظهراً أنيقاً، متيناً وثبات لون ممتز، مناسب للاستخدام المنزلي والصناعي.";
  const gciSlogan = "جودة عالمية بأيدي عراقية";

  await db.update(subsidiaries)
    .set({ 
        description: gciDescription,
        slogan: gciSlogan
    })
    .where(eq(subsidiaries.name, "GCI"));

  console.log("GCI data restored successfully!");
}

main().catch(console.error);
