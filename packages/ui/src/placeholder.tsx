export type PlaceholderProps = {
  title: string;
};

// Placeholder page for apps that are not built yet.
export function Placeholder({ title }: PlaceholderProps) {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  );
}
