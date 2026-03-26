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
- **Database Service**: Vercel Postgres / Neon.
- **ORM**: [Drizzle ORM](https://orm.drizzle.team).
- **Styling**: Tailwind CSS & Vanilla CSS.
- **Animations**: [Framer Motion](https://www.framer.com/motion/).
- **Icons**: Lucide React.

## 🚀 التشغيل المحلي (Getting Started)

### 1. المتطلبات (Prerequisites)
- [Node.js](https://nodejs.org/) الإصدار 18 أو أحدث.
- قاعدة بيانات Postgres (يمكن استخدام Vercel Postgres).

### 2. التثبيت (Installation)
قم بتثبيت الحزم البرمجية:
```bash
npm install
```

### 3. إعداد البيئة (Environment Setup)
قم بإنشاء ملف `.env.local` في الجذر وأضف بيانات قاعدة البيانات:
```env
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
```

### 4. تشغيل خادم التطوير (Development Server)
```bash
npm run dev
```
افتح [http://localhost:3000](http://localhost:3000) لمشاهدة الموقع.

## 📁 هيكلية الملفات المهمة (Key File Structure)

- `src/app`: بنية الصفحات (App Router).
- `src/proxy.ts`: خادم الوكيل (Proxy) المسؤول عن حماية المسارات (بديل Middleware).
- `src/db`: إعدادات ومخططات قاعدة البيانات (Drizzle Schema).
- `src/components/admin`: مكونات لوحة التحكم.
- `src/components/home`: مكونات الصفحة الرئيسية (Hero, Partners, Stats).

## 📝 ملاحظات تقنية (Technical Notes)

- **Proxy Convention**: يستخدم هذا المشروع اتفاقية `src/proxy.ts` بدلاً من `middleware.ts` وفقاً لتحديثات Next.js 16. ويعمل هذا الملف على بيئة Node.js Runtime لضمان التوافقية الكاملة.
- **Database singleton**: يتم جلب إعدادات الموقع `siteSettings` من خلال ID ثابت وهو `main`.

---
تم التطوير بواسطة **Antigravity AI Agent** كجزء من تطوير مجموعة الوليد للتجارة العامة.
