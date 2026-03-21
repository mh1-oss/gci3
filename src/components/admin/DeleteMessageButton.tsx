"use client";

import { Trash2, X, Check } from "lucide-react";
import { deleteMessage } from "@/app/admin/actions";
import { useState, useTransition } from "react";

export default function DeleteMessageButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteMessage(id);
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 bg-red-50 p-2 rounded-xl border border-red-100 animate-in fade-in zoom-in duration-200">
        <span className="text-xs font-bold text-red-600 mr-2 border-r border-red-100 pr-2">هل أنت متأكد؟</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-1 px-3 bg-red-600 text-white rounded-lg text-xs font-bold transition-all hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "جاري الحذف..." : "نعم، حذف"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
