"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProject } from "@/app/admin/actions";
import { Save } from "lucide-react";
import ImagePreview from "./ImagePreview";

export default function ProjectForm({ project }: { project: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const result = await updateProject(project.id, formData);
        if (result?.error) {
           alert(result.error);
        } else {
           // Redirect on success
           router.push("/admin/dashboard/projects");
           router.refresh();
        }
      } catch (err: any) {
        const isRedirect =
          err &&
          typeof err === "object" &&
          "digest" in err &&
          typeof err.digest === "string" &&
          err.digest.startsWith("NEXT_REDIRECT");
        
        if (isRedirect) {
          throw err;
        }
        
        console.error("Form Submit Error:", err);
        alert(err.message || "فشل الحفظ. تأكد من حجم الملفات (الحد الأقصى 1 ميغابايت) أو اتصال الإنترنت.");
      }
    });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 font-arabic">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 text-right block">عنوان المشروع</label>
          <input 
            name="title" 
            type="text" 
            required
            defaultValue={project.title}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition text-right text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 text-right block">وصف المشروع</label>
          <textarea 
            name="description" 
            rows={4}
            defaultValue={project.description || ""}
            placeholder="وصف المشروع..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition text-right text-gray-900 placeholder:text-gray-400"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 text-right block">القسم / التصنيف</label>
            <input 
              name="category" 
              type="text" 
              defaultValue={project.category || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition text-right text-gray-900 placeholder:text-gray-400"
            />
          </div>
          
          <ImagePreview 
            initialUrl={project.imageUrl} 
            name="image" 
            label="صورة المشروع" 
            folder="projects/images"
            helperText="أو ارفع صورة مباشرة (الأحدث يربح)"
          />
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
