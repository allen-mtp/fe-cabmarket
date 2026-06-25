"use client";

import * as React from "react";
import Link from "next/link";
import { Wallet, LogOut, Loader2 } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileHeader() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  };

  return (
    <header className="glass-strong safe-top sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/50 px-4 lg:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-taxi to-market text-white shadow-sm">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold">CabMarket</span>
      </Link>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-taxi to-market text-[10px] font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
              aria-label="Tài khoản"
            >
              {getInitials(user?.name) || getInitials(user?.email) || "U"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="truncate">
              <p className="truncate text-sm font-medium">
                {user?.name ?? "Tài khoản"}
              </p>
              <p className="truncate text-xs font-normal text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-destructive focus:text-destructive"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function getInitials(value?: string): string {
  if (!value) return "";
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}