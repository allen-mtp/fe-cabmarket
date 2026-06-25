"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LogIn, Wallet, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { loginSchema, type LoginFormValues } from "@/lib/validations/login";
import type { ApiError } from "@/types";

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginInner />
    </React.Suspense>
  );
}

function LoginInner() {
  const searchParams = useSearchParams();
  const { login, initializing, user } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const from = searchParams.get("from") || "/dashboard";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (!initializing && user) {
      window.location.assign(from);
    }
  }, [initializing, user, from]);

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      await login(values);
      toast.success("Đăng nhập thành công");
      window.location.assign(from);
    } catch (e) {
      const err = e as ApiError;
      toast.error(err.message ?? "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-taxi-soft/30 to-market-soft/40 p-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-taxi/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-market/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-br from-taxi/5 to-market/5 blur-2xl" />

      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-taxi to-market shadow-glow animate-glow-pulse">
            <Wallet className="h-7 w-7 text-white" />
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm">
              <Sparkles className="h-3 w-3 text-taxi" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            <span className="text-gradient">CabMarket</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Quản lý chi tiêu Taxi & Sinh hoạt
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/50 bg-card/80 p-6 shadow-card backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ban@email.com"
                    className={errors.email ? "border-destructive" : "hover:border-taxi/30 focus-visible:border-taxi/50"}
                    {...field}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`pr-10 ${errors.password ? "border-destructive" : "hover:border-taxi/30 focus-visible:border-taxi/50"}`}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Button
              type="submit"
              className="w-full gap-2 shadow-glow-sm hover:shadow-glow"
              size="lg"
              disabled={submitting || initializing}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} CabMarket · Quản lý chi tiêu Taxi & Sinh hoạt
        </p>
      </div>
    </div>
  );
}