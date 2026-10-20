import type { Metadata } from "next";
import { ContactPage } from "@manziltech/ui";

export const metadata: Metadata = { title: "Contact | Studio | ManzilTech" };

export default function Page() {
  return (
    <ContactPage
      product="studio"
      intro="Tell us about the software, integration or automation you have in mind and we will get back to you."
    />
  );
}
