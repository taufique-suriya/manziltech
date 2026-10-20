import type { Departure, HotelStay, PackageView, PriceOption, Sharing } from "@/data/types";
import { sharingOrder } from "@/lib/format";

// Values derived from a package: the same ones the API will compute as columns for filtering and sorting.

export function openDepartures(pkg: PackageView, today: string): Departure[] {
  return pkg.departures
    .filter((d) => d.status !== "cancelled" && d.departsOn >= today)
    .sort((a, b) => a.departsOn.localeCompare(b.departsOn));
}

export function nextDeparture(pkg: PackageView, today: string): Departure | undefined {
  return openDepartures(pkg, today)[0];
}

// A package is expired when no departure is left in the future.
export function isExpired(pkg: PackageView, today: string): boolean {
  return pkg.departures.every((d) => d.status === "cancelled" || d.departsOn < today);
}

export type DisplayStatus = PackageView["status"] | "expired";

export function displayStatus(pkg: PackageView, today: string): DisplayStatus {
  return pkg.status === "active" && isExpired(pkg, today) ? "expired" : pkg.status;
}

export function nightsTotal(pkg: PackageView): number {
  return pkg.hotels.reduce((sum, h) => sum + h.nights, 0);
}

export function hotelIn(pkg: PackageView, city: HotelStay["city"]): HotelStay | undefined {
  return pkg.hotels.find((h) => h.city === city);
}

export function makkahDistance(pkg: PackageView): number | undefined {
  return hotelIn(pkg, "makkah")?.distanceMetres;
}

export function priceFor(pkg: PackageView, sharing?: Sharing): PriceOption | undefined {
  if (sharing) return pkg.prices.find((p) => p.sharing === sharing);
  return [...pkg.prices].sort((a, b) => a.pricePerPerson - b.pricePerPerson)[0];
}

export function sortedPrices(pkg: PackageView): PriceOption[] {
  return [...pkg.prices].sort((a, b) => sharingOrder.indexOf(a.sharing) - sharingOrder.indexOf(b.sharing));
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

// What customers may see: active and with at least one departure left.
export function isPublic(pkg: PackageView, today: string): boolean {
  return pkg.status === "active" && !isExpired(pkg, today);
}
