"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Package, FileText, Image as ImageIcon, LayoutGrid } from "lucide-react";

const IconMap = {
  Package,
  FileText,
  ImageIcon,
  LayoutGrid,
};

interface Stat {
  name: string;
  value: string;
  iconName: string;
  color: string;
  border: string;
}

export default function DashboardClient({ stats }: { stats: Stat[] }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] as const 
      } 
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 font-arabic"
    >
      {/* Welcome Banner */}
      <motion.div 
        variants={item}
        className="bg-gradient-to-l from-brand-navy to-blue-900 rounded-[2rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden group transform-gpu"
      >
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-brand-red opacity-10 transform -skew-x-12 translate-x-20 group-hover:translate-x-10 transition-transform duration-1000"></div>
        <div className="relative z-10 transition-transform duration-500">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-white">مرحباً بك في لوحة تحكم AGT</h2>
          <p className="text-blue-100 max-w-2xl text-lg sm:text-xl opacity-80 font-light leading-relaxed">
            من هنا يمكنك إدارة المنتجات، المشاريع، إنشاء عروض الأسعار، ومتابعة التواصل مع العملاء بشكل كامل ودقيق.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => {
          const Icon = IconMap[stat.iconName as keyof typeof IconMap] || Package;
          return (
            <motion.div 
              key={stat.name} 
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`bg-white rounded-3xl p-7 shadow-xl shadow-brand-navy/5 border ${stat.border} flex items-center gap-5 group cursor-default transform-gpu`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${stat.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-wider">{stat.name}</p>
                <h3 className="text-3xl font-black text-brand-navy">{stat.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h3 className="text-2xl font-black text-brand-navy mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-brand-red rounded-full" />
          إجراءات سريعة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/admin/dashboard/products" className="group">
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-brand-navy/5 hover:border-brand-red/20 transition-all flex flex-col items-center text-center gap-6 transform-gpu h-full"
            >
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shadow-inner">
                <Package className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-brand-navy mb-2">إضافة منتج جديد</h4>
                <p className="text-gray-500 leading-relaxed">تحديث كتالوج الألوان والأصباغ</p>
              </div>
            </motion.div>
          </Link>
          
          <Link href="/admin/dashboard/accounting" className="group">
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-brand-navy/5 hover:border-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all flex flex-col items-center text-center gap-6 transform-gpu h-full group"
            >
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-brand-navy group-hover:bg-white group-hover:text-brand-navy transition-all duration-500 shadow-inner">
                <FileText className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-brand-navy group-hover:text-white mb-2 transition-colors">إنشاء عرض سعر</h4>
                <p className="text-gray-500 group-hover:text-blue-100 transition-colors leading-relaxed">نظام المحاسبة وإصدار الفواتير PDF</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/dashboard/projects" className="group">
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-brand-navy/5 hover:border-brand-red/20 transition-all flex flex-col items-center text-center gap-6 transform-gpu h-full"
            >
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all duration-500 shadow-inner">
                <ImageIcon className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-brand-navy mb-2">نشر مشروع جديد</h4>
                <p className="text-gray-500 leading-relaxed">إضافة أعمال جديدة لمعرض الأعمال</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
