"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Image as ImageIcon, Calculator, LogOut, Settings, Users, FileText, Layers } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { logoutAdmin } from "@/app/admin/actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: "الرئيسية", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "المنتجات", href: "/admin/dashboard/products", icon: Package },
    { name: "المجاميع", href: "/admin/dashboard/categories", icon: Layers },
    { name: "المشاريع", href: "/admin/dashboard/projects", icon: ImageIcon },
    { name: "المخزن (Inventory)", href: "/admin/dashboard/inventory", icon: Package },
    { name: "المحاسبة وعروض الأسعار", href: "/admin/dashboard/accounting", icon: Calculator },
    { name: "الرسائل", href: "/admin/dashboard/messages", icon: FileText },
    { name: "الإعدادات", href: "/admin/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 font-arabic" dir="rtl">

      {/* Sidebar */}
      <div className="w-64 bg-brand-navy text-white shadow-xl flex flex-col fixed inset-y-0 right-0 z-10 transition-transform">
        <div className="h-24 flex items-center justify-center border-b border-white/10 px-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                    ? "bg-brand-red text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => logoutAdmin()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 mr-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-10 border-b border-gray-100">
          <h1 className="text-xl font-bold text-brand-navy">لوحة التحكم</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold font-sans">
              AD
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-bold text-gray-900">المدير العام</div>
              <div className="text-xs text-gray-500">admin@gcipaints.com</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
