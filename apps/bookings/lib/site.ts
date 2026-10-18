import type { FooterColumn, NavItem } from "@manziltech/ui";

export const brand = "ManzilTech";

export const nav: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Packages", href: "/packages" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const cta: NavItem = { label: "Book Now", href: "/packages" };

export const hubUrl = process.env.NEXT_PUBLIC_HUB_URL ?? "http://localhost:3000";

export const footerColumns: readonly FooterColumn[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Destinations", href: "/destinations" },
      { label: "Tour Packages", href: "/packages" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

// Header button back to the ManzilTech hub.
export const parent: NavItem = { label: "ManzilTech Hub", href: hubUrl, external: true };
