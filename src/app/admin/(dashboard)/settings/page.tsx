"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats").then(() => {}); // just to check auth
    // Load settings from siteSettings table
    fetch("/api/settings").then(r => r.json()).then(data => {
      const map: Record<string, string> = {};
      if (Array.isArray(data)) data.forEach((s: any) => { map[s.key] = s.value; });
      setSettings(map);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="animate-shimmer h-64 rounded bg-near-black/50" />;

  const fields = [
    { key: "contact_email", label: "بريد التواصل" },
    { key: "contact_phone", label: "رقم هاتف التواصل" },
    { key: "store_name", label: "اسم المتجر" },
    { key: "store_tagline", label: "الشعار التعريفي" },
    { key: "free_shipping_threshold", label: "حد الشحن المجاني (ج.م)" },
    { key: "whatsapp_number", label: "رقم واتساب" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl text-cream mb-6">الإعدادات العامة</h1>
      <div className="bg-near-black/50 border border-warm-gold/15 rounded-lg p-6 space-y-5">
        {fields.map(f => (
          <div key={f.key}>
            <label className="font-body text-xs text-cream/50 mb-1 block">{f.label}</label>
            <input
              type="text"
              value={settings[f.key] || ""}
              onChange={e => setSettings(prev => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50"
            />
          </div>
        ))}
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-warm-gold text-near-black px-6 py-2 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50 rounded">
          <Save className="h-4 w-4" />
          {saved ? "تم الحفظ ✓" : saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
    </div>
  );
}
