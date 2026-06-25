"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  Users,
  Coins,
  PieChart,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const iconMap = {
  LayoutDashboard,
  ReceiptText,
  Users,
  Coins,
  PieChart,
} as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-strong safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-border/50 lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {NAV_ITEMS.map((item, idx) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium transition-all duration-200",
                active ? "text-taxi" : "text-muted-foreground",
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <span
                className={cn(
                  "relative flex h-9 w-12 items-center justify-center rounded-xl transition-all duration-200",
                  active &&
                    "bg-gradient-to-br from-taxi/15 to-market/10 ring-1 ring-taxi/15",
                )}
              >
                <Icon className={cn("h-[18px] w-[18px] transition-transform duration-200", active && "scale-110")} />
              </span>
              <span className="truncate">{item.label}</span>
              {active && (
                <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-taxi to-market" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}