"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { buttonClasses } from "@manziltech/ui";
import { limits, validateEmail, validatePassword } from "@manziltech/validation";
import { Field, inputClass } from "@/components/fields";
import { contactUrl } from "@/lib/site";
import { useSession } from "@/lib/session";

const linkClass = "inline-flex items-center leading-none text-ink-soft transition-colors hover:text-accent-strong";

function LoginForm({ idPrefix, onDone }: { idPrefix: string; onDone: () => void }) {
  const { signIn } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const found = { email: validateEmail(email) ?? undefined, password: validatePassword(password) ?? undefined };
    setFieldErrors(found);
    setError(null);
    if (found.email || found.password) return;
    setBusy(true);
    const ok = await signIn(email, password);
    setBusy(false);
    if (ok) onDone();
    else setError("The email or password is not correct.");
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-3 text-left" aria-label="Agent login">
      <Field label="Email" htmlFor={`${idPrefix}-email`} required error={fieldErrors.email}>
        <input ref={emailRef} id={`${idPrefix}-email`} name="email" type="email" autoComplete="username" maxLength={limits.email} className={inputClass} />
      </Field>
      <Field label="Password" htmlFor={`${idPrefix}-password`} required error={fieldErrors.password}>
        <input id={`${idPrefix}-password`} name="password" type="password" autoComplete="current-password" maxLength={limits.password.max} className={inputClass} />
      </Field>
      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={busy} className={buttonClasses("primary", "w-28 shrink-0 py-2.5 disabled:opacity-60")}>
          {busy ? "Logging in..." : "Log in"}
        </button>
        <p className="grid text-xs leading-snug text-muted">
          <span>Forgot your password?</span>
          <a href={contactUrl} className="font-medium text-accent-strong underline-offset-4 hover:underline">
            Contact ManzilTech
          </a>
        </p>
      </div>
    </form>
  );
}

// The last menu item: 'Agent login' (opens a small dialog right below it) or 'Log out' once signed in.
// 'desktop' anchors a popover below the link; 'mobile' expands the form inside the phone menu.
export function AgentLoginMenu({ variant }: { variant: "desktop" | "mobile" }) {
  const { agent, signOut } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open || variant !== "desktop") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, variant]);

  const itemClass = variant === "mobile" ? "block w-full rounded-sm px-3 py-3 text-left font-medium text-ink-soft hover:bg-mist hover:text-ink" : linkClass;

  if (agent) {
    return (
      <button type="button" onClick={signOut} className={itemClass}>
        Log out
      </button>
    );
  }

  return (
    <div ref={rootRef} className={variant === "desktop" ? "relative flex" : ""}>
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)} className={itemClass}>
        Agent login
      </button>
      {open && (
        <div
          id={panelId}
          className={
            variant === "desktop"
              ? "absolute right-0 top-full z-50 mt-4 w-80 rounded-lg border border-line bg-paper p-4 shadow-lg"
              : "mx-3 mb-2 rounded-lg border border-line bg-paper p-4"
          }
        >
          <LoginForm idPrefix={`login-${variant}`} onDone={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
