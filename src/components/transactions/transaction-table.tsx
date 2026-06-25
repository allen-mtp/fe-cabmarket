"use client";

import * as React from "react";
import { Loader2, Pencil, Sunrise, Sunset, Trash2, UserRound, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBadge } from "@/components/transactions/category-badge";
import { useTransactionDialog } from "@/components/transactions/transaction-dialog";
import { cn, formatDate, formatAED } from "@/lib/utils";
import { computeSplit } from "@/lib/split";
import { SESSION_LABELS } from "@/lib/constants";
import type { Transaction } from "@/types";
import { transactionsApi } from "@/lib/api";

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  onDeleted?: (id: string) => void;
}

export function TransactionTable({
  transactions,
  loading,
  onDeleted,
}: TransactionTableProps) {
  if (loading) {
    return <TableSkeleton />;
  }

  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[110px] text-[10px] font-semibold uppercase tracking-[0.12em]">Ngày</TableHead>
          <TableHead className="text-[10px] font-semibold uppercase tracking-[0.12em]">Khoản chia</TableHead>
          <TableHead className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] md:table-cell">Người đi</TableHead>
          <TableHead className="text-right text-[10px] font-semibold uppercase tracking-[0.12em]">Số tiền</TableHead>
          <TableHead className="w-[60px] text-right" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TransactionRow key={tx.id} transaction={tx} onDeleted={onDeleted} />
        ))}
      </TableBody>
    </Table>
  );
}

function SessionPill({ session }: { session: NonNullable<Transaction["session"]> }) {
  const Icon = session === "sang" ? Sunrise : Sunset;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      <Icon className="h-3 w-3" />
      {SESSION_LABELS[session]}
    </span>
  );
}

function TransactionRow({
  transaction,
  onDeleted,
}: {
  transaction: Transaction;
  onDeleted?: (id: string) => void;
}) {
  const [deleting, setDeleting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { openEdit } = useTransactionDialog();

  const participants = transaction.participants ?? [];
  const payer = transaction.payer ?? "";
  const split = computeSplit(transaction.amount, participants, payer);
  const perPerson = split.count > 0 ? split.perPerson : 0;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await transactionsApi.delete(transaction.id);
      toast.success("Đã xóa khoản chia");
      onDeleted?.(transaction.id);
      setOpen(false);
    } catch (e) {
      const err = e as { message?: string };
      toast.error(err.message ?? "Không thể xóa");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <TableRow className="group align-top transition-colors hover:bg-accent/40">
      <TableCell className="whitespace-nowrap py-3 text-sm text-muted-foreground">
        {formatDate(transaction.date)}
      </TableCell>

      <TableCell className="py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={transaction.category} />
          {transaction.session && <SessionPill session={transaction.session} />}
        </div>
        {transaction.note && (
          <p className="mt-1 truncate text-xs font-medium text-foreground/90">
            {transaction.note}
          </p>
        )}
        {payer && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <UserRound className="h-3 w-3" />
            Trả: <span className="font-medium text-foreground">{payer}</span>
          </p>
        )}
        <div className="md:hidden">
          {participants.length > 0 && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {participants.join(", ")}
            </p>
          )}
        </div>
      </TableCell>

      <TableCell className="hidden py-3 text-sm text-muted-foreground md:table-cell">
        {participants.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {participants.map((p) => (
              <span
                key={p}
                className={cn(
                  "rounded-lg px-2 py-0.5 text-xs font-medium",
                  p === payer
                    ? "bg-taxi/10 text-taxi"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {p}
              </span>
            ))}
          </div>
        ) : (
          "—"
        )}
      </TableCell>

      <TableCell className="whitespace-nowrap py-3 text-right">
        <div className="text-sm font-bold tabular-nums">
          {formatAED(transaction.amount)}
        </div>
        {perPerson > 0 && (
          <div className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
            {formatAED(perPerson)}/người
          </div>
        )}
      </TableCell>

      <TableCell className="py-3 text-right">
        <div className="flex items-center justify-end gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEdit(transaction)}
            className="h-8 w-8 rounded-lg text-muted-foreground/60 transition-all hover:bg-accent hover:text-foreground hover:opacity-100 group-hover:opacity-100"
            aria-label="Sửa khoản chia"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground/60 transition-all hover:bg-destructive/10 hover:text-destructive hover:opacity-100 group-hover:opacity-100"
                aria-label="Xóa khoản chia"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa khoản chia này?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Khoản{" "}
                <span className="font-medium text-foreground">
                  {formatAED(transaction.amount)}
                </span>{" "}
                ({transaction.category === "taxi" ? "Taxi" : "Sinh hoạt"}) sẽ bị
                xóa vĩnh viễn.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  void handleDelete();
                }}
                disabled={deleting}
                className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[110px]">Ngày</TableHead>
          <TableHead>Khoản chia</TableHead>
          <TableHead className="hidden md:table-cell">Người đi</TableHead>
          <TableHead className="text-right">Số tiền</TableHead>
          <TableHead className="w-[60px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 6 }).map((_, i) => (
          <TableRow key={i} className="hover:bg-transparent">
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-4 w-24" />
            </TableCell>
            <TableCell />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60">
        <Users className="h-7 w-7 text-muted-foreground/60" />
      </div>
      <div>
        <p className="text-sm font-medium">Chưa có khoản chia nào</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Thử thay đổi bộ lọc hoặc thêm khoản chia mới.
        </p>
      </div>
    </div>
  );
}