import type { Metadata } from "next";
import { products } from "@/lib/site";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <h1>Products</h1>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--mt-space-md)" }}>
        {products.map((product) => (
          <li
            key={product.name}
            style={{
              padding: "var(--mt-space-md)",
              border: "1px solid var(--mt-color-border)",
              borderRadius: "var(--mt-radius-md)",
              background: "var(--mt-color-surface)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{product.name}</h2>
            <p>{product.summary}</p>
            <a href={product.url}>Visit {product.name}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
