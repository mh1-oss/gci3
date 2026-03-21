"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, PaintBucket, Palette, Droplet, Shield } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-navy text-white min-h-[90vh] py-20 lg:py-28 flex items-center">
        {/* Abstract Paint Splatter Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
            className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-red rounded-full filter blur-3xl opacity-70"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
            className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-500 rounded-full filter blur-3xl opacity-50"
          />
          <motion.div 
            animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
            className="absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] bg-brand-red rounded-full filter blur-3xl opacity-60"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
            
            {/* Hero Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="font-arabic space-y-8"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                ألوان تدوم طويلاً
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight drop-shadow-lg">
                أضف الحياة لجدرانك مع <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-400">أصباغنا</span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-xl text-gray-300 max-w-lg leading-relaxed font-light">
                نقدم لك تشكيلة واسعة من الألوان العصرية والدهانات المتطورة لتلبية كافة احتياجاتك الديكورية والصناعية بأعلى معايير الجودة.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/products" 
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-brand-red text-white rounded-lg text-lg font-bold hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(227,24,55,0.4)]"
                >
                  تصفح المنتجات
                  <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-lg text-lg font-bold hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  اطلب استشارة مجانية
                </Link>
              </motion.div>

              <motion.div variants={fadeIn} className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">+25</div>
                  <div className="text-sm text-gray-400">عام من الخبرة</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">10k+</div>
                  <div className="text-sm text-gray-400">عميل سعيد</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">500+</div>
                  <div className="text-sm text-gray-400">درجة لونية</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Visual/Image Side */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block h-[600px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-red to-orange-400 rounded-3xl transform rotate-3 shadow-2xl opacity-80 backdrop-blur-xl"></div>
                  <div className="absolute inset-0 bg-white/10 rounded-3xl transform -rotate-3 border border-white/20 glass shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-white/10 flex-grow font-arabic">
                      <Palette className="w-12 h-12 text-white mb-6" />
                      <h3 className="text-2xl font-bold text-white mb-2">تكنولوجيا الألوان الذكية</h3>
                      <p className="text-gray-200 text-sm leading-relaxed mb-6">ابتكارات GCI توفر لك ألواناً تدوم طويلاً ومقاومة للبكتيريا والعوامل الجوية المتغيرة.</p>
                      <ul className="space-y-3">
                        {["مقاومة فائقة للرطوبة", "قابلية للغسل بامتياز", "تغطية ممتازة من الوجه الأول"].map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-white text-sm">
                            <CheckCircle2 className="w-4 h-4 text-brand-red" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-brand-red via-red-500 to-red-400 relative overflow-hidden">
                       <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}></div>
                       <Droplet className="absolute bottom-[-10px] right-8 w-24 h-24 text-white opacity-20 transform -rotate-12 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-brand-light relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16 font-arabic"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold text-brand-navy mb-4">تشكيلة الأصباغ المميزة</motion.h2>
            <motion.div variants={fadeIn} className="w-24 h-1 bg-brand-red mx-auto rounded-full mb-6"></motion.div>
            <motion.p variants={fadeIn} className="text-gray-600 max-w-2xl mx-auto text-lg">حلول متكاملة لجميع احتياجات الطلاء والديكور، مصممة بأعلى معايير الجودة العالمية.</motion.p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { title: "أصباغ داخلية", desc: "ألوان دافئة وعصرية تضفي جاذبية لغرفتك وقابلة للغسيل.", icon: Palette, color: "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white" },
              { title: "أصباغ خارجية", desc: "حماية فائقة لواجهات المباني ضد أصعب الظروف المناخية.", icon: Shield, color: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" },
              { title: "دهانات صناعية", desc: "حلول تقنية للمصانع والمنشآت المتخصصة تقاوم التآكل.", icon: PaintBucket, color: "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white" },
              { title: "عوازل مقاومة", desc: "مواد عزل متطورة لمنع تسرب المياه والرطوبة.", icon: Droplet, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white" }
            ].map((cat, i) => (
              <motion.div 
                variants={fadeIn}
                key={i} 
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${cat.color}`}>
                  <cat.icon className="w-8 h-8 transform group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3 font-arabic">{cat.title}</h3>
                <p className="text-gray-600 font-arabic mb-6 text-sm leading-relaxed">{cat.desc}</p>
                <Link 
                  href={`/products?category=${encodeURIComponent(cat.title)}`}
                  className="text-brand-navy font-bold font-arabic inline-flex items-center gap-2 group-hover:text-brand-red transition-colors"
                >
                  اكتشف المزيد <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="relative py-24 bg-brand-navy overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red rounded-full filter blur-3xl opacity-50 animate-blob" style={{ willChange: "transform" }}></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000" style={{ willChange: "transform" }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white font-arabic"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 mt-4">جاهز لتحويل مساحتك؟</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            تواصل مع خبرائنا اليوم للحصول على استشارة مجانية وعرض سعر مخصص لمتطلبات مشروعك.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex justify-center items-center px-10 py-4 bg-brand-red text-white rounded-xl text-xl font-bold hover:bg-red-700 shadow-[0_10px_30px_rgba(227,24,55,0.4)] hover:shadow-[0_10px_40px_rgba(227,24,55,0.6)] hover:-translate-y-1 transition-all"
          >
            تواصل معنا الآن <ArrowLeft className="w-5 h-5 mr-3 rtl:rotate-180" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
