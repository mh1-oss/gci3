"use client";

import { useState } from "react";
import { Edit2, Package, Check, X } from "lucide-react";
import { updateStock } from "@/app/admin/actions";

export default function InventoryList({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleUpdate = async (id: string) => {
    const res = await updateStock(id, editValue);
    if (res.success) {
      setProducts(products.map(p => p.id === id ? { ...p, stock: editValue } : p));
      setEditingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right min-w-[700px] lg:min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-6 py-4 font-bold text-brand-navy">المنتج</th>
            <th className="px-6 py-4 font-bold text-brand-navy">التصنيف</th>
            <th className="px-6 py-4 font-bold text-brand-navy">الكمية المتوفرة</th>
            <th className="px-6 py-4 font-bold text-brand-navy">الحالة</th>
            <th className="px-6 py-4 font-bold text-brand-navy">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                    <img src={product.imageUrl || "/images/product.png"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-brand-navy">{product.title}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  {product.category || "عام"}
                </span>
              </td>
              <td className="px-6 py-4">
                {product.hasSizes === "true" ? (
                  <div className="text-sm">
                    <span className="font-bold text-lg block mb-2">{product.stock} <span className="text-xs text-gray-500 font-normal">(المجموع)</span></span>
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {product.hasColors === "true" && product.variantInventory ? (
                        product.variantInventory.map((v: any, i: number) => (
                           <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-100 text-[10px] text-gray-600 rounded whitespace-nowrap">
                             <span className="text-gray-400">{v.size} {v.color && `- ${v.color}`}:</span> <b className="text-brand-navy text-xs">{v.stock}</b>
                           </span>
                        ))
                      ) : product.sizes ? (
                        product.sizes.map((s: any, i: number) => (
                           <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-100 text-[10px] text-gray-600 rounded whitespace-nowrap">
                             <span className="text-gray-400">{s.name}:</span> <b className="text-brand-navy text-xs">{s.stock}</b>
                           </span>
                        ))
                      ) : null}
                    </div>
                  </div>
                ) : editingId === product.id ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      step="1"
                      min="0"
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-20 px-2 py-1 border border-brand-red rounded outline-none text-gray-900"
                      autoFocus
                    />
                  </div>
                ) : (
                  <span className="font-bold text-lg">{product.stock}</span>
                )}
              </td>
              <td className="px-6 py-4">
                {Number(product.stock) <= 0 ? (
                  <span className="text-brand-red font-bold flex items-center gap-1">
                    <X className="w-4 h-4" />
                    نفدت الكمية
                  </span>
                ) : Number(product.stock) < 10 ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    كمية قليلة
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    متوفر
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {product.hasSizes === "true" ? (
                  <a href={`/admin/dashboard/products/${product.id}/edit`} className="flex items-center gap-2 text-brand-navy hover:text-brand-red transition font-medium text-sm">
                    <Edit2 className="w-4 h-4" />
                    <span>تعديل التفاصيل</span>
                  </a>
                ) : editingId === product.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleUpdate(product.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setEditingId(product.id);
                      setEditValue(product.stock.toString());
                    }}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>تعديل الكمية</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
