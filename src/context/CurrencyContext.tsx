"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "IQD";

interface CurrencyContextType {
  currency: Currency;
  exchangeRate: number;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceUSD: number | string | null) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ 
  children, 
  initialExchangeRate 
}: { 
  children: React.ReactNode;
  initialExchangeRate: number;
}) {
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_currency") as Currency;
    if (saved) setCurrency(saved);
  }, []);

  const handleSetCurrency = (curr: Currency) => {
    setCurrency(curr);
    localStorage.setItem("preferred_currency", curr);
  };

  const formatPrice = (priceUSD: number | string | null) => {
    const numericPrice = typeof priceUSD === "string" ? parseFloat(priceUSD) : priceUSD;
    if (numericPrice === null || isNaN(numericPrice) || numericPrice === 0) return "";

    if (currency === "USD") {
      return `$${numericPrice.toFixed(2)}`;
    } else {
      const iqdPrice = numericPrice * initialExchangeRate;
      return `${iqdPrice.toLocaleString()} د.ع`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      exchangeRate: initialExchangeRate, 
      setCurrency: handleSetCurrency, 
      formatPrice 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
