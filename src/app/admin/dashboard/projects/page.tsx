import { db } from "@/db";
import { projects } from "@/db/schema";
import { Plus, Image as ImageIcon, Edit2 } from "lucide-react";
import Link from "next/link";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const allProjects = await db.select().from(projects);

  return (
    <div className="space-y-6 font-arabic">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-brand-navy">إدارة المشاريع</h2>
        <Link 
          href="/admin/dashboard/projects/new"
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl hover:bg-red-700 transition shadow-lg w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مشروع جديد</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[600px] lg:min-w-full">
            <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">صورة المشروع</th>
                <th className="px-6 py-4 font-medium">اسم المشروع</th>
                <th className="px-6 py-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-50 shadow-sm">
                      {project.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-brand-navy text-base sm:text-lg">{project.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1 max-w-[200px] sm:max-w-md">{project.description || "لا يوجد وصف"}</div>
                    <div className="mt-1 inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                      {project.category || "عام"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <Link 
                        href={`/admin/dashboard/projects/${project.id}/edit`}
                        className="p-2 text-gray-400 hover:text-brand-navy transition-colors"
                        title="تعديل المشروع"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                      <DeleteProjectButton id={project.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {allProjects.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <ImageIcon className="w-12 h-12 opacity-20" />
                      <p>لا توجد مشاريع مضافة حالياً.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
