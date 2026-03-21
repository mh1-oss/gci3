"use client";

import { Trash2, X, Check } from "lucide-react";
import { deleteQuote } from "@/app/admin/actions";
import { useState, useTransition } from "react";

export default function DeleteQuoteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteQuote(id);
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors font-bold text-xs flex items-center gap-1"
        >
          <Check className="w-3 h-3" />
          تأكيد
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      disabled={isPending}
      className={`p-2 transition-colors ${isPending ? 'text-gray-300' : 'text-gray-400 hover:text-red-500'}`}
      title="حذف عرض السعر"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
