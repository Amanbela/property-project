type GtagFn = (command: "event", action: string, params?: Record<string, string | number | boolean | undefined>) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

const noop = () => {};

function getGtag(): GtagFn {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return noop;
  }
  return window.gtag;
}

// ─── Core helpers ─────────────────────────────────────────

function gaEvent(action: string, params?: Record<string, string | number | boolean | undefined>): void {
  getGtag()("event", action, params);
}

// ─── Public event helpers ─────────────────────────────────

export function trackLeadSubmit(sourcePage: string): void {
  gaEvent("lead_submit", { sourcePage });
}

export function trackRecommendationSubmit(budget: string, propertyType: string, city = "Indore"): void {
  gaEvent("recommendation_submit", { budget, propertyType, city });
}

export function trackAreaView(areaName: string): void {
  gaEvent("area_view", { areaName });
}

export function trackColonyView(colonyName: string): void {
  gaEvent("colony_view", { colonyName });
}

export function trackBlogView(blogSlug: string): void {
  gaEvent("blog_view", { blogSlug });
}

export function trackWhatsAppClick(page: string, area?: string): void {
  gaEvent("whatsapp_click", { page, ...(area ? { area } : {}) });
}

export function trackCallClick(page: string, area?: string): void {
  gaEvent("call_click", { page, ...(area ? { area } : {}) });
}
