"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, Package, Printer, Save, CheckCircle2 } from "lucide-react";
import { createQuote } from "@/app/admin/actions";
import { useTransition } from "react";

export default function POSInvoiceForm({ products }: { products: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    projectName: ""
  });

  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [tempInvoiceId, setTempInvoiceId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  useEffect(() => {
    setMounted(true);
    setTempInvoiceId(`INV-${Math.floor(Math.random() * 9000) + 1000}`);
    setInvoiceDate(new Date().toLocaleDateString());
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addItem = (product: any) => {
    const existingIndex = items.findIndex(item => item.productId === product.id);
    if (existingIndex > -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      newItems[existingIndex].total = (Number(newItems[existingIndex].quantity) * Number(product.price)).toFixed(2);
      setItems(newItems);
    } else {
      setItems([...items, {
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        total: product.price
      }]);
    }
    setSearchTerm("");
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, qty: number) => {
    if (qty < 1) return;
    const newItems = [...items];
    newItems[index].quantity = qty;
    newItems[index].total = (Number(qty) * Number(newItems[index].price)).toFixed(2);
    setItems(newItems);
  };

  const totalAmount = items.reduce((acc, item) => acc + Number(item.total), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert("يرجى إضافة منتجات للفاتورة");

    const formData = new FormData();
    formData.append("customerName", customer.name);
    formData.append("phone", customer.phone);
    formData.append("email", customer.email);
    formData.append("projectName", customer.projectName);
    formData.append("totalAmount", totalAmount.toString());
    formData.append("items", JSON.stringify(items));

    startTransition(async () => {
      await createQuote(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setItems([]);
      setCustomer({ name: "", phone: "", email: "", projectName: "" });
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return <div className="min-h-[400px] bg-white rounded-2xl animate-pulse" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-arabic print:block">

      {/* Product Selection (Left/Main) */}
      <div className="lg:col-span-2 space-y-6 print:hidden">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن منتج بالاسم أو القسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-red outline-none transition text-gray-900 placeholder:text-gray-400"
              />

              {searchTerm && filteredProducts.length > 0 && (
                <div className="absolute top-full right-0 left-0 bg-white border border-gray-100 mt-2 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => addItem(product)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition text-right"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <img src={product.imageUrl || "/images/product.png"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-brand-navy">{product.title}</div>
                          <div className="text-xs text-gray-500">{product.category}</div>
                        </div>
                      </div>
                      <div className="text-left font-bold text-emerald-600">${product.price}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selection Grid (Product Gallery) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-brand-navy flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  اختيار سريع للمنتجات
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-1 custom-scrollbar">
                {products.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addItem(product)}
                    className="flex flex-col items-center bg-gray-50 p-3 rounded-xl border border-transparent hover:border-brand-red hover:bg-white hover:shadow-md transition text-center group"
                  >
                    <div className="w-full aspect-square bg-white rounded-lg overflow-hidden mb-2 border border-gray-100 group-hover:border-transparent">
                      <img src={product.imageUrl || "/images/product.png"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs font-bold text-brand-navy line-clamp-1 mb-1">{product.title}</div>
                    <div className="text-[10px] font-bold text-emerald-600">${product.price}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h3 className="font-bold text-brand-navy border-b pb-2 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-red" />
              المواد المضافة حالياً
            </h3>
            {items.length === 0 ? (
              <div className="py-12 text-center text-gray-300">لم يتم اختيار أي مواد بعد</div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, index) => (
                  <div key={index} className="py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-brand-navy">{item.title}</div>
                      <div className="text-xs text-gray-400">${item.price} للوحدة</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button onClick={() => updateQuantity(index, item.quantity - 1)} className="px-3 py-1 hover:bg-brand-red hover:text-white transition text-gray-600 border-l border-gray-200">-</button>
                        <span className="px-3 py-1 bg-white font-bold text-sm min-w-[30px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, item.quantity + 1)} className="px-3 py-1 hover:bg-brand-red hover:text-white transition text-gray-600 border-r border-gray-200">+</button>
                      </div>
                      <div className="w-20 text-left font-bold text-brand-navy text-sm">${item.total}</div>
                      <button onClick={() => removeItem(index)} className="p-2 text-gray-300 hover:text-brand-red transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar (Customer & Total) */}
      <div className="lg:col-span-1 space-y-6 print:block">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 print:p-0 print:border-0 print:shadow-none">
          <div className="print:hidden">
            <h3 className="font-bold text-xl text-brand-navy mb-4">بيانات العميل</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="اسم العميل"
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-brand-red text-gray-900 placeholder:text-gray-400"
                value={customer.name}
                onChange={e => setCustomer({ ...customer, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="رقم الهاتف"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-brand-red text-gray-900 placeholder:text-gray-400"
                value={customer.phone}
                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="اسم المشروع / ملاحظات"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-brand-red text-gray-900 placeholder:text-gray-400"
                value={customer.projectName}
                onChange={e => setCustomer({ ...customer, projectName: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-brand-navy text-white p-6 rounded-2xl space-y-4 print:bg-white print:text-brand-navy print:border-2 print:border-brand-navy print:p-8">
            <h4 className="text-sm font-medium opacity-80 print:opacity-100 print:text-xl print:font-bold">ملخص الفاتورة</h4>
            <div className="flex justify-between items-center border-b border-white/10 pb-4 print:border-brand-navy">
              <span className="opacity-80">المجموع الكلي</span>
              <span className="text-3xl font-bold">${totalAmount.toFixed(2)}</span>
            </div>

            <div className="flex gap-2 print:hidden">
              <button
                type="submit"
                disabled={isPending || items.length === 0}
                className="flex-1 bg-brand-red hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? 'جاري الحفظ...' : (
                  <>
                    <Save className="w-5 h-5" />
                    حفظ الفاتورة
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>

            {showSuccess && (
              <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg text-sm text-center font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                تم الحفظ بنجاح
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="print-section hidden print:block overflow-hidden bg-white">
        <div className="flex justify-between items-start border-b-2 border-brand-navy pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-brand-navy mb-2">فاتورة مبيعات</h1>
            <p className="text-gray-500 uppercase tracking-widest">Sales Invoice</p>
          </div>
          <div className="text-left font-sans">
            <div className="text-brand-red text-4xl font-bold">GCI</div>
            <div className="text-brand-navy font-bold">PAINTS شركة أصباغ</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h4 className="text-gray-400 text-sm mb-2 uppercase">فاتورة إلى | Bill To</h4>
            <div className="text-xl font-bold text-brand-navy">{customer.name || '-'}</div>
            <div className="text-gray-600">{customer.phone || '-'}</div>
            <div className="text-gray-600">{customer.projectName || '-'}</div>
          </div>
          <div className="text-left">
            <h4 className="text-gray-400 text-sm mb-2 uppercase">تفاصيل | Details</h4>
            <div className="text-brand-navy font-medium">الرقم: {tempInvoiceId}</div>
            <div className="text-brand-navy font-medium">التاريخ: {invoiceDate}</div>
          </div>
        </div>

        <table className="w-full mb-12 border-collapse">
          <thead>
            <tr className="bg-brand-navy text-white text-right">
              <th className="p-4 rounded-r-xl">المنتج</th>
              <th className="p-4">الكمية</th>
              <th className="p-4">سعر الوحدة</th>
              <th className="p-4 rounded-l-xl text-left">المجموع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, i) => (
              <tr key={i} className="text-right">
                <td className="p-4 font-bold">{item.title}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">${item.price}</td>
                <td className="p-4 text-left font-bold">${item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end pt-8 border-t-2 border-brand-navy">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-gray-500">
              <span>المجموع الفرعي:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-brand-navy">
              <span>الإجمالي:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center text-sm text-gray-400 border-t pt-8">
          شكراً لتعاملكم مع شركة أصباغ GCI
        </div>
      </div>

    </div>
  );
}
