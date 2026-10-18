import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans, Sora } from "next/font/google";
import { SiteShell } from "@manziltech/ui";
import { brand, cta, footerColumns, nav } from "@/lib/site";
import "./globals.css";

// Brand faces (decision 0008), self-hosted by next/font at build time.
const display = Sora({ subsets: ["latin"], variable: "--mt-font-display" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--mt-font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--mt-font-mono" });

export const metadata: Metadata = {
  title: { default: `${brand}: travel and technology`, template: `%s | ${brand}` },
  description:
    "ManzilTech brings together a Hajj and Umrah marketplace, travel and hotel bookings, and software development services.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <SiteShell
          nav={nav}
          cta={cta}
          footerColumns={footerColumns}
          footerNote={`© ${new Date().getFullYear()} ${brand}`}
          link={Link}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
