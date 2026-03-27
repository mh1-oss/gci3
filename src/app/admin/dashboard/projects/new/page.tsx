"use client";

import { createProject } from "@/app/admin/actions";
import { ArrowRight, Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function NewProjectPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createProject(formData);
      if (result?.success) {
        router.push("/admin/dashboard/projects");
      } else if (result?.error) {
        alert(result.error);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-arabic">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/dashboard/projects"
          className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-brand-navy"
        >
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold text-brand-navy">إضافة مشروع جديد</h2>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">عنوان المشروع</label>
            <input 
              name="title" 
              type="text" 
              required
              placeholder="مثال: مجمع المنصور السكني"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">وصف المشروع</label>
            <textarea 
              name="description" 
              rows={4}
              placeholder="شرح مبسط عن المشروع والمواد المستخدمة فيه..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition text-gray-900 placeholder:text-gray-400"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">القسم / التصنيف</label>
              <input 
                name="category" 
                type="text" 
                placeholder="مثال: مشاريع سكنية"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">رابط صورة المشروع</label>
              <input 
                name="imageUrl" 
                type="text" 
                placeholder="رابط الصورة (URL)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition text-left text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-brand-red text-white py-4 rounded-xl font-bold shadow-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isPending ? "جاري الحفظ..." : "حفظ المشروع"}
          </button>
        </form>
      </div>
    </div>
  );
}
