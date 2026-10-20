// Shapes mirror the planned API contracts (spec section 5/6), so swapping seed data for the API
// changes the data source, not the screens.

export type PackageType = "hajj" | "umrah" | "ziyarat";
// 'expired' is never stored: it is derived when every departure is in the past.
export type PackageStatus = "draft" | "active" | "inactive" | "removed";
export type Sharing = "single" | "double" | "triple" | "quad" | "quint";
export type HotelCity = "makkah" | "madinah" | "aziziya" | "other";
export type Meals = "none" | "breakfast" | "half-board" | "full-board";
export type DepartureStatus = "open" | "full" | "cancelled";
export type FieldPlacement = "primary" | "secondary";
export type TemplateKey = "hajj" | "umrah" | "umrah-ziyarat" | "ziyarat";

export type HotelStay = {
  city: HotelCity;
  // For stays outside Makkah, Madinah and Aziziya (ziyarat tours): 'Karbala, Iraq'.
  place?: string;
  name: string;
  stars?: number;
  distanceMetres?: number;
  nights: number;
};

export type Departure = {
  id: string;
  departsOn: string; // ISO date, yyyy-mm-dd
  returnsOn: string;
  seatsNote?: string;
  status: DepartureStatus;
};

export type PriceOption = {
  sharing: Sharing;
  pricePerPerson: number; // INR
};

export type CustomField = {
  label: string;
  value: string;
  placement: FieldPlacement;
};

export type AgentSummary = {
  id: string;
  displayName: string;
  city: string;
  registration?: string; // shown on the expanded details only
};

export type PackageView = {
  id: string;
  slug: string;
  agent: AgentSummary;
  type: PackageType;
  templateKey: TemplateKey;
  title: string;
  summary?: string;
  departureCity: string;
  // Ziyarat tours: the holy sites and cities visited ('Najaf', 'Karbala'). Empty for Hajj and Umrah.
  destinations: string[];
  status: PackageStatus;
  hajj?: { year: number; stayPattern?: "shifting" | "non-shifting"; minaCamp?: string };
  flightIncluded: boolean;
  flightNotes?: string;
  visaIncluded: boolean;
  meals: Meals;
  transportIncluded: boolean;
  transportNotes?: string;
  ziyaratIncluded: boolean;
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
  terms?: string;
  hotels: HotelStay[];
  departures: Departure[];
  prices: PriceOption[];
  customFields: CustomField[];
  updatedAt: string; // ISO date-time
};

// Editable part of a package (the agent is set by the API from the signed-in agent).
export type PackageInput = Omit<PackageView, "id" | "slug" | "agent" | "updatedAt">;

export type ContactPreference = "call" | "whatsapp";

export type EnquiryInput = {
  packageId: string;
  name: string;
  mobile: string; // E.164
  email?: string;
  city?: string;
  adults: number;
  children: number;
  infants: number;
  preferredDepartureId?: string; // undefined = flexible
  message?: string;
  contactPreference: ContactPreference;
};

export type LeadStatus = "new" | "contacted" | "follow-up" | "booked" | "lost";
export type CustomerStatus = "received" | "in-progress" | "booked" | "closed";

export type LeadActivity = {
  id: string;
  at: string;
  kind: "created" | "status" | "note" | "follow-up";
  text: string;
  by: string;
};

export type LeadView = {
  id: string;
  reference: string;
  packageId: string;
  packageTitle: string;
  agentId: string;
  customer: { name: string; mobile: string; email?: string; city?: string };
  adults: number;
  children: number;
  infants: number;
  preferredDeparture?: string; // display text
  message?: string;
  contactPreference: ContactPreference;
  status: LeadStatus;
  lostReason?: string;
  nextFollowUpAt?: string; // ISO date
  createdAt: string;
  activity: LeadActivity[];
};

// What a customer sees when looking up their enquiries.
export type CustomerEnquiry = {
  reference: string;
  packageTitle: string;
  agentName: string;
  sentAt: string;
  status: CustomerStatus;
  // Only returned when the lookup includes the enquiry reference.
  details?: {
    name: string;
    travellers: string;
    preferredDeparture?: string;
    message?: string;
  };
};

export type SignedInAgent = { id: string; displayName: string; email: string };
