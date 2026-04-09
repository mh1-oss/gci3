"use client";

import { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import { updateCategory } from "@/app/admin/actions";
import { toast } from "sonner";

interface EditCategoryButtonProps {
  id: string;
  initialName: string;
}

export default function EditCategoryButton({ id, initialName }: EditCategoryButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("الاسم لا يمكن أن يكون فارغاً");
      return;
    }
    if (name === initialName) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      const result = await updateCategory(id, formData);
      
      if (result.success) {
        toast.success("تم تحديث القسم بنجاح");
        setIsEditing(false);
      } else {
        toast.error("فشل تحديث القسم");
      }
    } catch (error) {
      toast.error("حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2" dir="rtl">
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-2 py-1 border border-brand-navy rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-navy font-arabic"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUpdate();
            if (e.key === "Escape") {
              setName(initialName);
              setIsEditing(false);
            }
          }}
        />
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
          title="حفظ"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setName(initialName);
            setIsEditing(false);
          }}
          disabled={loading}
          className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
          title="إلغاء"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 group">
      <span className="font-medium text-brand-navy">{initialName}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1.5 text-gray-400 hover:text-brand-navy hover:bg-gray-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        title="تعديل الاسم"
      >
        <Edit2 className="w-4 h-4" />
      </button>
    </div>
  );
}
