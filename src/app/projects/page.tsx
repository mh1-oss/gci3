import { Camera } from "lucide-react";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 font-arabic">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">معرض مشاريعنا</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            تصفح مجموعة من أبرز المشاريع التي ساهمت أعمالنا في إبراز جمالها ورونقها ومواكبة العصر.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {allProjects.map((project) => (
            <div key={project.id} className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer h-[400px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={project.imageUrl || ""} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 font-arabic">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="w-5 h-5 text-brand-red" />
                  <span className="text-white/80 text-sm">{project.category || "عام"}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <div className="w-12 h-1 bg-brand-red transition-all duration-300 group-hover:w-24 mt-4"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
