"use client";

import Link from "next/link";

/* ─── Gradient SVG Icons (أسود ← ذهبي) ─────────────────────────── */
const gradId = "hm-grad";

function GradDefs() {
  return (
    <defs>
      <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1A1A1A" />
        <stop offset="100%" stopColor="#C9A227" />
      </linearGradient>
    </defs>
  );
}

const stroke = `url(#${gradId})`;
const fill = `url(#${gradId})`;

const icons: Record<string, React.ReactNode> = {
  // عبايات
  abayat: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <GradDefs />
      <path d="M32 8C26 8 18 14 14 22C10 30 10 44 12 56H52C54 44 54 30 50 22C46 14 38 8 32 8Z" fill={fill} opacity="0.12" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M26 56C26 56 29 48 32 48C35 48 38 56 38 56" stroke={stroke} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M22 16C26 14 29 13 32 13C35 13 38 14 42 16" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M20 30C20 30 24 28 32 28C40 28 44 30 44 30" stroke={stroke} strokeWidth="0.8" strokeLinecap="round" opacity="0.3" strokeDasharray="2 2"/>
    </svg>
  ),

  // هدوم داخلية
  lingerie: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <GradDefs />
      <path d="M20 18C20 18 16 14 22 12C28 10 36 10 42 12C48 14 44 18 44 18" stroke={stroke} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M20 18C20 18 22 26 26 28C28 29 30 29 32 29C34 29 36 29 38 28C42 26 44 18 44 18" fill={fill} opacity="0.12" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M22 18L18 10" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <path d="M42 18L46 10" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <path d="M22 34C22 34 26 32 32 32C38 32 42 34 42 34L40 50C40 50 36 52 32 52C28 52 24 50 24 50L22 34Z" fill={fill} opacity="0.08" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),

  // قمصان نوم
  nightwear: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <GradDefs />
      <path d="M24 10L20 14L14 18L18 20L24 16L26 14H38L40 16L46 20L50 18L44 14L40 10" fill={fill} opacity="0.1" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M26 14C26 14 24 20 24 28C24 36 24 46 26 54H38C40 46 40 36 40 28C40 20 38 14 38 14" fill={fill} opacity="0.1" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M14 18L12 28L18 26L18 20" stroke={stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M50 18L52 28L46 26L46 20" stroke={stroke} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30 20L32 17L34 20" stroke={stroke} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      <path d="M26 54V58" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <path d="M38 54V58" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),

  // شنط
  bags: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <GradDefs />
      <path d="M10 24H54V50C54 53 52 56 49 56H15C12 56 10 53 10 50V24Z" fill={fill} opacity="0.1" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M20 24V18C20 12 24 8 32 8C40 8 44 12 44 18V24" stroke={stroke} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M10 24C10 24 16 30 32 30C48 30 54 24 54 24" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <circle cx="32" cy="38" r="4" stroke={stroke} strokeWidth="1" opacity="0.6"/>
      <line x1="32" y1="34" x2="32" y2="42" stroke={stroke} strokeWidth="0.8" opacity="0.4"/>
    </svg>
  ),

  // هدوم أطفال
  kids: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <GradDefs />
      <circle cx="32" cy="12" r="6" fill={fill} opacity="0.08" stroke={stroke} strokeWidth="1.2"/>
      <path d="M26 18C26 18 22 20 18 24L14 22L16 26C16 26 22 28 26 26L24 44L20 54H28L32 48L36 54H44L40 44L38 26C42 28 48 26 48 26L50 22L46 24C46 24 42 20 38 18" fill={fill} opacity="0.1" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M30 18L32 22L34 18" stroke={stroke} strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),

  // سجاد
  carpets: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <GradDefs />
      <rect x="8" y="12" width="48" height="40" rx="2" fill={fill} opacity="0.08" stroke={stroke} strokeWidth="1.2"/>
      <rect x="14" y="18" width="36" height="28" rx="1" stroke={stroke} strokeWidth="0.8" opacity="0.5"/>
      <rect x="20" y="24" width="24" height="16" rx="1" stroke={stroke} strokeWidth="0.6" opacity="0.3"/>
      <path d="M26 28L32 24L38 28L32 32Z" stroke={stroke} strokeWidth="0.8" opacity="0.5"/>
      <circle cx="32" cy="28" r="2" stroke={stroke} strokeWidth="0.6" opacity="0.4"/>
      <path d="M8 12L12 8" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <path d="M56 12L52 8" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <path d="M8 52L12 56" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <path d="M56 52L52 56" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),

  // شنط مدارس
  "school-bags": (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <GradDefs />
      <rect x="14" y="20" width="36" height="36" rx="4" fill={fill} opacity="0.1" stroke={stroke} strokeWidth="1.2"/>
      <path d="M22 20V16C22 10 26 6 32 6C38 6 42 10 42 16V20" stroke={stroke} strokeWidth="1.2" strokeLinecap="round"/>
      <rect x="24" y="26" width="16" height="10" rx="2" stroke={stroke} strokeWidth="1" opacity="0.6"/>
      <line x1="32" y1="36" x2="32" y2="46" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M14 32H10C9 32 8 33 8 34V38C8 39 9 40 10 40H14" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M50 32H54C55 32 56 33 56 34V38C56 39 55 40 54 40H50" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),

  // ملابس مدارس
  "school-wear": (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <GradDefs />
      <path d="M26 10H38L36 14H28L26 10Z" fill={fill} opacity="0.12" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M28 14L22 18L16 16L18 22L24 20V50C24 50 28 52 32 52C36 52 40 50 40 50V20L46 22L48 16L42 18L36 14" fill={fill} opacity="0.1" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M32 14V28" stroke={stroke} strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2"/>
      <circle cx="32" cy="20" r="1" fill={fill} opacity="0.5"/>
      <circle cx="32" cy="25" r="1" fill={fill} opacity="0.5"/>
      <path d="M32 52V56" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),

  // مايوهات
  swimwear: (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
      <GradDefs />
      <path d="M24 14C24 14 20 12 22 18C22 18 26 22 32 22C38 22 42 18 42 18C44 12 40 14 40 14" fill={fill} opacity="0.12" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M24 14L20 10" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <path d="M40 14L44 10" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      <path d="M22 34C22 34 26 30 32 30C38 30 42 34 42 34L40 48C40 48 36 50 32 50C28 50 24 48 24 48L22 34Z" fill={fill} opacity="0.1" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M26 34L28 30" stroke={stroke} strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
      <path d="M38 34L36 30" stroke={stroke} strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
};

const defaultCategories = [
  { name: "عبايات", slug: "abayat" },
  { name: "هدوم داخلية", slug: "lingerie" },
  { name: "قمصان نوم", slug: "nightwear" },
  { name: "شنط", slug: "bags" },
  { name: "هدوم أطفال", slug: "kids" },
  { name: "سجاد", slug: "carpets" },
  { name: "شنط مدارس", slug: "school-bags" },
  { name: "ملابس مدارس", slug: "school-wear" },
  { name: "مايوهات", slug: "swimwear" },
];

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoriesSection({ categories }: { categories?: Category[] }) {
  const displayCategories = categories && categories.length > 0
    ? categories.map((c) => ({
        name: c.name,
        slug: c.slug,
      }))
    : defaultCategories;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-body text-[11px] tracking-[0.3em] text-warm-gold/80 uppercase mb-2">
            تسوقي حسب القسم
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream">
            أقسامنا
          </h2>
          <div className="gold-divider max-w-32 mx-auto mt-4" />
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 md:gap-6">
          {displayCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-4 p-5 md:p-6 rounded-lg bg-dark-bg/60 hover:bg-warm-gold/10 border border-warm-gold/15 hover:border-warm-gold/50 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 group-hover:scale-110 transition-transform duration-300">
                {icons[cat.slug] ?? icons.abayat}
              </div>
              <span className="font-body text-xs md:text-sm text-cream/70 group-hover:text-warm-gold transition-colors text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
