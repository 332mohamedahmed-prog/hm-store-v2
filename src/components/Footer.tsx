import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" },
];

const categoryLinks = [
  { href: "/products?category=abayat", label: "عبايات" },
  { href: "/products?category=lingerie", label: "هدوم داخلية" },
  { href: "/products?category=nightwear", label: "قمصان نوم" },
  { href: "/products?category=bags", label: "شنط" },
  { href: "/products?category=kids", label: "هدوم أطفال" },
  { href: "/products?category=carpets", label: "سجاد" },
  { href: "/products?category=school-bags", label: "شنط مدارس" },
  { href: "/products?category=school-wear", label: "ملابس مدارس" },
  { href: "/products?category=swimwear", label: "مايوهات" },
];

export default function Footer() {
  return (
    <footer className="bg-near-black border-t border-warm-gold/20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-heading text-3xl font-bold text-warm-gold">HM</span>
            </Link>
            <p className="font-heading text-sm italic text-cream/60 leading-relaxed">
              أناقة المرأة العربية
            </p>
            <p className="font-body text-xs text-cream/40 mt-3 leading-relaxed">
              متخصصون في الملابس الحريمي الفاخرة — عبايات، قمصان نوم، شنط، والمزيد.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg text-cream mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream/50 hover:text-warm-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-lg text-cream mb-4">الأقسام</h3>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-cream/50 hover:text-warm-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg text-cream mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-cream/50 font-body text-sm">
                <Mail className="h-4 w-4 text-warm-gold shrink-0" />
                <span>info@hm-store.com</span>
              </li>
              <li className="flex items-center gap-2 text-cream/50 font-body text-sm">
                <Phone className="h-4 w-4 text-warm-gold shrink-0" />
                <span>+20 121 487 1459</span>
              </li>
              <li className="flex items-center gap-2 text-cream/50 font-body text-sm">
                <MapPin className="h-4 w-4 text-warm-gold shrink-0" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="gold-divider my-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-cream/30">
            © {new Date().getFullYear()} HM — جميع الحقوق محفوظة
          </p>
          <p className="font-body text-[10px] tracking-[0.15em] text-cream/20 uppercase">
            Elegant Women&apos;s Fashion
          </p>
        </div>
      </div>
    </footer>
  );
}
