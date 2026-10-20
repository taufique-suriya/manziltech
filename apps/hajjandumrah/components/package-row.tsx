"use client";

import { Bus, ChevronDown, FileCheck2, Landmark, MapPin, Plane, Utensils, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import type { HotelStay, PackageView, Sharing } from "@/data/types";
import { Badge } from "@/components/fields";
import { PackageDetails } from "@/components/package-details";
import { distanceTarget, formatDate, formatDistance, formatPrice, mealLabels, plural, sharingLabels, stayLabel, typeLabels } from "@/lib/format";
import { nightsTotal, openDepartures, priceFor } from "@/lib/packages";

type PackageRowProps = {
  pkg: PackageView;
  today: string;
  sharing?: Sharing;
  // Agent view: a status badge next to the title, and faded rows for inactive packages.
  statusBadge?: ReactNode;
  faded?: boolean;
  // Buttons in the price column (Send enquiry, heart, agent actions).
  actions?: ReactNode;
  defaultOpen?: boolean;
};

function Inclusion({ icon: Icon, label, included }: { icon: LucideIcon; label: string; included: boolean }) {
  return (
    <li
      className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-xs ${included ? "border-accent/40 text-accent-strong" : "border-line text-muted line-through"}`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
      <span className="sr-only">{included ? " included" : " not included"}</span>
    </li>
  );
}

function HotelLine({ stay }: { stay: HotelStay }) {
  const details = [
    stay.stars ? `${stay.stars} star` : "",
    stay.distanceMetres !== undefined ? `${formatDistance(stay.distanceMetres)} from ${distanceTarget(stay.city)}` : "",
    plural(stay.nights, "night"),
  ].filter(Boolean);
  const holyCity = stay.city === "makkah" || stay.city === "madinah";
  return (
    <li className="flex items-start gap-1.5">
      <MapPin className={`mt-0.5 size-3.5 shrink-0 ${holyCity ? "text-hajjandumrah-warm" : "text-muted"}`} aria-hidden="true" />
      <span className="grid">
        <span>
          <span className="font-medium">{stayLabel(stay)}</span> · {stay.name}
        </span>
        <span className="text-xs text-ink-soft">{details.join(" · ")}</span>
      </span>
    </li>
  );
}

const cityOrder = ["makkah", "madinah", "aziziya", "other"] as const;

// One package as a full-width row (layout A). Primary fields are always visible; the rest expands in place.
export function PackageRow({ pkg, today, sharing, statusBadge, faded = false, actions, defaultOpen = false }: PackageRowProps) {
  const [open, setOpen] = useState(defaultOpen);
  const regionId = useId();
  const upcoming = openDepartures(pkg, today);
  const first = upcoming[0];
  const price = priceFor(pkg, sharing);
  const primaryFields = pkg.customFields.filter((f) => f.placement === "primary");
  const stays = [...pkg.hotels].sort((a, b) => cityOrder.indexOf(a.city) - cityOrder.indexOf(b.city));

  return (
    <article className={`rounded-lg border border-line bg-paper p-4 transition-opacity sm:p-5 ${faded ? "opacity-55" : ""}`} aria-label={pkg.title}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.3fr)_minmax(0,0.85fr)] lg:gap-6">
        <div className="grid content-start gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={pkg.type === "hajj" ? "warm" : pkg.type === "ziyarat" ? "brand" : "accent"}>{typeLabels[pkg.type]}</Badge>
            {statusBadge}
          </div>
          <h3 className="text-lg font-semibold leading-snug tracking-tight">
            <Link href={`/package/?slug=${pkg.slug}`} className="hover:text-accent-strong">
              {pkg.title}
            </Link>
          </h3>
          <p className="text-sm text-ink-soft">
            {pkg.agent.displayName}, {pkg.agent.city}
          </p>
          <p className="text-sm">
            <span className="text-ink-soft">From </span>
            {pkg.departureCity}
            <span className="text-ink-soft"> · </span>
            {first ? (
              <>
                {formatDate(first.departsOn)}
                {upcoming.length > 1 && <span className="text-ink-soft"> and {plural(upcoming.length - 1, "more date")}</span>}
              </>
            ) : (
              <span className="text-ink-soft">No upcoming departures</span>
            )}
          </p>
          <p className="text-sm text-ink-soft">{plural(nightsTotal(pkg), "night")} in total</p>
        </div>

        <div className="grid content-start gap-2.5 text-sm">
          {pkg.destinations.length > 0 && (
            <p className="flex items-start gap-1.5">
              <Landmark className="mt-0.5 size-3.5 shrink-0 text-hajjandumrah-warm" aria-hidden="true" />
              <span>
                <span className="font-medium">Visiting</span> · {pkg.destinations.join(", ")}
              </span>
            </p>
          )}
          <ul className="grid gap-1.5">
            {stays.map((stay, i) => (
              <HotelLine key={`${stay.city}-${stay.name}-${i}`} stay={stay} />
            ))}
          </ul>
          <ul className="flex flex-wrap gap-1.5" aria-label="What is included">
            <Inclusion icon={Plane} label="Flight" included={pkg.flightIncluded} />
            <Inclusion icon={FileCheck2} label="Visa" included={pkg.visaIncluded} />
            <Inclusion icon={Utensils} label={pkg.meals === "none" ? "Meals" : mealLabels[pkg.meals]} included={pkg.meals !== "none"} />
            <Inclusion icon={Bus} label="Transport" included={pkg.transportIncluded} />
            <Inclusion icon={Landmark} label="Ziyarat" included={pkg.ziyaratIncluded} />
          </ul>
          {primaryFields.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-soft">
              {primaryFields.map((f) => (
                <li key={f.label}>
                  <span className="font-medium text-ink">{f.label}:</span> {f.value}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid content-between gap-3 lg:justify-items-end lg:text-right">
          <div>
            <p className="text-xs text-ink-soft">From{price ? ` · ${sharingLabels[price.sharing].toLowerCase()} sharing` : ""}, per person</p>
            <p className="text-xl font-semibold tracking-tight">{price ? formatPrice(price.pricePerPerson) : "Price on request"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div>
        </div>
      </div>

      <div className="mt-3 flex">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={regionId}
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent-strong underline-offset-4 hover:underline"
        >
          {open ? "Fewer details" : "More details"}
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>
      <div id={regionId} hidden={!open} className="mt-4">
        {open && <PackageDetails pkg={pkg} />}
      </div>
    </article>
  );
}
