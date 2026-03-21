"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { loginAdmin } from "@/app/admin/actions";
import { useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error");

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center shadow-lg mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-brand-navy font-arabic">لوحة الإدارة</h2>
          <p className="mt-2 text-sm text-gray-500 font-arabic">تسجيل الدخول لإدارة الموقع والمحاسبة</p>
        </div>
        
        {hasError && (
          <div className="bg-red-50 text-brand-red p-3 rounded-xl text-center text-sm font-arabic font-bold">
            البريد الإلكتروني أو كلمة المرور غير صحيحة
          </div>
        )}
        
        <form className="mt-8 space-y-6" action={loginAdmin}>
          <div className="space-y-4 font-arabic">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  className="appearance-none block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all sm:text-sm"
                  placeholder="admin@gcipaints.com"
                  dir="ltr"
                />
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  className="appearance-none block w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-brand-navy hover:bg-brand-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all overflow-hidden font-arabic"
            >
              <span className="relative z-10">دخول</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
