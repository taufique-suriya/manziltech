import type { ReactNode } from "react";
import type { ProductAccent } from "@manziltech/design-tokens";

export type Product = Exclude<ProductAccent, "brand">;

export type ProductMarkProps = {
  product: Product;
  className?: string;
};

// Full class names so Tailwind can find them.
const tileColour: Record<Product, string> = {
  hajjandumrah: "bg-hajjandumrah shadow-hajjandumrah/30",
  bookings: "bg-bookings shadow-bookings/30",
  studio: "bg-studio shadow-studio/30",
};

// White line icons on the 24px grid, drawn in the same style as the compass in BrandMark.
const glyph: Record<Product, ReactNode> = {
  // The Kaaba in three-quarter view: solid sides, open top, and the band cut in the tile colour.
  hajjandumrah: (
    <>
      <path d="M12 3.5 20 7.5 12 11.5 4 7.5Z" />
      <path d="M4 7.5 12 11.5v9L4 16.5Z" fill="currentColor" />
      <path d="M20 7.5 12 11.5v9l8-4Z" fill="currentColor" />
      <path d="M4.6 11.2 12 14.9l7.4-3.7" stroke="var(--mt-hajjandumrah)" strokeWidth="1.6" />
    </>
  ),
  // A suitcase: travel and stays.
  bookings: (
    <>
      <rect x="4.5" y="8" width="15" height="11.5" rx="2" />
      <path d="M9 8V5.8A1.3 1.3 0 0 1 10.3 4.5h3.4A1.3 1.3 0 0 1 15 5.8V8" />
      <path d="M9 11.5v4.5M15 11.5v4.5" />
    </>
  ),
  // Code brackets: software and tech services.
  studio: (
    <>
      <path d="M8.5 7.5 4 12l4.5 4.5" />
      <path d="M15.5 7.5 20 12l-4.5 4.5" />
      <path d="M13.3 5.5 10.7 18.5" />
    </>
  ),
};

// A product's icon: a rounded tile in the product's accent with a white line glyph.
// Size it with font-size on className (the tile is 1.6em).
export function ProductMark({ product, className = "" }: ProductMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-[1.6em] shrink-0 place-items-center rounded-[0.45em] text-white shadow-sm ${tileColour[product]} ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-[1.05em]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {glyph[product]}
      </svg>
    </span>
  );
}
