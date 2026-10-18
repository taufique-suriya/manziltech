import type { Metadata } from "next";
import { PackagesView } from "@/views/packages-view";

export const metadata: Metadata = { title: "Tour Packages" };

export default function PackagesPage() {
  return <PackagesView />;
}
