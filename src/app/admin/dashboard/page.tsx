import { db } from "@/db";
import { products, projects, messages, categories } from "@/db/schema";
import { sql } from "drizzle-orm";
import DashboardClient from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardOverview() {
  // Fetch real counts from database
  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [projectCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
  const [messageCount] = await db.select({ count: sql<number>`count(*)` }).from(messages);
  const [categoryCount] = await db.select({ count: sql<number>`count(*)` }).from(categories);

  const stats = [
    { name: "إجمالي المنتجات", value: productCount.count.toString(), iconName: "Package", color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { name: "المشاريع المنجزة", value: projectCount.count.toString(), iconName: "ImageIcon", color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
    { name: "الرسائل الواردة", value: messageCount.count.toString(), iconName: "FileText", color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
    { name: "تصنيفات المواد", value: categoryCount.count.toString(), iconName: "LayoutGrid", color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
  ];

  return <DashboardClient stats={stats} />;
}
