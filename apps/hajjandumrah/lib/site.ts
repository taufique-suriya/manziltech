import type { FooterColumn, NavItem } from "@manziltech/ui";

export const hubUrl = process.env.NEXT_PUBLIC_HUB_URL || "http://localhost:3000";
const bookingsUrl = process.env.NEXT_PUBLIC_BOOKINGS_URL || "http://localhost:3002";
const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3003";

// The Hajj and Umrah contact page (every product has its own).
export const contactUrl = "/contact/";

// 'Agent login' is the last menu item; it is a control, not a link (see AgentLoginMenu).
export const nav: readonly NavItem[] = [
  { label: "Hajj", href: "/?type=hajj#packages" },
  { label: "Umrah", href: "/?type=umrah#packages" },
  { label: "Ziyarat", href: "/?type=ziyarat#packages" },
  { label: "How it works", href: "/#how" },
  { label: "Contact", href: "/contact" },
];

export const footerColumns: readonly FooterColumn[] = [
  {
    title: "Hajj and Umrah",
    links: [
      { label: "Hajj", href: "/?type=hajj#packages" },
      { label: "Umrah", href: "/?type=umrah#packages" },
      { label: "Ziyarat", href: "/?type=ziyarat#packages" },
      { label: "How it works", href: "/#how" },
      { label: "For travel agents", href: "/#agents" },
    ],
  },
  {
    title: "ManzilTech",
    links: [
      { label: "ManzilTech home", href: hubUrl, external: true },
      { label: "Bookings", href: bookingsUrl, external: true },
      { label: "Studio", href: studioUrl, external: true },
      { label: "Contact", href: "/contact" },
    ],
  },
];

// Header button back to the ManzilTech hub.
export const parent: NavItem = { label: "ManzilTech Hub", href: hubUrl, external: true };
