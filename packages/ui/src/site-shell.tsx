import type { ComponentType, ReactNode } from "react";
import { buttonClasses } from "./button";
import { Container } from "./layout";
import { MobileMenu } from "./mobile-menu";
import { Wordmark } from "./wordmark";

export type NavItem = {
  label: string;
  href: string;
  // Links to another app (subdomain) use a plain anchor instead of the router link.
  external?: boolean;
};

export type FooterColumn = {
  title: string;
  links: readonly NavItem[];
};

export type LinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export type SiteShellProps = {
  nav: readonly NavItem[];
  cta?: NavItem;
  // Product sites: the first menu item, linking back to the ManzilTech hub.
  parent?: NavItem;
  footerColumns?: readonly FooterColumn[];
  // Extra footer cells after the link columns (contact details, newsletter, ...).
  footerAside?: ReactNode;
  footerNote?: ReactNode;
  tagline?: ReactNode;
  // Apps pass their router's link (next/link) so the package stays framework-free.
  link?: ComponentType<LinkProps>;
  children: ReactNode;
};

function PlainLink({ href, children, className }: LinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

// Header, main and footer shared by every app (decision 0008).
export function SiteShell({
  nav,
  cta,
  parent,
  footerColumns = [],
  footerAside,
  footerNote,
  tagline = "Travel and technology under one brand. Built in India.",
  link = PlainLink,
  children,
}: SiteShellProps) {
  const Link = link;
  const NavLink = ({ item, className, children: content }: { item: NavItem; className: string; children?: ReactNode }) =>
    item.external ? (
      <a href={item.href} className={className}>
        {content ?? item.label}
      </a>
    ) : (
      <Link href={item.href} className={className}>
        {content ?? item.label}
      </Link>
    );

  return (
    <div className="flex min-h-screen flex-col bg-paper font-sans text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
        <Container className="relative flex h-16 items-center justify-between gap-6">
          <Link href="/" className="text-xl text-ink">
            <Wordmark />
          </Link>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-6 text-sm font-medium whitespace-nowrap xl:gap-7">
              {parent && (
                <li className="flex">
                  <a href={parent.href} className="inline-flex items-center gap-0.5 leading-none text-ink-soft transition-colors hover:text-accent-strong">
                    <BackArrow />
                    {parent.label}
                  </a>
                </li>
              )}
              {nav.map((item) => (
                <li key={item.href} className="flex">
                  <NavLink item={item} className="inline-flex items-center leading-none text-ink-soft transition-colors hover:text-accent-strong" />
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            {cta && (
              <span className="hidden md:inline-flex">
                <NavLink item={cta} className={buttonClasses("primary", "py-2.5")} />
              </span>
            )}
            <MobileMenu>
              {parent && (
                <a href={parent.href} className="mt-2 flex items-center gap-1 rounded-sm px-3 py-3 font-medium text-ink-soft hover:bg-mist hover:text-ink">
                  <BackArrow />
                  {parent.label}
                </a>
              )}
              <ul className="grid gap-1 pt-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <NavLink item={item} className="block rounded-sm px-3 py-3 font-medium text-ink-soft hover:bg-mist hover:text-ink" />
                  </li>
                ))}
              </ul>
              {cta && <NavLink item={cta} className={buttonClasses("primary", "mt-3 w-full")} />}
            </MobileMenu>
          </div>
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-night text-night-text">
        <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid content-start gap-4">
            <Link href="/" className="text-xl text-white">
              <Wordmark />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed">{tagline}</p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-4 text-sm font-semibold text-white">{column.title}</h2>
              <ul className="grid gap-2.5 text-sm">
                {column.links.map((item) => (
                  <li key={item.href}>
                    <NavLink item={item} className="transition-colors hover:text-white" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {footerAside}
        </Container>
        <div className="border-t border-night-line">
          <Container className="py-6 font-mono text-xs">{footerNote}</Container>
        </div>
      </footer>
    </div>
  );
}
