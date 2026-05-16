"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Home, LayoutDashboard, Plane, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/flight-deals", label: "Flights", icon: Plane },
  { href: "/buy-forex", label: "Forex", icon: CreditCard },
  { href: "/ai-travel-planner", label: "AI Plan", icon: Sparkles },
  { href: "/dashboard", label: "Account", icon: LayoutDashboard }
];

export function MobileBottomNav() {
  const pathname = usePathname();
  return <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
    <div className="grid grid-cols-5">
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-0.5 py-2 text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>;
      })}
    </div>
  </nav>;
}
