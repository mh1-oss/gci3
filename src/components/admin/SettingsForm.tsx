"use client";

import { useState, useTransition } from "react";
import { Save, CheckCircle2, Facebook, Instagram, MessageCircle, Linkedin, Eye, EyeOff } from "lucide-react";
import { updateSettings, updateAdminPassword } from "@/app/admin/actions";

function PasswordChangeSection() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  async function handlePasswordSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        const result = await updateAdminPassword(formData);
        if (result.success) {
          setSuccess(result.message);
          // @ts-ignore
          document.getElementById("passwordForm")?.reset();
        }
      } catch (err: any) {
        setError(err.message);
      }
    });
  }

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h3 className="text-lg font-bold text-brand-navy mb-6 border-b border-gray-100 pb-2">تغيير كلمة مرور المدير</h3>
      <form id="passwordForm" action={handlePasswordSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 text-right">كلمة المرور الجديدة</label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                name="newPassword" 
                required 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900" 
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-2.5 text-gray-400 hover:text-brand-navy"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 text-right">تأكيد كلمة المرور</label>
            <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                name="confirmPassword" 
                required 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900" 
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
        {success && <p className="text-emerald-600 text-sm font-bold">{success}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-brand-navy text-white px-8 py-2.5 rounded-xl hover:bg-brand-red transition shadow-md disabled:opacity-50"
          >
            {isPending ? "جاري التحديث..." : "تحديث كلمة المرور"}
          </button>
        </div>
      </form>
    </div>
  );
}

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
    <div className="font-arabic">
      <form action={handleSubmit} className="space-y-6 relative">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-brand-navy">إعدادات النظام</h2>
          <div className="flex items-center gap-4">
            {showSuccess && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-110 animate-in fade-in slide-in-from-top-4 duration-300">
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
          {/* Main settings content */}
          <div>
            <h3 className="text-lg font-bold text-brand-navy mb-4 border-b border-gray-100 pb-2">معلومات الشركة الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">اسم الشركة</label>
                <input type="text" name="companyName" defaultValue={settings.companyName || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">البريد الإلكتروني للاتصال</label>
                <input type="email" name="email" defaultValue={settings.email || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" dir="ltr" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">رقم الهاتف (National Paints)</label>
                <input type="text" name="phoneNational" defaultValue={settings.phoneNational || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">رقم الهاتف (GCI Paints)</label>
                <input type="text" name="phoneGCI" defaultValue={settings.phoneGCI || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" dir="ltr" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">العنوان</label>
                <input type="text" name="address" defaultValue={settings.address || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">ساعات العمل</label>
                <input type="text" name="workingHours" defaultValue={settings.workingHours || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-right">سعر صرف الدولار (مثال: 1500)</label>
                <input type="number" name="exchangeRate" defaultValue={settings.exchangeRate || "1500"} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" dir="ltr" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-brand-navy mb-4 border-b border-gray-100 pb-2">خيارات العرض والخصوصية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Eye className="w-5 h-5 text-brand-navy" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy text-sm">إظهار الأسعار</p>
                    <p className="text-xs text-gray-500">عرض أسعار المنتجات للجمهور</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="showPrice" defaultChecked={settings.showPrice === "true"} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Eye className="w-5 h-5 text-brand-navy" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy text-sm">إظهار حالة الكمية</p>
                    <p className="text-xs text-gray-500">عرض مدى توفر المنتج في المخزن</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="showStock" defaultChecked={settings.showStock === "true"} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                </label>
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
                <input type="text" name="facebook" placeholder="https://facebook.com/..." defaultValue={settings.facebook || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 text-right">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>إنستغرام</span>
                </label>
                <input type="text" name="instagram" placeholder="https://instagram.com/..." defaultValue={settings.instagram || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 text-right">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span>واتساب</span>
                </label>
                <input type="text" name="whatsapp" placeholder="+964..." defaultValue={settings.whatsapp || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 text-right">
                  <Linkedin className="w-4 h-4 text-blue-700" />
                  <span>لينكد إن</span>
                </label>
                <input type="text" name="linkedin" placeholder="https://linkedin.com/..." defaultValue={settings.linkedin || ""} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400" dir="ltr" />
              </div>
            </div>
          </div>
        </div>
      </form>
      
      <PasswordChangeSection />
    </div>
  );
}
