// Central validation rules and messages for every form in every app.
//
// Each validator takes the raw text from an input and returns an error message, or null when the value
// is fine. Pass { required: false } for optional fields: an empty value is then accepted. Messages live
// in one place (the 'messages' object) so wording stays the same everywhere.
// The API will apply the same rules again on the server; keep both in step.

export type Check = string | null;
type Options = { required?: boolean };

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// ---- limits (also used for maxLength on inputs) ----

export const limits = {
  email: 254,
  name: { min: 2, max: 80 },
  city: 60,
  password: { min: 8, max: 64 },
  shortText: 120,
  longText: 2000,
  note: 500,
  message: { min: 10, max: 2000 },
  search: 80,
  mobileInternationalDigits: { min: 8, max: 15 },
} as const;

// ---- messages ----

export const messages = {
  required: (what: string) => `Enter ${what}.`,
  choose: (what: string) => `Choose ${what}.`,
  tooShort: (what: string, min: number) => `${cap(what)} must be at least ${min} characters.`,
  tooLong: (what: string, max: number) => `${cap(what)} must be ${max} characters or fewer.`,
  badCharacters: (what: string) => `${cap(what)} has characters we can't accept.`,
  email: {
    required: "Enter your email address.",
    invalid: "Enter a valid email address, like name@example.com.",
    tooLong: "That email address is too long.",
  },
  mobile: {
    required: "Enter your mobile number.",
    badCharacters: "A mobile number can only have digits, spaces, hyphens and a + at the start.",
    india: "Enter a 10-digit mobile number starting with 6, 7, 8 or 9.",
    international: "Enter the full number with country code, like +971 50 123 4567.",
    other: "Enter a valid mobile number, 7 to 12 digits.",
  },
  password: {
    required: "Enter your password.",
    spaces: "Password cannot contain spaces.",
    badCharacters: "Password can only use letters, numbers and these symbols: ! @ # $ % ^ & * ( ) _ + - = . , ?",
    tooShort: "Password must be at least 8 characters.",
    tooLong: "Password must be 64 characters or fewer.",
  },
  name: {
    required: "Enter your name.",
    tooShort: "Enter your full name, at least 2 letters.",
    invalid: "Use only letters, spaces, apostrophes, hyphens and full stops in a name.",
    tooLong: "That name is too long.",
  },
  city: {
    required: "Enter the city.",
    invalid: "Use only letters, spaces, apostrophes, hyphens and full stops in a city name.",
  },
  integer: {
    required: (what: string) => `Enter ${what}.`,
    notWhole: (what: string) => `${cap(what)} must be a whole number.`,
    range: (what: string, min: number, max: number) => `${cap(what)} must be between ${min} and ${max}.`,
  },
  amount: {
    required: (what: string) => `Enter ${what}.`,
    invalid: (what: string) => `${cap(what)} must be a whole number greater than 0.`,
    tooHigh: (what: string, max: number) => `${cap(what)} must be ${max.toLocaleString("en-IN")} or less.`,
  },
  date: {
    required: (what: string) => `Choose ${what}.`,
    invalid: (what: string) => `Choose a valid date for ${what}.`,
    notBefore: (what: string, limit: string) => `${cap(what)} can't be before ${limit}.`,
    order: (later: string, earlier: string) => `${cap(later)} must be after ${earlier}.`,
  },
  reference: "Enter a reference like HU-7K3Q9.",
  consent: "Tick this box to continue.",
} as const;

// Shown under password fields where a password is chosen.
export const passwordHint = "At least 8 characters, no spaces. Letters, numbers and ! @ # $ % ^ & * ( ) _ + - = . , ? only.";

// ---- helpers ----

const isEmpty = (value: string) => value.trim() === "";

// Control characters other than tab and line breaks never belong in typed text.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

// ---- email ----

const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function validateEmail(value: string, { required = true }: Options = {}): Check {
  const email = value.trim();
  if (email === "") return required ? messages.email.required : null;
  if (email.length > limits.email) return messages.email.tooLong;
  const [local = "", domain = ""] = email.split("@");
  const tld = domain.split(".").pop() ?? "";
  if (!EMAIL.test(email) || local.length > 64 || local.startsWith(".") || local.endsWith(".") || email.includes("..") || !/^[A-Za-z]{2,}$/.test(tld)) {
    return messages.email.invalid;
  }
  return null;
}

// ---- mobile numbers ----

export const countryCodes = [
  { code: "+91", label: "India +91" },
  { code: "+971", label: "UAE +971" },
  { code: "+966", label: "Saudi Arabia +966" },
  { code: "+44", label: "UK +44" },
  { code: "+1", label: "USA / Canada +1" },
] as const;

export const defaultCountryCode = "+91";

type MobileOptions = Options & { countryCode?: string };
type MobileResult = { e164: string } | { error: string };

// Accepts the number with or without a country code. A number starting with '+' or '00' is read as
// international and the country code you pass is ignored; otherwise the number belongs to that country.
function parseMobile(input: string, countryCode: string): MobileResult {
  const raw = input.trim();
  if (raw === "") return { error: messages.mobile.required };
  const compact = raw.replace(/[\s().-]/g, "");
  if (!/^\+?\d+$/.test(compact)) return { error: messages.mobile.badCharacters };

  const international = compact.startsWith("+") || compact.startsWith("00");
  if (international) {
    const digits = compact.replace(/^(\+|00)/, "");
    const { min, max } = limits.mobileInternationalDigits;
    if (digits.length < min || digits.length > max || digits.startsWith("0")) return { error: messages.mobile.international };
    if (digits.startsWith("91")) {
      return /^[6-9]\d{9}$/.test(digits.slice(2)) ? { e164: `+${digits}` } : { error: messages.mobile.india };
    }
    return { e164: `+${digits}` };
  }

  const countryDigits = countryCode.replace("+", "");
  let national = compact.replace(/^0+/, "");
  if (countryCode === defaultCountryCode) {
    // '919876543210' (country code typed without the +) is accepted for India.
    if (national.length === 12 && national.startsWith(countryDigits)) national = national.slice(countryDigits.length);
    return /^[6-9]\d{9}$/.test(national) ? { e164: `${countryCode}${national}` } : { error: messages.mobile.india };
  }
  return national.length >= 7 && national.length <= 12 ? { e164: `${countryCode}${national}` } : { error: messages.mobile.other };
}

// '+919876543210', or null when the number is not valid.
export function normalizeMobile(input: string, countryCode: string = defaultCountryCode): string | null {
  const result = parseMobile(input, countryCode);
  return "e164" in result ? result.e164 : null;
}

export function validateMobile(input: string, { required = true, countryCode = defaultCountryCode }: MobileOptions = {}): Check {
  if (isEmpty(input)) return required ? messages.mobile.required : null;
  const result = parseMobile(input, countryCode);
  return "error" in result ? result.error : null;
}

// ---- password ----

// Letters, digits and this short list only. Spaces and symbols that are risky in code, URLs or markup
// (quotes, angle brackets, backslash, slash, backtick, pipe, braces, semicolon, colon) are refused.
const PASSWORD_ALLOWED = /^[A-Za-z0-9!@#$%^&*()_+\-=.,?]+$/;

// Passwords are never trimmed or changed: what was typed is what is checked.
export function validatePassword(value: string, { required = true }: Options = {}): Check {
  if (value === "") return required ? messages.password.required : null;
  if (/\s/.test(value)) return messages.password.spaces;
  if (!PASSWORD_ALLOWED.test(value)) return messages.password.badCharacters;
  if (value.length < limits.password.min) return messages.password.tooShort;
  if (value.length > limits.password.max) return messages.password.tooLong;
  return null;
}

// ---- names and places ----

const NAME = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

export function validateName(value: string, { required = true }: Options = {}): Check {
  const name = value.trim();
  if (name === "") return required ? messages.name.required : null;
  if (name.length < limits.name.min) return messages.name.tooShort;
  if (name.length > limits.name.max) return messages.name.tooLong;
  return NAME.test(name) ? null : messages.name.invalid;
}

export function validateCity(value: string, { required = true }: Options = {}): Check {
  const city = value.trim();
  if (city === "") return required ? messages.city.required : null;
  if (city.length > limits.city) return messages.tooLong("the city", limits.city);
  return NAME.test(city) ? null : messages.city.invalid;
}

// ---- free text ----

type TextOptions = Options & { label: string; min?: number; max?: number };

// 'label' reads inside a sentence: 'the title', 'your message'.
export function validateText(value: string, { label, required = true, min, max = limits.longText }: TextOptions): Check {
  const text = value.trim();
  if (text === "") return required ? messages.required(label) : null;
  if (CONTROL.test(text)) return messages.badCharacters(label);
  if (min !== undefined && text.length < min) return messages.tooShort(label, min);
  if (text.length > max) return messages.tooLong(label, max);
  return null;
}

export const validateShortText = (value: string, label: string, options: Options & { max?: number } = {}): Check =>
  validateText(value, { label, max: limits.shortText, ...options });

export const validateMessage = (value: string, options: Options = {}): Check =>
  validateText(value, { label: "your message", min: limits.message.min, max: limits.message.max, ...options });

// ---- numbers ----

type IntegerOptions = Options & { label: string; min: number; max: number };

export function validateInteger(value: string | number, { label, min, max, required = true }: IntegerOptions): Check {
  const text = String(value).trim();
  if (text === "") return required ? messages.integer.required(label) : null;
  if (!/^-?\d+$/.test(text)) return messages.integer.notWhole(label);
  const n = Number(text);
  return n < min || n > max ? messages.integer.range(label, min, max) : null;
}

type AmountOptions = Options & { label: string; max?: number };

// A price in whole rupees: more than 0, no decimals.
export function validateAmount(value: string | number, { label, max = 10_000_000, required = true }: AmountOptions): Check {
  const text = String(value).trim();
  if (text === "") return required ? messages.amount.required(label) : null;
  if (!/^\d+$/.test(text) || Number(text) < 1) return messages.amount.invalid(label);
  return Number(text) > max ? messages.amount.tooHigh(label, max) : null;
}

// ---- dates (yyyy-mm-dd, as date inputs give them) ----

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

function parseDate(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const time = Date.parse(`${value}T00:00:00Z`);
  // Reject 2026-02-31 and similar: the parsed date must read back the same.
  return Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== value ? null : time;
}

type DateOptions = Options & { label: string; notBefore?: string };

export function validateDate(value: string, { label, required = true, notBefore }: DateOptions): Check {
  if (value.trim() === "") return required ? messages.date.required(label) : null;
  const time = parseDate(value);
  if (time === null) return messages.date.invalid(label);
  const limit = notBefore === undefined ? null : parseDate(notBefore);
  if (limit !== null && time < limit) return messages.date.notBefore(label, dateFormat.format(limit));
  return null;
}

// 'later' must be after 'earlier' (a return date after the departure date).
export function validateDateOrder(earlier: string, later: string, laterLabel: string, earlierLabel: string): Check {
  const a = parseDate(earlier);
  const b = parseDate(later);
  return a !== null && b !== null && b <= a ? messages.date.order(laterLabel, earlierLabel) : null;
}

// ---- other ----

export function validateReference(value: string, { required = true }: Options = {}): Check {
  const ref = value.trim();
  if (ref === "") return required ? messages.reference : null;
  return /^HU-[A-Z0-9]{5}$/i.test(ref) ? null : messages.reference;
}

export function validateConsent(checked: boolean): Check {
  return checked ? null : messages.consent;
}

// Runs checks in order and returns the first error.
export function firstError(...checks: Check[]): Check {
  return checks.find((c) => c !== null) ?? null;
}
