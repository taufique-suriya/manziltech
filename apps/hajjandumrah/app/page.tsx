import {
  ArrowRight,
  BedDouble,
  Building2,
  Bus,
  CalendarDays,
  FileCheck2,
  MapPin,
  Plane,
  Utensils,
} from "lucide-react";
import { buttonClasses, Container, Eyebrow, Section } from "@manziltech/ui";
import { contactUrl } from "@/lib/site";

const journeys = [
  {
    id: "hajj",
    title: "Hajj",
    when: "Once a year, in Dhul Hijjah",
    text: "The pilgrimage every able Muslim aims to make once in a lifetime. Packages cover the days in Mina, Arafat and Muzdalifah as well as your stay in Makkah and Madinah.",
  },
  {
    id: "umrah",
    title: "Umrah",
    when: "Any time of the year",
    text: "The lesser pilgrimage, performed throughout the year. Packages range from short trips to longer stays that include Madinah and ziyarat.",
  },
];

const compare = [
  { icon: CalendarDays, title: "Dates and duration", text: "Departure dates and nights in Makkah and Madinah." },
  { icon: MapPin, title: "Distance to the Haram", text: "How far each hotel is from Masjid al-Haram and Masjid an-Nabawi." },
  { icon: Building2, title: "Hotels", text: "Hotel names and star ratings in both cities." },
  { icon: BedDouble, title: "Room sharing", text: "Prices per person for double, triple and quad rooms." },
  { icon: Plane, title: "Flights", text: "Departure city, airline and whether flights are included." },
  { icon: FileCheck2, title: "Visa", text: "Whether the visa is arranged as part of the package." },
  { icon: Utensils, title: "Meals", text: "Which meals are included during the stay." },
  { icon: Bus, title: "Transport and ziyarat", text: "Airport transfers, travel between cities and guided visits." },
];

const steps = [
  { title: "Agents list", text: "Travel agents publish their packages with dates, hotels, inclusions and prices." },
  { title: "You compare and choose", text: "See packages side by side and pick the one that fits your plans and budget." },
  { title: "Your agent takes care of the journey", text: "Send an enquiry; the agent you chose confirms the details and looks after your trip." },
];

export default function HajjAndUmrahPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,var(--mt-hajjandumrah-tint),transparent_55%),radial-gradient(circle_at_10%_90%,color-mix(in_srgb,var(--mt-hajjandumrah-warm)_18%,transparent),transparent_50%)]"
        />
        <Container className="relative grid gap-6 py-20 sm:py-28">
          <p className="font-mono text-xs text-accent-strong">21.4225° N, 39.8262° E · Makkah</p>
          <h1 className="max-w-[18ch] text-4xl font-bold tracking-tight sm:text-6xl">
            Hajj and Umrah, <span className="text-accent">planned with care.</span>
          </h1>
          <p className="max-w-[60ch] text-lg text-ink-soft">
            Compare packages from travel agents side by side: dates, hotels, distance to the Haram, what is included and
            the price. Then enquire with the agent you choose.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#contact" className={buttonClasses("primary")}>
              Enquire now <ArrowRight className="size-4" />
            </a>
            <a href="#how" className={buttonClasses("secondary")}>
              How it works
            </a>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {journeys.map((journey) => (
            <article id={journey.id} key={journey.id} className="grid content-start gap-3 rounded-lg border border-line p-7">
              <span className="w-fit rounded-sm bg-hajjandumrah-tint px-2.5 py-1 font-mono text-xs text-accent-strong">
                {journey.when}
              </span>
              <h2 className="text-3xl font-semibold tracking-tight">{journey.title}</h2>
              <p className="text-ink-soft">{journey.text}</p>
              <a href="#contact" className="w-fit text-sm font-semibold text-accent-strong underline-offset-4 hover:underline">
                Enquire about {journey.title} packages →
              </a>
            </article>
          ))}
        </div>
      </Section>

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

      <Section>
        <div className="grid gap-10">
          <div className="grid max-w-2xl gap-3">
            <Eyebrow>What you can compare</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything that matters, side by side</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {compare.map((item) => (
              <div key={item.title} className="grid content-start gap-2">
                <item.icon className="size-6 text-hajjandumrah-warm" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-ink-soft">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="agents" tone="mist">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg border border-line bg-paper p-8">
          <div className="grid max-w-xl gap-2">
            <Eyebrow>For travel agents</Eyebrow>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">List your Hajj and Umrah packages</h2>
            <p className="text-ink-soft">
              Reach pilgrims who are comparing their options, and manage your packages and enquiries in one place.
            </p>
          </div>
          <a href={contactUrl} className={buttonClasses("secondary")}>
            Talk to us about listing
          </a>
        </div>
      </Section>

      <section id="contact" className="bg-accent text-white">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-14">
          <div className="grid max-w-xl gap-2">
            <h2 className="text-3xl font-semibold tracking-tight">Planning your Hajj or Umrah?</h2>
            <p className="text-white/85">Tell us when you want to travel and who is coming, and we will connect you with the right agent.</p>
          </div>
          <a href={contactUrl} className={buttonClasses("secondary", "border-white bg-white text-accent-strong hover:text-accent-strong")}>
            Enquire now <ArrowRight className="size-4" />
          </a>
        </Container>
      </section>
    </>
  );
}
