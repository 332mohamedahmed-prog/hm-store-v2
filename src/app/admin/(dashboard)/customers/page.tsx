"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers").then(r => r.json()).then(setCustomers).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا العميل؟")) return;
    const res = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
    if (res.ok) setCustomers(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return <div className="animate-shimmer h-64 rounded bg-near-black/50" />;

  return (
    <div>
      <h1 className="font-heading text-2xl text-cream mb-6">العملاء ({customers.filter(c => c.role === "customer").length})</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-warm-gold/15">
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الاسم</th>
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">البريد</th>
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الهاتف</th>
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الدور</th>
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b border-warm-gold/5">
                <td className="py-2 px-3 font-body text-sm text-cream">{c.name}</td>
                <td className="py-2 px-3 font-body text-sm text-cream/70">{c.email}</td>
                <td className="py-2 px-3 font-body text-sm text-cream/50">{c.phone || "—"}</td>
                <td className="py-2 px-3 font-body text-xs text-cream/40">{c.role === "admin" ? "أدمن" : "عميل"}</td>
                <td className="py-2 px-3">
                  {c.role !== "admin" && (
                    <button onClick={() => handleDelete(c.id)} className="text-cream/30 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
