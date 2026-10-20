import type { Departure, HotelCity, Meals, PackageInput, PackageType, PackageView, Sharing, TemplateKey } from "@/data/types";
import { templates } from "@/data/seed/templates";
import {
  firstError,
  limits,
  validateAmount,
  validateCity,
  validateDate,
  validateDateOrder,
  validateInteger,
  validateShortText,
  validateText,
  type Check,
} from "@manziltech/validation";
import { sharingOrder, todayIso } from "@/lib/format";

// Form state for the package factory, kept as strings so inputs stay editable, converted on save.

export type HotelRow = { city: HotelCity; place: string; name: string; stars: string; distance: string; nights: string };
export type DepartureRow = { id: string; departsOn: string; returnsOn: string; seatsNote: string; status: Departure["status"] };
export type CustomFieldRow = { label: string; value: string; placement: "primary" | "secondary" };

export type FormState = {
  templateKey: TemplateKey;
  type: PackageType;
  title: string;
  summary: string;
  departureCity: string;
  destinations: string;
  hajjYear: string;
  stayPattern: "" | "shifting" | "non-shifting";
  minaCamp: string;
  flightIncluded: boolean | null;
  flightNotes: string;
  visaIncluded: boolean | null;
  meals: Meals;
  transportIncluded: boolean;
  transportNotes: string;
  ziyaratIncluded: boolean;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  terms: string;
  hotels: HotelRow[];
  departures: DepartureRow[];
  prices: Record<Sharing, string>;
  customFields: CustomFieldRow[];
};

export const newRowId = () => `d-${crypto.randomUUID().slice(0, 8)}`;

const emptyPrices = (): Record<Sharing, string> => ({ single: "", double: "", triple: "", quad: "", quint: "" });
const lines = (text: string) => text.split("\n").map((l) => l.trim()).filter(Boolean);

export function fromTemplate(key: TemplateKey): FormState {
  const template = templates.find((t) => t.key === key);
  if (!template) throw new Error(`Unknown template ${key}`);
  return {
    templateKey: template.key,
    type: template.defaults.type,
    title: "",
    summary: "",
    departureCity: "",
    destinations: "",
    hajjYear: template.defaults.type === "hajj" ? "2027" : "",
    stayPattern: "",
    minaCamp: "",
    flightIncluded: null,
    flightNotes: "",
    visaIncluded: null,
    meals: template.defaults.meals,
    transportIncluded: true,
    transportNotes: "",
    ziyaratIncluded: template.defaults.ziyaratIncluded,
    itinerary: "",
    inclusions: template.defaults.inclusions.join("\n"),
    exclusions: template.defaults.exclusions.join("\n"),
    terms: "",
    hotels:
      template.defaults.type === "ziyarat"
        ? [{ city: "other", place: "", name: "", stars: "", distance: "", nights: "" }]
        : [
            { city: "makkah", place: "", name: "", stars: "", distance: "", nights: "" },
            { city: "madinah", place: "", name: "", stars: "", distance: "", nights: "" },
          ],
    departures: [{ id: newRowId(), departsOn: "", returnsOn: "", seatsNote: "", status: "open" }],
    prices: emptyPrices(),
    customFields: [],
  };
}

export function fromPackage(pkg: PackageView): FormState {
  const prices = emptyPrices();
  for (const p of pkg.prices) prices[p.sharing] = String(p.pricePerPerson);
  return {
    templateKey: pkg.templateKey,
    type: pkg.type,
    title: pkg.title,
    summary: pkg.summary ?? "",
    departureCity: pkg.departureCity,
    destinations: pkg.destinations.join("\n"),
    hajjYear: pkg.hajj ? String(pkg.hajj.year) : "",
    stayPattern: pkg.hajj?.stayPattern ?? "",
    minaCamp: pkg.hajj?.minaCamp ?? "",
    flightIncluded: pkg.flightIncluded,
    flightNotes: pkg.flightNotes ?? "",
    visaIncluded: pkg.visaIncluded,
    meals: pkg.meals,
    transportIncluded: pkg.transportIncluded,
    transportNotes: pkg.transportNotes ?? "",
    ziyaratIncluded: pkg.ziyaratIncluded,
    itinerary: pkg.itinerary.join("\n"),
    inclusions: pkg.inclusions.join("\n"),
    exclusions: pkg.exclusions.join("\n"),
    terms: pkg.terms ?? "",
    hotels: pkg.hotels.map((h) => ({ city: h.city, place: h.place ?? "", name: h.name, stars: h.stars ? String(h.stars) : "", distance: h.distanceMetres !== undefined ? String(h.distanceMetres) : "", nights: String(h.nights) })),
    departures: pkg.departures.map((d) => ({ id: d.id, departsOn: d.departsOn, returnsOn: d.returnsOn, seatsNote: d.seatsNote ?? "", status: d.status })),
    prices,
    customFields: pkg.customFields.map((f) => ({ ...f })),
  };
}

export function toInput(form: FormState, status: PackageInput["status"]): PackageInput {
  const hajjYear = Number(form.hajjYear);
  return {
    type: form.type,
    templateKey: form.templateKey,
    title: form.title.trim(),
    summary: form.summary.trim() || undefined,
    departureCity: form.departureCity.trim(),
    destinations: form.type === "ziyarat" ? lines(form.destinations) : [],
    status,
    hajj: form.type === "hajj" && hajjYear ? { year: hajjYear, stayPattern: form.stayPattern || undefined, minaCamp: form.minaCamp.trim() || undefined } : undefined,
    flightIncluded: form.flightIncluded === true,
    flightNotes: form.flightNotes.trim() || undefined,
    visaIncluded: form.visaIncluded === true,
    meals: form.meals,
    transportIncluded: form.transportIncluded,
    transportNotes: form.transportNotes.trim() || undefined,
    ziyaratIncluded: form.ziyaratIncluded,
    itinerary: lines(form.itinerary),
    inclusions: lines(form.inclusions),
    exclusions: lines(form.exclusions),
    terms: form.terms.trim() || undefined,
    hotels: form.hotels
      .filter((h) => h.name.trim())
      .map((h) => ({
        city: h.city,
        place: h.city === "other" ? h.place.trim() || undefined : undefined,
        name: h.name.trim(),
        stars: h.stars ? Number(h.stars) : undefined,
        distanceMetres: h.distance !== "" ? Number(h.distance) : undefined,
        nights: Number(h.nights) || 0,
      })),
    departures: form.departures
      .filter((d) => d.departsOn || d.returnsOn)
      .map((d) => ({ id: d.id, departsOn: d.departsOn, returnsOn: d.returnsOn, seatsNote: d.seatsNote.trim() || undefined, status: d.status })),
    prices: sharingOrder.filter((s) => Number(form.prices[s]) > 0).map((s) => ({ sharing: s, pricePerPerson: Math.round(Number(form.prices[s])) })),
    customFields: form.customFields.filter((f) => f.label.trim() && f.value.trim()).map((f) => ({ label: f.label.trim(), value: f.value.trim(), placement: f.placement })),
  };
}

export type Errors = Record<string, string>;

// A draft needs a title only. Publishing needs every mandatory field (spec section 7). Values that are
// filled in are always checked with the central rules, drafts included.
export function validate(form: FormState, forPublish: boolean, today: string = todayIso()): Errors {
  const errors: Errors = {};
  const set = (key: string, check: Check) => {
    if (check && !errors[key]) errors[key] = check;
  };
  const year = Number(today.slice(0, 4));

  set("title", validateShortText(form.title, "the title"));
  set("summary", validateText(form.summary, { label: "the summary", required: false, max: 300 }));
  set("departureCity", validateCity(form.departureCity, { required: forPublish }));
  if (form.type === "hajj") {
    set("hajjYear", validateInteger(form.hajjYear, { label: "the Hajj year", min: year, max: year + 5, required: forPublish }));
    set("minaCamp", validateShortText(form.minaCamp, "the Mina camp", { required: false }));
  }
  set("flightNotes", validateShortText(form.flightNotes, "the flight details", { required: false }));
  set("transportNotes", validateShortText(form.transportNotes, "the transport details", { required: false }));
  set("itinerary", validateText(form.itinerary, { label: "the itinerary", required: false, max: limits.longText }));
  set("inclusions", validateText(form.inclusions, { label: "the inclusions", required: false, max: limits.longText }));
  set("exclusions", validateText(form.exclusions, { label: "the exclusions", required: false, max: limits.longText }));
  set("terms", validateText(form.terms, { label: "the terms", required: false, max: limits.longText }));
  if (forPublish && form.flightIncluded === null) errors.flight = "Say whether the flight is included.";
  if (forPublish && form.visaIncluded === null) errors.visa = "Say whether the visa is included.";

  if (form.type === "ziyarat") {
    const places = lines(form.destinations);
    if (forPublish && places.length === 0) errors.destinations = "Add at least one destination.";
    else if (places.length > 15) errors.destinations = "Add 15 destinations or fewer.";
    else set("destinations", firstError(...places.map((place) => validateCity(place, { required: false }))));
  }

  // Departures: rows added in this session may not be in the past; older rows keep their dates.
  const departures = form.departures.filter((d) => d.departsOn || d.returnsOn || d.seatsNote);
  if (forPublish && departures.filter((d) => d.departsOn || d.returnsOn).length === 0) errors.departures = "Add at least one departure.";
  departures.forEach((d, i) => {
    const isNew = d.id.startsWith("d-");
    const row = firstError(
      validateDate(d.departsOn, { label: "the departure date", required: forPublish || Boolean(d.returnsOn), notBefore: isNew ? today : undefined }),
      validateDate(d.returnsOn, { label: "the return date", required: forPublish || Boolean(d.departsOn) }),
      validateDateOrder(d.departsOn, d.returnsOn, "return date", "departure date"),
      validateShortText(d.seatsNote, "the seats note", { required: false, max: 60 }),
    );
    if (row) set("departures", `Departure ${i + 1}: ${row}`);
  });

  // Hotels: a row with anything in it must be complete.
  const stays = form.hotels.filter((h) => h.name.trim() || h.place.trim() || h.stars || h.distance || h.nights);
  stays.forEach((h, i) => {
    const row = firstError(
      validateShortText(h.name, "the hotel name", { max: 80 }),
      h.city === "other" ? validateText(h.place, { label: "the place", max: 60 }) : null,
      validateInteger(h.stars, { label: "the star rating", min: 1, max: 5, required: false }),
      validateInteger(h.distance, { label: "the distance", min: 0, max: 50000, required: false }),
      validateInteger(h.nights, { label: "the number of nights", min: 1, max: 60 }),
    );
    if (row) set("hotels", `Hotel ${i + 1}: ${row}`);
  });
  const named = form.hotels.filter((h) => h.name.trim());
  if (forPublish && !errors.hotels) {
    if (form.type === "ziyarat") {
      if (named.length === 0) errors.hotels = "Add at least one hotel.";
    } else if (!named.some((h) => h.city === "makkah" || h.city === "madinah")) {
      errors.hotels = "Add a hotel in Makkah or Madinah.";
    }
  }

  // Prices: whole rupees, more than 0.
  for (const sharing of sharingOrder) {
    set("prices", validateAmount(form.prices[sharing], { label: `the ${sharing} price`, required: false }));
  }
  if (forPublish && !errors.prices && !sharingOrder.some((s) => Number(form.prices[s]) > 0)) errors.prices = "Add a price for at least one room sharing.";

  const customRows = form.customFields.filter((f) => f.label.trim() || f.value.trim());
  customRows.forEach((f, i) => {
    const row = firstError(validateShortText(f.label, "the field label", { max: 60 }), validateShortText(f.value, "the field value"));
    if (row) set("customFields", `Custom field ${i + 1}: ${row}`);
  });
  return errors;
}

export function previewPackage(form: FormState, agent: PackageView["agent"]): PackageView {
  const input = toInput(form, "active");
  return {
    ...input,
    title: input.title || "Untitled package",
    id: "preview",
    slug: "preview",
    agent,
    updatedAt: new Date().toISOString(),
  };
}
