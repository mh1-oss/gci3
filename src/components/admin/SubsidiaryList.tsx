"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Edit2, Globe, Building2, Save, X, Image as ImageIcon } from "lucide-react";
import { createSubsidiary, updateSubsidiary, deleteSubsidiary } from "@/app/admin/actions";
import { motion, AnimatePresence } from "framer-motion";

export default function SubsidiaryList({ initialSubsidiaries }: { initialSubsidiaries: any[] }) {
  const [subsidiaries, setSubsidiaries] = useState(initialSubsidiaries);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter out any invalid items
  const validSubsidiaries = subsidiaries.filter(s => s && s.id);

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
              <form action={async (formData) => {
                startTransition(async () => {
                  await createSubsidiary(formData);
                  setIsAdding(false);
                });
              }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400">اسم الشركة</label>
                  <input name="name" required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400">الوصف</label>
                  <textarea name="description" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red outline-none resize-none" rows={3}></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400">رابط الشعار (Logo URL)</label>
                  <input name="logoUrl" placeholder="/images/logos/..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red outline-none" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" disabled={isPending} className="flex-1 bg-brand-navy text-white py-2 rounded-xl font-bold hover:bg-black transition disabled:opacity-50">حفظ</button>
                  <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition">إلغاء</button>
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
                <form action={async (formData) => {
                  startTransition(async () => {
                    await updateSubsidiary(subsidiary.id, formData);
                    setEditingId(null);
                  });
                }} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400">اسم الشركة</label>
                    <input name="name" defaultValue={subsidiary.name} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400">الوصف</label>
                    <textarea name="description" defaultValue={subsidiary.description} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red outline-none resize-none" rows={3}></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400">رابط الشعار (Logo URL)</label>
                    <input name="logoUrl" defaultValue={subsidiary.logoUrl} placeholder="/images/logos/..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red outline-none" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={isPending} className="flex-1 bg-brand-navy text-white py-2 rounded-xl font-bold hover:bg-black transition disabled:opacity-50">حفظ التغييرات</button>
                    <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition">إلغاء</button>
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
                                    await deleteSubsidiary(subsidiary.id);
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
