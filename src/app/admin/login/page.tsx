"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "فشل"); return; }
      if (data.user?.role !== "admin") { setError("هذا الحساب ليس أدمن"); return; }
      router.push("/admin");
    } catch { setError("حدث خطأ"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-near-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-warm-gold mb-2">HM</h1>
          <p className="font-body text-xs tracking-[0.2em] text-cream/40 uppercase">لوحة التحكم</p>
        </div>
        <form onSubmit={handleLogin} className="bg-near-black/50 border border-warm-gold/20 rounded-lg p-6 space-y-4">
          {error && <p className="font-body text-sm text-red-400">{error}</p>}
          <div>
            <label className="font-body text-xs text-cream/60 mb-1 block">البريد الإلكتروني</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
          </div>
          <div>
            <label className="font-body text-xs text-cream/60 mb-1 block">كلمة المرور</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-near-black/60 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-warm-gold text-near-black py-2.5 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50">
            {loading ? "جاري الدخول..." : "تسجيل دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
