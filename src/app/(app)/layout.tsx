import type { Metadata } from "next";

import { AuthGuard } from "@/components/auth-guard";

export const metadata: Metadata = {
  title: "CabMarket",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
