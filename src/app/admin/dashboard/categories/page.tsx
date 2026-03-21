import { db } from "@/db";
import { categories } from "@/db/schema";
import { Plus } from "lucide-react";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import { createCategory } from "@/app/admin/actions";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const allCategories = await db.select().from(categories).orderBy(desc(categories.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-navy font-arabic">إدارة المجاميع (الأقسام)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 font-arabic">
            <h3 className="text-lg font-bold text-brand-navy mb-4 border-b pb-2">إضافة قسم جديد</h3>
            <form action={createCategory} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-right">اسم القسم</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none" 
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
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-right font-arabic">
              <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium w-2/3">اسم القسم</th>
                  <th className="px-6 py-4 font-medium text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-navy">{category.name}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <DeleteCategoryButton id={category.id} />
                      </div>
                    </td>
                  </tr>
                ))}
                {allCategories.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-10 text-center text-gray-500">لا توجد أقسام حالياً.</td>
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
