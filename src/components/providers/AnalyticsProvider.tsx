"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = (typeof window !== "undefined" ? (window as any) : null) as Record<string, any> | null;

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const gtag: (...args: unknown[]) => void = win?.gtag ?? (() => {});
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    gtag("config", gaId, {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
    if (!clarityId || !win) return;

    try {
      win.clarity = win.clarity ?? function (...args: unknown[]) {
        (win.q ?? []).push(args);
      };
      win.q = [];
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${clarityId}`;
      document.head.appendChild(script);
    } catch {
      // Clarity is best-effort
    }
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}
