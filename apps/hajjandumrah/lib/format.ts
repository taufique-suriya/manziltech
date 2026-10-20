import type { HotelCity, HotelStay, Meals, PackageType, Sharing } from "@/data/types";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

// 'INR 1,25,000' style: the grouping is Indian, the symbol is spelled out for clarity.
export function formatPrice(amount: number): string {
  return inr.format(amount).replace("₹", "INR ").replace(/\s+/g, " ").trim();
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

// '12 Nov 2026' from an ISO date or date-time (read as UTC, so it never shifts a day).
export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso));
}

const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

export function formatMonth(key: string): string {
  return monthFormat.format(new Date(`${key}-01T00:00:00Z`));
}

export function formatDistance(metres: number): string {
  return metres >= 1000 ? `${(metres / 1000).toFixed(1).replace(/\.0$/, "")} km` : `${metres} m`;
}

export const sharingLabels: Record<Sharing, string> = {
  single: "Single",
  double: "Double",
  triple: "Triple",
  quad: "Quad",
  quint: "Quint",
};

export const sharingOrder: readonly Sharing[] = ["single", "double", "triple", "quad", "quint"];

export const cityLabels: Record<HotelCity, string> = {
  makkah: "Makkah",
  madinah: "Madinah",
  aziziya: "Aziziya",
  other: "Other place",
};

export const typeLabels: Record<PackageType, string> = { hajj: "Hajj", umrah: "Umrah", ziyarat: "Ziyarat" };

// The city of a stay as shown to customers: Makkah, Madinah, Aziziya, or the place an agent typed.
export function stayLabel(stay: Pick<HotelStay, "city" | "place">): string {
  return stay.city === "other" ? stay.place || "Stay" : cityLabels[stay.city];
}

export function distanceTarget(city: HotelCity): string {
  return city === "makkah" ? "the Haram" : city === "madinah" ? "Masjid an-Nabawi" : "the main site";
}

export const mealLabels: Record<Meals, string> = {
  none: "No meals",
  breakfast: "Breakfast",
  "half-board": "Half board",
  "full-board": "Full board",
};

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}

// Today as yyyy-mm-dd in UTC; passed around so callers stay testable.
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
