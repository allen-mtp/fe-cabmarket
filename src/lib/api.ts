import axios, { type AxiosInstance, AxiosError } from "axios";
import { getStoredToken, removeStoredToken, setStoredToken } from "./auth";
import type {
  ApiError,
  BalancesResponse,
  DashboardData,
  LoginInput,
  MemberBalance,
  MembersResponse,
  PaginatedResponse,
  SpendingSummary,
  Transaction,
  TransactionFilters,
  TransactionInput,
  User,
  UserResponse,
} from "@/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";

    if (
      status === 401 &&
      typeof window !== "undefined" &&
      !requestUrl.includes("/auth/login")
    ) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        window.location.assign(
          `/login?from=${encodeURIComponent(currentPath)}`,
        );
      }
    }

    const normalized: ApiError = {
      message:
        error.response?.data?.message ??
        error.message ??
        "Đã có lỗi xảy ra, vui lòng thử lại.",
      code: error.response?.data?.code ?? `HTTP_${status ?? 0}`,
      details: error.response?.data?.details,
    };
    return Promise.reject(normalized);
  },
);

export const authApi = {
  login: async (input: LoginInput): Promise<User> => {
    const { data } = await api.post<{ success: boolean; data: UserResponse }>(
      "/auth/login",
      input,
    );
    if (data.data.token) {
      setStoredToken(data.data.token);
    }
    return data.data.user;
  },
  me: async (): Promise<User> => {
    const { data } = await api.get<{ success: boolean; data: UserResponse }>(
      "/auth/me",
    );
    return data.data.user;
  },
  logout: async () => {
    await api.post("/auth/logout");
    removeStoredToken();
  },
};

export const transactionsApi = {
  list: async (filters: TransactionFilters = {}) => {
    const { data } = await api.get<PaginatedResponse<Transaction>>("/transactions", {
      params: {
        month: filters.month,
        year: filters.year,
        category: filters.category === "all" ? undefined : filters.category,
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
      },
    });
    return data;
  },

  create: async (input: TransactionInput) => {
    const { data } = await api.post<{ success: boolean; data: Transaction }>(
      "/transactions",
      input,
    );
    return data.data;
  },

  update: async (id: string, input: TransactionInput) => {
    const { data } = await api.put<{ success: boolean; data: Transaction }>(
      `/transactions/${id}`,
      input,
    );
    return data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/transactions/${id}`);
    return id;
  },

  deleteMany: async (ids: string[]) => {
    const { data } = await api.delete<{ success: boolean; data: { deleted: number } }>(
      "/transactions/batch",
      { data: { ids } },
    );
    return data.data.deleted;
  },

  dashboard: async (month?: number, year?: number) => {
    const { data } = await api.get<{ success: boolean; data: DashboardData }>(
      "/transactions/dashboard",
      { params: { month, year } },
    );
    return data.data;
  },
};

export const membersApi = {
  list: async (): Promise<string[]> => {
    const { data } = await api.get<{ success: boolean; data: MembersResponse }>(
      "/members",
    );
    return data.data.members;
  },

  update: async (members: string[]): Promise<string[]> => {
    const { data } = await api.put<{ success: boolean; data: MembersResponse }>(
      "/members",
      { members },
    );
    return data.data.members;
  },

  balances: async (): Promise<MemberBalance[]> => {
    const { data } = await api.get<{ success: boolean; data: BalancesResponse }>(
      "/members/balances",
    );
    return data.data.balances;
  },

  settle: async (name: string): Promise<MemberBalance[]> => {
    const { data } = await api.put<{ success: boolean; data: BalancesResponse }>(
      "/members/settle",
      { name },
    );
    return data.data.balances;
  },

  spending: async (
    month: number,
    year: number,
    mode?: "all",
  ): Promise<SpendingSummary> => {
    const { data } = await api.get<{ success: boolean; data: SpendingSummary }>(
      "/members/spending",
      { params: { month, year, ...(mode && { mode }) } },
    );
    return data.data;
  },
};
