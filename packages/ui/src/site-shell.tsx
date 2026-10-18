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
  footerColumns?: readonly FooterColumn[];
  footerNote?: ReactNode;
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

// Header, main and footer shared by every app (decision 0008).
export function SiteShell({ nav, cta, footerColumns = [], footerNote, link = PlainLink, children }: SiteShellProps) {
  const Link = link;
  const NavLink = ({ item, className }: { item: NavItem; className: string }) =>
    item.external ? (
      <a href={item.href} className={className}>
        {item.label}
      </a>
    ) : (
      <Link href={item.href} className={className}>
        {item.label}
      </Link>
    );

  return (
    <div className="flex min-h-screen flex-col bg-paper font-sans text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
        <Container className="relative flex h-16 items-center justify-between gap-6">
          <Link href="/" className="text-xl text-ink">
            <Wordmark />
          </Link>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm font-medium">
              {nav.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} className="text-ink-soft transition-colors hover:text-accent-strong" />
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            {cta && (
              <span className="hidden md:inline-flex">
                <Link href={cta.href} className={buttonClasses("primary", "py-2.5")}>
                  {cta.label}
                </Link>
              </span>
            )}
            <MobileMenu>
              <ul className="grid gap-1 pt-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <NavLink item={item} className="block rounded-sm px-3 py-3 font-medium text-ink-soft hover:bg-mist hover:text-ink" />
                  </li>
                ))}
              </ul>
              {cta && (
                <Link href={cta.href} className={buttonClasses("primary", "mt-3 w-full")}>
                  {cta.label}
                </Link>
              )}
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
            <p className="max-w-xs text-sm leading-relaxed">Travel and technology under one brand. Built in India.</p>
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
        </Container>
        <div className="border-t border-night-line">
          <Container className="py-6 font-mono text-xs">{footerNote}</Container>
        </div>
      </footer>
    </div>
  );
}
