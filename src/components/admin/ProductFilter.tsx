"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ChevronDown, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFilterProps {
  categories: string[];
}

export default function ProductFilter({ categories }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      params.delete("category");
    } else {
      params.set("category", val);
    }
    params.delete("search"); // Clear search when filtering by category
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = () => {
    if (currentCategory === "all") return "كل الأقسام";
    if (currentCategory === "none") return "غير مصنف";
    return currentCategory;
  };

  return (
    <div className="relative" ref={containerRef} dir="rtl">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-4 py-2 bg-white border rounded-xl cursor-pointer transition-all duration-200
          ${isOpen ? 'border-brand-navy shadow-md ring-2 ring-brand-navy/5' : 'border-gray-200 hover:border-brand-navy hover:bg-gray-50'}
        `}
      >
        <Filter className={`w-4 h-4 ${isOpen ? 'text-brand-navy' : 'text-gray-400'}`} />
        <span className="text-sm font-bold text-gray-700 font-arabic min-w-[100px]">
          {getLabel()}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden min-w-[200px]"
          >
            <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
              {/* All Option */}
              <button
                onClick={() => handleCategoryChange("all")}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold font-arabic hover:bg-gray-50 transition-colors ${currentCategory === "all" ? 'text-brand-navy bg-brand-navy/5' : 'text-gray-600'}`}
              >
                <span>الكل</span>
                {currentCategory === "all" && <Check className="w-4 h-4" />}
              </button>

              <div className="h-px bg-gray-100 my-1" />

              {/* Uncategorized Option */}
              <button
                onClick={() => handleCategoryChange("none")}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold font-arabic hover:bg-gray-50 transition-colors ${currentCategory === "none" ? 'text-brand-navy bg-brand-navy/5' : 'text-gray-600'}`}
              >
                <span>غير مصنف</span>
                {currentCategory === "none" && <Check className="w-4 h-4" />}
              </button>

              {categories.length > 0 && <div className="h-px bg-gray-100 my-1" />}

              {/* Main Categories */}
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold font-arabic hover:bg-gray-50 transition-colors ${currentCategory === cat ? 'text-brand-navy bg-brand-navy/5' : 'text-gray-600'}`}
                >
                  <span>{cat}</span>
                  {currentCategory === cat && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
