"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // In production, this would send to an API endpoint
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-near-black py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-body text-[11px] tracking-[0.3em] text-warm-gold/80 uppercase mb-3">
            نحب نسمع منك
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-4">
            اتصل بنا
          </h1>
          <div className="gold-divider max-w-32 mx-auto" />
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-2xl text-cream mb-6">
                معلومات التواصل
              </h2>
              <p className="font-body text-sm text-cream/60 leading-relaxed mb-8">
                نسعد بتواصلك معنا في أي وقت. يمكنك التواصل عبر واتساب أو الهاتف
                أو البريد الإلكتروني، أو ملء النموذج وسيتم الرد عليك في أقرب وقت.
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-warm-gold/30 bg-warm-gold/5">
                    <Phone className="h-5 w-5 text-warm-gold" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-cream/40">الهاتف</p>
                    <p className="font-body text-sm text-cream">+20 121 487 1459</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-warm-gold/30 bg-warm-gold/5">
                    <Mail className="h-5 w-5 text-warm-gold" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-cream/40">البريد الإلكتروني</p>
                    <p className="font-body text-sm text-cream">info@hm-store.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-warm-gold/30 bg-warm-gold/5">
                    <MapPin className="h-5 w-5 text-warm-gold" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-cream/40">العنوان</p>
                    <p className="font-body text-sm text-cream">القاهرة، مصر</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct link */}
              <a
                href="https://wa.me/201214871459"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 font-body text-sm font-medium rounded hover:opacity-90 transition-opacity"
              >
                تواصلي عبر واتساب
              </a>
            </div>

            {/* Contact Form */}
            <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warm-gold/10 border border-warm-gold/30">
                    <Send className="h-7 w-7 text-warm-gold" />
                  </div>
                  <h3 className="font-heading text-xl text-cream mb-2">
                    تم إرسال رسالتك بنجاح
                  </h3>
                  <p className="font-body text-sm text-cream/60">
                    سيتم الرد عليك في أقرب وقت
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-heading text-2xl text-cream mb-4">
                    أرسلي لنا رسالة
                  </h2>

                  <div>
                    <label className="block font-body text-xs text-cream/60 mb-1">
                      الاسم
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-xs text-cream/60 mb-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-xs text-cream/60 mb-1">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-xs text-cream/60 mb-1">
                      الرسالة
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-near-black/40 border border-warm-gold/20 rounded px-3 py-2 font-body text-sm text-cream outline-none focus:border-warm-gold/50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-warm-gold text-near-black py-2.5 font-body text-sm font-medium tracking-wide hover:bg-gold-light transition-colors disabled:opacity-50"
                  >
                    {submitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
