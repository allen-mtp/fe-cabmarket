"use client";

import * as React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Check, Loader2, Plus, Sunrise, Sunset, UserRound, Users } from "lucide-react";

import { cn, formatDate, formatAEDInput, parseAEDInput } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, SESSIONS } from "@/lib/constants";
import type { Session } from "@/types";

interface AmountFieldProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function AmountField({ value, onChange, error }: AmountFieldProps) {
  const [display, setDisplay] = React.useState(() =>
    value > 0 ? formatAEDInput(value) : "",
  );

  return (
    <div className="space-y-1.5">
      <Label htmlFor="amount">Số tiền</Label>
      <div className="relative">
        <Input
          id="amount"
          inputMode="numeric"
          placeholder="0"
          value={display}
          className={cn("pr-14", error && "border-destructive focus-visible:ring-destructive")}
          onChange={(e) => {
            const formatted = formatAEDInput(e.target.value);
            setDisplay(formatted);
            onChange(parseAEDInput(formatted));
          }}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          AED
        </span>
      </div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Nhập số tiền, ví dụ: 100,000
        </p>
      )}
    </div>
  );
}

interface CategoryFieldProps {
  value: string;
  onChange: (value: "taxi" | "market") => void;
  error?: string;
}

export function CategoryField({ value, onChange, error }: CategoryFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="category">Danh mục</Label>
      <Select value={value} onValueChange={(v) => onChange(v as "taxi" | "market")}>
        <SelectTrigger id="category" className={cn(error && "border-destructive")}>
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              <div className="flex flex-col">
                <span>{cat.label}</span>
                <span className="text-xs text-muted-foreground">
                  {cat.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DateField({ value, onChange, error }: DateFieldProps) {
  const [open, setOpen] = React.useState(false);
  const selected = value ? new Date(value) : undefined;

  return (
    <div className="space-y-1.5">
      <Label htmlFor="date">Ngày tháng</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            type="button"
            variant="outline"
            className={cn(
              "h-11 w-full justify-start px-3 text-left font-normal",
              !selected && "text-muted-foreground",
              error && "border-destructive",
            )}
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            {selected ? (
              formatDate(selected)
            ) : (
              <span>Chọn ngày</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-xl border bg-popover p-0 shadow-lg" align="start">
          <Calendar
            mode="single"
            locale={vi}
            selected={selected}
            defaultMonth={selected ?? new Date()}
            onSelect={(d) => {
              if (d) {
                onChange(format(d, "yyyy-MM-dd"));
                setOpen(false);
              }
            }}
            disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface NoteFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Ghi chú nội dung sinh hoạt — bắt buộc. */
export function NoteField({ value, onChange, error }: NoteFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="note">Nội dung sinh hoạt</Label>
      <Input
        id="note"
        placeholder="Ví dụ: mua thực phẩm, tiền điện, ăn uống..."
        value={value}
        maxLength={255}
        className={cn(error && "border-destructive focus-visible:ring-destructive")}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ─────────────────────────── Chia tiền ─────────────────────────── */

const SESSION_ICONS: Record<Session, React.ComponentType<{ className?: string }>> = {
  sang: Sunrise,
  chieu: Sunset,
};

interface PayerFieldProps {
  value: string;
  onChange: (value: string) => void;
  members: string[];
  error?: string;
}

export function PayerField({ value, onChange, members, error }: PayerFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="payer">Người trả</Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger id="payer" className={cn(error && "border-destructive")}>
          <div className="flex min-w-0 items-center gap-2">
            <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              <SelectValue placeholder="Chọn người trả" />
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {members.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface SessionFieldProps {
  value?: Session;
  onChange: (value: Session) => void;
  error?: string;
}

export function SessionField({ value, onChange, error }: SessionFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>Buổi đi</Label>
      <div className="grid grid-cols-2 gap-2">
        {SESSIONS.map((s) => {
          const Icon = SESSION_ICONS[s.value];
          const active = value === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onChange(s.value)}
              className={cn(
                "flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-all",
                active
                  ? "border-taxi bg-taxi/10 text-taxi shadow-sm"
                  : "border-input bg-background text-muted-foreground hover:bg-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              {s.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface ParticipantsFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  members: string[];
  /** Màu nhấn theo tab hiện tại. */
  accent: "taxi" | "market";
  /** Thêm nhanh 1 người đi mới (lưu vào roster + tự chọn). */
  onAddMember?: (name: string) => void | Promise<void>;
  error?: string;
}

export function ParticipantsField({
  value,
  onChange,
  members,
  accent,
  onAddMember,
  error,
}: ParticipantsFieldProps) {
  const [draft, setDraft] = React.useState("");
  const [adding, setAdding] = React.useState(false);
  const allSelected = members.length > 0 && value.length === members.length;

  const toggle = (name: string) => {
    if (value.includes(name)) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange([...value, name]);
    }
  };

  const toggleAll = () => {
    onChange(allSelected ? [] : [...members]);
  };

  const submitAdd = async () => {
    const name = draft.trim();
    if (!name || !onAddMember) return;
    setAdding(true);
    try {
      await onAddMember(name);
      setDraft("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          Người đi
          <span className="text-xs font-normal text-muted-foreground">
            ({value.length}/{members.length})
          </span>
        </Label>
        {members.length > 0 && (
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>
        )}
      </div>

      {members.length === 0 ? (
        <p className="rounded-lg border border-dashed bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
          Chưa có ai. Gõ tên bên dưới để thêm nhanh người đi.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {members.map((m) => {
            const active = value.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggle(m)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                  active
                    ? accent === "taxi"
                      ? "border-taxi bg-taxi/10 text-taxi"
                      : "border-market bg-market/10 text-market"
                    : "border-input bg-background text-muted-foreground hover:bg-accent",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                    active
                      ? accent === "taxi"
                        ? "border-taxi bg-taxi text-white"
                        : "border-market bg-market text-white"
                      : "border-muted-foreground/40",
                  )}
                >
                  {active && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                {m}
              </button>
            );
          })}
        </div>
      )}

      {/* Thêm nhanh người đi */}
      {onAddMember && (
        <div className="flex gap-2 pt-0.5">
          <Input
            value={draft}
            maxLength={30}
            placeholder="Thêm nhanh người đi..."
            className="h-9"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void submitAdd();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 shrink-0 gap-1.5"
            disabled={!draft.trim() || adding}
            onClick={() => void submitAdd()}
          >
            {adding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Thêm
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
