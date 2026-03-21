"use client";

import { useState, useTransition } from "react";
import { Save, CheckCircle2, Facebook, Instagram, MessageCircle, Linkedin } from "lucide-react";
import { updateSettings } from "@/app/admin/actions";

export default function SettingsForm({ settings }: { settings: any }) {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateSettings(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6 font-arabic relative">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-brand-navy">إعدادات النظام</h2>
        <div className="flex items-center gap-4">
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold">تم حفظ التغييرات بنجاح</span>
            </div>
          )}
          <button 
            type="submit" 
            disabled={isPending}
            className={`flex items-center gap-2 bg-brand-red text-white px-6 py-2.5 rounded-xl hover:bg-red-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save className={`w-5 h-5 ${isPending ? 'animate-pulse' : ''}`} />
            <span>{isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
        <div>
          <h3 className="text-lg font-bold text-brand-navy mb-4 border-b border-gray-100 pb-2">معلومات الشركة الأساسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">اسم الشركة</label>
              <input type="text" name="companyName" defaultValue={settings.companyName || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">البريد الإلكتروني للاتصال</label>
              <input type="email" name="email" defaultValue={settings.email || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">رقم الهاتف</label>
              <input type="text" name="phone" defaultValue={settings.phone || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">العنوان</label>
              <input type="text" name="address" defaultValue={settings.address || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">ساعات العمل</label>
              <input type="text" name="workingHours" defaultValue={settings.workingHours || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">سعر صرف الدولار (مثال: 1500)</label>
              <input type="number" name="exchangeRate" defaultValue={settings.exchangeRate || "1500"} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" dir="ltr" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-brand-navy mb-4 border-b border-gray-100 pb-2">حسابات التواصل الاجتماعي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 text-right">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>فيسبوك</span>
              </label>
              <input type="text" name="facebook" placeholder="https://facebook.com/..." defaultValue={settings.facebook || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 text-right">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>إنستغرام</span>
              </label>
              <input type="text" name="instagram" placeholder="https://instagram.com/..." defaultValue={settings.instagram || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 text-right">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>واتساب</span>
              </label>
              <input type="text" name="whatsapp" placeholder="+964..." defaultValue={settings.whatsapp || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 text-right">
                <Linkedin className="w-4 h-4 text-blue-700" />
                <span>لينكد إن</span>
              </label>
              <input type="text" name="linkedin" placeholder="https://linkedin.com/..." defaultValue={settings.linkedin || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" dir="ltr" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
