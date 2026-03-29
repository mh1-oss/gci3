"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/admin/actions";
import { Save, ImageIcon, Link as LinkIcon, Building2, Plus, Trash2, Palette, Ruler, X } from "lucide-react";
import Link from "next/link";
import ImagePreview from "./ImagePreview";

export default function ProductAddForm({ categories, subsidiaries }: { 
  categories: any[], 
  subsidiaries: any[] 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // New states for sizes and colors
  const [hasSizes, setHasSizes] = useState(false);
  const [sizes, setSizes] = useState<{ name: string; price: string; stock: string }[]>([]);
  const [hasColors, setHasColors] = useState(false);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);

  const [variantInventory, setVariantInventory] = useState<{ size: string; color: string; stock: string; price: string }[]>([]);
  const [unifyPrice, setUnifyPrice] = useState(true);

  const updateVariantMatrix = (currentSizes: any[], currentColors: any[]) => {
    if (currentSizes.length > 0 && currentColors.length > 0) {
      const newMatrix: any[] = [];
      currentSizes.forEach(s => {
        currentColors.forEach(c => {
          // Try to find existing
          const existing = variantInventory.find(v => v.size === s.name && v.color === c.name);
          newMatrix.push({
            size: s.name,
            color: c.name,
            stock: existing?.stock || "0",
            price: existing?.price || s.price || "",
          });
        });
      });
      setVariantInventory(newMatrix);
    } else {
      setVariantInventory([]);
    }
  };

  const addSize = () => {
    const newSizes = [...sizes, { name: "", price: "", stock: "0" }];
    setSizes(newSizes);
    updateVariantMatrix(newSizes, colors);
  };
  const removeSize = (index: number) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
    updateVariantMatrix(newSizes, colors);
  };
  const updateSize = (index: number, field: "name" | "price" | "stock", value: string) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
    
    if (unifyPrice && hasColors) {
      const sizeName = newSizes[index].name;
      setVariantInventory(prev => prev.map(v => 
        v.size === sizeName ? { ...v, price: field === "price" ? value : v.price } : v
      ));
    } else {
      updateVariantMatrix(newSizes, colors);
    }
  };

  const addColor = () => {
    const newColors = [...colors, { name: "", hex: "#000000" }];
    setColors(newColors);
    updateVariantMatrix(sizes, newColors);
  };
  const removeColor = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
    updateVariantMatrix(sizes, newColors);
  };
  const updateColor = (index: number, field: "name" | "hex", value: string) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
    updateVariantMatrix(sizes, newColors);
  };

  const updateVariant = (index: number, field: "stock" | "price", value: string) => {
    const newMatrix = [...variantInventory];
    const target = newMatrix[index];
    target[field] = value;

    if (unifyPrice && field === "price") {
      newMatrix.forEach(v => {
        if (v.size === target.size) v.price = value;
      });
      const sizeIndex = sizes.findIndex(s => s.name === target.size);
      if (sizeIndex !== -1) {
        const newSizes = [...sizes];
        newSizes[sizeIndex].price = value;
        setSizes(newSizes);
      }
    }
    
    setVariantInventory(newMatrix);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Add sizes and colors as JSON strings
    formData.append("hasSizes", hasSizes ? "on" : "off");
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("hasColors", hasColors ? "on" : "off");
    formData.append("colors", JSON.stringify(colors));
    formData.append("variantInventory", JSON.stringify(variantInventory));
    formData.append("unifyPrice", unifyPrice ? "on" : "off");

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
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 font-arabic" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-bold text-gray-700">اسم المنتج</label>
          <input type="text" id="title" name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900" placeholder="مثال: أكريليك مطفي" />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-bold text-gray-700">القسم</label>
          <select id="category" name="category" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
            {categories.length === 0 && (
              <option value="عام">يرجى إضافة أقسام أولاً</option>
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="subsidiaryId" className="block text-sm font-bold text-gray-700">الشركة المصنعة</label>
          <div className="relative">
            <select id="subsidiaryId" name="subsidiaryId" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 bg-white">
              <option value="">لا يوجد (منتج عام للمجموعة)</option>
              {subsidiaries.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-bold text-gray-700">السعر (بالدولار)</label>
          <input type="number" step="0.01" min="0" id="price" name="price" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 text-left" dir="ltr" placeholder="25.00" disabled={hasSizes} title={hasSizes ? "يتم اعتماد سعر الحجم الأول تلقائياً عند تفعيل خيار الأحجام" : ""} />
          {hasSizes && <p className="text-[10px] text-brand-red mt-1">سيتم استخدام سعر أصغر حجم تلقائياً كسعر رئيسي</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="stock" className="block text-sm font-bold text-gray-700">الكمية المتوفرة</label>
          {hasSizes ? (
            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed font-bold">
              {hasColors 
                ? variantInventory.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0) 
                : sizes.reduce((acc, s) => acc + (parseInt(s.stock) || 0), 0)}
              <input type="hidden" name="stock" value={hasColors 
                ? variantInventory.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0) 
                : sizes.reduce((acc, s) => acc + (parseInt(s.stock) || 0), 0)} />
            </div>
          ) : (
             <input type="number" step="1" min="0" id="stock" name="stock" defaultValue="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900" />
          )}
          {hasSizes && <p className="text-[10px] text-brand-red mt-1">يتم حساب الكمية الكلية تلقائياً من مصفوفة الخيارات.</p>}
        </div>
      </div>
        


      {/* ميزة الأحجام */}
      <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-navy font-bold">
            <Ruler className="w-5 h-5 text-brand-red" />
            <span>تفعيل الأحجام المتعددة</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={hasSizes} onChange={(e) => setHasSizes(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-20px] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
          </label>
        </div>

        {hasSizes && (
          <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2">
            {sizes.map((size, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input 
                  type="text" 
                  value={size.name} 
                  onChange={(e) => updateSize(index, "name", e.target.value)} 
                  placeholder="الحجم (مثلاً: 18 لتر)" 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red" 
                />
                {!hasColors && (
                  <>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      value={size.price} 
                      onChange={(e) => updateSize(index, "price", e.target.value)} 
                      placeholder="السعر $" 
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red text-left" 
                      dir="ltr" 
                    />
                    <input 
                      type="number" 
                      step="1"
                      min="0"
                      value={size.stock} 
                      onChange={(e) => updateSize(index, "stock", e.target.value)} 
                      placeholder="الكمية" 
                      className="w-20 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red" 
                    />
                  </>
                )}
                <button type="button" onClick={() => removeSize(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addSize} className="flex items-center gap-2 text-sm text-brand-navy hover:text-brand-red font-bold transition-colors">
              <Plus className="w-4 h-4" />
              <span>إضافة حجم جديد</span>
            </button>
          </div>
        )}
      </div>

      {/* ميزة الألوان */}
      <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-navy font-bold">
            <Palette className="w-5 h-5 text-brand-red" />
            <span>تفعيل الألوان المتاحة</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={hasColors} onChange={(e) => setHasColors(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-20px] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
          </label>
        </div>

        {hasColors && (
          <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2">
            {colors.map((color, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input type="text" value={color.name} onChange={(e) => updateColor(index, "name", e.target.value)} placeholder="اسم اللون (مثلاً: أبيض ملكي)" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red" />
                <div className="flex items-center gap-2 bg-white px-2 py-1 border border-gray-300 rounded-lg">
                  <input type="color" value={color.hex} onChange={(e) => updateColor(index, "hex", e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                  <input type="text" value={color.hex} onChange={(e) => updateColor(index, "hex", e.target.value)} className="w-20 text-xs font-mono outline-none border-none" />
                </div>
                <button type="button" onClick={() => removeColor(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addColor} className="flex items-center gap-2 text-sm text-brand-navy hover:text-brand-red font-bold transition-colors">
              <Plus className="w-4 h-4" />
              <span>إضافة لون جديد</span>
            </button>
          </div>
        )}
      </div>

      {/* ميزة الأحجام والألوان معاً (Matrix) */}
      {hasSizes && hasColors && (
        <div className="space-y-4 p-6 bg-brand-navy/5 rounded-2xl border border-brand-navy/10 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-2 border-b border-brand-navy/10 pb-4">
            <h3 className="font-bold text-brand-navy">تفاصيل الكميات والأسعار (حسب الحجم واللون)</h3>
            <p className="text-sm text-gray-500">أدخل الكمية والسعر لكل خيار. سيتم تحديث السعر الافتراضي للمنتج بناءً على خياراتك.</p>
          </div>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-800">توحيد السعر لكل الألوان في نفس الحجم</span>
              <span className="text-xs text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full">موصى به</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={unifyPrice} onChange={(e) => setUnifyPrice(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-20px] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-navy"></div>
            </label>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-bold border-b border-gray-200">الحجم</th>
                  <th className="px-4 py-3 font-bold border-b border-gray-200">اللون</th>
                  <th className="px-4 py-3 font-bold border-b border-gray-200">السعر ($)</th>
                  <th className="px-4 py-3 font-bold border-b border-gray-200">الكمية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {variantInventory.length > 0 ? (
                  variantInventory.map((variant, index) => {
                    const colorObj = colors.find(c => c.name === variant.color);
                    return (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-brand-navy">{variant.size || "بدون اسم"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {colorObj && (
                              <span className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: colorObj.hex }}></span>
                            )}
                            <span className="font-medium">{variant.color || "بدون اسم"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            value={variant.price} 
                            onChange={(e) => updateVariant(index, "price", e.target.value)} 
                            className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red text-left" 
                            dir="ltr" 
                            placeholder="0.00"
                            disabled={unifyPrice && index > 0 && variantInventory[index - 1].size === variant.size}
                            title={unifyPrice && index > 0 && variantInventory[index - 1].size === variant.size ? "السعر موحد لهذا الحجم. قم بتغيير الخيار الأول للحجم." : ""}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            step="1"
                            min="0"
                            value={variant.stock} 
                            onChange={(e) => updateVariant(index, "stock", e.target.value)} 
                            className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red" 
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      يرجى إضافة حجم ولون واحد على الأقل لتهيئة مصفوفة الخيارات.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* القسم الرابع: الوسائط والملفات */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <h3 className="text-lg font-bold text-brand-navy border-r-4 border-brand-red pr-3">الوسائط والملفات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ImagePreview 
            initialUrl="/images/product.png" 
            name="image" 
            label="صورة المنتج" 
            folder="products/images"
            helperText="أو ارفع صورة جديدة للمنتج"
          />

          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 text-right">ملف الكتالوج (PDF)</label>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase block text-right">رابط يدوي</span>
                <input 
                  type="text" 
                  name="pdfUrl" 
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 text-sm" 
                  dir="ltr"
                />
              </div>
              <div className="relative pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2 text-right">رفع ملف جديد</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    name="pdfFile" 
                    ref={pdfInputRef}
                    accept=".pdf" 
                    className="flex-1 text-xs text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-brand-navy shadow-sm border border-gray-200 rounded-xl cursor-pointer" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (pdfInputRef.current) pdfInputRef.current.value = "";
                      const urlInput = document.getElementsByName("pdfUrl")[0] as HTMLInputElement;
                      if (urlInput) urlInput.value = "";
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-6 border-t border-gray-100">
        <label htmlFor="description" className="block text-sm font-bold text-gray-700">الوصف</label>
        <textarea id="description" name="description" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none resize-y text-gray-900" placeholder="وصف تفصيلي للمنتج..." />
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
        <Link href="/admin/dashboard/products" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold">
          إلغاء
        </Link>
        <button type="submit" disabled={isPending} className="px-10 py-2 bg-brand-navy text-white rounded-lg hover:bg-blue-900 transition-colors font-bold shadow-md disabled:opacity-50 flex items-center gap-2">
          {isPending ? "جاري الحفظ..." : "حفظ المنتج"}
        </button>
      </div>
    </form>
  );
}
