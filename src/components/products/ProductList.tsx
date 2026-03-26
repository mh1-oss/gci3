"use client";

import { PaintBucket, Search, Filter, Building2, CheckCircle2, ChevronDown, ArrowLeft } from "lucide-react";
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
  subsidiaryId?: string | null;
  createdAt?: Date;
};

type Category = { id: string; name: string };
type Subsidiary = { id: string; name: string; logoUrl: string | null };

export default function ProductList({ 
  initialProducts, 
  dbCategories, 
  initialCategory,
  settings,
  subsidiaries = []
}: { 
  initialProducts: Product[], 
  dbCategories: Category[], 
  initialCategory?: string,
  settings: any,
  subsidiaries: Subsidiary[]
}) {
  const { formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "الكل");
  const [selectedSubsidiary, setSelectedSubsidiary] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories = ["الكل", ...dbCategories.map(c => c.name)];

  const filteredProducts = initialProducts.filter(product => {
    const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory;
    const matchesSubsidiary = selectedSubsidiary === "all" || product.subsidiaryId === selectedSubsidiary;
    const matchesSearch = product.title.includes(searchQuery) || (product.category && product.category.includes(searchQuery));
    return matchesCategory && matchesSubsidiary && matchesSearch;
  });

  const showPrice = settings.showPrice === "true" || settings.showPrice === true;
  const showStock = settings.showStock === "true" || settings.showStock === true;

  return (
    <div className="bg-brand-light min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 font-arabic">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-6"
          >
            <PaintBucket className="w-8 h-8 text-brand-red" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-brand-navy mb-6"
          >
            كتالوج المنتجات
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            تصفح مجموعتنا الواسعة من الأصباغ والمنتجات الإنشائية من أفضل الماركات العالمية المنضوية تحت مظلة مجموعة AGT.
          </motion.p>
        </div>

        {/* Filters and Search */}
        <div className="space-y-8 mb-12 font-arabic">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start flex-1">
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20 transform scale-105' : 'bg-white text-brand-navy hover:bg-gray-100 border border-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Search Box */}
            <div className="relative w-full lg:w-80">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن منتج..." 
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all text-brand-navy placeholder:text-gray-400 font-bold"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Subsidiary Filter Bar */}
          <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-brand-navy/5 border border-gray-100 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-xl text-sm font-bold">
              <Building2 className="w-4 h-4" />
              تصفية حسب الشركة:
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedSubsidiary("all")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedSubsidiary === "all" ? 'bg-brand-red text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                الكل
              </button>
              {subsidiaries.map((sub) => (
                <button 
                  key={sub.id}
                  onClick={() => setSelectedSubsidiary(sub.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${selectedSubsidiary === sub.id ? 'bg-brand-red text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProducts.map((product) => {
                const productSubsidiary = subsidiaries.find(s => s.id === product.subsidiaryId);
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={product.id} 
                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col relative"
                  >
                    <div className="relative h-72 overflow-hidden bg-gray-50 flex items-center justify-center p-8">
                      {/* Product Image */}
                      <img 
                        src={product.imageUrl || "/images/product.png"} 
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Badge Overlay */}
                      <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                        <div className="bg-brand-navy/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black font-arabic shadow-xl">
                          {product.category}
                        </div>
                        {showStock && Number(product.stock) <= 0 && (
                          <div className="bg-white text-brand-red border-2 border-brand-red px-4 py-1.5 rounded-full text-xs font-black font-arabic shadow-xl animate-pulse">
                            غير متوفر حالياً
                          </div>
                        )}
                        {showStock && Number(product.stock) > 0 && (
                          <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-black font-arabic shadow-xl flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            متوفر بالمخزن
                          </div>
                        )}
                      </div>

                      {/* Subsidiary Logo Overlay */}
                      {productSubsidiary && (
                        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
                           {productSubsidiary.logoUrl ? (
                             <img src={productSubsidiary.logoUrl} alt={productSubsidiary.name} className="w-full h-full object-contain" />
                           ) : (
                             <Building2 className="w-6 h-6 text-gray-200" />
                           )}
                        </div>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-grow font-arabic">
                      <div className="mb-4">
                        <h3 className="text-2xl font-black text-brand-navy group-hover:text-brand-red transition-colors leading-tight mb-2">{product.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 h-10">{product.description}</p>
                      </div>
                      
                      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                          {showPrice && product.price && product.price !== "0.00" ? (
                            <>
                              <span className="text-xs text-gray-400 font-bold uppercase">السعر التقريبي</span>
                              <span className="text-2xl font-black text-emerald-600">{formatPrice(product.price)}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-xs text-gray-400 font-bold uppercase">الحالة</span>
                              <span className="text-sm font-black text-brand-navy">تواصل لمعرفة السعر</span>
                            </>
                          )}
                        </div>
                        <Link 
                          href={`/products/${product.id}`} 
                          className="w-14 h-14 bg-gray-50 text-brand-navy rounded-2xl flex items-center justify-center hover:bg-brand-red hover:text-white transition-all duration-300 group/btn shadow-inner"
                        >
                          <ArrowLeft className="w-6 h-6 group-hover/btn:-translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Filter className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-brand-navy mb-3 font-arabic">لم يتم العثور على منتجات</h3>
              <p className="text-gray-500 font-arabic max-w-sm mx-auto">جرب تغيير خيارات البحث أو الفلتر لرؤية نتائج أخرى.</p>
              <button 
                onClick={() => { setSelectedCategory("الكل"); setSelectedSubsidiary("all"); setSearchQuery(""); }}
                className="mt-8 px-10 py-4 bg-brand-navy text-white rounded-2xl font-black font-arabic hover:bg-brand-red transition-all shadow-xl shadow-brand-navy/20"
              >
                مسح جميع الفلاتر
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
