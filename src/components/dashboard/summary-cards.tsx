"use client";

import {
  Wallet,
  Car,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { SummaryCard } from "@/components/dashboard/summary-card";
import { cn } from "@/lib/utils";
import type { SummaryResponse } from "@/types";

interface SummaryCardsProps {
  summary: SummaryResponse | null;
  loading: boolean;
}

export function SummaryCards({ summary, loading }: SummaryCardsProps) {
  const diff = summary ? summary.totalThisMonth - summary.lastMonthTotal : 0;
  const diffPercent =
    summary && summary.lastMonthTotal > 0
      ? Math.round((diff / summary.lastMonthTotal) * 100)
      : null;
  const isUp = diff >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        label="Tổng chi tiêu"
        amount={summary?.totalThisMonth ?? 0}
        loading={loading}
        tone="default"
        icon={<Wallet className="h-5 w-5" />}
        subtitle={
          summary && !loading ? (
            <span className="inline-flex items-center gap-1">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                  isUp
                    ? "bg-destructive/10 text-destructive"
                    : "bg-market/10 text-market",
                )}
              >
                {isUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isUp ? "+" : ""}
                {diffPercent !== null ? `${diffPercent}%` : "—"}
              </span>
              <span className="ml-0.5">so với tháng trước</span>
            </span>
          ) : undefined
        }
      />

      <SummaryCard
        label="Tiền Taxi"
        amount={summary?.taxiThisMonth ?? 0}
        loading={loading}
        tone="taxi"
        icon={<Car className="h-5 w-5" />}
        progress={summary?.taxiPercentage ?? 0}
        subtitle={
          summary && !loading ? (
            <span>
              Chiếm{" "}
              <span className="font-semibold text-taxi">
                {summary.taxiPercentage}%
              </span>{" "}
              tổng chi tiêu
            </span>
          ) : undefined
        }
      />

      <SummaryCard
        label="Tiền Sinh hoạt"
        amount={summary?.marketThisMonth ?? 0}
        loading={loading}
        tone="market"
        icon={<ShoppingCart className="h-5 w-5" />}
        progress={summary?.marketPercentage ?? 0}
        subtitle={
          summary && !loading ? (
            <span>
              Chiếm{" "}
              <span className="font-semibold text-market">
                {summary.marketPercentage}%
              </span>{" "}
              tổng chi tiêu
            </span>
          ) : undefined
        }
      />
    </div>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="overflow-hidden rounded-2xl border bg-card p-5 shadow-card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton mt-2.5 h-8 w-36" />
              <div className="skeleton mt-2.5 h-3 w-28" />
            </div>
            <div className="skeleton h-12 w-12 rounded-2xl" />
          </div>
          <div className="skeleton mt-4 h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}