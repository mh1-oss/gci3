"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Check, ChevronsUpDown, Search, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  id: string;
  name: string;
}

interface SearchableSelectProps {
  options: Option[];
  defaultValue?: string;
  name: string;
  label: string;
  placeholder?: string;
  allowCustom?: boolean;
  onCreateCustom?: (name: string) => Promise<Option | null>;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function SearchableSelect({
  options,
  defaultValue = "",
  name,
  label,
  placeholder = "ابحث...",
  allowCustom = false,
  onCreateCustom,
  required = false,
  disabled = false,
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [isCreating, setIsCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find the label for the current selected value
  const selectedLabel = useMemo(() => {
    return options.find((opt) => opt.id === selectedValue || opt.name === selectedValue)?.name || "";
  }, [options, selectedValue]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    // For categories, we might use name. For subsidiaries, we use ID.
    // The name of the input determines what gets sent.
    setSelectedValue(option.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleAddCustom = async () => {
    if (!searchTerm || !onCreateCustom) return;
    
    setIsCreating(true);
    try {
      const newOption = await onCreateCustom(searchTerm);
      if (newOption) {
        setSelectedValue(newOption.id);
        setIsOpen(false);
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Failed to create custom option:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={`space-y-2 relative ${className}`} ref={containerRef} dir="rtl">
      <label className="block text-sm font-bold text-gray-700">{label}</label>
      
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selectedValue} required={required} />

      {/* Main Trigger */}
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-4 py-2 border rounded-lg cursor-pointer transition-all
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white hover:border-brand-red'}
          ${isOpen ? 'border-brand-red ring-2 ring-brand-red/10' : 'border-gray-300'}
        `}
      >
        <span className={`font-bold truncate ${selectedLabel ? 'text-gray-900' : 'text-gray-400 font-medium'}`}>
          {selectedLabel || placeholder}
        </span>
        <div className="flex items-center gap-2">
          {selectedValue && !required && !disabled && (
            <X 
              className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedValue("");
              }}
            />
          )}
          <ChevronsUpDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100 flex items-center gap-2 sticky top-0 bg-white">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                autoFocus
                type="text"
                className="w-full text-sm outline-none font-bold text-gray-900 py-1"
                placeholder="ابحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <X 
                  className="w-4 h-4 text-gray-400 cursor-pointer" 
                  onClick={() => setSearchTerm("")} 
                />
              )}
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className={`
                      px-4 py-2.5 flex items-center justify-between cursor-pointer transition-colors
                      ${selectedValue === option.id ? 'bg-brand-red/5 text-brand-red' : 'hover:bg-gray-50 text-gray-700'}
                    `}
                  >
                    <span className="font-bold text-sm">{option.name}</span>
                    {selectedValue === option.id && <Check className="w-4 h-4" />}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                  لا توجد نتائج مطابقة
                </div>
              )}

              {/* Quick Add Custom Feature */}
              {allowCustom && searchTerm && !filteredOptions.find(o => o.name === searchTerm) && (
                <div 
                  onClick={handleAddCustom}
                  className="p-3 bg-gray-50 border-t border-gray-100 hover:bg-white cursor-pointer transition-all flex items-center gap-2 text-brand-navy"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold opacity-60">إضافة قسم جديد بأسم:</div>
                    <div className="text-sm font-black underline decoration-brand-red/30 underline-offset-4">{searchTerm}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
