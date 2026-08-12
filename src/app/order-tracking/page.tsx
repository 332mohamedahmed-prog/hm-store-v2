"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

export default function OrderTrackingSearchPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");

  const handleSearch = () => {
    if (orderNumber.trim()) {
      router.push(`/order-tracking/${orderNumber.trim()}`);
    }
  };

  return (
    <>
      <section className="bg-near-black py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Package className="h-10 w-10 text-warm-gold mx-auto mb-3" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-cream">تتبع الطلب</h1>
          <div className="gold-divider max-w-32 mx-auto mt-4" />
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-md px-6 text-center">
          <p className="font-body text-sm text-cream/60 mb-6">
            أدخلي رقم الطلب لمعرفة حالة الشحنة
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="مثال: HM-20260812-XXXX"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-near-black/50 border border-warm-gold/20 rounded-lg px-4 py-3 font-body text-sm text-cream placeholder:text-cream/30 outline-none focus:border-warm-gold/50"
            />
            <button onClick={handleSearch} className="bg-warm-gold text-near-black px-6 py-3 font-body text-sm font-medium hover:bg-gold-light transition-colors rounded-lg">
              بحث
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
