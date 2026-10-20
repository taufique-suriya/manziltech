"use client";

import { useEffect, useState } from "react";
import type { PackageView } from "@/data/types";
import { listPublicPackages } from "@/lib/api";
import { todayIso } from "@/lib/format";
import { isPublic } from "@/lib/packages";

// Loads the packages customers may see. 'packages' is null while loading (the first render matches the static page).
export function usePublicPackages(): { packages: PackageView[] | null; today: string } {
  const [state, setState] = useState<{ packages: PackageView[] | null; today: string }>({ packages: null, today: "" });

  useEffect(() => {
    let live = true;
    listPublicPackages().then((all) => {
      if (!live) return;
      const today = todayIso();
      setState({ packages: all.filter((p) => isPublic(p, today)), today });
    });
    return () => {
      live = false;
    };
  }, []);

  return state;
}
