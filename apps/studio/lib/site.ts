import type { FooterColumn, NavItem } from "@manziltech/ui";

export const hubUrl = process.env.NEXT_PUBLIC_HUB_URL || "http://localhost:3000";
const hajjUrl = process.env.NEXT_PUBLIC_HAJJANDUMRAH_URL || "http://localhost:3001";
const bookingsUrl = process.env.NEXT_PUBLIC_BOOKINGS_URL || "http://localhost:3002";

// The Studio contact page (every product has its own).
export const contactUrl = "/contact/";

export const nav: readonly NavItem[] = [
  { label: "Services", href: "#services" },
  { label: "Travel tech", href: "#travel" },
  { label: "How we work", href: "#process" },
  { label: "Contact", href: "/contact" },
];

export const cta: NavItem = { label: "Start a project", href: "/contact" };

export const footerColumns: readonly FooterColumn[] = [
  {
    title: "Studio",
    links: [
      { label: "Services", href: "#services" },
      { label: "Travel tech", href: "#travel" },
      { label: "How we work", href: "#process" },
    ],
  },
  {
    title: "ManzilTech",
    links: [
      { label: "ManzilTech home", href: hubUrl, external: true },
      { label: "Hajj and Umrah", href: hajjUrl, external: true },
      { label: "Bookings", href: bookingsUrl, external: true },
      { label: "Contact", href: "/contact" },
    ],
  },
];

// Header button back to the ManzilTech hub.
export const parent: NavItem = { label: "ManzilTech Hub", href: hubUrl, external: true };
