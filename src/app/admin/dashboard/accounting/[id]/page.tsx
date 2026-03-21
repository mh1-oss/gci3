import { db } from "@/db";
import { quotes, quoteItems, siteSettings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import QuoteActions from "@/components/admin/QuoteActions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuoteViewPage({ params }: PageProps) {
  const { id: quoteId } = await params;

  if (!quoteId) notFound();

  const [quote] = await db.select().from(quotes).where(eq(quotes.id, quoteId));
  if (!quote) notFound();

  const allItems = await db.select().from(quoteItems).where(eq(quoteItems.quoteId, quoteId));
  const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, "main"));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-arabic px-4" dir="rtl">

      {/* Top Actions (Hidden on Print) */}
      <QuoteActions />

      {/* Invoice Document Card */}
      <div className="bg-white p-6 md:p-12 rounded-3xl shadow-xl border border-gray-100 print:shadow-none print:p-0 print:border-0 relative overflow-hidden" id="printable-invoice">
        {/* Subtle Brand Accent */}
        <div className="absolute top-0 right-0 w-full h-2 bg-brand-red"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold font-sans text-brand-red">GCI</span>
              <span className="text-2xl font-bold text-brand-navy">للأصباغ والديكور</span>
            </div>
            <div className="space-y-2 text-gray-500 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand-red bg-red-50 p-1 rounded" />
                <span>{settings?.address || "العنوان غير محدد"}</span>
              </div>
              <div className="flex items-center gap-3 font-sans" dir="ltr">
                <Phone className="w-5 h-5 text-brand-red bg-red-50 p-1 rounded" />
                <span>{settings?.phone || "+123 456 789"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-red bg-red-50 p-1 rounded" />
                <span className="font-sans">{settings?.email || "info@gcipaints.com"}</span>
              </div>
            </div>
          </div>

          <div className="text-right space-y-2 bg-brand-navy p-6 rounded-2xl text-white min-w-[200px]">
            <h1 className="text-2xl font-black uppercase tracking-tighter border-b border-white/20 pb-2">فاتورة عرض سعر</h1>
            <div className="pt-2">
              <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">الرقم المرجعي</div>
              <div className="font-bold font-mono text-xl">#{quote.refNumber || "N/A"}</div>
            </div>
            <div className="pt-2">
              <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">تاريخ الإصدار</div>
              <div className="font-bold">{new Date(quote.quoteDate || "").toLocaleDateString('ar-EG')}</div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-12" />

        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 border-r-2 border-brand-red pr-3">موجه إلى السيد/السادة</h4>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-brand-navy">{quote.customerName}</div>
              {quote.projectName && <div className="text-gray-600 bg-gray-50 px-3 py-1 rounded inline-block">مشروع: {quote.projectName}</div>}
              {quote.phone && <div className="text-gray-500 font-mono mt-2" dir="ltr">{quote.phone}</div>}
              {quote.email && <div className="text-gray-500">{quote.email}</div>}
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 ring-4 ring-gray-100 flex flex-col justify-center">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">ملخص الحساب</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                <span className="text-gray-500">حالة العرض:</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase ring-2 ring-emerald-50">
                  {quote.status === 'sent' ? 'مرسل (Sent)' : (quote.status === 'draft' ? 'مسودة (Draft)' : quote.status)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-800 font-bold text-lg">المجموع الكلي:</span>
                <span className="text-4xl font-black text-brand-navy leading-none font-sans">
                  ${Number(quote.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-gray-100">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 font-bold text-xs uppercase text-gray-600">المادة / الخدمات</th>
                <th className="px-6 py-4 font-bold text-xs uppercase text-gray-600 text-center">الكمية</th>
                <th className="px-6 py-4 font-bold text-xs uppercase text-gray-600 text-center">السعر</th>
                <th className="px-6 py-4 font-bold text-xs uppercase text-gray-600 text-left">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-6 max-w-[300px]">
                    <div className="font-bold text-brand-navy text-lg">{item.description}</div>
                    {item.notes && <div className="text-xs text-brand-red mt-2 bg-red-50/50 p-2 rounded border border-red-100/50">{item.notes}</div>}
                  </td>
                  <td className="px-6 py-6 text-center font-mono text-gray-600 text-lg">
                    {Number(item.quantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-6 text-center font-mono text-gray-600 text-lg">
                    ${Number(item.unitPrice).toLocaleString()}
                  </td>
                  <td className="px-6 py-6 text-left font-black text-brand-navy text-xl font-sans">
                    ${Number(item.totalPrice).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="space-y-8">
            {quote.notes && (
              <div className="bg-brand-navy/5 p-8 rounded-2xl border border-brand-navy/10 relative">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-navy text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold">ملاحظات</div>
                <p className="text-sm text-brand-navy leading-relaxed italic">{quote.notes}</p>
              </div>
            )}

            <div className="text-xs text-gray-400 p-4 border border-dashed border-gray-200 rounded-xl leading-relaxed">
              <p>1. الأسعار سارية لمدة 15 يوماً من تاريخ الإصدار.</p>
              <p>2. يتم توريد المواد خلال 48 ساعة من تاريخ الطلب.</p>
              <p>3. يتم الدفع نقداً أو بموجب صك مصدق.</p>
            </div>
          </div>

          <div className="space-y-3 bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div className="flex justify-between items-center px-4 text-gray-500 text-sm">
              <span>المجموع الفرعي:</span>
              <span className="font-mono text-lg">${Number(quote.totalAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center px-4 text-gray-500 text-sm pb-4 border-b border-gray-200">
              <span>الضريبة المضافة:</span>
              <span className="font-mono text-lg">$0.00</span>
            </div>
            <div className="flex justify-between items-center text-brand-navy pt-2">
              <span className="text-xl font-bold">المجموع الكلي النهائي:</span>
              <span className="text-5xl font-black font-sans">${Number(quote.totalAmount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="mt-24 grid grid-cols-2 gap-24">
          <div className="text-center">
            <div className="h-20 border-b border-gray-300 w-full mb-4"></div>
            <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">توقيع العميل</div>
          </div>
          <div className="text-center">
            <div className="h-20 border-b border-gray-300 w-full mb-4 flex items-center justify-center">
              <div className="font-sans text-brand-red opacity-10 text-4xl rotate-12 -translate-y-2 pointer-events-none select-none">GCI PAINTS</div>
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">ختم وتوقيع الشركة</div>
          </div>
        </div>

        {/* System Stamp */}
        <div className="mt-24 pt-8 border-t border-gray-100 text-center text-gray-300 text-[10px]">
          <p>أصدرت هذه الفاتورة إلكترونياً ولا تتطلب توقيعاً رسمياً في حال وجود الختم الإلكتروني.</p>
          <p className="mt-2 uppercase tracking-[0.5em] font-bold">PROFESSIONAL ERP | AXIS-GCI v2.0</p>
        </div>
      </div>
    </div>
  );
}
