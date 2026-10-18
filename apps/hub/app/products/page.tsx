import type { Metadata } from "next";
import { Container, Eyebrow, Section } from "@manziltech/ui";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/site";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <section className="border-b border-line bg-mist">
        <Container className="grid gap-4 py-16">
          <Eyebrow>Products</Eyebrow>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our products</h1>
          <p className="max-w-[60ch] text-lg text-ink-soft">
            Each ManzilTech product runs on its own site, built for its own audience, on one shared platform.
          </p>
        </Container>
      </section>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} detailed />
          ))}
        </div>
      </Section>
    </>
  );
}
