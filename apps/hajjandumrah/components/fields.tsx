import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

export const selectClass = `${inputClass} pr-8`;

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, required, hint, error, className = "", children }: FieldProps) {
  return (
    <div className={`grid content-start gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-danger"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Badge({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "warm" | "muted" | "danger" | "brand" }) {
  const tones = {
    accent: "bg-accent-tint text-accent-strong",
    warm: "bg-hajjandumrah-warm/15 text-hajjandumrah-warm",
    brand: "bg-brand-tint text-brand-strong",
    muted: "bg-mist text-ink-soft",
    danger: "bg-danger-tint text-danger",
  };
  return <span className={`inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-xs ${tones[tone]}`}>{children}</span>;
}
