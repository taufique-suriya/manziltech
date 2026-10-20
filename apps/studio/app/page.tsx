import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  Cloud,
  Code2,
  Globe,
  Plane,
  Plug,
  Smartphone,
  Workflow,
  Zap,
} from "lucide-react";
import { buttonClasses, Container, Eyebrow, Section } from "@manziltech/ui";
import { contactUrl } from "@/lib/site";

const services = [
  { icon: BrainCircuit, title: "AI-rich web apps", text: "Web applications with AI built in where it helps: search, recommendations, assistants and smart forms." },
  { icon: Smartphone, title: "Android and mobile apps", text: "Native-feeling mobile apps that share data and design with your website." },
  { icon: Globe, title: "Websites", text: "Fast, modern and fully responsive sites that look right on every screen size." },
  { icon: Plug, title: "Travel API integrations", text: "Connect flight, hotel, transfer and payment providers into one clean booking flow." },
  { icon: Workflow, title: "Digitalising operations", text: "Move spreadsheets, paper and phone calls into simple tools your team actually uses." },
  { icon: Code2, title: "Custom software", text: "Software shaped around how your business works, not the other way round." },
  { icon: Zap, title: "Process automation", text: "Automate repetitive work: confirmations, reminders, reports, data entry and hand-offs." },
  { icon: Cloud, title: "Cloud, hosting and support", text: "Set up, deploy and look after your applications once they are live." },
];

const travelWork = [
  "One booking flow across several flight, hotel and transfer providers",
  "Agent portals and B2B dashboards for packages, bookings and payments",
  "Package builders, itinerary tools and quotation generators",
  "Customer apps for trips, documents, payments and updates",
];

const beyondTravel = [
  "Internal tools and operations dashboards",
  "Customer portals and booking or ordering systems",
  "Integrations between the software you already use",
  "AI assistants trained on your own documents and processes",
];

const steps = [
  { title: "Discover", text: "We learn how your business runs and agree on the outcome, scope and budget." },
  { title: "Design", text: "Screens and flows you can click through before any code is written." },
  { title: "Build", text: "Short cycles with working software to review every week or two." },
  { title: "Launch and support", text: "We go live with you and keep the app secure, fast and up to date." },
];

const stack = ["Next.js", "React", "TypeScript", ".NET", "Android", "SQL Server", "Azure", "AI APIs"];

export default function StudioPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-night text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
        />
        <div aria-hidden="true" className="absolute -top-32 right-[-10rem] size-[34rem] rounded-full bg-accent/30 blur-3xl" />
        <Container className="relative grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent-tint">ManzilTech Studio</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Modern software for travel businesses, <span className="text-accent-tint">and beyond.</span>
            </h1>
            <p className="max-w-[58ch] text-lg text-night-text">
              We design and build AI-rich web and mobile apps with a modern look and feel and full responsiveness.
              Travel is our home ground, but not our limit.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={contactUrl} className={buttonClasses("primary")}>
                Start a project <ArrowRight className="size-4" />
              </a>
              <a href="#services" className={buttonClasses("secondary", "border-white/30 text-white hover:border-white hover:text-white")}>
                See our services
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/5 p-5 font-mono text-sm backdrop-blur-sm" aria-hidden="true">
            <div className="mb-4 flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/25" />
              <span className="size-2.5 rounded-full bg-white/25" />
              <span className="size-2.5 rounded-full bg-white/25" />
            </div>
            <div className="grid gap-2 text-night-text">
              {["flights", "hotels", "transfers", "payments"].map((name) => (
                <div key={name} className="flex items-center justify-between gap-4 rounded-sm bg-white/5 px-3 py-2">
                  <span>{name}.api</span>
                  <span className="text-accent-tint">connected</span>
                </div>
              ))}
              <div className="mt-2 flex items-center gap-2 text-white">
                <Boxes className="size-4 text-accent-tint" /> one booking flow for your customers
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section id="services">
        <div className="grid gap-10">
          <div className="grid max-w-2xl gap-3">
            <Eyebrow>Services</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">What we build</h2>
            <p className="text-ink-soft">From a single website to a full platform with apps, integrations and automation.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="grid content-start gap-3 rounded-lg border border-line p-5 transition-colors duration-300 hover:border-accent"
              >
                <span className="grid size-10 place-items-center rounded-md bg-accent-tint text-accent-strong">
                  <service.icon className="size-5" />
                </span>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-sm text-ink-soft">{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="travel" tone="mist">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="grid content-start gap-3">
            <Eyebrow>Travel tech</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Specialised in travel, not limited to it</h2>
            <p className="text-ink-soft">
              ManzilTech builds its own travel products, a Hajj and Umrah marketplace and a booking site, on the same
              stack we use for clients. We know the domain from the inside.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid content-start gap-4 rounded-lg border border-line bg-paper p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Plane className="size-5 text-accent" /> For travel businesses
              </h3>
              <ul className="grid gap-3 text-sm text-ink-soft">
                {travelWork.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid content-start gap-4 rounded-lg border border-line bg-paper p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Boxes className="size-5 text-accent" /> For any business
              </h3>
              <ul className="grid gap-3 text-sm text-ink-soft">
                {beyondTravel.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section id="process">
        <div className="grid gap-10">
          <div className="grid max-w-2xl gap-3">
            <Eyebrow>How we work</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From idea to launch, in clear steps</h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="grid content-start gap-2 border-t-2 border-accent pt-4">
                <span className="font-mono text-xs text-muted">Step {i + 1}</span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm text-muted">Built with</span>
            {stack.map((tech) => (
              <span key={tech} className="rounded-sm bg-accent-tint px-2.5 py-1 font-mono text-xs text-accent-strong">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <section id="contact" className="bg-night text-white">
        <Container className="flex flex-wrap items-center justify-between gap-6 py-16">
          <div className="grid max-w-xl gap-2">
            <h2 className="text-3xl font-semibold tracking-tight">Tell us what you want to build</h2>
            <p className="text-night-text">
              A new app, an integration or a process to automate: share the idea and we will come back with a plan.
            </p>
          </div>
          <a href={contactUrl} className={buttonClasses("primary")}>
            Contact us <ArrowRight className="size-4" />
          </a>
        </Container>
      </section>
    </>
  );
}
