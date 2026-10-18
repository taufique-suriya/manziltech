export type WordmarkProps = {
  className?: string;
};

// Placeholder wordmark (decision 0008): a waypoint mark plus "Manzil" + "Tech".
// The mark and "Tech" take the app's accent colour.
export function Wordmark({ className = "" }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-bold tracking-tight ${className}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[1.1em] shrink-0 text-accent">
        <path d="M12 2 21 12 12 22 3 12Z" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="12" cy="12" r="3.2" fill="currentColor" />
      </svg>
      <span>
        Manzil<span className="text-accent">Tech</span>
      </span>
    </span>
  );
}
