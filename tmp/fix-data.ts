import { db } from "./src/db";
import { subsidiaries } from "./src/db/schema";
import { eq, like } from "drizzle-orm";

async function fix() {
  const all = await db.select().from(subsidiaries);
  console.log("Current subsidiaries:", JSON.stringify(all, null, 2));

  const np = all.find(s => s.name?.includes("National Paints") || s.name?.includes("ناشيونال"));
  if (np) {
    console.log("Found National Paints, updating logo to placeholder...");
    await db.update(subsidiaries)
      .set({ 
        logoUrl: null, 
        logoKey: null, 
        logoSource: "upload" 
      })
      .where(eq(subsidiaries.id, np.id));
    console.log("Updated!");
  } else {
    console.log("National Paints not found by name.");
  }
}

fix().catch(console.error);
