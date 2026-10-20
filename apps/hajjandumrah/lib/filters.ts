import type { PackageType, PackageView, Sharing } from "@/data/types";
import { nextDeparture, makkahDistance, monthKey, nightsTotal, priceFor } from "@/lib/packages";

export type SortKey = "recommended" | "price-asc" | "price-desc" | "departure" | "duration" | "distance";

export type Filters = {
  type?: PackageType;
  city?: string;
  destination?: string; // ziyarat tours
  month?: string; // yyyy-mm
  nights?: NightsBand;
  priceMax?: number;
  distanceMax?: number;
  starsMin?: number;
  sharing?: Sharing;
  flight: boolean;
  visa: boolean;
  agent?: string;
  saved: boolean;
  sort: SortKey;
};

export type NightsBand = "upto10" | "11-15" | "16-21" | "22plus";

export const nightsBands: { value: NightsBand; label: string; min: number; max: number }[] = [
  { value: "upto10", label: "Up to 10 nights", min: 0, max: 10 },
  { value: "11-15", label: "11 to 15 nights", min: 11, max: 15 },
  { value: "16-21", label: "16 to 21 nights", min: 16, max: 21 },
  { value: "22plus", label: "22 nights or more", min: 22, max: 999 },
];

export const priceCaps = [75000, 100000, 150000, 250000, 500000, 1000000];
export const distanceCaps = [300, 700, 1500];
export const starOptions = [3, 4, 5];

export const sortLabels: Record<SortKey, string> = {
  recommended: "Recommended",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  departure: "Departure: soonest",
  duration: "Duration: shortest",
  distance: "Closest to the Haram",
};

export const defaultFilters: Filters = { flight: false, visa: false, saved: false, sort: "recommended" };

const num = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const oneOf = <T extends string>(value: string | null, allowed: readonly T[]): T | undefined =>
  allowed.includes(value as T) ? (value as T) : undefined;

export function parseFilters(params: URLSearchParams): Filters {
  return {
    type: oneOf(params.get("type"), ["hajj", "umrah", "ziyarat"] as const),
    city: params.get("city") || undefined,
    destination: params.get("dest") || undefined,
    month: /^\d{4}-\d{2}$/.test(params.get("month") ?? "") ? (params.get("month") as string) : undefined,
    nights: oneOf(params.get("nights"), nightsBands.map((b) => b.value)),
    priceMax: num(params.get("price")),
    distanceMax: num(params.get("distance")),
    starsMin: num(params.get("stars")),
    sharing: oneOf(params.get("sharing"), ["single", "double", "triple", "quad", "quint"] as const),
    flight: params.get("flight") === "1",
    visa: params.get("visa") === "1",
    agent: params.get("agent") || undefined,
    saved: params.get("saved") === "1",
    sort: oneOf(params.get("sort"), Object.keys(sortLabels) as SortKey[]) ?? "recommended",
  };
}

export function serializeFilters(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.city) params.set("city", filters.city);
  if (filters.destination) params.set("dest", filters.destination);
  if (filters.month) params.set("month", filters.month);
  if (filters.nights) params.set("nights", filters.nights);
  if (filters.priceMax) params.set("price", String(filters.priceMax));
  if (filters.distanceMax) params.set("distance", String(filters.distanceMax));
  if (filters.starsMin) params.set("stars", String(filters.starsMin));
  if (filters.sharing) params.set("sharing", filters.sharing);
  if (filters.flight) params.set("flight", "1");
  if (filters.visa) params.set("visa", "1");
  if (filters.agent) params.set("agent", filters.agent);
  if (filters.saved) params.set("saved", "1");
  if (filters.sort !== "recommended") params.set("sort", filters.sort);
  return params.toString();
}

export function activeFilterCount(filters: Filters): number {
  const counted = [filters.city, filters.destination, filters.month, filters.nights, filters.priceMax, filters.distanceMax, filters.starsMin, filters.sharing, filters.agent, filters.flight || undefined, filters.visa || undefined];
  return counted.filter((v) => v !== undefined).length;
}

export function applyFilters(packages: PackageView[], filters: Filters, today: string, favourites: readonly string[]): PackageView[] {
  const band = nightsBands.find((b) => b.value === filters.nights);
  return packages.filter((pkg) => {
    if (filters.type && pkg.type !== filters.type) return false;
    if (filters.city && pkg.departureCity !== filters.city) return false;
    if (filters.destination && !pkg.destinations.includes(filters.destination)) return false;
    if (filters.month && !pkg.departures.some((d) => d.status !== "cancelled" && d.departsOn >= today && monthKey(d.departsOn) === filters.month)) return false;
    if (band) {
      const nights = nightsTotal(pkg);
      if (nights < band.min || nights > band.max) return false;
    }
    if (filters.sharing && !priceFor(pkg, filters.sharing)) return false;
    if (filters.priceMax) {
      const price = priceFor(pkg, filters.sharing)?.pricePerPerson;
      if (price === undefined || price > filters.priceMax) return false;
    }
    if (filters.distanceMax) {
      const distance = makkahDistance(pkg);
      if (distance === undefined || distance > filters.distanceMax) return false;
    }
    if (filters.starsMin && !pkg.hotels.some((h) => (h.stars ?? 0) >= (filters.starsMin ?? 0))) return false;
    if (filters.flight && !pkg.flightIncluded) return false;
    if (filters.visa && !pkg.visaIncluded) return false;
    if (filters.agent && pkg.agent.id !== filters.agent) return false;
    if (filters.saved && !favourites.includes(pkg.id)) return false;
    return true;
  });
}

export function sortPackages(packages: PackageView[], sort: SortKey, today: string, sharing?: Sharing): PackageView[] {
  const price = (p: PackageView) => priceFor(p, sharing)?.pricePerPerson ?? Number.MAX_SAFE_INTEGER;
  const departure = (p: PackageView) => nextDeparture(p, today)?.departsOn ?? "9999-12-31";
  const distance = (p: PackageView) => makkahDistance(p) ?? Number.MAX_SAFE_INTEGER;
  const compare: Record<SortKey, (a: PackageView, b: PackageView) => number> = {
    recommended: (a, b) => departure(a).localeCompare(departure(b)) || b.updatedAt.localeCompare(a.updatedAt),
    "price-asc": (a, b) => price(a) - price(b),
    "price-desc": (a, b) => price(b) - price(a),
    departure: (a, b) => departure(a).localeCompare(departure(b)),
    duration: (a, b) => nightsTotal(a) - nightsTotal(b),
    distance: (a, b) => distance(a) - distance(b),
  };
  return [...packages].sort(compare[sort]);
}
