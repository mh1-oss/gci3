"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/app/admin/actions";
import { Save, ArrowRight, Plus, Trash2, Palette, Ruler, X } from "lucide-react";
import Link from "next/link";
import ImagePreview from "./ImagePreview";

export default function ProductForm({ product, categories, subsidiaries }: { 
  product: any, 
  categories: any[], 
  subsidiaries: any[] 
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [hasSizes, setHasSizes] = useState(product.hasSizes === "true");
  const [sizes, setSizes] = useState<{ name: string; price: string; stock: string }[]>(product.sizes || []);
  const [hasColors, setHasColors] = useState(product.hasColors === "true");
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(product.colors || []);
  
  const [variantInventory, setVariantInventory] = useState<{ size: string; color: string; stock: string; price: string }[]>(product.variantInventory || []);
  const [unifyPrice, setUnifyPrice] = useState(product.unifyPrice !== "off");

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
    const oldName = sizes[index].name;
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
    
    if (field === "name") {
      setVariantInventory(prev => prev.map(v => 
        v.size === oldName ? { ...v, size: value } : v
      ));
    } else if (unifyPrice && hasColors) {
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
    const oldName = colors[index].name;
    let newValue = value;
    
    if (field === "hex" && value && !value.startsWith("#") && /^[0-9A-Fa-f]{3,6}$/.test(value)) {
      newValue = "#" + value;
    }

    const newColors = [...colors];
    newColors[index][field] = newValue;
    setColors(newColors);

    if (field === "name" && oldName) {
      setVariantInventory(prev => prev.map(v => 
        v.color === oldName ? { ...v, color: value } : v
      ));
    } else {
      updateVariantMatrix(sizes, newColors);
    }
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
        const result = await updateProduct(product.id, formData);
        if (result?.error) {
          alert(result.error);
        } else {
          router.push("/admin/dashboard/products");
          router.refresh();
        }
      } catch (err: any) {
        const isRedirect =
          err &&
          typeof err === "object" &&
          "digest" in err &&
          typeof err.digest === "string" &&
          err.digest.startsWith("NEXT_REDIRECT");
        
        if (isRedirect) {
          throw err;
        }
        
        console.error("Form Submit Error:", err);
        alert(err.message || "فشل الحفظ. تأكد من حجم الملفات (الحد الأقصى 1 ميغابايت) أو اتصال الإنترنت.");
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
            <label htmlFor="title" className="block text-sm font-bold text-gray-700">اسم المنتج</label>
            <input 
              type="text" 
              name="title" 
              id="title"
              defaultValue={product.title} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 placeholder:text-gray-700/80 placeholder:font-medium font-bold bg-gray-50/50" 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-bold text-gray-700">القسم</label>
            <select 
              name="category" 
              id="category"
              defaultValue={product.category || ""} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 placeholder:text-gray-700/80 placeholder:font-medium font-bold bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="subsidiaryId" className="block text-sm font-bold text-gray-700">الشركة المصنعة</label>
            <select 
              name="subsidiaryId" 
              id="subsidiaryId"
              defaultValue={product.subsidiaryId || ""} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 placeholder:text-gray-700/80 placeholder:font-medium font-bold bg-white"
            >
              <option value="">لا يوجد (منتج عام للمجموعة)</option>
              {subsidiaries.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-bold text-gray-700">السعر (بالدولار)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              name="price" 
              id="price"
              defaultValue={product.price || ""} 
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 placeholder:text-gray-700/80 placeholder:font-medium font-bold text-left" 
              dir="ltr"
              disabled={hasSizes}
              title={hasSizes ? "يتم اعتماد سعر الحجم الأول تلقائياً عند تفعيل خيار الأحجام" : ""}
            />
            {hasSizes && <p className="text-[10px] text-brand-red mt-1">يتم عرض سعر أول حجم تلقائياً كسعر رئيسي</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="stock" className="block text-sm font-bold text-gray-700">الكمية المتوفرة</label>
            {hasSizes ? (
              <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed font-bold">
                {hasColors 
                  ? variantInventory.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0) 
                  : sizes.reduce((acc, s) => acc + (parseInt(s.stock) || 0), 0)}
                <input id="stock" type="hidden" name="stock" value={hasColors 
                  ? variantInventory.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0) 
                  : sizes.reduce((acc, s) => acc + (parseInt(s.stock) || 0), 0)} />
              </div>
            ) : (
              <input 
                type="number" 
                step="1"
                min="0"
                name="stock" 
                id="stock"
                defaultValue={product.stock || "0"} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 placeholder:text-gray-700/80 placeholder:font-medium font-bold" 
              />
            )}
            {hasSizes && <p className="text-[10px] text-brand-red mt-1">يتم حساب الكمية الكلية تلقائياً من خيارات المنتج.</p>}
          </div>
        </div>
      </div>

      {/* ميزة الأحجام */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="hasSizesEdit" className="text-lg font-bold text-brand-navy border-r-4 border-brand-red pr-3 cursor-pointer">إعدادات الأحجام</label>
          <label className="relative inline-flex items-center cursor-pointer gap-3">
            <span className="text-sm font-bold text-gray-700">تفعيل الأحجام المتعددة</span>
            <div className="relative">
              <input id="hasSizesEdit" type="checkbox" checked={hasSizes} onChange={(e) => setHasSizes(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-20px] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
            </div>
          </label>
        </div>

        {hasSizes && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            {sizes.map((size, index) => (
              <div key={index} className="flex flex-col gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-gray-100/50">
                <div className="flex-1 space-y-1">
                  <label htmlFor={`edit-size-name-${index}`} className="text-[11px] font-black text-gray-500 block pr-1 uppercase transition-colors cursor-pointer">اسم الحجم</label>
                  <input 
                    type="text" 
                    id={`edit-size-name-${index}`}
                    value={size.name} 
                    onChange={(e) => updateSize(index, "name", e.target.value)} 
                    placeholder="مثال: 5 لتر" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red placeholder:text-gray-400 placeholder:font-medium text-gray-900 font-bold" 
                  />
                </div>
                {!hasColors && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor={`edit-size-price-${index}`} className="text-[11px] font-black text-gray-500 block pr-1 uppercase transition-colors cursor-pointer">السعر ($)</label>
                      <input 
                        type="number" 
                        id={`edit-size-price-${index}`}
                        step="0.01" 
                        min="0" 
                        value={size.price} 
                        onChange={(e) => updateSize(index, "price", e.target.value)} 
                        placeholder="0.00" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-left outline-none focus:ring-2 focus:ring-brand-red font-bold" 
                        dir="ltr" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor={`edit-size-stock-${index}`} className="text-[11px] font-black text-gray-500 block pr-1 uppercase transition-colors cursor-pointer">الكمية</label>
                      <input 
                        type="number" 
                        id={`edit-size-stock-${index}`}
                        step="1" 
                        min="0" 
                        value={size.stock} 
                        onChange={(e) => updateSize(index, "stock", e.target.value)} 
                        placeholder="0" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red placeholder:text-gray-400 placeholder:font-medium text-gray-900 font-bold" 
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-end pt-1 border-t border-gray-200/50">
                  <button type="button" onClick={() => removeSize(index)} className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف الحجم</span>
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addSize} className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-brand-red hover:text-brand-red transition-all min-h-[120px] bg-white hover:bg-gray-50">
              <Plus className="w-6 h-6" />
              <span className="font-bold text-xs uppercase tracking-wide">إضافة حجم جديد</span>
            </button>
          </div>
        )}
      </div>

      {/* ميزة الألوان */}
      <div className="space-y-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="hasColorsEdit" className="text-lg font-bold text-brand-navy border-r-4 border-brand-red pr-3 cursor-pointer">إعدادات الألوان</label>
          <label className="relative inline-flex items-center cursor-pointer gap-3">
            <span className="text-sm font-bold text-gray-700">تفعيل الألوان المتاحة</span>
            <div className="relative">
              <input id="hasColorsEdit" type="checkbox" checked={hasColors} onChange={(e) => setHasColors(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-20px] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
            </div>
          </label>
        </div>

        {hasColors && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
            {colors.map((color, index) => (
              <div key={index} className="flex flex-col gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-gray-100/50">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">لون #{index + 1}</span>
                  <button type="button" onClick={() => removeColor(index)} className="p-1 text-red-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  <label htmlFor={`edit-color-name-${index}`} className="text-[10px] font-bold text-gray-500 uppercase cursor-pointer">اسم اللون</label>
                  <input 
                    type="text" 
                    id={`edit-color-name-${index}`}
                    value={color.name} 
                    onChange={(e) => updateColor(index, "name", e.target.value)} 
                    placeholder="مثال: أسود كربوني" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red placeholder:text-gray-400 placeholder:font-medium text-gray-900 font-bold" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block">اللون والـ Hex code</label>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 border border-gray-300 rounded-lg h-11">
                    <label htmlFor={`edit-color-picker-${index}`} className="sr-only">اختيار اللون رقم {index + 1}</label>
                    <input 
                      type="color" 
                      id={`edit-color-picker-${index}`}
                      value={color.hex.startsWith("#") ? color.hex : "#000000"} 
                      onChange={(e) => updateColor(index, "hex", e.target.value)} 
                      className="w-12 h-8 rounded-md cursor-pointer border border-gray-100 bg-transparent p-0" 
                    />
                    <label htmlFor={`edit-color-hex-${index}`} className="sr-only">كود اللون Hex رقم {index + 1}</label>
                    <input 
                      type="text" 
                      id={`edit-color-hex-${index}`}
                      value={color.hex} 
                      onChange={(e) => updateColor(index, "hex", e.target.value)} 
                      className="w-full h-8 text-[11px] font-mono border border-gray-50 rounded-md px-1 text-center text-gray-900 font-bold outline-none border-transparent hover:border-gray-100 focus:border-brand-red/30" 
                      placeholder="#000000" 
                    />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addColor} className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-brand-red hover:text-brand-red transition-all min-h-[180px] bg-white hover:bg-gray-50">
              <Plus className="w-8 h-8 opacity-50" />
              <span className="font-bold text-xs uppercase tracking-wide">إضافة لون جديد</span>
            </button>
          </div>
        )}
      </div>

      {/* ميزة الأحجام والألوان معاً (Matrix) */}
      {hasSizes && hasColors && (
        <div className="space-y-4 p-6 bg-brand-navy/5 rounded-2xl border border-brand-navy/10 animate-in fade-in slide-in-from-top-2 mt-6">
          <div className="flex flex-col gap-2 border-b border-brand-navy/10 pb-4">
            <h3 className="font-bold text-brand-navy">تفاصيل الكميات والأسعار (حسب الحجم واللون)</h3>
            <p className="text-sm text-gray-500">أدخل الكمية والسعر لكل خيار. سيتم تحديث السعر الافتراضي للمنتج بناءً على خياراتك.</p>
          </div>

          <label htmlFor="unifyPriceEdit" className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-800">توحيد السعر لكل الألوان في نفس الحجم</span>
              <span className="text-xs text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full">موصى به</span>
            </div>
            <div className="relative inline-flex items-center">
              <input id="unifyPriceEdit" type="checkbox" checked={unifyPrice} onChange={(e) => setUnifyPrice(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-20px] after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-navy"></div>
            </div>
          </label>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 text-gray-700 font-bold">
                  <tr>
                    <th className="px-4 py-3 border-b border-gray-200">الحجم</th>
                    <th className="px-4 py-3 border-b border-gray-200">اللون</th>
                    <th className="px-4 py-3 border-b border-gray-200">السعر ($)</th>
                    <th className="px-4 py-3 border-b border-gray-200">الكمية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variantInventory.length > 0 ? (
                    variantInventory.map((variant, index) => {
                      const colorObj = colors.find(c => c.name === variant.color);
                      return (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors font-bold text-gray-900">
                          <td className="px-4 py-3 text-brand-navy">{variant.size || "بدون اسم"}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {colorObj && (
                                <span className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: colorObj.hex.startsWith("#") ? colorObj.hex : `#${colorObj.hex}` }}></span>
                              )}
                              <span className="font-medium text-gray-600">{variant.color || "بدون اسم"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number" 
                              id={`edit-v-price-${index}`}
                              step="0.01"
                              min="0"
                              value={variant.price} 
                              onChange={(e) => updateVariant(index, "price", e.target.value)} 
                              className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red font-bold text-left" 
                              dir="ltr" 
                              placeholder="0.00"
                              aria-label={`سعر الحجم ${variant.size} لون ${variant.color}`}
                              disabled={unifyPrice && index > 0 && variantInventory[index - 1].size === variant.size}
                              title={unifyPrice && index > 0 && variantInventory[index - 1].size === variant.size ? "السعر موحد لهذا الحجم. قم بتغيير الخيار الأول للحجم." : ""}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="number" 
                              id={`edit-v-stock-${index}`}
                              step="1"
                              min="0"
                              value={variant.stock} 
                              onChange={(e) => updateVariant(index, "stock", e.target.value)} 
                              className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-brand-red font-bold" 
                              placeholder="0"
                              aria-label={`كمية الحجم ${variant.size} لون ${variant.color}`}
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : null}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-gray-100">
              {variantInventory.length > 0 ? (
                variantInventory.map((variant, index) => {
                  const colorObj = colors.find(c => c.name === variant.color);
                  return (
                    <div key={index} className="p-4 space-y-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">الخيار</span>
                          <span className="text-sm font-black text-brand-navy">{variant.size || "بدون حجم"} × {variant.color || "بدون لون"}</span>
                        </div>
                        {colorObj && (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                             <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: colorObj.hex.startsWith("#") ? colorObj.hex : `#${colorObj.hex}` }}></span>
                             <span className="text-[10px] font-bold text-gray-500">{variant.color}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label htmlFor={`edit-v-price-mob-${index}`} className="text-[10px] text-gray-400 font-bold uppercase block pr-1">السعر ($)</label>
                          <input 
                            type="number" 
                            id={`edit-v-price-mob-${index}`}
                            step="0.01"
                            min="0"
                            value={variant.price} 
                            onChange={(e) => updateVariant(index, "price", e.target.value)} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red bg-white font-bold text-left" 
                            dir="ltr"
                            disabled={unifyPrice && index > 0 && variantInventory[index - 1].size === variant.size}
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`edit-v-stock-mob-${index}`} className="text-[10px] text-gray-400 font-bold uppercase block pr-1">الكمية</label>
                          <input 
                            type="number" 
                            id={`edit-v-stock-mob-${index}`}
                            step="1"
                            min="0"
                            value={variant.stock} 
                            onChange={(e) => updateVariant(index, "stock", e.target.value)} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-red bg-white font-bold" 
                          />
                        </div>
                      </div>
                      {unifyPrice && index > 0 && variantInventory[index - 1].size === variant.size && (
                         <p className="text-[9px] text-brand-red font-medium">تم توحيد السعر لهذا الخيار.</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  يرجى إضافة حجم ولون واحد على الأقل لتهيئة مصفوفة الخيارات.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* القسم الرابع: الوسائط والملفات */}
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
            <label htmlFor="pdfUrlEdit" className="block text-sm font-bold text-gray-700 text-right cursor-pointer">ملف الكتالوج (PDF)</label>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-black text-gray-600 block pr-1 uppercase transition-colors">رابط يدوي</span>
                <input 
                  type="text" 
                  name="pdfUrl" 
                  defaultValue={product.pdfUrl || ""} 
                  id="pdfUrlEdit"
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-900 placeholder:text-gray-700/80 placeholder:font-medium font-bold text-sm" 
                  dir="ltr"
                />
              </div>
              <div className="relative pt-2">
                <label htmlFor="pdfFileEdit" className="text-[11px] font-black text-gray-600 transition-colors uppercase pr-1 block mb-2 text-right cursor-pointer">رفع ملف جديد</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    name="pdfFile" 
                    id="pdfFileEdit"
                    accept=".pdf" 
                    className="flex-1 text-xs text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-brand-navy shadow-sm border border-gray-200 rounded-xl cursor-pointer" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (pdfInputRef.current) pdfInputRef.current.value = "";
                      const urlInput = document.getElementsByName("pdfUrl")[0] as HTMLInputElement;
                      if (urlInput) urlInput.value = product.pdfUrl || "";
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

      {/* القسم الخامس: الوصف الإضافي */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <label htmlFor="description" className="block text-sm font-bold text-gray-700">وصف المنتج الكامل</label>
        <textarea 
          name="description" 
          id="description"
          rows={5} 
          defaultValue={product.description || ""} 
          placeholder="اكتب مواصفات المنتج وتفاصيله هنا..."
          className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-brand-red outline-none resize-y text-gray-900 bg-gray-50/30" 
        />
      </div>

      <div className="flex justify-end gap-3 md:gap-4 pt-8 border-t border-gray-100 mt-12">
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
