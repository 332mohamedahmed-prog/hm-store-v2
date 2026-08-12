import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  images: string[];
  category?: { name: string; slug: string } | null;
}

function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.images && product.images.length > 0
    ? product.images[0]
    : "/images/placeholder-product.svg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-near-black/50 border border-warm-gold/10 hover:border-warm-gold/30 rounded-lg overflow-hidden transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-near-black/5 overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.comparePrice && (
          <span className="absolute top-2 right-2 bg-warm-gold text-near-black font-body text-[10px] font-medium px-2 py-0.5">
            خصم
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 md:p-4">
        {product.category && (
          <p className="font-body text-[10px] tracking-[0.15em] text-warm-gold/80 uppercase mb-1">
            {product.category.name}
          </p>
        )}
        <h3 className="font-heading text-base md:text-lg text-cream group-hover:text-warm-gold transition-colors line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-body text-sm font-medium text-cream">
            {product.price} ج.م
          </span>
          {product.comparePrice && (
            <span className="font-body text-xs text-cream/40 line-through">
              {product.comparePrice} ج.م
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProductsSection({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  viewAllHref: string;
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-body text-[11px] tracking-[0.3em] text-warm-gold/80 uppercase mb-2">
              {subtitle}
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream">
              {title}
            </h2>
            <div className="gold-divider max-w-32 mt-4" />
          </div>
          <Link
            href={viewAllHref}
            className="hidden sm:inline-flex items-center gap-1 text-warm-gold/70 hover:text-warm-gold font-body text-sm tracking-wide transition-colors"
          >
            عرض الكل
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-body text-cream/40 text-sm">
              لا توجد منتجات حالياً في هذا القسم
            </p>
          </div>
        )}

        {/* Mobile view all */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-warm-gold/70 hover:text-warm-gold font-body text-sm tracking-wide transition-colors"
          >
            عرض الكل
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
