"use client";

import { Eye, Plus } from "lucide-react";
import { useState } from "react";
import { buttonClasses, Container } from "@manziltech/ui";
import type { PackageView, SignedInAgent } from "@/data/types";
import { AgentPackages } from "@/components/agent/agent-packages";
import { LeadsPanel } from "@/components/agent/leads-panel";
import { PackageForm } from "@/components/agent/package-form";
import { todayIso } from "@/lib/format";
import { displayStatus } from "@/lib/packages";
import { useSession } from "@/lib/session";
import { useAgentData } from "@/lib/use-agent-data";

type Screen = { name: "list" } | { name: "form"; pkg?: PackageView };

function Stat({ label, value, tone }: { label: string; value: number; tone?: "warm" }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className={`text-2xl font-semibold tracking-tight ${tone === "warm" && value > 0 ? "text-hajjandumrah-warm" : ""}`}>{value}</p>
    </div>
  );
}

// What an agent sees on the landing page after Agent login (spec section 3.3).
export function AgentView({ agent }: { agent: SignedInAgent }) {
  const { setViewAsCustomer } = useSession();
  const { data, reload } = useAgentData(agent.id);
  const [tab, setTab] = useState<"packages" | "leads">("packages");
  const [screen, setScreen] = useState<Screen>({ name: "list" });
  const today = todayIso();

  const packages = data?.packages ?? [];
  const leads = data?.leads ?? [];
  const stats = {
    active: packages.filter((p) => displayStatus(p, today) === "active").length,
    drafts: packages.filter((p) => p.status === "draft").length,
    newLeads: leads.filter((l) => l.status === "new").length,
    due: leads.filter((l) => l.status !== "booked" && l.status !== "lost" && l.nextFollowUpAt !== undefined && l.nextFollowUpAt <= today).length,
  };

  const closeForm = () => {
    reload();
    setScreen({ name: "list" });
  };

  return (
    <section aria-label="Agent dashboard" className="py-10">
      <Container className="grid gap-6">
        {screen.name === "form" ? (
          <PackageForm agent={agent} existing={screen.pkg} onDone={closeForm} />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="grid gap-1">
                <p className="font-mono text-xs text-accent-strong">Agent</p>
                <h1 className="text-3xl font-bold tracking-tight">{agent.displayName}</h1>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setViewAsCustomer(true)} className={buttonClasses("secondary")}>
                  <Eye className="size-4" aria-hidden="true" /> View as customer
                </button>
                <button type="button" onClick={() => setScreen({ name: "form" })} className={buttonClasses("primary")}>
                  <Plus className="size-4" aria-hidden="true" /> Create package
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label="Active packages" value={stats.active} />
              <Stat label="Drafts" value={stats.drafts} />
              <Stat label="New leads" value={stats.newLeads} tone="warm" />
              <Stat label="Follow-ups due" value={stats.due} tone="warm" />
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
              <div className="grid gap-4">
                <div role="tablist" aria-label="Agent sections" className="flex gap-1 border-b border-line">
                  {(["packages", "leads"] as const).map((t) => (
                    <button
                      key={t}
                      role="tab"
                      type="button"
                      aria-selected={tab === t}
                      onClick={() => setTab(t)}
                      className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${tab === t ? "border-accent text-accent-strong" : "border-transparent text-ink-soft hover:text-ink"}`}
                    >
                      {t === "packages" ? "My packages" : `Leads (${leads.length})`}
                    </button>
                  ))}
                </div>
                {!data ? (
                  <div className="h-40 animate-pulse rounded-lg border border-line bg-mist" aria-hidden="true" />
                ) : tab === "packages" ? (
                  <AgentPackages
                    agent={agent}
                    packages={packages}
                    onChanged={reload}
                    onEdit={(pkg) => setScreen({ name: "form", pkg })}
                    onCreate={() => setScreen({ name: "form" })}
                  />
                ) : (
                  <LeadsPanel agent={agent} leads={leads} onChanged={reload} />
                )}
              </div>
              {/* Placeholder: contents decided later (spec Q-12). */}
              <aside aria-label="Help" className="grid content-start gap-2 rounded-lg border border-line bg-mist p-5 lg:sticky lg:top-24">
                <h2 className="text-base font-semibold">Need help?</h2>
                <p className="text-sm text-ink-soft">Questions about listing packages or handling leads? Contact ManzilTech.</p>
              </aside>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
