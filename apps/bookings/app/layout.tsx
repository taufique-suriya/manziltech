import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans, Sora } from "next/font/google";
import { SiteShell } from "@manziltech/ui";
import { FooterAside } from "@/components/footer-aside";
import { footerCopyright, footerTagline } from "@/data/template-claims";
import { brand, cta, footerColumns, nav } from "@/lib/site";
import "./globals.css";

// Brand faces (decision 0008), self-hosted by next/font at build time.
const display = Sora({ subsets: ["latin"], variable: "--mt-font-display" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--mt-font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--mt-font-mono" });

export const metadata: Metadata = {
  title: { default: `Bookings | ${brand}`, template: `%s | ${brand} Bookings` },
  description: "Destinations and all-inclusive travel packages from ManzilTech.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      {/* Browser extensions (e.g. Grammarly) add attributes to body before React loads. */}
      <body suppressHydrationWarning>
        <SiteShell
          nav={nav}
          cta={cta}
          link={Link}
          tagline={footerTagline}
          footerColumns={footerColumns}
          footerAside={<FooterAside />}
          footerNote={
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <span>
                © {new Date().getFullYear()} {footerCopyright}
              </span>
              <span className="flex gap-6">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">Cookie Policy</a>
              </span>
            </div>
          }
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
