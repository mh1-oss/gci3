"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface Subsidiary {
  id: string;
  name: string;
  description: string | null;
  slogan: string | null;
  logoUrl: string | null;
}

interface SubsidiaryPreviewModalProps {
  subsidiary: Subsidiary | null;
  onClose: () => void;
  isAdmin?: boolean;
}

export default function SubsidiaryPreviewModal({ 
  subsidiary, 
  onClose,
  isAdmin = false 
}: SubsidiaryPreviewModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (subsidiary) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [subsidiary]);

  if (!subsidiary) return null;

  const productsLink = isAdmin 
    ? `/admin/dashboard/products?subsidiary=${subsidiary.id}`
    : `/products?subsidiary=${subsidiary.id}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-navy/70 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden font-arabic flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
          dir="rtl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-brand-red rounded-full transition-all z-[110] shadow-sm hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Logo/Visual (Visual Anchor) */}
          <div className="w-full md:w-[42%] bg-[#F8F9FB] flex flex-col items-center justify-center p-8 sm:p-12 relative border-l border-gray-100/50 shrink-0">
             {/* Subtle dynamic background elements */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-brand-red/10 rounded-full blur-[60px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-brand-navy/10 rounded-full blur-[60px]" />
             </div>

             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="relative z-10 p-6 sm:p-8 bg-white rounded-3xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-white"
             >
                {subsidiary.logoUrl ? (
                  <img 
                    src={subsidiary.logoUrl} 
                    alt={subsidiary.name} 
                    className="max-w-full max-h-[120px] sm:max-h-[160px] object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.05)]" 
                  />
                ) : (
                  <Building2 className="w-16 h-16 sm:w-20 sm:h-20 text-gray-200" />
                )}
             </motion.div>
          </div>

          {/* Right Side: Organized Info */}
          <div className="w-full md:w-[58%] p-6 sm:p-12 flex flex-col relative overflow-y-auto">
            <div className="mb-0">
               <motion.span 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.3 }}
                 className="inline-block px-3 py-1 bg-brand-navy/5 text-brand-navy/60 rounded-lg text-[10px] font-bold tracking-widest uppercase mb-3"
               >
                 ملف العلامة التجارية
               </motion.span>
               
               <motion.h2 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.35 }}
                 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight mb-2"
               >
                 {subsidiary.name}
               </motion.h2>

               {subsidiary.slogan && (
                 <motion.p 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.4 }}
                   className="text-brand-red/60 font-black text-lg sm:text-xl leading-tight mb-6 sm:mb-8"
                 >
                   {subsidiary.slogan}
                 </motion.p>
               )}
            </div>
            
            <div className="flex-grow">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="relative pl-6"
               >
                 <div className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-brand-navy/20 rounded-full" />
                 <p className="text-gray-500 leading-relaxed text-[15px] sm:text-[17px] font-medium pr-5">
                   {subsidiary.description || "لا يوجد وصف متوفر لهذه العلامة التجارية حالياً."}
                 </p>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className="flex flex-wrap gap-3 mt-6 sm:mt-8"
               >
                 <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">
                   <Package className="w-4 h-4" />
                   <span>منتجات أصلية وكفالة حقيقية</span>
                 </div>
               </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 flex items-center justify-between"
            >
               <Link
                href={productsLink}
                onClick={onClose}
                className="group relative inline-flex items-center gap-4 bg-brand-navy text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl text-lg font-bold overflow-hidden transition-all hover:bg-brand-red shadow-xl shadow-brand-navy/10 active:scale-95"
               >
                 <span className="relative z-10">استكشاف المنتجات</span>
                 <ArrowLeft className="w-5 h-5 relative z-10 transition-transform group-hover:-translate-x-1" />
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
