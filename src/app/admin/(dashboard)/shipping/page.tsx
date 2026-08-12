"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function AdminShippingPage() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ governorate: "", rate: "", freeAbove: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch("/api/admin/shipping").then(r => r.json()).then(setRates).finally(() => setLoading(false)); }, []);

  const resetForm = () => { setForm({ governorate: "", rate: "", freeAbove: "" }); setEditId(null); setShowForm(false); };

  const handleEdit = (r: any) => { setForm({ governorate: r.governorate, rate: r.rate, freeAbove: r.freeAbove || "" }); setEditId(r.id); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editId) {
      await fetch(`/api/admin/shipping/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rate: form.rate, freeAbove: form.freeAbove || null }) });
    } else {
      await fetch("/api/admin/shipping", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    resetForm();
    fetch("/api/admin/shipping").then(r => r.json()).then(setRates);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف سعر الشحن؟")) return;
    await fetch(`/api/admin/shipping/${id}`, { method: "DELETE" });
    setRates(prev => prev.filter(r => r.id !== id));
  };

  if (loading) return <div className="animate-shimmer h-64 rounded bg-near-black/50" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-cream">أسعار الشحن</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-warm-gold text-near-black px-4 py-2 font-body text-sm font-medium hover:bg-gold-light transition-colors rounded"><Plus className="h-4 w-4" /> إضافة</button>
      </div>

      {showForm && (
        <div className="bg-near-black/50 border border-warm-gold/15 rounded-lg p-5 mb-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div><label className="font-body text-xs text-cream/50 mb-1 block">المحافظة *</label><input type="text" value={form.governorate} onChange={e => setForm(f => ({ ...f, governorate: e.target.value }))} disabled={!!editId} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50 disabled:opacity-50" /></div>
            <div><label className="font-body text-xs text-cream/50 mb-1 block">السعر (ج.م) *</label><input type="number" value={form.rate} onChange={e => setForm(f => ({ ...f, rate: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" /></div>
            <div><label className="font-body text-xs text-cream/50 mb-1 block">شحن مجاني فوق (ج.م)</label><input type="number" value={form.freeAbove} onChange={e => setForm(f => ({ ...f, freeAbove: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" /></div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.governorate || !form.rate} className="bg-warm-gold text-near-black px-6 py-2 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50 rounded">{saving ? "..." : editId ? "تحديث" : "إضافة"}</button>
            <button onClick={resetForm} className="border border-warm-gold/30 text-warm-gold px-6 py-2 font-body text-sm rounded">إلغاء</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-warm-gold/15">
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">المحافظة</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">السعر</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">مجاني فوق</th>
            <th className="text-right font-body text-xs text-cream/40 py-3 px-3">إجراءات</th>
          </tr></thead>
          <tbody>
            {rates.map(r => (
              <tr key={r.id} className="border-b border-warm-gold/5">
                <td className="py-2 px-3 font-body text-sm text-cream">{r.governorate}</td>
                <td className="py-2 px-3 font-body text-sm text-warm-gold">{r.rate} ج.م</td>
                <td className="py-2 px-3 font-body text-sm text-cream/50">{r.freeAbove ? `${r.freeAbove} ج.م` : "—"}</td>
                <td className="py-2 px-3 flex gap-2">
                  <button onClick={() => handleEdit(r)} className="text-cream/30 hover:text-warm-gold"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(r.id)} className="text-cream/30 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
