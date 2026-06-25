"use client";

import * as React from "react";
import { Filter } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS_VI, YEARS_RANGE } from "@/lib/constants";
import type { Category } from "@/types";

export interface HistoryFiltersValue {
  month: number | "all";
  year: number | "all";
  category: Category | "all";
}

interface HistoryFiltersProps {
  value: HistoryFiltersValue;
  onChange: (value: HistoryFiltersValue) => void;
}

export function HistoryFilters({ value, onChange }: HistoryFiltersProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" />
        Lọc:
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Select
          value={String(value.month)}
          onValueChange={(v) =>
            onChange({ ...value, month: v === "all" ? "all" : Number(v) })
          }
        >
          <SelectTrigger className="h-9 flex-1 sm:flex-none sm:w-[140px]">
            <SelectValue placeholder="Tháng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tháng</SelectItem>
            {MONTHS_VI.map((m, i) => (
              <SelectItem key={i} value={String(i + 1)}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(value.year)}
          onValueChange={(v) =>
            onChange({ ...value, year: v === "all" ? "all" : Number(v) })
          }
        >
          <SelectTrigger className="h-9 flex-1 sm:flex-none sm:w-[120px]">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả năm</SelectItem>
            {YEARS_RANGE.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={value.category}
          onValueChange={(v) =>
            onChange({ ...value, category: v as Category | "all" })
          }
        >
          <SelectTrigger className="h-9 w-full sm:w-[170px]">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            <SelectItem value="taxi">Taxi</SelectItem>
            <SelectItem value="market">Sinh hoạt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="hidden text-xs text-muted-foreground sm:ml-auto sm:block">
        {value.year === currentYear && value.month === "all"
          ? "Đang xem năm hiện tại"
          : null}
      </div>
    </div>
  );
}
