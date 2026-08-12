"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discountPercent: "", minOrderAmount: "", expiresAt: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch("/api/admin/coupons").then(r => r.json()).then(setCoupons).finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { const c = await res.json(); setCoupons(prev => [...prev, c]); setShowForm(false); setForm({ code: "", discountPercent: "", minOrderAmount: "", expiresAt: "" }); }
    setSaving(false);
  };

  const handleToggle = async (id: string, active: boolean) => {
    await fetch(`/api/admin/coupons/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }) });
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !active } : c));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف الكوبون؟")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return <div className="animate-shimmer h-64 rounded bg-near-black/50" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-cream">الكوبونات</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-warm-gold text-near-black px-4 py-2 font-body text-sm font-medium hover:bg-gold-light transition-colors rounded"><Plus className="h-4 w-4" /> إضافة</button>
      </div>

      {showForm && (
        <div className="bg-near-black/50 border border-warm-gold/15 rounded-lg p-5 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="font-body text-xs text-cream/50 mb-1 block">الكود *</label><input type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" /></div>
            <div><label className="font-body text-xs text-cream/50 mb-1 block">نسبة الخصم % *</label><input type="number" value={form.discountPercent} onChange={e => setForm(f => ({ ...f, discountPercent: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" /></div>
            <div><label className="font-body text-xs text-cream/50 mb-1 block">الحد الأدنى (ج.م)</label><input type="number" value={form.minOrderAmount} onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" /></div>
            <div><label className="font-body text-xs text-cream/50 mb-1 block">تاريخ الانتهاء</label><input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" /></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.code || !form.discountPercent} className="bg-warm-gold text-near-black px-6 py-2 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50 rounded">{saving ? "..." : "إضافة"}</button>
            <button onClick={() => setShowForm(false)} className="border border-warm-gold/30 text-warm-gold px-6 py-2 font-body text-sm rounded">إلغاء</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-warm-gold/15">
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الكود</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الخصم</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الحد الأدنى</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الحالة</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">إجراءات</th>
          </tr></thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b border-warm-gold/5">
                <td className="py-2 px-3 font-body text-sm text-cream font-mono">{c.code}</td>
                <td className="py-2 px-3 font-body text-sm text-warm-gold">{c.discountPercent}%</td>
                <td className="py-2 px-3 font-body text-sm text-cream/50">{c.minOrderAmount || 0} ج.م</td>
                <td className="py-2 px-3"><button onClick={() => handleToggle(c.id, c.active)} className={`font-body text-xs px-2 py-1 rounded-full ${c.active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{c.active ? "نشط" : "معطل"}</button></td>
                <td className="py-2 px-3"><button onClick={() => handleDelete(c.id)} className="text-cream/30 hover:text-red-400"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
