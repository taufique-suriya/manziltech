import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses, Container, Eyebrow, Section } from "@manziltech/ui";

export const metadata: Metadata = { title: "About" };

const arms = [
  {
    title: "Travel",
    text: "A Hajj and Umrah marketplace where agents list and pilgrims choose, and a booking site for hotels and travel.",
  },
  {
    title: "Technology",
    text: "Studio builds websites, web apps and custom software for businesses, on the same platform that runs our travel products.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-mist">
        <Container className="grid gap-4 py-16">
          <Eyebrow>About</Eyebrow>
          <h1 className="max-w-[20ch] text-4xl font-bold tracking-tight sm:text-5xl">Manzil means destination</h1>
          <p className="max-w-[60ch] text-lg text-ink-soft">
            ManzilTech is a group brand for travel and technology. We build products that help people reach where they
            are going, whether that is a pilgrimage, a holiday or a new piece of software.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="grid content-start gap-3">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight">Two sides, treated as equals</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {arms.map((arm) => (
              <div key={arm.title} className="grid content-start gap-2 rounded-lg border border-line p-6">
                <h3 className="text-xl font-semibold">{arm.title}</h3>
                <p className="text-ink-soft">{arm.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="grid content-start gap-3">
            <Eyebrow>Where we are going</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight">India first, then the world</h2>
          </div>
          <div className="grid gap-4 text-ink-soft">
            <p>
              We start with travellers and businesses in India and grow from there. Our products share one platform for
              accounts, agents, checkout and payments, so each new product starts on solid ground.
            </p>
            <div>
              <Link href="/contact" className={buttonClasses("primary")}>
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
