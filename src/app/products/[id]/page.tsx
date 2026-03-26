import { db } from "@/db";
import { products, siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Package, Tag, Layers, DownloadCloud } from "lucide-react";
import PriceDisplay from "@/components/ui/PriceDisplay";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  
  const productData = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  const allSettings = await db.select().from(siteSettings).where(eq(siteSettings.id, "main")).limit(1);

  if (!productData || productData.length === 0) {
    notFound();
  }

  const product = productData[0];
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
            <div className="relative h-[400px] lg:h-full bg-gray-50 group flex items-center justify-center p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.imageUrl || "/images/product.png"} 
                alt={product.title} 
                className="w-full max-h-[500px] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-6 right-6 bg-brand-navy/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                {product.category}
              </div>
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
                {showPrice && (
                  <PriceDisplay 
                    priceUSD={product.price} 
                    className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-2xl font-bold shadow-sm whitespace-nowrap mr-4" 
                  />
                )}
              </div>
              
              <div className="h-1 w-20 bg-brand-red rounded-full mb-8"></div>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {product.description || "معلومات هذا المنتج قيد التحديث وسنوافيكم بكامل التفاصيل الفنية قريباً."}
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <span className="text-gray-700 font-medium">جودة عالية وضمان طويل الأمد</span>
                </div>
                <div className="flex items-center gap-3">
                  <Layers className="w-6 h-6 text-emerald-500" />
                  <span className="text-gray-700 font-medium">كفاءة في التغطية وتقليل الاستهلاك</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-emerald-500" />
                  <span className="text-gray-700 font-medium">متوفر بأحجام متنوعة (1 جالون، 5 جالون)</span>
                </div>
                
                {showStock && (
                  <div className="mt-4">
                    {Number(product.stock) <= 0 ? (
                      <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-xl text-sm font-bold font-arabic shadow-sm animate-pulse">
                        نفدت الكمية
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-600 rounded-xl text-sm font-bold font-arabic shadow-sm">
                        متوفر في المخزن
                      </span>
                    )}
                  </div>
                )}
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
