import { db } from "@/db";
import { products, subsidiaries, categories } from "@/db/schema";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { desc, eq, and, or, ilike, sql, notInArray } from "drizzle-orm";
import ProductFilter from "@/components/admin/ProductFilter";
import ProductSearch from "@/components/admin/ProductSearch";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { category, search } = await searchParams;
  const masterCategories = await db.select().from(categories).orderBy(desc(categories.createdAt));
  const categoryList = masterCategories.map((c) => c.name);

  // Build filters
  const conditions = [];

  if (category) {
    if (category === "none") {
      // Products with empty category OR category not in master list
      if (categoryList.length > 0) {
        conditions.push(
          or(
            eq(products.category, ""),
            sql`${products.category} IS NULL`,
            notInArray(products.category, categoryList)
          )
        );
      } else {
        // If no master categories exist, only check for null/empty
        conditions.push(or(eq(products.category, ""), sql`${products.category} IS NULL`));
      }
    } else if (category !== "all") {
      conditions.push(eq(products.category, category));
    }
  }

  if (search) {
    conditions.push(
      or(
        ilike(products.title, `%${search}%`),
        ilike(products.description, `%${search}%`)
      )
    );
  }

  const query = db
    .select({
      id: products.id,
      title: products.title,
      category: products.category,
      price: products.price,
      stock: products.stock,
      imageUrl: products.imageUrl,
      subsidiaryName: subsidiaries.name,
    })
    .from(products)
    .leftJoin(subsidiaries, eq(products.subsidiaryId, subsidiaries.id));

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const allProducts = await query.orderBy(desc(products.createdAt));

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
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <ProductSearch defaultValue={search} />
            <ProductFilter categories={categoryList} />
          </div>
          <div className="text-sm text-gray-400 font-arabic">
            إجمالي المنتجات: <span className="font-bold text-brand-navy">{allProducts.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-gray-100">
          <table className="w-full text-right font-arabic min-w-[900px]">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">صورة المنتج</th>
                <th className="px-6 py-4 font-medium text-right">اسم المنتج</th>
                <th className="px-6 py-4 font-medium text-right">المجموعة</th>
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
                  <td className="px-6 py-4">
                    {product.subsidiaryName ? (
                      <span className="text-gray-600 font-bold text-sm bg-gray-100 px-3 py-1 rounded-lg">
                        {product.subsidiaryName}
                      </span>
                    ) : (
                      <span className="text-gray-300 italic text-xs">بدون مجموعة</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-brand-navy px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      {product.category || "غير مصنف"}
                    </span>
                  </td>
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
                  <td colSpan={7} className="py-10 text-center text-gray-500">لا توجد منتجات تطابق البحث.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
