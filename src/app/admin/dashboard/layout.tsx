"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Image as ImageIcon, Calculator, LogOut, Settings, Users, FileText, Layers, Menu, X, Building2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { logoutAdmin } from "@/app/admin/actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "الرئيسية", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "المنتجات", href: "/admin/dashboard/products", icon: Package },
    { name: "المجاميع", href: "/admin/dashboard/categories", icon: Layers },
    { name: "الشركات التابعة", href: "/admin/dashboard/subsidiaries", icon: Building2 },
    { name: "المشاريع", href: "/admin/dashboard/projects", icon: ImageIcon },
    { name: "المخزن (Inventory)", href: "/admin/dashboard/inventory", icon: Package },
    { name: "المحاسبة وعروض الأسعار", href: "/admin/dashboard/accounting", icon: Calculator },
    { name: "الرسائل", href: "/admin/dashboard/messages", icon: FileText },
    { name: "الإعدادات", href: "/admin/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 font-arabic relative overflow-x-hidden" dir="rtl">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-brand-navy/60 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-screen w-64 bg-brand-navy text-white shadow-2xl flex flex-col z-50 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        
        <div className="h-20 flex items-center justify-between border-b border-white/5 px-6 shrink-0 bg-brand-navy/50 backdrop-blur-md">
          <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2">
            <Logo isDark={true} />
          </Link>
          <button 
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/20 scale-[1.02]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-brand-navy/30">
          <button
            onClick={() => logoutAdmin()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-brand-red transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-gray-50 lg:mr-64 transition-all duration-300">
        <header className="h-16 lg:h-20 bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-between px-4 lg:px-8 fixed top-0 right-0 lg:right-64 left-0 z-40 border-b border-gray-100 min-w-0 transition-all duration-300">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl text-brand-navy transition-colors bg-gray-50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-sm lg:text-lg font-bold text-brand-navy leading-tight">لوحة التحكم</h1>
              <span className="text-[10px] text-gray-400 font-medium lg:hidden">AGT Group Admin</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-4 ml-0">
            <div className="flex flex-col items-end hidden sm:flex">
              <div className="text-xs lg:text-sm font-bold text-brand-navy">المدير العام</div>
              <div className="text-[9px] lg:text-[10px] text-gray-400">admin@agt-group.com</div>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold font-sans shadow-lg text-xs lg:text-sm ring-2 ring-white ring-offset-2">
              AD
            </div>
          </div>
        </header>

        {/* Header Spacer */}
        <div className="h-16 lg:h-20"></div>

        <main className="flex-1 p-4 lg:p-10 w-full max-w-full overflow-x-hidden bg-gray-50/50">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
