"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import type { SignedInAgent } from "@/data/types";
import { signIn as apiSignIn } from "@/lib/api";

// Who is signed in. The agent view and the customer view share one page; this decides which shows.

const KEY = "mt-hajj-session-v1";
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function write(agent: SignedInAgent | null): void {
  try {
    if (agent) window.localStorage.setItem(KEY, JSON.stringify(agent));
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the sign-in lasts until the page is closed.
  }
  listeners.forEach((l) => l());
}

type Session = {
  agent: SignedInAgent | null;
  // An agent can preview the public page; they stay signed in.
  viewAsCustomer: boolean;
  setViewAsCustomer: (value: boolean) => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const [viewAsCustomer, setViewAsCustomer] = useState(false);

  const agent = useMemo<SignedInAgent | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SignedInAgent;
    } catch {
      return null;
    }
  }, [raw]);

  const signIn = useCallback(async (email: string, password: string) => {
    const found = await apiSignIn(email, password);
    if (!found) return false;
    setViewAsCustomer(false);
    write(found);
    return true;
  }, []);

  const signOut = useCallback(() => {
    setViewAsCustomer(false);
    write(null);
  }, []);

  const value = useMemo(() => ({ agent, viewAsCustomer, setViewAsCustomer, signIn, signOut }), [agent, viewAsCustomer, signIn, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside SessionProvider");
  return value;
}
