export const dynamic = "force-dynamic";

import { getSubsidiaries } from "@/app/admin/actions";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { desc } from "drizzle-orm";
import ProductAddForm from "@/components/admin/ProductAddForm";

export default async function NewProductPage() {
  const allCategories = await db.select().from(categories).orderBy(desc(categories.createdAt));
  const allSubsidiaries = await getSubsidiaries();

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-arabic">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </Link>
        <h2 className="text-2xl font-bold text-brand-navy">إضافة منتج جديد</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ProductAddForm categories={allCategories} subsidiaries={allSubsidiaries} />
      </div>
    </div>
  );
}
