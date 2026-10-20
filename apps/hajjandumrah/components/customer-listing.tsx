"use client";

import { Heart, LifeBuoy, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { buttonClasses } from "@manziltech/ui";
import type { PackageView } from "@/data/types";
import { EnquiryDialog } from "@/components/enquiry-dialog";
import { FilterBar, type Facets } from "@/components/filter-bar";
import { LookupDialog } from "@/components/lookup-dialog";
import { PackageRow } from "@/components/package-row";
import { useFavourites } from "@/lib/favourites";
import { applyFilters, defaultFilters, parseFilters, serializeFilters, sortPackages, type Filters } from "@/lib/filters";
import { plural } from "@/lib/format";
import { monthKey, openDepartures } from "@/lib/packages";
import { contactUrl } from "@/lib/site";
import { usePublicPackages } from "@/lib/use-public-packages";

export function HeartButton({ saved, onToggle, title }: { saved: boolean; onToggle: () => void; title: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      className="rounded-sm border border-line p-2 text-ink-soft transition-colors hover:border-accent hover:text-accent-strong"
    >
      <Heart className={`size-4 ${saved ? "fill-hajjandumrah-warm text-hajjandumrah-warm" : ""}`} aria-hidden="true" />
    </button>
  );
}

function buildFacets(packages: PackageView[], today: string): Facets {
  const cities = new Set<string>();
  const destinations = new Set<string>();
  const months = new Set<string>();
  const agents = new Map<string, string>();
  for (const pkg of packages) {
    cities.add(pkg.departureCity);
    pkg.destinations.forEach((d) => destinations.add(d));
    agents.set(pkg.agent.id, pkg.agent.displayName);
    for (const d of openDepartures(pkg, today)) months.add(monthKey(d.departsOn));
  }
  return {
    cities: [...cities].sort(),
    destinations: [...destinations].sort(),
    months: [...months].sort(),
    agents: [...agents].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name)),
  };
}

// Landing page for customers: filter chips on top, full-width rows, a sticky right column (layout A).
export function CustomerListing() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const { packages, today } = usePublicPackages();
  const favourites = useFavourites();
  const [enquiryFor, setEnquiryFor] = useState<PackageView | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);

  const facets = useMemo(() => (packages ? buildFacets(packages, today) : { cities: [], destinations: [], months: [], agents: [] }), [packages, today]);
  const visible = useMemo(() => {
    if (!packages) return [];
    return sortPackages(applyFilters(packages, filters, today, favourites.ids), filters.sort, today, filters.sharing);
  }, [packages, filters, today, favourites.ids]);

  const setFilters = (next: Filters) => {
    const qs = serializeFilters(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div id="packages" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
      <div className="grid gap-5">
        <FilterBar filters={filters} facets={facets} onChange={setFilters} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-soft" aria-live="polite">
            {packages ? plural(visible.length, "package") : "Loading packages..."}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={filters.saved}
              onClick={() => setFilters({ ...filters, saved: !filters.saved })}
              className={buttonClasses("secondary", `py-2 ${filters.saved ? "border-accent text-accent-strong" : ""}`)}
            >
              <Heart className="size-4" aria-hidden="true" />
              Saved ({favourites.ids.length})
            </button>
            <button type="button" onClick={() => setLookupOpen(true)} className={buttonClasses("secondary", "py-2")}>
              <Search className="size-4" aria-hidden="true" />
              My enquiries
            </button>
          </div>
        </div>

        {!packages ? (
          <div className="grid gap-4" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-lg border border-line bg-mist" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line p-10 text-center">
            <h3 className="text-lg font-semibold">{filters.saved && favourites.ids.length === 0 ? "No saved packages yet" : "No packages match"}</h3>
            <p className="mt-1 text-sm text-ink-soft">
              {filters.saved && favourites.ids.length === 0
                ? "Tap the heart on a package to keep it here."
                : "Try removing a filter or choosing a different month."}
            </p>
            <button type="button" onClick={() => setFilters({ ...defaultFilters, sort: filters.sort })} className={buttonClasses("secondary", "mt-4")}>
              Show all packages
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {visible.map((pkg) => (
              <PackageRow
                key={pkg.id}
                pkg={pkg}
                today={today}
                sharing={filters.sharing}
                actions={
                  <>
                    <HeartButton saved={favourites.has(pkg.id)} onToggle={() => favourites.toggle(pkg.id)} title={pkg.title} />
                    <button type="button" onClick={() => setEnquiryFor(pkg)} className={buttonClasses("primary", "py-2")}>
                      Send enquiry
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Placeholder: the contents of this column are decided later (spec Q-12). */}
      <aside aria-label="Help" className="grid content-start gap-3 rounded-lg border border-line bg-mist p-5 lg:sticky lg:top-24">
        <LifeBuoy className="size-6 text-hajjandumrah-warm" aria-hidden="true" />
        <h2 className="text-base font-semibold">Need help choosing?</h2>
        <p className="text-sm text-ink-soft">Tell us when you want to travel and who is coming, and we will point you to the right agent.</p>
        <a href={contactUrl} className="text-sm font-semibold text-accent-strong underline-offset-4 hover:underline">
          Contact ManzilTech
        </a>
      </aside>

      {enquiryFor && <EnquiryDialog key={enquiryFor.id} pkg={enquiryFor} today={today} onClose={() => setEnquiryFor(null)} />}
      {lookupOpen && <LookupDialog onClose={() => setLookupOpen(false)} />}
    </div>
  );
}
