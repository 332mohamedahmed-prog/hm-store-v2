"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ChevronLeft } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  total: string;
  status: string;
  paymentMethod: string;
  shippingGovernorate: string;
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
    price: string;
  }[];
}

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  processing: "جاري التحضير",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const statusColors: Record<string, string> = {
  pending: "bg-warm-gold/10 text-warm-gold",
  confirmed: "bg-blue-50 text-blue-600",
  processing: "bg-purple-50 text-purple-600",
  shipped: "bg-indigo-50 text-indigo-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-shimmer bg-near-black/50 rounded-lg h-32" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-xl text-cream mb-6">طلباتي</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-near-black/50 border border-warm-gold/10 rounded-lg">
          <Package className="h-12 w-12 text-warm-gold/30 mx-auto mb-3" />
          <p className="font-body text-sm text-cream/40 mb-4">لا توجد طلبات بعد</p>
          <Link href="/products" className="font-body text-sm text-warm-gold hover:text-gold-light transition-colors">
            تسوقي الآن
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Link href={`/order-tracking/${order.orderNumber}`} className="font-body text-sm font-medium text-cream hover:text-warm-gold transition-colors">
                    {order.orderNumber}
                  </Link>
                  <p className="font-body text-xs text-cream/40">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <span className={`font-body text-xs px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-body text-xs text-cream/50">
                  {order.items.length} منتج — {order.shippingGovernorate}
                </p>
                <span className="font-body text-sm font-medium text-warm-gold">{order.total} ج.م</span>
              </div>

              <div className="mt-2">
                <Link
                  href={`/order-tracking/${order.orderNumber}`}
                  className="inline-flex items-center gap-1 font-body text-xs text-warm-gold hover:text-gold-light transition-colors"
                >
                  تتبع الطلب <ChevronLeft className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
