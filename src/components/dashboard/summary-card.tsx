"use client";

import { cn, formatAED } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  amount: number;
  icon: React.ReactNode;
  tone: "default" | "taxi" | "market";
  subtitle?: React.ReactNode;
  progress?: number;
  loading?: boolean;
  className?: string;
}

const toneStyles = {
  default: {
    icon: "bg-gradient-to-br from-taxi to-market text-white shadow-lg shadow-taxi/25",
    glow: "from-taxi/10",
    bar: "from-taxi to-market",
  },
  taxi: {
    icon: "bg-gradient-to-br from-taxi to-indigo-400 text-white shadow-lg shadow-taxi/25",
    glow: "from-taxi/10",
    bar: "from-taxi to-indigo-400",
  },
  market: {
    icon: "bg-gradient-to-br from-market to-emerald-400 text-white shadow-lg shadow-market/25",
    glow: "from-market/10",
    bar: "from-market to-emerald-400",
  },
} as const;

export function SummaryCard({
  label,
  amount,
  icon,
  tone,
  subtitle,
  progress,
  loading,
  className,
}: SummaryCardProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover",
        className,
      )}
    >
      {/* Quầng sáng nhẹ góc trên */}
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
          styles.glow,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <div className="skeleton mt-2.5 h-8 w-32" />
          ) : (
            <p className="mt-1.5 truncate text-[28px] font-bold leading-tight tracking-tight tabular-nums">
              {formatAED(amount)}
            </p>
          )}
          {subtitle && !loading && (
            <div className="mt-2 text-xs text-muted-foreground">{subtitle}</div>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
            styles.icon,
          )}
        >
          {icon}
        </div>
      </div>

      {typeof progress === "number" && !loading && (
        <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
              styles.bar,
            )}
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
