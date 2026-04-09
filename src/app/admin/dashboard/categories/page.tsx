import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { Plus, Search, Package } from "lucide-react";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import EditCategoryButton from "@/components/admin/EditCategoryButton";
import CategorySearch from "@/components/admin/CategorySearch";
import { createCategory } from "@/app/admin/actions";
import { desc, eq, sql, count, ilike, and } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const { search } = await searchParams;

  const conditions = [];
  if (search) {
    conditions.push(ilike(categories.name, `%${search}%`));
  }

  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(categories.name, products.category))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(categories.id, categories.name)
    .orderBy(desc(categories.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-navy font-arabic">إدارة المجاميع (الأقسام)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 font-arabic sticky top-6">
            <h3 className="text-lg font-bold text-brand-navy mb-4 border-b pb-2">إضافة قسم جديد</h3>
            <form action={createCategory} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-right">اسم القسم</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none text-gray-900 placeholder:text-gray-400" 
                  placeholder="مثال: أصباغ داخلية" 
                />
              </div>
              <button type="submit" className="w-full flex justify-center items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-bold shadow-sm">
                <Plus className="w-5 h-5" />
                <span>إضافة</span>
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            <CategorySearch defaultValue={search} />
            <div className="text-sm text-gray-400 font-arabic">
              إجمالي الأقسام: <span className="font-bold text-brand-navy">{allCategories.length}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-right font-arabic">
              <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">اسم القسم (اضغط لتعديل)</th>
                  <th className="px-6 py-4 font-medium text-center">المنتجات</th>
                  <th className="px-6 py-4 font-medium text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <EditCategoryButton id={category.id} initialName={category.name} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/admin/dashboard/products?category=${encodeURIComponent(category.name)}`}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${category.productCount > 0 ? 'bg-blue-50 text-brand-navy hover:bg-brand-navy hover:text-white' : 'bg-gray-50 text-gray-400'}`}
                        title="عرض المنتجات"
                      >
                        <Package className="w-3 h-3" />
                        <span>{category.productCount} منتج</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <DeleteCategoryButton id={category.id} />
                      </div>
                    </td>
                  </tr>
                ))}
                {allCategories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-10 text-center text-gray-500">
                      {search ? "لا توجد نتائج تطابق بحثك." : "لا توجد أقسام حالياً."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
