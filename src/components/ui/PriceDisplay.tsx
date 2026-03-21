"use client";

import { useCurrency } from "@/context/CurrencyContext";

export default function PriceDisplay({ 
  priceUSD, 
  className = "" 
}: { 
  priceUSD: string | null;
  className?: string;
}) {
  const { formatPrice } = useCurrency();
  
  const formatted = formatPrice(priceUSD);
  if (!formatted) return null;

  return (
    <div className={className}>
      {formatted}
    </div>
  );
}
