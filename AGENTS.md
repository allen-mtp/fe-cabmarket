# AGENTS.md

Hướng dẫn cho AI agent khi làm việc với codebase này.

## Commands

- **Cài đặt:** `npm install`
- **Dev:** `npm run dev` (http://localhost:3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (next lint)
- **Typecheck:** `npm run typecheck` (tsc --noEmit)

LUÔN chạy `npm run lint` và `npm run typecheck` sau khi sửa code để đảm bảo đúng.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Shadcn UI (style "new-york", base color slate)
- Recharts (charts), Lucide (icons), Axios (HTTP)
- React Hook Form + Zod (forms/validation)
- next-themes (Dark/Light), sonner (toast), react-day-picker (calendar)

## Architecture

- `src/app/(app)/` — route group dùng dashboard layout chung (Sidebar + BottomNav + TransactionDialogProvider).
- `src/components/ui/` — Shadcn UI primitives (KHÔNG sửa tay trừ khi cần).
- `src/components/layout/` — Sidebar, BottomNav, MobileHeader, ThemeToggle.
- `src/components/dashboard/` — SummaryCard, charts, FAB.
- `src/components/transactions/` — Form, Dialog provider, Table, Filters, Badge.
- `src/lib/` — `utils.ts` (cn, formatVND...), `api.ts` (axios client + `transactionsApi`), `constants.ts`, `validations/`.
- `src/hooks/use-transactions.ts` — data fetching hooks (`useTransactions`, `useDashboard`).
- `src/types/index.ts` — shared types.

## Design tokens

- Tone chính: Slate/Zinc. Accent: `taxi` (Indigo) và `market` (Emerald).
- CSS variables: `--taxi`, `--market`, `--taxi-soft`, `--market-soft` (xem `src/app/globals.css`).
- Tailwind classes: `text-taxi`, `bg-market/10`, `bg-taxi`, `text-market`...
- Màu chart phải dùng `categoryHex()` từ `lib/utils.ts` để đồng bộ với dark mode.

## Conventions

- Component dùng `"use client"` khi cần hook/interactivity.
- Format tiền tệ AED: `formatAED()` (display), `formatAEDInput()`/`parseAEDInput()` (input).
- API base url: `NEXT_PUBLIC_API_URL` (mặc định `http://localhost:8000/api`).
- Validation: đặt schema Zod trong `src/lib/validations/`, infer type từ schema.
- Không thêm comment trừ khi được yêu cầu.
