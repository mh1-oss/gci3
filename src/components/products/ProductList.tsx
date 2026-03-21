"use client";

import { PaintBucket, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";

type Product = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
  price: string | null;
  stock: string | null;
  pdfUrl?: string | null;
  createdAt?: Date;
};

type Category = { id: string; name: string };

export default function ProductList({ initialProducts, dbCategories, initialCategory }: { initialProducts: Product[], dbCategories: Category[], initialCategory?: string }) {
  const { formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "الكل");
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories = ["الكل", ...dbCategories.map(c => c.name)];

  const filteredProducts = initialProducts.filter(product => {
    const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory;
    const matchesSearch = product.title.includes(searchQuery) || (product.category && product.category.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-brand-light min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 font-arabic">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-6">
            <PaintBucket className="w-8 h-8 text-brand-red" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">منتجاتنا</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من الأصباغ المتطورة والمنتجات المساعدة لتلبية جميع احتياجاتك الديكورية والصناعية.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 font-arabic">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-brand-navy text-white shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..." 
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProducts.map((product) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.imageUrl || ""} 
                    alt={product.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-brand-navy text-xs font-bold font-arabic shadow-sm">
                      {product.category}
                    </div>
                    {Number(product.stock) <= 0 && (
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold font-arabic shadow-md animate-pulse">
                        نفدت الكمية
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow font-arabic">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-red transition-colors">{product.title}</h3>
                    {product.price && product.price !== "0.00" && (
                      <span className="text-lg font-bold text-emerald-600 bg-emerald-50 px-2 rounded-lg">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <Link href={`/products/${product.id}`} className="px-4 py-2 w-full text-center bg-gray-50 text-brand-navy border border-gray-200 rounded-lg hover:bg-brand-navy hover:text-white transition-colors text-sm font-medium">
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-gray-100"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-2 font-arabic">لا توجد منتجات مطابقة</h3>
            <p className="text-gray-500 font-arabic">يرجى تعديل خيارات البحث أو الفلتر لرؤية المزيد من المنتجات.</p>
            <button 
              onClick={() => { setSelectedCategory("الكل"); setSearchQuery(""); }}
              className="mt-6 px-6 py-2 bg-brand-navy text-white rounded-full font-arabic hover:bg-brand-red transition-colors"
            >
              عرض كل المنتجات
            </button>
          </motion.div>
        )}
        </AnimatePresence>

      </div>
    </div>
  );
}
