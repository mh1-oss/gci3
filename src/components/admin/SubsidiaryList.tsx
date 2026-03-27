"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Globe, Building2, Save, X, Image as ImageIcon } from "lucide-react";
import { createSubsidiary, updateSubsidiary, deleteSubsidiary } from "@/app/admin/actions";
import { motion, AnimatePresence } from "framer-motion";
import ImagePreview from "./ImagePreview";

export default function SubsidiaryList({ initialSubsidiaries }: { initialSubsidiaries: any[] }) {
  const router = useRouter();
  const [subsidiaries, setSubsidiaries] = useState(initialSubsidiaries);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Sync state if initialSubsidiaries changes (e.g. on server revalidation)
  useEffect(() => {
    setSubsidiaries(initialSubsidiaries);
  }, [initialSubsidiaries]);

  // Filter out any invalid items
  const validSubsidiaries = subsidiaries.filter(s => s && s.id);

  const handleAction = async (action: (formData: FormData) => Promise<any>, formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result?.error) {
          alert(result.error);
        } else {
          // If it was an add, we need to refresh the client state manually or wait for revalidation
          if (editingId) setEditingId(null);
          if (isAdding) setIsAdding(false);
          // Refresh the router to get latest data
          router.refresh(); 
        }
      } catch (err) {
        alert("حدث خطأ أثناء الحفظ. تأكد من إعدادات التخزين.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-brand-red text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-700 transition shadow-lg shadow-brand-red/10"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة شركة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-3xl border-2 border-dashed border-brand-red/30 flex flex-col gap-4"
            >
              <form action={(fd) => handleAction(createSubsidiary, fd)} className="space-y-4 font-arabic">
                <div className="space-y-2">
                  <label className="text-sm font-black text-brand-navy pr-1 block text-right">اسم الشركة</label>
                  <input 
                    name="name" 
                    required 
                    placeholder="أدخل اسم الشركة..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-brand-navy/5 focus:border-brand-navy outline-none text-brand-navy font-bold transition-all text-right placeholder:text-gray-300" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-brand-navy pr-1 block text-right">الوصف</label>
                  <textarea 
                    name="description" 
                    placeholder="وصف مختصر للشركة ونشاطها..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-brand-navy/5 focus:border-brand-navy outline-none resize-none text-gray-700 min-h-[100px] transition-all text-right placeholder:text-gray-300" 
                  />
                </div>
                
                <ImagePreview 
                  initialUrl={null} 
                  name="logo" 
                  label="شعار الشركة (Logo)" 
                  folder="subsidiaries/logos"
                />

                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={isPending} 
                    className="flex-1 bg-brand-navy text-white py-3.5 rounded-2xl font-black text-lg hover:bg-black hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-brand-navy/10"
                  >
                    {isPending ? "جاري الحفظ..." : "إضافة الشركة"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)} 
                    className="px-6 py-3.5 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {validSubsidiaries.map((subsidiary) => (
            <motion.div 
              layout
              key={subsidiary.id}
              className="bg-white p-6 rounded-3xl shadow-xl shadow-brand-navy/5 border border-gray-100 group relative overflow-hidden"
            >
              {editingId === subsidiary.id ? (
                <form action={(fd) => handleAction(updateSubsidiary.bind(null, subsidiary.id), fd)} className="space-y-4">
                  <div className="space-y-4 font-arabic">
                    <div className="space-y-2">
                      <label className="text-sm font-black text-brand-navy pr-1 block text-right">اسم الشركة</label>
                      <input 
                        name="name" 
                        defaultValue={subsidiary.name} 
                        required 
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-brand-navy/5 focus:border-brand-navy outline-none text-brand-navy font-bold transition-all text-right" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-brand-navy pr-1 block text-right">الوصف</label>
                      <textarea 
                        name="description" 
                        defaultValue={subsidiary.description} 
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-brand-navy/5 focus:border-brand-navy outline-none resize-none text-gray-700 min-h-[100px] transition-all text-right" 
                      />
                    </div>
                    
                    <ImagePreview 
                      initialUrl={subsidiary.logoUrl} 
                      name="logo" 
                      label="شعار الشركة (Logo)" 
                      folder="subsidiaries/logos"
                    />

                    <div className="flex gap-3 pt-4">
                      <button 
                        type="submit" 
                        disabled={isPending} 
                        className="flex-1 bg-brand-navy text-white py-3.5 rounded-2xl font-black text-lg hover:bg-black hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-brand-navy/10"
                      >
                        {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditingId(null)} 
                        className="px-6 py-3.5 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                      {subsidiary.logoUrl ? (
                        <img src={subsidiary.logoUrl} alt={subsidiary.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setEditingId(subsidiary.id)}
                        className="p-2 text-gray-400 hover:text-brand-navy hover:bg-blue-50 rounded-lg transition"
                        title="تعديل"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                            if(confirm('هل أنت متأكد من حذف هذه الشركة؟')) {
                                startTransition(async () => {
                                    try {
                                        const result = await deleteSubsidiary(subsidiary.id);
                                        if (result?.error) {
                                            alert(result.error);
                                        } else {
                                            setSubsidiaries(prev => prev.filter(s => s.id !== subsidiary.id));
                                        }
                                    } catch (err) {
                                        alert("حدث خطأ غير متوقع أثناء الحذف.");
                                    }
                                });
                            }
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy mb-2">{subsidiary.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{subsidiary.description || "لا يوجد وصف متوفر"}</p>
                  
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      نشط
                    </span>
                    <span>{new Date(subsidiary.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
