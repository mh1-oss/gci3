import { db } from "@/db";
import { projects } from "@/db/schema";

export const dynamic = "force-dynamic";
import { eq } from "drizzle-orm";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

  if (!project) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-arabic text-right">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/dashboard/projects"
          className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-brand-navy"
        >
          <ArrowRight className="w-6 h-6" />
        </Link>
        <h2 className="text-2xl font-bold text-brand-navy">تعديل المشروع: {project.title}</h2>
      </div>

      <ProjectForm project={project} />
    </div>
  );
}
