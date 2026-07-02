"use client";

import * as React from "react";
import { ArrowRightLeft, Check, Coins, Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBalances } from "@/hooks/use-balances";
import { useTransactionDialog } from "@/components/transactions/transaction-dialog";
import { cn, formatAED } from "@/lib/utils";
import type { MemberBalance } from "@/types";

export default function BalancesPage() {
  const { balances, status, refetch, markPaid } = useBalances();
  const { createdVersion } = useTransactionDialog();

  React.useEffect(() => {
    if (createdVersion > 0) void refetch();
  }, [createdVersion, refetch]);

  const loading = status === "loading" && balances.length === 0;

  const totalToCollect = balances
    .filter((b) => b.balance > 0)
    .reduce((s, b) => s + b.balance, 0);
  const totalToPay = balances
    .filter((b) => b.balance < 0)
    .reduce((s, b) => s + Math.abs(b.balance), 0);
  const allMembers = balances.sort((a, b) => a.balance - b.balance);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Công nợ</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theo dõi ai đang nợ ai bao nhiêu.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="relative overflow-hidden border-taxi/20 bg-gradient-to-br from-taxi/5 to-transparent">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-taxi/10 blur-xl" />
          <CardContent className="relative p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-taxi/15 text-taxi">
                <Wallet className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">Còn phải thu</p>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-taxi sm:text-3xl">
              {loading ? "—" : formatAED(totalToCollect)}
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-market/20 bg-gradient-to-br from-market/5 to-transparent">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-market/10 blur-xl" />
          <CardContent className="relative p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-market/15 text-market">
                <ArrowRightLeft className="h-4.5 w-4.5" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">Còn phải trả</p>
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-market sm:text-3xl">
              {loading ? "—" : formatAED(totalToPay)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-muted-foreground" />
            Theo thành viên
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {loading ? (
            <BalanceSkeleton />
          ) : allMembers.length === 0 ? (
            <EmptyState />
          ) : (
            allMembers.map((b) => (
              <BalanceRow key={b.name} balance={b} onMarkPaid={markPaid} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BalanceRow({
  balance,
  onMarkPaid,
}: {
  balance: MemberBalance;
  onMarkPaid: (name: string) => Promise<void>;
}) {
  const [busy, setBusy] = React.useState(false);

  const handlePay = async () => {
    setBusy(true);
    try {
      await onMarkPaid(balance.name);
      toast.success(`${balance.name} đã thanh toán`);
    } catch {
      toast.error("Không thể cập nhật, thử lại");
    } finally {
      setBusy(false);
    }
  };

  const initials = balance.name.trim().slice(0, 2).toUpperCase();
  const isOwed = balance.balance > 0;
  const isZero = balance.balance === 0;
  const abs = Math.abs(balance.balance);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-200",
        isZero
          ? "border-market/25 bg-market/[0.04]"
          : isOwed
            ? "border-taxi/20 bg-taxi/[0.03]"
            : "border-market/20 bg-market/[0.03]",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-sm",
          isZero
            ? "bg-market/15 text-market"
            : isOwed
              ? "bg-gradient-to-br from-taxi to-taxi/80 text-white"
              : "bg-gradient-to-br from-market to-market/80 text-white",
        )}
      >
        {isZero ? <Check className="h-5 w-5" strokeWidth={2.5} /> : initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold">{balance.name}</p>
          {isZero ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-market/15 px-2.5 py-0.5 text-[11px] font-semibold text-market">
              <Check className="h-3 w-3" strokeWidth={3} />
              Đã xong
            </span>
          ) : isOwed ? (
            <span className="inline-flex shrink-0 items-center rounded-full bg-taxi/10 px-2.5 py-0.5 text-[11px] font-semibold text-taxi">
              Nợ mình
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center rounded-full bg-market/10 px-2.5 py-0.5 text-[11px] font-semibold text-market">
              Mình nợ
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
          {isZero ? (
            <>Đã trả {formatAED(balance.lent)}
              {balance.loan > 0 && <> · đã chi {formatAED(balance.loan)}</>}
            </>
          ) : (
            <>
              {isOwed ? "Phải thu " : "Phải trả "}
              <span className="font-semibold text-foreground">{formatAED(abs)}</span>
              {balance.settled > 0 && <> · đã trả {formatAED(balance.settled)}</>}
            </>
          )}
        </p>
      </div>

      {!isZero && (
        <Button
          type="button"
          size="sm"
          onClick={handlePay}
          disabled={busy}
          className="shrink-0 gap-1.5 rounded-lg"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Đã trả</span>
        </Button>
      )}
    </div>
  );
}

function BalanceSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border/50 p-3.5">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60">
        <Coins className="h-7 w-7 text-muted-foreground/60" />
      </div>
      <div>
        <p className="text-sm font-medium">Chưa có công nợ nào</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Thêm vài khoản chia tiền để xem ai cần trả bao nhiêu.
        </p>
      </div>
    </div>
  );
}