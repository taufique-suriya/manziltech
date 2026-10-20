import type { Meals, PackageInput, TemplateKey } from "@/data/types";

// Package templates (spec section 7). Phase 1 keeps them in code; the API will serve them.
export type PackageTemplate = {
  key: TemplateKey;
  name: string;
  description: string;
  defaults: Pick<PackageInput, "type" | "ziyaratIncluded" | "inclusions" | "exclusions"> & { meals: Meals };
};

export const templates: readonly PackageTemplate[] = [
  {
    key: "hajj",
    name: "Hajj",
    description: "Hajj with Mina, Arafat and Muzdalifah arrangements.",
    defaults: {
      type: "hajj",
      ziyaratIncluded: true,
      meals: "full-board",
      inclusions: ["Return economy flights", "Hajj visa", "Mina and Arafat arrangements", "Hotels in Makkah and Madinah", "Hajj guide"],
      exclusions: ["Qurbani charges unless stated", "Personal expenses", "Excess baggage"],
    },
  },
  {
    key: "umrah",
    name: "Umrah",
    description: "Makkah and Madinah, usually 7 to 15 days.",
    defaults: {
      type: "umrah",
      ziyaratIncluded: false,
      meals: "breakfast",
      inclusions: ["Return economy flights", "Umrah visa and insurance", "Airport transfers", "Hotel stay with breakfast"],
      exclusions: ["Personal expenses", "Meals not mentioned", "Excess baggage"],
    },
  },
  {
    key: "umrah-ziyarat",
    name: "Umrah with Ziyarat",
    description: "Umrah plus guided visits in Makkah and Madinah.",
    defaults: {
      type: "umrah",
      ziyaratIncluded: true,
      meals: "half-board",
      inclusions: ["Return economy flights", "Umrah visa and insurance", "Airport transfers", "Guided ziyarat in both cities"],
      exclusions: ["Personal expenses", "Meals not mentioned", "Excess baggage"],
    },
  },
  {
    key: "ziyarat",
    name: "Ziyarat",
    description: "Tours to holy sites in other countries, such as Iraq or Jordan.",
    defaults: {
      type: "ziyarat",
      ziyaratIncluded: true,
      meals: "breakfast",
      inclusions: ["Return economy flights", "Visa", "Hotel stay with breakfast", "Local transport between cities", "Guide for the ziyarat"],
      exclusions: ["Personal expenses", "Meals not mentioned", "Excess baggage"],
    },
  },
];

export const lostReasons = ["Could not reach customer", "Not interested", "Price too high", "Chose another agent", "Duplicate", "Spam"] as const;
