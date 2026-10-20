"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonClasses, Container } from "@manziltech/ui";
import type { PackageView } from "@/data/types";
import { HeartButton } from "@/components/customer-listing";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { PackageRow } from "@/components/package-row";
import { getPublicPackage } from "@/lib/api";
import { useFavourites } from "@/lib/favourites";
import { todayIso } from "@/lib/format";
import { isPublic } from "@/lib/packages";

type State = { status: "loading" } | { status: "missing" } | { status: "ready"; pkg: PackageView; today: string };

// One package on its own page, for sharing: '/package/?slug=...' (spec Q-07).
export function PackagePage() {
  const slug = useSearchParams().get("slug") ?? "";
  const [state, setState] = useState<State>({ status: "loading" });
  const [enquiring, setEnquiring] = useState(false);
  const favourites = useFavourites();

  useEffect(() => {
    let live = true;
    getPublicPackage(slug).then((pkg) => {
      if (!live) return;
      const today = todayIso();
      setState(pkg && isPublic(pkg, today) ? { status: "ready", pkg, today } : { status: "missing" });
    });
    return () => {
      live = false;
    };
  }, [slug]);

  return (
    <Container className="grid gap-6 py-10">
      <Link href="/#packages" className="inline-flex w-fit items-center gap-1 text-sm font-medium text-accent-strong underline-offset-4 hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" /> All packages
      </Link>
      {state.status === "loading" && <div className="h-64 animate-pulse rounded-lg border border-line bg-mist" aria-hidden="true" />}
      {state.status === "missing" && (
        <div className="rounded-lg border border-dashed border-line p-10 text-center">
          <h1 className="text-xl font-semibold">This package is not available</h1>
          <p className="mt-1 text-sm text-ink-soft">It may have been withdrawn by the agent or its departures have passed.</p>
          <Link href="/#packages" className={buttonClasses("primary", "mt-4")}>
            See other packages
          </Link>
        </div>
      )}
      {state.status === "ready" && (
        <>
          <PackageRow
            pkg={state.pkg}
            today={state.today}
            defaultOpen
            actions={
              <>
                <HeartButton saved={favourites.has(state.pkg.id)} onToggle={() => favourites.toggle(state.pkg.id)} title={state.pkg.title} />
                <button type="button" onClick={() => setEnquiring(true)} className={buttonClasses("primary", "py-2")}>
                  Send enquiry
                </button>
              </>
            }
          />
          {enquiring && <EnquiryDialog pkg={state.pkg} today={state.today} onClose={() => setEnquiring(false)} />}
        </>
      )}
    </Container>
  );
}
