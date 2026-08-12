"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Image, Truck, BarChart3, LogOut, Menu, X, Settings } from "lucide-react";

const navItems = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/customers", label: "العملاء", icon: Users },
  { href: "/admin/coupons", label: "الكوبونات", icon: Tag },
  { href: "/admin/banners", label: "البانرات", icon: Image },
  { href: "/admin/shipping", label: "الشحن", icon: Truck },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user?.role === "admin") setAuthorized(true);
        else router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) return <div className="min-h-screen bg-near-black flex items-center justify-center"><div className="animate-shimmer w-32 h-8 rounded bg-near-black/50" /></div>;
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-near-black flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-56 bg-near-black border-l border-warm-gold/15 transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-warm-gold/10 flex items-center justify-between">
          <Link href="/admin" className="font-heading text-2xl font-bold text-warm-gold">HM</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-cream/40 hover:text-cream"><X className="h-5 w-5" /></button>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded font-body text-sm transition-colors ${active ? "bg-warm-gold/15 text-warm-gold" : "text-cream/50 hover:text-cream hover:bg-cream/5"}`}>
                <Icon className="h-4 w-4" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 right-0 left-0 p-3 border-t border-warm-gold/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded font-body text-sm text-red-400 hover:text-red-300 w-full">
            <LogOut className="h-4 w-4" />تسجيل خروج
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-near-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <div className="sticky top-0 z-30 bg-near-black/90 backdrop-blur-sm border-b border-warm-gold/10 px-4 py-3 flex items-center justify-between lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-cream/60 hover:text-cream"><Menu className="h-5 w-5" /></button>
          <span className="font-body text-xs text-cream/30">لوحة تحكم HM</span>
        </div>
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
