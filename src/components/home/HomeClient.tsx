"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, PaintBucket, Palette, Droplet, Shield, Building2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HomeClient({ subsidiaries = [] }: { subsidiaries?: any[] }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-brand-red/10 selection:text-brand-red rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-navy text-white min-h-[90vh] py-20 lg:py-28 flex items-center">
        {/* Abstract Paint Splatter Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 3, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
            className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-red rounded-full filter blur-[100px] opacity-70 transform-gpu"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
            className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-500 rounded-full filter blur-[100px] opacity-50 transform-gpu"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">

            {/* Hero Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="font-arabic space-y-8 text-center lg:text-right flex flex-col items-center lg:items-start"
              style={{ willChange: "transform, opacity" }}
            >
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                مجموعة الوليد للتجارة العامة (AGT)
              </motion.div>

              <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight drop-shadow-2xl transform-gpu">
                أضف الحياة لمشروعك مع <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-400">أصباغ مجموعة الوليد  </span>
              </motion.h1>

              <motion.p variants={fadeIn} className="text-xl text-gray-300 max-w-lg leading-relaxed font-light">
                نحن في مجموعة الوليد (AGT) نقدم لك تشكيلة واسعة من الألوان العصرية والدهانات المتطورة لتلبية كافة احتياجاتك الديكورية والصناعية.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start w-full">
                <Link
                  href="/products"
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-brand-red text-white rounded-lg text-lg font-bold hover:bg-red-700 transition-all shadow-[0_10px_30px_rgba(227,24,55,0.4)] hover:-translate-y-1 transform-gpu w-full sm:w-64"
                >
                  تصفح المنتجات
                  <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-lg text-lg font-bold hover:bg-white/20 transition-all backdrop-blur-sm hover:-translate-y-1 transform-gpu w-full sm:w-64"
                >
                  اطلب استشارة مجانية
                </Link>
              </motion.div>

              <motion.div variants={fadeIn} className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10 transform-gpu w-full">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">+38</div>
                  <div className="text-sm text-gray-400">عام من الخبرة</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">10k+</div>
                  <div className="text-sm text-gray-400">عميل سعيد</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">500+</div>
                  <div className="text-sm text-gray-400">درجة لونية</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Visual Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative hidden lg:block h-[600px] transform-gpu"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-md mx-auto text-right">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-red to-orange-400 rounded-[2.5rem] transform rotate-3 shadow-2xl opacity-80 backdrop-blur-xl"></div>
                  <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] transform -rotate-3 border border-white/20 glass shadow-2xl overflow-hidden flex flex-col backdrop-blur-md font-arabic">
                    <div className="p-10 border-b border-white/10 flex-grow font-arabic">
                      <div className="flex justify-end mb-8">
                        <Palette className="w-14 h-14 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">تكنولوجيا الألوان الذكية</h3>
                      <p className="text-gray-200 text-lg leading-relaxed mb-8 opacity-80">ابتكارات مجموعة AGT توفر لك ألواناً تدوم طويلاً ومقاومة للبكتيريا والعوامل الجوية المتغيرة.</p>
                      <ul className="space-y-4">
                        {["مقاومة فائقة للرطوبة", "قابلية للغسل بامتياز", "تغطية ممتازة من الوجه الأول"].map((feature, i) => (
                          <li key={i} className="flex items-center justify-end gap-3 text-white text-md">
                            {feature}
                            <div className="w-6 h-6 rounded-full bg-brand-red/20 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-brand-red" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="h-40 bg-gradient-to-r from-brand-red via-red-500 to-red-400 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                      <Droplet className="absolute bottom-[-10px] left-8 w-24 h-24 text-white opacity-20 transform rotate-12 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-32 bg-brand-light relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20 font-arabic"
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-bold text-brand-navy mb-6">تشكيلة الأصباغ المميزة</motion.h2>
            <motion.div variants={fadeIn} className="w-32 h-1.5 bg-brand-red mx-auto rounded-full mb-8"></motion.div>
            <motion.p variants={fadeIn} className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              حلول متكاملة لجميع احتياجات الطلاء والديكور من مجموعة AGT، مصممة بأعلى معايير الجودة العالمية ومواكبة لأحدث صيحات الموضة.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { title: "أصباغ داخلية", desc: "ألوان دافئة وعصرية تضفي جاذبية لغرفتك وقابلة للغسيل.", icon: Palette, color: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 shadow-orange-500/10" },
              { title: "أصباغ خارجية", desc: "حماية فائقة لواجهات المباني ضد أصعب الظروف المناخية.", icon: Shield, color: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 shadow-blue-500/10" },
              { title: "دهانات صناعية", desc: "حلول تقنية للمصانع والمنشآت المتخصصة تقاوم التآكل.", icon: PaintBucket, color: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 shadow-amber-500/10" },
              { title: "عوازل مقاومة", desc: "مواد عزل متطورة لمنع تسرب المياه والرطوبة بفاعلية دائمية.", icon: Droplet, color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 shadow-emerald-500/10" }
            ].map((cat, i) => (
              <motion.div
                variants={fadeIn}
                key={i}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-3xl p-8 shadow-xl shadow-brand-navy/5 hover:shadow-2xl transition-all duration-500 border border-gray-100 group cursor-pointer transform-gpu text-right"
                style={{ willChange: "transform, opacity" }}
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 shadow-lg ${cat.color} group-hover:text-white group-hover:scale-110 mr-0 ml-auto`}>
                  <cat.icon className="w-10 h-10 transform-gpu" />
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-4 font-arabic">{cat.title}</h3>
                <p className="text-gray-500 font-arabic mb-8 text-sm leading-relaxed opacity-90">{cat.desc}</p>
                <Link
                  href={`/products?category=${encodeURIComponent(cat.title)}`}
                  className="text-brand-navy font-bold font-arabic inline-flex items-center gap-3 group-hover:text-brand-red transition-colors text-lg"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
                  اكتشف المزيد
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NEW Subsidiaries Section - More Prominent Style */}
      {subsidiaries.length > 0 && (
        <section className="py-24 bg-white relative overflow-hidden font-arabic border-t border-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold text-brand-navy mb-4 tracking-tight">شركاؤنا وعلاماتنا التجارية</motion.h2>
              <motion.div variants={fadeIn} className="w-24 h-1 bg-brand-red mx-auto rounded-full mb-6" />
              <motion.p variants={fadeIn} className="text-gray-500 text-lg max-w-2xl mx-auto">نفخر بكوننا الوكيل والمنصة الأساسية لأبرز الماركات العالمية في العراق.</motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex flex-wrap gap-8 items-center justify-center auto-rows-fr"
            >
              {subsidiaries.map((sub, i) => (
                <motion.div 
                  key={sub.id}
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  className="w-full max-w-[240px]"
                >
                  <Link 
                    href={`/products?subsidiary=${sub.id}`}
                    className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-red/10 transition-all duration-300 text-center flex flex-col items-center justify-center gap-4 h-56 w-full transform-gpu"
                  >
                    <div className="w-full h-24 relative flex items-center justify-center md:grayscale group-hover:grayscale-0 transition-all duration-500">
                      {sub.logoUrl ? (
                        <img src={sub.logoUrl} alt={sub.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <Building2 className="w-12 h-12 text-gray-200" />
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-gray-400 group-hover:text-brand-navy transition-colors">{sub.name}</span>
                      {sub.description && (
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 max-w-[180px] leading-relaxed">
                          {sub.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
              
            </motion.div>
            
            <div className="mt-12 text-center">
               <Link href="/products" className="inline-flex items-center gap-2 text-brand-navy font-bold hover:text-brand-red transition-all group">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  اكتشف منتجات جميع العلامات التجارية
               </Link>
            </div>
          </div>
        </section>
      )}

      {/* Modern CTA */}
      <section className="relative py-32 bg-brand-navy overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red rounded-full filter blur-[150px] opacity-20 transform-gpu" style={{ willChange: "transform" }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-[150px] opacity-20 transform-gpu" style={{ willChange: "transform" }}></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white font-arabic"
          style={{ willChange: "transform, opacity" }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-8 mt-4 leading-tight transform-gpu">جاهز لتحويل مساحتك؟</h2>
          <p className="text-xl md:text-2xl mb-12 text-blue-100/80 max-w-3xl mx-auto font-light leading-relaxed">
            تواصل مع خبرائنا في مجموعة AGT اليوم للحصول على استشارة مجانية وعرض سعر مخصص لمتطلبات مشروعك بأفضل جودة وأنسب سعر.
          </p>
          <Link
            href="/contact"
            className="inline-flex justify-center items-center px-12 py-5 bg-brand-red text-white rounded-2xl text-2xl font-bold hover:bg-black transition-all shadow-[0_20px_50px_rgba(227,24,55,0.4)] hover:shadow-none hover:-translate-y-2 transform-gpu"
          >
            تواصل معنا الآن <ArrowLeft className="w-6 h-6 mr-4" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
