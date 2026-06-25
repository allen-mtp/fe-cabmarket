"use client";

import { useCallback, useEffect, useState } from "react";
import { membersApi } from "@/lib/api";
import type { ApiError, MemberBalance } from "@/types";

type LoadingState = "idle" | "loading" | "error" | "success";

interface UseBalancesState {
  balances: MemberBalance[];
  status: LoadingState;
  error: string | null;
  refetch: () => Promise<void>;
  markPaid: (name: string) => Promise<void>;
}

/** Tổng hợp công nợ từng thành viên + thao tác đánh dấu đã trả. */
export function useBalances(): UseBalancesState {
  const [balances, setBalances] = useState<MemberBalance[]>([]);
  const [status, setStatus] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const list = await membersApi.balances();
      setBalances(list);
      setStatus("success");
    } catch (e) {
      const err = e as ApiError;
      setError(err.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const markPaid = useCallback(async (name: string) => {
    const list = await membersApi.settle(name);
    setBalances(list);
    setStatus("success");
  }, []);

  return { balances, status, error, refetch: fetchData, markPaid };
}
