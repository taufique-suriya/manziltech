"use client";

import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { buttonClasses } from "@manziltech/ui";
import type { HotelCity, Meals, PackageStatus, PackageView, SignedInAgent, TemplateKey } from "@/data/types";
import { templates } from "@/data/seed/templates";
import { Field, inputClass, selectClass } from "@/components/fields";
import { PackageRow } from "@/components/package-row";
import { limits } from "@manziltech/validation";
import { savePackage } from "@/lib/api";
import { cityLabels, mealLabels, sharingLabels, sharingOrder, todayIso } from "@/lib/format";
import {
  fromPackage,
  fromTemplate,
  newRowId,
  previewPackage,
  toInput,
  validate,
  type CustomFieldRow,
  type DepartureRow,
  type Errors,
  type FormState,
  type HotelRow,
} from "@/lib/package-form";

type PackageFormProps = {
  agent: SignedInAgent;
  existing?: PackageView;
  onDone: () => void;
};

function Section({ title, hint, error, children }: { title: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-4 rounded-lg border border-line p-4 sm:p-5">
      <legend className="px-2 font-mono text-xs font-medium uppercase tracking-[0.12em] text-accent-strong">{title}</legend>
      {hint && <p className="-mt-2 text-sm text-ink-soft">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

function YesNo({ name, value, onChange, label, error }: { name: string; value: boolean | null; onChange: (v: boolean) => void; label: string; error?: string }) {
  return (
    <fieldset className="grid gap-1.5">
      <legend className="text-sm font-medium">
        {label}
        <span className="text-danger"> *</span>
      </legend>
      <div className="flex gap-5 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="radio" name={name} checked={value === true} onChange={() => onChange(true)} /> Yes
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="radio" name={name} checked={value === false} onChange={() => onChange(false)} /> No
        </label>
      </div>
      {error && (
        <p role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

const iconButton = "rounded-sm border border-line p-2 text-ink-soft hover:border-accent hover:text-accent-strong";

export function PackageForm({ agent, existing, onDone }: PackageFormProps) {
  const [form, setForm] = useState<FormState | null>(existing ? fromPackage(existing) : null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [publishing, setPublishing] = useState(true);
  const [failure, setFailure] = useState<string | null>(null);
  const today = useMemo(() => todayIso(), []);

  // Step 1: choose a template.
  if (!form) {
    return (
      <div className="grid gap-5">
        <BackButton onClick={onDone} />
        <div className="grid gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">Create package</h2>
          <p className="text-sm text-ink-soft">Choose a template. It sets the type and fills in the usual inclusions; you can change everything.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setForm(fromTemplate(t.key as TemplateKey))}
              className="grid content-start gap-1 rounded-lg border border-line p-5 text-left transition-colors hover:border-accent"
            >
              <span className="text-lg font-semibold">{t.name}</span>
              <span className="text-sm text-ink-soft">{t.description}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // After a failed save, errors update as the agent fixes them.
  const set = (patch: Partial<FormState>) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (Object.keys(errors).length > 0) setErrors(validate(next, publishing));
  };
  const updateHotel = (i: number, patch: Partial<HotelRow>) => set({ hotels: form.hotels.map((h, idx) => (idx === i ? { ...h, ...patch } : h)) });
  const updateDeparture = (i: number, patch: Partial<DepartureRow>) => set({ departures: form.departures.map((d, idx) => (idx === i ? { ...d, ...patch } : d)) });
  const updateField = (i: number, patch: Partial<CustomFieldRow>) => set({ customFields: form.customFields.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });

  const isActive = existing?.status === "active";

  async function save(status: Extract<PackageStatus, "draft" | "active">) {
    if (!form) return;
    const found = validate(form, status === "active");
    setPublishing(status === "active");
    setErrors(found);
    setFailure(null);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    try {
      await savePackage(agent.id, existing?.id, toInput(form, status));
      onDone();
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "The package could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  const preview = previewPackage(form, { id: agent.id, displayName: agent.displayName, city: existing?.agent.city ?? "Your city" });

  return (
    <div className="grid gap-5">
      <BackButton onClick={onDone} />
      <div className="grid gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">{existing ? "Edit package" : "Create package"}</h2>
        <p className="text-sm text-ink-soft">
          Fields marked <span className="text-danger">*</span> are needed to publish. A draft only needs a title.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_28rem] xl:items-start">
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void save("active");
          }}
          className="grid gap-5"
        >
          <Section title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" htmlFor="pf-title" required error={errors.title} className="sm:col-span-2">
                <input id="pf-title" value={form.title} onChange={(e) => set({ title: e.target.value })} maxLength={limits.shortText} className={inputClass} placeholder="14-day Umrah, December" />
              </Field>
              <Field label="Type" htmlFor="pf-type" required>
                <select
                  id="pf-type"
                  value={form.type}
                  onChange={(e) => {
                    const type = e.target.value as FormState["type"];
                    set({ type, templateKey: type === "umrah" && form.templateKey === "umrah-ziyarat" ? form.templateKey : type });
                  }}
                  className={selectClass}
                >
                  <option value="umrah">Umrah</option>
                  <option value="hajj">Hajj</option>
                  <option value="ziyarat">Ziyarat</option>
                </select>
              </Field>
              <Field label="Departure city" htmlFor="pf-city" required error={errors.departureCity}>
                <input id="pf-city" value={form.departureCity} onChange={(e) => set({ departureCity: e.target.value })} maxLength={limits.city} className={inputClass} />
              </Field>
              {form.type === "ziyarat" && (
                <Field label="Destinations (one per line)" htmlFor="pf-dest" required error={errors.destinations} className="sm:col-span-2">
                  <textarea id="pf-dest" rows={3} value={form.destinations} onChange={(e) => set({ destinations: e.target.value })} className={inputClass} placeholder={"Najaf\nKarbala"} />
                </Field>
              )}
              <Field label="Summary" htmlFor="pf-summary" error={errors.summary} className="sm:col-span-2">
                <textarea id="pf-summary" rows={2} value={form.summary} onChange={(e) => set({ summary: e.target.value })} maxLength={300} className={inputClass} />
              </Field>
              {form.type === "hajj" && (
                <>
                  <Field label="Hajj year" htmlFor="pf-year" required error={errors.hajjYear}>
                    <input id="pf-year" inputMode="numeric" value={form.hajjYear} onChange={(e) => set({ hajjYear: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Stay pattern" htmlFor="pf-stay">
                    <select id="pf-stay" value={form.stayPattern} onChange={(e) => set({ stayPattern: e.target.value as FormState["stayPattern"] })} className={selectClass}>
                      <option value="">Not specified</option>
                      <option value="non-shifting">Non-shifting</option>
                      <option value="shifting">Shifting</option>
                    </select>
                  </Field>
                  <Field label="Mina camp" htmlFor="pf-mina" error={errors.minaCamp} className="sm:col-span-2">
                    <input id="pf-mina" maxLength={limits.shortText} value={form.minaCamp} onChange={(e) => set({ minaCamp: e.target.value })} className={inputClass} placeholder="Mina A category tents" />
                  </Field>
                </>
              )}
            </div>
          </Section>

          <Section title="Departures" error={errors.departures}>
            {form.departures.map((d, i) => (
              <div key={d.id} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <Field label="Departs" htmlFor={`pf-dep-${i}`} required>
                  <input id={`pf-dep-${i}`} type="date" min={today} value={d.departsOn} onChange={(e) => updateDeparture(i, { departsOn: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Returns" htmlFor={`pf-ret-${i}`} required>
                  <input id={`pf-ret-${i}`} type="date" min={d.departsOn || today} value={d.returnsOn} onChange={(e) => updateDeparture(i, { returnsOn: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Seats note" htmlFor={`pf-seat-${i}`}>
                  <input id={`pf-seat-${i}`} value={d.seatsNote} onChange={(e) => updateDeparture(i, { seatsNote: e.target.value })} className={inputClass} placeholder="Few seats left" />
                </Field>
                <button type="button" aria-label="Remove departure" onClick={() => set({ departures: form.departures.filter((_, idx) => idx !== i) })} className={iconButton}>
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set({ departures: [...form.departures, { id: newRowId(), departsOn: "", returnsOn: "", seatsNote: "", status: "open" }] })}
              className={buttonClasses("secondary", "w-fit py-2")}
            >
              <Plus className="size-4" /> Add departure
            </button>
          </Section>

          <Section title="Hotels" hint={form.type === "ziyarat" ? "Add the hotel for each place you stay. Distance is as stated by the agent, in metres." : "Distance is as stated by the agent, in metres."} error={errors.hotels}>
            {form.hotels.map((h, i) => (
              <div key={i} className="grid items-end gap-3 sm:grid-cols-[7rem_minmax(0,1fr)_5rem_6rem_5rem_auto]">
                {/* The grid below keeps one row per hotel; the place field joins it for other cities. */}
                <Field label="City" htmlFor={`pf-hc-${i}`} required>
                  <select id={`pf-hc-${i}`} value={h.city} onChange={(e) => updateHotel(i, { city: e.target.value as HotelCity })} className={selectClass}>
                    {(Object.keys(cityLabels) as HotelCity[]).map((c) => (
                      <option key={c} value={c}>
                        {cityLabels[c]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={h.city === "other" ? "Place and hotel" : "Hotel name"} htmlFor={`pf-hn-${i}`} required>
                  {h.city === "other" && (
                    <input
                      aria-label="Place"
                      value={h.place}
                      onChange={(e) => updateHotel(i, { place: e.target.value })}
                      className={`${inputClass} mb-1.5`}
                      placeholder="Karbala, Iraq"
                    />
                  )}
                  <input id={`pf-hn-${i}`} value={h.name} onChange={(e) => updateHotel(i, { name: e.target.value })} className={inputClass} placeholder={h.city === "other" ? "Hotel name" : undefined} />
                </Field>
                <Field label="Stars" htmlFor={`pf-hs-${i}`}>
                  <input id={`pf-hs-${i}`} type="number" min={1} max={5} value={h.stars} onChange={(e) => updateHotel(i, { stars: e.target.value })} className={inputClass} />
                </Field>
                <Field label={h.city === "other" ? "Distance to shrine (m)" : "Distance (m)"} htmlFor={`pf-hd-${i}`}>
                  <input id={`pf-hd-${i}`} type="number" min={0} value={h.distance} onChange={(e) => updateHotel(i, { distance: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Nights" htmlFor={`pf-hnn-${i}`} required>
                  <input id={`pf-hnn-${i}`} type="number" min={1} value={h.nights} onChange={(e) => updateHotel(i, { nights: e.target.value })} className={inputClass} />
                </Field>
                <button type="button" aria-label="Remove hotel" onClick={() => set({ hotels: form.hotels.filter((_, idx) => idx !== i) })} className={iconButton}>
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => set({ hotels: [...form.hotels, { city: form.type === "ziyarat" ? "other" : "makkah", place: "", name: "", stars: "", distance: "", nights: "" }] })} className={buttonClasses("secondary", "w-fit py-2")}>
              <Plus className="size-4" /> Add hotel
            </button>
          </Section>

          <Section title="Price per person (INR)" hint="Fill in the room sharing options you offer." error={errors.prices}>
            <div className="grid gap-4 sm:grid-cols-5">
              {sharingOrder.map((s) => (
                <Field key={s} label={sharingLabels[s]} htmlFor={`pf-price-${s}`}>
                  <input
                    id={`pf-price-${s}`}
                    type="number"
                    min={0}
                    value={form.prices[s]}
                    onChange={(e) => set({ prices: { ...form.prices, [s]: e.target.value } })}
                    className={inputClass}
                  />
                </Field>
              ))}
            </div>
          </Section>

          <Section title="Travel and inclusions">
            <div className="grid gap-4 sm:grid-cols-2">
              <YesNo name="flight" label="Flight included" value={form.flightIncluded} onChange={(v) => set({ flightIncluded: v })} error={errors.flight} />
              <YesNo name="visa" label="Visa included" value={form.visaIncluded} onChange={(v) => set({ visaIncluded: v })} error={errors.visa} />
              <Field label="Flight details" htmlFor="pf-flight" error={errors.flightNotes} className="sm:col-span-2">
                <input id="pf-flight" maxLength={limits.shortText} value={form.flightNotes} onChange={(e) => set({ flightNotes: e.target.value })} className={inputClass} placeholder="Airline, direct or via" />
              </Field>
              <Field label="Meals" htmlFor="pf-meals" required>
                <select id="pf-meals" value={form.meals} onChange={(e) => set({ meals: e.target.value as Meals })} className={selectClass}>
                  {(Object.keys(mealLabels) as Meals[]).map((m) => (
                    <option key={m} value={m}>
                      {mealLabels[m]}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex flex-wrap items-end gap-5 pb-2 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.transportIncluded} onChange={(e) => set({ transportIncluded: e.target.checked })} /> Transport
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.ziyaratIncluded} onChange={(e) => set({ ziyaratIncluded: e.target.checked })} /> Ziyarat
                </label>
              </div>
              <Field label="Transport details" htmlFor="pf-transport" error={errors.transportNotes} className="sm:col-span-2">
                <input id="pf-transport" maxLength={limits.shortText} value={form.transportNotes} onChange={(e) => set({ transportNotes: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Included (one per line)" htmlFor="pf-inc" error={errors.inclusions}>
                <textarea id="pf-inc" rows={5} maxLength={limits.longText} value={form.inclusions} onChange={(e) => set({ inclusions: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Not included (one per line)" htmlFor="pf-exc" error={errors.exclusions}>
                <textarea id="pf-exc" rows={5} maxLength={limits.longText} value={form.exclusions} onChange={(e) => set({ exclusions: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Itinerary (one line per day)" htmlFor="pf-itin" error={errors.itinerary} className="sm:col-span-2">
                <textarea id="pf-itin" rows={4} maxLength={limits.longText} value={form.itinerary} onChange={(e) => set({ itinerary: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Payment and cancellation terms" htmlFor="pf-terms" error={errors.terms} className="sm:col-span-2">
                <textarea id="pf-terms" rows={3} maxLength={limits.longText} value={form.terms} onChange={(e) => set({ terms: e.target.value })} className={inputClass} />
              </Field>
            </div>
          </Section>

          <Section title="Custom fields" hint="Add anything else customers should know. Primary fields show on the package row; secondary fields show under More details." error={errors.customFields}>
            {form.customFields.map((f, i) => (
              <div key={i} className="grid items-end gap-3 sm:grid-cols-[1fr_1.4fr_8rem_auto]">
                <Field label="Label" htmlFor={`pf-cl-${i}`}>
                  <input id={`pf-cl-${i}`} value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Value" htmlFor={`pf-cv-${i}`}>
                  <input id={`pf-cv-${i}`} value={f.value} onChange={(e) => updateField(i, { value: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Shown" htmlFor={`pf-cp-${i}`}>
                  <select id={`pf-cp-${i}`} value={f.placement} onChange={(e) => updateField(i, { placement: e.target.value as CustomFieldRow["placement"] })} className={selectClass}>
                    <option value="primary">On the row</option>
                    <option value="secondary">Under details</option>
                  </select>
                </Field>
                <button type="button" aria-label="Remove field" onClick={() => set({ customFields: form.customFields.filter((_, idx) => idx !== i) })} className={iconButton}>
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => set({ customFields: [...form.customFields, { label: "", value: "", placement: "secondary" }] })} className={buttonClasses("secondary", "w-fit py-2")}>
              <Plus className="size-4" /> Add field
            </button>
          </Section>

          {Object.keys(errors).length > 0 && (
            <p role="alert" className="text-sm font-medium text-danger">
              Some required fields need attention. They are marked above.
            </p>
          )}
          {failure && (
            <p role="alert" className="text-sm font-medium text-danger">
              {failure}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={onDone} className={buttonClasses("secondary")}>
              Cancel
            </button>
            {!isActive && (
              <button type="button" disabled={busy} onClick={() => void save("draft")} className={buttonClasses("secondary", "disabled:opacity-60")}>
                Save draft
              </button>
            )}
            <button type="submit" disabled={busy} className={buttonClasses("primary", "disabled:opacity-60")}>
              {isActive ? "Save changes" : "Publish"}
            </button>
          </div>
        </form>

        <aside aria-label="Preview" className="grid content-start gap-2 xl:sticky xl:top-24">
          <h3 className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-accent-strong">Preview</h3>
          <PackageRow pkg={preview} today={today} />
        </aside>
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex w-fit items-center gap-1 text-sm font-medium text-accent-strong underline-offset-4 hover:underline">
      <ArrowLeft className="size-4" aria-hidden="true" /> Back to my packages
    </button>
  );
}
