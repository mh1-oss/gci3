"use client";

import { useState, useRef, useEffect } from "react";
import { ImageIcon, Link as LinkIcon, X } from "lucide-react";

interface ImagePreviewProps {
  initialUrl: string | null;
  name: string;
  folder: string;
  label: string;
  helperText?: string;
}

export default function ImagePreview({ initialUrl, name, label, helperText }: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewUrl(e.target.value);
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const idSuffix = name.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="space-y-3">
      <label htmlFor={`${idSuffix}-url`} className="block text-sm font-bold text-gray-700 text-right cursor-pointer">{label}</label>
      
      {previewUrl ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-h-full object-contain p-2"
            onError={() => setPreviewUrl("/images/product-placeholder.png")}
          />
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-md text-[10px] text-gray-600 border border-gray-100 font-bold">
            معاينة
          </div>
        </div>
      ) : (
        <div className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
          <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
          <p className="text-xs">لا توجد صورة المختارة</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="relative">
          <label htmlFor={`${idSuffix}-url`} className="sr-only">رابط الصورة {label}</label>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <LinkIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            id={`${idSuffix}-url`}
            name={`${name}Url`}
            defaultValue={initialUrl || ""} 
            onChange={handleUrlChange}
            placeholder="رابط الصورة يدوياً..."
            className="w-full pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red outline-none transition text-left text-gray-900 text-sm placeholder:text-gray-400"
            dir="ltr" 
          />
        </div>
        
        <div className="relative flex items-center gap-2">
          <label htmlFor={`${idSuffix}-file`} className="sr-only">رفع ملف {label}</label>
          <input 
            type="file" 
            id={`${idSuffix}-file`}
            name={`${name}File`}
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*" 
            className="flex-1 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-navy/5 file:text-brand-navy hover:file:bg-brand-navy/10 transition-all cursor-pointer" 
          />
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(initialUrl);
              if (fileInputRef.current) fileInputRef.current.value = "";
              const urlInput = document.getElementsByName(`${name}Url`)[0] as HTMLInputElement;
              if (urlInput) urlInput.value = initialUrl || "";
            }}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="إعادة تعيين"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {helperText && <p className="text-[10px] text-gray-400 mt-1 text-right">{helperText}</p>}
      </div>
    </div>
  );
}
