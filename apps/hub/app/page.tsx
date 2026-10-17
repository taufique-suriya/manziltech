import Link from "next/link";
import { brand } from "@/lib/site";

// Placeholder copy until the owner supplies the real content.
export default function HomePage() {
  return (
    <>
      <h1>{brand}</h1>
      <p>Travel and technology, under one roof. Content coming soon.</p>
      <p>
        <Link href="/products">See our products</Link>
      </p>
    </>
  );
}
