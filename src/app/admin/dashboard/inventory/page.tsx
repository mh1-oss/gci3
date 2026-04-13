export const dynamic = "force-dynamic";

import { db } from "@/db";
import { products } from "@/db/schema";
import { Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Edit2 } from "lucide-react";
import { desc } from "drizzle-orm";
import { updateStock } from "@/app/admin/actions";
import InventoryList from "@/components/admin/InventoryList";

export default async function InventoryPage() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

  const totalItems = allProducts.length;
  const lowStockItems = allProducts.filter(p => Number(p.stock) > 0 && Number(p.stock) < 10).length;
  const outOfStockItems = allProducts.filter(p => Number(p.stock) <= 0).length;

  return (
    <div className="space-y-8 font-arabic">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-brand-navy">إدارة المخزن</h2>
          <p className="text-gray-500 mt-1">تتبع كميات المنتجات المتوفرة وتحديث المخزون</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500">إجمالي المواد</div>
            <div className="text-2xl font-bold text-brand-navy">{totalItems}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500">مواد أوشكت على النفاد</div>
            <div className="text-2xl font-bold text-brand-navy">{lowStockItems}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-brand-red">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500">مواد نفدت كميتها</div>
            <div className="text-2xl font-bold text-brand-navy">{outOfStockItems}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <InventoryList initialProducts={allProducts} />
      </div>
    </div>
  );
}
