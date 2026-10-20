"use client";

import { useCallback, useEffect, useState } from "react";
import type { LeadView, PackageView } from "@/data/types";
import { listAgentPackages, listLeads } from "@/lib/api";

// An agent's own packages and leads. 'reload' refetches after a change.
export function useAgentData(agentId: string) {
  const [data, setData] = useState<{ packages: PackageView[]; leads: LeadView[] } | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    Promise.all([listAgentPackages(agentId), listLeads(agentId)]).then(([packages, leads]) => {
      if (live) setData({ packages, leads });
    });
    return () => {
      live = false;
    };
  }, [agentId, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, reload };
}
