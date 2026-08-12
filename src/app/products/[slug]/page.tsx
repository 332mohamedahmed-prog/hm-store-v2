"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  ChevronRight,
  Send,
} from "lucide-react";
import { addToCart } from "@/lib/cart";
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/wishlist";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  material: string | null;
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

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [inWish, setInWish] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Review form
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setProductReviews(data.reviews || []);
          setRelated(data.related || []);
          if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
          if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0]);
          setInWish(isInWishlist(data.product.id));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-near-black/40 flex items-center justify-center">
        <div className="animate-shimmer w-32 h-8 rounded bg-near-black/50" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-near-black/40 flex flex-col items-center justify-center gap-4">
        <p className="font-heading text-2xl text-cream">المنتج غير موجود</p>
        <Link href="/products" className="font-body text-sm text-warm-gold hover:text-gold-light transition-colors">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  const rating = parseFloat(product.avgRating || "0");
  const imageSrc = product.images?.[selectedImage] || "/images/placeholder-product.svg";

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) return;
    if (!selectedColor && product.colors.length > 0) return;
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      image: product.images?.[0] || "",
      size: selectedSize,
      color: selectedColor,
    }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    if (inWish) {
      removeFromWishlist(product.id);
      setInWish(false);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images?.[0] || "",
      });
      setInWish(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewName.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setProductReviews([newReview, ...productReviews]);
        setReviewName("");
        setReviewRating(5);
        setReviewComment("");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-near-black border-b border-warm-gold/10">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center gap-2 font-body text-xs text-cream/50">
          <Link href="/" className="hover:text-warm-gold transition-colors">الرئيسية</Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/products" className="hover:text-warm-gold transition-colors">المنتجات</Link>
          {product.category && (
            <>
              <ChevronLeft className="h-3 w-3" />
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-warm-gold transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronLeft className="h-3 w-3" />
          <span className="text-cream/80">{product.name}</span>
        </div>
      </div>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-[3/4] bg-near-black/50 rounded-lg overflow-hidden border border-warm-gold/10 mb-4">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition-all ${selectedImage === i ? "border-warm-gold" : "border-warm-gold/10 hover:border-warm-gold/30"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {product.category && (
                <p className="font-body text-[11px] tracking-[0.2em] text-warm-gold uppercase mb-2">
                  {product.category.name}
                </p>
              )}
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-cream mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(rating) ? "text-warm-gold fill-warm-gold" : "text-warm-gold/20"}`}
                  />
                ))}
                <span className="font-body text-sm text-cream/50">
                  ({product.reviewCount} تقييم)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="font-body text-2xl font-bold text-cream">
                  {product.price} ج.م
                </span>
                {product.comparePrice && (
                  <span className="font-body text-base text-cream/40 line-through">
                    {product.comparePrice} ج.م
                  </span>
                )}
              </div>

              <div className="gold-divider mb-6" />

              {/* Description */}
              {product.description && (
                <p className="font-body text-sm text-cream/70 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Material */}
              {product.material && (
                <p className="font-body text-sm text-cream/60 mb-6">
                  <span className="font-medium text-cream/80">الخامة:</span> {product.material}
                </p>
              )}

              {/* Size selector */}
              {product.sizes.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-body text-sm font-medium text-cream/80 mb-2">
                    المقاس: <span className="text-warm-gold">{selectedSize}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`font-body text-sm px-4 py-2 rounded border transition-all ${selectedSize === size ? "border-warm-gold bg-warm-gold/10 text-warm-gold" : "border-warm-gold/15 text-cream/60 hover:border-warm-gold/40"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selector */}
              {product.colors.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-body text-sm font-medium text-cream/80 mb-2">
                    اللون: <span className="text-warm-gold">{selectedColor}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`font-body text-sm px-4 py-2 rounded border transition-all ${selectedColor === color ? "border-warm-gold bg-warm-gold/10 text-warm-gold" : "border-warm-gold/15 text-cream/60 hover:border-warm-gold/40"}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-body text-sm font-medium text-cream/80 mb-2">الكمية</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-warm-gold/20 rounded hover:border-warm-gold/50 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-cream/60" />
                  </button>
                  <span className="font-body text-lg font-medium text-cream w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border border-warm-gold/20 rounded hover:border-warm-gold/50 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-cream/60" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-warm-gold text-near-black py-3 font-body text-sm font-medium tracking-wide hover:bg-gold-light transition-colors"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {addedToCart ? "تمت الإضافة ✓" : "أضف للسلة"}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`flex items-center justify-center gap-2 border px-6 py-3 font-body text-sm tracking-wide transition-all ${inWish ? "border-warm-gold bg-warm-gold/10 text-warm-gold" : "border-warm-gold/30 text-warm-gold/70 hover:border-warm-gold hover:text-warm-gold"}`}
                >
                  <Heart className={`h-5 w-5 ${inWish ? "fill-warm-gold" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <div className="gold-divider mb-10" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-cream mb-6">
              التقييمات والمراجعات
            </h2>

            {/* Write review */}
            <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-6 mb-8">
              <h3 className="font-heading text-lg text-cream mb-4">أضيفي تقييمك</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-body text-xs text-cream/60 mb-1 block">الاسم</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50"
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-cream/60 mb-1 block">التقييم</label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} onClick={() => setReviewRating(i + 1)}>
                        <Star className={`h-6 w-6 ${i < reviewRating ? "text-warm-gold fill-warm-gold" : "text-warm-gold/20"} transition-colors`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs text-cream/60 mb-1 block">التعليق</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50 resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !reviewName.trim()}
                  className="bg-warm-gold text-near-black px-6 py-2 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
                >
                  {submittingReview ? "جاري الإرسال..." : "إرسال التقييم"}
                </button>
              </div>
            </div>

            {/* Reviews list */}
            {productReviews.length > 0 ? (
              <div className="space-y-4">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-body text-sm font-medium text-cream">{rev.customerName}</span>
                      <span className="font-body text-xs text-cream/40">
                        {new Date(rev.createdAt).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < rev.rating ? "text-warm-gold fill-warm-gold" : "text-warm-gold/20"}`} />
                      ))}
                    </div>
                    {rev.comment && (
                      <p className="font-body text-sm text-cream/70 leading-relaxed">{rev.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm text-cream/40">لا توجد تقييمات بعد — كوني أول من يقيّم!</p>
            )}
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-16">
              <div className="gold-divider mb-10" />
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-cream mb-6">
                منتجات ذات صلة
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="group bg-near-black/50 border border-warm-gold/10 hover:border-warm-gold/30 rounded-lg overflow-hidden transition-all duration-300"
                  >
                    <div className="aspect-[3/4] bg-near-black/5 overflow-hidden">
                      <img
                        src={p.images?.[0] || "/images/placeholder-product.svg"}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-heading text-sm md:text-base text-cream group-hover:text-warm-gold transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <span className="font-body text-sm font-medium text-cream">{p.price} ج.م</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
