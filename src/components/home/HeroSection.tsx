import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[70vh] md:min-h-[85vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/7816722/pexels-photo-7816722.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
          alt="HM — أناقة المرأة"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-near-black/70" />
        {/* Subtle gradient from right (RTL) for text area */}
        <div className="absolute inset-0 bg-gradient-to-l from-near-black/90 via-near-black/50 to-transparent" />
      </div>

      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(201,162,39,0.1) 35px, rgba(201,162,39,0.1) 36px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-32 lg:py-40 w-full">
        <div className="max-w-2xl">
          {/* Tagline */}
          <p className="font-body text-[11px] tracking-[0.3em] text-warm-gold/80 uppercase mb-4">
            أناقة • فخامة • أصالة
          </p>

          {/* Main heading */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-6">
            اكتشفي أناقة <span className="text-warm-gold">الملاية</span> العربية
          </h1>

          {/* Subtitle */}
          <p className="font-heading text-lg md:text-xl italic text-cream/70 leading-relaxed mb-8">
            عبايات فاخرة، قمصان نوم أنيقة، وكل ما تحتاجينه من ملابس حريمي
            بأجود الخامات وأرقى التصاميم
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-warm-gold text-near-black px-8 py-3 font-body text-sm font-medium tracking-wide hover:bg-gold-light transition-colors duration-300"
            >
              تسوقي الآن
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-warm-gold/40 text-warm-gold px-8 py-3 font-body text-sm tracking-wide hover:border-warm-gold hover:bg-warm-gold/10 transition-all duration-300"
            >
              تعرفي علينا
            </Link>
          </div>
        </div>

        {/* Decorative gold line */}
        <div className="absolute top-1/2 right-0 w-24 h-px bg-gradient-to-l from-warm-gold/40 to-transparent hidden lg:block" />
      </div>
    </section>
  );
}
