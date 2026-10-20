import { Check, X } from "lucide-react";
import type { PackageView } from "@/data/types";
import { distanceTarget, formatDate, formatDistance, formatPrice, mealLabels, sharingLabels, stayLabel } from "@/lib/format";
import { sortedPrices } from "@/lib/packages";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid content-start gap-2">
      <h4 className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-accent-strong">{title}</h4>
      {children}
    </section>
  );
}

const departureStatus = { open: "Open", full: "Full", cancelled: "Cancelled" } as const;

// Secondary fields: shown when a row is expanded and on the package page (spec section 3.2).
export function PackageDetails({ pkg }: { pkg: PackageView }) {
  const secondary = pkg.customFields.filter((f) => f.placement === "secondary");
  return (
    <div className="grid gap-6 border-t border-line pt-5 text-sm sm:grid-cols-2">
      <Block title="Price per person">
        <table className="w-full max-w-xs">
          <tbody>
            {sortedPrices(pkg).map((p) => (
              <tr key={p.sharing} className="border-b border-line last:border-0">
                <td className="py-1.5 text-ink-soft">{sharingLabels[p.sharing]} sharing</td>
                <td className="py-1.5 text-right font-medium">{formatPrice(p.pricePerPerson)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Block>

      <Block title="Departures">
        {pkg.departures.length === 0 ? (
          <p className="text-muted">No dates added yet.</p>
        ) : (
          <ul className="grid gap-1.5">
            {[...pkg.departures]
              .sort((a, b) => a.departsOn.localeCompare(b.departsOn))
              .map((d) => (
                <li key={d.id} className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span>
                    {formatDate(d.departsOn)} <span className="text-muted">to {formatDate(d.returnsOn)}</span>
                  </span>
                  <span className="text-xs text-ink-soft">
                    {d.seatsNote ? `${d.seatsNote} · ` : ""}
                    {departureStatus[d.status]}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </Block>

      {pkg.destinations.length > 0 && (
        <Block title="Destinations">
          <p className="text-ink-soft">{pkg.destinations.join(", ")}</p>
        </Block>
      )}

      <Block title="Hotels">
        <ul className="grid gap-1.5">
          {pkg.hotels.map((h, i) => (
            <li key={`${h.city}-${i}`}>
              <span className="font-medium">{stayLabel(h)}</span>: {h.name}
              <span className="text-ink-soft">
                {h.stars ? `, ${h.stars} star` : ""}
                {h.distanceMetres !== undefined ? `, ${formatDistance(h.distanceMetres)} from ${distanceTarget(h.city)}` : ""}, {h.nights} nights
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Travel">
        <ul className="grid gap-1 text-ink-soft">
          <li>Flight: {pkg.flightIncluded ? `included${pkg.flightNotes ? ` (${pkg.flightNotes})` : ""}` : "not included"}</li>
          <li>Visa: {pkg.visaIncluded ? "included" : "not included"}</li>
          <li>Meals: {mealLabels[pkg.meals].toLowerCase()}</li>
          <li>Transport: {pkg.transportIncluded ? `included${pkg.transportNotes ? ` (${pkg.transportNotes})` : ""}` : "not included"}</li>
          <li>Ziyarat: {pkg.ziyaratIncluded ? "included" : "not included"}</li>
          {pkg.hajj && (
            <li>
              Hajj {pkg.hajj.year}
              {pkg.hajj.stayPattern ? `, ${pkg.hajj.stayPattern} stay` : ""}
              {pkg.hajj.minaCamp ? `, ${pkg.hajj.minaCamp}` : ""}
            </li>
          )}
        </ul>
      </Block>

      {pkg.inclusions.length > 0 && (
        <Block title="Included">
          <ul className="grid gap-1">
            {pkg.inclusions.map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {pkg.exclusions.length > 0 && (
        <Block title="Not included">
          <ul className="grid gap-1 text-ink-soft">
            {pkg.exclusions.map((item) => (
              <li key={item} className="flex gap-2">
                <X className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {pkg.itinerary.length > 0 && (
        <Block title="Itinerary">
          <ol className="grid gap-1 text-ink-soft">
            {pkg.itinerary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </Block>
      )}

      {secondary.length > 0 && (
        <Block title="More details">
          <dl className="grid gap-1">
            {secondary.map((f) => (
              <div key={f.label} className="flex flex-wrap gap-x-2">
                <dt className="font-medium">{f.label}:</dt>
                <dd className="text-ink-soft">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      {pkg.terms && (
        <Block title="Terms">
          <p className="text-ink-soft">{pkg.terms}</p>
        </Block>
      )}

      <Block title="Travel agent">
        <p>
          <span className="font-medium">{pkg.agent.displayName}</span>, {pkg.agent.city}
        </p>
        {pkg.agent.registration && <p className="text-ink-soft">{pkg.agent.registration}</p>}
        <p className="text-xs text-muted">The agent contacts you after you send an enquiry.</p>
      </Block>
    </div>
  );
}
