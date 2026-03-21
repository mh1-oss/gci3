import { db } from "./src/db";
import { products, projects } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Updating demo data with real Unsplash images...");

  // Update Products
  const unsplashProducts = [
    "https://images.unsplash.com/photo-1562184552-997c461abbe6?q=80&w=800&auto=format&fit=crop", // Paint bucket
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop", // Wall texture
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop", // Construction tools
    "https://images.unsplash.com/photo-1621905252507-b3523c448f9c?q=80&w=800&auto=format&fit=crop", // Color palette
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop", // Industrial paint
  ];

  const allProducts = await db.select().from(products);
  for (let i = 0; i < allProducts.length; i++) {
    await db.update(products)
      .set({ imageUrl: unsplashProducts[i % unsplashProducts.length] })
      .where(eq(products.id, allProducts[i].id));
  }

  // Update Projects
  const unsplashProjects = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop", // Modern House
    "https://images.unsplash.com/photo-1600607687940-4e5246638648?q=80&w=800&auto=format&fit=crop", // Luxury Interior
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop", // Modern Villa
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop", // Skyscraper
  ];

  const allProjects = await db.select().from(projects);
  for (let i = 0; i < allProjects.length; i++) {
    await db.update(projects)
      .set({ imageUrl: unsplashProjects[i % unsplashProjects.length] })
      .where(eq(projects.id, allProjects[i].id));
  }

  console.log("Demo data updated successfully!");
}

main().catch(console.error);
