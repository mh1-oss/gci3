# مجموعة الوليد للتجارة العامة (AGT Group)

موقع إلكتروني متكامل لمجموعة الوليد للتجارة العامة، متخصص في عرض المنتجات والأصباغ (National Paints & GCI Paints) وإدارة الشركات التابعة من خلال لوحة تحكم إدارية متطورة.

## ✨ المميزات الرئيسية (Key Features)

- **إدارة الشركات التابعة (Subsidiary Management)**: نظام CRUD متكامل لإدارة الشركات التابعة، مع إمكانية ربط المنتجات بكل شركة وعرض شعاراتها في الصفحة الرئيسية.
- **كتالوج المنتجات (Product Catalog)**: عرض المنتجات مع فلاتر ذكية تعتمد على العلامة التجارية (الشركة التابعة) والتصنيفات.
- **لوحة تحكم المشرف (Admin Dashboard)**:
  - إدارة المنتجات (إضافة، تعديل، حذف).
  - إدارة الشركات والشركاء.
  - التحكم في إعدادات الموقع (إظهار/إخفاء الأسعار، حالة الكمية).
  - إدارة الرسائل الواردة من صفحة التواصل.
- **تصميم عصري ومتجاوب (Modern Responsive UI)**: استخدام Framer Motion للأنيميشن وTailwind CSS للتصميم المتوافق مع الهواتف والأجهزة اللوحية (RTL Support).
- **نظام الوصول (Security)**: حماية لوحة التحكم باستخدام نظام Proxy (Middleware سابقاً) لضمان الخصوصية.

## 🛠 التقنيات المستخدمة (Tech Stack)

- **Framework**: [Next.js 16.2.1 (Turbopack)](https://nextjs.org) - النسخة الأحدث والأسرع.
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev) - تأمين لوحة التحكم بنظام الأدوار (RBAC).
- **Storage**: [Cloudflare R2](https://www.cloudflare.com/products/r2/) - لتخزين الصور والملفات بشكل سحابي وآمن.
- **Database Service**: Vercel Postgres / Neon.
- **ORM**: [Drizzle ORM](https://orm.drizzle.team).
- **Styling**: Tailwind CSS & Vanilla CSS.
- **Animations**: [Framer Motion](https://www.framer.com/motion/).
- **Icons**: Lucide React.

## 🚀 التشغيل المحلي (Getting Started)

### 1. المتطلبات (Prerequisites)
- [Node.js](https://nodejs.org/) الإصدار 18 أو أحدث.
- حساب Cloudflare R2 (اختياري، للرفع السحابي).

### 2. التثبيت (Installation)
```bash
npm install
```

### 3. إعداد البيئة (Environment Setup)
قم بإنشاء ملف `.env.local` وأضف المتغيرات التالية:
```env
# Database
DATABASE_URL="your_postgresql_url"

# Authentication
AUTH_SECRET="random_secret_here"
ADMIN_EMAIL="admin@gtc-group.net"
ADMIN_PASSWORD="secure_password"

# Cloudflare R2
R2_ACCOUNT_ID="your_id"
R2_ACCESS_KEY_ID="your_access_key"
R2_SECRET_ACCESS_KEY="your_secret_key"
R2_BUCKET_NAME="agt-group"
R2_PUBLIC_URL="https://pub-xxx.r2.dev"
```

### 4. تهيئة الحساب الإداري (Initialize Admin)
يجب تشغيل سكريبت التهيئة لإنشاء أول حساب مدير في قاعدة البيانات:
```bash
npx -y tsx src/db/seed-admin.ts
```

### 5. تشغيل خادم التطوير (Development Server)
```bash
npm run dev
```

## 📁 ملاحظات هامة (Important Notes)

- **نظام الحماية (RBAC)**: تم حماية جميع العمليات الحساسة (إضافة، تعديل، حذف) من خلال فحص الصلاحيات داخل Server Actions.
- **إدارة الوسائط (Latest Input Wins)**: تدعم لوحة التحكم رفع الملفات مباشرة إلى Cloudflare R2 أو كتابة روابط يدوية. النظام يعتمد دائماً على آخر مدخل قمت بإضافته، ويقوم بمسح الملفات القديمة من السحابة تلقائياً عند استبدالها.
- **Proxy Convention**: تم استخدام `src/proxy.ts` لتأمين المسارات وفق معايير Next.js 16.

---
تم التطوير بواسطة **Antigravity AI Agent** كجزء من تطوير مجموعة الوليد للتجارة العامة وتحويلها إلى منصة تجارية متكاملة.
