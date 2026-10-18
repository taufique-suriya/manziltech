import type { FooterColumn, NavItem } from "@manziltech/ui";

export const brand = "ManzilTech";


export const cta: NavItem = { label: "Explore products", href: "/products" };

// Optional: shown on the contact page only when set.
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

export type ProductAccent = "hajjandumrah" | "bookings" | "studio";

export type Product = {
  id: ProductAccent;
  name: string;
  summary: string;
  features: readonly string[];
  url: string;
};

// Each product runs on its own subdomain. URLs come from env so local, staging
// and production differ only in configuration; the defaults (also used when a variable is empty) are the local dev ports.
export const products: readonly Product[] = [
  {
    id: "hajjandumrah",
    name: "Hajj and Umrah",
    summary: "A marketplace where travel agents list Hajj and Umrah packages and pilgrims compare and choose.",
    features: [
      "Compare packages side by side: dates, hotels, distance to the Haram, inclusions",
      "Book with the agent you choose, through one secure checkout",
      "Agents manage their listings and bookings in one place",
    ],
    url: process.env.NEXT_PUBLIC_HAJJANDUMRAH_URL || "http://localhost:3001",
  },
  {
    id: "bookings",
    name: "Bookings",
    summary: "Hotels and travel, booked simply.",
    features: ["Search and compare stays", "Clear prices before you book", "Your trips in one account"],
    url: process.env.NEXT_PUBLIC_BOOKINGS_URL || "http://localhost:3002",
  },
  {
    id: "studio",
    name: "Studio",
    summary: "Software and tech services, specialising in travel: AI-rich web and mobile apps, integrations and automation.",
    features: ["AI-rich web and Android apps", "Travel API integrations", "Custom software and process automation"],
    url: process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3003",
  },
];

// Main menu: each product links straight to its own site, then the hub pages.
export const nav: readonly NavItem[] = [
  ...products.map((p) => ({ label: p.name, href: p.url, external: true })),
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Full class names per product so Tailwind can find them.
export const accentClasses: Record<ProductAccent, { text: string; bg: string; tint: string; border: string }> = {
  hajjandumrah: {
    text: "text-hajjandumrah",
    bg: "bg-hajjandumrah",
    tint: "bg-hajjandumrah-tint",
    border: "hover:border-hajjandumrah",
  },
  bookings: { text: "text-bookings", bg: "bg-bookings", tint: "bg-bookings-tint", border: "hover:border-bookings" },
  studio: { text: "text-studio", bg: "bg-studio", tint: "bg-studio-tint", border: "hover:border-studio" },
};

export const footerColumns: readonly FooterColumn[] = [
  {
    title: "Products",
    links: products.map((p) => ({ label: p.name, href: p.url, external: true })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
