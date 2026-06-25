"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatAED, categoryHex } from "@/lib/utils";
import type { SummaryResponse } from "@/types";

interface ExpensePieChartProps {
  summary: SummaryResponse | null;
  loading: boolean;
  className?: string;
}

export function ExpensePieChart({
  summary,
  loading,
  className,
}: ExpensePieChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data =
    summary && summary.totalThisMonth > 0
      ? [
          {
            name: "Taxi",
            value: summary.taxiThisMonth,
            key: "taxi" as const,
          },
          {
            name: "Sinh hoạt",
            value: summary.marketThisMonth,
            key: "market" as const,
          },
        ]
      : [];

  const total = summary?.totalThisMonth ?? 0;
  const taxiPct = summary?.taxiPercentage ?? 0;
  const marketPct = summary?.marketPercentage ?? 0;

  return (
    <Card className={cn("flex h-full flex-col", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Tỷ lệ chi tiêu</CardTitle>
        <p className="text-[13px] text-muted-foreground">
          Phân bố Taxi & Sinh hoạt tháng này
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        {loading ? (
          <div className="flex h-[260px] items-center justify-center">
            <Skeleton className="h-44 w-44 rounded-full" />
          </div>
        ) : total === 0 ? (
          <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có giao dịch nào trong tháng này
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
            <div className="relative h-[180px] w-[180px] shrink-0">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <filter id="pieShadow" x="-10%" y="-10%" width="130%" height="130%">
                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="var(--taxi)" floodOpacity="0.15" />
                      </filter>
                    </defs>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={84}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                      startAngle={90}
                      endAngle={-270}
                      filter="url(#pieShadow)"
                    >
                      {data.map((entry) => (
                        <Cell
                          key={entry.key}
                          fill={categoryHex(entry.key)}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<PieTooltip />}
                      wrapperStyle={{ outline: "none" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
                  Tổng
                </p>
                <p className="mt-0.5 text-lg font-bold tracking-tight">
                  {formatAED(total)}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4 sm:flex-1">
              <LegendRow
                label="Taxi"
                amount={summary?.taxiThisMonth ?? 0}
                percent={taxiPct}
                barClass="bg-taxi"
                dotClass="bg-taxi"
              />
              <LegendRow
                label="Sinh hoạt"
                amount={summary?.marketThisMonth ?? 0}
                percent={marketPct}
                barClass="bg-market"
                dotClass="bg-market"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LegendRow({
  label,
  amount,
  percent,
  barClass,
  dotClass,
}: {
  label: string;
  amount: number;
  percent: number;
  barClass: string;
  dotClass: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-3 w-3 rounded-full shadow-sm", dotClass)} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-semibold tabular-nums">
          {formatAED(amount)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/60">
          <div
            className={cn("h-full rounded-full transition-all duration-700 ease-out", barClass)}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <span className="w-10 text-right text-xs font-semibold text-muted-foreground tabular-nums">
          {percent}%
        </span>
      </div>
    </div>
  );
}

interface PieTooltipPayloadItem {
  name: string;
  value: number;
  payload: { key: "taxi" | "market"; value: number };
}

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: PieTooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const total = item?.payload?.value ?? 0;
  return (
    <div className="rounded-xl border bg-popover px-3.5 py-2 text-xs shadow-lg backdrop-blur">
      <p className="font-semibold">{item.name}</p>
      <p className="mt-1 text-muted-foreground">{formatAED(total)}</p>
    </div>
  );
}