"use client";

import { PaintBucket, Search, Filter, Building2, CheckCircle2, ChevronDown, ArrowLeft, ChevronLeft, ChevronRight, LayoutGrid, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
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
  hasSizes?: string | null;
  sizes?: any;
  hasColors?: string | null;
  colors?: any;
  variantInventory?: any;
  unifyPrice?: string | null;
  pdfUrl?: string | null;
  subsidiaryId?: string | null;
  createdAt?: Date | null;
};

type Category = { id: string; name: string };
type Subsidiary = { id: string; name: string; slogan: string | null; logoUrl: string | null };

export default function ProductList({ 
  initialProducts, 
  dbCategories, 
  initialCategory,
  initialSubsidiary,
  settings,
  subsidiaries = []
}: { 
  initialProducts: Product[], 
  dbCategories: Category[], 
  initialCategory?: string,
  initialSubsidiary?: string,
  settings: any,
  subsidiaries: Subsidiary[]
}) {
  const { formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "الكل");
  const [selectedSubsidiary, setSelectedSubsidiary] = useState(initialSubsidiary || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // In RTL (Chrome/Edge/Firefox logic):
      // scrollLeft is 0 at the far right, and becomes negative as you scroll left.
      const absScroll = Math.abs(scrollLeft);
      const maxScroll = scrollWidth - clientWidth;
      
      // showRightArrow: show if we can scroll back to the right (start)
      setShowRightArrow(absScroll > 5);
      // showLeftArrow: show if we can scroll more to the left (end)
      setShowLeftArrow(absScroll < maxScroll - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const categories = ["الكل", ...dbCategories.map(c => c.name)];

  const filteredProducts = initialProducts.filter(product => {
    const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory;
    const matchesSubsidiary = selectedSubsidiary === "all" || product.subsidiaryId === selectedSubsidiary;
    const matchesSearch = product.title.includes(searchQuery) || (product.category && product.category.includes(searchQuery));
    return matchesCategory && matchesSubsidiary && matchesSearch;
  });

  const showPrice = settings.showPrice === "true";
  const showStock = settings.showStock === "true";

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
            <div className="relative flex-1 w-full lg:max-w-[calc(100%-22rem)]">
              <div className="relative group">
                {/* Navigation Arrows (Desktop) */}
                <div className="absolute inset-y-0 right-0 z-10 hidden md:flex items-center pointer-events-none">
                   {showRightArrow && (
                     <button 
                       onClick={() => scroll('right')}
                       className="p-2 bg-white/90 backdrop-blur shadow-lg rounded-full text-brand-navy hover:text-brand-red transition-all -mr-5 border border-gray-100 pointer-events-auto"
                       title="السابق"
                     >
                       <ChevronRight className="w-5 h-5" />
                     </button>
                   )}
                </div>
                
                <div className="absolute inset-y-0 left-0 z-10 hidden md:flex items-center pointer-events-none">
                   {showLeftArrow && (
                     <button 
                       onClick={() => scroll('left')}
                       className="p-2 bg-white/90 backdrop-blur shadow-lg rounded-full text-brand-navy hover:text-brand-red transition-all -ml-5 border border-gray-100 pointer-events-auto"
                       title="التالي"
                     >
                       <ChevronLeft className="w-5 h-5" />
                     </button>
                   )}
                </div>

                {/* Scrollable Container */}
                <div 
                  ref={scrollRef}
                  onScroll={checkScroll}
                  className={`flex overflow-x-auto scrollbar-hide gap-2 py-2 px-1 transition-all ${showLeftArrow && showRightArrow ? 'mask-fade-both' : showLeftArrow ? 'mask-fade-left' : showRightArrow ? 'mask-fade-right' : ''}`}
                  style={{ direction: 'rtl' }}
                >
                  {categories.slice(0, 15).map((cat, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${selectedCategory === cat ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20 scale-105' : 'bg-white text-brand-navy hover:bg-gray-100 border border-gray-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                  
                  {/* More Button */}
                  {categories.length > 15 && (
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 bg-brand-navy text-white hover:bg-brand-red flex items-center gap-2 shadow-lg"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      كل الفئات
                    </button>
                  )}
                </div>
              </div>
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
                    <div className="relative h-80 overflow-hidden bg-gray-50 flex items-center justify-center p-12">
                      {/* Product Image */}
                      <img 
                        src={product.imageUrl || "/images/product.png"} 
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-xl"
                      />
                      
                      {/* Top Badge Overlay */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                        <div className="bg-brand-navy/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black font-arabic shadow-xl border border-white/20">
                          {product.category}
                        </div>
                      </div>

                      {/* Subsidiary Logo Overlay - Moved to top-left and made circular/premium */}
                      {productSubsidiary && (
                        <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 p-2 flex items-center justify-center overflow-hidden group/sub hover:scale-110 transition-transform">
                           {productSubsidiary.logoUrl ? (
                             <img src={productSubsidiary.logoUrl} alt={productSubsidiary.name} className="w-full h-full object-contain" />
                           ) : (
                             <Building2 className="w-6 h-6 text-gray-200" />
                           )}
                           {/* Hover tooltip for brand */}
                           <div className="absolute inset-0 bg-brand-navy/80 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/sub:opacity-100 transition-opacity font-bold text-center p-1">
                              {productSubsidiary.name}
                           </div>
                        </div>
                      )}

                      {/* Stock Badge Overlay - Bottom Right */}
                      <div className="absolute bottom-4 right-4">
                        {showStock && Number(product.stock) <= 0 && (
                          <div className="bg-white/90 backdrop-blur-sm text-brand-red border border-brand-red/20 px-3 py-1 rounded-lg text-[10px] font-black font-arabic shadow-sm">
                            غير متوفر
                          </div>
                        )}
                        {showStock && Number(product.stock) > 0 && (
                          <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black font-arabic shadow-lg flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            متوفر
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow font-arabic">
                      <div className="mb-4">
                        <h3 className="text-xl font-black text-brand-navy group-hover:text-brand-red transition-colors leading-tight mb-2 line-clamp-1">{product.title}</h3>
                        <p className="text-gray-400 text-xs line-clamp-2 min-h-[2.5rem] leading-relaxed">{product.description || "لا يوجد وصف متوفر لهذا المنتج حالياً."}</p>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          {showPrice && product.price && product.price !== "0.00" ? (
                            <>
                              <span className="text-[10px] text-gray-400 font-bold uppercase">{product.hasSizes === "true" ? "يبدأ من" : "السعر"}</span>
                              <span className="text-xl font-black text-emerald-600">{formatPrice(product.price)}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-[10px] text-gray-400 font-bold uppercase">الحالة</span>
                              <span className="text-sm font-black text-brand-navy">تواصل للسعر</span>
                            </>
                          )}
                        </div>
                        <Link 
                          href={`/products/${product.id}`} 
                          className="w-12 h-12 bg-gray-50 text-brand-navy rounded-xl flex items-center justify-center hover:bg-brand-navy hover:text-white transition-all duration-300 group/btn shadow-sm"
                        >
                          <ArrowLeft className="w-5 h-5 group-hover/btn:-translate-x-1 transition-transform" />
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

      {/* Categories Search Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-arabic">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-xl text-brand-red">
                    <LayoutGrid className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-brand-navy">تصفح جميع الفئات</h2>
                    <p className="text-xs text-gray-500">اختر الفئة التي تبحث عنها</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Modal Search */}
              <div className="p-6 bg-gray-50/50">
                <div className="relative">
                  <input 
                    type="text" 
                    value={catSearch}
                    onChange={(e) => setCatSearch(e.target.value)}
                    placeholder="ابحث عن فئة..." 
                    className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red transition-all font-bold"
                  />
                  <Search className="absolute left-4 top-4.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Categories Grid */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.filter(c => c.toLowerCase().includes(catSearch.toLowerCase())).map((cat, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsModalOpen(false);
                      }}
                      className={`p-4 rounded-2xl text-sm font-bold transition-all text-center border-2 ${selectedCategory === cat ? 'bg-brand-red text-white border-brand-red shadow-lg' : 'bg-white text-brand-navy border-gray-100 hover:border-brand-red/30 hover:bg-gray-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {categories.filter(c => c.toLowerCase().includes(catSearch.toLowerCase())).length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">لا توجد فئات تطابق بحثك</p>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                إجمالي الفئات: {categories.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
