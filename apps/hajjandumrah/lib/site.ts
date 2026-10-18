import type { FooterColumn, NavItem } from "@manziltech/ui";

export const hubUrl = process.env.NEXT_PUBLIC_HUB_URL || "http://localhost:3000";
const bookingsUrl = process.env.NEXT_PUBLIC_BOOKINGS_URL || "http://localhost:3002";
const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3003";

export const contactUrl = `${hubUrl}/contact`;

export const nav: readonly NavItem[] = [
  { label: "Hajj", href: "#hajj" },
  { label: "Umrah", href: "#umrah" },
  { label: "How it works", href: "#how" },
  { label: "For agents", href: "#agents" },
];

export const cta: NavItem = { label: "Enquire now", href: "#contact" };

export const footerColumns: readonly FooterColumn[] = [
  {
    title: "Hajj and Umrah",
    links: [
      { label: "Hajj", href: "#hajj" },
      { label: "Umrah", href: "#umrah" },
      { label: "How it works", href: "#how" },
      { label: "For agents", href: "#agents" },
    ],
  },
  {
    title: "ManzilTech",
    links: [
      { label: "ManzilTech home", href: hubUrl, external: true },
      { label: "Bookings", href: bookingsUrl, external: true },
      { label: "Studio", href: studioUrl, external: true },
      { label: "Contact", href: contactUrl, external: true },
    ],
  },
];

// Header button back to the ManzilTech hub.
export const parent: NavItem = { label: "ManzilTech Hub", href: hubUrl, external: true };
