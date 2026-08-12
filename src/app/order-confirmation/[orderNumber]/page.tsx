"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

interface OrderData {
  order: {
    id: string;
    orderNumber: string;
    shippingName: string;
    shippingGovernorate: string;
    total: string;
    status: string;
    paymentMethod: string;
    items: {
      productName: string;
      productImage: string | null;
      price: string;
      size: string | null;
      color: string | null;
      quantity: number;
    }[];
    createdAt: string;
  };
}

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [data, setData] = useState<OrderData | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders/${orderNumber}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, [orderNumber]);

  if (!data?.order) {
    return (
      <div className="min-h-screen bg-near-black/40 flex items-center justify-center">
        <div className="animate-shimmer w-48 h-8 rounded bg-near-black/50" />
      </div>
    );
  }

  const order = data.order;

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-warm-gold/10 border-2 border-warm-gold/30">
          <CheckCircle className="h-10 w-10 text-warm-gold" />
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-cream mb-3">
          تم تأكيد طلبك بنجاح! 🎉
        </h1>
        <p className="font-body text-sm text-cream/60 mb-6">
          شكراً لك. سيتم التواصل معك قريباً لتأكيد الشحنة.
        </p>

        {/* Order number */}
        <div className="bg-near-black/50 border border-warm-gold/20 rounded-lg p-6 mb-8">
          <p className="font-body text-xs text-cream/50 mb-1">رقم الطلب</p>
          <p className="font-heading text-2xl font-bold text-warm-gold mb-4">{order.orderNumber}</p>

          <div className="grid grid-cols-2 gap-4 text-right">
            <div>
              <p className="font-body text-xs text-cream/50">الإجمالي</p>
              <p className="font-body text-sm font-medium text-cream">{order.total} ج.م</p>
            </div>
            <div>
              <p className="font-body text-xs text-cream/50">طريقة الدفع</p>
              <p className="font-body text-sm font-medium text-cream">
                {order.paymentMethod === "cod" ? "عند الاستلام" : "إلكتروني"}
              </p>
            </div>
            <div>
              <p className="font-body text-xs text-cream/50">الشحن إلى</p>
              <p className="font-body text-sm font-medium text-cream">{order.shippingGovernorate}</p>
            </div>
            <div>
              <p className="font-body text-xs text-cream/50">حالة الطلب</p>
              <p className="font-body text-sm font-medium text-warm-gold">قيد الانتظار</p>
            </div>
          </div>

          {/* Items */}
          <div className="gold-divider my-4" />
          <div className="space-y-3 text-right">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-near-black/5 overflow-hidden shrink-0">
                  <img src={item.productImage || "/images/placeholder-product.svg"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs text-cream line-clamp-1">{item.productName}</p>
                  <p className="font-body text-[10px] text-cream/40">
                    {item.size && `مقاس ${item.size}`}
                    {item.size && item.color && " • "}
                    {item.color && `لون ${item.color}`}
                    {" • "}×{item.quantity}
                  </p>
                </div>
                <span className="font-body text-xs text-cream">{item.price} ج.م</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/order-tracking/${order.orderNumber}`}
            className="inline-flex items-center justify-center gap-2 bg-warm-gold text-near-black px-6 py-3 font-body text-sm font-medium hover:bg-gold-light transition-colors"
          >
            <Package className="h-4 w-4" />
            تتبع الطلب
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-warm-gold/30 text-warm-gold px-6 py-3 font-body text-sm hover:bg-warm-gold/10 transition-colors"
          >
            متابعة التسوق
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
