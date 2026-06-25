import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Category } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number into UAE Dirham currency.
 * Example: 100 -> "AED 100.00"
 */
export function formatAED(amount: number): string {
  if (!Number.isFinite(amount)) return "AED 0.00";
  return (
    "AED " +
    new Intl.NumberFormat("en-AE", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  );
}

/**
 * Format a number into a compact AED string for charts (e.g. 1.2k, 500, 1.2M).
 */
export function formatAEDCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const value = amount / 1_000_000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    const value = amount / 1_000;
    return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}k`;
  }
  return `${Math.round(amount)}`;
}

/**
 * Parse a formatted AED string (e.g. "100,000" or "100.00 AED") into a number.
 */
export function parseAEDInput(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

/**
 * Format raw digits as an AED display string while typing.
 * Example: "100000" -> "100,000"
 */
export function formatAEDInput(value: string | number): string {
  const digits = typeof value === "number" ? String(value) : value;
  const cleaned = digits.replace(/[^\d]/g, "");
  if (!cleaned) return "";
  return new Intl.NumberFormat("en-AE").format(Number(cleaned));
}

export const categoryLabels: Record<Category, string> = {
  taxi: "Taxi",
  market: "Sinh hoạt",
};

export const categoryLabelsLower: Record<Category, string> = {
  taxi: "taxi",
  market: "sinh hoạt",
};

export function categoryColor(category: Category): string {
  return category === "taxi" ? "text-taxi" : "text-market";
}

export function categoryBg(category: Category): string {
  return category === "taxi" ? "bg-taxi/10" : "bg-market/10";
}

export function categoryBgStrong(category: Category): string {
  return category === "taxi" ? "bg-taxi" : "bg-market";
}

export function categoryHex(category: Category): string {
  // Read CSS variable values for chart colors.
  if (typeof window === "undefined") {
    return category === "taxi" ? "#4f46e5" : "#10b981";
  }
  const root = getComputedStyle(document.documentElement);
  const varName = category === "taxi" ? "--taxi" : "--market";
  const raw = root.getPropertyValue(varName).trim();
  if (!raw) return category === "taxi" ? "#4f46e5" : "#10b981";
  return `hsl(${raw})`;
}

export function formatMonthYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(d);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
