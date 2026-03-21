"use client";

import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { sendMessage, getSettings } from "@/app/admin/actions";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  
  const contactCards = [
    { icon: MapPin, title: "العنوان", content: settings.address, bg: "bg-red-50", text: "text-brand-red" },
    { icon: Phone, title: "الهاتف", content: settings.phone, bg: "bg-blue-50", text: "text-brand-navy", ltr: true },
    { icon: Mail, title: "البريد الإلكتروني", content: settings.email, bg: "bg-red-50", text: "text-brand-red", ltr: true },
    { icon: Clock, title: "ساعات العمل", content: settings.workingHours, bg: "bg-blue-50", text: "text-brand-navy", pre: true },
  ];

  return (
    <div className="bg-brand-light min-h-screen py-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 font-arabic"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">تواصل معنا</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نحن هنا للإجابة على جميع استفساراتك وتقديم أفضل الحلول لمشاريعك. لا تتردد في مراسلتنا.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 font-arabic">
          
          {/* Contact Info Cards */}
          <div className="space-y-6">
            {contactCards.map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-xl hover:border-brand-red/10 transition-all duration-300"
              >
                <div className={`${card.bg} p-3 rounded-2xl ${card.text}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-brand-navy mb-1">{card.title}</h3>
                  <p className={`text-gray-600 text-sm leading-relaxed ${card.ltr ? 'font-sans' : ''} ${card.pre ? 'whitespace-pre-line' : ''}`} dir={card.ltr ? "ltr" : "rtl"}>
                    {card.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form Container */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-brand-navy/5 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-brand-red opacity-10" />
              <h2 className="text-2xl font-bold text-brand-navy mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-brand-red rounded-full" />
                أرسل لنا رسالة
              </h2>
              
              <AnimatePresence mode="wait">
                {isSent ? (
                  <motion.div 
                    key="success"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-emerald-50 border border-emerald-100 p-10 rounded-3xl text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-800">تم إرسال رسالتك بنجاح</h3>
                    <p className="text-emerald-700">شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    action={handleSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 mr-2">الاسم الكامل</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                          placeholder="أدخل اسمك الكريم"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 mr-2">رقم الهاتف</label>
                        <input 
                          type="text" 
                          name="phone"
                          className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                          placeholder="رقم للتواصل السريع"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 mr-2">البريد الإلكتروني</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                        placeholder="example@domain.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 mr-2">الموضوع</label>
                      <input 
                        type="text" 
                        name="subject"
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                        placeholder="عنوان الرسالة الاستفسارية"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 mr-2">الرسالة</label>
                      <textarea 
                        name="message"
                        rows={5}
                        required
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-brand-red/5 focus:border-brand-red transition-all bg-gray-50 focus:bg-white resize-none text-gray-900 placeholder:text-gray-400 font-medium"
                        placeholder="تفاصيل مشروعك أو استفسارك..."
                      ></textarea>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full flex justify-center items-center gap-3 py-5 px-8 bg-brand-navy hover:bg-brand-red text-white rounded-2xl text-xl font-bold transition-all duration-300 shadow-xl shadow-brand-navy/10 hover:shadow-brand-red/20 active:shadow-inner"
                    >
                      <span>إرسال الرسالة الآن</span>
                      <Send className="w-5 h-5 rtl:-scale-x-100" />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
