"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, CreditCard, CheckCircle, Truck, Package } from "lucide-react";
import { getCart, getCartTotal, clearCart, type CartItem } from "@/lib/cart";
import { useCart } from "@/components/CartProvider";

interface ShippingRate {
  id: string;
  governorate: string;
  rate: string;
  freeAbove: string | null;
}

const governorates = [
  "القاهرة","الجيزة","الإسكندرية","الشرقية","الدقهلية","البحيرة",
  "الغربية","المنوفية","القليوبية","الفيوم","بني سويف","المنيا",
  "سوهاج","أسيوط","قنا","الأقصر","أسوان","الوادي الجديد",
  "مطروح","البحر الأحمر","بورسعيد","السويس","الإسماعيلية",
  "دمياط","كفر الشيخ","شمال سيناء","جنوب سيناء",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { refresh } = useCart();
  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: review
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);

  // Shipping form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [governorate, setGovernorate] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponPercent, setCouponPercent] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Auth
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) {
      router.replace("/cart");
      return;
    }
    setCartItems(cart);

    fetch("/api/shipping/rates").then(r => r.json()).then(setShippingRates).catch(() => {});

    // Check if logged in
    fetch("/api/auth/me").then(r => {
      if (r.ok) return r.json();
      return null;
    }).then(data => {
      if (data?.user) {
        setUserId(data.user.id);
        if (data.user.name) setName(data.user.name);
        if (data.user.phone) setPhone(data.user.phone);
        if (data.user.address) setAddress(data.user.address);
        if (data.user.city) setCity(data.user.city);
        if (data.user.governorate) setGovernorate(data.user.governorate);
      }
    }).catch(() => {});
  }, []);

  const subtotal = getCartTotal(cartItems);
  const selectedRate = shippingRates.find(r => r.governorate === governorate);
  const shippingCost = selectedRate
    ? (selectedRate.freeAbove && subtotal >= parseFloat(selectedRate.freeAbove)
      ? 0
      : parseFloat(selectedRate.rate))
    : null;
  const total = subtotal - couponDiscount + (shippingCost ?? 0);

  const handleApplyCoupon = async () => {
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, cartTotal: subtotal }),
    });
    const data = await res.json();
    if (res.ok) {
      setCouponPercent(data.discountPercent);
      setCouponDiscount((subtotal * data.discountPercent) / 100);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingName: name,
          shippingPhone: phone,
          shippingAddress: address,
          shippingCity: city,
          shippingGovernorate: governorate,
          subtotal,
          shippingCost: shippingCost ?? 0,
          discountPercent: couponPercent,
          discountAmount: couponDiscount,
          total,
          paymentMethod,
          couponCode: couponPercent > 0 ? couponCode : null,
          userId,
          items: cartItems.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "فشل في إنشاء الطلب");
        setLoading(false);
        return;
      }

      const data = await res.json();
      clearCart();
      refresh();
      router.push(`/order-confirmation/${data.order.orderNumber}`);
    } catch {
      alert("حدث خطأ، حاولي مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: "بيانات الشحن", icon: MapPin },
    { num: 2, label: "طريقة الدفع", icon: CreditCard },
    { num: 3, label: "مراجعة الطلب", icon: CheckCircle },
  ];

  return (
    <>
      <section className="bg-near-black py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-cream mb-6">إتمام الشراء</h1>
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const active = step >= s.num;
              return (
                <div key={s.num} className="flex items-center gap-2">
                  {i > 0 && <div className={`w-8 md:w-16 h-px ${step > s.num - 1 ? "bg-warm-gold" : "bg-warm-gold/20"}`} />}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body ${active ? "bg-warm-gold/20 text-warm-gold" : "text-cream/30"}`}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-6 space-y-5">
                  <h2 className="font-heading text-xl text-cream flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-warm-gold" /> بيانات الشحن
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs text-cream/60 mb-1 block">الاسم الكامل *</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
                    </div>
                    <div>
                      <label className="font-body text-xs text-cream/60 mb-1 block">رقم الهاتف *</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01xxxxxxxxx" className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs text-cream/60 mb-1 block">العنوان بالتفصيل *</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="رقم العمارة، الشارع، المنطقة" className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs text-cream/60 mb-1 block">المدينة</label>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
                    </div>
                    <div>
                      <label className="font-body text-xs text-cream/60 mb-1 block">المحافظة *</label>
                      <select value={governorate} onChange={e => setGovernorate(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50 cursor-pointer">
                        <option value="">اختاري المحافظة</option>
                        {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  {shippingCost !== null && governorate && (
                    <p className="font-body text-xs text-warm-gold flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      {shippingCost === 0
                        ? "شحن مجاني! 🎉"
                        : `رسوم الشحن: ${shippingCost} ج.م`}
                    </p>
                  )}
                  <button
                    onClick={() => setStep(2)}
                    disabled={!name || !phone || !address || !governorate}
                    className="w-full bg-warm-gold text-near-black py-3 font-body text-sm font-medium tracking-wide hover:bg-gold-light transition-colors disabled:opacity-40"
                  >
                    التالي: طريقة الدفع
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-6 space-y-5">
                  <h2 className="font-heading text-xl text-cream flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-warm-gold" /> طريقة الدفع
                  </h2>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === "cod" ? "border-warm-gold bg-warm-gold/5" : "border-warm-gold/10 hover:border-warm-gold/30"}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-warm-gold" />
                      <div>
                        <span className="font-body text-sm font-medium text-cream">الدفع عند الاستلام</span>
                        <p className="font-body text-xs text-cream/50">ادفعي عند استلام الشحنة</p>
                      </div>
                    </label>
                    <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === "card" ? "border-warm-gold bg-warm-gold/5" : "border-warm-gold/10 hover:border-warm-gold/30"}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="accent-warm-gold" />
                      <div>
                        <span className="font-body text-sm font-medium text-cream">الدفع الإلكتروني</span>
                        <p className="font-body text-xs text-cream/50">فيزا / ماستر كارد (قريباً)</p>
                      </div>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 border border-warm-gold/30 text-warm-gold py-3 font-body text-sm hover:bg-warm-gold/10 transition-colors">
                      رجوع
                    </button>
                    <button onClick={() => setStep(3)} className="flex-1 bg-warm-gold text-near-black py-3 font-body text-sm font-medium hover:bg-gold-light transition-colors">
                      التالي: مراجعة الطلب
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-6 space-y-5">
                  <h2 className="font-heading text-xl text-cream flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-warm-gold" /> مراجعة الطلب
                  </h2>

                  {/* Shipping info */}
                  <div className="p-4 bg-near-black/40 rounded border border-warm-gold/5">
                    <h3 className="font-body text-xs font-medium text-cream/60 uppercase tracking-wider mb-2">بيانات الشحن</h3>
                    <p className="font-body text-sm text-cream">{name}</p>
                    <p className="font-body text-sm text-cream/70">{phone}</p>
                    <p className="font-body text-sm text-cream/70">{address}، {city}، {governorate}</p>
                  </div>

                  {/* Payment method */}
                  <div className="p-4 bg-near-black/40 rounded border border-warm-gold/5">
                    <h3 className="font-body text-xs font-medium text-cream/60 uppercase tracking-wider mb-2">طريقة الدفع</h3>
                    <p className="font-body text-sm text-cream">
                      {paymentMethod === "cod" ? "الدفع عند الاستلام" : "الدفع الإلكتروني"}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="p-4 bg-near-black/40 rounded border border-warm-gold/5">
                    <h3 className="font-body text-xs font-medium text-cream/60 uppercase tracking-wider mb-3">المنتجات ({cartItems.length})</h3>
                    <div className="space-y-3">
                      {cartItems.map(item => (
                        <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-near-black/5 overflow-hidden shrink-0">
                            <img src={item.image || "/images/placeholder-product.svg"} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-xs text-cream line-clamp-1">{item.name}</p>
                            <p className="font-body text-[10px] text-cream/50">
                              {item.size && `مقاس ${item.size}`}
                              {item.size && item.color && " • "}
                              {item.color && `لون ${item.color}`}
                              {" • "}كمية {item.quantity}
                            </p>
                          </div>
                          <span className="font-body text-xs font-medium text-cream">
                            {(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 border border-warm-gold/30 text-warm-gold py-3 font-body text-sm hover:bg-warm-gold/10 transition-colors">
                      رجوع
                    </button>
                    <button onClick={handlePlaceOrder} disabled={loading} className="flex-1 bg-warm-gold text-near-black py-3 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50">
                      {loading ? "جاري إنشاء الطلب..." : "تأكيد الطلب"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-5 sticky top-24 space-y-4">
                <h3 className="font-heading text-lg text-cream">ملخص الطلب</h3>
                <div className="gold-divider" />

                <div className="space-y-2">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-cream/60">المجموع الفرعي</span>
                    <span className="text-cream">{subtotal.toFixed(2)} ج.م</span>
                  </div>

                  {governorate && shippingCost !== null && (
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-cream/60">الشحن ({governorate})</span>
                      <span className="text-cream">
                        {shippingCost === 0 ? "مجاني" : `${shippingCost} ج.م`}
                      </span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-green-600">خصم ({couponPercent}%)</span>
                      <span className="text-green-600">-{couponDiscount.toFixed(2)} ج.م</span>
                    </div>
                  )}

                  <div className="gold-divider" />
                  <div className="flex justify-between font-body text-base font-medium">
                    <span className="text-cream">الإجمالي</span>
                    <span className="text-warm-gold">{total.toFixed(2)} ج.م</span>
                  </div>
                </div>

                {/* Coupon */}
                {couponPercent === 0 && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="كود خصم"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 bg-near-black/40 border border-warm-gold/20 rounded px-2 py-1.5 font-body text-xs text-cream placeholder:text-cream/30 outline-none focus:border-warm-gold/50"
                    />
                    <button onClick={handleApplyCoupon} className="bg-warm-gold/10 text-warm-gold border border-warm-gold/20 px-3 py-1.5 font-body text-xs hover:bg-warm-gold/20 transition-colors">
                      تطبيق
                    </button>
                  </div>
                )}

                {!governorate && (
                  <p className="font-body text-[11px] text-cream/40">
                    اختاري المحافظة لحساب رسوم الشحن
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
