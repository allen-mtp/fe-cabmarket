"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api";
import { getStoredUser, removeStoredUser, removeStoredToken, setStoredUser } from "@/lib/auth";
import type { ApiError, LoginInput, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  initializing: boolean;
  login: (input: LoginInput) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [initializing, setInitializing] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const cached = getStoredUser();
    if (cached) setUser(cached);

    authApi
      .me()
      .then((u) => {
        setUser(u);
        setStoredUser(u);
      })
      .catch(() => {
        removeStoredUser();
        removeStoredToken();
        setUser(null);
      })
      .finally(() => setInitializing(false));
  }, []);

  const login = React.useCallback(async (input: LoginInput) => {
    setLoading(true);
    try {
      const u = await authApi.login(input);
      setUser(u);
      setStoredUser(u);
      return u;
    } catch (e) {
      const err = e as ApiError;
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    await authApi.logout();
    setUser(null);
    removeStoredUser();
    removeStoredToken();
    router.replace("/login");
  }, [router]);

  const value = React.useMemo(
    () => ({ user, loading, initializing, login, logout }),
    [user, loading, initializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
