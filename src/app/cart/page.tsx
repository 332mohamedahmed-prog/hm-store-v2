"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Plus, Minus, Tag, ChevronLeft, Check } from "lucide-react";
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal, type CartItem } from "@/lib/cart";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { refresh } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponPercent, setCouponPercent] = useState(0);

  useEffect(() => {
    const cart = getCart();
    setItems(cart);
    setSubtotal(getCartTotal(cart));
  }, []);

  const handleRemove = (productId: string, size: string, color: string) => {
    const updated = removeFromCart(productId, size, color);
    setItems([...updated]);
    setSubtotal(getCartTotal(updated));
    refresh();
  };

  const handleUpdateQty = (productId: string, size: string, color: string, qty: number) => {
    if (qty < 1) return;
    const updated = updateQuantity(productId, size, color, qty);
    setItems([...updated]);
    setSubtotal(getCartTotal(updated));
    refresh();
  };

  const handleClear = () => {
    if (!confirm("هل تريدين تفريغ السلة بالكامل؟")) return;
    clearCart();
    setItems([]);
    setSubtotal(0);
    setCouponDiscount(0);
    setCouponPercent(0);
    refresh();
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), cartTotal: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "كوبون غير صالح");
        setCouponDiscount(0);
        setCouponPercent(0);
      } else {
        setCouponPercent(data.discountPercent);
        setCouponDiscount((subtotal * data.discountPercent) / 100);
        setCouponError("");
      }
    } catch {
      setCouponError("خطأ في التحقق من الكوبون");
    } finally {
      setCouponLoading(false);
    }
  };

  const totalAfterDiscount = subtotal - couponDiscount;
  const shipping = subtotal >= 500 ? 0 : 50;
  const grandTotal = totalAfterDiscount + shipping;

  return (
    <>
      <section className="bg-near-black py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <ShoppingBag className="h-10 w-10 text-warm-gold mx-auto mb-3" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-cream">
            سلة التسوق
          </h1>
          <div className="gold-divider max-w-32 mx-auto mt-4" />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-5xl px-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-warm-gold/30 mx-auto mb-4" />
              <p className="font-heading text-xl text-cream/60 mb-4">سلتك فارغة</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-warm-gold text-near-black px-8 py-3 font-body text-sm font-medium tracking-wide hover:bg-gold-light transition-colors"
              >
                تسوقي الآن
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-4 flex gap-4"
                  >
                    {/* Image */}
                    <Link href={`/products/${item.slug}`} className="shrink-0">
                      <div className="w-24 h-32 md:w-28 md:h-36 rounded overflow-hidden bg-near-black/5">
                        <img
                          src={item.image || "/images/placeholder-product.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-heading text-base md:text-lg text-cream hover:text-warm-gold transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex flex-wrap gap-3 mt-1">
                        {item.size && (
                          <span className="font-body text-xs text-cream/50">المقاس: {item.size}</span>
                        )}
                        {item.color && (
                          <span className="font-body text-xs text-cream/50">اللون: {item.color}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-body text-sm font-medium text-cream">
                          {item.price} ج.م
                        </span>
                        {item.comparePrice && (
                          <span className="font-body text-xs text-cream/40 line-through">
                            {item.comparePrice} ج.م
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQty(item.productId, item.size, item.color, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-warm-gold/20 rounded hover:border-warm-gold/50 transition-colors"
                          >
                            <Minus className="h-3 w-3 text-cream/60" />
                          </button>
                          <span className="font-body text-sm font-medium text-cream w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.productId, item.size, item.color, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-warm-gold/20 rounded hover:border-warm-gold/50 transition-colors"
                          >
                            <Plus className="h-3 w-3 text-cream/60" />
                          </button>
                        </div>

                        {/* Item total & delete */}
                        <div className="flex items-center gap-3">
                          <span className="font-body text-sm font-medium text-warm-gold">
                            {(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م
                          </span>
                          <button
                            onClick={() => handleRemove(item.productId, item.size, item.color)}
                            className="text-cream/30 hover:text-red-500 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear cart */}
                <button
                  onClick={handleClear}
                  className="font-body text-xs text-cream/40 hover:text-red-500 transition-colors"
                >
                  تفريغ السلة
                </button>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-6 sticky top-24 space-y-4">
                  <h2 className="font-heading text-xl text-cream">ملخص الطلب</h2>
                  <div className="gold-divider" />

                  <div className="space-y-3">
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-cream/60">المجموع الفرعي</span>
                      <span className="text-cream">{subtotal.toFixed(2)} ج.م</span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between font-body text-sm">
                        <span className="text-green-600">خصم الكوبون ({couponPercent}%)</span>
                        <span className="text-green-600">-{couponDiscount.toFixed(2)} ج.م</span>
                      </div>
                    )}

                    <div className="flex justify-between font-body text-sm">
                      <span className="text-cream/60">الشحن</span>
                      <span className="text-cream">
                        {shipping === 0 ? "مجاني" : `${shipping} ج.م`}
                      </span>
                    </div>

                    {shipping > 0 && (
                      <p className="font-body text-[11px] text-warm-gold/70">
                        الأسعار حسب المحافظة
                      </p>
                    )}

                    <div className="gold-divider" />
                    <div className="flex justify-between font-body text-base font-medium">
                      <span className="text-cream">الإجمالي</span>
                      <span className="text-warm-gold">{grandTotal.toFixed(2)} ج.م</span>
                    </div>
                  </div>

                  {/* Coupon */}
                  <div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-gold/40" />
                        <input
                          type="text"
                          placeholder="كود الخصم"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                          className="w-full bg-near-black/40 border border-warm-gold/20 rounded pr-9 pl-3 py-2 font-body text-sm text-cream placeholder:text-cream/30 outline-none focus:border-warm-gold/50"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="bg-warm-gold/10 text-warm-gold border border-warm-gold/20 px-4 py-2 font-body text-sm hover:bg-warm-gold/20 transition-colors disabled:opacity-50"
                      >
                        {couponLoading ? "..." : "تطبيق"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="font-body text-xs text-red-500 mt-1">{couponError}</p>
                    )}
                    {couponDiscount > 0 && (
                      <p className="font-body text-xs text-green-600 mt-1 flex items-center gap-1">
                        <Check className="h-3 w-3" /> تم تطبيق الخصم
                      </p>
                    )}
                  </div>

                  {/* Checkout */}
                  <Link
                    href="/checkout"
                    className="block text-center bg-warm-gold text-near-black py-3 font-body text-sm font-medium tracking-wide hover:bg-gold-light transition-colors"
                  >
                    إتمام الشراء
                  </Link>

                  <Link
                    href="/products"
                    className="block text-center font-body text-xs text-cream/50 hover:text-warm-gold transition-colors"
                  >
                    متابعة التسوق
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
