"use client";

import { ArrowLeft } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { Container, Section } from "@manziltech/ui";
import { AgentView } from "@/components/agent/agent-view";
import { CustomerListing } from "@/components/customer-listing";
import { useSession } from "@/lib/session";

// One landing page, two views: customers by default, the agent's own packages and leads after Agent login.
export function HomeSwitch({ hero, below }: { hero: ReactNode; below: ReactNode }) {
  const { agent, viewAsCustomer, setViewAsCustomer } = useSession();

  if (agent && !viewAsCustomer) return <AgentView agent={agent} />;

  return (
    <>
      {agent && (
        <div className="border-b border-line bg-accent-tint">
          <Container className="flex flex-wrap items-center justify-between gap-3 py-2 text-sm">
            <span className="text-accent-strong">You are previewing the public page as a customer would see it.</span>
            <button type="button" onClick={() => setViewAsCustomer(false)} className="inline-flex items-center gap-1 font-semibold text-accent-strong underline-offset-4 hover:underline">
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to agent view
            </button>
          </Container>
        </div>
      )}
      {hero}
      <Section>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-lg border border-line bg-mist" aria-hidden="true" />}>
          <CustomerListing />
        </Suspense>
      </Section>
      {below}
    </>
  );
}
