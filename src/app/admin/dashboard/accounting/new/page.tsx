export const dynamic = "force-dynamic";

import { db } from "@/db";
import { products } from "@/db/schema";
import POSInvoiceForm from "@/components/admin/POSInvoiceForm";

export default async function NewInvoicePage() {
  const allProducts = await db.select().from(products);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-brand-navy font-arabic">إنشاء فاتورة جديدة</h2>
      </div>
      
      <POSInvoiceForm products={allProducts} />
    </div>
  );
}
