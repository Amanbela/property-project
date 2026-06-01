"use client";

import { useEffect } from "react";
import { trackColonyView } from "@/lib/analytics";

export function ColonyViewTracker({ colonyName }: { colonyName: string }) {
  useEffect(() => {
    trackColonyView(colonyName);
  }, [colonyName]);
  return null;
}
