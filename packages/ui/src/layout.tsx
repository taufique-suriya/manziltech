import type { ReactNode } from "react";

type BoxProps = {
  children: ReactNode;
  className?: string;
};

// Centred content column with the page gutter.
export function Container({ children, className = "" }: BoxProps) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export type SectionProps = BoxProps & {
  id?: string;
  tone?: "paper" | "mist";
};

// A full-width page band with vertical rhythm.
export function Section({ children, className = "", id, tone = "paper" }: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${tone === "mist" ? "bg-mist" : "bg-paper"} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

// Small uppercase label above a heading.
export function Eyebrow({ children, className = "" }: BoxProps) {
  return (
    <p className={`font-mono text-xs font-medium uppercase tracking-[0.14em] text-accent-strong ${className}`}>
      {children}
    </p>
  );
}
