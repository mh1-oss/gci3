import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

async function check() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is missing");
    process.exit(1);
  }
  const sql = neon(url);
  const db = drizzle(sql);
  
  // Directly query the table to avoid schema issues in script
  const result = await sql`SELECT name, "logoUrl", "logoKey" FROM subsidiaries`;
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

check();
