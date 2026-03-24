"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import CurrencySwitcher from "@/components/ui/CurrencySwitcher";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "الرئيسية", href: "/" },
    { name: "المنتجات", href: "/products" },
    { name: "المشاريع", href: "/projects" },
    { name: "اتصل بنا", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <Logo />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden min-[1001px]:flex items-center gap-4 font-arabic">
            <div className="flex items-center gap-2">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`min-w-[110px] text-center px-4 py-2 rounded-full text-base font-bold transition-all duration-300 ${
                    pathname === link.href
                      ? "text-white bg-brand-red shadow-md"
                      : "text-brand-navy hover:text-brand-red hover:bg-red-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <CurrencySwitcher />
          </div>

          {/* Mobile menu button & Currency Switcher */}
          <div className="min-[1001px]:hidden flex items-center gap-2">
            <CurrencySwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-navy hover:text-brand-red focus:outline-none p-2 rounded-md hover:bg-red-50 transition-colors z-50"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-[1001px]:hidden bg-white border-t border-gray-100 shadow-xl font-arabic absolute w-full overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2 shadow-inner bg-gray-50/50">
              {links.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-5 py-4 rounded-2xl text-lg font-bold transition-all ${
                      pathname === link.href
                        ? "text-white bg-brand-red shadow-lg shadow-brand-red/20 scale-[1.02]"
                        : "text-brand-navy hover:text-brand-red hover:bg-white hover:shadow-sm"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
