import type { AgentSummary } from "@/data/types";

// Seed agents. Agents are added by ManzilTech, never self-registered (spec section 2).
// Seed sign-ins stand in for the real sign-in (spec DEF-01) and are replaced by it.
export type SeedAgent = AgentSummary & { email: string; password: string };

export const seedAgents: readonly SeedAgent[] = [
  {
    id: "agt-noor",
    displayName: "Noor Al Haram Travels",
    city: "Mumbai",
    registration: "Sample registration NH-1001",
    email: "noor@example.com",
    password: "noor-seed-2026",
  },
  {
    id: "agt-safar",
    displayName: "Safar e Madina Tours",
    city: "Hyderabad",
    registration: "Sample registration SM-2002",
    email: "safar@example.com",
    password: "safar-seed-2026",
  },
  {
    id: "agt-baraka",
    displayName: "Baraka Journeys",
    city: "Delhi",
    registration: "Sample registration BJ-3003",
    email: "baraka@example.com",
    password: "baraka-seed-2026",
  },
];
