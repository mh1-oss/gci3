import { db } from "@/db";
import { products, siteSettings, subsidiaries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { ArrowRight, CheckCircle2, Tag, Layers, DownloadCloud, Building2 } from "lucide-react";
import PriceDisplay from "@/components/ui/PriceDisplay";
import ProductActions from "@/components/products/ProductActions";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  
  const productData = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  const product = productData[0];

  if (!product) {
    return {
      title: "المنتج غير موجود",
    };
  }

  return {
    title: product.title,
    description: product.description?.slice(0, 160) || `تفاصيل ${product.title} من مجموعة الوليد للتجارة العامة.`,
    openGraph: {
      title: `${product.title} | مجموعة الوليد`,
      description: product.description?.slice(0, 160) || `تفاصيل ${product.title} من مجموعة الوليد.`,
      images: [product.imageUrl || "/images/product.png"],
    },
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  
  const productData = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  const allSettings = await db.select().from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);

  if (!productData || productData.length === 0) {
    notFound();
  }

  const product = productData[0];
  const subsidiaryData = product.subsidiaryId 
    ? await db.select().from(subsidiaries).where(eq(subsidiaries.id, product.subsidiaryId)).limit(1)
    : [];
  const productSubsidiary = subsidiaryData[0] || null;
  const settings = allSettings[0] || { showPrice: "true", showStock: "true" };
  const showPrice = settings.showPrice === "true";
  const showStock = settings.showStock === "true";

  return (
    <div className="bg-brand-light min-h-screen py-16 font-arabic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-red transition mb-8 font-medium">
          <ArrowRight className="w-5 h-5" />
          <span>العودة إلى المنتجات</span>
        </Link>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Section */}
            <div className="relative h-[350px] md:h-[500px] lg:h-full bg-gray-50 group flex items-center justify-center p-6 md:p-12 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.imageUrl || "/images/product.png"} 
                alt={product.title} 
                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 z-10"
              />
              
              {/* Category Badge */}
              <div className="absolute top-6 right-6 bg-brand-navy/90 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-black shadow-xl z-20 border border-white/10">
                {product.category}
              </div>

              {/* Subsidiary Logo Overlay - Fixed to top-left to avoid overlaps */}
              {productSubsidiary && (
                <div className="absolute top-6 left-6 w-16 h-16 bg-white rounded-full shadow-2xl border border-gray-100 p-2.5 flex items-center justify-center overflow-hidden z-20 hover:scale-110 transition-transform group/sub">
                   {productSubsidiary.logoUrl ? (
                     <img src={productSubsidiary.logoUrl} alt={productSubsidiary.name} className="w-full h-full object-contain" />
                   ) : (
                     <Building2 className="w-8 h-8 text-gray-200" />
                   )}
                   <div className="absolute inset-0 bg-brand-navy/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover/sub:opacity-100 transition-opacity font-bold text-center p-2">
                      {productSubsidiary.name}
                   </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4 text-brand-red text-sm font-bold">
                <Tag className="w-4 h-4" />
                <span>رقم المنتج: {product.id.split('-')[0]}</span>
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl md:text-5xl font-extrabold text-brand-navy leading-tight">
                  {product.title}
                </h1>
                {/* Price is now handled inside ProductActions for dynamic switching */}
              </div>
              
              <div className="h-1 w-20 bg-brand-red rounded-full mb-8"></div>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {product.description || "معلومات هذا المنتج قيد التحديث وسنوافيكم بكامل التفاصيل الفنية قريباً."}
              </p>

              <div className="mb-10">
                <ProductActions 
                  product={product as any} 
                  showPrice={showPrice} 
                  showStock={showStock}
                />
              </div>

              <div className="space-y-4 mb-10 border-t border-gray-50 pt-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-700 font-medium">جودة عالية وضمان طويل الأمد</span>
                </div>
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-700 font-medium">كفاءة في التغطية وتقليل الاستهلاك</span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center mt-auto">
                <div>
                  <span className="block text-sm text-gray-500 mb-1">المواصفات الفنية وطريقة الاستخدام</span>
                  <span className="text-xl font-bold text-brand-navy">تحميل الكتالوج بصيغة PDF</span>
                </div>
                {product.pdfUrl ? (
                  <a 
                    href={product.pdfUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-brand-navy hover:bg-blue-900 text-white px-8 py-3 rounded-xl font-bold transition shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2"
                  >
                    <DownloadCloud className="w-5 h-5" />
                    تحميل PDF
                  </a>
                ) : (
                  <div className="w-full sm:w-auto bg-gray-200 text-gray-400 px-8 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 cursor-not-allowed" title="الملف غير متوفر حالياً">
                    <DownloadCloud className="w-5 h-5" />
                    الكتالوج غير متوفر
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
