"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  categoryHex,
  cn,
  formatAED,
  formatAEDCompact,
} from "@/lib/utils";
import type { MonthlyComparison } from "@/types";

interface MonthlyBarChartProps {
  data: MonthlyComparison[] | null;
  loading: boolean;
  className?: string;
}

export function MonthlyBarChart({
  data,
  loading,
  className,
}: MonthlyBarChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const chartData = data ?? [];

  return (
    <Card className={cn("flex h-full flex-col", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">So sánh theo tháng</CardTitle>
        <p className="text-[13px] text-muted-foreground">
          Chi tiêu các tháng gần đây
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        {loading ? (
          <div className="flex h-[280px] items-end gap-3 px-2">
            {[60, 80, 45, 90].map((h, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t-lg"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Chưa có dữ liệu để hiển thị
            </p>
          </div>
        ) : (
          <div className="h-[280px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                  barGap={3}
                  barCategoryGap="28%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.4}
                  />
                  <XAxis
                    dataKey="monthLabel"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fontWeight: 500, fill: "hsl(var(--muted-foreground))" }}
                    dy={6}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fontWeight: 500, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(v) => formatAEDCompact(Number(v))}
                    width={52}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.3, radius: 8 }}
                    content={<BarTooltip />}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={9}
                    wrapperStyle={{ fontSize: 12, paddingTop: 16, fontWeight: 500 }}
                  />
                  <Bar
                    dataKey="taxi"
                    name="Taxi"
                    fill={categoryHex("taxi")}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="market"
                    name="Sinh hoạt"
                    fill={categoryHex("market")}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function BarTooltip({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + (p.value ?? 0), 0);
  return (
    <div className="rounded-xl border bg-popover px-3.5 py-2.5 text-xs shadow-lg backdrop-blur">
      <p className="font-semibold">{label}</p>
      <div className="mt-2 space-y-1.5">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-semibold">{formatAED(p.value)}</span>
          </div>
        ))}
        <div className="mt-2 border-t border-border/50 pt-2">
          <span className="text-muted-foreground">Tổng:</span>{" "}
          <span className="font-bold">{formatAED(total)}</span>
        </div>
      </div>
    </div>
  );
}