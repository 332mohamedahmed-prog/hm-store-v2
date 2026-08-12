"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newCat, setNewCat] = useState("");

  // Form state
  const [form, setForm] = useState({ name: "", description: "", material: "", price: "", comparePrice: "", categoryId: "", isBestSeller: false, isNewArrival: false, active: true });
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const fetchData = () => {
    Promise.all([fetch("/api/admin/products").then(r => r.json()), fetch("/api/categories").then(r => r.json())])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    for (const f of files) fd.append("images", f);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.urls) setImages(prev => [...prev, ...data.urls]);
  };

  const removeImage = (i: number) => setImages(prev => prev.filter((_, idx) => idx !== i));
  const addSize = () => { if (sizeInput.trim()) { setSizes(prev => [...prev, sizeInput.trim()]); setSizeInput(""); } };
  const addColor = () => { if (colorInput.trim()) { setColors(prev => [...prev, colorInput.trim()]); setColorInput(""); } };

  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    const slug = newCat.trim().toLowerCase().replace(/\s+/g, "-");
    await fetch("/api/seed", { method: "POST" }); // won't help, need custom endpoint
    // Use direct insert via a quick API call
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCat.trim(), slug }) });
    if (res.ok) { const cat = await res.json(); setCategories(prev => [...prev, cat]); setForm(f => ({ ...f, categoryId: cat.id })); setNewCat(""); }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", material: "", price: "", comparePrice: "", categoryId: "", isBestSeller: false, isNewArrival: false, active: true });
    setSizes([]); setColors([]); setImages([]); setEditId(null); setShowForm(false);
  };

  const handleEdit = (p: any) => {
    setForm({ name: p.name, description: p.description || "", material: p.material || "", price: p.price, comparePrice: p.comparePrice || "", categoryId: p.categoryId || "", isBestSeller: !!p.isBestSeller, isNewArrival: !!p.isNewArrival, active: p.active });
    setSizes(p.sizes || []); setColors(p.colors || []); setImages(p.images || []); setEditId(p.id); setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form, sizes, colors, images };
    const res = editId
      ? await fetch(`/api/admin/products/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { resetForm(); fetchData(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا المنتج؟")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <div className="animate-shimmer h-64 rounded bg-near-black/50" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl text-cream">المنتجات ({products.length})</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-warm-gold text-near-black px-4 py-2 font-body text-sm font-medium hover:bg-gold-light transition-colors rounded">
          <Plus className="h-4 w-4" /> إضافة منتج
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-near-black/80 flex items-start justify-center pt-8 px-4 overflow-y-auto">
          <div className="bg-near-black/95 border border-warm-gold/20 rounded-lg p-6 w-full max-w-2xl my-8">
            <h2 className="font-heading text-xl text-cream mb-4">{editId ? "تعديل منتج" : "إضافة منتج جديد"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-cream/50 mb-1 block">الاسم *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
                </div>
                <div>
                  <label className="font-body text-xs text-cream/50 mb-1 block">السعر (ج.م) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-cream/50 mb-1 block">سعر قبل الخصم</label>
                  <input type="number" value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
                </div>
                <div>
                  <label className="font-body text-xs text-cream/50 mb-1 block">الخامة</label>
                  <input type="text" value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-cream/50 mb-1 block">الوصف</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50 resize-none" />
              </div>

              {/* Category */}
              <div>
                <label className="font-body text-xs text-cream/50 mb-1 block">التصنيف</label>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50">
                  <option value="">بدون تصنيف</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex gap-2 mt-2">
                  <input type="text" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="تصنيف جديد..." className="flex-1 bg-near-black/60 border border-warm-gold/20 rounded px-3 py-1.5 font-body text-xs text-cream outline-none focus:border-warm-gold/50" />
                  <button onClick={handleAddCategory} className="bg-warm-gold/20 text-warm-gold px-3 py-1.5 font-body text-xs hover:bg-warm-gold/30 transition-colors rounded">إضافة</button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="font-body text-xs text-cream/50 mb-1 block">المقاسات</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {sizes.map((s, i) => <span key={i} className="font-body text-xs bg-warm-gold/10 text-warm-gold px-2 py-1 rounded flex items-center gap-1">{s}<button onClick={() => setSizes(prev => prev.filter((_, idx) => idx !== i))} className="text-cream/30 hover:text-red-400">×</button></span>)}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addSize()} placeholder="أضف مقاس..." className="flex-1 bg-near-black/60 border border-warm-gold/20 rounded px-3 py-1.5 font-body text-xs text-cream outline-none focus:border-warm-gold/50" />
                  <button onClick={addSize} className="bg-warm-gold/20 text-warm-gold px-3 py-1.5 font-body text-xs rounded">+</button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="font-body text-xs text-cream/50 mb-1 block">الألوان</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {colors.map((c, i) => <span key={i} className="font-body text-xs bg-warm-gold/10 text-warm-gold px-2 py-1 rounded flex items-center gap-1">{c}<button onClick={() => setColors(prev => prev.filter((_, idx) => idx !== i))} className="text-cream/30 hover:text-red-400">×</button></span>)}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={colorInput} onChange={e => setColorInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addColor()} placeholder="أضف لون..." className="flex-1 bg-near-black/60 border border-warm-gold/20 rounded px-3 py-1.5 font-body text-xs text-cream outline-none focus:border-warm-gold/50" />
                  <button onClick={addColor} className="bg-warm-gold/20 text-warm-gold px-3 py-1.5 font-body text-xs rounded">+</button>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="font-body text-xs text-cream/50 mb-1 block">الصور</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded overflow-hidden border border-warm-gold/20">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute top-0 left-0 bg-red-500/80 text-white text-xs w-5 h-5 flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="font-body text-xs text-cream/50" />
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 font-body text-sm text-cream/70"><input type="checkbox" checked={form.isBestSeller} onChange={e => setForm(f => ({ ...f, isBestSeller: e.target.checked }))} className="accent-warm-gold" />الأكثر مبيعاً</label>
                <label className="flex items-center gap-2 font-body text-sm text-cream/70"><input type="checkbox" checked={form.isNewArrival} onChange={e => setForm(f => ({ ...f, isNewArrival: e.target.checked }))} className="accent-warm-gold" />وصل حديثاً</label>
                <label className="flex items-center gap-2 font-body text-sm text-cream/70"><input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-warm-gold" />نشط</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving || !form.name || !form.price} className="bg-warm-gold text-near-black px-6 py-2 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50 rounded">
                  {saving ? "جاري الحفظ..." : editId ? "تحديث" : "إضافة"}
                </button>
                <button onClick={resetForm} className="border border-warm-gold/30 text-warm-gold px-6 py-2 font-body text-sm hover:bg-warm-gold/10 transition-colors rounded">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-warm-gold/15">
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الصورة</th>
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الاسم</th>
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">السعر</th>
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">التصنيف</th>
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">الحالة</th>
              <th className="text-right font-body text-xs text-cream/40 py-3 px-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-warm-gold/5 hover:bg-cream/[0.02]">
                <td className="py-2 px-3"><div className="w-10 h-10 rounded overflow-hidden bg-near-black/40">{p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}</div></td>
                <td className="py-2 px-3 font-body text-sm text-cream">{p.name}</td>
                <td className="py-2 px-3 font-body text-sm text-warm-gold">{p.price} ج.م</td>
                <td className="py-2 px-3 font-body text-xs text-cream/50">{p.categoryName || "—"}</td>
                <td className="py-2 px-3">{p.active ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-cream/20" />}</td>
                <td className="py-2 px-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="text-cream/30 hover:text-warm-gold"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-cream/30 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
