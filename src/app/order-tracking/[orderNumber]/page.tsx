"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronLeft } from "lucide-react";

const statusSteps = [
  { key: "pending", label: "تم الاستلام", icon: Clock },
  { key: "confirmed", label: "تم التأكيد", icon: CheckCircle },
  { key: "processing", label: "جاري التحضير", icon: Package },
  { key: "shipped", label: "تم الشحن", icon: Truck },
  { key: "delivered", label: "تم التوصيل", icon: CheckCircle },
];

const statusIndex: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
};

interface OrderData {
  order: {
    orderNumber: string;
    status: string;
    shippingName: string;
    shippingGovernorate: string;
    total: string;
    paymentMethod: string;
    items: {
      productName: string;
      productImage: string | null;
      price: string;
      quantity: number;
    }[];
    createdAt: string;
    updatedAt: string;
  };
}

export default function OrderTrackingPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [data, setData] = useState<OrderData | null>(null);
  const [searchInput, setSearchInput] = useState(orderNumber || "");

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders/${orderNumber}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, [orderNumber]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      window.location.href = `/order-tracking/${searchInput.trim()}`;
    }
  };

  const order = data?.order;
  const currentStep = order ? statusIndex[order.status] ?? 0 : 0;
  const isCancelled = order?.status === "cancelled";

  return (
    <>
      <section className="bg-near-black py-10 md:py-14">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Package className="h-10 w-10 text-warm-gold mx-auto mb-3" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-cream">تتبع الطلب</h1>
          <div className="gold-divider max-w-32 mx-auto mt-4" />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-3xl px-6">
          {/* Search */}
          <div className="flex gap-2 mb-8">
            <input
              type="text"
              placeholder="أدخلي رقم الطلب (مثل HM-20260812-XXXX)"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-near-black/50 border border-warm-gold/20 rounded-lg px-4 py-3 font-body text-sm text-cream placeholder:text-cream/30 outline-none focus:border-warm-gold/50"
            />
            <button onClick={handleSearch} className="bg-warm-gold text-near-black px-6 py-3 font-body text-sm font-medium hover:bg-gold-light transition-colors rounded-lg">
              بحث
            </button>
          </div>

          {order ? (
            <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-6">
              {/* Order info */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading text-xl text-cream">{order.orderNumber}</h2>
                  <p className="font-body text-xs text-cream/50">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <span className={`font-body text-sm px-3 py-1 rounded-full ${isCancelled ? "bg-red-100 text-red-600" : "bg-warm-gold/10 text-warm-gold"}`}>
                  {isCancelled ? "ملغي" : statusSteps[currentStep]?.label || "قيد الانتظار"}
                </span>
              </div>

              {/* Status timeline */}
              {!isCancelled && (
                <div className="mb-8">
                  <div className="relative flex items-center justify-between">
                    {statusSteps.map((step, i) => {
                      const Icon = step.icon;
                      const done = i <= currentStep;
                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${done ? "border-warm-gold bg-warm-gold/10" : "border-warm-gold/20 bg-near-black/50"}`}>
                            <Icon className={`h-5 w-5 ${done ? "text-warm-gold" : "text-warm-gold/30"}`} />
                          </div>
                          <span className={`font-body text-[10px] mt-1 ${done ? "text-warm-gold" : "text-cream/30"}`}>{step.label}</span>
                        </div>
                      );
                    })}
                    {/* Progress line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-warm-gold/20 -z-0">
                      <div
                        className="h-full bg-warm-gold transition-all"
                        style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {isCancelled && (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg mb-6">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <p className="font-body text-sm text-red-600">تم إلغاء هذا الطلب</p>
                </div>
              )}

              {/* Shipping info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-body text-xs text-cream/50">الشحن إلى</p>
                  <p className="font-body text-sm text-cream">{order.shippingName} — {order.shippingGovernorate}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-cream/50">الإجمالي</p>
                  <p className="font-body text-sm font-medium text-warm-gold">{order.total} ج.م</p>
                </div>
              </div>

              {/* Items */}
              <div className="gold-divider mb-4" />
              <h3 className="font-body text-xs font-medium text-cream/60 uppercase tracking-wider mb-3">المنتجات</h3>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-near-black/5 overflow-hidden shrink-0">
                      <img src={item.productImage || "/images/placeholder-product.svg"} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-body text-sm text-cream flex-1">{item.productName} × {item.quantity}</span>
                    <span className="font-body text-sm text-cream">{item.price} ج.م</span>
                  </div>
                ))}
              </div>
            </div>
          ) : orderNumber ? (
            <div className="text-center py-12">
              <p className="font-body text-base text-cream/40">لم يتم العثور على هذا الطلب</p>
            </div>
          ) : null}

          <div className="text-center mt-6">
            <Link href="/" className="inline-flex items-center gap-1 font-body text-sm text-warm-gold hover:text-gold-light transition-colors">
              <ChevronLeft className="h-4 w-4" /> العودة للرئيسية
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
