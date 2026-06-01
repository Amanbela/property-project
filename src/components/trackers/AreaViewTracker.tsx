"use client";

import { useEffect } from "react";
import { trackAreaView } from "@/lib/analytics";

export function AreaViewTracker({ areaName }: { areaName: string }) {
  useEffect(() => {
    trackAreaView(areaName);
  }, [areaName]);
  return null;
}
