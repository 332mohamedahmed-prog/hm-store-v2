"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function AccountProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => {
        if (r.ok) {
          setAuthorized(true);
        } else {
          router.replace("/account");
        }
      })
      .catch(() => router.replace("/account"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-near-black/40">
        <div className="animate-shimmer w-32 h-8 rounded bg-near-black/50" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <AccountSidebar />
          </div>
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
