"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/admin/actions";
import { Save, ImageIcon, Link as LinkIcon, Building2 } from "lucide-react";
import Link from "next/link";

export default function ProductAddForm({ categories, subsidiaries }: { 
  categories: any[], 
  subsidiaries: any[] 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const result = await createProduct(formData);
        if (result?.success) {
          router.push("/admin/dashboard/products");
          router.refresh();
        } else if (result?.error) {
          alert(result.error);
        }
      } catch (err) {
        alert("فشل الحفظ. تأكد من إعدادات Cloudflare R2.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 text-right">اسم المنتج</label>
          <input type="text" id="title" name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none text-gray-900 placeholder:text-gray-400" placeholder="مثال: أكريليك مطفي" />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 text-right">القسم</label>
          <select id="category" name="category" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none text-gray-900" dir="rtl">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
            {categories.length === 0 && (
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
              {subsidiaries.map((sub) => (
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
        <button type="submit" disabled={isPending} className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-blue-900 transition-colors font-bold shadow-sm disabled:opacity-50">
          {isPending ? "جاري الحفظ..." : "حفظ المنتج"}
        </button>
      </div>
    </form>
  );
}
