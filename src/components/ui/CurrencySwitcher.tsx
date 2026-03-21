"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { DollarSign, Landmark } from "lucide-react";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
      <button
        onClick={() => setCurrency("USD")}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
          currency === "USD" 
            ? "bg-white text-brand-navy shadow-sm" 
            : "text-gray-500 hover:text-brand-navy"
        }`}
      >
        <DollarSign className="w-3 h-3" />
        <span>USD</span>
      </button>
      <button
        onClick={() => setCurrency("IQD")}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
          currency === "IQD" 
            ? "bg-white text-brand-navy shadow-sm" 
            : "text-gray-500 hover:text-brand-navy"
        }`}
      >
        <Landmark className="w-3 h-3" />
        <span>IQD</span>
      </button>
    </div>
  );
}
