"use client";

import { Suspense, useState } from "react";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import { loginAdmin } from "@/app/admin/actions";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-brand-navy hover:bg-brand-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all cursor-pointer overflow-hidden font-arabic disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-brand-red/20"
    >
      <AnimatePresence mode="wait">
        {pending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري التحقق...</span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <span>دخول</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  
  const getErrorMessage = (code: string | null) => {
    if (code === "1") return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    if (code === "2") return "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى";
    if (code === "blocked") return "تم حظر محاولات الدخول مؤقتاً بكثرة المحاولات الخاطئة. يرجى المحاولة بعد قليل";
    if (code) return "حدث خطأ غير متوقع";
    return null;
  };

  const errorMessage = getErrorMessage(errorCode);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="bg-red-50 text-brand-red p-4 rounded-2xl text-center text-sm font-arabic font-bold border border-red-100 mb-6 flex items-center justify-center gap-2 overflow-hidden shadow-sm"
          >
            <div className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      <form className="space-y-6" action={loginAdmin}>
        <div className="space-y-5 font-arabic">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">البريد الإلكتروني</label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                required
                className="appearance-none block w-full pl-4 pr-12 py-4 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all sm:text-sm text-gray-900 placeholder:text-gray-400 font-medium"
                placeholder="example@agt-group.com"
                dir="ltr"
              />
              <Mail className="absolute right-4 top-4 h-6 w-6 text-gray-300 group-focus-within:text-brand-red transition-colors" />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">كلمة المرور</label>
            <div className="relative group">
              <input
                type="password"
                name="password"
                required
                className="appearance-none block w-full pl-4 pr-12 py-4 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all sm:text-sm text-gray-900 placeholder:text-gray-400 font-medium"
                placeholder="••••••••"
                dir="ltr"
              />
              <Lock className="absolute right-4 top-4 h-6 w-6 text-gray-300 group-focus-within:text-brand-red transition-colors" />
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="pt-2">
          <LoginButton />
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4 text-center">
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-brand-navy transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>العودة للموقع الرئيسي</span>
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
}

export default function AdminLogin() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfdfd] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-navy/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto w-20 h-20 bg-brand-navy rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-brand-navy/20 mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-500"
          >
            <Lock className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black text-brand-navy font-arabic tracking-tight"
          >
            مرحباً بك
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-gray-500 font-arabic font-medium"
          >
            سجل دخولك للوصول إلى لوحة التحكم
          </motion.p>
        </div>
        
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <Loader2 className="w-10 h-10 text-brand-navy animate-spin opacity-20" />
            <div className="text-gray-400 font-arabic font-bold text-sm">جاري التجهيز...</div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
