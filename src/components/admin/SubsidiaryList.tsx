"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Building2, ChevronUp, ChevronDown, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImagePreview from "./ImagePreview";

interface SubsidiaryListProps {
  initialSubsidiaries: any[];
  createAction: (formData: FormData) => Promise<any>;
  updateAction: (id: string, formData: FormData) => Promise<any>;
  deleteAction: (id: string) => Promise<any>;
  reorderAction: (ids: string[]) => Promise<any>;
}

export default function SubsidiaryList({ 
  initialSubsidiaries,
  createAction,
  updateAction,
  deleteAction,
  reorderAction
}: SubsidiaryListProps) {
  const router = useRouter();
  const [subsidiaries, setSubsidiaries] = useState(initialSubsidiaries);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Auto-reset confirmation state after 3 seconds
  useEffect(() => {
    if (confirmingId) {
      const timer = setTimeout(() => setConfirmingId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmingId]);

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
          if (editingId) setEditingId(null);
          if (isAdding) setIsAdding(false);
          router.refresh(); 
        }
      } catch (err) {
        alert("حدث خطأ أثناء الحفظ. تأكد من إعدادات التخزين.");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      return;
    }
    
    setConfirmingId(null);
    
    startTransition(async () => {
      try {
        const result = await deleteAction(id);
        if (result?.error) {
          alert(result.error);
        } else {
          setSubsidiaries(prev => prev.filter(s => s.id !== id));
          router.refresh();
        }
      } catch (err) {
        alert("حدث خطأ غير متوقع أثناء الحذف.");
      }
    });
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...validSubsidiaries];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newItems.length) return;

    const [removed] = newItems.splice(index, 1);
    newItems.splice(newIndex, 0, removed);
    
    setSubsidiaries(newItems);

    startTransition(async () => {
      try {
        await reorderAction(newItems.map(item => item.id));
      } catch (err) {
        alert("فشل في تحديث الترتيب.");
        setSubsidiaries(validSubsidiaries);
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

      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {isAdding && (
            <motion.div 
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 rounded-3xl border-2 border-dashed border-brand-red/30 mb-4"
            >
              <form action={(fd) => handleAction(createAction, fd)} className="space-y-4 font-arabic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
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
                            <label className="text-sm font-black text-brand-navy pr-1 block text-right">الشعار اللفظي (Slogan) - اختياري</label>
                            <input 
                                name="slogan" 
                                placeholder="مثال: دقة في التنفيذ.. جودة في الأداء"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-brand-navy/5 focus:border-brand-navy outline-none text-gray-700 transition-all text-right placeholder:text-gray-300" 
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
                    </div>
                    <div>
                        <ImagePreview 
                            initialUrl={null} 
                            name="logo" 
                            label="شعار الشركة (Logo)" 
                            folder="subsidiaries/logos"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
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

          {validSubsidiaries.map((subsidiary, index) => (
            <motion.div 
              layout
              key={subsidiary.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white p-4 sm:p-6 rounded-[1.5rem] shadow-sm border border-gray-100 group relative overflow-hidden hover:shadow-md transition-shadow"
            >
              {editingId === subsidiary.id ? (
                <form action={(fd) => handleAction(updateAction.bind(null, subsidiary.id), fd)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-arabic">
                    <div className="space-y-4">
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
                            <label className="text-sm font-black text-brand-navy pr-1 block text-right">الشعار اللفظي (Slogan)</label>
                            <input 
                                name="slogan" 
                                defaultValue={subsidiary.slogan} 
                                placeholder="أدخل الشعار اللفظي..."
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-brand-navy/5 focus:border-brand-navy outline-none text-gray-700 transition-all text-right placeholder:text-gray-300" 
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
                    </div>
                    
                    <ImagePreview 
                      initialUrl={subsidiary.logoUrl} 
                      name="logo" 
                      label="شعار الشركة (Logo)" 
                      folder="subsidiaries/logos"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
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
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Sort Controls */}
                  <div className="flex flex-row sm:flex-col gap-1 items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button 
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 px-2.5 sm:px-1 sm:p-1.5 text-gray-400 hover:text-brand-navy hover:bg-white rounded-lg transition disabled:opacity-20"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <div className="text-[10px] font-black text-gray-300 select-none hidden sm:block">
                      {index + 1}
                    </div>
                    <button 
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === validSubsidiaries.length - 1}
                      className="p-1 px-2.5 sm:px-1 sm:p-1.5 text-gray-400 hover:text-brand-navy hover:bg-white rounded-lg transition disabled:opacity-20"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Logo */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                    {subsidiary.logoUrl ? (
                      <img src={subsidiary.logoUrl} alt={subsidiary.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <Building2 className="w-10 h-10 text-gray-300" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow text-center sm:text-right">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1 justify-center sm:justify-start">
                        <h3 className="text-xl font-black text-brand-navy">{subsidiary.name}</h3>
                        {subsidiary.slogan && (
                            <span className="text-brand-red text-xs font-bold px-2 py-0.5 bg-red-50 rounded-md">
                                {subsidiary.slogan}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-1 h-5">{subsidiary.description || "لا يوجد وصف متوفر"}</p>
                  </div>

                  {/* Actions */}
                  <motion.div 
                    layout
                    className="flex gap-2 shrink-0 bg-gray-50/50 p-2 rounded-2xl border border-gray-100/50"
                  >
                    <button 
                      onClick={() => setEditingId(subsidiary.id)}
                      className="p-3 text-brand-navy hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-90"
                      title="تعديل"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <motion.button 
                      layout
                      onClick={() => handleDelete(subsidiary.id)}
                      className={`p-3 relative flex items-center gap-2 overflow-hidden rounded-xl active:scale-95 transition-colors duration-300 ${
                        confirmingId === subsidiary.id 
                          ? "bg-brand-red text-white shadow-lg shadow-brand-red/20 px-4" 
                          : "bg-white text-brand-red hover:shadow-sm"
                      }`}
                      title="حذف"
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300
                      }}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        {confirmingId === subsidiary.id ? (
                          <motion.div
                            key="confirm"
                            initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="w-5 h-5" />
                            <span className="text-xs font-black whitespace-nowrap">تأكيد؟</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="trash"
                            initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
