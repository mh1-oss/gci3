import { db } from "@/db";
import { quotes } from "@/db/schema";
import { Calculator, FileText, Plus, Trash2, Printer } from "lucide-react";
import { desc } from "drizzle-orm";
import Link from "next/link";
import DeleteQuoteButton from "@/components/admin/DeleteQuoteButton";

export const dynamic = "force-dynamic";

export default async function AdminAccountingPage() {
  const allQuotes = await db.select().from(quotes).orderBy(desc(quotes.createdAt));

  return (
    <div className="space-y-6 font-arabic">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-navy">نظام المحاسبة وعروض الأسعار</h2>
        <Link href="/admin/dashboard/accounting/new" className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-xl hover:bg-red-700 transition">
          <Plus className="w-5 h-5" />
          <span>إنشاء عرض سعر جديد</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">مجموع العروض الكلية</p>
            <p className="text-2xl font-bold text-brand-navy">{allQuotes.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-brand-navy">عروض الأسعار الحديثة</h3>
        </div>
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">المرجع</th>
              <th className="px-6 py-4 font-medium">اسم العميل</th>
              <th className="px-6 py-4 font-medium">رقم الهاتف</th>
              <th className="px-6 py-4 font-medium">تاريخ العرض</th>
              <th className="px-6 py-4 font-medium">المبلغ</th>
              <th className="px-6 py-4 font-medium">الحالة</th>
              <th className="px-6 py-4 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allQuotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">{quote.refNumber || "N/A"}</td>
                <td className="px-6 py-4 font-medium text-brand-navy">{quote.customerName}</td>
                <td className="px-6 py-4 text-gray-500" dir="ltr" style={{textAlign: "right"}}>{quote.phone || "-"}</td>
                <td className="px-6 py-4 text-gray-500">{quote.createdAt?.toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">${quote.totalAmount || "0"}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${quote.status === 'draft' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {quote.status === 'draft' ? 'مسودة' : (quote.status === 'sent' ? 'مرسل' : quote.status)}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <Link 
                    href={`/admin/dashboard/accounting/${quote.id}`}
                    className="text-gray-400 hover:text-brand-navy transition-colors p-1 rounded-lg hover:bg-gray-100"
                    title="عرض وطباعة"
                  >
                    <Printer className="w-5 h-5" />
                  </Link>
                  <DeleteQuoteButton id={quote.id} />
                </td>
              </tr>
            ))}
            {allQuotes.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">لم يتم إنشاء أي عروض أسعار بعد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
