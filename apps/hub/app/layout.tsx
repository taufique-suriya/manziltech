import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { cssVariables } from "@manziltech/design-tokens";
import { SiteShell } from "@manziltech/ui";
import { brand, nav } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: brand, template: `%s | ${brand}` },
  description: "ManzilTech hub.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={cssVariables() as CSSProperties}>
      <body style={{ margin: 0 }}>
        <SiteShell brand={brand} nav={nav} link={Link} footer={`© ${new Date().getFullYear()} ${brand}`}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
