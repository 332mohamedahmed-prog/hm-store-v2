"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/components/CartProvider";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-near-black/95 backdrop-blur-md border-b border-warm-gold/20">
      {/* Top bar */}
      <div className="hidden md:block border-b border-warm-gold/10">
        <div className="mx-auto max-w-7xl px-6 py-1.5 flex items-center justify-between">
          <p className="text-[11px] tracking-[0.2em] text-cream/60 font-body">
            توصيل لجميع المحافظات
          </p>
          <p className="text-[11px] tracking-[0.2em] text-cream/60 font-body">
            المتجر رقم واحد للملابس الحريمي
          </p>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-heading text-3xl md:text-4xl font-bold text-warm-gold transition-colors group-hover:text-gold-light">
            HM
          </span>
          <span className="hidden sm:inline font-heading text-sm italic text-cream/70">
            أناقة المرأة
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm text-cream/80 hover:text-warm-gold transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-cream/70 hover:text-warm-gold transition-colors"
            aria-label="بحث"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/cart"
            className="text-cream/70 hover:text-warm-gold transition-colors relative"
            aria-label="السلة"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-2 -left-2 bg-warm-gold text-near-black font-body text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            className="text-cream/70 hover:text-warm-gold transition-colors"
            aria-label="حسابي"
          >
            <User className="h-5 w-5" />
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-cream/70 hover:text-warm-gold transition-colors"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-warm-gold/10 bg-near-black">
          <div className="mx-auto max-w-7xl px-6 py-3 flex items-center gap-3">
            <Search className="h-5 w-5 text-warm-gold" />
            <input
              type="text"
              placeholder="ابحث في المنتجات..."
              className="flex-1 bg-transparent text-cream placeholder:text-cream/40 font-body text-sm outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const q = (e.target as HTMLInputElement).value;
                  if (q.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(q.trim())}`;
                  }
                }
              }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-cream/50 hover:text-warm-gold text-sm font-body"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-warm-gold/10 bg-near-black">
          <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-body text-base text-cream/80 hover:text-warm-gold transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
