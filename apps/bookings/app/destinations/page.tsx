import type { Metadata } from "next";
import { DestinationsView } from "@/views/destinations-view";

export const metadata: Metadata = { title: "Destinations" };

export default function DestinationsPage() {
  return <DestinationsView />;
}
