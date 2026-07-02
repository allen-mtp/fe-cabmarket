"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionTable } from "@/components/transactions/transaction-table";
import {
  HistoryFilters,
  type HistoryFiltersValue,
} from "@/components/transactions/history-filters";
import { useTransactionDialog } from "@/components/transactions/transaction-dialog";
import { useTransactions } from "@/hooks/use-transactions";
import type { TransactionFilters } from "@/types";

const PAGE_SIZE = 20;

export default function HistoryPage() {
  const [filters, setFilters] = React.useState<HistoryFiltersValue>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    category: "all",
  });
  const [page, setPage] = React.useState(1);

  const apiFilters: TransactionFilters = React.useMemo(
    () => ({
      month: filters.month === "all" ? undefined : filters.month,
      year: filters.year === "all" ? undefined : filters.year,
      category: filters.category,
      page,
      limit: PAGE_SIZE,
    }),
    [filters, page],
  );

  const { data, meta, status, refetch } = useTransactions(apiFilters);
  const { openDialog, createdVersion } = useTransactionDialog();

  const handleFiltersChange = (value: HistoryFiltersValue) => {
    setFilters(value);
    setPage(1);
  };

  React.useEffect(() => {
    if (createdVersion > 0) void refetch();
  }, [createdVersion, refetch]);

  React.useEffect(() => {
    if (meta && page > meta.totalPages) setPage(meta.totalPages);
  }, [meta, page]);

  const handleDeleted = React.useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleDeleteMany = React.useCallback((ids: string[]) => {
    void refetch();
  }, [refetch]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Lịch sử giao dịch
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Xem và quản lý toàn bộ chi tiêu của bạn.
          </p>
        </div>
        <Button onClick={openDialog} className="gap-1.5 rounded-lg" size="sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Thêm</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="h-5 w-5 text-muted-foreground" />
              Danh sách giao dịch
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {status === "loading" && !meta
                ? "Đang tải..."
                : (
                    <span>
                      <span className="font-semibold text-foreground">{meta?.total ?? 0}</span>{" "}
                      giao dịch
                    </span>
                  )}
            </p>
          </div>
          <div className="mt-4 border-t border-border/50 pt-4">
            <HistoryFilters value={filters} onChange={handleFiltersChange} />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:px-6">
          <TransactionTable
            transactions={data}
            loading={status === "loading"}
            onDeleted={handleDeleted}
            onDeleteMany={handleDeleteMany}
          />

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 border-t border-border/50 px-4 py-3 sm:px-0">
              <p className="text-xs text-muted-foreground">
                Trang {meta.page}/{meta.totalPages}
              </p>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 rounded-lg"
                  disabled={meta.page <= 1 || status === "loading"}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 rounded-lg"
                  disabled={meta.page >= meta.totalPages || status === "loading"}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}