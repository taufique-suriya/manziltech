// The tokens themselves live in theme.css (decision 0008). This module only
// names the product accents so TypeScript code can refer to them safely.
export const productAccents = ["brand", "hajjandumrah", "bookings", "studio"] as const;

export type ProductAccent = (typeof productAccents)[number];
