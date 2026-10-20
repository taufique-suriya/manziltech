import type {
  CustomerEnquiry,
  CustomerStatus,
  EnquiryInput,
  LeadActivity,
  LeadStatus,
  LeadView,
  PackageInput,
  PackageStatus,
  PackageView,
  SignedInAgent,
} from "@/data/types";
import { seedAgents } from "@/data/seed/agents";
import { seedLeads } from "@/data/seed/leads";
import { seedPackages } from "@/data/seed/packages";
import { formatDate, plural } from "@/lib/format";

// Data access for the Hajj site. Every function is async and shaped like the planned endpoints
// (spec section 5). Until the API exists they run over seed data kept in this browser's storage,
// so the screens behave the same way they will with the real API.

type Enquiry = {
  reference: string;
  leadId: string;
  mobile: string;
  sentAt: string;
};

type Db = { version: 1; seed: number; packages: PackageView[]; leads: LeadView[]; enquiries: Enquiry[] };

const DB_KEY = "mt-hajj-db-v1";
// Raise when the seed data changes, so this browser picks up the new seed instead of its stored copy.
const SEED_VERSION = 4;

function freshDb(): Db {
  return {
    version: 1,
    seed: SEED_VERSION,
    packages: structuredClone([...seedPackages]),
    leads: structuredClone([...seedLeads]),
    enquiries: seedLeads.map((lead) => ({ reference: lead.reference, leadId: lead.id, mobile: lead.customer.mobile, sentAt: lead.createdAt })),
  };
}

function load(): Db {
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Db;
      if (parsed.version === 1 && parsed.seed === SEED_VERSION) return parsed;
    }
  } catch {
    // Storage blocked or corrupt: start from the seed.
  }
  return freshDb();
}

function save(db: Db): void {
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // Storage unavailable (private mode, full): changes last for this page view only.
  }
}

const memory: { db?: Db } = {};
function db(): Db {
  memory.db ??= load();
  return memory.db;
}
function commit(): void {
  if (memory.db) save(memory.db);
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "package";
const now = () => new Date().toISOString();
const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

function uniqueSlug(title: string, ignoreId?: string): string {
  const base = slugify(title);
  const taken = new Set(db().packages.filter((p) => p.id !== ignoreId).map((p) => p.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

// ---- sign-in (stand-in for the real sign-in, spec DEF-01) ----

export async function signIn(email: string, password: string): Promise<SignedInAgent | null> {
  const found = seedAgents.find((a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password);
  return found ? { id: found.id, displayName: found.displayName, email: found.email } : null;
}

// ---- public ----

export async function listPublicPackages(): Promise<PackageView[]> {
  return db().packages.filter((p) => p.status === "active");
}

export async function getPublicPackage(slug: string): Promise<PackageView | null> {
  return db().packages.find((p) => p.slug === slug && p.status === "active") ?? null;
}

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function newReference(existing: Set<string>): string {
  for (;;) {
    const bytes = crypto.getRandomValues(new Uint8Array(5));
    const ref = `HU-${Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("")}`;
    if (!existing.has(ref)) return ref;
  }
}

export async function createEnquiry(input: EnquiryInput): Promise<{ reference: string }> {
  const store = db();
  const pkg = store.packages.find((p) => p.id === input.packageId);
  if (!pkg) throw new Error("Package not found");
  const departure = pkg.departures.find((d) => d.id === input.preferredDepartureId);
  const sentAt = now();
  const reference = newReference(new Set(store.enquiries.map((e) => e.reference)));
  const preferredDeparture = departure ? formatDate(departure.departsOn) : "Flexible";

  // A repeat enquiry for the same package from the same mobile joins the open lead.
  const open = store.leads.find(
    (l) => l.packageId === pkg.id && l.customer.mobile === input.mobile && l.status !== "booked" && l.status !== "lost",
  );
  let leadId: string;
  if (open) {
    leadId = open.id;
    open.activity.push({ id: newId("act"), at: sentAt, kind: "note", text: `Repeat enquiry ${reference}${input.message ? `: ${input.message}` : ""}`, by: "System" });
  } else {
    leadId = newId("lead");
    store.leads.unshift({
      id: leadId,
      reference,
      packageId: pkg.id,
      packageTitle: pkg.title,
      agentId: pkg.agent.id,
      customer: { name: input.name, mobile: input.mobile, email: input.email, city: input.city },
      adults: input.adults,
      children: input.children,
      infants: input.infants,
      preferredDeparture,
      message: input.message,
      contactPreference: input.contactPreference,
      status: "new",
      createdAt: sentAt,
      activity: [{ id: newId("act"), at: sentAt, kind: "created", text: "Enquiry received", by: "System" }],
    });
  }
  store.enquiries.push({ reference, leadId, mobile: input.mobile, sentAt });
  commit();
  return { reference };
}

const customerStatus: Record<LeadStatus, CustomerStatus> = {
  new: "received",
  contacted: "in-progress",
  "follow-up": "in-progress",
  booked: "booked",
  lost: "closed",
};

// With the reference: full details of that enquiry. With the mobile only: a limited list
// (package, date sent, status) and no personal details.
export async function lookupEnquiries(mobile: string, reference?: string): Promise<CustomerEnquiry[]> {
  const store = db();
  const ref = reference?.trim().toUpperCase();
  const mine = store.enquiries.filter((e) => e.mobile === mobile && (!ref || e.reference === ref));
  return mine
    .map((enquiry) => {
      const lead = store.leads.find((l) => l.id === enquiry.leadId);
      const pkg = lead && store.packages.find((p) => p.id === lead.packageId);
      if (!lead) return null;
      const result: CustomerEnquiry = {
        reference: ref ? enquiry.reference : "",
        packageTitle: lead.packageTitle,
        agentName: pkg?.agent.displayName ?? "",
        sentAt: enquiry.sentAt,
        status: customerStatus[lead.status],
      };
      if (ref) {
        result.reference = enquiry.reference;
        result.details = {
          name: lead.customer.name,
          travellers: [plural(lead.adults, "adult"), lead.children ? plural(lead.children, "child", "children") : "", lead.infants ? plural(lead.infants, "infant") : ""]
            .filter(Boolean)
            .join(", "),
          preferredDeparture: lead.preferredDeparture,
          message: lead.message,
        };
      }
      return result;
    })
    .filter((e): e is CustomerEnquiry => e !== null)
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}

// ---- agent: packages ----

function ownPackage(agentId: string, id: string): PackageView {
  const pkg = db().packages.find((p) => p.id === id && p.agent.id === agentId && p.status !== "removed");
  if (!pkg) throw new Error("Package not found");
  return pkg;
}

export async function listAgentPackages(agentId: string): Promise<PackageView[]> {
  return db().packages.filter((p) => p.agent.id === agentId && p.status !== "removed");
}

export async function savePackage(agentId: string, id: string | undefined, input: PackageInput): Promise<PackageView> {
  const store = db();
  const agent = seedAgents.find((a) => a.id === agentId);
  if (!agent) throw new Error("Unknown agent");
  if (id) {
    const existing = ownPackage(agentId, id);
    if (existing.status === "inactive") throw new Error("Inactive packages are read-only");
    Object.assign(existing, input, { slug: uniqueSlug(input.title, id), updatedAt: now() });
    commit();
    return existing;
  }
  const created: PackageView = {
    ...input,
    id: newId("pkg"),
    slug: uniqueSlug(input.title),
    agent: { id: agent.id, displayName: agent.displayName, city: agent.city, registration: agent.registration },
    updatedAt: now(),
  };
  store.packages.unshift(created);
  commit();
  return created;
}

export async function duplicatePackage(agentId: string, id: string): Promise<PackageView> {
  const source = ownPackage(agentId, id);
  const copy = structuredClone(source);
  const title = `${source.title} (copy)`;
  const copyId = newId("pkg");
  const created: PackageView = { ...copy, id: copyId, title, slug: uniqueSlug(title), status: "draft", departures: [], updatedAt: now() };
  db().packages.unshift(created);
  commit();
  return created;
}

export async function setPackageStatus(agentId: string, id: string, status: Extract<PackageStatus, "draft" | "active" | "inactive">): Promise<PackageView> {
  const pkg = ownPackage(agentId, id);
  pkg.status = status;
  pkg.updatedAt = now();
  commit();
  return pkg;
}

// Soft delete: the package disappears from lists, leads keep their snapshot.
export async function removePackage(agentId: string, id: string): Promise<void> {
  ownPackage(agentId, id).status = "removed";
  commit();
}

// ---- agent: leads ----

export async function listLeads(agentId: string): Promise<LeadView[]> {
  return db()
    .leads.filter((l) => l.agentId === agentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function ownLead(agentId: string, id: string): LeadView {
  const lead = db().leads.find((l) => l.id === id && l.agentId === agentId);
  if (!lead) throw new Error("Lead not found");
  return lead;
}

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  "follow-up": "Follow-up",
  booked: "Booked",
  lost: "Lost",
};

export type LeadUpdate =
  | { kind: "status"; status: LeadStatus; followUpOn?: string; lostReason?: string }
  | { kind: "note"; text: string }
  | { kind: "follow-up"; followUpOn: string };

export async function updateLead(agent: SignedInAgent, id: string, update: LeadUpdate): Promise<LeadView> {
  const lead = ownLead(agent.id, id);
  const add = (kind: LeadActivity["kind"], text: string) => lead.activity.push({ id: newId("act"), at: now(), kind, text, by: agent.displayName });
  if (update.kind === "note") {
    add("note", update.text);
  } else if (update.kind === "follow-up") {
    lead.nextFollowUpAt = update.followUpOn;
    add("follow-up", `Follow-up set for ${formatDate(update.followUpOn)}`);
  } else {
    if (update.status === "follow-up" && !update.followUpOn) throw new Error("A follow-up date is required");
    if (update.status === "lost" && !update.lostReason) throw new Error("A reason is required");
    lead.status = update.status;
    lead.lostReason = update.status === "lost" ? update.lostReason : undefined;
    lead.nextFollowUpAt = update.status === "follow-up" ? update.followUpOn : undefined;
    add("status", `Status changed to ${leadStatusLabels[update.status]}${update.lostReason ? ` (${update.lostReason})` : ""}`);
  }
  commit();
  return lead;
}
