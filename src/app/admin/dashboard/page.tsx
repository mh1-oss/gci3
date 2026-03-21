import { Package, Image as ImageIcon, FileText, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { products, projects, messages, categories } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  // Fetch real counts from database
  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [projectCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
  const [messageCount] = await db.select({ count: sql<number>`count(*)` }).from(messages);
  const [categoryCount] = await db.select({ count: sql<number>`count(*)` }).from(categories);

  const stats = [
    { name: "إجمالي المنتجات", value: productCount.count.toString(), icon: Package, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { name: "المشاريع المنجزة", value: projectCount.count.toString(), icon: ImageIcon, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
    { name: "الرسائل الواردة", value: messageCount.count.toString(), icon: FileText, color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
    { name: "تصنيفات المواد", value: categoryCount.count.toString(), icon: LayoutGrid, color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-brand-navy to-blue-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 bg-brand-red opacity-10 sm:opacity-20 transform -skew-x-12 translate-x-10 sm:translate-x-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl sm:text-3xl font-bold mb-2 text-[#F1F1F1]">مرحباً بك في لوحة تحكم GCI للأصباغ</h2>
          <p className="text-blue-100 max-w-2xl text-sm sm:text-lg opacity-90">
            من هنا يمكنك إدارة المنتجات، المشاريع، إنشاء عروض الأسعار، ومتابعة التواصل مع العملاء بشكل كامل ودقيق.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className={`bg-white rounded-2xl p-6 shadow-sm border ${stat.border} hover:shadow-md transition-shadow flex items-center gap-4`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-brand-navy mb-6">إجراءات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/dashboard/products" className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-brand-red hover:shadow-md transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-brand-red group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">إضافة منتج جديد</h4>
              <p className="text-sm text-gray-500 mt-1">تحديث كتالوج الألوان والأصباغ</p>
            </div>
          </Link>
          
          <Link href="/admin/dashboard/accounting" className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-brand-navy hover:shadow-md transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-brand-navy group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">إنشاء عرض سعر</h4>
              <p className="text-sm text-gray-500 mt-1">نظام المحاسبة وإصدار الفواتير PDF</p>
            </div>
          </Link>

          <Link href="/admin/dashboard/projects" className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-brand-red hover:shadow-md transition-all flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-brand-red group-hover:scale-110 transition-transform">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">نشر مشروع جديد</h4>
              <p className="text-sm text-gray-500 mt-1">إضافة صور وأعمال جديدة لمعرض الأعمال</p>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
