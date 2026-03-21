import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { getSettings } from "@/app/admin/actions";

export default async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8 border-t-[8px] border-brand-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 font-arabic">
          
          <div className="col-span-1 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Logo />
          </Link>
          <p className="text-gray-400 leading-relaxed font-arabic mb-6 max-w-md">
              رواد صناعة الأصباغ والديكور في المنطقة. نقدم أحدث التقنيات وأجود أنواع الطلاء لجميع احتياجاتك.
          </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-100">روابط سريعة</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-brand-red transition-colors">من نحن</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-brand-red transition-colors">منتجاتنا</Link></li>
              <li><Link href="/projects" className="text-gray-400 hover:text-brand-red transition-colors">مشاريعنا</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-brand-red transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-100">خدماتنا</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-brand-red transition-colors">أصباغ داخلية</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-brand-red transition-colors">أصباغ خارجية</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-brand-red transition-colors">دهانات صناعية</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-brand-red transition-colors">استشارات الألوان</Link></li>
          </ul>
        </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-100">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-red shrink-0" />
                <span className="text-gray-400">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-red shrink-0" />
                <span className="text-gray-400" dir="ltr">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-red shrink-0" />
                <span className="text-gray-400" dir="ltr">{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            )}
            {settings.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {settings.companyName}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
