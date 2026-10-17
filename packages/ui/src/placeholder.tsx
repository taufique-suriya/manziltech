import { tokens } from "@manziltech/design-tokens";

export type PlaceholderProps = {
  title: string;
};

// Placeholder component until the design system exists.
export function Placeholder({ title }: PlaceholderProps) {
  return (
    <main data-tokens={Object.keys(tokens).length}>
      <h1>{title}</h1>
    </main>
  );
}
