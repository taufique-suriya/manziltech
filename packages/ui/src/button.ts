export type ButtonVariant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold transition-colors duration-200";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-brand hover:bg-accent-strong",
  secondary: "border border-line text-ink hover:border-accent hover:text-accent-strong",
  ghost: "text-accent-strong hover:underline underline-offset-4 px-0",
};

// Class names for anything that should look like a button (links included).
export function buttonClasses(variant: ButtonVariant = "primary", extra = ""): string {
  return `${base} ${variants[variant]} ${extra}`.trim();
}
