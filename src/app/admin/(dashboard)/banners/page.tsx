"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", link: "", sortOrder: "0" });
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch("/api/admin/banners").then(r => r.json()).then(setBanners).finally(() => setLoading(false)); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append("images", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.urls?.[0]) setImage(data.urls[0]);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/banners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, image, sortOrder: Number(form.sortOrder) }) });
    if (res.ok) { const b = await res.json(); setBanners(prev => [...prev, b]); setShowForm(false); setForm({ title: "", subtitle: "", link: "", sortOrder: "0" }); setImage(""); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف البانر؟")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  if (loading) return <div className="animate-shimmer h-64 rounded bg-near-black/50" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-cream">البانرات</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-warm-gold text-near-black px-4 py-2 font-body text-sm font-medium hover:bg-gold-light transition-colors rounded"><Plus className="h-4 w-4" /> إضافة</button>
      </div>

      {showForm && (
        <div className="bg-near-black/50 border border-warm-gold/15 rounded-lg p-5 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="font-body text-xs text-cream/50 mb-1 block">العنوان *</label><input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" /></div>
            <div><label className="font-body text-xs text-cream/50 mb-1 block">العنوان الفرعي</label><input type="text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" /></div>
            <div><label className="font-body text-xs text-cream/50 mb-1 block">الرابط</label><input type="text" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" /></div>
            <div><label className="font-body text-xs text-cream/50 mb-1 block">الترتيب</label><input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" /></div>
          </div>
          <div>
            <label className="font-body text-xs text-cream/50 mb-1 block">الصورة</label>
            <input type="file" accept="image/*" onChange={handleUpload} className="font-body text-xs text-cream/50" />
            {image && <img src={image} alt="" className="mt-2 w-40 h-20 object-cover rounded" />}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.title} className="bg-warm-gold text-near-black px-6 py-2 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50 rounded">{saving ? "..." : "إضافة"}</button>
            <button onClick={() => setShowForm(false)} className="border border-warm-gold/30 text-warm-gold px-6 py-2 font-body text-sm rounded">إلغاء</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map(b => (
          <div key={b.id} className="bg-near-black/50 border border-warm-gold/15 rounded-lg p-4 flex gap-4">
            {b.image && <img src={b.image} alt="" className="w-24 h-16 object-cover rounded shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-body text-sm text-cream">{b.title}</h3>
              <p className="font-body text-xs text-cream/40">{b.subtitle || "—"}</p>
            </div>
            <button onClick={() => handleDelete(b.id)} className="text-cream/30 hover:text-red-400 shrink-0"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
