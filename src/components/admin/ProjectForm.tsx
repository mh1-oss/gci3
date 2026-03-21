"use client";

import { updateProject } from "@/app/admin/actions";
import { Save } from "lucide-react";
import { useTransition } from "react";

export default function ProjectForm({ project }: { project: any }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => updateProject(project.id, formData));
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">عنوان المشروع</label>
          <input 
            name="title" 
            type="text" 
            required
            defaultValue={project.title}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">وصف المشروع</label>
          <textarea 
            name="description" 
            rows={4}
            defaultValue={project.description || ""}
            placeholder="وصف المشروع..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">القسم / التصنيف</label>
            <input 
              name="category" 
              type="text" 
              defaultValue={project.category || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">رابط صورة المشروع</label>
            <input 
              name="imageUrl" 
              type="text" 
              defaultValue={project.imageUrl || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition text-left"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-brand-navy text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#000d3d] transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isPending ? "جاري الحفظ..." : "تحديث البيانات"}
        </button>
      </form>
    </div>
  );
}
