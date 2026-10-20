import type { Metadata } from "next";
import { ContactPage } from "@manziltech/ui";
import { accentClasses, products } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

const topics = [{ value: "general", label: "General" }, ...products.map((p) => ({ value: p.id, label: p.name }))];

export default function Page() {
  return (
    <ContactPage
      product="hub"
      intro="Questions about a trip, listing your packages as an agent, or a software project: choose what it is about and we will point you to the right team."
      topics={topics}
      productLinks={products.map((p) => ({
        name: p.name,
        summary: p.summary,
        href: `${p.url}/contact/`,
        textClass: accentClasses[p.id].text,
        borderClass: accentClasses[p.id].border,
      }))}
    />
  );
}
