"use client";

import { useCallback, useEffect, useState } from "react";
import { transactionsApi } from "@/lib/api";
import type {
  ApiError,
  DashboardData,
  Transaction,
  TransactionFilters,
  TransactionInput,
} from "@/types";

type LoadingState = "idle" | "loading" | "error" | "success";

interface UseTransactionsState {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  status: LoadingState;
  error: string | null;
  refetch: () => Promise<void>;
  createTransaction: (input: TransactionInput) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
}

export function useTransactions(filters: TransactionFilters): UseTransactionsState {
  const [data, setData] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState<UseTransactionsState["meta"]>(null);
  const [status, setStatus] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await transactionsApi.list(filters);
      setData(res.data);
      setMeta(res.meta);
      setStatus("success");
    } catch (e) {
      const err = e as ApiError;
      setError(err.message);
      setStatus("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.month, filters.year, filters.category, filters.page, filters.limit]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const createTransaction = useCallback(async (input: TransactionInput) => {
    const created = await transactionsApi.create(input);
    await fetchData();
    return created;
  }, [fetchData]);

  const deleteTransaction = useCallback(async (id: string) => {
    await transactionsApi.delete(id);
    await fetchData();
  }, [fetchData]);

  return { data, meta, status, error, refetch: fetchData, createTransaction, deleteTransaction };
}

interface UseDashboardState {
  data: DashboardData | null;
  status: LoadingState;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(month?: number, year?: number): UseDashboardState {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await transactionsApi.dashboard(month, year);
      setData(res);
      setStatus("success");
    } catch (e) {
      const err = e as ApiError;
      setError(err.message);
      setStatus("error");
    }
  }, [month, year]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, status, error, refetch: fetchData };
}
