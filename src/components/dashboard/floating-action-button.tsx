"use client";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTransactionDialog } from "@/components/transactions/transaction-dialog";

interface FloatingActionButtonProps {
  className?: string;
}

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const { openDialog } = useTransactionDialog();

  return (
    <button
      type="button"
      onClick={openDialog}
      aria-label="Thêm giao dịch nhanh"
      className={cn(
        "fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-taxi to-market text-white shadow-glow ring-4 ring-background transition-all duration-300 hover:scale-105 hover:shadow-glow active:scale-95 lg:hidden safe-bottom",
        className,
      )}
    >
      <Plus className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}