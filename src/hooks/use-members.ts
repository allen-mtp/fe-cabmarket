"use client";

import { useCallback, useEffect, useState } from "react";
import { membersApi } from "@/lib/api";
import type { ApiError } from "@/types";

type LoadingState = "idle" | "loading" | "error" | "success";

interface UseMembersState {
  members: string[];
  status: LoadingState;
  error: string | null;
  refetch: () => Promise<void>;
  saveMembers: (members: string[]) => Promise<string[]>;
}

/**
 * Quản lý roster thành viên của user. Dùng ở form chia tiền (đọc) và trang
 * Cài đặt (đọc + ghi).
 */
export function useMembers(): UseMembersState {
  const [members, setMembers] = useState<string[]>([]);
  const [status, setStatus] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const list = await membersApi.list();
      setMembers(list);
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

  const saveMembers = useCallback(async (next: string[]) => {
    const saved = await membersApi.update(next);
    setMembers(saved);
    setStatus("success");
    return saved;
  }, []);

  return { members, status, error, refetch: fetchData, saveMembers };
}
