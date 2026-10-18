import type { Metadata } from "next";
import { Container, Eyebrow, Section } from "@manziltech/ui";
import { accentClasses, contactEmail, products } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-mist">
        <Container className="grid gap-4 py-16">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Get in touch</h1>
          <p className="max-w-[60ch] text-lg text-ink-soft">
            Questions about a trip, listing your packages as an agent, or a software project: we would like to hear from
            you.
          </p>
        </Container>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="grid content-start gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">Write to us</h2>
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="font-mono text-lg text-accent-strong hover:underline">
                {contactEmail}
              </a>
            ) : (
              <p className="text-ink-soft">Pick the product you need and reach the right team directly.</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {products.map((product) => (
              <a
                key={product.id}
                href={product.url}
                className={`grid content-start gap-2 rounded-lg border border-line p-5 transition-colors ${accentClasses[product.id].border}`}
              >
                <span className={`font-mono text-xs ${accentClasses[product.id].text}`}>{product.name}</span>
                <span className="text-sm text-ink-soft">{product.summary}</span>
              </a>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
