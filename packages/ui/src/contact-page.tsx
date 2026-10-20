import type { ReactNode } from "react";
import { contacts, emergency, telHref, whatsappHref, type ContactProduct } from "./contact";
import { ContactForm, type ContactTopic } from "./contact-form";
import { Container, Eyebrow, Section } from "./layout";

export type ContactProductLink = {
  name: string;
  summary: string;
  href: string;
  // Full class names (so Tailwind can find them): the product's own colour on its card.
  textClass: string;
  borderClass: string;
};

export type ContactPageProps = {
  product: ContactProduct;
  intro: string;
  // Hub: topics offered in the form (General plus each product).
  topics?: readonly ContactTopic[];
  // Hub: links to each product's own contact page.
  productLinks?: readonly ContactProductLink[];
};

const iconProps = { viewBox: "0 0 24 24", className: "size-6", "aria-hidden": true, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const MailIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const PhoneIcon = () => (
  <svg {...iconProps}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
const ChatIcon = () => (
  <svg {...iconProps}>
    <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Z" />
    <path d="M9 10c.5 2 2 3.5 4 4l1.2-1.2 2 .8" />
  </svg>
);

function InfoCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-3 rounded-lg border border-line bg-mist p-5">
      <span className="inline-flex size-11 items-center justify-center rounded-md bg-accent-tint text-accent-strong">{icon}</span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid gap-1 text-sm">{children}</div>
    </div>
  );
}

const linkClass = "w-fit font-medium text-accent-strong underline-offset-4 hover:underline";

// The contact page every product and the hub share. Colours come from the app's accent tokens.
export function ContactPage({ product, intro, topics, productLinks }: ContactPageProps) {
  const contact = contacts[product];
  return (
    <>
      <section className="border-b border-line bg-mist">
        <Container className="grid gap-4 py-14 sm:py-16">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Get in touch</h1>
          <p className="max-w-[60ch] text-lg text-ink-soft">{intro}</p>
        </Container>
      </section>

      <Section>
        <div className="grid gap-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard icon={<MailIcon />} title="Email">
              {contact.emails.map((email) => (
                <a key={email} href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              ))}
            </InfoCard>
            <InfoCard icon={<PhoneIcon />} title="Call us">
              <a href={telHref(contact.phone)} className={linkClass}>
                {contact.phone.display}
              </a>
            </InfoCard>
            <InfoCard icon={<ChatIcon />} title="WhatsApp">
              <a href={whatsappHref(contact.whatsapp)} target="_blank" rel="noreferrer" className={linkClass}>
                {contact.whatsapp.display}
              </a>
              <span className="text-ink-soft">Message us on WhatsApp</span>
            </InfoCard>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
            <div className="grid gap-5 rounded-lg border border-line bg-mist p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight">Send us a message</h2>
              <ContactForm topics={topics} />
            </div>

            <div className="grid gap-5">
              <div className="grid gap-2 rounded-lg bg-night p-6 text-white">
                <h2 className="text-lg font-semibold">Emergency</h2>
                <p className="text-sm text-night-text">Already travelling and need urgent help? Call this number.</p>
                <a href={telHref(emergency)} className="mt-1 w-fit font-mono text-xl font-medium text-white underline-offset-4 hover:underline">
                  {emergency.display}
                </a>
              </div>

              {productLinks && productLinks.length > 0 && (
                <div className="grid gap-3">
                  <h2 className="text-lg font-semibold">Or contact a product directly</h2>
                  {productLinks.map((link) => (
                    <a key={link.name} href={link.href} className={`grid gap-1 rounded-lg border border-line p-4 transition-colors ${link.borderClass}`}>
                      <span className={`font-mono text-xs ${link.textClass}`}>{link.name}</span>
                      <span className="text-sm text-ink-soft">{link.summary}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
