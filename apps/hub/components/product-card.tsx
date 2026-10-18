import { accentClasses, type Product } from "@/lib/site";

type ProductCardProps = {
  product: Product;
  detailed?: boolean;
};

// A product tile in its own accent colour. Links to the product's subdomain.
export function ProductCard({ product, detailed = false }: ProductCardProps) {
  const accent = accentClasses[product.id];

  return (
    <article
      className={`grid content-start gap-4 rounded-lg border border-line bg-paper p-6 transition-colors duration-300 ${accent.border}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`size-9 rounded-md ${accent.bg}`} aria-hidden="true" />
        <span className={`rounded-sm px-2 py-1 font-mono text-xs ${accent.tint} ${accent.text}`}>In development</span>
      </div>
      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p className="text-ink-soft">{product.summary}</p>
      {detailed && (
        <ul className="grid gap-2 text-sm text-ink-soft">
          {product.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className={`mt-2 size-1.5 shrink-0 rounded-full ${accent.bg}`} aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      <a href={product.url} className={`text-sm font-semibold ${accent.text} hover:underline underline-offset-4`}>
        Visit {product.name} →
      </a>
    </article>
  );
}
