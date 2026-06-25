"use client";

import { Car, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const Icon = category === "taxi" ? Car : ShoppingCart;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm",
        category === "taxi"
          ? "bg-taxi/12 text-taxi ring-1 ring-taxi/10"
          : "bg-market/12 text-market ring-1 ring-market/10",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {category === "taxi" ? "Taxi" : "Sinh hoạt"}
    </span>
  );
}