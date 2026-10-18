import type { Metadata } from "next";
import { AboutView } from "@/views/about-view";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return <AboutView />;
}
