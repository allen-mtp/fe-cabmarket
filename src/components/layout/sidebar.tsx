"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  Users,
  Coins,
  PieChart,
  Wallet,
  LogOut,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/components/auth-provider";

const iconMap = {
  LayoutDashboard,
  ReceiptText,
  Users,
  Coins,
  PieChart,
} as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  return (
    <aside className="glass-strong fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border/50 lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/50 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-taxi to-market text-white shadow-glow-sm">
          <Wallet className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">CabMarket</p>
          <p className="text-[11px] text-muted-foreground">
            Quản lý chi tiêu
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-taxi/15 via-taxi/10 to-market/10 text-foreground shadow-sm ring-1 ring-taxi/10"
                  : "text-muted-foreground hover:bg-accent/80 hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  active
                    ? "text-taxi"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span>{item.label}</span>
              {active && (
                <span className="absolute right-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-taxi shadow-sm shadow-taxi/40" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-accent/60">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-taxi to-market text-[11px] font-semibold text-white shadow-sm">
            {getInitials(user?.name) || getInitials(user?.email) || "U"}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium">
              {user?.name ?? "Tài khoản"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {user?.email ?? ""}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Đăng xuất"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between px-2.5 pt-1">
          <p className="text-[10px] text-muted-foreground/60">
            © {new Date().getFullYear()} CabMarket
          </p>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

function getInitials(value?: string): string {
  if (!value) return "";
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}