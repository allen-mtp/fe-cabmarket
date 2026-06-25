"use client";

import * as React from "react";
import { Crown, PieChart, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSpending } from "@/hooks/use-spending";
import { useTransactionDialog } from "@/components/transactions/transaction-dialog";
import { MONTHS_VI, YEARS_RANGE } from "@/lib/constants";
import { cn, formatAED } from "@/lib/utils";
import type { MemberSpending } from "@/types";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#0ea5e9", "#a855f7"];

type MonthFilter = "all" | number;

export default function SpendingPage() {
  const now = new Date();
  const [month, setMonth] = React.useState<MonthFilter>(now.getMonth() + 1);
  const [year, setYear] = React.useState(now.getFullYear());

  const queryMonth = typeof month === "number" ? month : 1;
  const queryYear = year;
  const isAll = month === "all";
  const mode = isAll ? "all" : undefined;

  const { data, status, refetch } = useSpending(queryMonth, queryYear, mode);
  const { createdVersion } = useTransactionDialog();

  React.useEffect(() => {
    if (createdVersion > 0) void refetch();
  }, [createdVersion, refetch]);

  const loading = status === "loading" && !data;
  const items = isAll ? (data?.allTimeItems ?? []) : (data?.items ?? []);
  const total = isAll ? (data?.allTimeTotal ?? 0) : (data?.total ?? 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Chi tiêu theo người
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tổng tiền mỗi người đã chi.
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(v === "all" ? "all" : Number(v))}
          >
            <SelectTrigger className="h-9 w-[118px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {MONTHS_VI.map((m, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="h-9 w-[96px]">
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
        </div>
      </div>

      {/* Thẻ tổng chi */}
      <Card className="overflow-hidden border-0 shadow-soft">
        <CardContent
          className={cn(
            "relative p-5 text-white",
            isAll
              ? "bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950"
              : "bg-gradient-to-br from-taxi to-market",
          )}
        >
          <div className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-xs font-medium text-white/80">
              {isAll
                ? `Tổng chi cả năm ${queryYear}`
                : `Tổng chi ${MONTHS_VI[queryMonth - 1]} ${queryYear}`}
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums">
              {loading ? "—" : formatAED(total)}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
              <Users className="h-3.5 w-3.5" />
              {loading ? "—" : `${items.length} người`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Biểu đồ phân bổ + chú thích */}
      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-6 p-6 md:flex-row">
            <Skeleton className="h-44 w-44 shrink-0 rounded-full" />
            <div className="w-full flex-1 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <EmptyState isAll={isAll} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-6 p-6 md:flex-row md:gap-8">
            <Donut items={items} total={total} />
            <ul className="w-full flex-1 divide-y">
              {items.map((it, i) => (
                <LegendRow key={it.name} item={it} rank={i} total={total} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/** Donut tổng hợp: mỗi người là một cung, dùng pathLength=100 để tính theo %. */
function Donut({ items, total }: { items: MemberSpending[]; total: number }) {
  let offset = 0;
  const segments = items.map((it, i) => {
    const pct = total > 0 ? (it.amount / total) * 100 : 0;
    const seg = { pct, color: COLORS[i % COLORS.length], offset };
    offset += pct;
    return seg;
  });

  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          className="text-muted"
          stroke="currentColor"
          strokeWidth="13"
        />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={s.color}
            strokeWidth="13"
            pathLength={100}
            strokeDasharray={`${Math.max(s.pct - 1, 0)} ${100 - Math.max(s.pct - 1, 0)}`}
            strokeDashoffset={-s.offset}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] text-muted-foreground">Tổng</span>
        <span className="px-2 text-center text-sm font-bold leading-tight tabular-nums">
          {formatAED(total)}
        </span>
      </div>
    </div>
  );
}

function LegendRow({
  item,
  rank,
  total,
}: {
  item: MemberSpending;
  rank: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((item.amount / total) * 100) : 0;
  const color = COLORS[rank % COLORS.length];

  return (
    <li className="flex items-center gap-3 py-2.5">
      <span
        className="h-3 w-3 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="flex min-w-0 flex-1 items-center gap-1.5">
        <span className="truncate font-medium">{item.name}</span>
        {rank === 0 && <Crown className="h-3.5 w-3.5 shrink-0 text-amber-400" />}
      </span>
      <span className="shrink-0 text-right">
        <span className="text-sm font-semibold tabular-nums">
          {formatAED(item.amount)}
        </span>
        <span className="ml-2 text-xs text-muted-foreground tabular-nums">
          {pct}%
        </span>
      </span>
    </li>
  );
}

function EmptyState({ isAll }: { isAll: boolean }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <PieChart className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {isAll ? "Chưa có giao dịch nào trong năm" : "Chưa có chi tiêu tháng này"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Thêm khoản chia tiền để xem mỗi người đã chi bao nhiêu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}