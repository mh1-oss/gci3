import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
    process.exit(1);
  }

  // Check if admin already exists
  const existingAdmin = await db.query.users.findFirst();
  if (existingAdmin) {
    console.log("Admin account already exists. Skipping seed.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Seeding admin user...");
  
  await db.insert(users).values({
    email,
    password: hashedPassword,
    role: "admin",
    name: "System Admin",
  });

  console.log("Admin user seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding admin:", err);
  process.exit(1);
});
