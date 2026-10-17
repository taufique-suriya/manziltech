import type { ComponentType, CSSProperties, ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
};

export type LinkProps = {
  href: string;
  children: ReactNode;
  style?: CSSProperties;
};

export type SiteShellProps = {
  brand: string;
  nav: readonly NavItem[];
  footer?: ReactNode;
  // Apps pass their router's link (next/link) so the package stays framework-free.
  link?: ComponentType<LinkProps>;
  children: ReactNode;
};

function PlainLink({ href, children, style }: LinkProps) {
  return (
    <a href={href} style={style}>
      {children}
    </a>
  );
}

const container: CSSProperties = {
  maxWidth: "var(--mt-width-content)",
  margin: "0 auto",
  padding: "0 var(--mt-space-md)",
};

const linkStyle: CSSProperties = { color: "inherit", textDecoration: "none" };

// Header, main and footer shared by every app. Styling comes from the
// --mt-* CSS variables that design-tokens provides.
export function SiteShell({ brand, nav, footer, link: Link = PlainLink, children }: SiteShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--mt-font-body)",
        color: "var(--mt-color-text)",
        background: "var(--mt-color-background)",
      }}
    >
      <header style={{ borderBottom: "1px solid var(--mt-color-border)" }}>
        <div
          style={{
            ...container,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--mt-space-md)",
            paddingBlock: "var(--mt-space-md)",
          }}
        >
          <Link href="/" style={{ ...linkStyle, fontWeight: 700 }}>
            {brand}
          </Link>
          <nav aria-label="Main">
            <ul style={{ display: "flex", flexWrap: "wrap", gap: "var(--mt-space-md)", listStyle: "none", margin: 0, padding: 0 }}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={linkStyle}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main style={{ ...container, flex: 1, width: "100%", paddingBlock: "var(--mt-space-lg)" }}>{children}</main>
      <footer style={{ borderTop: "1px solid var(--mt-color-border)", color: "var(--mt-color-muted)" }}>
        <div style={{ ...container, paddingBlock: "var(--mt-space-md)" }}>{footer}</div>
      </footer>
    </div>
  );
}
