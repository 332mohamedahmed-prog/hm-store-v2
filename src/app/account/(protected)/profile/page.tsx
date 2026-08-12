"use client";

import { useState, useEffect } from "react";

const governorates = [
  "القاهرة","الجيزة","الإسكندرية","الشرقية","الدقهلية","البحيرة",
  "الغربية","المنوفية","القليوبية","الفيوم","بني سويف","المنيا",
  "سوهاج","أسيوط","قنا","الأقصر","أسوان","الوادي الجديد",
  "مطروح","البحر الأحمر","بورسعيد","السويس","الإسماعيلية",
  "دمياط","كفر الشيخ","شمال سيناء","جنوب سيناء",
];

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          setAddress(data.user.address || "");
          setCity(data.user.city || "");
          setGovernorate(data.user.governorate || "");
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address, city, governorate }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-6">
      <h2 className="font-heading text-xl text-cream mb-6">بياناتي</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs text-cream/60 mb-1 block">الاسم</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
          </div>
          <div>
            <label className="font-body text-xs text-cream/60 mb-1 block">البريد الإلكتروني</label>
            <input type="email" value={email} disabled className="w-full bg-near-black/50 border border-warm-gold/10 rounded px-3 py-2 font-body text-sm text-cream/50 outline-none" />
          </div>
        </div>

        <div>
          <label className="font-body text-xs text-cream/60 mb-1 block">رقم الهاتف</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
        </div>

        <div>
          <label className="font-body text-xs text-cream/60 mb-1 block">العنوان</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs text-cream/60 mb-1 block">المدينة</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
          </div>
          <div>
            <label className="font-body text-xs text-cream/60 mb-1 block">المحافظة</label>
            <select value={governorate} onChange={e => setGovernorate(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50 cursor-pointer">
              <option value="">اختاري المحافظة</option>
              {governorates.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleSave} disabled={loading} className="bg-warm-gold text-near-black px-6 py-2.5 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50">
          {saved ? "تم الحفظ ✓" : loading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}
