"use client";

import { motion } from "framer-motion";

export default function Logo({ className = "", isDark = false }: { className?: string; isDark?: boolean }) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      {/* Premium Minimalist SVG Paint Drop / Abstract geometric mark */}
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-md"
      >
        <defs>
          <linearGradient id="redGradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E31837" />
            <stop offset="1" stopColor="#B20F26" />
          </linearGradient>
          <linearGradient id="navyGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B1953" />
            <stop offset="1" stopColor="#06103D" />
          </linearGradient>
        </defs>

        {/* Abstract Paint Drop / Petal overlaps */}
        <motion.path
          d="M50 0C50 0 10 30 10 60C10 82.0914 27.9086 100 50 100C72.0914 100 90 82.0914 90 60C90 30 50 0 50 0Z"
          fill={isDark ? "white" : "url(#navyGradient)"}
          fillOpacity={isDark ? 0.1 : 1}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        <motion.path
          d="M50 20C50 20 25 45 25 65C25 78.8071 36.1929 90 50 90C63.8071 90 75 78.8071 75 65C75 45 50 20 50 20Z"
          fill="url(#redGradient)"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />

        {/* Inner stylized highlight */}
        <motion.ellipse
          cx="60"
          cy="45"
          rx="5"
          ry="15"
          transform="rotate(30 60 45)"
          fill="white"
          fillOpacity="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.svg>
      
      <div className="flex flex-col justify-center leading-none tracking-tight font-arabic">
        <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-brand-navy'} group-hover:text-brand-red transition-colors duration-300 tracking-tighter leading-none`}>
          AGT
        </div>
        <div className={`text-[10px] font-bold ${isDark ? 'text-white/60' : 'text-gray-400'} group-hover:text-brand-red/60 transition-colors duration-300 whitespace-nowrap mt-1`}>
          مجموعة الوليد للتجارة العامة
        </div>
      </div>
    </div>
  );
}
