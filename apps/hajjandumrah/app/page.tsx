import { ArrowRight } from "lucide-react";
import { buttonClasses, Container, Eyebrow, Section } from "@manziltech/ui";
import { HeroSlides } from "@/components/hero-slides";
import { HomeSwitch } from "@/components/home-switch";
import { contactUrl } from "@/lib/site";

const steps = [
  { title: "Agents list", text: "Travel agents publish their packages with dates, hotels, inclusions and prices." },
  { title: "You compare and choose", text: "See packages side by side and pick the one that fits your plans and budget." },
  { title: "Your agent takes care of the journey", text: "Send an enquiry; the agent you chose confirms the details and looks after your trip." },
];

const heroSecondary =
  "inline-flex items-center justify-center gap-2 rounded-sm border border-white/50 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10";

function Hero() {
  return (
    <section className="relative flex min-h-[78svh] items-center overflow-hidden border-b border-line text-white">
      <HeroSlides />
      <Container className="relative z-10 grid gap-5 pb-20 pt-14 sm:pt-20">
        <p className="font-mono text-xs text-white/80">21.4225° N, 39.8262° E · Makkah</p>
        <h1 className="max-w-[18ch] text-4xl font-bold tracking-tight sm:text-6xl">
          Hajj and Umrah, <span className="text-hajjandumrah-warm">planned with care.</span>
        </h1>
        <p className="max-w-[60ch] text-lg text-white/85">
          Compare Hajj, Umrah and Ziyarat packages from travel agents side by side: dates, hotels, what is included and the price. Then enquire with the
          agent you choose.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#packages" className={buttonClasses("primary")}>
            Browse packages <ArrowRight className="size-4" />
          </a>
          <a href="#how" className={heroSecondary}>
            How it works
          </a>
        </div>
      </Container>
    </section>
  );
}

function Below() {
  return (
    <>
      <Section id="how" tone="mist">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="grid content-start gap-3">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight">From listing to journey</h2>
            <p className="text-ink-soft">One place to compare, a trusted agent to travel with.</p>
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

      <Section id="agents">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg border border-line bg-paper p-8">
          <div className="grid max-w-xl gap-2">
            <Eyebrow>For travel agents</Eyebrow>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">List your Hajj and Umrah packages</h2>
            <p className="text-ink-soft">
              ManzilTech adds each travel agent personally. Get in touch to list your packages and manage your enquiries in one place.
            </p>
          </div>
          <a href={contactUrl} className={buttonClasses("secondary")}>
            Talk to us about listing
          </a>
        </div>
      </Section>
    </>
  );
}

export default function HajjAndUmrahPage() {
  return <HomeSwitch hero={<Hero />} below={<Below />} />;
}
