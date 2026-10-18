export type WordmarkProps = {
  className?: string;
};

// The compass mark on its own: a rounded tile in the app's accent with a white compass.
// The needle is split (north half solid, south half outline) so it reads as a direction,
// and the centre pin is the brand waypoint. Placeholder until a real logo exists (decision 0008).
export function BrandMark({ className = "" }: WordmarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-[1.6em] shrink-0 place-items-center rounded-[0.45em] bg-accent text-white shadow-sm shadow-accent/30 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-[1.05em]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M16.6 7.4 13.8 13.8 7.4 16.6 10.2 10.2Z" />
        <path d="M16.6 7.4 13.8 13.8 10.2 10.2Z" fill="currentColor" />
        <circle cx="12" cy="12" r="1.3" fill="var(--mt-accent)" stroke="none" />
      </svg>
    </span>
  );
}

// Placeholder wordmark: the compass mark plus "Manzil" + "Tech" ("Tech" in the accent).
export function Wordmark({ className = "" }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-display font-bold tracking-tight ${className}`}>
      <BrandMark />
      <span>
        Manzil<span className="text-accent">Tech</span>
      </span>
    </span>
  );
}
