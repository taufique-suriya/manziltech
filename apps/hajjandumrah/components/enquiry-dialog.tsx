"use client";

import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { ContactPreference, PackageView } from "@/data/types";
import { buttonClasses } from "@manziltech/ui";
import { Field, inputClass, selectClass } from "@/components/fields";
import { Modal } from "@/components/modal";
import { createEnquiry } from "@/lib/api";
import { formatDate } from "@/lib/format";
import {
  countryCodes,
  limits,
  normalizeMobile,
  validateCity,
  validateConsent,
  validateEmail,
  validateInteger,
  validateMobile,
  validateName,
  validateText,
} from "@manziltech/validation";
import { openDepartures } from "@/lib/packages";

type Errors = Partial<Record<"name" | "mobile" | "adults" | "children" | "infants" | "email" | "city" | "message" | "consent" | "form", string>>;

const MAX_TRAVELLERS = 30;

// The enquiry form. Name, mobile, adults and consent are required (spec section 3.2).
export function EnquiryDialog({ pkg, today, onClose }: { pkg: PackageView; today: string; onClose: () => void }) {
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const departures = openDepartures(pkg, today);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();

    // Bots fill hidden fields; pretend it worked.
    if (text("website")) {
      setReference("HU-00000");
      return;
    }

    const cc = text("cc");
    const email = text("email");
    const next: Errors = {};
    const found: Errors = {
      name: validateName(text("name")) ?? undefined,
      mobile: validateMobile(text("mobile"), { countryCode: cc }) ?? undefined,
      adults: validateInteger(text("adults"), { label: "the number of adults", min: 1, max: MAX_TRAVELLERS }) ?? undefined,
      children: validateInteger(text("children"), { label: "the number of children", min: 0, max: MAX_TRAVELLERS, required: false }) ?? undefined,
      infants: validateInteger(text("infants"), { label: "the number of infants", min: 0, max: MAX_TRAVELLERS, required: false }) ?? undefined,
      email: validateEmail(email, { required: false }) ?? undefined,
      city: validateCity(text("city"), { required: false }) ?? undefined,
      message: validateText(text("message"), { label: "your message", required: false, max: 1000 }) ?? undefined,
      consent: validateConsent(form.get("consent") === "on") ?? undefined,
    };
    for (const [key, value] of Object.entries(found)) if (value) next[key as keyof Errors] = value;
    setErrors(next);
    const mobile = normalizeMobile(text("mobile"), cc);
    if (Object.keys(next).length > 0 || !mobile) return;
    const count = (value: string) => Number(value) || 0;
    const adults = count(text("adults"));

    setBusy(true);
    try {
      const result = await createEnquiry({
        packageId: pkg.id,
        name: text("name"),
        mobile,
        email: email || undefined,
        city: text("city") || undefined,
        adults,
        children: count(text("children")),
        infants: count(text("infants")),
        preferredDepartureId: text("departure") || undefined,
        message: text("message") || undefined,
        contactPreference: (text("contact") as ContactPreference) || "call",
      });
      setReference(result.reference);
    } catch {
      setErrors({ form: "Your enquiry could not be sent. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={reference ? "Enquiry sent" : "Send enquiry"}
      description={reference ? undefined : `${pkg.title} by ${pkg.agent.displayName}`}
    >
      {reference ? (
        <div className="grid gap-4">
          <p className="flex items-start gap-2 text-sm text-ink-soft">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
            {pkg.agent.displayName} will contact you about this package.
          </p>
          <div className="rounded-sm bg-mist p-4">
            <p className="text-xs text-ink-soft">Your reference</p>
            <p className="font-mono text-2xl font-medium tracking-wider">{reference}</p>
          </div>
          <p className="text-sm text-ink-soft">
            Keep this reference. Use &ldquo;My enquiries&rdquo; with your mobile number to check the status later.
          </p>
          <button type="button" onClick={onClose} className={buttonClasses("primary")}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" htmlFor="eq-name" required error={errors.name} className="sm:col-span-2">
              <input id="eq-name" name="name" autoComplete="name" maxLength={limits.name.max} className={inputClass} />
            </Field>
            <Field label="Mobile number" htmlFor="eq-mobile" required error={errors.mobile} hint="With or without country code, like +971 50 123 4567." className="sm:col-span-2">
              <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-2">
                <select name="cc" aria-label="Country code" defaultValue="+91" className={selectClass}>
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <input id="eq-mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={20} className={inputClass} />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-4 sm:col-span-2 sm:grid-cols-3">
              <Field label="Adults" htmlFor="eq-adults" required error={errors.adults} className="col-span-2 sm:col-span-1">
                <input id="eq-adults" name="adults" type="number" min={1} max={30} defaultValue={1} className={inputClass} />
              </Field>
              <Field label="Children" htmlFor="eq-children" error={errors.children}>
                <input id="eq-children" name="children" type="number" min={0} max={30} defaultValue={0} className={inputClass} />
              </Field>
              <Field label="Infants" htmlFor="eq-infants" error={errors.infants}>
                <input id="eq-infants" name="infants" type="number" min={0} max={30} defaultValue={0} className={inputClass} />
              </Field>
            </div>
            <Field label="Preferred departure" htmlFor="eq-departure">
              <select id="eq-departure" name="departure" defaultValue="" className={selectClass}>
                <option value="">Flexible</option>
                {departures.map((d) => (
                  <option key={d.id} value={d.id}>
                    {formatDate(d.departsOn)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Your city" htmlFor="eq-city" error={errors.city}>
              <input id="eq-city" name="city" autoComplete="address-level2" maxLength={limits.city} className={inputClass} />
            </Field>
            <Field label="Email" htmlFor="eq-email" error={errors.email} className="sm:col-span-2">
              <input id="eq-email" name="email" type="email" autoComplete="email" maxLength={limits.email} className={inputClass} />
            </Field>
            <fieldset className="grid gap-1.5 sm:col-span-2">
              <legend className="text-sm font-medium">How should the agent reach you?</legend>
              <div className="flex gap-5 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="contact" value="call" defaultChecked /> Call
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="contact" value="whatsapp" /> WhatsApp
                </label>
              </div>
            </fieldset>
            <Field label="Message" htmlFor="eq-message" error={errors.message} className="sm:col-span-2">
              <textarea id="eq-message" name="message" rows={3} maxLength={1000} className={inputClass} />
            </Field>
          </div>

          {/* Honeypot: hidden from people, filled by bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px]">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="grid gap-1.5">
            <label className="flex items-start gap-2 text-sm text-ink-soft">
              <input type="checkbox" name="consent" className="mt-1" />
              <span>
                I agree that ManzilTech and {pkg.agent.displayName} may use my name and mobile number (and the other details I enter) to contact me
                about this package. I can ask for my details to be deleted at any time.
              </span>
            </label>
            {errors.consent && (
              <p role="alert" className="text-xs font-medium text-danger">
                {errors.consent}
              </p>
            )}
          </div>

          {errors.form && (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors.form}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={onClose} className={buttonClasses("secondary")}>
              Cancel
            </button>
            <button type="submit" disabled={busy} className={buttonClasses("primary", "disabled:opacity-60")}>
              {busy ? "Sending..." : "Send enquiry"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
