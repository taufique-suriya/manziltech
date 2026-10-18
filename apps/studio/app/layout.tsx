import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans, Sora } from "next/font/google";
import { SiteShell } from "@manziltech/ui";
import { cta, footerColumns, nav, parent } from "@/lib/site";
import "./globals.css";

// Brand faces (decision 0008), self-hosted by next/font at build time.
const display = Sora({ subsets: ["latin"], variable: "--mt-font-display" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--mt-font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--mt-font-mono" });

export const metadata: Metadata = {
  title: "Studio | ManzilTech",
  description:
    "Software development and tech services from ManzilTech. AI-rich web and mobile apps, travel API integrations, process automation and custom software.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      {/* Browser extensions (e.g. Grammarly) add attributes to body before React loads. */}
      <body suppressHydrationWarning>
        <SiteShell
          nav={nav}
          cta={cta}
          parent={parent}
          link={Link}
          tagline="Software and tech services, specialising in travel."
          footerColumns={footerColumns}
          footerNote={`© ${new Date().getFullYear()} ManzilTech`}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
