"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { TransactionDialogProvider } from "@/components/transactions/transaction-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { initializing, user } = useAuth();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!initializing && !user) {
      window.location.assign(
        `/login?from=${encodeURIComponent(pathname)}`,
      );
    }
  }, [initializing, user, pathname]);

  if (initializing || !user) {
    return <AuthSplash />;
  }

  return (
    <TransactionDialogProvider>
      <div className="app-surface min-h-screen">
        <Sidebar />
        <MobileHeader />
        <main className="lg:pl-64">
          <div className="w-full px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-7">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </TransactionDialogProvider>
  );
}

function AuthSplash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
