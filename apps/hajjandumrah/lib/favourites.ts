"use client";

import { useCallback, useSyncExternalStore } from "react";

// Saved packages live on this device only (spec Q-04): no mobile number, no server.

const KEY = "mt-hajj-favourites-v1";
const listeners = new Set<() => void>();
const EMPTY: readonly string[] = [];
let cache: { raw: string | null; value: readonly string[] } = { raw: null, value: EMPTY };

function snapshot(): readonly string[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw === cache.raw) return cache.value;
  let value: readonly string[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) value = parsed.filter((v): v is string => typeof v === "string");
  } catch {
    value = EMPTY;
  }
  cache = { raw, value };
  return value;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useFavourites() {
  const ids = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  const toggle = useCallback((id: string) => {
    const current = snapshot();
    const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      return;
    }
    listeners.forEach((l) => l());
  }, []);
  return { ids, toggle, has: (id: string) => ids.includes(id) };
}
