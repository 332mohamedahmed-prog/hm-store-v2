"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, Heart, LogOut, ChevronLeft } from "lucide-react";

const links = [
  { href: "/account/profile", label: "بياناتي", icon: User },
  { href: "/account/orders", label: "طلباتي", icon: Package },
  { href: "/account/wishlist", label: "المفضلة", icon: Heart },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUserName(data.user.name); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/account");
  };

  return (
    <div className="bg-near-black/50 border border-warm-gold/10 rounded-lg p-5 space-y-4 sticky top-24">
      <div className="text-center mb-4">
        <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-warm-gold/10 border border-warm-gold/30 flex items-center justify-center">
          <User className="h-6 w-6 text-warm-gold" />
        </div>
        <p className="font-body text-sm font-medium text-cream">{userName || "حسابي"}</p>
      </div>

      <div className="gold-divider" />

      <nav className="space-y-1">
        {links.map(link => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded font-body text-sm transition-colors ${active ? "bg-warm-gold/10 text-warm-gold font-medium" : "text-cream/60 hover:text-warm-gold hover:bg-warm-gold/5"}`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="gold-divider" />

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded font-body text-sm text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
      >
        <LogOut className="h-4 w-4" />
        تسجيل خروج
      </button>
    </div>
  );
}
