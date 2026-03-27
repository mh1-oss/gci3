import { db } from "@/db";
import { products, categories as dbCategories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSubsidiaries } from "@/app/admin/actions";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.id, resolvedParams.id)
  });
  
  const allCategories = await db.select().from(dbCategories).orderBy(desc(dbCategories.createdAt));
  const allSubsidiaries = await getSubsidiaries();

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-arabic">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </Link>
        <h2 className="text-2xl font-bold text-brand-navy">تعديل المنتج: {product.title}</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ProductForm 
          product={product} 
          categories={allCategories} 
          subsidiaries={allSubsidiaries} 
        />
      </div>
    </div>
  );
}
