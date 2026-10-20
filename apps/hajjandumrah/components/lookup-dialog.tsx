"use client";

import { useState, type FormEvent } from "react";
import type { CustomerEnquiry, CustomerStatus } from "@/data/types";
import { buttonClasses } from "@manziltech/ui";
import { Badge, Field, inputClass, selectClass } from "@/components/fields";
import { Modal } from "@/components/modal";
import { lookupEnquiries } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { countryCodes, normalizeMobile, validateMobile, validateReference } from "@manziltech/validation";

const statusLabels: Record<CustomerStatus, string> = {
  received: "Received",
  "in-progress": "In progress",
  booked: "Booked",
  closed: "Closed",
};

// 'My enquiries': mobile + reference shows full details; mobile alone shows a limited list (spec Q-03).
export function LookupDialog({ onClose }: { onClose: () => void }) {
  const [errors, setErrors] = useState<{ mobile?: string; reference?: string }>({});
  const [results, setResults] = useState<{ items: CustomerEnquiry[]; full: boolean } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const cc = String(form.get("cc"));
    const mobileText = String(form.get("mobile") ?? "");
    const reference = String(form.get("reference") ?? "").trim();
    const found = {
      mobile: validateMobile(mobileText, { countryCode: cc }) ?? undefined,
      reference: validateReference(reference, { required: false }) ?? undefined,
    };
    setErrors(found);
    const mobile = normalizeMobile(mobileText, cc);
    if (found.mobile || found.reference || !mobile) return;
    const items = await lookupEnquiries(mobile, reference || undefined);
    setResults({ items, full: Boolean(reference) });
  }

  return (
    <Modal open onClose={onClose} title="My enquiries" description="Check the status of an enquiry you sent.">
      <form onSubmit={submit} noValidate className="grid gap-4">
        <Field label="Mobile number" htmlFor="lk-mobile" required error={errors.mobile} hint="The number you used for your enquiry.">
          <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-2">
            <select name="cc" aria-label="Country code" defaultValue="+91" className={selectClass}>
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <input id="lk-mobile" name="mobile" type="tel" inputMode="tel" maxLength={20} className={inputClass} />
          </div>
        </Field>
        <Field label="Enquiry reference" htmlFor="lk-ref" error={errors.reference} hint="Forgot it? Leave this empty to see a short summary of your enquiries.">
          <input id="lk-ref" name="reference" placeholder="HU-7K3Q9" maxLength={8} className={`${inputClass} font-mono`} />
        </Field>
        <button type="submit" className={buttonClasses("primary")}>
          Find my enquiries
        </button>
      </form>

      {results && (
        <div className="grid gap-3" aria-live="polite">
          {results.items.length === 0 ? (
            <p className="text-sm text-ink-soft">No enquiries found for these details.</p>
          ) : (
            <ul className="grid gap-3">
              {results.items.map((item, i) => (
                <li key={item.reference || i} className="grid gap-1.5 rounded-sm border border-line p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{item.packageTitle}</span>
                    <Badge tone={item.status === "booked" ? "accent" : "muted"}>{statusLabels[item.status]}</Badge>
                  </div>
                  <p className="text-ink-soft">Sent {formatDate(item.sentAt)}</p>
                  {item.details && (
                    <dl className="grid gap-0.5 text-ink-soft">
                      <div>Reference: <span className="font-mono text-ink">{item.reference}</span></div>
                      <div>Name: {item.details.name}</div>
                      <div>Travellers: {item.details.travellers}</div>
                      {item.details.preferredDeparture && <div>Preferred departure: {item.details.preferredDeparture}</div>}
                      {item.details.message && <div>Message: {item.details.message}</div>}
                    </dl>
                  )}
                </li>
              ))}
            </ul>
          )}
          {!results.full && results.items.length > 0 && (
            <p className="text-xs text-muted">Enter the enquiry reference to see the full details of one enquiry.</p>
          )}
        </div>
      )}
    </Modal>
  );
}
