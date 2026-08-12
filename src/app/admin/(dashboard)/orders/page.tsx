"use client";

import { useState, useEffect } from "react";
import { Eye, Trash2, Printer } from "lucide-react";

const statusLabels: Record<string, string> = { pending: "قيد الانتظار", confirmed: "مؤكد", processing: "جاري التحضير", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي" };
const statusColors: Record<string, string> = { pending: "bg-warm-gold/10 text-warm-gold", confirmed: "bg-blue-500/10 text-blue-400", processing: "bg-purple-500/10 text-purple-400", shipped: "bg-indigo-500/10 text-indigo-400", delivered: "bg-green-500/10 text-green-400", cancelled: "bg-red-500/10 text-red-400" };
const allStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState<any>(null);

  useEffect(() => { fetch("/api/admin/orders").then(r => r.json()).then(setOrders).finally(() => setLoading(false)); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (viewOrder?.id === id) setViewOrder((prev: any) => ({ ...prev, status }));
  };

  if (loading) return <div className="animate-shimmer h-64 rounded bg-near-black/50" />;

  return (
    <div>
      <h1 className="font-heading text-2xl text-cream mb-6">الطلبات ({orders.length})</h1>

      {/* Order detail modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-near-black/80 flex items-start justify-center pt-8 px-4 overflow-y-auto">
          <div className="bg-near-black/95 border border-warm-gold/20 rounded-lg p-6 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl text-cream">{viewOrder.orderNumber}</h2>
              <button onClick={() => setViewOrder(null)} className="text-cream/30 hover:text-cream font-body text-sm">إغلاق</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><p className="font-body text-xs text-cream/40">الاسم</p><p className="font-body text-sm text-cream">{viewOrder.shippingName}</p></div>
              <div><p className="font-body text-xs text-cream/40">الهاتف</p><p className="font-body text-sm text-cream">{viewOrder.shippingPhone}</p></div>
              <div><p className="font-body text-xs text-cream/40">المحافظة</p><p className="font-body text-sm text-cream">{viewOrder.shippingGovernorate}</p></div>
              <div><p className="font-body text-xs text-cream/40">الإجمالي</p><p className="font-body text-sm text-warm-gold">{viewOrder.total} ج.م</p></div>
            </div>
            <div className="mb-4">
              <p className="font-body text-xs text-cream/40 mb-1">تغيير الحالة</p>
              <select value={viewOrder.status} onChange={e => updateStatus(viewOrder.id, e.target.value)} className="bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none">
                {allStatuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
            <h3 className="font-body text-xs text-cream/40 mb-2">المنتجات</h3>
            <div className="space-y-2">
              {viewOrder.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-warm-gold/5">
                  <span className="font-body text-sm text-cream">{item.productName} × {item.quantity}</span>
                  <span className="font-body text-sm text-warm-gold">{item.price} ج.م</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-warm-gold/15">
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">رقم الطلب</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الاسم</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الإجمالي</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الحالة</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">التاريخ</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">إجراءات</th>
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b border-warm-gold/5">
                <td className="py-2 px-3 font-body text-sm text-cream">{o.orderNumber}</td>
                <td className="py-2 px-3 font-body text-sm text-cream">{o.shippingName}</td>
                <td className="py-2 px-3 font-body text-sm text-warm-gold">{o.total} ج.م</td>
                <td className="py-2 px-3"><span className={`font-body text-xs px-2 py-1 rounded-full ${statusColors[o.status] || ""}`}>{statusLabels[o.status] || o.status}</span></td>
                <td className="py-2 px-3 font-body text-xs text-cream/40">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</td>
                <td className="py-2 px-3"><button onClick={() => setViewOrder(o)} className="text-cream/30 hover:text-warm-gold"><Eye className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
