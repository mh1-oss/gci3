import { db } from "@/db";
import { products, categories as dbCategories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { updateProduct } from "@/app/admin/actions";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.id, resolvedParams.id)
  });
  
  const allCategories = await db.select().from(dbCategories).orderBy(desc(dbCategories.createdAt));

  if (!product) {
    notFound();
  }

  // Bind the id to the server action
  const updateWithId = updateProduct.bind(null, product.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-arabic">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </Link>
        <h2 className="text-2xl font-bold text-brand-navy">تعديل المنتج: {product.title}</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form action={updateWithId} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 text-right">اسم المنتج</label>
              <input type="text" id="title" name="title" defaultValue={product.title} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none" />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 text-right">القسم</label>
              <select id="category" name="category" defaultValue={product.category || ""} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none" dir="rtl">
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
                {allCategories.length === 0 && (
                  <option value={product.category || "عام"}>{product.category || "عام"}</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 text-right">السعر (بالدولار)</label>
              <input type="text" id="price" name="price" defaultValue={product.price || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none" />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 text-right">الكمية المتوفرة (المخزن)</label>
              <input type="number" id="stock" name="stock" defaultValue={product.stock || "0"} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 text-right">رابط الصورة</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" id="imageUrl" name="imageUrl" defaultValue={product.imageUrl || "/images/product.png"} className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-left outline-none" dir="ltr" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="pdfUrl" className="block text-sm font-medium text-gray-700 text-right">رابط ملف الكتالوج (PDF)</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" id="pdfUrl" name="pdfUrl" defaultValue={product.pdfUrl || ""} placeholder="/public/dummy-spec.pdf" className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-left outline-none" dir="ltr" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 text-right">الوصف</label>
            <textarea id="description" name="description" rows={4} defaultValue={product.description || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-right outline-none resize-y" />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <Link href="/admin/dashboard/products" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              إلغاء
            </Link>
            <button type="submit" className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-blue-900 transition-colors font-bold shadow-sm">
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
