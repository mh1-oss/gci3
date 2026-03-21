"use client";

import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { sendMessage, getSettings } from "@/app/admin/actions";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  async function handleSubmit(formData: FormData) {
    const res = await sendMessage(formData);
    if (res.success) {
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    }
  }

  if (!settings) return <div className="min-h-screen bg-brand-light flex items-center justify-center font-arabic">جاري التحميل...</div>;
  return (
    <div className="bg-brand-light min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 font-arabic">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">تواصل معنا</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نحن هنا للإجابة على جميع استفساراتك وتقديم أفضل الحلول لمشاريعك. لا تتردد في مراسلتنا.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 font-arabic">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="bg-red-50 p-3 rounded-full text-brand-red">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">العنوان</h3>
                <p className="text-gray-600">{settings.address}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-3 rounded-full text-brand-navy">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">الهاتف</h3>
                <p className="text-gray-600" dir="ltr">{settings.phone}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="bg-red-50 p-3 rounded-full text-brand-red">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">البريد الإلكتروني</h3>
                <p className="text-gray-600" dir="ltr">{settings.email}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-3 rounded-full text-brand-navy">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">ساعات العمل</h3>
                <p className="text-gray-600 whitespace-pre-line">{settings.workingHours}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-brand-navy mb-6">أرسل لنا رسالة</h2>
              
              {isSent ? (
                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                  <h3 className="text-2xl font-bold text-emerald-800">تم إرسال رسالتك بنجاح</h3>
                  <p className="text-emerald-600">شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.</p>
                </div>
              ) : (
                <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">الاسم الكامل</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                      placeholder="أدخل اسمك الكريم"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
                    <input 
                      type="text" 
                      name="phone"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                      placeholder="رقم للتواصل السريع"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    placeholder="example@domain.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">الموضوع</label>
                  <input 
                    type="text" 
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    placeholder="عنوان الرسالة الاستفسارية"
                  />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">الرسالة</label>
                    <textarea 
                      name="message"
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none text-gray-900 placeholder:text-gray-400"
                      placeholder="تفاصيل مشروعك أو استفسارك..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 py-4 px-6 bg-brand-navy hover:bg-brand-red text-white rounded-xl text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-xl"
                  >
                    إرسال الرسالة
                    <Send className="w-5 h-5 rtl:-scale-x-100" />
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
