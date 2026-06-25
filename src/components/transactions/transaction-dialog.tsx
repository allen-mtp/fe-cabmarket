"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/transaction-form";
import type { Transaction } from "@/types";

interface TransactionDialogContextValue {
  open: boolean;
  openDialog: () => void;
  openEdit: (transaction: Transaction) => void;
  closeDialog: () => void;
  /** Tăng mỗi khi tạo/sửa thành công — page dùng để tự refetch danh sách. */
  createdVersion: number;
}

const TransactionDialogContext = React.createContext<TransactionDialogContextValue | null>(null);

export function useTransactionDialog() {
  const ctx = React.useContext(TransactionDialogContext);
  if (!ctx) {
    throw new Error("useTransactionDialog must be used within TransactionDialogProvider");
  }
  return ctx;
}

interface TransactionDialogProviderProps {
  children: React.ReactNode;
  onCreated?: (transaction: Transaction) => void;
}

export function TransactionDialogProvider({
  children,
  onCreated,
}: TransactionDialogProviderProps) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Transaction | null>(null);
  const [createdVersion, setCreatedVersion] = React.useState(0);

  const openDialog = React.useCallback(() => {
    setEditing(null);
    setOpen(true);
  }, []);
  const openEdit = React.useCallback((transaction: Transaction) => {
    setEditing(transaction);
    setOpen(true);
  }, []);
  const closeDialog = React.useCallback(() => setOpen(false), []);

  const handleSaved = React.useCallback(
    (transaction: Transaction) => {
      closeDialog();
      // Báo cho mọi page đang lắng nghe biết có dữ liệu mới -> tự refetch.
      setCreatedVersion((v) => v + 1);
      onCreated?.(transaction);
    },
    [closeDialog, onCreated],
  );

  const value = React.useMemo(
    () => ({ open, openDialog, openEdit, closeDialog, createdVersion }),
    [open, openDialog, openEdit, closeDialog, createdVersion],
  );

  return (
    <TransactionDialogContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa khoản chia" : "Chia tiền"}</DialogTitle>
            <DialogDescription>
              Ghi lại chuyến taxi hoặc khoản sinh hoạt — tự động chia cho những
              người đã đi.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            key={editing?.id ?? "new"}
            transaction={editing}
            onSuccess={handleSaved}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </TransactionDialogContext.Provider>
  );
}

export function useToastError() {
  return (message: string) => toast.error(message);
}
