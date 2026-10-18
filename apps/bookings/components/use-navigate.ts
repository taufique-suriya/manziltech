"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

// The live site navigated with onNavigate("page"); this maps those names to routes.
export function useNavigate() {
  const router = useRouter();
  return useCallback((page: string) => router.push(page === "home" ? "/" : `/${page}`), [router]);
}
