"use client";

import { useEffect, useRef } from "react";
import { initClientSession, getSessionId } from "@/lib/session";
import { trackEvent } from "@/actions/track";

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const session = initClientSession();

    const pageUrl = window.location.href;
    const referrer = document.referrer || "";

    trackEvent({
      sessionId: session.sessionId,
      eventType: "page_view",
      properties: { pageUrl, referrer },
      source: "website",
    });
  }, []);

  return <>{children}</>;
}

export function useTracking() {
  const track = async (
    eventType: string,
    properties?: Record<string, unknown>,
    source = "website"
  ) => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    await trackEvent({
      sessionId,
      eventType: eventType as Parameters<typeof trackEvent>[0]["eventType"],
      properties: properties as Record<string, string | number | undefined>,
      source: source as "website" | "whatsapp" | "referral" | "organic" | "direct",
    });
  };

  return { track };
}
