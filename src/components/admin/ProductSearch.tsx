"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface ProductSearchProps {
  defaultValue?: string;
}

export default function ProductSearch({ defaultValue = "" }: ProductSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState(defaultValue);
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSearch = searchParams.get("search") || "";
    
    // Only push if the query has actually changed relative to the URL
    if (query === currentSearch) return;

    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, [query, router, searchParams]);

  return (
    <div className="relative w-full max-w-md" dir="rtl">
      <input 
        type="text" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ابحث عن منتج بالاسم أو الوصف..." 
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy font-arabic text-right text-gray-900 placeholder:text-gray-400"
      />
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
    </div>
  );
}
