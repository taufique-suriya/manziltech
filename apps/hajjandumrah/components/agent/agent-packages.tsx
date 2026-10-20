"use client";

import { Copy, Pencil, Power, Trash2 } from "lucide-react";
import { useState } from "react";
import { buttonClasses } from "@manziltech/ui";
import type { PackageView, SignedInAgent } from "@/data/types";
import { Badge } from "@/components/fields";
import { Modal } from "@/components/modal";
import { PackageRow } from "@/components/package-row";
import { duplicatePackage, removePackage, setPackageStatus } from "@/lib/api";
import { displayStatus, type DisplayStatus } from "@/lib/packages";
import { todayIso } from "@/lib/format";
import { validate, fromPackage } from "@/lib/package-form";

type Filter = "all" | DisplayStatus;

const statusLabel: Record<DisplayStatus, string> = {
  draft: "Draft",
  active: "Active",
  inactive: "Inactive",
  expired: "Expired",
  removed: "Removed",
};

const small = buttonClasses("secondary", "px-3 py-1.5 text-xs");

type Props = {
  agent: SignedInAgent;
  packages: PackageView[];
  onChanged: () => void;
  onEdit: (pkg: PackageView) => void;
  onCreate: () => void;
};

export function AgentPackages({ agent, packages, onChanged, onEdit, onCreate }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [removing, setRemoving] = useState<PackageView | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const today = todayIso();

  const shown = packages.filter((p) => filter === "all" || displayStatus(p, today) === filter);
  const filters: Filter[] = ["all", "active", "draft", "inactive", "expired"];

  async function run(action: () => Promise<unknown>) {
    setMessage(null);
    try {
      await action();
      onChanged();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "That did not work. Try again.");
    }
  }

  // An inactive package is read-only: editing moves it back to draft first.
  async function edit(pkg: PackageView) {
    if (pkg.status === "inactive") {
      await run(() => setPackageStatus(agent.id, pkg.id, "draft"));
      onEdit({ ...pkg, status: "draft" });
    } else {
      onEdit(pkg);
    }
  }

  // Publishing a draft needs the mandatory fields; otherwise open it in the editor.
  async function publish(pkg: PackageView) {
    if (Object.keys(validate(fromPackage(pkg), true)).length > 0) {
      setMessage("This draft is missing required fields. Opening the editor.");
      onEdit(pkg);
      return;
    }
    await run(() => setPackageStatus(agent.id, pkg.id, "active"));
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter packages">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-sm border px-3 py-1.5 text-sm font-medium ${filter === f ? "border-accent bg-accent-tint text-accent-strong" : "border-line text-ink-soft hover:border-accent"}`}
          >
            {f === "all" ? "All" : statusLabel[f]}
          </button>
        ))}
      </div>

      {message && (
        <p role="status" className="text-sm font-medium text-ink-soft">
          {message}
        </p>
      )}

      {shown.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line p-10 text-center">
          <h3 className="text-lg font-semibold">{packages.length === 0 ? "Create your first package" : "No packages here"}</h3>
          <p className="mt-1 text-sm text-ink-soft">{packages.length === 0 ? "Choose a template and publish it for customers to see." : "Try another status."}</p>
          {packages.length === 0 && (
            <button type="button" onClick={onCreate} className={buttonClasses("primary", "mt-4")}>
              Create package
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {shown.map((pkg) => {
            const status = displayStatus(pkg, today);
            return (
              <PackageRow
                key={pkg.id}
                pkg={pkg}
                today={today}
                faded={pkg.status === "inactive"}
                statusBadge={<Badge tone={status === "active" ? "accent" : status === "draft" ? "warm" : "muted"}>{statusLabel[status]}</Badge>}
                actions={
                  <>
                    <button type="button" onClick={() => void edit(pkg)} className={small}>
                      <Pencil className="size-3.5" aria-hidden="true" />
                      {pkg.status === "inactive" ? "Edit as draft" : "Edit"}
                    </button>
                    <button type="button" onClick={() => void run(() => duplicatePackage(agent.id, pkg.id))} className={small}>
                      <Copy className="size-3.5" aria-hidden="true" /> Duplicate
                    </button>
                    {pkg.status === "draft" && (
                      <button type="button" onClick={() => void publish(pkg)} className={buttonClasses("primary", "px-3 py-1.5 text-xs")}>
                        <Power className="size-3.5" aria-hidden="true" /> Publish
                      </button>
                    )}
                    {pkg.status === "active" && (
                      <button type="button" onClick={() => void run(() => setPackageStatus(agent.id, pkg.id, "inactive"))} className={small}>
                        <Power className="size-3.5" aria-hidden="true" /> Make inactive
                      </button>
                    )}
                    {pkg.status === "inactive" && (
                      <button type="button" onClick={() => void run(() => setPackageStatus(agent.id, pkg.id, "active"))} className={buttonClasses("primary", "px-3 py-1.5 text-xs")}>
                        <Power className="size-3.5" aria-hidden="true" /> Make active
                      </button>
                    )}
                    <button type="button" onClick={() => setRemoving(pkg)} className={small}>
                      <Trash2 className="size-3.5" aria-hidden="true" /> Remove
                    </button>
                  </>
                }
              />
            );
          })}
        </div>
      )}

      {removing && (
        <Modal open onClose={() => setRemoving(null)} title="Remove package" description={removing.title}>
          <p className="text-sm text-ink-soft">The package disappears from your lists and from the public page. Leads keep a copy of its title. ManzilTech can restore it if needed.</p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setRemoving(null)} className={buttonClasses("secondary")}>
              Keep package
            </button>
            <button
              type="button"
              onClick={() => {
                const target = removing;
                setRemoving(null);
                void run(() => removePackage(agent.id, target.id));
              }}
              className={buttonClasses("primary")}
            >
              Remove
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
