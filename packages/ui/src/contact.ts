// Contact details for the hub and each product, configured in one place and shown on every contact page.
//
// The values below are placeholders (the ones on the Bookings site today). Real numbers and addresses
// are set per environment through the NEXT_PUBLIC_CONTACT_* variables, so they are never committed to
// this public repository. Each variable is read by its full name so the build can inline it.

export type ContactProduct = "hub" | "hajjandumrah" | "bookings" | "studio";

export type Phone = { display: string; e164: string };

export type ProductContact = {
  name: string;
  emails: readonly string[];
  phone: Phone;
  whatsapp: Phone;
};

const placeholderPhone: Phone = { display: "1-800-555-0199", e164: "+18005550199" };
const placeholderEmails: readonly string[] = ["hello@manziltech.com", "support@manziltech.com"];

// '+919876543210' becomes '+91 98765 43210'; other countries show the code and the digits.
export function formatPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  return e164.startsWith("+") ? e164 : `+${digits}`;
}

function phone(value: string | undefined, fallback: Phone): Phone {
  const e164 = value?.replace(/[\s()-]/g, "");
  return e164 ? { display: formatPhone(e164), e164 } : fallback;
}

// A comma-separated list of addresses.
function emails(value: string | undefined, fallback: readonly string[]): readonly string[] {
  const list = value?.split(",").map((v) => v.trim()).filter(Boolean) ?? [];
  return list.length > 0 ? list : fallback;
}

export const contacts: Record<ContactProduct, ProductContact> = {
  hub: {
    name: "ManzilTech",
    // NEXT_PUBLIC_CONTACT_EMAIL is the older name for the hub address and still works.
    emails: emails(process.env.NEXT_PUBLIC_CONTACT_HUB_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL, placeholderEmails),
    phone: phone(process.env.NEXT_PUBLIC_CONTACT_HUB_PHONE, placeholderPhone),
    whatsapp: phone(process.env.NEXT_PUBLIC_CONTACT_HUB_WHATSAPP, placeholderPhone),
  },
  hajjandumrah: {
    name: "Hajj and Umrah",
    emails: emails(process.env.NEXT_PUBLIC_CONTACT_HAJJANDUMRAH_EMAIL, placeholderEmails),
    phone: phone(process.env.NEXT_PUBLIC_CONTACT_HAJJANDUMRAH_PHONE, placeholderPhone),
    whatsapp: phone(process.env.NEXT_PUBLIC_CONTACT_HAJJANDUMRAH_WHATSAPP, placeholderPhone),
  },
  bookings: {
    name: "Bookings",
    emails: emails(process.env.NEXT_PUBLIC_CONTACT_BOOKINGS_EMAIL, placeholderEmails),
    phone: phone(process.env.NEXT_PUBLIC_CONTACT_BOOKINGS_PHONE, placeholderPhone),
    whatsapp: phone(process.env.NEXT_PUBLIC_CONTACT_BOOKINGS_WHATSAPP, placeholderPhone),
  },
  studio: {
    name: "Studio",
    emails: emails(process.env.NEXT_PUBLIC_CONTACT_STUDIO_EMAIL, placeholderEmails),
    phone: phone(process.env.NEXT_PUBLIC_CONTACT_STUDIO_PHONE, placeholderPhone),
    whatsapp: phone(process.env.NEXT_PUBLIC_CONTACT_STUDIO_WHATSAPP, placeholderPhone),
  },
};

// One emergency number for the hub and every product.
export const emergency: Phone = phone(process.env.NEXT_PUBLIC_CONTACT_EMERGENCY_PHONE, placeholderPhone);

export const telHref = (p: Phone) => `tel:${p.e164}`;
export const whatsappHref = (p: Phone, text?: string) =>
  `https://wa.me/${p.e164.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
