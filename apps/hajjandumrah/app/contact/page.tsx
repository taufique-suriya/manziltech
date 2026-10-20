import type { Metadata } from "next";
import { ContactPage } from "@manziltech/ui";

export const metadata: Metadata = { title: "Contact | Hajj and Umrah | ManzilTech" };

export default function Page() {
  return (
    <ContactPage
      product="hajjandumrah"
      intro="Questions about a package, an enquiry you have sent, or listing your packages as a travel agent: write to us, call, or message us on WhatsApp."
    />
  );
}
