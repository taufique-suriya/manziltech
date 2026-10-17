import type { NavItem } from "@manziltech/ui";

export const brand = "ManzilTech";

export const nav: readonly NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export type Product = {
  name: string;
  summary: string;
  url: string;
};

// Each product runs on its own subdomain. URLs come from env so local, staging
// and production differ only in configuration; the defaults are the local dev ports.
export const products: readonly Product[] = [
  {
    name: "Hajj and Umrah",
    summary: "Travel marketplace for Hajj and Umrah packages.",
    url: process.env.NEXT_PUBLIC_HAJJANDUMRAH_URL ?? "http://localhost:3001",
  },
  {
    name: "Bookings",
    summary: "Travel and hotel booking.",
    url: process.env.NEXT_PUBLIC_BOOKINGS_URL ?? "http://localhost:3002",
  },
  {
    name: "Studio",
    summary: "Software development services.",
    url: process.env.NEXT_PUBLIC_STUDIO_URL ?? "http://localhost:3003",
  },
];
