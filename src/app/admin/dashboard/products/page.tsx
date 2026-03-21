import { db } from "@/db";
import { products } from "@/db/schema";
import { Plus, Search, Edit } from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-brand-navy font-arabic">إدارة المنتجات</h2>
        <Link href="/admin/dashboard/products/new" className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-arabic w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" />
          <span>إضافة منتج</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy font-arabic text-right text-gray-900 placeholder:text-gray-400"
              dir="rtl"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full text-right font-arabic min-w-[800px]">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">صورة المنتج</th>
                <th className="px-6 py-4 font-medium text-right">اسم المنتج</th>
                <th className="px-6 py-4 font-medium text-right">القسم</th>
                <th className="px-6 py-4 font-medium text-right">السعر</th>
                <th className="px-6 py-4 font-medium text-right">المخزن</th>
                <th className="px-6 py-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.imageUrl || "/images/product.png"} alt={product.title} className="w-12 h-12 object-contain rounded-md" />
                  </td>
                  <td className="px-6 py-4 font-medium text-brand-navy">{product.title}</td>
                  <td className="px-6 py-4"><span className="bg-blue-50 text-brand-navy px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">{product.category}</span></td>
                  <td className="px-6 py-4 font-bold text-emerald-600">${product.price ? `${product.price}` : '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${Number(product.stock) <= 0 ? 'bg-red-100 text-red-600' : Number(product.stock) < 10 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Link href={`/admin/dashboard/products/${product.id}/edit`} className="p-1.5 text-gray-400 hover:text-brand-navy transition-colors" title="تعديل">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {allProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">لا توجد منتجات حالياً.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
