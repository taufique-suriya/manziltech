// Display helpers for mobile numbers. Validation and normalising live in @manziltech/validation.

// '+91 98xxxxx210' style: shown in lists, the full number only on the lead itself.
export function maskMobile(e164: string): string {
  if (e164.length < 8) return e164;
  return `${e164.slice(0, 5)}${"x".repeat(e164.length - 8)}${e164.slice(-3)}`;
}

export function whatsappLink(e164: string): string {
  return `https://wa.me/${e164.replace("+", "")}`;
}
