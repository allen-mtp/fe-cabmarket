import type { Category, Session } from "@/types";

export const SESSIONS: { value: Session; label: string; icon: string }[] = [
  { value: "sang", label: "Sáng", icon: "Sunrise" },
  { value: "chieu", label: "Chiều", icon: "Sunset" },
];

export const SESSION_LABELS: Record<Session, string> = {
  sang: "Sáng",
  chieu: "Chiều",
};

export const NAV_ITEMS = [
  {
    label: "Tổng quan",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Lịch sử",
    href: "/history",
    icon: "ReceiptText",
  },
  {
    label: "Thành viên",
    href: "/members",
    icon: "Users",
  },
  {
    label: "Công nợ",
    href: "/balances",
    icon: "Coins",
  },
  {
    label: "Chi tiêu",
    href: "/spending",
    icon: "PieChart",
  },
] as const;

export const CATEGORIES: { value: Category; label: string; description: string }[] = [
  {
    value: "taxi",
    label: "Taxi",
    description: "Di chuyển bằng taxi / grab / xe ôm",
  },
  {
    value: "market",
    label: "Sinh hoạt",
    description: "Chi tiêu sinh hoạt hàng ngày",
  },
];

export const MONTHS_VI = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

/**
 * Tối đa 4 năm gần nhất, tính từ năm hiện tại trở về trước.
 * Tự cập nhật theo năm hệ thống — sang năm mới sẽ tự có năm đó.
 */
export const YEARS_RANGE = (() => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= currentYear - 3; y--) {
    years.push(y);
  }
  return years;
})();
