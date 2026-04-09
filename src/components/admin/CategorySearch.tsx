"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface CategorySearchProps {
  defaultValue?: string;
}

export default function CategorySearch({ defaultValue = "" }: CategorySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState(defaultValue);
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSearch = params.get("search") || "";
    
    if (query === currentSearch) return;

    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, [query, router, searchParams]);

  return (
    <div className="relative w-full max-w-xs" dir="rtl">
      <input 
        type="text" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ابحث عن قسم..."
        className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy font-arabic text-right text-gray-900 placeholder:text-gray-400"
      />
      <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
    </div>
  );
}
