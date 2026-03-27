"use client";

import { useTransition } from "react";
import { updateProduct } from "@/app/admin/actions";
import { Save, ArrowRight } from "lucide-react";
import Link from "next/link";
import ImagePreview from "./ImagePreview";

export default function ProductForm({ product, categories, subsidiaries }: { 
  product: any, 
  categories: any[], 
  subsidiaries: any[] 
}) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateProduct(product.id, formData);
      } catch (err) {
        alert("فشل الحفظ. تأكد من إعدادات Cloudflare R2.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10 font-arabic" dir="rtl">
      {/* القسم الأول: المعلومات الأساسية */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-r-4 border-brand-red pr-3">المعلومات الأساسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 text-right">اسم المنتج</label>
            <input 
              type="text" 
              name="title" 
              id="title"
              defaultValue={product.title} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 bg-gray-50/50 text-right" 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-bold text-gray-700 text-right">القسم</label>
            <select 
              name="category" 
              id="category"
              defaultValue={product.category || ""} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 bg-white"
              dir="rtl"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="subsidiaryId" className="block text-sm font-bold text-gray-700 text-right">الشركة المصنعة</label>
            <select 
              name="subsidiaryId" 
              id="subsidiaryId"
              defaultValue={product.subsidiaryId || ""} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 bg-white"
              dir="rtl"
            >
              <option value="">لا يوجد (منتج عام للمجموعة)</option>
              {subsidiaries.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-bold text-gray-700 text-right">السعر (بالدولار)</label>
            <input 
              type="text" 
              name="price" 
              id="price"
              defaultValue={product.price || ""} 
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 text-left" 
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="stock" className="block text-sm font-bold text-gray-700 text-right">الكمية المتوفرة</label>
            <input 
              type="number" 
              name="stock" 
              id="stock"
              defaultValue={product.stock || "0"} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 text-right" 
            />
          </div>
        </div>
      </div>

      {/* القسم الثاني: الوسائط والملفات */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-bold text-brand-navy border-r-4 border-brand-red pr-3">الوسائط والملفات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ImagePreview 
            initialUrl={product.imageUrl} 
            name="image" 
            label="صورة المنتج" 
            folder="products/images"
            helperText="أو ارفع صورة جديدة (سيتم اعتماد الأحدث)"
          />

          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 text-right">ملف الكتالوج (PDF)</label>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase block text-right">رابط يدوي</span>
                <input 
                  type="text" 
                  name="pdfUrl" 
                  defaultValue={product.pdfUrl || ""} 
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 text-sm" 
                  dir="ltr"
                />
              </div>
              <div className="relative pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2 text-right">رفع ملف جديد</span>
                <input 
                  type="file" 
                  name="pdfFile" 
                  accept=".pdf" 
                  className="w-full text-xs text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-brand-navy shadow-sm border border-gray-200 rounded-xl cursor-pointer" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* القسم الثالث: الوصف الإضافي */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <label htmlFor="description" className="block text-sm font-bold text-gray-700 text-right">وصف المنتج الكامل</label>
        <textarea 
          name="description" 
          id="description"
          rows={5} 
          defaultValue={product.description || ""} 
          placeholder="اكتب مواصفات المنتج وتفاصيله هنا..."
          className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-brand-red outline-none resize-y text-gray-900 bg-gray-50/30 text-right" 
        />
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
        <Link href="/admin/dashboard/products" className="px-8 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-bold">
          إلغاء
        </Link>
        <button 
          type="submit" 
          disabled={isPending}
          className="px-10 py-3 bg-brand-navy text-white rounded-xl hover:bg-blue-900 transition-all font-black shadow-lg shadow-brand-navy/10 disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isPending ? "جاري الحفظ..." : "حفظ التعديلات النهائية"}
        </button>
      </div>
    </form>
  );
}
