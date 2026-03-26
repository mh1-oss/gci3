import { db } from "@/db";
import { products, categories, siteSettings, subsidiaries } from "@/db/schema";
import ProductList from "@/components/products/ProductList";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string, subsidiary?: string }>;
}) {
  const { category, subsidiary } = await searchParams;
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
  const allCategories = await db.select().from(categories).orderBy(desc(categories.createdAt));
  const allSettings = await db.select().from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);
  const allSubsidiaries = await db.select().from(subsidiaries).orderBy(desc(subsidiaries.createdAt));

  const settings = allSettings[0] || { showPrice: "true", showStock: "true" };
  
  return (
    <ProductList 
      initialProducts={allProducts} 
      dbCategories={allCategories} 
      initialCategory={category} 
      initialSubsidiary={subsidiary}
      settings={settings}
      subsidiaries={allSubsidiaries}
    />
  );
}
