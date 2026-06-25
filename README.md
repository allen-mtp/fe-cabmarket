# CabMarket — Quản lý chi tiêu Taxi & Đi chợ

Ứng dụng web quản lý chi tiêu cá nhân theo tháng cho 2 danh mục **Taxi** và **Đi chợ**.
Giao diện phong cách Modern Minimalist, tối ưu cho cả Mobile (như app native) và Desktop,
hỗ trợ Dark/Light mode.

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **Shadcn UI** (style "new-york", base color slate)
- **Recharts** (biểu đồ) · **Lucide** (icons) · **Axios** (HTTP)
- **React Hook Form** + **Zod** (form & validation)
- **next-themes** (Dark/Light) · **sonner** (toast) · **react-day-picker** (calendar)

## Cài đặt

```bash
npm install
```

Tạo file `.env.local` (đã có sẵn mặc định, có thể đổi):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Chạy dự án

```bash
npm run dev      # Dev server: http://localhost:3000
npm run build    # Build production
npm run lint     # ESLint
npm run typecheck# Type-check
```

## Cấu trúc thư mục

```
src/
├── app/
│   ├── layout.tsx              # Root layout (font, ThemeProvider, Toaster)
│   ├── page.tsx                # Redirect → /dashboard
│   ├── globals.css             # CSS variables (Light/Dark + taxi/market)
│   └── (app)/                  # Route group dùng dashboard layout
│       ├── layout.tsx          # Sidebar + BottomNav + TransactionDialogProvider
│       ├── dashboard/page.tsx  # Trang tổng quan
│       ├── history/page.tsx    # Lịch sử giao dịch
│       ├── reports/page.tsx    # (placeholder)
│       └── settings/page.tsx   # (placeholder)
├── components/
│   ├── ui/                     # Shadcn UI primitives
│   ├── layout/                 # Sidebar, BottomNav, MobileHeader, ThemeToggle
│   ├── dashboard/              # SummaryCard, PieChart, BarChart, FAB
│   └── transactions/           # Form, Dialog provider, Table, Filters, Badge
├── hooks/use-transactions.ts   # useTransactions, useDashboard
├── lib/
│   ├── utils.ts                # cn, formatAED, categoryHex...
│   ├── api.ts                  # axios client + transactionsApi
│   ├── constants.ts            # NAV_ITEMS, CATEGORIES, MONTHS_VI...
│   └── validations/transaction.ts  # Zod schema
└── types/index.ts              # Shared types
```

## Tính năng chính

### 1. Dashboard Layout
- **Desktop:** Sidebar trái cố định (w-64).
- **Mobile:** Bottom Navigation ở dưới + MobileHeader trên cùng, có safe-area cho iOS.
- **Dark/Light:** nút toggle trong sidebar (desktop) / header (mobile), theo system mặc định.

### 2. Trang Dashboard (`/dashboard`)
- **3 Summary Cards** có hiệu ứng hover mượt (lift + shadow + gradient accent):
  - Tổng chi tiêu tháng này (icon Wallet, kèm % so tháng trước)
  - Tổng tiền Taxi (icon Car, tone Indigo)
  - Tổng tiền Đi chợ (icon ShoppingCart, tone Emerald)
- **Pie Chart** (Recharts): tỷ lệ % Taxi vs Đi chợ, donut style, legend + tooltip AED.
- **Bar Chart** (Recharts): so sánh chi tiêu Taxi + Đi chợ của tháng này với 3 tháng trước.
- **Skeleton loading** cho cards & charts.
- **FAB** (mobile only): nút tròn gradient Indigo→Emerald ở góc dưới phải, mở modal thêm giao dịch.

### 3. Modal Thêm giao dịch
- Mở từ FAB (mobile), nút "Thêm giao dịch" (Dashboard/History), hoặc qua context `useTransactionDialog()`.
- **React Hook Form + Zod** validation.
- Các trường:
  - **Số tiền**: tự format AED khi gõ (`100,000`), có suffix `AED`.
  - **Danh mục**: Select (Taxi / Đi chợ) kèm mô tả.
  - **Ngày tháng**: DatePicker (Popover + Calendar, locale vi-VN, disable tương lai).
  - **Ghi chú**: input tùy chọn, max 255 ký tự, có counter.
- Loading state trên nút submit, toast sonner khi thành công/lỗi.

### 4. Trang History (`/history`)
- **Table** (Shadcn) hiển thị: ngày, danh mục (badge màu), ghi chú, số tiền, nút xóa.
- **Filter nhanh** theo Tháng / Năm / Danh mục (3 Select).
- **Xóa có Alert Confirm** (AlertDialog) trước khi xóa, kèm loading + toast.
- Tổng tiền hiển thị realtime theo filter.
- Empty state + skeleton.

## API Backend (kỳ vọng)

Axios client gọi tới `NEXT_PUBLIC_API_URL`. Token đăng nhập tự động thêm vào
header `Authorization: Bearer <token>` cho mọi request. Khi nhận 401, client
tự xóa token và redirect về `/login`.

| Method | Path                         | Mô tả                          |
|--------|------------------------------|--------------------------------|
| POST   | `/auth/login`                | Đăng nhập `{ email, password }` → `{ token }` |
| POST   | `/auth/logout`               | Đăng xuất (server-side)        |
| GET    | `/transactions`              | List + filter (month/year/category/page/limit) |
| POST   | `/transactions`              | Tạo giao dịch                  |
| DELETE | `/transactions/:id`          | Xóa giao dịch                  |
| GET    | `/transactions/dashboard`    | Summary + monthly comparison   |

Response shapes xem tại `src/types/index.ts`. Nếu backend chưa sẵn sàng,
UI vẫn render bình thường (graceful degradation với empty/error state).

## Xác thực (Auth)

- **Login** tại `/login` (RHF + Zod). Sau khi thành công, token lưu `localStorage`
  và redirect về `from` (hoặc `/dashboard`).
- **Route protection:** toàn bộ route trong `(app)/` được bọc bởi `AuthGuard` —
  chưa đăng nhập sẽ redirect về `/login?from=...`.
- **Token expiry:** interceptor Axios bắt 401 → xóa token → redirect `/login`.
- **Logout:** nút ở Sidebar (desktop) / MobileHeader dropdown (mobile).

## Thiết kế

- **Tone chính:** Slate/Zinc. **Accent:** `taxi` = Indigo (`hsl(243 75% 59%)`), `market` = Emerald (`hsl(152 69% 40%)`).
- **CSS variables** cho cả Light & Dark (xem `globals.css`), màu chart dùng `categoryHex()` để tự đồng bộ dark mode.
- **Mobile-first:** nút bấm to (h-11+), touch-friendly, bottom nav, FAB, safe-area iOS.
- **Animation:** fade-in page, scale-in dialog, shimmer skeleton, hover lift card.
