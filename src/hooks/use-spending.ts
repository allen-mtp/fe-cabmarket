"use client";

import { useCallback, useEffect, useState } from "react";
import { membersApi } from "@/lib/api";
import type { ApiError, SpendingSummary } from "@/types";

type LoadingState = "idle" | "loading" | "error" | "success";

interface UseSpendingState {
  data: SpendingSummary | null;
  status: LoadingState;
  error: string | null;
  refetch: () => Promise<void>;
}

/** Chi tiêu mỗi người theo tháng/chế độ (chỉ đọc). */
export function useSpending(
  month: number,
  year: number,
  mode?: "all",
): UseSpendingState {
  const [data, setData] = useState<SpendingSummary | null>(null);
  const [status, setStatus] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await membersApi.spending(month, year, mode);
      setData(res);
      setStatus("success");
    } catch (e) {
      setError((e as ApiError).message);
      setStatus("error");
    }
  }, [month, year, mode]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, status, error, refetch: fetchData };
}
