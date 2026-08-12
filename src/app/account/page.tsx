"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, UserPlus, ChevronLeft } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "فشل في تسجيل الدخول");
        return;
      }
      router.push("/account/profile");
    } catch {
      setError("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (regPassword !== regConfirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (regPassword.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, phone: regPhone, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "فشل في التسجيل");
        return;
      }
      router.push("/account/profile");
    } catch {
      setError("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-near-black py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-cream">حسابي</h1>
          <div className="gold-divider max-w-32 mx-auto mt-4" />
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-md px-6">
          {/* Toggle */}
          <div className="flex mb-6 bg-near-black/50 border border-warm-gold/10 rounded-lg overflow-hidden">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-body text-sm transition-colors ${isLogin ? "bg-warm-gold text-near-black font-medium" : "text-cream/60 hover:text-cream"}`}
            >
              <LogIn className="h-4 w-4" /> تسجيل دخول
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-body text-sm transition-colors ${!isLogin ? "bg-warm-gold text-near-black font-medium" : "text-cream/60 hover:text-cream"}`}
            >
              <UserPlus className="h-4 w-4" /> حساب جديد
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded font-body text-sm text-red-600">{error}</div>
          )}

          {/* Login form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-6 space-y-4">
              <div>
                <label className="font-body text-xs text-cream/60 mb-1 block">البريد الإلكتروني</label>
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
              </div>
              <div>
                <label className="font-body text-xs text-cream/60 mb-1 block">كلمة المرور</label>
                <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-warm-gold text-near-black py-2.5 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50">
                {loading ? "جاري الدخول..." : "تسجيل الدخول"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-6 space-y-4">
              <div>
                <label className="font-body text-xs text-cream/60 mb-1 block">الاسم الكامل</label>
                <input type="text" required value={regName} onChange={e => setRegName(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
              </div>
              <div>
                <label className="font-body text-xs text-cream/60 mb-1 block">البريد الإلكتروني</label>
                <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
              </div>
              <div>
                <label className="font-body text-xs text-cream/60 mb-1 block">رقم الهاتف</label>
                <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
              </div>
              <div>
                <label className="font-body text-xs text-cream/60 mb-1 block">كلمة المرور</label>
                <input type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
              </div>
              <div>
                <label className="font-body text-xs text-cream/60 mb-1 block">تأكيد كلمة المرور</label>
                <input type="password" required value={regConfirm} onChange={e => setRegConfirm(e.target.value)} className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-warm-gold text-near-black py-2.5 font-body text-sm font-medium hover:bg-gold-light transition-colors disabled:opacity-50">
                {loading ? "جاري التسجيل..." : "إنشاء حساب"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
