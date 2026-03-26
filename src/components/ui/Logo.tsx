"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Logo({ className = "", isDark = false }: { className?: string; isDark?: boolean }) {
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* Logo image — PNG with background removed via mix-blend-mode */}
      <motion.div
        className="relative transform group-hover:scale-105 transition-transform duration-500 ease-out"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          opacity: { duration: 0.8, delay: 0.2, ease: "easeOut" },
          scale: { duration: 1.0, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] },
        }}
      >
        <Image
          src="/agt-logo-v4.png"
          alt="AGT Logo"
          width={136}
          height={136}
          className="block"
          style={{
            width: 68,
            height: 68,
            objectFit: "contain",
          }}
          priority
        />
      </motion.div>
      
      <div className="flex flex-col justify-center leading-none tracking-tight font-arabic">
        <motion.div 
          className={`text-2xl font-black ${isDark ? 'text-white' : 'text-brand-navy'} group-hover:text-brand-red transition-colors duration-300 tracking-tighter leading-none`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        >
          AGT
        </motion.div>
        <motion.div 
          className={`text-[10px] font-bold ${isDark ? 'text-white/60' : 'text-gray-400'} group-hover:text-brand-red/60 transition-colors duration-300 whitespace-nowrap mt-1`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
        >
          مجموعة الوليد للتجارة العامة
        </motion.div>
      </div>
    </div>
  );
}
