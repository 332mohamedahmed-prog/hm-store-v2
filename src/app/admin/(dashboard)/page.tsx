"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ShoppingCart, Users, Package } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-shimmer h-64 rounded bg-near-black/50" />;

  const cards = [
    { label: "إجمالي المبيعات", value: `${(stats?.totalRevenue || 0).toFixed(2)} ج.م`, icon: TrendingUp, color: "text-green-400" },
    { label: "الطلبات", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "text-blue-400" },
    { label: "العملاء", value: stats?.totalCustomers || 0, icon: Users, color: "text-purple-400" },
    { label: "المنتجات", value: stats?.totalProducts || 0, icon: Package, color: "text-warm-gold" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl text-cream mb-6">لوحة التحكم</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-near-black/50 border border-warm-gold/15 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body text-xs text-cream/40">{card.label}</span>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="font-heading text-2xl text-cream">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-near-black/50 border border-warm-gold/15 rounded-lg p-5">
          <h2 className="font-heading text-lg text-cream mb-4">آخر الطلبات</h2>
          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((o: any) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-warm-gold/5">
                  <div>
                    <p className="font-body text-sm text-cream">{o.orderNumber}</p>
                    <p className="font-body text-xs text-cream/40">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-body text-sm text-warm-gold">{o.total} ج.م</p>
                    <p className="font-body text-xs text-cream/40">{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="font-body text-sm text-cream/30">لا توجد طلبات</p>}
        </div>

        {/* Best sellers */}
        <div className="bg-near-black/50 border border-warm-gold/15 rounded-lg p-5">
          <h2 className="font-heading text-lg text-cream mb-4">الأكثر مبيعاً</h2>
          {stats?.bestSellers?.length > 0 ? (
            <div className="space-y-3">
              {stats.bestSellers.map((b: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-warm-gold/5">
                  <span className="font-body text-sm text-cream">{b.name}</span>
                  <div className="text-left">
                    <span className="font-body text-xs text-cream/40">{b.totalSold} قطعة — </span>
                    <span className="font-body text-sm text-warm-gold">{parseFloat(b.revenue).toFixed(2)} ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="font-body text-sm text-cream/30">لا توجد بيانات</p>}
        </div>
      </div>
    </div>
  );
}
