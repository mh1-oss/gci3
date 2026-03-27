import { createProduct, getSubsidiaries } from "@/app/admin/actions";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Link as LinkIcon, Building2 } from "lucide-react";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { desc } from "drizzle-orm";

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
        <form action={createProduct} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 text-right">اسم المنتج</label>
              <input type="text" id="title" name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none text-gray-900 placeholder:text-gray-400" placeholder="مثال: أكريليك مطفي" />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 text-right">القسم</label>
              <select id="category" name="category" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none text-gray-900" dir="rtl">
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
                {allCategories.length === 0 && (
                  <option value="عام">يرجى إضافة أقسام أولاً</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subsidiaryId" className="block text-sm font-medium text-gray-700 text-right">الشركة المصنعة / التابعة</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <select id="subsidiaryId" name="subsidiaryId" className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none text-gray-900 appearance-none bg-white" dir="rtl">
                  <option value="">لا يوجد (منتج عام للمجموعة)</option>
                  {allSubsidiaries.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 text-right">السعر (بالدولار)</label>
              <input type="text" id="price" name="price" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none text-gray-900 placeholder:text-gray-400" placeholder="25.00" />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 text-right">الكمية المتوفرة (المخزن)</label>
              <input type="number" id="stock" name="stock" defaultValue="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none text-gray-900" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 text-right">صورة المنتج</label>
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" id="imageUrl" name="imageUrl" defaultValue="/images/product.png" className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-left outline-none text-gray-900 placeholder:text-gray-400 text-sm" placeholder="أدخل رابطاً يدوياً..." dir="ltr" />
                </div>
                <div className="relative">
                  <input type="file" id="imageFile" name="imageFile" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all cursor-pointer" />
                  <p className="text-[10px] text-gray-400 mt-1 mr-1">أو ارفع ملفاً مباشرة (الأحدث دائماً هو الذي يتم اعتماده)</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700 text-right">ملف الكتالوج (PDF)</label>
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="text" id="pdfUrl" name="pdfUrl" className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-left outline-none text-gray-900 placeholder:text-gray-400 text-sm" placeholder="أدخل رابطاً يدوياً..." dir="ltr" />
                </div>
                <div className="relative">
                  <input type="file" id="pdfFile" name="pdfFile" accept=".pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all cursor-pointer" />
                  <p className="text-[10px] text-gray-400 mt-1 mr-1">أو ارفع كتالوج PDF (سيحل محل الرابط اليدوي)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 text-right">الوصف</label>
            <textarea id="description" name="description" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none resize-y text-gray-900 placeholder:text-gray-400" placeholder="وصف تفصيلي للمنتج..." />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <Link href="/admin/dashboard/products" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              إلغاء
            </Link>
            <button type="submit" className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-blue-900 transition-colors font-bold shadow-sm">
              حفظ المنتج
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
