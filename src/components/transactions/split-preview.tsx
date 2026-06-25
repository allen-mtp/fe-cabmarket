"use client";

import * as React from "react";
import { Calculator, Wallet } from "lucide-react";

import { cn, formatAED } from "@/lib/utils";
import { computeSplit } from "@/lib/split";

interface SplitPreviewProps {
  amount: number;
  participants: string[];
  payer: string;
  accent: "taxi" | "market";
}

/**
 * Thẻ xem trước kết quả chia tiền — cập nhật trực tiếp khi nhập số tiền /
 * chọn người đi. Hiển thị mỗi người bao nhiêu và ai nợ người trả.
 */
export function SplitPreview({
  amount,
  participants,
  payer,
  accent,
}: SplitPreviewProps) {
  const split = React.useMemo(
    () => computeSplit(amount, participants, payer),
    [amount, participants, payer],
  );

  if (split.count === 0 || amount <= 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-5 text-center">
        <Calculator className="mx-auto h-5 w-5 text-muted-foreground" />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Nhập số tiền và chọn người đi để xem chia tự động.
        </p>
      </div>
    );
  }

  const accentText = accent === "taxi" ? "text-taxi" : "text-market";
  const accentBgSoft = accent === "taxi" ? "bg-taxi/5" : "bg-market/5";
  const accentBorder = accent === "taxi" ? "border-taxi/20" : "border-market/20";

  return (
    <div className={cn("rounded-xl border p-4", accentBorder, accentBgSoft)}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <Calculator className={cn("h-4 w-4", accentText)} />
          Chia tự động
        </span>
        <span className="text-xs text-muted-foreground">
          {formatAED(amount)} ÷ {split.count} người
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-xs text-muted-foreground">Mỗi người</span>
        <span className={cn("text-2xl font-bold tabular-nums", accentText)}>
          {formatAED(split.perPerson)}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        {split.shares.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between rounded-lg bg-background/70 px-3 py-1.5 text-sm"
          >
            <span className="flex items-center gap-2 truncate">
              <span className="truncate font-medium">{s.name}</span>
              {s.isPayer && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    accent === "taxi"
                      ? "bg-taxi/15 text-taxi"
                      : "bg-market/15 text-market",
                  )}
                >
                  <Wallet className="h-2.5 w-2.5" />
                  Người trả
                </span>
              )}
            </span>
            <span className="tabular-nums font-semibold">
              {formatAED(s.amount)}
            </span>
          </div>
        ))}
      </div>

      {payer && split.owedToPayer > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Mọi người cần trả lại{" "}
          <span className={cn("font-semibold", accentText)}>{payer}</span> tổng
          cộng{" "}
          <span className="font-semibold text-foreground">
            {formatAED(split.owedToPayer)}
          </span>
          .
        </p>
      )}
    </div>
  );
}
