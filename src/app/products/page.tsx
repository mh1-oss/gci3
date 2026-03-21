import { db } from "@/db";
import { products, categories } from "@/db/schema";
import ProductList from "@/components/products/ProductList";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
  const allCategories = await db.select().from(categories).orderBy(desc(categories.createdAt));
  
  return (
    <ProductList 
      initialProducts={allProducts} 
      dbCategories={allCategories} 
      initialCategory={category} 
    />
  );
}
