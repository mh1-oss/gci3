"use client";

import { Printer, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function QuoteActions() {
  return (
    <div className="flex items-center justify-between print:hidden">
      <Link 
        href="/admin/dashboard/accounting"
        className="flex items-center gap-2 text-gray-500 hover:text-brand-navy transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
      >
        <ArrowRight className="w-5 h-5" />
        <span className="font-bold">العودة للمحاسبة</span>
      </Link>
      
      <div className="flex gap-3">
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-navy text-white rounded-xl hover:bg-opacity-90 transition-all shadow-lg font-bold"
        >
          <Printer className="w-5 h-5" />
          <span>طباعة هذه الفاتورة</span>
        </button>
      </div>
    </div>
  );
}
