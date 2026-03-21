import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products, projects } from "./schema";

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

async function main() {
  console.log("Seeding database...");
  
  // Seed Products
  await db.insert(products).values([
    { title: "أكريليك داخلي مطفي", category: "أصباغ داخلية", description: "دهان أكريليك عالي الجودة للاستخدام الداخلي، يمنح الجدران مظهراً مطفياً وأنيقاً بفضل تركيبته المتطورة القابلة للغسيل والمنظفة تلقائياً.", imageUrl: "/images/product.png", price: "250.00" },
    { title: "درع واقي للواجهات", category: "أصباغ خارجية", description: "دهان خارجي متطور مقاوم للعوامل الجوية القاسية، يعمل كدرع واقي ضد الأشعة فوق البنفسجية والأمطار، ويحافظ على الألوان زاهية لسنوات طويلة.", imageUrl: "/images/product.png", price: "450.00" },
    { title: "دهان مقاوم للصدأ", category: "دهانات صناعية", description: "دهان صناعي صلب مخصص لحماية الأسطح المعندنية والحديدية من التآكل والصدأ، يتميز بقوة الالتصاق والصلابة، مثالي للبيئات الصناعية القاسية.", imageUrl: "/images/product.png", price: "320.00" },
    { title: "أساس مائي عالي الجودة", category: "أصباغ داخلية", description: "طلاء أساس (Primer) مائي مصمم لتهيئة وتجهيز الأسطح قبل الطلاء النهائي، يضمن تماسكاً فائقاً للدهان الأساسي ويقلل من استهلاكه.", imageUrl: "/images/product.png", price: "180.00" },
    { title: "طلاء ديكوري لامع", category: "أصباغ داخلية", description: "طلاء داخلي بلمعة متوسطة يضفي طابعاً ديكورياً مميزاً على المساحات، مناسب للغرف وصالات الاستقبال وسهل التنظيف جداً.", imageUrl: "/images/product.png", price: "290.00" },
    { title: "عازل رطوبة ممتاز", category: "أصباغ خارجية", description: "مادة عازلة متخصصة لمنع تسرب المياه والرطوبة لجدران المبان، تحمي الهيكل الإنشائي من التصدعات وتمنع نمو وتكاثر العفن.", imageUrl: "/images/product.png", price: "550.00" },
  ]);

  // Seed Projects
  await db.insert(projects).values([
    { title: "فيلا الرمال الذهبية", category: "فلل", description: "تنفيذ متكامل لأعمال الأصباغ الداخلية والخارجية لفيلا فخمة باستخدام أحدث تقنياتنا.", imageUrl: "/images/project.png" },
    { title: "برج الأفق التجاري", category: "تجاري", description: "مشروع طلاء واجهات برج تجاري بارتفاع 40 طابقاً باستخدام دهانات خارجية مقاومة للظروف المناخية القاسية.", imageUrl: "/images/project.png" },
    { title: "مجمع حدائق الخليج", category: "سكني", description: "تجهيز وطلاء مجمع سكني مكون من 120 وحدة سكنية مع مرافقها الخدمية والترفيهية بحلول طلاء اقتصادية وعالية الديمومة.", imageUrl: "/images/project.png" },
    { title: "المركز الطبي الحديث", category: "طبي", description: "استخدام طلاء صحي خاص مدعم بتقنية النانو لغرف العمليات وممرات المركز لضمان أقصى درجات التعقيم والحماية البكتيرية.", imageUrl: "/images/project.png" },
  ]);

  console.log("Seeding complete!");
}

main().catch(console.error);
