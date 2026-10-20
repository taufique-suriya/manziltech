import type { Metadata } from "next";
import { Suspense } from "react";
import { PackagePage } from "@/components/package-page";

export const metadata: Metadata = { title: "Package | Hajj and Umrah | ManzilTech" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PackagePage />
    </Suspense>
  );
}
