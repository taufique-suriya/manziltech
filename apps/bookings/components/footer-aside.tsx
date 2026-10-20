"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { limits, validateEmail } from "@manziltech/validation";
import { address, emails, phone } from "@/data/template-claims";

// Footer contact details and newsletter box, as on the live site.
export function FooterAside() {
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  return (
    <>
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">Contact Info</h2>
        <ul className="grid gap-3 text-sm">
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{address.join(", ")}</span>
          </li>
          <li className="flex items-center gap-3">
            <Phone className="h-4 w-4 shrink-0 text-accent" />
            <a href={phone.href} className="transition-colors hover:text-white">
              {phone.display}
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="h-4 w-4 shrink-0 text-accent" />
            <a href={`mailto:${emails[0]}`} className="transition-colors hover:text-white">
              {emails[0]}
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">Newsletter</h2>
        <p className="mb-4 text-sm">Subscribe for travel deals and inspiration delivered to your inbox.</p>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const email = String(new FormData(e.currentTarget).get("email") ?? "");
            const problem = validateEmail(email);
            setNewsletterError(problem);
            setSubscribed(problem === null);
            if (problem === null) e.currentTarget.reset();
          }}
          className="flex gap-2"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="Your email"
            maxLength={limits.email}
            aria-invalid={newsletterError ? true : undefined}
            aria-describedby={newsletterError ? "newsletter-error" : undefined}
            className="min-w-0 flex-1 rounded-sm border border-night-line bg-night px-4 py-2.5 text-sm text-white placeholder:text-night-text/70 focus:border-accent focus:outline-none"
          />
          <button type="submit" aria-label="Subscribe" className="rounded-sm bg-accent p-2.5 transition-colors hover:bg-accent-strong">
            <Send className="h-4 w-4 text-white" />
          </button>
        </form>
        {newsletterError && (
          <p id="newsletter-error" role="alert" className="mt-2 text-xs font-medium text-danger">
            {newsletterError}
          </p>
        )}
        {subscribed && (
          <p role="status" className="mt-2 text-xs">
            Thanks for subscribing.
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-4 text-xs">
          {["Facebook", "Instagram", "Twitter", "YouTube"].map((name) => (
            <a key={name} href="#" className="transition-colors hover:text-white">
              {name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
