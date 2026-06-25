"use client";

import * as React from "react";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SummaryCards,
  SummaryCardsSkeleton,
} from "@/components/dashboard/summary-cards";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { MonthlyBarChart } from "@/components/dashboard/monthly-bar-chart";
import { FloatingActionButton } from "@/components/dashboard/floating-action-button";
import { useTransactionDialog } from "@/components/transactions/transaction-dialog";
import { useDashboard } from "@/hooks/use-transactions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS_VI, YEARS_RANGE } from "@/lib/constants";
import { cn, formatAED } from "@/lib/utils";

export default function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = React.useState(now.getMonth() + 1);
  const [year, setYear] = React.useState(now.getFullYear());

  const { data, status, refetch } = useDashboard(month, year);
  const { openDialog, createdVersion } = useTransactionDialog();

  const loading = status === "loading" && !data;

  React.useEffect(() => {
    if (createdVersion > 0) {
      void refetch();
    }
  }, [createdVersion, refetch]);

  const greeting = getGreeting();
  const monthLabel = `${MONTHS_VI[month - 1]} ${year}`;

  const diff = data?.summary
    ? data.summary.totalThisMonth - data.summary.lastMonthTotal
    : 0;
  const diffPercent =
    data?.summary && data.summary.lastMonthTotal > 0
      ? Math.round(
          (Math.abs(diff) / data.summary.lastMonthTotal) * 100,
        )
      : 0;
  const isUp = diff > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-taxi-soft/30 p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-taxi/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 right-24 h-32 w-32 rounded-full bg-market/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-muted-foreground">
              {greeting}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Tổng quan chi tiêu
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">{monthLabel}</p>
              {data?.summary && !loading && diffPercent > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
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
                  {isUp ? "+" : "-"}
                  {diffPercent}% so với tháng trước
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
              <SelectTrigger className="h-9 w-[130px] bg-background/80 backdrop-blur">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS_VI.map((m, i) => (
                  <SelectItem key={i} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger className="h-9 w-[100px] bg-background/80 backdrop-blur">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS_RANGE.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openDialog} className="shrink-0 gap-1.5 rounded-lg" size="sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Thêm</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      {loading ? (
        <SummaryCardsSkeleton />
      ) : (
        <SummaryCards summary={data?.summary ?? null} loading={false} />
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <ExpensePieChart
          summary={data?.summary ?? null}
          loading={loading}
          className="lg:col-span-2"
        />
        <MonthlyBarChart
          data={data?.monthlyComparison ?? null}
          loading={loading}
          className="lg:col-span-3"
        />
      </div>

      <FloatingActionButton />
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng";
  if (h < 14) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}