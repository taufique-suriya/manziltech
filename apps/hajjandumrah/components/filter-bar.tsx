"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { selectClass } from "@/components/fields";
import {
  activeFilterCount,
  defaultFilters,
  distanceCaps,
  nightsBands,
  priceCaps,
  sortLabels,
  starOptions,
  type Filters,
  type SortKey,
} from "@/lib/filters";
import { formatDistance, formatMonth, formatPrice, sharingLabels } from "@/lib/format";
import type { NightsBand } from "@/lib/filters";
import type { PackageType, Sharing } from "@/data/types";

export type Facets = { cities: string[]; destinations: string[]; months: string[]; agents: { id: string; name: string }[] };

type FilterBarProps = {
  filters: Filters;
  facets: Facets;
  onChange: (next: Filters) => void;
};

const types: { value: PackageType | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "hajj", label: "Hajj" },
  { value: "umrah", label: "Umrah" },
  { value: "ziyarat", label: "Ziyarat" },
];

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-xs font-medium text-ink-soft">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className={selectClass}>
        {children}
      </select>
    </label>
  );
}

export function FilterBar({ filters, facets, onChange }: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(filters);
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const optional = <T,>(value: string, parse: (v: string) => T): T | undefined => (value ? parse(value) : undefined);

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Package type" className="inline-flex overflow-hidden rounded-sm border border-line">
          {types.map((t) => (
            <button
              key={t.label}
              type="button"
              aria-pressed={filters.type === t.value}
              onClick={() => set({ type: t.value })}
              className={`px-4 py-2 text-sm font-medium transition-colors ${filters.type === t.value ? "bg-accent text-on-brand" : "text-ink-soft hover:bg-mist"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="filter-panel"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 rounded-sm border border-line px-3 py-2 text-sm font-medium text-ink hover:border-accent lg:hidden"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters{count > 0 ? ` (${count})` : ""}
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm text-ink-soft">
          Sort
          <select value={filters.sort} onChange={(event) => set({ sort: event.target.value as SortKey })} className={`${selectClass} w-auto`}>
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {sortLabels[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div id="filter-panel" className={`${open ? "grid" : "hidden"} gap-3 rounded-lg border border-line bg-mist p-3 sm:grid-cols-2 lg:grid lg:grid-cols-4`}>
        <Select label="Departure city" value={filters.city ?? ""} onChange={(v) => set({ city: v || undefined })}>
          <option value="">Any city</option>
          {facets.cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        {facets.destinations.length > 0 && (
          <Select label="Ziyarat destination" value={filters.destination ?? ""} onChange={(v) => set({ destination: v || undefined })}>
            <option value="">Any destination</option>
            {facets.destinations.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </Select>
        )}
        <Select label="Departure month" value={filters.month ?? ""} onChange={(v) => set({ month: v || undefined })}>
          <option value="">Any month</option>
          {facets.months.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </Select>
        <Select label="Duration" value={filters.nights ?? ""} onChange={(v) => set({ nights: optional(v, (x) => x as NightsBand) })}>
          <option value="">Any duration</option>
          {nightsBands.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </Select>
        <Select label="Room sharing" value={filters.sharing ?? ""} onChange={(v) => set({ sharing: optional(v, (x) => x as Sharing) })}>
          <option value="">Any sharing</option>
          {(["single", "double", "triple", "quad", "quint"] as Sharing[]).map((s) => (
            <option key={s} value={s}>
              {sharingLabels[s]}
            </option>
          ))}
        </Select>
        <Select label="Price per person" value={String(filters.priceMax ?? "")} onChange={(v) => set({ priceMax: optional(v, Number) })}>
          <option value="">Any price</option>
          {priceCaps.map((p) => (
            <option key={p} value={p}>
              Up to {formatPrice(p)}
            </option>
          ))}
        </Select>
        <Select label="Makkah hotel distance" value={String(filters.distanceMax ?? "")} onChange={(v) => set({ distanceMax: optional(v, Number) })}>
          <option value="">Any distance</option>
          {distanceCaps.map((d) => (
            <option key={d} value={d}>
              Within {formatDistance(d)}
            </option>
          ))}
        </Select>
        <Select label="Hotel stars" value={String(filters.starsMin ?? "")} onChange={(v) => set({ starsMin: optional(v, Number) })}>
          <option value="">Any rating</option>
          {starOptions.map((s) => (
            <option key={s} value={s}>
              {s} star and above
            </option>
          ))}
        </Select>
        <Select label="Travel agent" value={filters.agent ?? ""} onChange={(v) => set({ agent: v || undefined })}>
          <option value="">Any agent</option>
          {facets.agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </Select>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:col-span-2 lg:col-span-3">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={filters.flight} onChange={(event) => set({ flight: event.target.checked })} /> Flight included
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={filters.visa} onChange={(event) => set({ visa: event.target.checked })} /> Visa included
          </label>
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            disabled={count === 0}
            onClick={() => onChange({ ...defaultFilters, type: filters.type, sort: filters.sort, saved: filters.saved })}
            className="text-sm font-medium text-accent-strong underline-offset-4 hover:underline disabled:text-muted disabled:no-underline"
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}
