import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "./src/db";
import { subsidiaries } from "./src/db/schema";

async function checkSubsidiaries() {
  const allSub = await db.select().from(subsidiaries);
  console.log(JSON.stringify(allSub, null, 2));
  process.exit(0);
}

checkSubsidiaries();
