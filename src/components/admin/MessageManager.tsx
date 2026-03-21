"use client";

import { useState } from "react";
import { MessageSquare, Mail, Phone, Clock, User, Trash2, Send, CheckCircle2, Inbox } from "lucide-react";
import { markMessageAsReplied, deleteRepliedMessages } from "@/app/admin/actions";
import { useTransition } from "react";
import DeleteMessageButton from "./DeleteMessageButton";

export default function MessageManager({ initialMessages }: { initialMessages: any[] }) {
  const [activeTab, setActiveTab] = useState<"new" | "replied">("new");
  const [isPending, startTransition] = useTransition();

  const newMessages = initialMessages.filter(m => m.replied !== "true");
  const repliedMessages = initialMessages.filter(m => m.replied === "true");

  const displayedMessages = activeTab === "new" ? newMessages : repliedMessages;

  const handleReplyClick = (id: string, type: 'whatsapp' | 'email', contact: string, name: string) => {
    // Mark as replied when user clicks reply
    startTransition(() => markMessageAsReplied(id));
    
    if (type === 'whatsapp') {
      const phone = contact.replace(/\D/g, ''); // Basic wash
      const text = encodeURIComponent(`مرحباً ${name}، بخصوص استفسارك في شركة أصباغ GCI:`);
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    } else {
      const subject = encodeURIComponent("بخصوص استفسارك - شركة أصباغ GCI");
      window.location.href = `mailto:${contact}?subject=${subject}`;
    }
  };

  const handleDeleteReplied = () => {
    if (confirm("هل أنت متأكد من حذف جميع الرسائل المردود عليها؟")) {
      startTransition(() => deleteRepliedMessages());
    }
  };

  return (
    <div className="space-y-6 font-arabic h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab("new")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl font-bold transition-all text-sm sm:text-base ${
              activeTab === "new" 
                ? "bg-brand-red text-white shadow-md" 
                : "text-gray-400 hover:text-brand-navy hover:bg-gray-50"
            }`}
          >
             جديدة ({newMessages.length})
          </button>
          <button 
            onClick={() => setActiveTab("replied")}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-xl font-bold transition-all text-sm sm:text-base ${
              activeTab === "replied" 
                ? "bg-brand-navy text-white shadow-md" 
                : "text-gray-400 hover:text-brand-navy hover:bg-gray-50"
            }`}
          >
             تم الرد ({repliedMessages.length})
          </button>
        </div>

        {activeTab === "replied" && repliedMessages.length > 0 && (
          <button 
            onClick={handleDeleteReplied}
            disabled={isPending}
            className="flex items-center justify-center gap-2 text-brand-red hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-bold text-sm w-full sm:w-auto mt-2 sm:mt-0"
          >
            <Trash2 className="w-4 h-4" />
            حذف الكل المردود عليه
          </button>
        )}
      </div>

      {displayedMessages.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 pb-20 sm:pb-0">
          {displayedMessages.map((msg) => (
            <div key={msg.id} className={`bg-white p-5 sm:p-6 rounded-3xl shadow-sm border ${activeTab === 'new' ? 'border-gray-100' : 'border-emerald-100 bg-emerald-50/10'} space-y-4 hover:shadow-md transition-all`}>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shrink-0 flex items-center justify-center ${activeTab === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <User className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg sm:text-xl text-brand-navy truncate">{msg.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500">
                       <div className="flex items-center gap-1 min-w-0">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{msg.email}</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span>{msg.phone || "بدون رقم"}</span>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                   {activeTab === 'new' ? (
                     <div className="flex gap-2 w-full sm:w-auto">
                       <button 
                        onClick={() => handleReplyClick(msg.id, 'whatsapp', msg.phone, msg.name)}
                        className="flex-1 sm:flex-none p-2.5 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2 font-bold text-sm"
                       >
                         <MessageSquare className="w-4 h-4" />
                         <span className="hidden xs:inline">واتساب</span>
                       </button>
                       <button 
                        onClick={() => handleReplyClick(msg.id, 'email', msg.email, msg.name)}
                        className="flex-1 sm:flex-none p-2.5 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 font-bold text-sm"
                       >
                         <Mail className="w-4 h-4" />
                         <span className="hidden xs:inline">إيميل</span>
                       </button>
                     </div>
                   ) : (
                     <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                         تم الرد
                     </div>
                   )}
                   <DeleteMessageButton id={msg.id} />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-1 h-full bg-brand-navy/10 group-hover:bg-brand-red transition-colors" />
                  <div className="font-bold text-brand-navy mb-2 block text-sm opacity-60">محتوى الرسالة:</div>
                  <p className="text-gray-700 leading-relaxed font-medium text-sm sm:text-base">
                    {msg.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-gray-100 text-[10px] sm:text-xs text-gray-400 gap-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(msg.createdAt).toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short' })}</span>
                </div>
                <div className="flex items-center gap-1 font-bold">
                  <span>الموضوع:</span>
                  <span className="text-brand-navy">{msg.subject || "عام"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-grow flex items-center justify-center min-h-[400px]">
          <div className="text-center p-8 max-w-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-12 h-12 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">
              {activeTab === 'new' ? 'لا توجد رسائل جديدة' : 'لا توجد رسائل مردود عليها'}
            </h3>
            <p className="text-gray-500 text-sm">
               {activeTab === 'new' ? 'لقد قمت بالرد على جميع الرسائل، عمل رائع!' : 'الرسائل التي تقوم بالرد عليها ستظهر هنا لاحقاً.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
