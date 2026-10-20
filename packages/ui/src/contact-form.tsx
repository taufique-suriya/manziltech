"use client";

import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { limits, validateEmail, validateMessage, validateMobile, validateName } from "@manziltech/validation";
import { buttonClasses } from "./button";

export type ContactTopic = { value: string; label: string };

type ContactFormProps = {
  // The hub lets people choose a product or 'General'; product sites send no topic.
  topics?: readonly ContactTopic[];
};

type Values = { name: string; email: string; phone: string; topic: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const fieldClass =
  "w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";

function check(name: keyof Values, value: string): string | undefined {
  switch (name) {
    case "name":
      return validateName(value) ?? undefined;
    case "email":
      return validateEmail(value) ?? undefined;
    case "phone":
      return validateMobile(value, { required: false }) ?? undefined;
    case "message":
      return validateMessage(value) ?? undefined;
    default:
      return undefined;
  }
}

function Field({ id, label, required, error, hint, children }: { id: string; label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-danger"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

// Like the Bookings form today: there is no backend yet, so this shows a confirmation without sending.
export function ContactForm({ topics }: ContactFormProps) {
  const empty: Values = { name: "", email: "", phone: "", topic: topics?.[0]?.value ?? "", message: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const change = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = event.target.name as keyof Values;
    setForm({ ...form, [name]: event.target.value });
    // Once a field shows an error, it updates as the visitor fixes it.
    if (errors[name]) setErrors({ ...errors, [name]: check(name, event.target.value) });
  };

  const blur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = event.target.name as keyof Values;
    setErrors({ ...errors, [name]: check(name, event.target.value) });
  };

  function submit(event: FormEvent) {
    event.preventDefault();
    const found: Errors = {};
    for (const name of ["name", "email", "phone", "message"] as const) {
      const error = check(name, form[name]);
      if (error) found[name] = error;
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm(empty);
    }, 4000);
  }

  if (submitted) {
    return (
      <div role="status" className="grid place-items-center gap-2 py-14 text-center">
        <h3 className="text-xl font-semibold">Message sent</h3>
        <p className="text-ink-soft">Thank you for reaching out. We will be in touch soon.</p>
      </div>
    );
  }

  const aria = (name: keyof Values) => ({ "aria-invalid": errors[name] ? true : undefined, "aria-describedby": errors[name] ? `cf-${name}-error` : undefined });

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      {topics && topics.length > 0 && (
        <Field id="cf-topic" label="What is this about?" required>
          <select id="cf-topic" name="topic" value={form.topic} onChange={change} className={fieldClass}>
            {topics.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="cf-name" label="Your name" required error={errors.name}>
          <input id="cf-name" name="name" value={form.name} onChange={change} onBlur={blur} autoComplete="name" maxLength={limits.name.max} className={fieldClass} {...aria("name")} />
        </Field>
        <Field id="cf-email" label="Email" required error={errors.email}>
          <input id="cf-email" name="email" type="email" value={form.email} onChange={change} onBlur={blur} autoComplete="email" maxLength={limits.email} className={fieldClass} {...aria("email")} />
        </Field>
      </div>
      <Field id="cf-phone" label="Mobile number" error={errors.phone} hint="With or without country code. A number without one is read as Indian (+91).">
        <input id="cf-phone" name="phone" type="tel" value={form.phone} onChange={change} onBlur={blur} autoComplete="tel" maxLength={20} className={fieldClass} {...aria("phone")} />
      </Field>
      <Field id="cf-message" label="Message" required error={errors.message}>
        <textarea id="cf-message" name="message" value={form.message} onChange={change} onBlur={blur} rows={5} maxLength={limits.message.max} className={fieldClass} {...aria("message")} />
      </Field>
      <button type="submit" className={buttonClasses("primary", "w-full sm:w-fit")}>
        Send message
      </button>
    </form>
  );
}
