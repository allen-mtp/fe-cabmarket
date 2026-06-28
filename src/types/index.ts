export type Category = "taxi" | "market";

/** Buổi đi (chỉ áp dụng cho taxi). */
export type Session = "sang" | "chieu";

export interface User {
  id: string;
  name?: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserResponse {
  user: User;
  token?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  date: string;
  /** Người trả tiền. */
  payer?: string;
  /** Những người đã đi (được chia tiền). */
  participants?: string[];
  /** Buổi đi — chỉ có với taxi. */
  session?: Session;
  /** Ghi chú — bắt buộc với sinh hoạt. */
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionInput {
  amount: number;
  category: Category;
  date: string;
  payer: string;
  participants: string[];
  session?: Session;
  note?: string;
}

/** Phản hồi roster thành viên. */
export interface MembersResponse {
  members: string[];
}

/** Công nợ tổng hợp của 1 thành viên. */
export interface MemberBalance {
  name: string;
  /** Tổng tiền cần trả. */
  owed: number;
  /** Số đã đánh dấu thanh toán. */
  settled: number;
  /** Còn nợ = max(0, owed - settled). */
  outstanding: number;
  /** Đã trả hết chưa. */
  paid: boolean;
}

export interface BalancesResponse {
  balances: MemberBalance[];
}

/** Chi tiêu 1 thành viên trong tháng. */
export interface MemberSpending {
  name: string;
  amount: number;
}

export interface SpendingSummary {
  year: number;
  month: number;
  total: number;
  items: MemberSpending[];
  allTimeTotal: number;
  allTimeItems: MemberSpending[];
}

export interface SummaryResponse {
  totalThisMonth: number;
  taxiThisMonth: number;
  marketThisMonth: number;
  lastMonthTotal: number;
  taxiPercentage: number;
  marketPercentage: number;
}

export interface MonthlyComparison {
  month: string;
  monthLabel: string;
  taxi: number;
  market: number;
  total: number;
}

export interface DashboardData {
  summary: SummaryResponse;
  monthlyComparison: MonthlyComparison[];
}

export interface TransactionFilters {
  month?: number;
  year?: number;
  category?: Category | "all";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
