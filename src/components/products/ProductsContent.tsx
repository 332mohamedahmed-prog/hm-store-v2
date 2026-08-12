"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  ArrowUpDown,
  ChevronLeft,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  isBestSeller: boolean | null;
  isNewArrival: boolean | null;
  avgRating: string;
  reviewCount: number;
  category: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const sortOptions = [
  { value: "newest", label: "الأحدث" },
  { value: "best-seller", label: "الأكثر مبيعاً" },
  { value: "new-arrival", label: "وصل حديثاً" },
  { value: "price-asc", label: "السعر: من الأقل للأعلى" },
  { value: "price-desc", label: "السعر: من الأعلى للأقل" },
];

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedSize, setSelectedSize] = useState(searchParams.get("size") || "");
  const [selectedColor, setSelectedColor] = useState(searchParams.get("color") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [showFilters, setShowFilters] = useState(false);

  const allSizes = [...new Set(products.flatMap((p) => p.sizes))];
  const allColors = [...new Set(products.flatMap((p) => p.colors))];

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);
      if (sort) params.set("sort", sort);
      if (search.trim()) params.set("search", search.trim());
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (selectedSize) params.set("size", selectedSize);
      if (selectedColor) params.set("color", selectedColor);
      params.set("limit", "50");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sort, search, minPrice, maxPrice, selectedSize, selectedColor]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (sort !== "newest") params.set("sort", sort);
    if (search.trim()) params.set("search", search.trim());
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (selectedSize) params.set("size", selectedSize);
    if (selectedColor) params.set("color", selectedColor);
    router.replace(`/products?${params}`, { scroll: false });
  }, [selectedCategory, sort, search, minPrice, maxPrice, selectedSize, selectedColor, router]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedSize("");
    setSelectedColor("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
  };

  const hasActiveFilters = selectedCategory || selectedSize || selectedColor || minPrice || maxPrice || search;

  return (
    <>
      <section className="bg-near-black py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-body text-[11px] tracking-[0.3em] text-warm-gold/80 uppercase mb-2">تسوقي الآن</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-cream">جميع المنتجات</h1>
          <div className="gold-divider max-w-32 mt-4" />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Top bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-gold/50" />
              <input
                type="text"
                placeholder="ابحثي بالاسم..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-near-black/50 border border-warm-gold/20 rounded-lg pr-10 pl-4 py-2.5 font-body text-sm text-cream placeholder:text-cream/30 outline-none focus:border-warm-gold/50 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-near-black/50 border border-warm-gold/20 rounded-lg py-2.5 pl-10 pr-4 font-body text-sm text-cream outline-none focus:border-warm-gold/50 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-gold/50 pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-near-black/50 border border-warm-gold/20 rounded-lg px-4 py-2.5 font-body text-sm text-cream hover:border-warm-gold/50 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              فلاتر
            </button>

            <span className="font-body text-xs text-cream/50">{total} منتج</span>
          </div>

          <div className="flex gap-8">
            {/* Filters sidebar */}
            <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0`}>
              <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-5 space-y-6 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg text-cream">فلاتر</h3>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="font-body text-xs text-warm-gold hover:text-gold-light transition-colors">مسح الكل</button>
                  )}
                </div>

                {/* Category */}
                <div>
                  <h4 className="font-body text-xs font-medium text-cream/60 uppercase tracking-wider mb-3">التصنيف</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`block w-full text-right font-body text-sm py-1 px-2 rounded transition-colors ${!selectedCategory ? "text-warm-gold bg-warm-gold/10" : "text-cream/70 hover:text-warm-gold"}`}
                    >الكل</button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug)}
                        className={`block w-full text-right font-body text-sm py-1 px-2 rounded transition-colors ${selectedCategory === cat.slug ? "text-warm-gold bg-warm-gold/10" : "text-cream/70 hover:text-warm-gold"}`}
                      >{cat.name}</button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                {allSizes.length > 0 && (
                  <div>
                    <h4 className="font-body text-xs font-medium text-cream/60 uppercase tracking-wider mb-3">المقاس</h4>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size === selectedSize ? "" : size)}
                          className={`font-body text-xs px-3 py-1.5 rounded border transition-all ${selectedSize === size ? "border-warm-gold bg-warm-gold/10 text-warm-gold" : "border-warm-gold/15 text-cream/60 hover:border-warm-gold/40"}`}
                        >{size}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color */}
                {allColors.length > 0 && (
                  <div>
                    <h4 className="font-body text-xs font-medium text-cream/60 uppercase tracking-wider mb-3">اللون</h4>
                    <div className="flex flex-wrap gap-2">
                      {allColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color === selectedColor ? "" : color)}
                          className={`font-body text-xs px-3 py-1.5 rounded border transition-all ${selectedColor === color ? "border-warm-gold bg-warm-gold/10 text-warm-gold" : "border-warm-gold/15 text-cream/60 hover:border-warm-gold/40"}`}
                        >{color}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price range */}
                <div>
                  <h4 className="font-body text-xs font-medium text-cream/60 uppercase tracking-wider mb-3">نطاق السعر (ج.م)</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="من"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-2 py-1.5 font-body text-xs text-cream outline-none focus:border-warm-gold/50"
                    />
                    <span className="text-cream/30">—</span>
                    <input
                      type="number"
                      placeholder="إلى"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-2 py-1.5 font-body text-xs text-cream outline-none focus:border-warm-gold/50"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Products grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-shimmer bg-near-black/50 rounded-lg aspect-[3/4]" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="font-body text-base text-cream/40">لا توجد منتجات مطابقة</p>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="mt-4 font-body text-sm text-warm-gold hover:text-gold-light transition-colors">مسح الفلاتر</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.images?.[0] || "/images/placeholder-product.svg";
  const rating = parseFloat(product.avgRating || "0");

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-near-black/50 border border-warm-gold/10 hover:border-warm-gold/30 rounded-lg overflow-hidden transition-all duration-300"
    >
      <div className="relative aspect-[3/4] bg-near-black/5 overflow-hidden">
        <img src={imageSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        {product.comparePrice && (
          <span className="absolute top-2 right-2 bg-warm-gold text-near-black font-body text-[10px] font-medium px-2 py-0.5">خصم</span>
        )}
        {product.isNewArrival && (
          <span className="absolute top-2 left-2 bg-dark-text text-cream font-body text-[10px] font-medium px-2 py-0.5">جديد</span>
        )}
      </div>
      <div className="p-3 md:p-4">
        {product.category && (
          <p className="font-body text-[10px] tracking-[0.15em] text-warm-gold/80 uppercase mb-1">{product.category.name}</p>
        )}
        <h3 className="font-heading text-base md:text-lg text-cream group-hover:text-warm-gold transition-colors line-clamp-2 leading-tight">{product.name}</h3>
        {rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.round(rating) ? "text-warm-gold fill-warm-gold" : "text-warm-gold/20"}`} />
            ))}
            <span className="font-body text-[10px] text-cream/40">({product.reviewCount})</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-body text-sm font-medium text-cream">{product.price} ج.م</span>
          {product.comparePrice && (
            <span className="font-body text-xs text-cream/40 line-through">{product.comparePrice} ج.م</span>
          )}
        </div>
      </div>
    </Link>
  );
}
