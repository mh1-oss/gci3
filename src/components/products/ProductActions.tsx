"use client";

import { useState } from "react";
import PriceDisplay from "@/components/ui/PriceDisplay";
import { CheckCircle2, Palette, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  product: {
    price: string;
    stock: string;
    hasSizes: string;
    sizes: { name: string; price: string; stock?: string }[] | null;
    hasColors: string;
    colors: { name: string; hex: string }[] | null;
    variantInventory?: { size: string; color: string; stock: string; price: string }[] | null;
  };
  showPrice: boolean;
  showStock: boolean;
}

export default function ProductActions({ product, showPrice, showStock }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState(
    product.hasSizes === "true" && product.sizes && product.sizes.length > 0
      ? product.sizes[0]
      : { name: "الافتراضي", price: product.price, stock: product.stock }
  );

  const [selectedColor, setSelectedColor] = useState(
    product.hasColors === "true" && product.colors && product.colors.length > 0
      ? product.colors[0]
      : null
  );

  let currentPrice = selectedSize.price || product.price;
  let currentStock = parseInt(selectedSize.stock || "0");

  if (product.hasSizes === "true" && product.hasColors === "true" && product.variantInventory && selectedSize && selectedColor) {
    const variant = product.variantInventory.find(
      v => v.size === selectedSize.name && v.color === selectedColor.name
    );
    if (variant) {
      currentPrice = variant.price || currentPrice;
      currentStock = parseInt(variant.stock || "0");
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Price & Stock Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {showPrice && (
          <div className="flex items-center gap-4">
            <PriceDisplay 
              priceUSD={currentPrice} 
              className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-3 rounded-2xl text-3xl font-black shadow-sm" 
            />
            {product.hasSizes === "true" && (
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
                (سعر {product.hasColors === "true" ? `الحجم ${selectedSize.name} واللون ${selectedColor?.name}` : `حجم ${selectedSize.name}`})
              </span>
            )}
          </div>
        )}

        {showStock && (
          <div className={cn(
            "px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2 w-fit",
            currentStock > 0 
              ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
              : "bg-red-50 border-red-100 text-red-600"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              currentStock > 0 ? "bg-emerald-500" : "bg-red-500"
            )} />
            {currentStock > 0 ? `متوفر: ${currentStock} قطعة` : "نفد من المخزون"}
          </div>
        )}
      </div>

      {/* Colors Section */}
      {product.hasColors === "true" && product.colors && product.colors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-navy font-bold">
            <Palette className="w-5 h-5 text-brand-red" />
            <span>الألوان المتاحة:</span>
            <span className="text-brand-red mr-1">{selectedColor?.name}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "group relative flex items-center justify-center p-1 rounded-full border-2 transition-all duration-300",
                  selectedColor?.name === color.name 
                    ? "border-brand-red scale-110 shadow-md" 
                    : "border-transparent hover:border-gray-200"
                )}
                title={color.name}
              >
                <span 
                  className="w-8 h-8 rounded-full border border-gray-100 shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes Section */}
      {product.hasSizes === "true" && product.sizes && product.sizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-navy font-bold">
            <Ruler className="w-5 h-5 text-brand-red" />
            <span>الأحجام المتوفرة:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all border-2",
                  selectedSize.name === size.name
                    ? "bg-brand-navy text-white border-brand-navy shadow-md"
                    : "bg-white text-gray-600 border-gray-100 hover:border-brand-red/30 hover:bg-brand-red/5"
                )}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Default Bullet points for quality */}
      {!product.hasSizes && !product.hasColors && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-gray-700 font-medium">جودة عالية وضمان طويل الأمد</span>
          </div>
        </div>
      )}
    </div>
  );
}
