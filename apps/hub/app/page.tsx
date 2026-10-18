import Link from "next/link";
import { buttonClasses, Container, Eyebrow, Section } from "@manziltech/ui";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/site";

const steps = [
  { title: "Agents list", text: "Travel agents publish their packages with dates, hotels, inclusions and prices." },
  { title: "You compare and choose", text: "See packages side by side and pick the one that fits your plans and budget." },
  { title: "Your agent delivers", text: "The agent you chose takes care of the journey. ManzilTech runs the platform in between." },
];

const pillars = [
  { title: "Travel and technology together", text: "Our travel products and our software work share one team, one platform and one standard." },
  { title: "India first", text: "Built for travellers and businesses in India, with the rest of the world next." },
  { title: "Clear and calm", text: "Plain language, clear prices and no pressure. You should always know what happens next." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--mt-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--mt-line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        <div aria-hidden="true" className="absolute -top-40 right-0 size-[36rem] rounded-full bg-brand-tint blur-3xl" />
        <Container className="relative grid gap-6 py-20 sm:py-28">
          <p className="font-mono text-xs text-accent-strong">21.4225° N, 39.8262° E · 19.0760° N, 72.8777° E</p>
          <h1 className="max-w-[16ch] text-4xl font-bold tracking-tight sm:text-6xl">
            One destination for <span className="text-accent">travel</span> and{" "}
            <span className="text-accent">technology</span>.
          </h1>
          <p className="max-w-[56ch] text-lg text-ink-soft">
            ManzilTech brings together a Hajj and Umrah marketplace, travel and hotel bookings, and software development
            services. Built in India, for travellers and businesses everywhere.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className={buttonClasses("primary")}>
              Explore products
            </Link>
            <Link href="/about" className={buttonClasses("secondary")}>
              About ManzilTech
            </Link>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-10">
          <div className="grid max-w-2xl gap-3">
            <Eyebrow>Our products</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Three products, one ManzilTech</h2>
            <p className="text-ink-soft">Each product has its own site and its own focus, and all of them share the same platform.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="grid content-start gap-3">
            <Eyebrow>How the marketplace works</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight">From listing to journey</h2>
            <p className="text-ink-soft">Our Hajj and Umrah marketplace connects pilgrims with the agents who serve them.</p>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="grid content-start gap-2 border-t-2 border-accent pt-4">
                <span className="font-mono text-xs text-muted">Step {i + 1}</span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10">
          <div className="grid max-w-2xl gap-3">
            <Eyebrow>Why ManzilTech</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What we stand for</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="grid content-start gap-2">
                <h3 className="text-lg font-semibold">{pillar.title}</h3>
                <p className="text-ink-soft">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <section className="bg-brand-tint">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-14">
          <div className="grid gap-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Have a trip or a project in mind?</h2>
            <p className="text-ink-soft">Tell us what you need and we will point you to the right place.</p>
          </div>
          <Link href="/contact" className={buttonClasses("primary")}>
            Get in touch
          </Link>
        </Container>
      </section>
    </>
  );
}
